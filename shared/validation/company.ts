import { z } from 'zod'

export const companySchema = z
  .object({
    name: z.string().min(2, 'Название компании должно содержать минимум 2 символа'),
    description: z.string().optional(),
    industry: z.string().optional(),
    location: z.string().optional(),
    contactPhone: z.string().min(1, 'Укажите телефон для связи'),
    contactEmail: z.string().email('Укажите корректный email').optional().or(z.literal('')),
    contactPerson: z.string().optional(),
    buyerEnabled: z.boolean(),
    supplierEnabled: z.boolean(),
  })
  .refine((data) => data.buyerEnabled || data.supplierEnabled, {
    message: 'Компания должна быть зарегистрирована как покупатель, поставщик или оба',
    path: ['buyerEnabled'],
  })

export type CompanyFormValues = z.infer<typeof companySchema>

export const termsSchema = z.object({
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Необходимо принять условия использования',
  }),
})

export type TermsFormValues = z.infer<typeof termsSchema>
