import type { Product } from '../types'
import { EmptyState } from './EmptyState'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  getQuantity: (productId: string) => number
  onAddToCart: (product: Product) => void
  onChangeCategory: () => void
}

export function ProductGrid({
  products,
  getQuantity,
  onAddToCart,
  onChangeCategory,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="No hay productos en esta categoria"
        message="Prueba otra categoria del menu para ver opciones disponibles."
        action={
          <button type="button" className="secondary-button" onClick={onChangeCategory}>
            Cambiar categoria
          </button>
        }
      />
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          quantity={getQuantity(product.id)}
          onAdd={onAddToCart}
        />
      ))}
    </div>
  )
}
