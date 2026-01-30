'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { offerSchema, OfferFormValues } from '@/shared/validation/offer'
import { useSubmitOffer } from '@/shared/hooks/use-offers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface OfferFormProps {
  rfqId: string
  companyId: string
  defaultValues?: Partial<OfferFormValues>
  onSuccess?: () => void
}

const currencies = [
  { value: 'BYN', label: 'Br (BYN)' },
  { value: 'RUB', label: '₽ (RUB)' },
  { value: 'USD', label: '$ (USD)' },
  { value: 'EUR', label: '€ (EUR)' },
]

export function OfferForm({ rfqId, companyId, defaultValues, onSuccess }: OfferFormProps) {
  const submitOffer = useSubmitOffer()

  const form = useForm<OfferFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(offerSchema) as any,
    defaultValues: {
      price: defaultValues?.price ?? undefined,
      currency: defaultValues?.currency || 'BYN',
      deliveryDays: defaultValues?.deliveryDays,
      notes: defaultValues?.notes || '',
    },
  })

  const onSubmit = async (values: OfferFormValues) => {
    const result = await submitOffer.mutateAsync({
      rfqId,
      companyId,
      price: values.price,
      currency: values.currency,
      deliveryDays: values.deliveryDays,
      notes: values.notes,
    })

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(defaultValues ? 'Предложение обновлено' : 'Предложение отправлено')
    onSuccess?.()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Цена *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Валюта</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите валюту" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="deliveryDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Срок поставки (дней)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  placeholder="напр., 14"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) =>
                    field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                  }
                />
              </FormControl>
              <FormDescription>Ориентировочный срок поставки в рабочих днях</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Примечания</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Дополнительная информация о вашем предложении..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Укажите важные детали, условия или ограничения
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={submitOffer.isPending}>
          {submitOffer.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {defaultValues ? 'Обновить предложение' : 'Отправить предложение'}
        </Button>
      </form>
    </Form>
  )
}
