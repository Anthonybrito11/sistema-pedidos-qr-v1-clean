import { CheckCircle2, RotateCcw } from 'lucide-react'
import { EmptyState } from '../components/EmptyState'
import { OrderSummary } from '../components/OrderSummary'
import type { BusinessConfig, OrderPayload } from '../types'

interface ConfirmationPageProps {
  business: BusinessConfig
  lastOrder: OrderPayload | null
  onNewOrder: () => void
}

export function ConfirmationPage({
  business,
  lastOrder,
  onNewOrder,
}: ConfirmationPageProps) {
  if (!lastOrder) {
    return (
      <main className="content-wrap pb-12 pt-6">
        <EmptyState
          title="No hay pedido reciente"
          message="Vuelve al menu para crear una nueva orden."
          action={
            <button type="button" className="primary-button" onClick={onNewOrder}>
              Ver menu
            </button>
          }
        />
      </main>
    )
  }

  return (
    <main className="content-wrap grid gap-5 pb-12 pt-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <CheckCircle2 className="text-brand-700" size={42} aria-hidden="true" />
        <h1 className="mt-4 text-3xl font-black text-slate-950">Pedido enviado</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Tu mensaje se abrio en WhatsApp. {business.name} confirmara el pedido,
          disponibilidad y tiempo estimado por ese mismo chat.
        </p>
        <button type="button" className="primary-button mt-6" onClick={onNewOrder}>
          <RotateCcw size={17} aria-hidden="true" />
          Nuevo pedido
        </button>
      </section>

      <section className="lg:sticky lg:top-24 lg:self-start">
        <OrderSummary
          items={lastOrder.items}
          orderType={lastOrder.orderType}
          subtotal={lastOrder.subtotal}
          deliveryFee={lastOrder.deliveryFee}
          total={lastOrder.total}
        />
      </section>
      
    </main>
  )
}
