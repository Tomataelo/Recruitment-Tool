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
        <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-950">

            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 w-[500px] min-h-[460px] px-16 py-16 flex flex-col gap-8 justify-center">

                <div className="text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                        Recruitment Tool
                    </h1>
                    <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                        Zaloguj się do swojego konta
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ maxWidth: '320px', margin: '0 auto', width: '100%' }} className="flex flex-col gap-3">

                    {error && (
                        <div className="px-4 py-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-950 dark:border-red-900 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    <div className="relative">
                        <svg
                            style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)' }}
                            className="w-5 h-5 text-neutral-400"
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
                            style={{ paddingLeft: '3rem', paddingRight: '1.25rem', paddingTop: '1rem', paddingBottom: '1rem' }}
                            className="w-full text-base border border-neutral-200 dark:border-neutral-700 rounded-full bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-300 dark:focus:ring-neutral-600 transition-colors"
                        />
                    </div>

                    <div className="relative">
                        <svg
                            style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)' }}
                            className="w-5 h-5 text-neutral-400"
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
                            style={{ paddingLeft: '3rem', paddingRight: '1.25rem', paddingTop: '1rem', paddingBottom: '1rem' }}
                            className="w-full text-base border border-neutral-200 dark:border-neutral-700 rounded-full bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-300 dark:focus:ring-neutral-600 transition-colors"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        fullWidth
                        size="lg"
                        className="mt-2 rounded-full"
                        style={{ padding: '0.7rem' }}
                    >
                        {loading ? 'Logowanie...' : 'Zaloguj się'}
                    </Button>

                </form>

                <div style={{ maxWidth: '320px', margin: '0 auto', width: '100%' }} className="text-center space-y-2">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Szukasz pracy?{' '}
                        <Link to="/register/candidate" className="text-neutral-900 dark:text-neutral-50 font-medium hover:underline">
                            Zarejestruj się jako kandydat
                        </Link>
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Rekrutujesz?{' '}
                        <Link to="/register/recruiter" className="text-neutral-900 dark:text-neutral-50 font-medium hover:underline">
                            Zarejestruj się jako rekruter
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    )
}