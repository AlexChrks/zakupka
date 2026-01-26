'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  submitOfferAction,
  selectWinnerAction,
  getOffersForRFQAction,
  getMyOfferAction,
  getMyOfferedRFQIdsAction,
} from '@/features/offer/services/offer-service'
import { CreateOfferData } from '@/entities/offer/repo'
import { OfferWithCompany } from '@/entities/offer/types'
import { rfqKeys } from './use-rfqs'

export const offerKeys = {
  all: ['offers'] as const,
  forRfq: (rfqId: string) => [...offerKeys.all, 'rfq', rfqId] as const,
  myOffer: (rfqId: string, companyId: string) =>
    [...offerKeys.all, 'my', rfqId, companyId] as const,
  myOfferedRfqs: (companyId: string) => [...offerKeys.all, 'myOfferedRfqs', companyId] as const,
}

export function useOffersForRFQ(rfqId: string) {
  return useQuery({
    queryKey: offerKeys.forRfq(rfqId),
    queryFn: () => getOffersForRFQAction(rfqId),
    enabled: !!rfqId,
  })
}

export function useMyOffer(rfqId: string, companyId: string) {
  return useQuery({
    queryKey: offerKeys.myOffer(rfqId, companyId),
    queryFn: () => getMyOfferAction(rfqId, companyId),
    enabled: !!rfqId && !!companyId,
  })
}

export function useMyOfferedRFQIds(companyId: string | undefined) {
  return useQuery({
    queryKey: offerKeys.myOfferedRfqs(companyId || ''),
    queryFn: () => getMyOfferedRFQIdsAction(companyId!),
    enabled: !!companyId,
  })
}

export function useSubmitOffer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateOfferData) => submitOfferAction(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: offerKeys.forRfq(variables.rfqId) })
      queryClient.invalidateQueries({
        queryKey: offerKeys.myOffer(variables.rfqId, variables.companyId),
      })
      queryClient.invalidateQueries({ 
        queryKey: offerKeys.myOfferedRfqs(variables.companyId) 
      })
      queryClient.invalidateQueries({ queryKey: rfqKeys.detail(variables.rfqId) })
    },
  })
}

export function useSelectWinner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      offerId,
      rfqId,
      completeRFQ,
    }: {
      offerId: string
      rfqId: string
      completeRFQ?: boolean
    }) => selectWinnerAction(offerId, rfqId, completeRFQ),
    onMutate: async ({ offerId, rfqId }) => {
      await queryClient.cancelQueries({ queryKey: offerKeys.forRfq(rfqId) })

      const previousOffers = queryClient.getQueryData<OfferWithCompany[]>(offerKeys.forRfq(rfqId))

      // Optimistically update
      queryClient.setQueryData<OfferWithCompany[]>(offerKeys.forRfq(rfqId), (old) => {
        if (!old) return old
        return old.map((offer) => ({
          ...offer,
          isSelected: offer.id === offerId,
        }))
      })

      return { previousOffers }
    },
    onError: (_, { rfqId }, context) => {
      if (context?.previousOffers) {
        queryClient.setQueryData(offerKeys.forRfq(rfqId), context.previousOffers)
      }
    },
    onSettled: (_, __, { rfqId }) => {
      queryClient.invalidateQueries({ queryKey: offerKeys.forRfq(rfqId) })
      queryClient.invalidateQueries({ queryKey: rfqKeys.detail(rfqId) })
      queryClient.invalidateQueries({ queryKey: rfqKeys.all })
    },
  })
}
