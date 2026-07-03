import { Minus, Plus } from 'lucide-react'

interface QuantityStepperProps {
  value: number
  onIncrease: () => void
  onDecrease: () => void
}

export function QuantityStepper({
  value,
  onIncrease,
  onDecrease,
}: QuantityStepperProps) {
  return (
    <div className="inline-flex h-11 items-center rounded-lg border border-brand-700/15 bg-paper shadow-sm">
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center text-brand-700 transition hover:bg-cream hover:text-tomato"
        onClick={onDecrease}
        aria-label="Reducir cantidad"
      >
        <Minus size={16} aria-hidden="true" />
      </button>
      <span className="min-w-8 text-center text-sm font-black text-brand-900">{value}</span>
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center text-brand-700 transition hover:bg-cream hover:text-mint"
        onClick={onIncrease}
        aria-label="Aumentar cantidad"
      >
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  )
}
