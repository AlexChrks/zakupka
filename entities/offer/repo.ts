import { SupabaseClient } from '@supabase/supabase-js'
import { Offer, OfferWithCompany, OfferRow, offerFromRow } from './types'

export interface CreateOfferData {
  rfqId: string
  companyId: string
  price: number
  currency?: string
  deliveryDays?: number
  notes?: string
}

export interface UpdateOfferData {
  price?: number
  currency?: string
  deliveryDays?: number | null
  notes?: string | null
}

export async function createOffer(
  supabase: SupabaseClient,
  data: CreateOfferData
): Promise<Offer> {
  const { data: row, error } = await supabase
    .from('offers')
    .insert({
      rfq_id: data.rfqId,
      company_id: data.companyId,
      price: data.price,
      currency: data.currency || 'BYN',
      delivery_days: data.deliveryDays || null,
      notes: data.notes || null,
    })
    .select()
    .single<OfferRow>()

  if (error) throw error
  return offerFromRow(row)
}

export async function getOfferById(
  supabase: SupabaseClient,
  offerId: string
): Promise<Offer | null> {
  const { data: row, error } = await supabase
    .from('offers')
    .select('*')
    .eq('id', offerId)
    .is('deleted_at', null)
    .single<OfferRow>()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return offerFromRow(row)
}

export async function getMyOfferForRFQ(
  supabase: SupabaseClient,
  rfqId: string,
  companyId: string
): Promise<Offer | null> {
  const { data: row, error } = await supabase
    .from('offers')
    .select('*')
    .eq('rfq_id', rfqId)
    .eq('company_id', companyId)
    .is('deleted_at', null)
    .single<OfferRow>()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return offerFromRow(row)
}

export async function listOffersForRFQ(
  supabase: SupabaseClient,
  rfqId: string
): Promise<OfferWithCompany[]> {
  const { data: rows, error } = await supabase
    .from('offers')
    .select(`
      *,
      company:companies(id, name, location, contact_phone, contact_email, contact_person)
    `)
    .eq('rfq_id', rfqId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true })

  if (error) throw error

  return (rows || []).map((row) => {
    const offer = offerFromRow(row as OfferRow)
    const companyData = row.company as {
      id: string
      name: string
      location: string | null
      contact_phone: string | null
      contact_email: string | null
      contact_person: string | null
    }
    return {
      ...offer,
      company: {
        id: companyData.id,
        name: companyData.name,
        location: companyData.location,
        contactPhone: companyData.contact_phone,
        contactEmail: companyData.contact_email,
        contactPerson: companyData.contact_person,
      },
    }
  })
}

export async function updateOffer(
  supabase: SupabaseClient,
  offerId: string,
  data: UpdateOfferData
): Promise<Offer> {
  const updateData: Record<string, unknown> = {}
  if (data.price !== undefined) updateData.price = data.price
  if (data.currency !== undefined) updateData.currency = data.currency
  if (data.deliveryDays !== undefined) updateData.delivery_days = data.deliveryDays
  if (data.notes !== undefined) updateData.notes = data.notes

  const { data: row, error } = await supabase
    .from('offers')
    .update(updateData)
    .eq('id', offerId)
    .select()
    .single<OfferRow>()

  if (error) throw error
  return offerFromRow(row)
}

export async function upsertOffer(
  supabase: SupabaseClient,
  data: CreateOfferData
): Promise<Offer> {
  const { data: row, error } = await supabase
    .from('offers')
    .upsert(
      {
        rfq_id: data.rfqId,
        company_id: data.companyId,
        price: data.price,
        currency: data.currency || 'BYN',
        delivery_days: data.deliveryDays || null,
        notes: data.notes || null,
      },
      {
        onConflict: 'rfq_id,company_id',
      }
    )
    .select()
    .single<OfferRow>()

  if (error) throw error
  return offerFromRow(row)
}

