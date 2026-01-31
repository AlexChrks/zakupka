import { type EmailOtpType } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'

function getSiteUrl(): string {
    // Check environment variable first
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL
    }
    // Production URL hardcoded as fallback
    if (process.env.NODE_ENV === 'production') {
        return 'https://zakupka.of.by'
    }
    // Development fallback
    return 'http://localhost:3000'
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/dashboard'

    const siteUrl = getSiteUrl()

    if (token_hash && type) {
        const supabase = await createClient()
        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })

        if (!error) {
            return NextResponse.redirect(`${siteUrl}${next}`)
        }
    }

    return NextResponse.redirect(`${siteUrl}/login?error=email_verification_failed`)
}
