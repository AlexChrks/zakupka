import { SupabaseClient } from '@supabase/supabase-js'
import {
  Company,
  CompanyMember,
  CompanyRow,
  CompanyMemberRow,
  companyFromRow,
  companyMemberFromRow,
  CompanyRole,
} from './types'

export interface CreateCompanyData {
  name: string
  description?: string
  industry?: string
  location?: string
  buyerEnabled: boolean
  supplierEnabled: boolean
}

export interface UpdateCompanyData {
  name?: string
  description?: string
  industry?: string
  location?: string
  buyerEnabled?: boolean
  supplierEnabled?: boolean
}

export async function createCompany(
  supabase: SupabaseClient,
  data: CreateCompanyData
): Promise<Company> {
  const { data: row, error } = await supabase
    .from('companies')
    .insert({
      name: data.name,
      description: data.description || null,
      industry: data.industry || null,
      location: data.location || null,
      buyer_enabled: data.buyerEnabled,
      supplier_enabled: data.supplierEnabled,
    })
    .select()
    .single<CompanyRow>()

  if (error) throw error
  return companyFromRow(row)
}

export async function getCompanyById(
  supabase: SupabaseClient,
  companyId: string
): Promise<Company | null> {
  const { data: row, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyId)
    .is('deleted_at', null)
    .single<CompanyRow>()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }
  return companyFromRow(row)
}

export async function updateCompany(
  supabase: SupabaseClient,
  companyId: string,
  data: UpdateCompanyData
): Promise<Company> {
  const updateData: Record<string, unknown> = {}
  if (data.name !== undefined) updateData.name = data.name
  if (data.description !== undefined) updateData.description = data.description
  if (data.industry !== undefined) updateData.industry = data.industry
  if (data.location !== undefined) updateData.location = data.location
  if (data.buyerEnabled !== undefined) updateData.buyer_enabled = data.buyerEnabled
  if (data.supplierEnabled !== undefined) updateData.supplier_enabled = data.supplierEnabled

  const { data: row, error } = await supabase
    .from('companies')
    .update(updateData)
    .eq('id', companyId)
    .select()
    .single<CompanyRow>()

  if (error) throw error
  return companyFromRow(row)
}

export async function softDeleteCompany(
  supabase: SupabaseClient,
  companyId: string
): Promise<void> {
  const { error } = await supabase
    .from('companies')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', companyId)

  if (error) throw error
}

// Company Members

export async function addCompanyMember(
  supabase: SupabaseClient,
  companyId: string,
  userId: string,
  role: CompanyRole = 'member'
): Promise<CompanyMember> {
  const { data: row, error } = await supabase
    .from('company_members')
    .insert({
      company_id: companyId,
      user_id: userId,
      role,
    })
    .select()
    .single<CompanyMemberRow>()

  if (error) throw error
  return companyMemberFromRow(row)
}

export async function getCompanyMembers(
  supabase: SupabaseClient,
  companyId: string
): Promise<CompanyMember[]> {
  const { data: rows, error } = await supabase
    .from('company_members')
    .select('*')
    .eq('company_id', companyId)

  if (error) throw error
  return (rows as CompanyMemberRow[]).map(companyMemberFromRow)
}

export async function getUserCompanies(
  supabase: SupabaseClient,
  userId: string
): Promise<Company[]> {
  const { data: memberRows, error: memberError } = await supabase
    .from('company_members')
    .select('company_id')
    .eq('user_id', userId)

  if (memberError) throw memberError

  if (!memberRows || memberRows.length === 0) {
    return []
  }

  const companyIds = memberRows.map((m) => m.company_id)

  const { data: rows, error } = await supabase
    .from('companies')
    .select('*')
    .in('id', companyIds)
    .is('deleted_at', null)

  if (error) throw error
  return (rows as CompanyRow[]).map(companyFromRow)
}

export async function getUserPrimaryCompany(
  supabase: SupabaseClient,
  userId: string
): Promise<Company | null> {
  const companies = await getUserCompanies(supabase, userId)
  return companies[0] || null
}

export async function isUserCompanyMember(
  supabase: SupabaseClient,
  userId: string,
  companyId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('company_members')
    .select('id')
    .eq('user_id', userId)
    .eq('company_id', companyId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return !!data
}
