import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { AppLayout } from '../../shared/components/layout/AppLayout'
import { useCandidate } from '../../features/candidates/hooks/useCandidate'
import { useMyApplications } from '../../features/applications/hooks/useApplications'
import { useJobOffers } from '../../features/jobOffers/hooks/useJobOffers'
import { Modal } from '../../shared/components/ui/Modal'

const navItems = [
    {
        label: 'Dashboard',
        path: '/candidate',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
        ),
    },
    {
        label: 'Mój profil',
        path: '/candidate/profile',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
        ),
    },
    {
        label: 'Oferty pracy',
        path: '/candidate/job-offers',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
        ),
    },
]

const statusConfig: Record<string, { label: string; color: string }> = {
    pending:     { label: 'Oczekuje na scoring', color: 'text-neutral-400' },
    ai_reviewed: { label: 'Nie przejrzano jeszcze', color: 'text-neutral-400' },
    reviewed:    { label: 'Przejrzano', color: 'text-blue-400' },
    accepted:    { label: 'Zaakceptowano ✓', color: 'text-green-400' },
    rejected:    { label: 'Odrzucono', color: 'text-red-400' },
}

export default function CandidateDashboardPage() {
    const { data: candidate, isLoading: isCandidateLoading } = useCandidate()
    const { data: myApplications, isLoading: isApplicationsLoading } = useMyApplications()
    const { data: jobOffers, isLoading: isJobOffersLoading } = useJobOffers(1, 1)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const isLoading = isCandidateLoading || isApplicationsLoading || isJobOffersLoading

    const hasProfile = !!candidate
    const hasCV = !!candidate?.cvFilePath
    const applicationsCount = myApplications?.data.length ?? 0
    const jobOffersCount = jobOffers?.meta.total ?? 0

    const navigate = useNavigate()

    return (
        <AppLayout navItems={navItems}>
            <div className="p-8">

                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-neutral-50">Dashboard</h2>
                    <p className="text-sm text-neutral-400 mt-1">Witaj z powrotem!</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">

                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Status profilu</p>
                        {isLoading ? (
                            <div className="h-5 w-24 bg-neutral-800 rounded animate-pulse" />
                        ) : !hasProfile ? (
                            <p className="text-sm font-medium text-amber-400">Brak profilu</p>
                        ) : !hasCV ? (
                            <p className="text-sm font-medium text-amber-400">Brak CV</p>
                        ) : (
                            <p className="text-sm font-medium text-green-400">Profil kompletny ✓</p>
                        )}
                    </div>

                    <div
                        onClick={() => !isLoading && applicationsCount > 0 && setIsModalOpen(true)}
                        className={`bg-neutral-900 border border-neutral-800 rounded-xl p-5 transition-colors ${
                            !isLoading && applicationsCount > 0 ? 'hover:border-neutral-700 cursor-pointer' : ''
                        }`}
                    >
                        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Moje aplikacje</p>
                        {isLoading ? (
                            <div className="h-8 w-8 bg-neutral-800 rounded animate-pulse" />
                        ) : (
                            <>
                                <p className="text-2xl font-semibold text-neutral-50">{applicationsCount}</p>
                                {applicationsCount > 0 && (
                                    <p className="text-xs text-neutral-600 mt-1">Kliknij żeby zobaczyć →</p>
                                )}
                            </>
                        )}
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 transition-colors hover:border-neutral-700 cursor-pointer" onClick={() => navigate(`/candidate/job-offers`)}>
                        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Dostępne oferty</p>
                        {isLoading ? (
                            <div className="h-8 w-8 bg-neutral-800 rounded animate-pulse" />
                        ) : (
                            <><p className="text-2xl font-semibold text-neutral-50">{jobOffersCount}</p><p
                                className="text-xs text-neutral-600 mt-1">Kliknij żeby zobaczyć →</p></>
                        )}
                    </div>

                </div>

                {!isLoading && (!hasProfile || !hasCV) && (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-neutral-50 mb-1">
                                {!hasProfile ? 'Stwórz swój profil' : 'Wgraj CV'}
                            </h3>
                            <p className="text-sm text-neutral-400">
                                {!hasProfile
                                    ? 'Utwórz profil kandydata żeby móc aplikować na oferty'
                                    : 'Dodaj CV żeby móc aplikować na oferty pracy'
                                }
                            </p>
                        </div>
                        <Link
                            to="/candidate/profile"
                            className="px-4 py-2 text-sm font-medium bg-neutral-50 text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors whitespace-nowrap cursor-pointer"
                        >
                            {!hasProfile ? 'Stwórz profil →' : 'Wgraj CV →'}
                        </Link>
                    </div>
                )}

            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Moje aplikacje"
            >
                <div className="space-y-2">
                    {myApplications?.data.map((app) => {
                        const status = statusConfig[app.status] ?? { label: app.status, color: 'text-neutral-400' }
                        return (
                            <div
                                key={app.id}
                                className="flex items-center justify-between px-4 py-3 bg-neutral-800 rounded-xl border border-neutral-700"
                            >
                                <div>
                                    <p className="text-sm font-medium text-neutral-50">
                                        {app.jobOffer?.title ?? '—'}
                                    </p>
                                    <p className="text-xs text-neutral-500 mt-0.5">
                                        {new Date(app.appliedAt).toLocaleDateString('pl-PL')}
                                    </p>
                                </div>
                                <span className={`text-xs font-medium ${status.color}`}>
                                  {status.label}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </Modal>

        </AppLayout>
    )
}