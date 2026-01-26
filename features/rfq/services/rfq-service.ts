'use server'

import { createClient } from '@/shared/lib/supabase/server'
import {
  listPublicRFQs,
  listCompanyRFQs,
  getRFQById,
  createRFQ,
  updateRFQ,
  updateRFQStatus,
  listCategories,
  CreateRFQData,
  UpdateRFQData,
  RFQFilters,
} from '@/entities/rfq/repo'
import { getUserPrimaryCompany } from '@/entities/company/repo'
import { RFQStatus, RFQWithRelations, Category } from '@/entities/rfq/types'
import { revalidatePath } from 'next/cache'

export async function getPublicRFQsAction(
  filters?: RFQFilters,
  page = 1,
  pageSize = 20
): Promise<{ rfqs: RFQWithRelations[]; total: number }> {
  const supabase = await createClient()
  return listPublicRFQs(supabase, filters, page, pageSize)
}

export async function getMyRFQsAction(
  filters?: { status?: RFQStatus }
): Promise<RFQWithRelations[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const company = await getUserPrimaryCompany(supabase, user.id)
  if (!company || !company.buyerEnabled) {
    throw new Error('No buyer company found')
  }

  return listCompanyRFQs(supabase, company.id, filters)
}

export async function getRFQAction(rfqId: string): Promise<RFQWithRelations | null> {
  const supabase = await createClient()
  return getRFQById(supabase, rfqId)
}

export async function getCategoriesAction(): Promise<Category[]> {
  const supabase = await createClient()
  return listCategories(supabase)
}

export async function createRFQAction(
  data: Omit<CreateRFQData, 'companyId'>
): Promise<{ rfqId?: string; error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const company = await getUserPrimaryCompany(supabase, user.id)
  if (!company || !company.buyerEnabled) {
    return { error: 'No buyer company found' }
  }

  try {
    const rfq = await createRFQ(supabase, {
      ...data,
      companyId: company.id,
    })

    revalidatePath('/my-rfqs')
    revalidatePath('/rfqs')
    return { rfqId: rfq.id }
  } catch (error) {
    console.error('Create RFQ error:', error)
    return { error: 'Failed to create RFQ' }
  }
}

export async function updateRFQAction(
  rfqId: string,
  data: UpdateRFQData
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    await updateRFQ(supabase, rfqId, data)
    revalidatePath('/my-rfqs')
    revalidatePath(`/rfqs/${rfqId}`)
    revalidatePath('/rfqs')
    return { success: true }
  } catch (error) {
    console.error('Update RFQ error:', error)
    return { error: 'Failed to update RFQ' }
  }
}

export async function updateRFQStatusAction(
  rfqId: string,
  status: RFQStatus
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    await updateRFQStatus(supabase, rfqId, status)
    revalidatePath('/my-rfqs')
    revalidatePath(`/rfqs/${rfqId}`)
    revalidatePath('/rfqs')
    return { success: true }
  } catch (error) {
    console.error('Update RFQ status error:', error)
    return { error: 'Failed to update RFQ status' }
  }
}
