import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AppLayout } from '../../shared/components/layout/AppLayout'
import { Modal } from '../../shared/components/ui/Modal'
import { JobOfferForm } from '../../features/jobOffers/components/JobOfferForm'
import { useJobOfferApplications } from '../../features/applications/hooks/useApplications'
import { useJobOffer, useUpdateJobOffer } from '../../features/jobOffers/hooks/useJobOffers'
import { type Application, applicationsApi } from '../../features/applications/api/applicationsApi'
import { useCandidateProfile, useUpdateApplicationStatus } from '../../features/applications/hooks/useApplications'

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

const matchLevelConfig = {
    strong: {
        label: 'Strong Match',
        color: 'text-green-400',
        bg: 'bg-green-950',
        border: 'border-green-900',
        headerBg: 'bg-green-950/50',
        dot: 'bg-green-400',
    },
    partial: {
        label: 'Partial Match',
        color: 'text-amber-400',
        bg: 'bg-amber-950',
        border: 'border-amber-900',
        headerBg: 'bg-amber-950/50',
        dot: 'bg-amber-400',
    },
    no_match: {
        label: 'No Match',
        color: 'text-red-400',
        bg: 'bg-red-950',
        border: 'border-red-900',
        headerBg: 'bg-red-950/50',
        dot: 'bg-red-400',
    },
}

function CandidateCard({ application, onSelect }: { application: Application; onSelect: (id: number) => void }) {
    const effectiveMatchLevel = application.recruiterMatchOverride ?? application.matchLevel
    const config = effectiveMatchLevel ? matchLevelConfig[effectiveMatchLevel] : null
    const candidate = application.candidate

    return (
        <div
            onClick={() => onSelect(application.id)}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3 hover:border-neutral-700 transition-colors cursor-pointer"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-neutral-50">
                        {candidate?.fullName ?? 'Nieznany kandydat'}
                    </p>
                    {candidate?.experienceMonths && (
                        <p className="text-xs text-neutral-500 mt-0.5">
                            {Math.floor(candidate.experienceMonths / 12)} lat {candidate.experienceMonths % 12} mies. doświadczenia
                        </p>
                    )}
                </div>
                <div className="flex flex-col items-end gap-1">
                    {application.score !== null && (
                        <span className="text-sm font-semibold text-neutral-50">{application.score}%</span>
                    )}
                    {config && (
                        <span className={`text-xs px-2 py-0.5 rounded-md ${config.bg} ${config.color} border ${config.border}`}>
              {config.label}
            </span>
                    )}
                </div>
            </div>

            {candidate?.skills && candidate.skills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {candidate.skills.slice(0, 4).map((skill) => (
                        <span key={skill} className="text-xs px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded-md border border-neutral-700">
              {skill}
            </span>
                    ))}
                    {candidate.skills.length > 4 && (
                        <span className="text-xs px-2 py-0.5 text-neutral-600">+{candidate.skills.length - 4}</span>
                    )}
                </div>
            )}

            {application.scoreSummary && (
                <p className="text-xs text-neutral-500 line-clamp-2">{application.scoreSummary}</p>
            )}

            {application.recruiterMatchOverride && (
                <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                    </svg>
                    <span className="text-xs text-neutral-500">Zmienione przez rekrutera</span>
                </div>
            )}
        </div>
    )
}

