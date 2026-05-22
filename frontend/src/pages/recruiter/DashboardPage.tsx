import { AppLayout } from '../../shared/components/layout/AppLayout'
import { useRecruiterStats, useRecentApplications } from '../../features/jobOffers/hooks/useRecruiterStats'
import { useNavigate } from 'react-router-dom'

const navItems = [
    {
        label: 'Dashboard',
        path: '/recruiter',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
        ),
    },
    {
        label: 'Oferty pracy',
        path: '/recruiter/job-offers',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
        ),
    },
]

const matchLevelLabels: Record<string, string> = {
    strong: 'Strong Match',
    partial: 'Partial Match',
    no_match: 'No Match',
}

const matchLevelColors: Record<string, string> = {
    strong: 'text-green-400',
    partial: 'text-amber-400',
    no_match: 'text-red-400',
}

const statusConfig: Record<string, { label: string; className: string }> = {
    pending:     { label: 'Oczekuje na AI',  className: 'bg-neutral-800 text-neutral-500 border-neutral-700' },
    ai_reviewed: { label: 'Do przejrzenia',  className: 'bg-amber-950 text-amber-400 border-amber-900' },
    reviewed:    { label: 'Przejrzana',      className: 'bg-neutral-800 text-neutral-400 border-neutral-700' },
    accepted:    { label: 'Zaakceptowana',   className: 'bg-green-950 text-green-400 border-green-900' },
    rejected:    { label: 'Odrzucona',       className: 'bg-red-950 text-red-400 border-red-900' },
}

const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins} min temu`
    if (diffHours < 24) return `${diffHours}h temu`
    return `${diffDays}d temu`
}

export default function RecruiterDashboardPage() {
    const { data: stats, isLoading } = useRecruiterStats()
    const { data: recentApplications } = useRecentApplications()
    const navigate = useNavigate()

    console.log(recentApplications);

    const statCards = [
        { label: 'Aktywne oferty', value: stats?.activeOffers },
        { label: 'Wszystkie aplikacje', value: stats?.totalApplications },
        { label: 'Do przejrzenia', value: stats?.pendingApplications },
        { label: 'Zaakceptowani', value: stats?.acceptedApplications },
    ]

    return (
        <AppLayout navItems={navItems}>
            <div className="p-4 md:p-8">

                <div className="mb-6 md:mb-8">
                    <h2 className="text-xl font-semibold text-neutral-50">Dashboard</h2>
                    <p className="text-sm text-neutral-400 mt-1">Przegląd aktywności rekrutacyjnej</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
                    {statCards.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-neutral-900 border border-neutral-800 rounded-xl p-5"
                        >
                            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">{stat.label}</p>
                            <p className="text-2xl font-semibold text-neutral-50">
                                {isLoading ? '...' : stat.value ?? 0}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl">
                    <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
                        <h3 className="text-sm font-medium text-neutral-50">Ostatnie aplikacje</h3>
                        <span className="text-xs text-neutral-500">
              {recentApplications?.length ?? 0} najnowszych
            </span>
                    </div>

                    {!recentApplications?.length ? (
                        <div className="p-6 text-center text-sm text-neutral-500">
                            Brak aplikacji do wyświetlenia
                        </div>
                    ) : (
                        <div className="divide-y divide-neutral-800">
                            {recentApplications.map((app) => (
                                <div
                                    key={app.id}
                                    onClick={() => app.jobOffer && navigate(`/recruiter/job-offers/${app.jobOffer.id}`)}
                                    className="px-4 sm:px-6 py-4 flex items-center justify-between gap-3 hover:bg-neutral-800/50 transition-colors cursor-pointer"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-neutral-50 truncate">
                                            {app.candidate?.fullName ?? '—'}
                                        </p>
                                        <p className="text-xs text-neutral-500 mt-0.5 truncate">
                                            {app.jobOffer?.title ?? '—'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                        {app.matchLevel && (
                                            <span className={`hidden sm:inline text-xs font-medium ${matchLevelColors[app.matchLevel]}`}>
                                                {matchLevelLabels[app.matchLevel]}
                                            </span>
                                        )}
                                        {app.status && statusConfig[app.status] && (
                                            <span className={`text-xs px-2 py-0.5 rounded-md border ${statusConfig[app.status].className}`}>
                                                {statusConfig[app.status].label}
                                            </span>
                                        )}
                                        <span className="hidden sm:block text-xs text-neutral-600">
                                            {formatRelativeTime(app.appliedAt)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    )
}