import { redirect } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import { getUserPrimaryCompany } from '@/entities/company/repo'
import { DashboardNav } from '@/features/company/ui/DashboardNav'
import { DashboardHeader } from '@/features/company/ui/DashboardHeader'
import { AuthStoreInitializer } from '@/features/auth/ui/AuthStoreInitializer'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const company = await getUserPrimaryCompany(supabase, user.id)

  if (!company) {
    // User exists but no company - should not happen in normal flow
    // Could redirect to a company setup page
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AuthStoreInitializer company={company} />
      <DashboardHeader user={user} company={company} />
      <div className="flex flex-1">
        <DashboardNav company={company} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
