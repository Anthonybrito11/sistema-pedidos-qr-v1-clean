import { Plus, ShoppingBag } from 'lucide-react'
import type { Product } from '../types'
import { formatCurrency } from '../utils/currency'
import { fallbackImageSrc, handleImageFallback } from '../utils/images'

interface ProductCardProps {
  product: Product
  quantity: number
  onAdd: (product: Product) => void
  index?: number
}

export function ProductCard({ product, quantity, onAdd, index = 0 }: ProductCardProps) {
  const shouldPrioritizeImage = index < 2

  return (
    <article
      className="surface-card grid grid-cols-[118px_minmax(0,1fr)] overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-soft sm:grid-cols-[168px_minmax(0,1fr)]"
      data-testid={`product-${product.id}`}
      style={{ animation: `productIn 360ms ease both ${Math.min(index * 45, 240)}ms` }}
    >
      <div className="relative min-h-36 bg-cream sm:min-h-44">
        <img
          src={product.image || fallbackImageSrc}
          alt={`Foto de ${product.name}`}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
          loading={shouldPrioritizeImage ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={shouldPrioritizeImage ? 'high' : 'auto'}
          width="336"
          height="288"
          onError={handleImageFallback}
        />
        {!product.available ? (
          <span className="absolute left-2 top-2 rounded-lg bg-brand-900 px-2 py-1 text-xs font-black text-white shadow-sm">
            Agotado
          </span>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-col gap-3 p-4">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-black leading-5 text-brand-900">{product.name}</h3>
            {product.featured ? (
              <span className="shrink-0 rounded-lg bg-sunshine px-2 py-1 text-[11px] font-black text-brand-900">
                Popular
              </span>
            ) : null}
            {product.isDailySpecial ? (
              <span className="shrink-0 rounded-lg bg-mint px-2 py-1 text-[11px] font-black text-white">
                Hoy
              </span>
            ) : null}
          </div>
          <p className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-brand-700/75">
            {product.description}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-lg font-black text-brand-900">
              {formatCurrency(product.price)}
            </p>
            {quantity > 0 ? (
              <p className="text-xs font-black text-mint">{quantity} en carrito</p>
            ) : null}
          </div>

          <button
            type="button"
            className="primary-button px-3"
            onClick={() => onAdd(product)}
            disabled={!product.available}
            data-testid={`add-${product.id}`}
          >
            {quantity > 0 ? (
              <ShoppingBag size={17} aria-hidden="true" />
            ) : (
              <Plus size={17} aria-hidden="true" />
            )}
            <span>{quantity > 0 ? 'Otro' : 'Agregar'}</span>
          </button>
        </div>
      </div>
    </article>
  )
}
