import { createClient } from '@/shared/lib/supabase/server'
import { getUserPrimaryCompany } from '@/entities/company/repo'
import { listCompanyRFQs } from '@/entities/rfq/repo'
import { redirect } from 'next/navigation'
import { DashboardContent } from '@/features/company/ui/DashboardContent'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const company = await getUserPrimaryCompany(supabase, user.id)

  if (!company) {
    redirect('/login')
  }

  // Get company RFQs if buyer
  let rfqs: Awaited<ReturnType<typeof listCompanyRFQs>> = []
  if (company.buyerEnabled) {
    rfqs = await listCompanyRFQs(supabase, company.id)
  }

  return <DashboardContent company={company} rfqs={rfqs} user={user} />
}
