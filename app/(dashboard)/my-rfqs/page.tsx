import Link from 'next/link'
import { createClient } from '@/shared/lib/supabase/server'
import { getUserPrimaryCompany } from '@/entities/company/repo'
import { listCompanyRFQs } from '@/entities/rfq/repo'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { MyRFQsList } from '@/features/rfq/ui/MyRFQsList'

export const metadata = {
  title: 'Мои запросы - Закупка',
  description: 'Управление вашими запросами',
}

export default async function MyRFQsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const company = await getUserPrimaryCompany(supabase, user.id)

  if (!company || !company.buyerEnabled) {
    redirect('/dashboard')
  }

  const rfqs = await listCompanyRFQs(supabase, company.id)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Мои запросы</h1>
          <p className="text-muted-foreground">Управление вашими запросами</p>
        </div>
        <Button asChild>
          <Link href="/my-rfqs/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Создать запрос
          </Link>
        </Button>
      </div>

      <MyRFQsList initialRFQs={rfqs} />
    </div>
  )
}
