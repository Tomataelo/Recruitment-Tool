import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { applicationsApi } from '../api/applicationsApi'

export function useJobOfferApplications(jobOfferId: number) {
    return useQuery({
        queryKey: ['applications', jobOfferId],
        queryFn: () => applicationsApi.getByJobOffer(jobOfferId),
    })
}

export function useOverrideApplication() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, matchLevel, recruiterNote }: {
            id: number
            matchLevel: string
            recruiterNote?: string
        }) => applicationsApi.override(id, matchLevel, recruiterNote),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] })
        },
    })
}

export function useMyApplications() {
    return useQuery({
        queryKey: ['myApplications'],
        queryFn: applicationsApi.getMyApplications,
    })
}

export function useApply() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (jobOfferId: number) => applicationsApi.apply(jobOfferId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myApplications'] })
        },
    })
}

export function useCandidateProfile(applicationId: number | null) {
    return useQuery({
        queryKey: ['candidateProfile', applicationId],
        queryFn: () => applicationsApi.getCandidateProfile(applicationId!),
        enabled: !!applicationId,
    })
}

export function useUpdateApplicationStatus() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            applicationsApi.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] })
        },
    })
}