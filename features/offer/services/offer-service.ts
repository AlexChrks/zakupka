'use server'

import { createClient } from '@/shared/lib/supabase/server'
import {
  upsertOffer,
  selectWinningOffer,
  listOffersForRFQ,
  getMyOfferForRFQ,
  getMyOfferedRFQIds,
  CreateOfferData,
} from '@/entities/offer/repo'
import { updateRFQStatus } from '@/entities/rfq/repo'
import { Offer, OfferWithCompany } from '@/entities/offer/types'
import { revalidatePath } from 'next/cache'

export async function submitOfferAction(
  data: CreateOfferData
): Promise<{ offer?: Offer; error?: string }> {
  try {
    const supabase = await createClient()
    const offer = await upsertOffer(supabase, data)
    revalidatePath(`/rfqs/${data.rfqId}`)
    return { offer }
  } catch (error) {
    console.error('Submit offer error:', error)
    return { error: 'Failed to submit offer' }
  }
}

export async function selectWinnerAction(
  offerId: string,
  rfqId: string,
  completeRFQ = false
): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    await selectWinningOffer(supabase, offerId)

    if (completeRFQ) {
      await updateRFQStatus(supabase, rfqId, 'completed')
    }

    revalidatePath(`/rfqs/${rfqId}`)
    revalidatePath('/my-rfqs')
    return { success: true }
  } catch (error) {
    console.error('Select winner error:', error)
    return { error: 'Failed to select winner' }
  }
}

export async function getOffersForRFQAction(rfqId: string): Promise<OfferWithCompany[]> {
  const supabase = await createClient()
  return listOffersForRFQ(supabase, rfqId)
}

export async function getMyOfferAction(
  rfqId: string,
  companyId: string
): Promise<Offer | null> {
  const supabase = await createClient()
  return getMyOfferForRFQ(supabase, rfqId, companyId)
}

export async function getMyOfferedRFQIdsAction(companyId: string): Promise<string[]> {
  const supabase = await createClient()
  return getMyOfferedRFQIds(supabase, companyId)
}
