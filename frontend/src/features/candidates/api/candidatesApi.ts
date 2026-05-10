import api from '../../../shared/lib/axios'

export interface Candidate {
    id: number
    fullName: string
    phone: string | null
    cvFilePath: string | null
    skills: string[] | null
    experienceMonths: number | null
    languages: { language: string; level: string }[] | null
    summary: string | null
}

export interface CreateCandidatePayload {
    fullName: string
    phone?: string | null
}

export interface UpdateCandidatePayload {
    fullName?: string
    phone?: string | null
    skills?: string[]
    experienceMonths?: number
    languages?: { language: string; level: string }[]
    summary?: string
}

export const candidatesApi = {
    getMe: async (): Promise<Candidate> => {
        const response = await api.get<Candidate>('/candidates/me')
        return response.data
    },

    create: async (payload: CreateCandidatePayload): Promise<Candidate> => {
        const response = await api.post<Candidate>('/candidates/me', payload)
        return response.data
    },

    update: async (payload: UpdateCandidatePayload): Promise<Candidate> => {
        const response = await api.patch<Candidate>('/candidates/me', payload)
        return response.data
    },

    uploadCv: async (file: File): Promise<void> => {
        const formData = new FormData()
        formData.append('cv', file)
        await api.post('/candidates/me/cv', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
}