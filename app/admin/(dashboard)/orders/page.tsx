import { createClient } from '@/lib/supabase/server'
import { OrdersTableManager } from './_components/OrdersTableManager'

export const metadata = {
  title: 'Orders | Admin Dashboard',
}

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  // Fetch all orders with user profile info
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      profiles:user_id (
        full_name,
        email
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Orders</h1>
        <p className="text-sm text-ink/60 mt-1">Manage and track all store orders.</p>
      </div>

      <OrdersTableManager initialOrders={orders || []} />
    </div>
  )
}
