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
      <section className="relative overflow-hidden bg-brand-700 text-white">
        <div className="absolute inset-x-0 bottom-0 h-2 bg-[linear-gradient(90deg,#EA5749_0_25%,#2EB89D_25%_50%,#FBC017_50%_75%,#FBFBED_75%_100%)]" />
        <div className="content-wrap relative flex flex-col items-center px-5 pb-10 pt-8 text-center sm:pb-12">
          {tableNumber ? (
            <p className="mb-4 inline-flex rounded-lg bg-cream px-3 py-2 text-xs font-black text-brand-700 shadow-sm">
              Pedido desde mesa {tableNumber}
            </p>
          ) : null}

          <div className="mb-5 flex h-44 w-44 items-center justify-center rounded-full ring-8 ring-white/100 sm:h-52 sm:w-52" aria-hidden="true">
            <img
              src={`${import.meta.env.BASE_URL}Images/logoCuki2.png`}
              alt="logo cuki yun yun"
              className="h-full w-full object-contain"
            />
          </div>

          <p className="text-xs font-black uppercase tracking-[0.16em] text-sunshine">Menu digital</p>

        </div>
      </section>

      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={onSelectCategory}
      />

      <main className="content-wrap pb-28 pt-6 md:pb-14">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="section-kicker">Categoria</p>
            <h2 className="mt-1 text-2xl font-black text-brand-900 sm:text-3xl">{selectedCategoryName}</h2>
          </div>
          <p className="shrink-0 rounded-lg bg-paper px-3 py-2 text-xs font-black text-brand-700 shadow-sm">
            {filteredProducts.length} productos
          </p>
        </div>

        {menuStatus === 'loading' ? (
          <div className="grid gap-4 md:grid-cols-2" aria-label="Cargando menu">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="surface-card grid grid-cols-[118px_minmax(0,1fr)] overflow-hidden sm:grid-cols-[168px_minmax(0,1fr)]">
                <div className="skeleton-shimmer min-h-36 rounded-none" />
                <div className="space-y-3 p-4">
                  <div className="skeleton-shimmer h-5 w-3/4" />
                  <div className="skeleton-shimmer h-4 w-full" />
                  <div className="skeleton-shimmer h-4 w-2/3" />
                  <div className="flex items-center justify-between pt-3">
                    <div className="skeleton-shimmer h-6 w-20" />
                    <div className="skeleton-shimmer h-11 w-28" />
                  </div>
                </div>
              </div>
            ))}
          </div>
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
