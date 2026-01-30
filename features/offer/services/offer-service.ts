'use server'

import { createClient } from '@/shared/lib/supabase/server'
import {
  upsertOffer,
  selectWinningOffer,
  listOffersForRFQ,
  getMyOfferForRFQ,
  getMyOfferedRFQIds,
  getMyWonRFQIds,
  getMyWonDeals,
  CreateOfferData,
  DealWithDetails,
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

export async function getMyWonRFQIdsAction(companyId: string): Promise<string[]> {
  const supabase = await createClient()
  return getMyWonRFQIds(supabase, companyId)
}

export async function getMyDealsAction(): Promise<DealWithDetails[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // Get user's supplier company through company_members
  const { data: memberships, error } = await supabase
    .from('company_members')
    .select(`
      company:companies(
        id,
        supplier_enabled
      )
    `)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching company memberships:', error)
    return []
  }

  // Find the first supplier-enabled company
  // Handle both array and single object cases from Supabase nested select
  const supplierCompany = memberships?.find((m) => {
    const company = Array.isArray(m.company) ? m.company[0] : m.company
    return (company as unknown as { id: string; supplier_enabled: boolean } | null)?.supplier_enabled
  })
  
  const company = supplierCompany 
    ? (Array.isArray(supplierCompany.company) ? supplierCompany.company[0] : supplierCompany.company)
    : undefined
    
  const typedCompany = company as unknown as { id: string; supplier_enabled: boolean } | undefined

  if (!typedCompany) {
    console.log('No supplier company found for user:', user.id)
    return []
  }

  return getMyWonDeals(supabase, typedCompany.id)
}
