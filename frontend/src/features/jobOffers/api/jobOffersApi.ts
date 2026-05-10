import api from '../../../shared/lib/axios'

export interface JobOffer {
    id: number
    title: string
    description: string
    requirements: { skill: string; is_required: boolean }[]
    experienceMin: number
    location: string | null
    workMode: 'remote' | 'hybrid' | 'onsite'
    status: 'active' | 'closed'
    createdAt: string
}

export interface CreateJobOfferPayload {
    title: string
    description: string
    requirements: { skill: string; is_required: boolean }[]
    experienceMin: number
    location: string | null
    workMode: string
}

interface PaginatedResponse<T> {
    data: T[]
    meta: {
        total: number
        page: number
        limit: number
        pages: number
    }
}

export const jobOffersApi = {
    getById: async (id: number): Promise<JobOffer> => {
        const response = await api.get<JobOffer>(`/job-offers/${id}`)
        return response.data
    },

    getAll: async (page = 1, limit = 10): Promise<PaginatedResponse<JobOffer>> => {
        const response = await api.get('/job-offers', { params: { page, limit } })
        return response.data
    },

    create: async (payload: CreateJobOfferPayload): Promise<JobOffer> => {
        const response = await api.post('/job-offers', payload)
        return response.data
    },

    update: async (id: number, payload: Partial<CreateJobOfferPayload>): Promise<JobOffer> => {
        const response = await api.patch(`/job-offers/${id}`, payload)
        return response.data
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/job-offers/${id}`)
    },
}