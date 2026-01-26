'use client'

import { useState } from 'react'
import { Offer } from '@/entities/offer/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatDate } from '@/shared/lib/utils'
import { Edit, Trophy, Clock, DollarSign, FileText } from 'lucide-react'
import { OfferForm } from './OfferForm'

interface MyOfferCardProps {
  offer: Offer
  canEdit: boolean
  rfqId: string
  companyId: string
}

export function MyOfferCard({ offer, canEdit, rfqId, companyId }: MyOfferCardProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Редактирование предложения</h4>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
            Отмена
          </Button>
        </div>
        <OfferForm
          rfqId={rfqId}
          companyId={companyId}
          defaultValues={{
            price: offer.price,
            currency: offer.currency,
            deliveryDays: offer.deliveryDays || undefined,
            notes: offer.notes || '',
          }}
          onSuccess={() => setIsEditing(false)}
        />
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {offer.isSelected && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-primary/10 p-3">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="font-medium text-primary">Ваше предложение выбрано!</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Ваша цена</span>
            </div>
            <span className="text-xl font-bold">{formatCurrency(offer.price, offer.currency)}</span>
          </div>

          {offer.deliveryDays && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Срок поставки</span>
                </div>
                <span className="font-medium">{offer.deliveryDays} дн.</span>
              </div>
            </>
          )}

          {offer.notes && (
            <>
              <Separator />
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Примечания</span>
                </div>
                <p className="text-sm">{offer.notes}</p>
              </div>
            </>
          )}

          <Separator />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Отправлено: {formatDate(offer.createdAt)}</span>
            {offer.updatedAt !== offer.createdAt && (
              <Badge variant="secondary">Изменено</Badge>
            )}
          </div>

          {canEdit && !offer.isSelected && (
            <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Редактировать предложение
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
