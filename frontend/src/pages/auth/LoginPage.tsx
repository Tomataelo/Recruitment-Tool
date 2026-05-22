import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../../features/auth/api/authApi'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { Button } from '../../shared/components/ui/Button'
import * as React from "react";

export default function LoginPage() {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        setError(null)
        setLoading(true)

        try {
            const data = await authApi.login({ email, password })
            login(data.token, data.user)

            if (data.user.role === 'ROLE_RECRUITER') {
                navigate('/recruiter')
            } else {
                navigate('/candidate')
            }
        } catch {
            setError('Nieprawidłowy email lub hasło.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-neutral-950 sm:items-center sm:justify-center">

            <div className="flex-1 sm:flex-none flex flex-col justify-center w-full sm:max-w-[460px] px-8 py-16 sm:px-14 sm:py-14 sm:rounded-2xl sm:border sm:border-neutral-800 sm:bg-neutral-900">

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight text-neutral-50">
                        Recruitment Tool
                    </h1>
                    <p className="mt-2 text-sm text-neutral-500">
                        Zaloguj się do swojego konta
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                    {error && (
                        <div className="px-4 py-3 text-sm text-red-400 bg-red-950 border border-red-900 rounded-xl">
                            {error}
                        </div>
                    )}

                    <div className="relative">
                        <svg
                            className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            className="w-full pl-12 pr-5 py-4 text-base border border-neutral-700 rounded-full bg-neutral-800 text-neutral-50 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-colors"
                        />
                    </div>

                    <div className="relative">
                        <svg
                            className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 8.25V6a3.75 3.75 0 1 0-7.5 0v2.25m-.75 0h9a2.25 2.25 0 0 1 2.25 2.25v7.5A2.25 2.25 0 0 1 16.5 20.25h-9a2.25 2.25 0 0 1-2.25-2.25v-7.5A2.25 2.25 0 0 1 6.75 8.25Z" />
                        </svg>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Hasło"
                            required
                            className="w-full pl-12 pr-5 py-4 text-base border border-neutral-700 rounded-full bg-neutral-800 text-neutral-50 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-colors"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        fullWidth
                        size="lg"
                        className="mt-2 rounded-full"
                        style={{ padding: '0.85rem' }}
                    >
                        {loading ? 'Logowanie...' : 'Zaloguj się'}
                    </Button>

                </form>

                <div className="mt-8 text-center space-y-2">
                    <p className="text-sm text-neutral-500">
                        Szukasz pracy?{' '}
                        <Link to="/register/candidate" className="text-neutral-50 font-medium hover:underline">
                            Zarejestruj się jako kandydat
                        </Link>
                    </p>
                    <p className="text-sm text-neutral-500">
                        Rekrutujesz?{' '}
                        <Link to="/register/recruiter" className="text-neutral-50 font-medium hover:underline">
                            Zarejestruj się jako rekruter
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    )
}
