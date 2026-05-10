import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../features/auth/hooks/useAuth'

interface NavItem {
    label: string
    path: string
    icon: React.ReactNode
}

interface AppLayoutProps {
    children: React.ReactNode
    navItems: NavItem[]
}

export function AppLayout({ children, navItems }: AppLayoutProps) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen flex bg-neutral-950">

            <aside className="w-60 flex-shrink-0 border-r border-neutral-800 flex flex-col">

                <div className="px-6 py-5 border-b border-neutral-800">
                    <h1 className="text-sm font-semibold text-neutral-50 tracking-tight">
                        Recruitment Tool
                    </h1>
                    <p className="text-xs text-neutral-500 mt-0.5">{user?.email}</p>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                    isActive
                                        ? 'bg-neutral-800 text-neutral-50'
                                        : 'text-neutral-400 hover:text-neutral-50 hover:bg-neutral-800/50'
                                }`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="px-3 py-4 border-t border-neutral-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-neutral-400 hover:text-neutral-50 hover:bg-neutral-800/50 transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        Wyloguj się
                    </button>
                </div>

            </aside>

            <main className="flex-1 overflow-auto">
                {children}
            </main>

        </div>
    )
}