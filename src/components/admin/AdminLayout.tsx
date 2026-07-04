import {
  BarChart3,
  FolderTree,
  LogOut,
  Package,
  ReceiptText,
  Settings,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: BarChart3, end: true },
  { to: '/admin/products', label: 'Productos', icon: Package },
  { to: '/admin/categories', label: 'Categorias', icon: FolderTree },
  { to: '/admin/orders', label: 'Pedidos', icon: ReceiptText },
  { to: '/admin/settings', label: 'Config', icon: Settings },
]

export function AdminLayout() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-4 lg:block">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase text-brand-700">Panel admin</p>
          <h1 className="text-xl font-black">Menu QR</h1>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold transition ${
                    isActive
                      ? 'bg-brand-700 text-white'
                      : 'text-slate-700 hover:bg-brand-50 hover:text-brand-700'
                  }`
                }
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 lg:px-8">
            <div>
              <p className="text-sm font-black">Panel de producción</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <button type="button" className="secondary-button" onClick={() => void signOut()}>
              <LogOut size={17} aria-hidden="true" />
              Salir
            </button>
          </div>
          <nav className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-bold ${
                      isActive ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-700'
                    }`
                  }
                >
                  <Icon size={15} aria-hidden="true" />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
        </header>
        <main className="px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
