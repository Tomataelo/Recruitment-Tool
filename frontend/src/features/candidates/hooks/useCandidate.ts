import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { candidatesApi, type CreateCandidatePayload} from '../api/candidatesApi'

export function useCandidate() {
    return useQuery({
        queryKey: ['candidate'],
        queryFn: candidatesApi.getMe,
        retry: false,
    })
}

export function useCreateCandidate() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: CreateCandidatePayload) => candidatesApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['candidate'] })
        },
    })
}

export function useUploadCv() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (file: File) => candidatesApi.uploadCv(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['candidate'] })
        },
    })
}