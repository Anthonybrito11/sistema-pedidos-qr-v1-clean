import { Plus, ShoppingBag } from 'lucide-react'
import type { Product } from '../types'
import { formatCurrency } from '../utils/currency'

interface ProductCardProps {
  product: Product
  quantity: number
  onAdd: (product: Product) => void
}

export function ProductCard({ product, quantity, onAdd }: ProductCardProps) {
  return (
    <article
      className="grid grid-cols-[104px_minmax(0,1fr)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm sm:grid-cols-[140px_minmax(0,1fr)]"
      data-testid={`product-${product.id}`}
    >
      <div className="relative min-h-32 bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {!product.available ? (
          <span className="absolute left-2 top-2 rounded-lg bg-slate-950 px-2 py-1 text-xs font-bold text-white">
            Agotado
          </span>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-col gap-3 p-4">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold leading-5 text-slate-950">{product.name}</h3>
            {product.featured ? (
              <span className="shrink-0 rounded-lg bg-tomato/10 px-2 py-1 text-[11px] font-bold text-tomato">
                Popular
              </span>
            ) : null}
          </div>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">
            {product.description}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-base font-black text-slate-950">
              {formatCurrency(product.price)}
            </p>
            {quantity > 0 ? (
              <p className="text-xs font-semibold text-brand-700">{quantity} en carrito</p>
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
