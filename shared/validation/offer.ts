import { z } from 'zod'

export const offerSchema = z.object({
  price: z.number().positive('Цена должна быть положительной'),
  currency: z.string().min(1, 'Укажите валюту'),
  deliveryDays: z.number().int().positive('Срок доставки должен быть положительным').optional(),
  notes: z.string().optional(),
})

export type OfferFormValues = z.infer<typeof offerSchema>
