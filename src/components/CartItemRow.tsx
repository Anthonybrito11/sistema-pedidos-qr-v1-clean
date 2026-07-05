import { Trash2 } from 'lucide-react'
import type { CartItem } from '../types'
import { formatCurrency } from '../utils/currency'
import { fallbackImageSrc, handleImageFallback } from '../utils/images'
import { QuantityStepper } from './QuantityStepper'

interface CartItemRowProps {
  item: CartItem
  onUpdateQty: (quantity: number) => void
  onRemove: () => void
}

export function CartItemRow({ item, onUpdateQty, onRemove }: CartItemRowProps) {
  return (
    <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 border-b border-brand-700/10 py-4 last:border-b-0">
      <img
        src={item.image || fallbackImageSrc}
        alt={`Foto de ${item.name}`}
        className="h-[72px] w-[72px] aspect-square rounded-lg object-cover shadow-sm"
        loading="lazy"
        decoding="async"
        width="72"
        height="72"
        onError={handleImageFallback}
      />
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-black leading-5 text-brand-900">{item.name}</p>
            <p className="mt-1 text-sm font-bold text-brand-700/75">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
          <button
            type="button"
            className="icon-button h-10 w-10 shrink-0"
            onClick={onRemove}
            aria-label={`Eliminar ${item.name}`}
            title="Eliminar"
          >
            <Trash2 size={17} aria-hidden="true" />
          </button>
        </div>
        <div className="mt-3">
          <QuantityStepper
            value={item.quantity}
            onDecrease={() => onUpdateQty(item.quantity - 1)}
            onIncrease={() => onUpdateQty(item.quantity + 1)}
          />
        </div>
      </div>
    </div>
  )
}
