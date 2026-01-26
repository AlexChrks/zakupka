import { z } from 'zod'

export const rfqFormSchema = z.object({
  title: z.string().min(5, 'Заголовок должен содержать минимум 5 символов'),
  description: z.string().optional(),
  categoryId: z.string().uuid('Выберите категорию'),
  quantity: z.string().optional(),
  budgetMin: z.number().positive('Бюджет должен быть положительным').optional().nullable(),
  budgetMax: z.number().positive('Бюджет должен быть положительным').optional().nullable(),
  deadline: z.date().refine((date) => date > new Date(), {
    message: 'Срок должен быть в будущем',
  }),
})

export type RFQFormValues = z.infer<typeof rfqFormSchema>

export const rfqFiltersSchema = z.object({
  categoryId: z.string().uuid().optional(),
  location: z.string().optional(),
  deadlineBefore: z.coerce.date().optional(),
  search: z.string().optional(),
})

export type RFQFilters = z.infer<typeof rfqFiltersSchema>
