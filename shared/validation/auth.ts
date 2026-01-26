import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerAccountSchema = z
  .object({
    email: z.string().email('Введите корректный email'),
    password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
    confirmPassword: z.string(),
    fullName: z.string().min(2, 'ФИО должно содержать минимум 2 символа'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

export type RegisterAccountValues = z.infer<typeof registerAccountSchema>
