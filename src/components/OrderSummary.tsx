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
    <section className="surface-card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="section-kicker">Resumen</p>
          <h2 className="mt-1 text-xl font-black text-brand-900">Pedido final</h2>
        </div>
        <span className="rounded-lg bg-sunshine px-3 py-2 text-xs font-black text-brand-900">
          {getOrderTypeLabel(orderType)}
        </span>
      </div>

      <div className="mt-4 divide-y divide-brand-700/10">
        {items.map((item) => (
          <div key={item.productId} className="flex items-start justify-between gap-3 py-3">
            <div>
              <p className="font-black text-brand-900">{item.quantity}x {item.name}</p>
              <p className="text-sm font-medium text-brand-700/65">{formatCurrency(item.price)} c/u</p>
            </div>
            <p className="font-black text-brand-900">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2 border-t border-brand-700/10 pt-4 text-sm">
        <div className="flex justify-between gap-3">
          <span className="font-medium text-brand-700/75">Subtotal</span>
          <span className="font-black text-brand-900">{formatCurrency(subtotal)}</span>
        </div>
        {deliveryFee > 0 ? (
          <div className="flex justify-between gap-3">
            <span className="font-medium text-brand-700/75">Delivery</span>
            <span className="font-black text-brand-900">{formatCurrency(deliveryFee)}</span>
          </div>
        ) : null}
        <div className="flex justify-between gap-3 pt-2 text-base">
          <span className="font-black text-brand-900">Total</span>
          <span className="font-black text-tomato">{formatCurrency(total)}</span>
        </div>
      </div>
    </section>
  )
}
