import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ProtectedRoute } from './components/admin/ProtectedRoute.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { CartProvider } from './context/CartContext.tsx'

const adminRoutes = {
  Layout: lazy(() =>
    import('./components/admin/AdminLayout.tsx').then((module) => ({
      default: module.AdminLayout,
    })),
  ),
  Categories: lazy(() =>
    import('./pages/admin/AdminCategories.tsx').then((module) => ({
      default: module.AdminCategories,
    })),
  ),
  Dashboard: lazy(() =>
    import('./pages/admin/AdminDashboard.tsx').then((module) => ({
      default: module.AdminDashboard,
    })),
  ),
  Login: lazy(() =>
    import('./pages/admin/AdminLogin.tsx').then((module) => ({
      default: module.AdminLogin,
    })),
  ),
  Orders: lazy(() =>
    import('./pages/admin/AdminOrders.tsx').then((module) => ({
      default: module.AdminOrders,
    })),
  ),
  Reports: lazy(() =>
    import('./pages/admin/AdminReports.tsx').then((module) => ({
      default: module.AdminReports,
    })),
  ),
  Products: lazy(() =>
    import('./pages/admin/AdminProducts.tsx').then((module) => ({
      default: module.AdminProducts,
    })),
  ),
  Settings: lazy(() =>
    import('./pages/admin/AdminSettings.tsx').then((module) => ({
      default: module.AdminSettings,
    })),
  ),
}

const baseUrl = import.meta.env.BASE_URL
const routerBasename = baseUrl === './' ? '/' : baseUrl.replace(/\/$/, '')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={routerBasename}>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-sm font-semibold text-slate-600">
              Cargando...
            </div>
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                <CartProvider>
                  <App />
                </CartProvider>
              }
            />
            <Route path="/admin/login" element={<adminRoutes.Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<adminRoutes.Layout />}>
                <Route index element={<adminRoutes.Dashboard />} />
                <Route path="products" element={<adminRoutes.Products />} />
                <Route path="categories" element={<adminRoutes.Categories />} />
                <Route path="orders" element={<adminRoutes.Orders />} />
                <Route path="reports" element={<adminRoutes.Reports />} />
                <Route path="settings" element={<adminRoutes.Settings />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
