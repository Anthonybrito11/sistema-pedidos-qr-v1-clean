import { Bike, PackageCheck, Utensils } from 'lucide-react'
import type { OrderType } from '../types'

interface OrderTypeSelectorProps {
  orderType: OrderType
  tableNumber: string
  onChange: (orderType: OrderType) => void
}

const options: Array<{
  id: OrderType
  title: string
  description: string
  icon: typeof Utensils
}> = [
  {
    id: 'table',
    title: 'Mesa',
    description: 'Pide desde el local y el negocio identifica tu mesa.',
    icon: Utensils,
  },
  {
    id: 'delivery',
    title: 'Delivery',
    description: 'Completa direccion y datos para entrega.',
    icon: Bike,
  },
  {
    id: 'pickup',
    title: 'Pickup',
    description: 'Ordena ahora y pasa a recoger.',
    icon: PackageCheck,
  },
]

export function OrderTypeSelector({
  orderType,
  tableNumber,
  onChange,
}: OrderTypeSelectorProps) {
  return (
    <section aria-labelledby="order-type-title">
      <div>
        <p className="section-kicker">Modalidad</p>
        <h2 id="order-type-title" className="mt-1 text-2xl font-black text-brand-900">
          Como quieres recibir tu pedido?
        </h2>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const Icon = option.icon
          const selected = option.id === orderType

          return (
            <button
              key={option.id}
              type="button"
              className={`min-h-32 rounded-lg border p-4 text-left transition duration-200 ${
                selected
                  ? 'border-mint bg-mint/10 shadow-card ring-4 ring-mint/15'
                  : 'border-brand-700/15 bg-paper hover:-translate-y-0.5 hover:border-brand-700/30 hover:bg-cream'
              }`}
              onClick={() => onChange(option.id)}
              aria-pressed={selected}
            >
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${
                  selected ? 'bg-brand-700 text-white' : 'bg-cream text-brand-700'
                }`}
              >
                <Icon size={20} aria-hidden="true" />
              </span>
              <span className="mt-3 block text-base font-black text-brand-900">
                {option.title}
              </span>
              <span className="mt-1 block text-sm font-medium leading-5 text-brand-700/75">
                {option.id === 'table' && tableNumber
                  ? `Mesa detectada: ${tableNumber}`
                  : option.description}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
