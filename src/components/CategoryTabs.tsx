import type { Category } from '../types'

interface CategoryTabsProps {
  categories: Category[]
  selectedCategory: string
  onSelect: (categoryId: string) => void
}

export function CategoryTabs({
  categories,
  selectedCategory,
  onSelect,
}: CategoryTabsProps) {
  return (
    <div className="sticky top-16 z-20 border-b border-slate-200 bg-[#f8faf7]/95 py-3 backdrop-blur">
      <div className="content-wrap">
        <div className="flex gap-2 overflow-x-auto pb-1 sm:justify-center" role="tablist" aria-label="Categorias">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id

            return (
              <button
                key={category.id}
                type="button"
                className={`min-h-11 shrink-0 rounded-lg border px-4 text-sm font-bold transition ${
                  isSelected
                    ? 'border-brand-700 bg-brand-700 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-brand-100 hover:bg-brand-50'
                }`}
                onClick={() => onSelect(category.id)}
                role="tab"
                aria-selected={isSelected}
              >
                {category.name}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
