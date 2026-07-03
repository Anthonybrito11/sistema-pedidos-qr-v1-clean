import { RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getAdminOrders, updateOrderStatus } from '../../services/ordersService'
import type { OrderStatus, OrderWithItems } from '../../types/supabase'
import { formatCurrency } from '../../utils/currency'

const statuses: OrderStatus[] = [
  'pending_whatsapp',
  'confirmed',
  'preparing',
  'completed',
  'cancelled',
]

export function AdminOrders() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadOrders() {
    setLoading(true)
    setError('')
    try {
      setOrders(await getAdminOrders())
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'No se pudieron cargar pedidos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadOrders()
  }, [])

  async function changeStatus(orderId: string, status: OrderStatus) {
    await updateOrderStatus(orderId, status)
    await loadOrders()
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-brand-700">Ventas</p>
          <h1 className="text-3xl font-black">Pedidos</h1>
        </div>
        <button type="button" className="secondary-button" onClick={() => void loadOrders()}>
          <RefreshCw size={17} aria-hidden="true" />
          Actualizar
        </button>
      </div>
      {error ? <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <div className="grid gap-4">
        {loading ? <p className="text-sm text-slate-500">Cargando...</p> : null}
        {orders.map((order) => (
          <article key={order.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xl font-black">{order.order_code}</p>
                <p className="text-sm text-slate-500">{order.customer_name} · {order.order_type}</p>
                <p className="text-sm text-slate-500">{new Date(order.created_at).toLocaleString('es-DO')}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  className="field-input min-w-44"
                  value={order.status}
                  onChange={(event) => void changeStatus(order.id, event.target.value as OrderStatus)}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700">
                  WhatsApp {order.whatsapp_sent ? 'enviado' : 'pendiente'}
                </span>
              </div>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
              <div className="divide-y divide-slate-100 rounded-lg bg-slate-50 px-3">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3 py-3 text-sm">
                    <span>{item.quantity}x {item.product_name}</span>
                    <strong>{formatCurrency(Number(item.line_total))}</strong>
                  </div>
                ))}
              </div>
              <div className="text-sm leading-6">
                <p><strong>Telefono:</strong> {order.customer_phone || 'No indicado'}</p>
                <p><strong>Direccion:</strong> {order.customer_address || 'No aplica'}</p>
                <p><strong>Pago:</strong> {order.payment_method}</p>
                <p><strong>Total:</strong> {formatCurrency(Number(order.total))}</p>
              </div>
            </div>
          </article>
        ))}
        {!loading && orders.length === 0 ? <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">No hay pedidos.</p> : null}
      </div>
    </section>
  )
}
