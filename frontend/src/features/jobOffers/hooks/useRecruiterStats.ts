import { useQuery } from '@tanstack/react-query'
import { recruiterApi } from '../api/recruiterApi'

export function useRecruiterStats() {
    return useQuery({
        queryKey: ['recruiterStats'],
        queryFn: recruiterApi.getStats,
    })
}

export function useRecentApplications() {
    return useQuery({
        queryKey: ['recentApplications'],
        queryFn: recruiterApi.getRecentApplications,
    })
}