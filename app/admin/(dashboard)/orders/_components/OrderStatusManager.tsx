'use client'

import { useState, useTransition } from 'react'
import { updateDeliveryTracking, updateOrderStatus, updatePaymentStatus } from '@/actions/admin/orders'
import { Check, Loader2 } from 'lucide-react'

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded']

export function OrderStatusManager({ 
  orderId, 
  initialOrderStatus, 
  initialPaymentStatus,
  initialTracking,
}: { 
  orderId: string
  initialOrderStatus: string
  initialPaymentStatus: string
  initialTracking?: {
    courier_name?: string | null
    tracking_number?: string | null
    tracking_url?: string | null
    shipment_notes?: string | null
  }
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [tracking, setTracking] = useState({
    courier_name: initialTracking?.courier_name || '',
    tracking_number: initialTracking?.tracking_number || '',
    tracking_url: initialTracking?.tracking_url || '',
    shipment_notes: initialTracking?.shipment_notes || '',
  })

  const handleStatusChange = (type: 'order' | 'payment', value: string) => {
    setError(null)
    setSuccess(false)
    
    startTransition(async () => {
      const result = type === 'order' 
        ? await updateOrderStatus(orderId, value)
        : await updatePaymentStatus(orderId, value)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 2000)
      }
    })
  }

  const handleTrackingSave = () => {
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      const result = await updateDeliveryTracking(orderId, tracking)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 2000)
      }
    })
  }

  return (
    <div className="bg-panel rounded-2xl shadow-sm border border-cream-line p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-ink">Manage Status</h3>
        {isPending && <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />}
        {success && !isPending && <Check className="w-5 h-5 text-green-500" />}
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-ink/80 mb-2">
          Order Status
        </label>
        <select
          disabled={isPending}
          defaultValue={initialOrderStatus}
          onChange={(e) => handleStatusChange('order', e.target.value)}
          className="w-full bg-cream-deep border border-cream-line rounded-xl px-4 py-2.5 text-sm font-medium text-ink/80 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all capitalize"
        >
          {ORDER_STATUSES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink/80 mb-2">
          Payment Status
        </label>
        <select
          disabled={isPending}
          defaultValue={initialPaymentStatus}
          onChange={(e) => handleStatusChange('payment', e.target.value)}
          className="w-full bg-cream-deep border border-cream-line rounded-xl px-4 py-2.5 text-sm font-medium text-ink/80 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all capitalize"
        >
          {PAYMENT_STATUSES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="border-t border-cream-line pt-5 space-y-4">
        <h4 className="text-sm font-bold text-ink uppercase tracking-wide">Delivery Tracking</h4>

        <div>
          <label className="block text-sm font-semibold text-ink/80 mb-2">
            Courier
          </label>
          <input
            disabled={isPending}
            value={tracking.courier_name}
            onChange={(event) => setTracking((prev) => ({ ...prev, courier_name: event.target.value }))}
            className="w-full bg-cream-deep border border-cream-line rounded-xl px-4 py-2.5 text-sm font-medium text-ink/80 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            placeholder="Delhivery, Blue Dart, Shiprocket..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink/80 mb-2">
            Tracking Number
          </label>
          <input
            disabled={isPending}
            value={tracking.tracking_number}
            onChange={(event) => setTracking((prev) => ({ ...prev, tracking_number: event.target.value }))}
            className="w-full bg-cream-deep border border-cream-line rounded-xl px-4 py-2.5 text-sm font-medium text-ink/80 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            placeholder="AWB / tracking id"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink/80 mb-2">
            Tracking URL
          </label>
          <input
            disabled={isPending}
            value={tracking.tracking_url}
            onChange={(event) => setTracking((prev) => ({ ...prev, tracking_url: event.target.value }))}
            className="w-full bg-cream-deep border border-cream-line rounded-xl px-4 py-2.5 text-sm font-medium text-ink/80 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink/80 mb-2">
            Shipment Notes
          </label>
          <textarea
            disabled={isPending}
            value={tracking.shipment_notes}
            onChange={(event) => setTracking((prev) => ({ ...prev, shipment_notes: event.target.value }))}
            className="min-h-24 w-full bg-cream-deep border border-cream-line rounded-xl px-4 py-2.5 text-sm font-medium text-ink/80 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            placeholder="Packed, handed to courier, delivery exception..."
          />
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={handleTrackingSave}
          className="w-full rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-cream transition-colors hover:bg-orange-600 disabled:opacity-50"
        >
          Save Tracking
        </button>
      </div>
    </div>
  )
}
