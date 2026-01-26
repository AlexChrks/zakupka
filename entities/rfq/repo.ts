import { SupabaseClient } from '@supabase/supabase-js'
import {
  RFQ,
  RFQWithRelations,
  RFQRow,
  RFQStatus,
  rfqFromRow,
  Category,
  CategoryRow,
  categoryFromRow,
} from './types'

export interface CreateRFQData {
  companyId: string
  title: string
  description?: string
  categoryId?: string
  quantity?: string
  budgetMin?: number
  budgetMax?: number
  deadline: Date
}

export interface UpdateRFQData {
  title?: string
  description?: string
  categoryId?: string
  quantity?: string
  budgetMin?: number | null
  budgetMax?: number | null
  deadline?: Date
}

export interface RFQFilters {
  categoryId?: string
  location?: string
  deadlineBefore?: string
  search?: string
  status?: RFQStatus
}

// Categories

export async function listCategories(supabase: SupabaseClient): Promise<Category[]> {
  const { data: rows, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) throw error
  return (rows as CategoryRow[]).map(categoryFromRow)
}

export async function getCategoryById(
  supabase: SupabaseClient,
  categoryId: string
): Promise<Category | null> {
  const { data: row, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', categoryId)
    .single<CategoryRow>()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return categoryFromRow(row)
}

// RFQs

export async function createRFQ(
  supabase: SupabaseClient,
  data: CreateRFQData
): Promise<RFQ> {
  const { data: row, error } = await supabase
    .from('rfqs')
    .insert({
      company_id: data.companyId,
      title: data.title,
      description: data.description || null,
      category_id: data.categoryId || null,
      quantity: data.quantity || null,
      budget_min: data.budgetMin || null,
      budget_max: data.budgetMax || null,
      deadline: data.deadline.toISOString(),
    })
    .select()
    .single<RFQRow>()

  if (error) throw error
  return rfqFromRow(row)
}

export async function getRFQById(
  supabase: SupabaseClient,
  rfqId: string
): Promise<RFQWithRelations | null> {
  const { data: row, error } = await supabase
    .from('rfqs')
    .select(`
      *,
      company:companies(id, name, location),
      category:categories(id, name, created_at)
    `)
    .eq('id', rfqId)
    .is('deleted_at', null)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  const rfq = rfqFromRow(row as RFQRow)
  return {
    ...rfq,
    company: row.company as RFQWithRelations['company'],
    category: row.category ? categoryFromRow(row.category as CategoryRow) : null,
  }
}

export async function listPublicRFQs(
  supabase: SupabaseClient,
  filters?: RFQFilters,
  page = 1,
  pageSize = 20
): Promise<{ rfqs: RFQWithRelations[]; total: number }> {
  let query = supabase
    .from('rfqs')
    .select(`
      *,
      company:companies(id, name, location),
      category:categories(id, name, created_at),
      offers(count)
    `, { count: 'exact' })
    .is('deleted_at', null)
    .eq('status', 'open')
    .gte('deadline', new Date().toISOString())

  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId)
  }

  if (filters?.location) {
    query = query.ilike('companies.location', `%${filters.location}%`)
  }

  if (filters?.deadlineBefore) {
    query = query.lte('deadline', filters.deadlineBefore)
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data: rows, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  const rfqs: RFQWithRelations[] = (rows || []).map((row) => {
    const rfq = rfqFromRow(row as RFQRow)
    return {
      ...rfq,
      company: row.company as RFQWithRelations['company'],
      category: row.category ? categoryFromRow(row.category as CategoryRow) : null,
      offersCount: row.offers?.[0]?.count || 0,
    }
  })

  return { rfqs, total: count || 0 }
}

export async function listCompanyRFQs(
  supabase: SupabaseClient,
  companyId: string,
  filters?: { status?: RFQStatus }
): Promise<RFQWithRelations[]> {
  let query = supabase
    .from('rfqs')
    .select(`
      *,
      company:companies(id, name, location),
      category:categories(id, name, created_at),
      offers(count)
    `)
    .eq('company_id', companyId)
    .is('deleted_at', null)

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  const { data: rows, error } = await query.order('created_at', { ascending: false })

  if (error) throw error

  return (rows || []).map((row) => {
    const rfq = rfqFromRow(row as RFQRow)
    return {
      ...rfq,
      company: row.company as RFQWithRelations['company'],
      category: row.category ? categoryFromRow(row.category as CategoryRow) : null,
      offersCount: row.offers?.[0]?.count || 0,
    }
  })
}

export async function updateRFQ(
  supabase: SupabaseClient,
  rfqId: string,
  data: UpdateRFQData
): Promise<RFQ> {
  const updateData: Record<string, unknown> = {}
  if (data.title !== undefined) updateData.title = data.title
  if (data.description !== undefined) updateData.description = data.description
  if (data.categoryId !== undefined) updateData.category_id = data.categoryId
  if (data.quantity !== undefined) updateData.quantity = data.quantity
  if (data.budgetMin !== undefined) updateData.budget_min = data.budgetMin
  if (data.budgetMax !== undefined) updateData.budget_max = data.budgetMax
  if (data.deadline !== undefined) updateData.deadline = data.deadline.toISOString()

  const { data: row, error } = await supabase
    .from('rfqs')
    .update(updateData)
    .eq('id', rfqId)
    .select()
    .single<RFQRow>()

  if (error) throw error
  return rfqFromRow(row)
}

export async function updateRFQStatus(
  supabase: SupabaseClient,
  rfqId: string,
  status: RFQStatus
): Promise<RFQ> {
  const { data: row, error } = await supabase
    .from('rfqs')
    .update({ status })
    .eq('id', rfqId)
    .select()
    .single<RFQRow>()

  if (error) throw error
  return rfqFromRow(row)
}

export async function softDeleteRFQ(
  supabase: SupabaseClient,
  rfqId: string
): Promise<void> {
  const { error } = await supabase
    .from('rfqs')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', rfqId)

  if (error) throw error
}
