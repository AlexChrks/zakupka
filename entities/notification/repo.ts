import { SupabaseClient } from '@supabase/supabase-js'
import { NotificationCounts } from './types'

export async function getNotificationCounts(
  supabase: SupabaseClient,
  userId: string
): Promise<NotificationCounts> {
  // Run all queries in parallel
  const [offersResult, rfqsResult, winsResult] = await Promise.all([
    supabase.rpc('get_new_offers_count', { p_user_id: userId }),
    supabase.rpc('get_new_rfqs_count', { p_user_id: userId }),
    supabase.rpc('get_new_wins_count', { p_user_id: userId }),
  ])

  return {
    newOffers: offersResult.data ?? 0,
    newRfqs: rfqsResult.data ?? 0,
    newWins: winsResult.data ?? 0,
  }
}

export async function markOffersAsSeen(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const { error } = await supabase.rpc('mark_offers_seen', { p_user_id: userId })
  if (error) throw error
}

export async function markRfqsAsSeen(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const { error } = await supabase.rpc('mark_rfqs_seen', { p_user_id: userId })
  if (error) throw error
}

export async function markWinsAsSeen(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const { error } = await supabase.rpc('mark_wins_seen', { p_user_id: userId })
  if (error) throw error
}

export async function getRfqsWithNewOffers(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  const { data, error } = await supabase.rpc('get_rfqs_with_new_offers', { p_user_id: userId })
  if (error) throw error
  return (data as { rfq_id: string }[])?.map((row) => row.rfq_id) || []
}

export async function getWonRfqs(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  const { data, error } = await supabase.rpc('get_won_rfqs', { p_user_id: userId })
  if (error) throw error
  return (data as { rfq_id: string }[])?.map((row) => row.rfq_id) || []
}
