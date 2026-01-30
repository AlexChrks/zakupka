'use client'

import { OfferWithCompany } from '@/entities/offer/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSelectWinner } from '@/shared/hooks/use-offers'
import { useSelectWinnerModal } from '@/shared/context/modal-context'
import { formatCurrency, formatDate } from '@/shared/lib/utils'
import { Trophy, Loader2, MapPin, Truck, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface OffersTableProps {
  offers: OfferWithCompany[]
  rfqId: string
  canSelectWinner: boolean
}

export function OffersTable({ offers, rfqId, canSelectWinner }: OffersTableProps) {
  const selectWinner = useSelectWinner()
  const selectWinnerModal = useSelectWinnerModal()

  const handleSelectWinner = (offer: OfferWithCompany) => {
    selectWinnerModal.open(
      {
        offerId: offer.id,
        rfqId,
        companyName: offer.company.name,
        price: offer.price,
      },
      async () => {
        selectWinner.mutate(
          { offerId: offer.id, rfqId },
          {
            onSuccess: () => toast.success(`${offer.company.name} выбран победителем`),
            onError: () => toast.error('Не удалось выбрать победителя'),
          }
        )
      }
    )
  }

  const sortedOffers = [...offers].sort((a, b) => {
    if (a.isSelected && !b.isSelected) return -1
    if (!a.isSelected && b.isSelected) return 1
    return a.price - b.price
  })

  return (
    <>
      {/* Mobile: Card view */}
      <div className="space-y-3 md:hidden w-full">
        {sortedOffers.map((offer) => (
          <Card
            key={offer.id}
            className={cn(
              'transition-shadow',
              offer.isSelected && 'ring-2 ring-primary bg-primary/5 px-4'
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-base font-medium">
                    {offer.company.name}
                  </CardTitle>
                  {offer.company.location && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{offer.company.location}</span>
                    </div>
                  )}
                </div>
                {offer.isSelected && (
                  <Badge variant="default" className="shrink-0">
                    <Trophy className="mr-1 h-3 w-3" />
                    Победитель
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(offer.price, offer.currency)}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {offer.deliveryDays && (
                  <div className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    <span>{offer.deliveryDays} дн.</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(offer.createdAt)}</span>
                </div>
              </div>

              {canSelectWinner && !offer.isSelected && (
                <Button
                  className="w-full mt-2"
                  onClick={() => handleSelectWinner(offer)}
                  disabled={selectWinner.isPending}
                >
                  {selectWinner.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Trophy className="h-4 w-4 mr-2" />
                  )}
                  Выбрать победителем
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop: Table view */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead>Поставщик</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Срок поставки</TableHead>
              <TableHead>Дата подачи</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOffers.map((offer) => (
              <TableRow key={offer.id} className={offer.isSelected ? 'bg-primary/5' : ''}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="font-medium">{offer.company.name}</p>
                      {offer.company.location && (
                        <p className="text-xs text-muted-foreground">{offer.company.location}</p>
                      )}
                    </div>
                    {offer.isSelected && (
                      <Badge variant="default" className="ml-2">
                        <Trophy className="mr-1 h-3 w-3" />
                        Победитель
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(offer.price, offer.currency)}
                </TableCell>
                <TableCell>
                  {offer.deliveryDays ? `${offer.deliveryDays} дн.` : '-'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(offer.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  {canSelectWinner && !offer.isSelected && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSelectWinner(offer)}
                      disabled={selectWinner.isPending}
                      className="min-h-[44px] min-w-[44px]"
                    >
                      {selectWinner.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Выбрать'
                      )}
                    </Button>
                  )}
                  {offer.isSelected && (
                    <span className="text-sm text-muted-foreground">Выбран</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
