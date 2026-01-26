import { SupabaseClient } from '@supabase/supabase-js'
import { Profile, ProfileRow, profileFromRow } from './types'

export async function getProfileById(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data: row, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single<ProfileRow>()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return profileFromRow(row)
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  data: { fullName?: string }
): Promise<Profile> {
  const updateData: Record<string, unknown> = {}
  if (data.fullName !== undefined) updateData.full_name = data.fullName

  const { data: row, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single<ProfileRow>()

  if (error) throw error
  return profileFromRow(row)
}

// Terms acceptances

export interface TermsAcceptance {
  id: string
  userId: string
  version: string
  acceptedAt: string
}

export async function recordTermsAcceptance(
  supabase: SupabaseClient,
  userId: string,
  version: string
): Promise<TermsAcceptance> {
  const { data, error } = await supabase
    .from('terms_acceptances')
    .insert({
      user_id: userId,
      version,
    })
    .select()
    .single()

  if (error) throw error
  return {
    id: data.id,
    userId: data.user_id,
    version: data.version,
    acceptedAt: data.accepted_at,
  }
}

export async function getLatestTermsAcceptance(
  supabase: SupabaseClient,
  userId: string
): Promise<TermsAcceptance | null> {
  const { data, error } = await supabase
    .from('terms_acceptances')
    .select('*')
    .eq('user_id', userId)
    .order('accepted_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return {
    id: data.id,
    userId: data.user_id,
    version: data.version,
    acceptedAt: data.accepted_at,
  }
}
