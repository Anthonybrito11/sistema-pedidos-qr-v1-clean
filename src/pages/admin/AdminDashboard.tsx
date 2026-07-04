import { useEffect, useState } from 'react'
import { getAdminCategories } from '../../services/categoriesService'
import { getAdminOrders } from '../../services/ordersService'
import { getAdminProducts } from '../../services/productsService'
import type { DbCategory, DbProduct, OrderWithItems } from '../../types/supabase'
import { formatCurrency } from '../../utils/currency'
import { getOrderStatusBadgeClass, getOrderStatusLabel } from '../../utils/orderStatus'

export function AdminDashboard() {
  const [products, setProducts] = useState<DbProduct[]>([])
  const [categories, setCategories] = useState<DbCategory[]>([])
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getAdminProducts(), getAdminCategories(), getAdminOrders()])
      .then(([nextProducts, nextCategories, nextOrders]) => {
        setProducts(nextProducts)
        setCategories(nextCategories)
        setOrders(nextOrders)
      })
      .catch((currentError: unknown) => {
        setError(currentError instanceof Error ? currentError.message : 'No se pudo cargar el dashboard.')
      })
      .finally(() => setLoading(false))
  }, [])

  const pendingOrders = orders.filter((order) => order.status === 'pending_whatsapp')

  if (loading) {
    return <p className="text-sm font-semibold text-slate-600">Cargando dashboard...</p>
  }

  if (error) {
    return <p className="rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-brand-700">Resumen</p>
        <h1 className="text-3xl font-black">Dashboard</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Stat label="Total de productos agregados" value={products.length} />
        <Stat label="Productos activos en el menu" value={products.filter((product) => product.is_active).length} />
        <Stat label="Productos no disponibles en el menu" value={products.filter((product) => !product.is_available).length} />
        <Stat label="Total de categorias agregadas" value={categories.length} />
        <Stat label="Total de pedidos pendientes" value={pendingOrders.length} />
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-xl font-black">Pedidos recientes</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {orders.slice(0, 6).map((order) => (
            <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
              <div>
                <p className="font-black">{order.order_code}</p>
                <p className="text-slate-500">{order.customer_name}</p>
              </div>
              <span className={getOrderStatusBadgeClass(order.status)}>
                {getOrderStatusLabel(order.status)}
              </span>
              <p className="font-black">{formatCurrency(Number(order.total))}</p>
            </div>
          ))}
          {orders.length === 0 ? <p className="py-5 text-sm text-slate-500">Todavia no hay pedidos.</p> : null}
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  )
}
