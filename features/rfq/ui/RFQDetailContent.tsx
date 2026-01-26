'use client'

import { RFQWithRelations, RFQFile } from '@/entities/rfq/types'
import { Offer, OfferWithCompany } from '@/entities/offer/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, MapPin, DollarSign, Package, FileText, Building2 } from 'lucide-react'
import { formatDate, formatCurrency, formatRelativeDate } from '@/shared/lib/utils'
import { RFQStatusBadge } from './RFQStatusBadge'
import { RFQFiles } from './RFQFiles'
import { RFQStatusActions } from './RFQStatusActions'
import { WinnerSection } from './WinnerSection'
import { OffersTable } from '@/features/offer/ui/OffersTable'
import { OfferForm } from '@/features/offer/ui/OfferForm'
import { MyOfferCard } from '@/features/offer/ui/MyOfferCard'

interface RFQDetailContentProps {
  rfq: RFQWithRelations
  files: RFQFile[]
  offers: OfferWithCompany[] | null
  myOffer: Offer | null
  isBuyer: boolean
  canSubmitOffer: boolean
  userCompanyId?: string
}

export function RFQDetailContent({
  rfq,
  files,
  offers,
  myOffer,
  isBuyer,
  canSubmitOffer,
  userCompanyId,
}: RFQDetailContentProps) {
  const isExpired = new Date(rfq.deadline) < new Date()
  const isOpen = rfq.status === 'open'
  
  // Find the winning offer
  const winningOffer = offers?.find(o => o.isSelected) || null
  const isWinner = winningOffer?.companyId === userCompanyId

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{rfq.title}</h1>
            <RFQStatusBadge status={rfq.status} />
          </div>
          {rfq.company && (
            <div className="mt-2 flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{rfq.company.name}</span>
              {rfq.company.location && (
                <>
                  <span>•</span>
                  <MapPin className="h-4 w-4" />
                  <span>{rfq.company.location}</span>
                </>
              )}
            </div>
          )}
        </div>

        {isBuyer && isOpen && <RFQStatusActions rfq={rfq} />}
      </div>

      {/* Winner Section - shown when winner is selected or RFQ is completed/cancelled */}
      <WinnerSection
        rfq={rfq}
        winningOffer={winningOffer}
        isBuyer={isBuyer}
        isWinner={isWinner}
        hasOffer={!!myOffer}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Описание</CardTitle>
            </CardHeader>
            <CardContent>
              {rfq.description ? (
                <p className="whitespace-pre-wrap">{rfq.description}</p>
              ) : (
                <p className="text-muted-foreground">Описание не указано</p>
              )}
            </CardContent>
          </Card>

          {/* Files */}
          {files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Вложения ({files.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RFQFiles files={files} />
              </CardContent>
            </Card>
          )}

          {/* Offers Section - Buyer View */}
          {isBuyer && offers && (
            <Card>
              <CardHeader>
                <CardTitle>Предложения ({offers.length})</CardTitle>
                <CardDescription>
                  {offers.length === 0
                    ? 'Пока нет предложений'
                    : `Просмотр и сравнение предложений от поставщиков`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {offers.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <Package className="mx-auto h-12 w-12 opacity-50" />
                    <p className="mt-2">Ожидание предложений от поставщиков</p>
                  </div>
                ) : (
                  <OffersTable offers={offers} rfqId={rfq.id} canSelectWinner={isOpen} />
                )}
              </CardContent>
            </Card>
          )}

          {/* Supplier View - My Offer or Submit Form */}
          {!isBuyer && (
            <Card>
              <CardHeader>
                <CardTitle>{myOffer ? 'Ваше предложение' : 'Отправить предложение'}</CardTitle>
                <CardDescription>
                  {myOffer
                    ? 'Ваше предложение по данному запросу'
                    : canSubmitOffer
                      ? 'Отправьте предложение для участия в конкурсе'
                      : isExpired
                        ? 'Срок приёма предложений истёк'
                        : 'Запрос больше не принимает предложения'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {myOffer ? (
                  <MyOfferCard
                    offer={myOffer}
                    canEdit={canSubmitOffer}
                    rfqId={rfq.id}
                    companyId={userCompanyId!}
                  />
                ) : canSubmitOffer ? (
                  <OfferForm rfqId={rfq.id} companyId={userCompanyId!} />
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <p>Вы не можете отправить предложение в данный момент</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Детали</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {rfq.category && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Категория</span>
                  <Badge variant="secondary">{rfq.category.name}</Badge>
                </div>
              )}

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Срок</p>
                    <p
                      className={`text-sm ${isExpired ? 'text-destructive' : 'text-muted-foreground'}`}
                    >
                      {formatDate(rfq.deadline)}
                      <span className="block text-xs">{formatRelativeDate(rfq.deadline)}</span>
                    </p>
                  </div>
                </div>

                {(rfq.budgetMin || rfq.budgetMax) && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Бюджет</p>
                      <p className="text-sm text-muted-foreground">
                        {rfq.budgetMin && rfq.budgetMax
                          ? `${formatCurrency(rfq.budgetMin)} - ${formatCurrency(rfq.budgetMax)}`
                          : rfq.budgetMin
                            ? `От ${formatCurrency(rfq.budgetMin)}`
                            : `До ${formatCurrency(rfq.budgetMax!)}`}
                      </p>
                    </div>
                  </div>
                )}

                {rfq.quantity && (
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Количество</p>
                      <p className="text-sm text-muted-foreground">{rfq.quantity}</p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="text-xs text-muted-foreground">
                <p>Создан: {formatDate(rfq.createdAt)}</p>
                <p>Обновлён: {formatDate(rfq.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
