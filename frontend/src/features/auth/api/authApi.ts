import axios from 'axios'
import type { User } from '../../../shared/types/auth.types'

const authAxios = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

interface LoginPayload {
    email: string
    password: string
}

interface RegisterPayload {
    email: string
    password: string
    role: 'ROLE_CANDIDATE' | 'ROLE_RECRUITER'
}

interface AuthResponse {
    token: string
    user: User
}

function decodeUser(token: string): User {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
        email: payload.username,
        role: payload.roles.find((r: string) => r !== 'ROLE_USER') ?? 'ROLE_CANDIDATE',
    }
}

export const authApi = {
    login: async (payload: LoginPayload): Promise<AuthResponse> => {
        const response = await authAxios.post<{ token: string }>('/auth/login', payload)
        const token = response.data.token
        return { token, user: decodeUser(token) }
    },

    register: async (payload: RegisterPayload): Promise<AuthResponse> => {
        const response = await authAxios.post<{ token: string }>('/auth/register', payload)
        const token = response.data.token
        return { token, user: decodeUser(token) }
    },
}