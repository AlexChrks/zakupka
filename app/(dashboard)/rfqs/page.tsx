import { RFQList } from '@/features/rfq/ui'

export const metadata = {
  title: 'Запросы - Закупка',
  description: 'Просмотр и фильтрация открытых запросов',
}

export default function RFQsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Запросы</h1>
        <p className="text-muted-foreground">
          Найдите открытые запросы и отправьте свои предложения
        </p>
      </div>

      <RFQList />
    </div>
  )
}
