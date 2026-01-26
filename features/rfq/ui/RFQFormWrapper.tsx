'use client'

import { useRouter } from 'next/navigation'
import { Category, RFQWithRelations, RFQFile } from '@/entities/rfq/types'
import { RFQForm } from './RFQForm'
import { useCreateRFQ, useUpdateRFQ } from '@/shared/hooks/use-rfqs'
import { useRFQStore } from '@/shared/stores/rfq-store'
import { toast } from 'sonner'
import { RFQFormValues } from '@/shared/validation/rfq'

interface RFQFormWrapperProps {
  categories: Category[]
  rfq?: RFQWithRelations
  files?: RFQFile[]
  mode: 'create' | 'edit'
}

export function RFQFormWrapper({ categories, rfq, files, mode }: RFQFormWrapperProps) {
  const router = useRouter()
  const createRFQ = useCreateRFQ()
  const updateRFQ = useUpdateRFQ()
  const clearDraftRFQ = useRFQStore((state) => state.clearDraftRFQ)

  const handleSubmit = async (values: RFQFormValues) => {
    if (mode === 'create') {
      const result = await createRFQ.mutateAsync({
        title: values.title,
        description: values.description,
        categoryId: values.categoryId,
        quantity: values.quantity,
        budgetMin: values.budgetMin ?? undefined,
        budgetMax: values.budgetMax ?? undefined,
        deadline: values.deadline,
      })

      if (result.error) {
        toast.error(result.error)
        return
      }

      clearDraftRFQ()
      toast.success('Запрос успешно создан')
      router.push(`/rfqs/${result.rfqId}`)
    } else if (rfq) {
      const result = await updateRFQ.mutateAsync({
        rfqId: rfq.id,
        data: {
          title: values.title,
          description: values.description,
          categoryId: values.categoryId,
          quantity: values.quantity,
          budgetMin: values.budgetMin,
          budgetMax: values.budgetMax,
          deadline: values.deadline,
        },
      })

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success('Запрос успешно обновлён')
      router.push(`/rfqs/${rfq.id}`)
    }
  }

  const defaultValues: Partial<RFQFormValues> | undefined = rfq
    ? {
        title: rfq.title,
        description: rfq.description || '',
        categoryId: rfq.categoryId || '',
        quantity: rfq.quantity || '',
        budgetMin: rfq.budgetMin,
        budgetMax: rfq.budgetMax,
        deadline: new Date(rfq.deadline),
      }
    : undefined

  return (
    <RFQForm
      categories={categories}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isSubmitting={createRFQ.isPending || updateRFQ.isPending}
      rfqId={rfq?.id}
      existingFiles={files}
      mode={mode}
    />
  )
}
