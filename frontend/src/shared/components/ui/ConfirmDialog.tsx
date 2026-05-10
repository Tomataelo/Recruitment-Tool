interface ConfirmDialogProps {
    isOpen: boolean
    title: string
    description: string
    confirmLabel?: string
    onConfirm: () => void
    onCancel: () => void
    isLoading?: boolean
}

export function ConfirmDialog({
                                  isOpen,
                                  title,
                                  description,
                                  confirmLabel = 'Usuń',
                                  onConfirm,
                                  onCancel,
                                  isLoading = false,
                              }: ConfirmDialogProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ animation: 'fadeIn 0.15s ease' }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

            <div className="relative z-10 w-full max-w-sm mx-4 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6" style={{ animation: 'slideUp 0.2s ease' }}>

                <div className="w-10 h-10 rounded-full bg-red-950 border border-red-900 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>

                <h3 className="text-base font-semibold text-neutral-50 mb-1">{title}</h3>
                <p className="text-sm text-neutral-400 mb-6">{description}</p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 text-sm font-medium border border-neutral-700 text-neutral-300 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                        Anuluj
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 py-2.5 text-sm font-medium bg-red-600 text-white rounded-xl hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        {isLoading ? 'Usuwanie...' : confirmLabel}
                    </button>
                </div>

            </div>
        </div>
    )
}