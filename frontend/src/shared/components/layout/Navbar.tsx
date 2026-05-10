import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../features/auth/hooks/useAuth'
import { Button } from '../ui/Button'

interface NavItem {
    label: string
    href: string
}

const recruiterNav: NavItem[] = [
    { label: 'Dashboard', href: '/recruiter' },
    { label: 'Oferty pracy', href: '/recruiter/job-offers' },
]

const candidateNav: NavItem[] = [
    { label: 'Dashboard', href: '/candidate' },
    { label: 'Oferty pracy', href: '/candidate/job-offers' },
    { label: 'Mój profil', href: '/candidate/profile' },
]

export function Navbar() {
    const { isRecruiter, user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const navItems = isRecruiter ? recruiterNav : candidateNav

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">

                <div className="flex items-center gap-8">
                    <Link
                        to={isRecruiter ? '/recruiter' : '/candidate'}
                        className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight"
                    >
                        Recruitment Tool
                    </Link>

                    <nav className="flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                                        isActive
                                            ? 'text-neutral-900 dark:text-neutral-50 bg-neutral-100 dark:bg-neutral-800 font-medium'
                                            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        {user?.email}
                    </span>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        Wyloguj
                    </Button>
                </div>

            </div>
        </header>
    )
}
