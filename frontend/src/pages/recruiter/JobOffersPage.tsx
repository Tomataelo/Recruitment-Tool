import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../../shared/components/layout/AppLayout'
import { Modal } from '../../shared/components/ui/Modal'
import { ConfirmDialog } from '../../shared/components/ui/ConfirmDialog'
import { JobOfferForm } from '../../features/jobOffers/components/JobOfferForm'
import { useJobOffers, useCreateJobOffer, useDeleteJobOffer } from '../../features/jobOffers/hooks/useJobOffers'
import { Button } from '../../shared/components/ui/Button'
import type { JobOffer } from '../../features/jobOffers/api/jobOffersApi'

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

const workModeLabels: Record<string, string> = {
    remote: 'Zdalnie',
    hybrid: 'Hybrydowo',
    onsite: 'Stacjonarnie',
}

export default function JobOffersPage() {
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [offerToDelete, setOfferToDelete] = useState<JobOffer | null>(null)
    const [page, setPage] = useState(1)

    const { data, isLoading } = useJobOffers(page)
    const createJobOffer = useCreateJobOffer()
    const deleteJobOffer = useDeleteJobOffer()

    const handleCreate = async (payload: Parameters<typeof createJobOffer.mutateAsync>[0]) => {
        await createJobOffer.mutateAsync(payload)
        setIsModalOpen(false)
    }

    const handleDeleteConfirm = async () => {
        if (!offerToDelete) return
        await deleteJobOffer.mutateAsync(offerToDelete.id)
        setOfferToDelete(null)
    }

    return (
        <AppLayout navItems={navItems}>
            <div className="p-8">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-semibold text-neutral-50">Oferty pracy</h2>
                        <p className="text-sm text-neutral-400 mt-1">
                            {data?.meta.total ?? 0} ofert łącznie
                        </p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} size="md">
                        + Nowa oferta
                    </Button>
                </div>

                {isLoading ? (
                    <div className="text-sm text-neutral-500 text-center py-12">Ładowanie...</div>
                ) : data?.data.length === 0 ? (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-12 text-center">
                        <p className="text-sm text-neutral-500">Brak ofert pracy</p>
                        <p className="text-xs text-neutral-600 mt-1">Kliknij "+ Nowa oferta" żeby dodać pierwszą</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {data?.data.map((offer) => (
                            <div
                                key={offer.id}
                                onClick={() => navigate(`/recruiter/job-offers/${offer.id}`)}
                                className="bg-neutral-900 border border-neutral-800 rounded-xl px-6 py-4 flex items-center justify-between hover:border-neutral-700 transition-colors cursor-pointer"
                            >
                                <div>
                                    <h3 className="text-sm font-medium text-neutral-50">{offer.title}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-neutral-500">
                                          {workModeLabels[offer.workMode]}
                                        </span>
                                        {offer.location && (
                                            <>
                                                <span className="text-neutral-700">·</span>
                                                <span className="text-xs text-neutral-500">{offer.location}</span>
                                            </>
                                        )}
                                        <span className="text-neutral-700">·</span>
                                        <span className="text-xs text-neutral-500">
                                          min. {offer.experienceMin} mies.
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                                      offer.status === 'active'
                                          ? 'bg-green-950 text-green-400 border border-green-900'
                                          : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                                  }`}>
                                    {offer.status === 'active' ? 'Aktywna' : 'Zamknięta'}
                                  </span>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setOfferToDelete(offer)
                                        }}
                                        className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-950 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {data && data.meta.pages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1.5 text-sm text-neutral-400 hover:text-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            ← Poprzednia
                        </button>
                        <span className="text-xs text-neutral-500">
                          {page} / {data.meta.pages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(data.meta.pages, p + 1))}
                            disabled={page === data.meta.pages}
                            className="px-3 py-1.5 text-sm text-neutral-400 hover:text-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            Następna →
                        </button>
                    </div>
                )}

            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nowa oferta pracy"
                size="lg"
            >
                <JobOfferForm
                    onSubmit={handleCreate}
                    isLoading={createJobOffer.isPending}
                />
            </Modal>

            <ConfirmDialog
                isOpen={!!offerToDelete}
                title="Usuń ofertę pracy"
                description={`Czy na pewno chcesz usunąć "${offerToDelete?.title}"? Tej operacji nie można cofnąć.`}
                confirmLabel="Usuń ofertę"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setOfferToDelete(null)}
                isLoading={deleteJobOffer.isPending}
            />

        </AppLayout>
    )
}