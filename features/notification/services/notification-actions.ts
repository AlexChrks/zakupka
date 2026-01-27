'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { markOffersAsSeen, markRfqsAsSeen, markWinsAsSeen, getRfqsWithNewOffers } from '@/entities/notification/repo'

export async function markOffersSeenAction() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  await markOffersAsSeen(supabase, user.id)
}

export async function markRfqsSeenAction() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  await markRfqsAsSeen(supabase, user.id)
}

export async function markWinsSeenAction() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  await markWinsAsSeen(supabase, user.id)
}

export async function getRfqsWithNewOffersAction(): Promise<string[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  return getRfqsWithNewOffers(supabase, user.id)
}
