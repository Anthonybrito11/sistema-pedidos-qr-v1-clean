import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AdminLayout } from './components/admin/AdminLayout.tsx'
import { ProtectedRoute } from './components/admin/ProtectedRoute.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { CartProvider } from './context/CartContext.tsx'
import { AdminCategories } from './pages/admin/AdminCategories.tsx'
import { AdminDashboard } from './pages/admin/AdminDashboard.tsx'
import { AdminLogin } from './pages/admin/AdminLogin.tsx'
import { AdminOrders } from './pages/admin/AdminOrders.tsx'
import { AdminProducts } from './pages/admin/AdminProducts.tsx'
import { AdminSettings } from './pages/admin/AdminSettings.tsx'

const baseUrl = import.meta.env.BASE_URL
const routerBasename = baseUrl === './' ? '/' : baseUrl.replace(/\/$/, '')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={routerBasename}>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <CartProvider>
                <App />
              </CartProvider>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
