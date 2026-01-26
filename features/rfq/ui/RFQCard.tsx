'use client'

import Link from 'next/link'
import { RFQWithRelations } from '@/entities/rfq/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Package, DollarSign, CheckCircle2 } from 'lucide-react'
import { formatRelativeDate, formatCurrency } from '@/shared/lib/utils'

interface RFQCardProps {
  rfq: RFQWithRelations
  showCompany?: boolean
  hasMyOffer?: boolean
}

export function RFQCard({ rfq, showCompany = true, hasMyOffer = false }: RFQCardProps) {
  const isExpiringSoon = new Date(rfq.deadline).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000 // 3 days

  return (
    <Card className={`flex h-full flex-col transition-shadow hover:shadow-md ${hasMyOffer ? 'ring-2 ring-green-500/20 bg-green-50/30 dark:bg-green-950/10' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2 text-base sm:text-lg">{rfq.title}</CardTitle>
            {rfq.category && (
              <Badge variant="secondary" size="responsive" className="shrink-0 hidden sm:inline-flex">
                {rfq.category.name}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {hasMyOffer && (
              <Badge variant="default" size="responsive" className="bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                Предложено
              </Badge>
            )}
            {rfq.category && (
              <Badge variant="secondary" size="sm" className="sm:hidden">
                {rfq.category.name}
              </Badge>
            )}
          </div>
        </div>
        {showCompany && rfq.company && (
          <p className="text-sm text-muted-foreground">{rfq.company.name}</p>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        {rfq.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{rfq.description}</p>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className={isExpiringSoon ? 'font-medium text-orange-600' : ''}>
              Срок: {formatRelativeDate(rfq.deadline)}
            </span>
          </div>

          {rfq.company?.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{rfq.company.location}</span>
            </div>
          )}

          {(rfq.budgetMin || rfq.budgetMax) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>
                Бюджет:{' '}
                {rfq.budgetMin && rfq.budgetMax
                  ? `${formatCurrency(rfq.budgetMin)} - ${formatCurrency(rfq.budgetMax)}`
                  : rfq.budgetMin
                    ? `От ${formatCurrency(rfq.budgetMin)}`
                    : `До ${formatCurrency(rfq.budgetMax!)}`}
              </span>
            </div>
          )}

          {rfq.quantity && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Кол-во: {rfq.quantity}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3">
        <span className="text-sm text-muted-foreground">
          {rfq.offersCount || 0} предложени{(rfq.offersCount || 0) === 1 ? 'е' : (rfq.offersCount || 0) >= 2 && (rfq.offersCount || 0) <= 4 ? 'я' : 'й'}
        </span>
        <Button asChild size="sm">
          <Link href={`/rfqs/${rfq.id}`}>Подробнее</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
