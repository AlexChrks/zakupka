'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getPublicRFQsAction,
  getMyRFQsAction,
  getRFQAction,
  getCategoriesAction,
  createRFQAction,
  updateRFQAction,
  updateRFQStatusAction,
} from '@/features/rfq/services/rfq-service'
import { RFQFilters } from '@/entities/rfq/repo'
import { RFQStatus } from '@/entities/rfq/types'

export const rfqKeys = {
  all: ['rfqs'] as const,
  public: (filters?: RFQFilters, page?: number) => [...rfqKeys.all, 'public', filters, page] as const,
  myRfqs: (status?: RFQStatus) => [...rfqKeys.all, 'my', status] as const,
  detail: (id: string) => [...rfqKeys.all, 'detail', id] as const,
  categories: ['categories'] as const,
}

export function usePublicRFQs(filters?: RFQFilters, page = 1, pageSize = 20) {
  return useQuery({
    queryKey: rfqKeys.public(filters, page),
    queryFn: () => getPublicRFQsAction(filters, page, pageSize),
  })
}

export function useMyRFQs(status?: RFQStatus) {
  return useQuery({
    queryKey: rfqKeys.myRfqs(status),
    queryFn: () => getMyRFQsAction(status ? { status } : undefined),
  })
}

export function useRFQ(id: string) {
  return useQuery({
    queryKey: rfqKeys.detail(id),
    queryFn: () => getRFQAction(id),
    enabled: !!id,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: rfqKeys.categories,
    queryFn: () => getCategoriesAction(),
    staleTime: 1000 * 60 * 60, // 1 hour - categories don't change often
  })
}

export function useCreateRFQ() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRFQAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rfqKeys.all })
    },
  })
}

export function useUpdateRFQ() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ rfqId, data }: { rfqId: string; data: Parameters<typeof updateRFQAction>[1] }) =>
      updateRFQAction(rfqId, data),
    onSuccess: (_, { rfqId }) => {
      queryClient.invalidateQueries({ queryKey: rfqKeys.all })
      queryClient.invalidateQueries({ queryKey: rfqKeys.detail(rfqId) })
    },
  })
}

export function useUpdateRFQStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ rfqId, status }: { rfqId: string; status: RFQStatus }) =>
      updateRFQStatusAction(rfqId, status),
    onMutate: async ({ rfqId, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: rfqKeys.detail(rfqId) })

      // Snapshot previous value
      const previousRFQ = queryClient.getQueryData(rfqKeys.detail(rfqId))

      // Optimistically update
      queryClient.setQueryData(rfqKeys.detail(rfqId), (old: unknown) => {
        if (!old) return old
        return { ...old, status }
      })

      return { previousRFQ }
    },
    onError: (_, { rfqId }, context) => {
      // Rollback on error
      if (context?.previousRFQ) {
        queryClient.setQueryData(rfqKeys.detail(rfqId), context.previousRFQ)
      }
    },
    onSettled: (_, __, { rfqId }) => {
      queryClient.invalidateQueries({ queryKey: rfqKeys.all })
      queryClient.invalidateQueries({ queryKey: rfqKeys.detail(rfqId) })
    },
  })
}