export async function selectWinningOffer(
  supabase: SupabaseClient,
  offerId: string
): Promise<Offer> {
  // First, get the offer to find the RFQ ID
  const offer = await getOfferById(supabase, offerId)
  if (!offer) throw new Error('Offer not found')

  // Deselect any previously selected offer for this RFQ
  await supabase
    .from('offers')
    .update({ is_selected: false })
    .eq('rfq_id', offer.rfqId)
    .eq('is_selected', true)

  // Select the new winner
  const { data: row, error } = await supabase
    .from('offers')
    .update({ is_selected: true })
    .eq('id', offerId)
    .select()
    .single<OfferRow>()

  if (error) throw error
  return offerFromRow(row)
}

export async function deselectOffer(
  supabase: SupabaseClient,
  offerId: string
): Promise<Offer> {
  const { data: row, error } = await supabase
    .from('offers')
    .update({ is_selected: false })
    .eq('id', offerId)
    .select()
    .single<OfferRow>()

  if (error) throw error
  return offerFromRow(row)
}

export async function softDeleteOffer(
  supabase: SupabaseClient,
  offerId: string
): Promise<void> {
  const { error } = await supabase
    .from('offers')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', offerId)

  if (error) throw error
}

export async function countOffersForRFQ(
  supabase: SupabaseClient,
  rfqId: string
): Promise<number> {
  const { count, error } = await supabase
    .from('offers')
    .select('*', { count: 'exact', head: true })
    .eq('rfq_id', rfqId)
    .is('deleted_at', null)

  if (error) throw error
  return count || 0
}

export async function getMyOfferedRFQIds(
  supabase: SupabaseClient,
  companyId: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from('offers')
    .select('rfq_id')
    .eq('company_id', companyId)
    .is('deleted_at', null)

  if (error) throw error
  return (data || []).map((row) => row.rfq_id)
}

export async function getMyWonRFQIds(
  supabase: SupabaseClient,
  companyId: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from('offers')
    .select('rfq_id')
    .eq('company_id', companyId)
    .eq('is_selected', true)
    .is('deleted_at', null)

  if (error) throw error
  return (data || []).map((row) => row.rfq_id)
}

export interface DealWithDetails {
  offer: Offer
  rfq: {
    id: string
    title: string
    description: string | null
    quantity: string | null
    budgetMin: number | null
    budgetMax: number | null
    deadline: string
    status: string
    createdAt: string
  }
  buyerCompany: {
    id: string
    name: string
    location: string | null
    contactPhone: string | null
    contactEmail: string | null
    contactPerson: string | null
  }
}

export async function getMyWonDeals(
  supabase: SupabaseClient,
  companyId: string
): Promise<DealWithDetails[]> {
  console.log('Fetching won deals for company:', companyId)
  
  const { data, error } = await supabase
    .from('offers')
    .select(`
      *,
      rfq:rfqs!inner(
        id,
        title,
        description,
        quantity,
        budget_min,
        budget_max,
        deadline,
        status,
        created_at,
        company:companies(
          id,
          name,
          location,
          contact_phone,
          contact_email,
          contact_person
        )
      )
    `)
    .eq('company_id', companyId)
    .eq('is_selected', true)
    .eq('rfq.status', 'completed')
    .is('deleted_at', null)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching won deals:', error)
    throw error
  }
  
  console.log('Found won deals:', data?.length || 0)

  return (data || []).map((row) => {
    const rfqData = row.rfq as {
      id: string
      title: string
      description: string | null
      quantity: string | null
      budget_min: number | null
      budget_max: number | null
      deadline: string
      status: string
      created_at: string
      company: {
        id: string
        name: string
        location: string | null
        contact_phone: string | null
        contact_email: string | null
        contact_person: string | null
      }
    }

    return {
      offer: offerFromRow(row as OfferRow),
      rfq: {
        id: rfqData.id,
        title: rfqData.title,
        description: rfqData.description,
        quantity: rfqData.quantity,
        budgetMin: rfqData.budget_min,
        budgetMax: rfqData.budget_max,
        deadline: rfqData.deadline,
        status: rfqData.status,
        createdAt: rfqData.created_at,
      },
      buyerCompany: {
        id: rfqData.company.id,
        name: rfqData.company.name,
        location: rfqData.company.location,
        contactPhone: rfqData.company.contact_phone,
        contactEmail: rfqData.company.contact_email,
        contactPerson: rfqData.company.contact_person,
      },
    }
  })
}
