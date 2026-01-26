import { redirect } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import { getUserPrimaryCompany } from '@/entities/company/repo'
import { listCategories } from '@/entities/rfq/repo'
import { RFQFormWrapper } from '@/features/rfq/ui/RFQFormWrapper'

export const metadata = {
  title: 'Создать запрос - Закупка',
  description: 'Создание нового запроса',
}

export default async function CreateRFQPage() {
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

  const categories = await listCategories(supabase)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Создать запрос</h1>
        <p className="text-muted-foreground">
          Создайте новый запрос для получения предложений от поставщиков
        </p>
      </div>

      <RFQFormWrapper categories={categories} mode="create" />
    </div>
  )
}
