'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { companySchema, CompanyFormValues } from '@/shared/validation/company'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface CompanyStepProps {
  defaultValues: Partial<CompanyFormValues>
  onSubmit: (data: {
    companyName: string
    description?: string
    industry?: string
    location?: string
    buyerEnabled: boolean
    supplierEnabled: boolean
  }) => void
  onBack: () => void
}

export function CompanyStep({ defaultValues, onSubmit, onBack }: CompanyStepProps) {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: defaultValues.name || '',
      description: defaultValues.description || '',
      industry: defaultValues.industry || '',
      location: defaultValues.location || '',
      buyerEnabled: defaultValues.buyerEnabled ?? false,
      supplierEnabled: defaultValues.supplierEnabled ?? false,
    },
  })

  const handleSubmit = (values: CompanyFormValues) => {
    onSubmit({
      companyName: values.name,
      description: values.description,
      industry: values.industry,
      location: values.location,
      buyerEnabled: values.buyerEnabled,
      supplierEnabled: values.supplierEnabled,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название компании *</FormLabel>
              <FormControl>
                <Input placeholder="ООО «Компания»" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Краткое описание деятельности компании..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Отрасль</FormLabel>
                <FormControl>
                  <Input placeholder="напр., Производство" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Местоположение</FormLabel>
                <FormControl>
                  <Input placeholder="напр., Москва" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3 rounded-lg border p-4">
          <FormLabel className="text-base">Тип компании *</FormLabel>
          <FormDescription>
            Выберите, как ваша компания будет использовать платформу (можно выбрать оба)
          </FormDescription>

          <FormField
            control={form.control}
            name="buyerEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal">Покупатель</FormLabel>
                  <FormDescription>Создавать запросы и получать предложения от поставщиков</FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supplierEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal">Поставщик</FormLabel>
                  <FormDescription>Просматривать запросы и отправлять коммерческие предложения</FormDescription>
                </div>
              </FormItem>
            )}
          />

          {form.formState.errors.buyerEnabled && (
            <p className="text-sm text-destructive">
              {form.formState.errors.buyerEnabled.message}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Назад
          </Button>
          <Button type="submit" className="flex-1">
            Продолжить
          </Button>
        </div>
      </form>
    </Form>
  )
}
