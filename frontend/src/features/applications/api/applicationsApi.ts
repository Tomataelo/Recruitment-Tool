import api from '../../../shared/lib/axios'

export interface Application {
    id: number
    score: number | null
    matchLevel: 'strong' | 'partial' | 'no_match' | null
    scoreSummary: string | null
    recruiterNote: string | null
    recruiterMatchOverride: 'strong' | 'partial' | 'no_match' | null
    status: string
    appliedAt: string
    jobOffer?: {
        id: number
        title: string
    } | null
    candidate: {
        id: number
        fullName: string
        experienceMonths: number | null
        skills: string[] | null
        languages: { language: string; level: string }[] | null
        summary: string | null
        cvFilePath: string | null
    } | null
}

export const applicationsApi = {
    getByJobOffer: async (jobOfferId: number): Promise<{ data: Application[] }> => {
        const response = await api.get(`/job-offers/${jobOfferId}/applications`)
        return response.data
    },

    override: async (id: number, matchLevel: string, recruiterNote?: string) => {
        const response = await api.patch(`/applications/${id}/override`, {
            matchLevel,
            recruiterNote,
        })
        return response.data
    },

    getMyApplications: async (): Promise<{ data: Application[] }> => {
        const response = await api.get('/applications/my')
        return response.data
    },

    apply: async (jobOfferId: number): Promise<void> => {
        await api.post('/applications', { jobOfferId })
    },

    getCandidateProfile: async (applicationId: number): Promise<{
        id: number
        fullName: string
        experienceMonths: number | null
        skills: string[] | null
        languages: { language: string; level: string }[] | null
        summary: string | null
        cvFilePath: string | null
        candidateUser: {
            email: string
        } | null
    }> => {
        const response = await api.get(`/applications/${applicationId}/candidate`)
        return response.data
    },

    downloadCandidateCv: async (candidateId: number): Promise<void> => {
        const response = await api.get(`/candidates/${candidateId}/cv`, {
            responseType: 'blob',
        })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `cv_${candidateId}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
    },

    updateStatus: async (id: number, status: string): Promise<void> => {
        await api.patch(`/applications/${id}/status`, { status })
    },
}