import { useState, useRef } from 'react'
import { AppLayout } from '../../shared/components/layout/AppLayout'
import { useCandidate, useCreateCandidate, useUploadCv } from '../../features/candidates/hooks/useCandidate'
import { Button } from '../../shared/components/ui/Button'

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

const inputClass = "w-full px-3 py-2.5 text-sm border border-neutral-700 rounded-lg bg-neutral-800 text-neutral-50 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-colors"
const labelClass = "block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1.5"

export default function CandidateProfilePage() {
    const { data: candidate, isLoading, isError } = useCandidate()
    const createCandidate = useCreateCandidate()
    const uploadCv = useUploadCv()

    const fileInputRef = useRef<HTMLInputElement>(null)

    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [isCreating, setIsCreating] = useState(false)

    const hasProfile = !isError && candidate !== undefined

    const handleCreateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        await createCandidate.mutateAsync({ fullName, phone: phone || null })
        setIsCreating(false)
    }

    const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        await uploadCv.mutateAsync(file)
    }

    const formatExperience = (months: number) => {
        const years = Math.floor(months / 12)
        const remainingMonths = months % 12
        if (years === 0) return `${remainingMonths} mies.`
        if (remainingMonths === 0) return `${years} lata`
        return `${years} lata ${remainingMonths} mies.`
    }

    if (isLoading && !candidate) {
        return (
            <AppLayout navItems={navItems}>
                <div className="p-8 text-sm text-neutral-500 text-center py-12">
                    Ładowanie...
                </div>
            </AppLayout>
        )
    }


    if (!hasProfile || isCreating) {
        return (
            <AppLayout navItems={navItems}>
                <div className="flex items-center justify-center min-h-full p-8">
                    <div className="w-full max-w-sm">
                        <div className="mb-8 text-center">
                            <h2 className="text-xl font-semibold text-neutral-50">Stwórz profil</h2>
                            <p className="text-sm text-neutral-400 mt-1">Uzupełnij dane żeby móc aplikować na oferty</p>
                        </div>

                        <form onSubmit={handleCreateProfile} className="space-y-4">
                            <div>
                                <label className={labelClass}>Imię i nazwisko</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Jan Kowalski"
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Telefon (opcjonalnie)</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+48 123 456 789"
                                    className={inputClass}
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={createCandidate.isPending}
                                fullWidth
                                size="md"
                                className="mt-2"
                            >
                                {createCandidate.isPending ? 'Tworzenie...' : 'Stwórz profil'}
                            </Button>
                        </form>
                    </div>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout navItems={navItems}>
            <div className="p-8 max-w-4xl mx-auto">

                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-neutral-50">Mój profil</h2>
                    <p className="text-sm text-neutral-400 mt-1">Twoje dane i CV</p>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-neutral-50 mb-1">Curriculum Vitae</h3>
                            <p className="text-xs text-neutral-500">
                                {candidate.cvFilePath
                                    ? `Wgrane: ${candidate.cvFilePath}`
                                    : 'Brak wgranego CV — dodaj CV żeby móc aplikować'
                                }
                            </p>
                        </div>
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                onChange={handleCvUpload}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadCv.isPending}
                                className="px-4 py-2 text-sm font-medium border border-neutral-700 text-neutral-300 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {uploadCv.isPending
                                    ? 'Wgrywanie...'
                                    : candidate.cvFilePath ? 'Zmień CV' : 'Wgraj CV'
                                }
                            </button>
                        </div>
                    </div>

                    {uploadCv.isPending && (
                        <div className="mt-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-neutral-400 animate-pulse" />
                            <p className="text-xs text-neutral-400">AI parsuje CV — może to chwilę potrwać...</p>
                        </div>
                    )}
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-4">
                    <h3 className="text-sm font-medium text-neutral-50 mb-4">Dane osobowe</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-neutral-800">
                            <span className="text-xs text-neutral-500 uppercase tracking-wider">Imię i nazwisko</span>
                            <span className="text-sm text-neutral-50">{candidate.fullName}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-xs text-neutral-500 uppercase tracking-wider">Telefon</span>
                            <span className="text-sm text-neutral-50">{candidate.phone ?? '—'}</span>
                        </div>
                    </div>
                </div>

                {candidate.cvFilePath && (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                        <h3 className="text-sm font-medium text-neutral-50 mb-4">Dane z CV</h3>
                        <div className="space-y-4">

                            <div>
                                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Doświadczenie</p>
                                <p className="text-sm text-neutral-50">
                                    {candidate.experienceMonths
                                        ? formatExperience(candidate.experienceMonths)
                                        : '—'
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Umiejętności</p>
                                {candidate.skills && candidate.skills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {candidate.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="text-xs px-2.5 py-1 bg-neutral-800 text-neutral-300 rounded-lg border border-neutral-700"
                                            >
                        {skill}
                      </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-neutral-500">—</p>
                                )}
                            </div>

                            <div>
                                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Języki</p>
                                {candidate.languages && candidate.languages.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {candidate.languages.map((lang) => (
                                            <span
                                                key={lang.language}
                                                className="text-xs px-2.5 py-1 bg-neutral-800 text-neutral-300 rounded-lg border border-neutral-700"
                                            >
                        {lang.language} — {lang.level}
                      </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-neutral-500">—</p>
                                )}
                            </div>

                            {candidate.summary && (
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Podsumowanie</p>
                                    <p className="text-sm text-neutral-400 leading-relaxed">{candidate.summary}</p>
                                </div>
                            )}

                        </div>
                    </div>
                )}

            </div>
        </AppLayout>
    )
}