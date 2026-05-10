import { useParams, useNavigate } from 'react-router-dom'
import { AppLayout } from '../../shared/components/layout/AppLayout'
import { useJobOffer } from '../../features/jobOffers/hooks/useJobOffers'
import { useMyApplications, useApply } from '../../features/applications/hooks/useApplications'
import { useCandidate } from '../../features/candidates/hooks/useCandidate'
import { useState } from 'react'

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

const workModeLabels: Record<string, string> = {
    remote: 'Zdalnie',
    hybrid: 'Hybrydowo',
    onsite: 'Stacjonarnie',
}

export default function CandidateJobOfferDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const jobOfferId = parseInt(id!)
    const [applied, setApplied] = useState(false)

    const { data: jobOffer, isLoading } = useJobOffer(jobOfferId)
    const { data: myApplications } = useMyApplications()
    const { data: candidate } = useCandidate()
    const apply = useApply()

    const hasCV = !!candidate?.cvFilePath

    const hasApplied = applied || myApplications?.data.some(
        (a) => a.jobOffer?.id === jobOfferId
    )

    const handleApply = async () => {
        if (!hasCV) return
        await apply.mutateAsync(jobOfferId)
        setApplied(true)
    }

    if (isLoading) {
        return (
            <AppLayout navItems={navItems}>
                <div className="p-8 text-sm text-neutral-500 text-center py-12">Ładowanie...</div>
            </AppLayout>
        )
    }

    if (!jobOffer) return null

    return (
        <AppLayout navItems={navItems}>
            <div className="p-8 max-w-3xl mx-auto">

                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/candidate/job-offers')}
                        className="p-2 text-neutral-400 hover:text-neutral-50 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-neutral-50">{jobOffer.title}</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-neutral-500">{workModeLabels[jobOffer.workMode]}</span>
                            {jobOffer.location && (
                                <>
                                    <span className="text-neutral-700">·</span>
                                    <span className="text-xs text-neutral-500">{jobOffer.location}</span>
                                </>
                            )}
                            <span className="text-neutral-700">·</span>
                            <span className="text-xs text-neutral-500">min. {jobOffer.experienceMin} mies.</span>
                        </div>
                    </div>

                    <div className="flex-shrink-0">
                        {hasApplied ? (
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-xs px-4 py-2 rounded-xl bg-green-950 text-green-400 border border-green-900 font-medium">
                                  Aplikowano ✓
                                </span>
                                <span className="text-xs text-neutral-600">Już aplikowałeś na tę ofertę</span>
                            </div>
                        ) : (
                            <button
                                onClick={handleApply}
                                disabled={!hasCV || apply.isPending}
                                className="px-5 py-2.5 text-sm font-medium bg-neutral-50 text-neutral-900 rounded-xl hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                                {apply.isPending ? 'Wysyłanie...' : 'Aplikuj'}
                            </button>
                        )}
                    </div>
                </div>

                {!hasCV && (
                    <div className="mb-6 px-4 py-3 bg-amber-950 border border-amber-900 rounded-xl flex items-center gap-3">
                        <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                        <p className="text-sm text-amber-400">
                            Musisz wgrać CV żeby móc aplikować.{' '}
                            <a href="/candidate/profile" className="font-medium underline hover:no-underline">Uzupełnij profil →</a>
                        </p>
                    </div>
                )}

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-4">
                    <h3 className="text-sm font-medium text-neutral-50 mb-3">Opis stanowiska</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed whitespace-pre-wrap">{jobOffer.description}</p>
                </div>

                {jobOffer.requirements && jobOffer.requirements.length > 0 && (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                        <h3 className="text-sm font-medium text-neutral-50 mb-4">Wymagania</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Must have</p>
                                <div className="flex flex-wrap gap-2">
                                    {jobOffer.requirements
                                        .filter((r) => r.is_required)
                                        .map((req) => (
                                            <span
                                                key={req.skill}
                                                className="text-xs px-2.5 py-1 bg-neutral-800 text-neutral-300 rounded-lg border border-neutral-700"
                                            >
                                                {req.skill}
                                            </span>
                                        ))}
                                </div>
                            </div>
                            {jobOffer.requirements.some((r) => !r.is_required) && (
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Nice to have</p>
                                    <div className="flex flex-wrap gap-2">
                                        {jobOffer.requirements
                                            .filter((r) => !r.is_required)
                                            .map((req) => (
                                                <span
                                                    key={req.skill}
                                                    className="text-xs px-2.5 py-1 bg-neutral-900 text-neutral-500 rounded-lg border border-neutral-800"
                                                >
                                                  {req.skill}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </AppLayout>
    )
}