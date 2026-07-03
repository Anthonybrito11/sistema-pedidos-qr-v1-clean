import { MapPin, ShoppingCart } from 'lucide-react'

interface HeaderProps {
  businessName: string
  tagline: string
  tableNumber: string
  cartCount: number
  onCartOpen: () => void
  onHome: () => void
}

export function Header({
  businessName,
  tagline,
  tableNumber,
  cartCount,
  onCartOpen,
  onHome,
}: HeaderProps) {
  return (
    <header className=" sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="content-wrap flex min-h-16 items-center justify-between gap-3 py-3">
        <button
          type="button"
          className="min-w-0 text-left"
          onClick={onHome}
          aria-label="Volver al menu"
        >
          <h1 className='text-base font-bold text-slate-950'>{businessName}</h1>
          <p className='text-xs font-medium text-slate-500'>{tagline}</p>
        </button>

        <div className="flex items-center gap-2">
          {tableNumber ? (
            <span className="hidden min-h-9 items-center gap-1 rounded-lg bg-brand-50 px-3 text-xs font-bold text-brand-700 sm:inline-flex">
              <MapPin size={15} aria-hidden="true" />
              Mesa {tableNumber}
            </span>
          ) : null}

          <button
            type="button"
            className="icon-button relative"
            onClick={onCartOpen}
            aria-label="Abrir carrito"
            title="Abrir carrito"
            data-testid="open-cart"
          >
            <ShoppingCart size={20} aria-hidden="true" />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-tomato px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  )
}
