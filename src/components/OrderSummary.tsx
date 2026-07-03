import type { CartItem, OrderType } from '../types'
import { formatCurrency } from '../utils/currency'
import { getOrderTypeLabel } from '../utils/order'

interface OrderSummaryProps {
  items: CartItem[]
  orderType: OrderType
  subtotal: number
  deliveryFee: number
  total: number
}

export function OrderSummary({
  items,
  orderType,
  subtotal,
  deliveryFee,
  total,
}: OrderSummaryProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-brand-700">Resumen</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">Pedido final</h2>
        </div>
        <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">
          {getOrderTypeLabel(orderType)}
        </span>
      </div>

      <div className="mt-4 divide-y divide-slate-100">
        {items.map((item) => (
          <div key={item.productId} className="flex items-start justify-between gap-3 py-3">
            <div>
              <p className="font-bold text-slate-950">{item.quantity}x {item.name}</p>
              <p className="text-sm text-slate-500">{formatCurrency(item.price)} c/u</p>
            </div>
            <p className="font-black text-slate-950">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
        <div className="flex justify-between gap-3">
          <span className="text-slate-600">Subtotal</span>
          <span className="font-bold text-slate-950">{formatCurrency(subtotal)}</span>
        </div>
        {deliveryFee > 0 ? (
          <div className="flex justify-between gap-3">
            <span className="text-slate-600">Delivery</span>
            <span className="font-bold text-slate-950">{formatCurrency(deliveryFee)}</span>
          </div>
        ) : null}
        <div className="flex justify-between gap-3 pt-2 text-base">
          <span className="font-black text-slate-950">Total</span>
          <span className="font-black text-slate-950">{formatCurrency(total)}</span>
        </div>
      </div>
    </section>
  )
}
