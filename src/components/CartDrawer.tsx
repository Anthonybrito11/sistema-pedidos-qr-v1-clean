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
        className="absolute inset-0 bg-brand-900/55 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Cerrar carrito"
      />

      <aside className="absolute inset-x-0 bottom-0 ml-auto flex max-h-[88vh] flex-col rounded-t-lg bg-paper shadow-soft md:inset-y-0 md:right-0 md:h-full md:max-h-none md:w-[440px] md:rounded-l-lg md:rounded-tr-none">
        <div className="flex items-center justify-between border-b border-brand-700/10 p-4">
          <div>
            <p className="section-kicker">Carrito</p>
            <h2 className="mt-1 text-xl font-black text-brand-900">Verificar pedido</h2>
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

        <div className="border-t border-brand-700/10 bg-cream/55 p-4">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="font-bold text-brand-700/75">Subtotal</span>
            <span className="text-lg font-black text-brand-900">
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
