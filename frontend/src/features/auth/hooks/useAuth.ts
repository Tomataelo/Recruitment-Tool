import { useState } from 'react'
import type { User } from '../../../shared/types/auth.types'

export function useAuth() {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('user')
        return stored ? JSON.parse(stored) : null
    })

    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('token')
    })

    const login = (token: string, user: User) => {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        setToken(token)
        setUser(user)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
    }

    return {
        user,
        token,
        isAuthenticated: !!token,
        isRecruiter: user?.role === 'ROLE_RECRUITER',
        isCandidate: user?.role === 'ROLE_CANDIDATE',
        login,
        logout,
    }
}