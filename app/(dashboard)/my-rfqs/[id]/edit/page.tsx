import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import { getUserPrimaryCompany, isUserCompanyMember } from '@/entities/company/repo'
import { getRFQById, listCategories } from '@/entities/rfq/repo'
import { listRFQFiles } from '@/entities/file/repo'
import { RFQFormWrapper } from '@/features/rfq/ui/RFQFormWrapper'

interface EditRFQPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditRFQPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const rfq = await getRFQById(supabase, id)

  if (!rfq) {
    return { title: 'Запрос не найден' }
  }

  return {
    title: `Редактирование: ${rfq.title} - Закупка`,
  }
}

export default async function EditRFQPage({ params }: EditRFQPageProps) {
  const { id } = await params
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

  const rfq = await getRFQById(supabase, id)

  if (!rfq) {
    notFound()
  }

  const isOwner = await isUserCompanyMember(supabase, user.id, rfq.companyId)
  if (!isOwner) {
    redirect('/my-rfqs')
  }

  if (rfq.status !== 'open') {
    redirect(`/rfqs/${id}`)
  }

  const [categories, files] = await Promise.all([
    listCategories(supabase),
    listRFQFiles(supabase, id),
  ])

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Редактирование запроса</h1>
        <p className="text-muted-foreground">Обновите информацию о вашем запросе</p>
      </div>

      <RFQFormWrapper categories={categories} rfq={rfq} files={files} mode="edit" />
    </div>
  )
}
