'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

const TERMS_VERSION = '1.0'

export interface LoginResult {
  error?: string
}

export interface RegisterResult {
  error?: string
  userId?: string
}

export async function login(formData: FormData): Promise<LoginResult> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export interface RegisterData {
  email: string
  password: string
  fullName: string
  companyName: string
  companyDescription?: string
  industry?: string
  location?: string
  contactPhone: string
  contactEmail?: string
  contactPerson?: string
  buyerEnabled: boolean
  supplierEnabled: boolean
}

export async function register(data: RegisterData): Promise<RegisterResult> {
  const supabase = await createClient()

  // Get the site URL for email redirect from request headers
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const siteUrl = `${protocol}://${host}`

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
      },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: 'Failed to create user' }
  }

  const userId = authData.user.id

  try {
    // 2. Complete registration via RPC (creates company, member, terms acceptance)
    // Using SECURITY DEFINER function to bypass RLS issues after signUp
    const { error: rpcError } = await supabase.rpc('complete_registration', {
      p_user_id: userId,
      p_company_name: data.companyName,
      p_company_description: data.companyDescription || null,
      p_industry: data.industry || null,
      p_location: data.location || null,
      p_contact_phone: data.contactPhone,
      p_contact_email: data.contactEmail || null,
      p_contact_person: data.contactPerson || null,
      p_buyer_enabled: data.buyerEnabled,
      p_supplier_enabled: data.supplierEnabled,
      p_terms_version: TERMS_VERSION,
    })

    if (rpcError) {
      console.error('Registration RPC error:', rpcError)
      return { error: 'Failed to complete registration. Please try again.' }
    }

    revalidatePath('/', 'layout')
    return { userId }
  } catch (error) {
    console.error('Registration error:', error)
    return { error: 'Failed to complete registration. Please try again.' }
  }
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
