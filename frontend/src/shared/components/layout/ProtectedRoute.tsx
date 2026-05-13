import { Navigate } from 'react-router-dom'
import type { User } from '../../types/auth.types'

interface Props {
    children: React.ReactNode
    role: User['role']
}

function getStoredUser(): User | null {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
}

function getStoredToken(): string | null {
    return localStorage.getItem('token')
}

export default function ProtectedRoute({ children, role }: Props) {
    const token = getStoredToken()
    const user = getStoredUser()

    if (!token || !user) {
        return <Navigate to="/login" replace />
    }

    if (user.role !== role) {
        return <Navigate to={user.role === 'ROLE_RECRUITER' ? '/recruiter' : '/candidate'} replace />
    }

    return <>{children}</>
}