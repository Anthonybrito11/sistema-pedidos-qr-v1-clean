import { Download, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  deleteOldClosedOrders,
  getOrdersCutoffDate,
  getOrdersForCsv,
} from '../../services/ordersService'
import type { OrderWithItems } from '../../types/supabase'
import { formatCurrency } from '../../utils/currency'

const HISTORY_DAYS = 31

export function AdminReports() {
  const [exporting, setExporting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const cutoffDate = useMemo(() => getOrdersCutoffDate(HISTORY_DAYS), [])
  const cutoffLabel = cutoffDate.toLocaleDateString('es-DO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  async function handleExport() {
    setExporting(true)
    setMessage('')
    setError('')

    try {
      const orders = await getOrdersForCsv(HISTORY_DAYS)

      if (orders.length === 0) {
        setMessage('No hay pedidos de los ultimos 31 dias para exportar.')
        return
      }

      downloadCsv(orders)
      setMessage(`CSV generado con ${orders.length} pedidos.`)
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'No se pudo exportar el CSV.')
    } finally {
      setExporting(false)
    }
  }

  async function handleDeleteOldOrders() {
    const confirmed = window.confirm(
      `Esto eliminara pedidos completados o cancelados anteriores al ${cutoffLabel}. Los pedidos pendientes, confirmados o en preparacion no se borraran. Deseas continuar?`,
    )

    if (!confirmed) {
      return
    }

    setDeleting(true)
    setMessage('')
    setError('')

    try {
      const { deletedCount, matchedCount } = await deleteOldClosedOrders(HISTORY_DAYS)

      if (matchedCount === 0) {
        setMessage('No habia pedidos antiguos completados o cancelados para borrar.')
        return
      }

      if (deletedCount === 0) {
        setError(
          `Se encontraron ${matchedCount} pedidos elegibles, pero Supabase no permitio borrarlos. Revisa que tu usuario este en admin_users y que la policy DELETE use public.is_admin().`,
        )
        return
      }

      if (deletedCount < matchedCount) {
        setError(`Solo se eliminaron ${deletedCount} de ${matchedCount} pedidos elegibles.`)
        return
      }

      setMessage(`Se eliminaron ${deletedCount} pedidos antiguos.`)
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'No se pudo borrar el historial.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="max-w-4xl">
      <div className="mb-5">
        <p className="text-sm font-bold text-brand-700">Administracion</p>
        <h1 className="text-3xl font-black">Reportes</h1>
      </div>

      {message ? (
        <p className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-xl font-black">Exportar historial</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Descarga un CSV con los pedidos creados durante los ultimos 31 dias.
          </p>
          <button
            type="button"
            className="primary-button mt-5 w-full"
            onClick={() => void handleExport()}
            disabled={exporting || deleting}
          >
            <Download size={17} aria-hidden="true" />
            {exporting ? 'Exportando...' : 'Exportar ultimos 31 dias'}
          </button>
        </article>

        <article className="rounded-lg border border-red-200 bg-white p-4">
          <h2 className="text-xl font-black text-red-950">Borrar historial antiguo</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Elimina pedidos completados o cancelados anteriores al {cutoffLabel}. No elimina
            pedidos activos ni pedidos de los ultimos 31 dias.
          </p>
          <button
            type="button"
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => void handleDeleteOldOrders()}
            disabled={exporting || deleting}
          >
            <Trash2 size={17} aria-hidden="true" />
            {deleting ? 'Borrando...' : 'Borrar historial antiguo'}
          </button>
        </article>
      </div>
    </section>
  )
}

function downloadCsv(orders: OrderWithItems[]) {
  const csv = buildOrdersCsv(orders)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)

  link.href = url
  link.download = `pedidos-ultimos-31-dias-${date}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function buildOrdersCsv(orders: OrderWithItems[]) {
  const headers = [
    'codigo',
    'fecha',
    'estado',
    'tipo',
    'cliente',
    'telefono',
    'direccion',
    'pago',
    'subtotal',
    'delivery',
    'total',
    'productos',
  ]

  const rows = orders.map((order) => [
    order.order_code,
    new Date(order.created_at).toLocaleString('es-DO'),
    order.status,
    order.order_type,
    order.customer_name,
    order.customer_phone || '',
    order.customer_address || '',
    order.payment_method,
    formatCurrency(Number(order.subtotal)),
    formatCurrency(Number(order.delivery_cost)),
    formatCurrency(Number(order.total)),
    formatOrderItems(order),
  ])

  return [headers, ...rows].map((row) => row.map(escapeCsvValue).join(',')).join('\r\n')
}

function formatOrderItems(order: OrderWithItems) {
  return (order.order_items || [])
    .map((item) => `${item.quantity}x ${item.product_name} (${formatCurrency(Number(item.line_total))})`)
    .join(' | ')
}

function escapeCsvValue(value: string) {
  return `"${value.replace(/"/g, '""')}"`
}
