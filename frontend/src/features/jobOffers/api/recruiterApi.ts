import api from '../../../shared/lib/axios'

export interface RecruiterStats {
    activeOffers: number
    totalApplications: number
    pendingApplications: number
    acceptedApplications: number
}

export interface RecentApplication {
    id: number
    status: string
    matchLevel: string | null
    appliedAt: string
    candidate: {
        fullName: string
    } | null
    jobOffer: {
        id: number
        title: string
    } | null
}

export const recruiterApi = {
    getStats: async (): Promise<RecruiterStats> => {
        const response = await api.get<RecruiterStats>('/recruiter/stats')
        return response.data
    },

    getRecentApplications: async (): Promise<RecentApplication[]> => {
        const response = await api.get('/recruiter/recent-applications')
        return response.data
    },
}