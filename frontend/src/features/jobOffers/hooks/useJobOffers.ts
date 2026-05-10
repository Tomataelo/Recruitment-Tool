import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobOffersApi, type CreateJobOfferPayload } from '../api/jobOffersApi'

export function useJobOffers(page = 1, limit = 10) {
    return useQuery({
        queryKey: ['jobOffers', page, limit],
        queryFn: () => jobOffersApi.getAll(page, limit),
    })
}

export function useJobOffer(id: number) {
    return useQuery({
        queryKey: ['jobOffer', id],
        queryFn: () => jobOffersApi.getById(id),
    })
}

export function useUpdateJobOffer() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Partial<CreateJobOfferPayload> }) =>
            jobOffersApi.update(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['jobOffer', variables.id] })
            queryClient.invalidateQueries({ queryKey: ['jobOffers'] })
        },
    })
}

export function useCreateJobOffer() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: CreateJobOfferPayload) => jobOffersApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobOffers'] })
        },
    })
}

export function useDeleteJobOffer() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => jobOffersApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobOffers'] })
        },
    })
}