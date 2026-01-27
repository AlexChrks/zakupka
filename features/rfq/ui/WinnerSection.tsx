'use client'

import { OfferWithCompany } from '@/entities/offer/types'
import { RFQWithRelations } from '@/entities/rfq/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  Phone, 
  Mail,
  ArrowRight,
  PartyPopper,
  XCircle
} from 'lucide-react'
import { formatCurrency } from '@/shared/lib/utils'
import Link from 'next/link'

interface WinnerSectionProps {
  rfq: RFQWithRelations
  winningOffer: OfferWithCompany | null
  isBuyer: boolean
  isWinner: boolean
  hasOffer: boolean
}

export function WinnerSection({ 
  rfq, 
  winningOffer, 
  isBuyer, 
  isWinner,
  hasOffer 
}: WinnerSectionProps) {
  const isCompleted = rfq.status === 'completed'
  const isCancelled = rfq.status === 'cancelled'
  // Don't show anything if RFQ is still open
  if (rfq.status === 'open' && !winningOffer) {
    return null
  }

  // Buyer view - winner selected
  if (isBuyer && winningOffer) {
    return (
      <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <CardTitle>Победитель выбран</CardTitle>
          </div>
          <CardDescription>
            {isCompleted 
              ? 'Запрос завершён. Свяжитесь с поставщиком для оформления сделки.'
              : 'Вы выбрали победителя. Завершите запрос для фиксации результата.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-background p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{winningOffer.company.name}</span>
                </div>
                {winningOffer.company.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{winningOffer.company.location}</span>
                  </div>
                )}
              </div>
              <Badge className="bg-green-600">
                {formatCurrency(winningOffer.price, winningOffer.currency)}
              </Badge>
            </div>
            {winningOffer.deliveryDays && (
              <p className="mt-2 text-sm text-muted-foreground">
                Срок поставки: {winningOffer.deliveryDays} дн.
              </p>
            )}
            {winningOffer.notes && (
              <p className="mt-2 text-sm">{winningOffer.notes}</p>
            )}
          </div>

          {/* Contact information for supplier */}
          <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-600" />
              Контакты поставщика
            </h4>
            {(() => {
              const hasContactPhone = winningOffer.company.contactPhone && winningOffer.company.contactPhone.trim() !== ''
              const hasContactEmail = winningOffer.company.contactEmail && winningOffer.company.contactEmail.trim() !== ''
              const hasContactPerson = winningOffer.company.contactPerson && winningOffer.company.contactPerson.trim() !== ''
              
              return (hasContactPhone || hasContactEmail || hasContactPerson) ? (
                <div className="space-y-2 text-sm">
                  {hasContactPerson && (
                    <p className="font-medium">{winningOffer.company.contactPerson}</p>
                  )}
                  {hasContactPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <a href={`tel:${winningOffer.company.contactPhone}`} className="text-blue-600 hover:underline">
                        {winningOffer.company.contactPhone}
                      </a>
                    </div>
                  )}
                  {hasContactEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <a href={`mailto:${winningOffer.company.contactEmail}`} className="text-blue-600 hover:underline">
                        {winningOffer.company.contactEmail}
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Контактная информация не указана поставщиком
                </p>
              )
            })()}
          </div>

          <div className="rounded-lg border border-dashed p-4">
            <h4 className="font-medium mb-2">Следующие шаги:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                <span>Свяжитесь с поставщиком для уточнения деталей</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                <span>Обсудите условия оплаты и доставки</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                <span>Оформите договор поставки</span>
              </li>
              {!isCompleted && (
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-blue-600" />
                  <span className="font-medium text-foreground">
                    Завершите запрос, когда сделка будет оформлена
                  </span>
                </li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Supplier view - they won!
  if (!isBuyer && isWinner && winningOffer) {
    return (
      <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <PartyPopper className="h-5 w-5 text-yellow-500" />
            <CardTitle>Поздравляем! Вы победили!</CardTitle>
          </div>
          <CardDescription>
            Покупатель выбрал ваше предложение. Свяжитесь с ним для оформления сделки.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-background p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{rfq.company?.name}</span>
              </div>
              {rfq.company?.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{rfq.company.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact information for buyer */}
          <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-600" />
              Контакты покупателя
            </h4>
            {(() => {
              const hasContactPhone = rfq.company?.contactPhone && rfq.company.contactPhone.trim() !== ''
              const hasContactEmail = rfq.company?.contactEmail && rfq.company.contactEmail.trim() !== ''
              const hasContactPerson = rfq.company?.contactPerson && rfq.company.contactPerson.trim() !== ''
              
              return (hasContactPhone || hasContactEmail || hasContactPerson) ? (
                <div className="space-y-2 text-sm">
                  {hasContactPerson && rfq.company?.contactPerson && (
                    <p className="font-medium">{rfq.company.contactPerson}</p>
                  )}
                  {hasContactPhone && rfq.company?.contactPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <a href={`tel:${rfq.company.contactPhone}`} className="text-blue-600 hover:underline">
                        {rfq.company.contactPhone}
                      </a>
                    </div>
                  )}
                  {hasContactEmail && rfq.company?.contactEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <a href={`mailto:${rfq.company.contactEmail}`} className="text-blue-600 hover:underline">
                        {rfq.company.contactEmail}
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Контактная информация не указана покупателем
                </p>
              )
            })()}
          </div>

          <div className="rounded-lg border border-dashed p-4">
            <h4 className="font-medium mb-2">Следующие шаги:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                <span>Свяжитесь с покупателем для уточнения деталей</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                <span>Подготовьте коммерческое предложение</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                <span>Согласуйте условия поставки и оплаты</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                <span>Оформите договор и выполните заказ</span>
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-center gap-2 rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">
              Ваше предложение: {formatCurrency(winningOffer.price, winningOffer.currency)}
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Supplier view - they didn't win (but someone else did)
  if (!isBuyer && hasOffer && winningOffer && !isWinner) {
    return (
      <Card className="border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-900/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-gray-400" />
            <CardTitle className="text-gray-600 dark:text-gray-400">Выбран другой поставщик</CardTitle>
          </div>
          <CardDescription>
            К сожалению, по данному запросу был выбран другой поставщик.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed p-4">
            <p className="text-sm text-muted-foreground mb-3">
              Не расстраивайтесь! Продолжайте участвовать в других запросах.
            </p>
            <Button asChild variant="outline">
              <Link href="/rfqs">
                <ArrowRight className="mr-2 h-4 w-4" />
                Смотреть другие запросы
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Cancelled RFQ
  if (isCancelled) {
    return (
      <Card className="border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-900/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-gray-400" />
            <CardTitle className="text-gray-600 dark:text-gray-400">Запрос отменён</CardTitle>
          </div>
          <CardDescription>
            {isBuyer 
              ? 'Вы отменили этот запрос.'
              : 'Покупатель отменил этот запрос.'}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return null
}
