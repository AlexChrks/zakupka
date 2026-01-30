import { redirect } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import { getUserPrimaryCompany } from '@/entities/company/repo'
import { getMyDealsAction } from '@/features/offer/services/offer-service'
import { DealsList } from '@/features/offer/ui/DealsList'

export const metadata = {
  title: 'Мои сделки - Закупка',
  description: 'Просмотр завершённых сделок и контактов покупателей',
}

export default async function MyDealsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const company = await getUserPrimaryCompany(supabase, user.id)

  if (!company || !company.supplierEnabled) {
    redirect('/dashboard')
  }

  const deals = await getMyDealsAction()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Мои сделки</h1>
        <p className="text-muted-foreground">
          Запросы, где ваше предложение было выбрано покупателем
        </p>
      </div>

      <DealsList deals={deals} />
    </div>
  )
}