function KanbanColumn({ level, applications, onSelect }: {
    level: 'strong' | 'partial' | 'no_match'
    applications: Application[]
    onSelect: (id: number) => void
}) {
    const config = matchLevelConfig[level]

    return (
        <div className="flex-1 min-w-0">
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-3 ${config.headerBg} border ${config.border}`}>
                <div className={`w-2 h-2 rounded-full ${config.dot}`} />
                <span className={`text-xs font-semibold uppercase tracking-wider ${config.color}`}>
          {config.label}
        </span>
                <span className="text-xs text-neutral-500 ml-auto">{applications.length}</span>
            </div>

            <div className="space-y-3">
                {applications.length === 0 ? (
                    <div className="border border-dashed border-neutral-800 rounded-xl p-6 text-center">
                        <p className="text-xs text-neutral-600">Brak kandydatów</p>
                    </div>
                ) : (
                    applications.map((app) => (
                        <CandidateCard key={app.id} application={app} onSelect={onSelect} />
                    ))
                )}
            </div>
        </div>
    )
}

export default function JobOfferDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const jobOfferId = parseInt(id!)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null)
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

    const { data: jobOffer, isLoading: isJobOfferLoading } = useJobOffer(jobOfferId)
    const { data, isLoading: isApplicationsLoading } = useJobOfferApplications(jobOfferId)
    const updateJobOffer = useUpdateJobOffer()
    const { data: candidateProfile, isLoading: isProfileLoading } = useCandidateProfile(selectedApplicationId)
    const updateStatus = useUpdateApplicationStatus()

    const applications = data?.data ?? []

    const strongMatch = applications.filter((a) => (a.recruiterMatchOverride ?? a.matchLevel) === 'strong')
    const partialMatch = applications.filter((a) => (a.recruiterMatchOverride ?? a.matchLevel) === 'partial')
    const noMatch = applications.filter((a) => (a.recruiterMatchOverride ?? a.matchLevel) === 'no_match')
    const pending = applications.filter((a) => !a.matchLevel && !a.recruiterMatchOverride)

    const handleUpdate = async (payload: Parameters<typeof updateJobOffer.mutateAsync>[0]['payload']) => {
        await updateJobOffer.mutateAsync({ id: jobOfferId, payload })
        setIsEditModalOpen(false)
    }

    const handleSelectApplication = async (id: number) => {
        setSelectedApplicationId(id)
        const app = applications.find((a) => a.id === id)
        setSelectedApplication(app ?? null)
        if (app?.status === 'ai_reviewed') {
            await updateStatus.mutateAsync({ id, status: 'reviewed' })
        }
    }

    return (
        <AppLayout navItems={navItems}>
            <div className="p-8">

                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/recruiter/job-offers')}
                            className="p-2 text-neutral-400 hover:text-neutral-50 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </button>
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-50">
                                {isJobOfferLoading ? '...' : jobOffer?.title}
                            </h2>
                            <p className="text-sm text-neutral-400 mt-0.5">
                                {applications.length} aplikacji łącznie
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-neutral-700 text-neutral-300 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                        </svg>
                        Edytuj ofertę
                    </button>
                </div>

                {pending.length > 0 && (
                    <div className="mb-6 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-neutral-400 animate-pulse" />
                        <p className="text-sm text-neutral-400">
                            <span className="text-neutral-50 font-medium">{pending.length}</span> aplikacji oczekuje na scoring AI
                        </p>
                    </div>
                )}

                {isApplicationsLoading ? (
                    <div className="text-sm text-neutral-500 text-center py-12">Ładowanie...</div>
                ) : (
                    <div className="flex gap-4">
                        <KanbanColumn level="strong" applications={strongMatch} onSelect={handleSelectApplication} />
                        <KanbanColumn level="partial" applications={partialMatch} onSelect={handleSelectApplication} />
                        <KanbanColumn level="no_match" applications={noMatch} onSelect={handleSelectApplication} />
                    </div>
                )}

            </div>

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edytuj ofertę pracy"
            >
                <JobOfferForm
                    onSubmit={handleUpdate}
                    isLoading={updateJobOffer.isPending}
                    initialData={jobOffer}
                />
            </Modal>

            <Modal
                isOpen={!!selectedApplicationId}
                onClose={() => {
                    setSelectedApplicationId(null)
                    setSelectedApplication(null)
                }}
                title="Profil kandydata"
            >
                {isProfileLoading ? (
                    <div className="text-sm text-neutral-500 text-center py-8">Ładowanie...</div>
                ) : candidateProfile ? (
                    <div className="space-y-4">

                        <div className="space-y-2">
                            <div className="flex items-center justify-between py-2 border-b border-neutral-800">
                                <span className="text-xs text-neutral-500 uppercase tracking-wider">Imię i nazwisko</span>
                                <span className="text-sm text-neutral-50">{candidateProfile.fullName}</span>
                            </div>
                            {candidateProfile.experienceMonths && (
                                <div className="flex items-center justify-between py-2 border-b border-neutral-800">
                                    <span className="text-xs text-neutral-500 uppercase tracking-wider">Doświadczenie</span>
                                    <span className="text-sm text-neutral-50">
                                        {Math.floor(candidateProfile.experienceMonths / 12)} lata {candidateProfile.experienceMonths % 12} mies.
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center justify-between py-2 border-b border-neutral-800">
                                <span className="text-xs text-neutral-500 uppercase tracking-wider">E-mail</span>
                                <span className="text-sm text-neutral-50">
                                  {candidateProfile.candidateUser?.email ?? '—'}
                                </span>
                            </div>
                        </div>

                        {candidateProfile.skills && candidateProfile.skills.length > 0 && (
                            <div>
                                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Umiejętności</p>
                                <div className="flex flex-wrap gap-2">
                                    {candidateProfile.skills.map((skill) => (
                                        <span key={skill} className="text-xs px-2.5 py-1 bg-neutral-800 text-neutral-300 rounded-lg border border-neutral-700">
                      {skill}
                    </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {candidateProfile.languages && candidateProfile.languages.length > 0 && (
                            <div>
                                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Języki</p>
                                <div className="flex flex-wrap gap-2">
                                    {candidateProfile.languages.map((lang) => (
                                        <span key={lang.language} className="text-xs px-2.5 py-1 bg-neutral-800 text-neutral-300 rounded-lg border border-neutral-700">
                      {lang.language} — {lang.level}
                    </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {candidateProfile.summary && (
                            <div>
                                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Podsumowanie z CV</p>
                                <p className="text-sm text-neutral-400 leading-relaxed">{candidateProfile.summary}</p>
                            </div>
                        )}

                        {selectedApplication?.scoreSummary && (
                            <div className="p-3 bg-neutral-800 rounded-xl border border-neutral-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs text-neutral-500 uppercase tracking-wider">Ocena AI</span>
                                    {selectedApplication.score !== null && (
                                        <span className="text-xs font-semibold text-neutral-50 ml-auto">
                      {selectedApplication.score}%
                    </span>
                                    )}
                                </div>
                                <p className="text-xs text-neutral-400 leading-relaxed">
                                    {selectedApplication.scoreSummary}
                                </p>
                            </div>
                        )}

                        <div className="pt-2 border-t border-neutral-800">
                            {selectedApplication?.status === 'accepted' ? (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center gap-2 py-3 bg-green-950 border border-green-900 rounded-xl">
                                        <span className="text-sm font-medium text-green-400">✓ Kandydat zaakceptowany</span>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            await updateStatus.mutateAsync({ id: selectedApplicationId!, status: 'reviewed' })
                                            setSelectedApplication(prev => prev ? { ...prev, status: 'reviewed' } : null)
                                        }}
                                        disabled={updateStatus.isPending}
                                        className="w-full py-2 text-xs text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
                                    >
                                        Cofnij decyzję
                                    </button>
                                </div>
                            ) : selectedApplication?.status === 'rejected' ? (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center gap-2 py-3 bg-red-950 border border-red-900 rounded-xl">
                                        <span className="text-sm font-medium text-red-400">✗ Kandydat odrzucony</span>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            await updateStatus.mutateAsync({ id: selectedApplicationId!, status: 'reviewed' })
                                            setSelectedApplication(prev => prev ? { ...prev, status: 'reviewed' } : null)
                                        }}
                                        disabled={updateStatus.isPending}
                                        className="w-full py-2 text-xs text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
                                    >
                                        Cofnij decyzję
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    {candidateProfile.cvFilePath && (
                                        <button
                                            onClick={() => applicationsApi.downloadCandidateCv(candidateProfile.id)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-neutral-700 text-neutral-300 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer justify-center"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                            </svg>
                                            Pobierz CV
                                        </button>
                                    )}
                                    <button
                                        onClick={async () => {
                                            await updateStatus.mutateAsync({ id: selectedApplicationId!, status: 'accepted' })
                                            setSelectedApplication(prev => prev ? { ...prev, status: 'accepted' } : null)
                                        }}
                                        disabled={updateStatus.isPending}
                                        className="flex-1 py-2 text-sm font-medium bg-green-600 text-white rounded-xl hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                    >
                                        ✓ Zaakceptuj
                                    </button>
                                    <button
                                        onClick={async () => {
                                            await updateStatus.mutateAsync({ id: selectedApplicationId!, status: 'rejected' })
                                            setSelectedApplication(prev => prev ? { ...prev, status: 'rejected' } : null)
                                        }}
                                        disabled={updateStatus.isPending}
                                        className="flex-1 py-2 text-sm font-medium bg-red-950 text-red-400 border border-red-900 rounded-xl hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                    >
                                        ✗ Odrzuć
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                ) : null}
            </Modal>

        </AppLayout>
    )
}