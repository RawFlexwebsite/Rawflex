import crypto from 'crypto'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

function verifyWebhookSignature(body: string, signature: string | null) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret || !signature) return false

  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  const expectedBuffer = Buffer.from(expected)
  const actualBuffer = Buffer.from(signature)
  if (expectedBuffer.length !== actualBuffer.length) return false

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer)
}

async function decrementOrderStockOnce(supabase: any, orderId: string) {
  const { error } = await supabase.rpc('decrement_order_stock_once', {
    order_id_input: orderId,
  })

  if (error) throw new Error(error.message)
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('x-razorpay-signature')

  if (!verifyWebhookSignature(body, signature)) {
    return Response.json({ error: 'Invalid webhook signature' }, { status: 401 })
  }

  let event: any
  try {
    event = JSON.parse(body)
  } catch {
    return Response.json({ error: 'Invalid webhook payload' }, { status: 400 })
  }

  const payment = event?.payload?.payment?.entity
  const razorpayOrderId = payment?.order_id

  if (!razorpayOrderId) {
    return Response.json({ received: true })
  }

  const supabase = createAdminClient()
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, total_amount, payment_status, user_id')
    .eq('razorpay_order_id', razorpayOrderId)
    .single()

  if (orderError && orderError.code !== 'PGRST116') {
    return Response.json({ error: 'Failed to load order' }, { status: 500 })
  }

  if (!order) {
    return Response.json({ received: true })
  }

  if (event.event === 'payment.captured') {
    if (order.payment_status === 'paid') {
      return Response.json({ received: true })
    }

    const expectedAmount = Math.round(Number(order.total_amount) * 100)
    if (Number(payment.amount) !== expectedAmount || payment.currency !== 'INR') {
      return Response.json({ error: 'Payment amount mismatch' }, { status: 400 })
    }

    try {
      await decrementOrderStockOnce(supabase, order.id)
    } catch (error: any) {
      return Response.json({ error: error?.message || 'Failed to update stock' }, { status: 409 })
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        razorpay_payment_id: payment.id,
        paid_at: new Date().toISOString(),
      })
      .eq('id', order.id)
      .eq('payment_status', 'pending')

    if (updateError) {
      return Response.json({ error: 'Failed to mark payment as paid' }, { status: 500 })
    }

    const { error: cartError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', order.user_id)

    if (cartError) {
      return Response.json({ error: 'Failed to clear cart' }, { status: 500 })
    }

    revalidatePath('/cart')
    revalidatePath('/checkout')
    revalidatePath('/profile')
    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${order.id}`)
  }

  if (event.event === 'payment.failed') {
    const { error: updateError } = await supabase
      .from('orders')
      .update({ payment_status: 'failed' })
      .eq('id', order.id)
      .eq('payment_status', 'pending')

    if (updateError) {
      return Response.json({ error: 'Failed to mark payment as failed' }, { status: 500 })
    }

    revalidatePath('/profile')
    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${order.id}`)
  }

  return Response.json({ received: true })
}
