export interface User {
    email: string
    role: 'ROLE_CANDIDATE' | 'ROLE_RECRUITER'
}

export interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
}