import { useState } from 'react'
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
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const sidebarInner = (
        <>
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
                            onClick={() => setIsMobileOpen(false)}
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
        </>
    )

    return (
        <div className="min-h-screen flex bg-neutral-950">

            {/* Desktop sidebar */}
            <aside className="hidden md:flex w-60 flex-shrink-0 border-r border-neutral-800 flex-col">
                {sidebarInner}
            </aside>

            {/* Mobile sidebar overlay */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsMobileOpen(false)}
                    />
                    <aside className="relative z-50 w-64 h-full flex flex-col bg-neutral-950 border-r border-neutral-800">
                        {sidebarInner}
                    </aside>
                </div>
            )}

            <main className="flex-1 overflow-auto min-w-0">
                {/* Mobile top bar */}
                <div className="flex md:hidden items-center gap-3 px-4 h-12 border-b border-neutral-800 sticky top-0 bg-neutral-950 z-30">
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-50 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                    <span className="text-sm font-semibold text-neutral-50">Recruitment Tool</span>
                </div>
                {children}
            </main>

        </div>
    )
}
