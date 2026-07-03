import type { Category, MenuStatus, Product } from '../types'
import { CategoryTabs } from '../components/CategoryTabs'
import { EmptyState } from '../components/EmptyState'
import { ProductGrid } from '../components/ProductGrid'

interface MenuPageProps {
  categories: Category[]
  products: Product[]
  menuStatus: MenuStatus
  selectedCategory: string
  tableNumber: string
  onSelectCategory: (categoryId: string) => void
  onAddToCart: (product: Product) => void
  getQuantity: (productId: string) => number
}

export function MenuPage({
  categories,
  products,
  menuStatus,
  selectedCategory,
  tableNumber,
  onSelectCategory,
  onAddToCart,
  getQuantity,
}: MenuPageProps) {
  const selectedCategoryName =
    categories.find((category) => category.id === selectedCategory)?.name ?? 'Menu'
const filteredProducts = selectedCategory === 'all'
  ? products
  : products.filter((product) => product.category === selectedCategory)

  const firstCategory = categories[0]?.id ?? ''

  return (
    <>
      <section className="bg-white">
        <div className="content-wrap py-6 flex flex-col items-center text-center">
          {tableNumber ? (
            <p className="mb-4 inline-flex rounded-lg bg-brand-50 px-3 py-2 text-xs font-bold text-brand-700">
              Pedido desde mesa {tableNumber}
            </p>
          ) : null}
          
          {/* Logo Placeholder */}
          <div className="mb-4 flex h-52 w-52 items-center justify-center  text-slate-400 font-bold text-xs uppercase tracking-wider select-none" aria-hidden="true">
          <img src="/Images/LogoEjemploCuki.png" alt="logo cuki yun yun" />
          </div>

          <h1 className="text-2xl font-black text-slate-950">Tu antojo favorito comienza aquí ✨</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Explora nuestro menú, agrega tus favoritos y recibelo con facilidad.
          </p>
        </div>
      </section>

      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={onSelectCategory}
      />

      <main className="content-wrap pb-28 pt-5 md:pb-12">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-brand-700">Categoria</p>
            <h2 className="text-2xl font-black text-slate-950">{selectedCategoryName}</h2>
          </div>
          <p className="text-sm font-semibold text-slate-500">
            {filteredProducts.length} productos
          </p>
        </div>

        {menuStatus === 'loading' ? (
          <EmptyState
            title="Cargando menu"
            message="Estamos preparando los productos disponibles."
          />
        ) : null}

        {menuStatus === 'error' ? (
          <EmptyState
            title="No pudimos cargar el menu"
            message="Intenta recargar la pagina o consulta al personal."
          />
        ) : null}

        {menuStatus === 'ready' ? (
          <ProductGrid
            products={filteredProducts}
            getQuantity={getQuantity}
            onAddToCart={onAddToCart}
            onChangeCategory={() => onSelectCategory(firstCategory)}
          />
        ) : null}
      </main>
    </>
  )
}
