import { ShoppingBag } from 'lucide-react'
import { formatCurrency } from '../utils/currency'

interface FloatingCartButtonProps {
  cartCount: number
  subtotal: number
  onClick: () => void
}

export function FloatingCartButton({
  cartCount,
  subtotal,
  onClick,
}: FloatingCartButtonProps) {
  if (cartCount === 0) {
    return null
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-brand-700/10 bg-paper/95 p-3 shadow-soft backdrop-blur md:hidden">
      <button type="button" className="primary-button w-full" onClick={onClick}>
        <ShoppingBag size={18} aria-hidden="true" />
        Ver carrito
        <span className="rounded-full bg-white/18 px-2 py-1 text-xs">{cartCount}</span>
        <span className="ml-auto text-sm">{formatCurrency(subtotal)}</span>
      </button>
    </div>
  )
}
