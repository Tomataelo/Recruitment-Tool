import { useState } from 'react'
import { Button } from '../../../shared/components/ui/Button.tsx'
import { RichTextEditor } from '../../../shared/components/ui/RichTextEditor'
import type { CreateJobOfferPayload, JobOffer } from '../api/jobOffersApi'

interface Requirement {
    skill: string
    is_required: boolean
}

interface JobOfferFormProps {
    onSubmit: (payload: CreateJobOfferPayload) => void
    isLoading: boolean
    initialData?: JobOffer
}

export function JobOfferForm({ onSubmit, isLoading, initialData }: JobOfferFormProps) {
    const [title, setTitle] = useState(initialData?.title ?? '')
    const [description, setDescription] = useState(initialData?.description ?? '')
    const [experienceMin, setExperienceMin] = useState(initialData?.experienceMin?.toString() ?? '')
    const [location, setLocation] = useState(initialData?.location ?? '')
    const [workMode, setWorkMode] = useState<'remote' | 'hybrid' | 'onsite'>(
        initialData?.workMode ?? 'hybrid'
    )
    const [requirements, setRequirements] = useState<Requirement[]>(
        initialData?.requirements ?? [{ skill: '', is_required: true }]
    )

    const addRequirement = () => {
        setRequirements([...requirements, { skill: '', is_required: false }])
    }

    const removeRequirement = (index: number) => {
        setRequirements(requirements.filter((_, i) => i !== index))
    }

    const updateRequirement = (index: number, field: keyof Requirement, value: string | boolean) => {
        setRequirements(requirements.map((req, i) =>
            i === index ? { ...req, [field]: value } : req
        ))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            title,
            description,
            requirements: requirements.filter(r => r.skill.trim() !== ''),
            experienceMin: parseInt(experienceMin),
            location: location || null,
            workMode,
        })
    }

    const inputClass = "w-full px-3 py-2.5 text-sm border border-neutral-700 rounded-lg bg-neutral-800 text-neutral-50 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-colors"
    const labelClass = "block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1.5"

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            <div>
                <label className={labelClass}>Tytuł stanowiska</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="np. Senior PHP Developer"
                    required
                    className={inputClass}
                />
            </div>

            <div>
                <label className={labelClass}>Opis</label>
                <RichTextEditor value={description} onChange={setDescription} />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelClass}>Min. doświadczenie (mies.)</label>
                    <input
                        type="number"
                        value={experienceMin}
                        onChange={(e) => setExperienceMin(e.target.value)}
                        placeholder="np. 24"
                        required
                        min={0}
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className={labelClass}>Tryb pracy</label>
                    <select
                        value={workMode}
                        onChange={(e) => setWorkMode(e.target.value as 'remote' | 'hybrid' | 'onsite')}
                        className="w-full px-3 py-2.5 pr-8 text-sm border border-neutral-700 rounded-lg bg-neutral-800 text-neutral-50 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-colors cursor-pointer"
                    >
                        <option value="remote">Zdalnie</option>
                        <option value="hybrid">Hybrydowo</option>
                        <option value="onsite">Stacjonarnie</option>
                    </select>
                </div>
            </div>

            <div>
                <label className={labelClass}>Lokalizacja (opcjonalna)</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="np. Warszawa"
                    className={inputClass}
                />
            </div>

            <div>
                <label className={labelClass}>Wymagania</label>
                <div className="space-y-2">
                    {requirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={req.skill}
                                onChange={(e) => updateRequirement(index, 'skill', e.target.value)}
                                placeholder="np. PHP, Symfony..."
                                className="flex-1 px-3 py-2 text-sm border border-neutral-700 rounded-lg bg-neutral-800 text-neutral-50 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-colors"
                            />
                            <select
                                value={req.is_required ? 'required' : 'optional'}
                                onChange={(e) => updateRequirement(index, 'is_required', e.target.value === 'required')}
                                className="px-2 py-2 pr-8 text-sm border border-neutral-700 rounded-lg bg-neutral-800 text-neutral-50 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-colors cursor-pointer"
                            >
                                <option value="required">Must have</option>
                                <option value="optional">Nice to have</option>
                            </select>
                            {requirements.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeRequirement(index)}
                                    className="p-2 text-neutral-500 hover:text-red-400 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addRequirement}
                    className="mt-2 text-xs text-neutral-400 hover:text-neutral-50 transition-colors flex items-center gap-1"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Dodaj wymaganie
                </button>
            </div>

            <div className="pt-2 border-t border-neutral-800">
                <Button
                    type="submit"
                    disabled={isLoading}
                    fullWidth
                    size="md"
                >
                    {isLoading ? 'Tworzenie...' : 'Utwórz ofertę'}
                </Button>
            </div>

        </form>
    )
}