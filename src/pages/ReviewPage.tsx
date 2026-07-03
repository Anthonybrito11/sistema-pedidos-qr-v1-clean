import { ArrowLeft, Clipboard, MessageCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { OrderSummary } from '../components/OrderSummary'
import { WhatsAppButton } from '../components/WhatsAppButton'
import type { BusinessConfig, OrderPayload } from '../types'
import { getOrderTypeLabel, getPaymentMethodLabel } from '../utils/order'
import { buildWhatsAppMessage, buildWhatsAppUrl } from '../utils/whatsapp'

interface ReviewPageProps {
  business: BusinessConfig
  order: OrderPayload
  onBack: () => void
  onEditCart: () => void
  onSent: () => Promise<OrderPayload>
  isSubmitting: boolean
  submitError: string
}

export function ReviewPage({
  business,
  order,
  onBack,
  onEditCart,
  onSent,
  isSubmitting,
  submitError,
}: ReviewPageProps) {
  const [copied, setCopied] = useState(false)
  const [previewOrder, setPreviewOrder] = useState(order)
  const message = useMemo(() => buildWhatsAppMessage(previewOrder, business), [business, previewOrder])

  async function handleCopy() {
    await navigator.clipboard.writeText(message)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  async function handleFinish() {
    const popup = window.open('about:blank', '_blank', 'noopener,noreferrer')
    const finalOrder = await onSent()
    setPreviewOrder(finalOrder)
    const whatsappUrl = buildWhatsAppUrl(finalOrder, business)

    if (popup) {
      popup.location.href = whatsappUrl
      return
    }

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="content-wrap grid gap-5 pb-12 pt-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-5">
        <button type="button" className="secondary-button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          Editar datos
        </button>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-brand-700">Revision final</p>
          <h1 className="mt-1 text-2xl font-black text-slate-950">
            Confirma antes de abrir WhatsApp
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            El pedido se enviara como un mensaje estructurado. El negocio debe
            confirmar disponibilidad y tiempo de entrega por WhatsApp.
          </p>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-xl font-black text-slate-950">Datos del pedido</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <InfoRow label="Modalidad" value={getOrderTypeLabel(order.orderType)} />
            {order.orderType === 'table' ? (
              <InfoRow label="Mesa" value={order.tableNumber} />
            ) : null}
            {order.orderType !== 'table' ? (
              <>
                <InfoRow label="Nombre" value={order.customerInfo.name} />
                <InfoRow
                  label="Telefono"
                  value={order.customerInfo.phone || 'No indicado'}
                />
                <InfoRow
                  label="Pago"
                  value={getPaymentMethodLabel(order.customerInfo.paymentMethod)}
                />
              </>
            ) : null}
            {order.orderType === 'delivery' ? (
              <>
                <InfoRow label="Direccion" value={order.customerInfo.address} />
                {order.customerInfo.reference ? (
                  <InfoRow label="Referencia" value={order.customerInfo.reference} />
                ) : null}
                {order.location ? (
                  <InfoRow label="Ubicacion" value={order.location.mapsUrl} />
                ) : null}
              </>
            ) : null}
          </dl>
        </section>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <OrderSummary
          items={order.items}
          orderType={order.orderType}
          subtotal={order.subtotal}
          deliveryFee={order.deliveryFee}
          total={order.total}
        />

        <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
          <WhatsAppButton
            disabled={order.items.length === 0}
            loading={isSubmitting}
            onClick={() => void handleFinish()}
          />
          {submitError ? (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
              {submitError}
            </p>
          ) : null}
          <button type="button" className="secondary-button w-full" onClick={handleCopy}>
            <Clipboard size={17} aria-hidden="true" />
            {copied ? 'Resumen copiado' : 'Copiar resumen'}
          </button>
          <button type="button" className="secondary-button w-full" onClick={onEditCart}>
            <MessageCircle size={17} aria-hidden="true" />
            Editar carrito
          </button>
          <p className="text-center text-xs leading-5 text-slate-500">
            Si WhatsApp no abre, usa el resumen copiado y escribe al {business.whatsappNumber}.
          </p>
        </div>
      </aside>
    </main>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-lg bg-slate-50 p-3 sm:grid-cols-[120px_minmax(0,1fr)]">
      <dt className="font-bold text-slate-600">{label}</dt>
      <dd className="break-words text-slate-950">{value}</dd>
    </div>
  )
}
