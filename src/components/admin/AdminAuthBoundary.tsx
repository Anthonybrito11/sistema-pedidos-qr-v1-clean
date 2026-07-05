import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'

export function AdminAuthBoundary() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}
