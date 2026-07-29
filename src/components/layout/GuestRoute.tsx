import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

/**
 * GuestRoute — the inverse of ProtectedRoute.
 * If the user is already authenticated, kick them back to the landing page
 * so they don't see the login / register screens again.
 */
export default function GuestRoute() {
    const token = useAuthStore((s) => s.token)

    if (token) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}
