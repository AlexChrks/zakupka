'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { termsSchema, TermsFormValues } from '@/shared/validation/company'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Loader2 } from 'lucide-react'

interface TermsStepProps {
  onSubmit: () => void
  onBack: () => void
  isLoading: boolean
}

export function TermsStep({ onSubmit, onBack, isLoading }: TermsStepProps) {
  const form = useForm<TermsFormValues>({
    resolver: zodResolver(termsSchema),
    defaultValues: {
      acceptTerms: false,
    },
  })

  const handleSubmit = () => {
    onSubmit()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="rounded-lg border p-4">
          <h3 className="mb-3 font-semibold">Условия использования</h3>
          <div className="h-48 overflow-y-auto rounded bg-muted p-3 text-sm text-muted-foreground">
            <p className="mb-3">
              <strong>1. Принятие условий</strong>
              <br />
              Используя данную B2B платформу закупок, вы соглашаетесь с настоящими Условиями
              использования. Если вы не согласны с условиями, пожалуйста, не используйте наши
              сервисы.
            </p>
            <p className="mb-3">
              <strong>2. Обязанности пользователя</strong>
              <br />
              Пользователи несут ответственность за сохранение конфиденциальности своих учётных
              данных. Вся активность под вашей учётной записью является вашей ответственностью.
            </p>
            <p className="mb-3">
              <strong>3. Правила работы с запросами и предложениями</strong>
              <br />
              Все запросы и предложения должны быть сделаны добросовестно. Пользователи обязаны
              предоставлять достоверную информацию о своих товарах, услугах и возможностях.
            </p>
            <p className="mb-3">
              <strong>4. Конфиденциальность и защита данных</strong>
              <br />
              Мы собираем и обрабатываем персональные данные в соответствии с нашей Политикой
              конфиденциальности. Используя платформу, вы даёте согласие на такую обработку.
            </p>
            <p className="mb-3">
              <strong>5. Ограничение ответственности</strong>
              <br />
              Платформа предоставляется «как есть» без каких-либо гарантий. Мы не несём
              ответственности за косвенные, случайные или последующие убытки.
            </p>
            <p>
              <strong>6. Изменения условий</strong>
              <br />
              Мы оставляем за собой право изменять данные условия в любое время. Продолжение
              использования платформы после изменений означает принятие новых условий.
            </p>
          </div>
        </div>

        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Я прочитал и принимаю Условия использования и Политику конфиденциальности
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1" disabled={isLoading}>
            Назад
          </Button>
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Создать аккаунт
          </Button>
        </div>
      </form>
    </Form>
  )
}
