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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSelectWinner } from '@/shared/hooks/use-offers'
import { useSelectWinnerModal } from '@/shared/context/modal-context'
import { formatCurrency, formatDate } from '@/shared/lib/utils'
import { Trophy, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Поставщик</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead className="hidden sm:table-cell">Срок поставки</TableHead>
            <TableHead className="hidden md:table-cell">Дата подачи</TableHead>
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
              <TableCell className="hidden sm:table-cell">
                {offer.deliveryDays ? `${offer.deliveryDays} дн.` : '-'}
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {formatDate(offer.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                {canSelectWinner && !offer.isSelected && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSelectWinner(offer)}
                    disabled={selectWinner.isPending}
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
  )
}
