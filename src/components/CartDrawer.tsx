import { ShoppingBag, X } from 'lucide-react'
import type { CartItem } from '../types'
import { formatCurrency } from '../utils/currency'
import { CartItemRow } from './CartItemRow'
import { EmptyState } from './EmptyState'

interface CartDrawerProps {
  items: CartItem[]
  subtotal: number
  isOpen: boolean
  onClose: () => void
  onCheckout: () => void
  onUpdateQty: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

export function CartDrawer({
  items,
  subtotal,
  isOpen,
  onClose,
  onCheckout,
  onUpdateQty,
  onRemove,
}: CartDrawerProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Carrito">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/40"
        onClick={onClose}
        aria-label="Cerrar carrito"
      />

      <aside className="absolute inset-x-0 bottom-0 ml-auto flex max-h-[86vh] flex-col rounded-t-lg bg-white shadow-soft md:inset-y-0 md:right-0 md:h-full md:max-h-none md:w-[420px] md:rounded-l-lg md:rounded-tr-none">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div>
            <h2 className="text-xl font-black text-slate-950">Verificar pedido</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Cerrar carrito"
            title="Cerrar"
          >
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="py-6">
              <EmptyState
                title="Tu carrito esta vacio"
                message="Agrega productos del menu para comenzar tu pedido."
                action={
                  <button type="button" className="secondary-button" onClick={onClose}>
                    Volver al menu
                  </button>
                }
              />
            </div>
          ) : (
            items.map((item) => (
              <CartItemRow
                key={item.productId}
                item={item}
                onUpdateQty={(quantity) => onUpdateQty(item.productId, quantity)}
                onRemove={() => onRemove(item.productId)}
              />
            ))
          )}
        </div>

        <div className="border-t border-slate-200 p-4">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-600">Subtotal</span>
            <span className="text-lg font-black text-slate-950">
              {formatCurrency(subtotal)}
            </span>
          </div>
          <button
            type="button"
            className="primary-button w-full"
            onClick={onCheckout}
            disabled={items.length === 0}
            data-testid="checkout-cart"
          >
            <ShoppingBag size={18} aria-hidden="true" />
            Continuar
          </button>
        </div>
      </aside>
    </div>
  )
}
