import { Button } from "../../shared/components/ui/Button.tsx"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../features/auth/hooks/useAuth.ts"
import { useState } from "react"
import { authApi } from "../../features/auth/api/authApi.ts"

interface RegisterPageProps {
    role: 'ROLE_CANDIDATE' | 'ROLE_RECRUITER'
}

const roleLabel = {
    ROLE_CANDIDATE: 'kandydat',
    ROLE_RECRUITER: 'rekruter',
}

function InputWithIcon({ icon, ...props }: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="relative">
            <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)' }}
                 className="text-neutral-400 w-5 h-5 flex items-center justify-center">
                {icon}
            </div>
            <input
                style={{ paddingLeft: '3rem', paddingRight: '1.25rem', paddingTop: '1rem', paddingBottom: '1rem' }}
                className="w-full text-base border border-neutral-200 dark:border-neutral-700 rounded-full bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-300 dark:focus:ring-neutral-600 transition-colors"
                {...props}
            />
        </div>
    )
}

const UserIcon = () => (
    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
)

const LockIcon = () => (
    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 8.25V6a3.75 3.75 0 1 0-7.5 0v2.25m-.75 0h9a2.25 2.25 0 0 1 2.25 2.25v7.5A2.25 2.25 0 0 1 16.5 20.25h-9a2.25 2.25 0 0 1-2.25-2.25v-7.5A2.25 2.25 0 0 1 6.75 8.25Z" />
    </svg>
)

export default function RegisterPage({ role }: RegisterPageProps) {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const data = await authApi.register({ email, password, role })
            login(data.token, data.user)

            if (data.user.role === 'ROLE_RECRUITER') {
                navigate('/recruiter')
            } else {
                navigate('/candidate')
            }
        } catch {
            setError('Rejestracja nie powiodła się. Sprawdź dane i spróbuj ponownie.')
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
                        Rejestracja jako {roleLabel[role]}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ maxWidth: '320px', margin: '0 auto', width: '100%' }} className="flex flex-col gap-3">

                    {error && (
                        <div className="px-4 py-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-950 dark:border-red-900 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    <InputWithIcon
                        icon={<UserIcon />}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />

                    <InputWithIcon
                        icon={<LockIcon />}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Hasło"
                        required
                    />

                    <Button
                        type="submit"
                        disabled={loading}
                        fullWidth
                        size="lg"
                        className="mt-2 rounded-full"
                        style={{ padding: '0.7rem' }}
                    >
                        {loading ? 'Rejestrowanie...' : 'Zarejestruj się'}
                    </Button>

                </form>

                <div style={{ maxWidth: '320px', margin: '0 auto', width: '100%' }} className="text-center space-y-2">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Masz już konto?{' '}
                        <Link to="/login" className="text-neutral-900 dark:text-neutral-50 font-medium hover:underline">
                            Zaloguj się
                        </Link>
                    </p>
                    {role === 'ROLE_CANDIDATE' ? (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Rekrutujesz?{' '}
                            <Link to="/register/recruiter" className="text-neutral-900 dark:text-neutral-50 font-medium hover:underline">
                                Zarejestruj się jako rekruter
                            </Link>
                        </p>
                    ) : (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Szukasz pracy?{' '}
                            <Link to="/register/candidate" className="text-neutral-900 dark:text-neutral-50 font-medium hover:underline">
                                Zarejestruj się jako kandydat
                            </Link>
                        </p>
                    )}
                </div>

            </div>
        </div>
    )
}