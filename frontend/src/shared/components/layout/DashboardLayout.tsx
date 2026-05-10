import type { ReactNode } from 'react'
import { Navbar } from './Navbar'

interface DashboardLayoutProps {
    children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 pt-20 pb-12">
                {children}
            </main>
        </div>
    )
}
