'use client'

import Link from 'next/link'
import { DealWithDetails } from '@/entities/offer/repo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  DollarSign,
  Package,
  Trophy,
  ExternalLink,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/shared/lib/utils'

interface DealsListProps {
  deals: DealWithDetails[]
}

export function DealsList({ deals }: DealsListProps) {
  if (deals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <Trophy className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Нет завершённых сделок</h3>
        <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
          Здесь будут отображаться запросы, где ваше предложение было выбрано покупателем
        </p>
        <Button asChild className="mt-4">
          <Link href="/rfqs">Найти запросы</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {deals.map((deal) => (
        <DealCard key={deal.offer.id} deal={deal} />
      ))}
    </div>
  )
}

function DealCard({ deal }: { deal: DealWithDetails }) {
  const { offer, rfq, buyerCompany } = deal

  return (
    <Card className="border-green-200 bg-green-50/30 dark:border-green-800 dark:bg-green-950/10">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">{rfq.title}</CardTitle>
            </div>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {rfq.description || 'Без описания'}
            </p>
          </div>
          <Badge variant="default" className="bg-green-600 shrink-0">
            Победа
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Deal Summary */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-background p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Ваше предложение</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Цена:</span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(offer.price, offer.currency)}
                </span>
              </div>
              {offer.deliveryDays && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Срок поставки:</span>
                  <span className="font-medium">{offer.deliveryDays} дн.</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Дата подачи:</span>
                <span className="text-sm">{formatDate(offer.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-background p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Детали запроса</h4>
            <div className="space-y-2">
              {rfq.quantity && (
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Кол-во: {rfq.quantity}</span>
                </div>
              )}
              {(rfq.budgetMin || rfq.budgetMax) && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Бюджет:{' '}
                    {rfq.budgetMin && rfq.budgetMax
                      ? `${formatCurrency(rfq.budgetMin)} - ${formatCurrency(rfq.budgetMax)}`
                      : rfq.budgetMin
                        ? `От ${formatCurrency(rfq.budgetMin)}`
                        : `До ${formatCurrency(rfq.budgetMax!)}`}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Дедлайн: {formatDate(rfq.deadline)}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Buyer Contact Info */}
        <div className="rounded-lg border bg-background p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Контакты покупателя</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{buyerCompany.name}</span>
            </div>
            {buyerCompany.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{buyerCompany.location}</span>
              </div>
            )}
            {buyerCompany.contactPerson && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{buyerCompany.contactPerson}</span>
              </div>
            )}
            {buyerCompany.contactPhone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`tel:${buyerCompany.contactPhone}`} 
                  className="text-sm text-primary hover:underline"
                >
                  {buyerCompany.contactPhone}
                </a>
              </div>
            )}
            {buyerCompany.contactEmail && (
              <div className="flex items-center gap-2 sm:col-span-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`mailto:${buyerCompany.contactEmail}`} 
                  className="text-sm text-primary hover:underline"
                >
                  {buyerCompany.contactEmail}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <Button asChild variant="outline" size="sm">
            <Link href={`/rfqs/${rfq.id}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Открыть запрос
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

