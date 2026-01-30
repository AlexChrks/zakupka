'use client'

import { useMemo, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { usePublicRFQs } from '@/shared/hooks/use-rfqs'
import { useMyOfferedRFQIds, useMyWonRFQIds } from '@/shared/hooks/use-offers'
import { useRFQStore } from '@/shared/stores/rfq-store'
import { useAuthStore } from '@/shared/stores/auth-store'
import { RFQCard } from './RFQCard'
import { RFQFilters } from './RFQFilters'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { FileX, RefreshCw } from 'lucide-react'

interface RFQListProps {
  initialPage?: number
}

export function RFQList({ initialPage = 1 }: RFQListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const highlightedCardRef = useRef<HTMLDivElement>(null)

  // Get highlighted RFQ IDs from URL (for won RFQs)
  const highlightParam = searchParams.get('highlight')
  const highlightedIds = highlightParam ? highlightParam.split(',') : []

  // Scroll to first highlighted card and clear highlight after delay
  useEffect(() => {
    if (highlightedIds.length > 0 && highlightedCardRef.current) {
      highlightedCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })

      // Clear highlight from URL after 5 seconds
      const timeout = setTimeout(() => {
        router.replace('/rfqs', { scroll: false })
      }, 5000)

      return () => clearTimeout(timeout)
    }
  }, [highlightedIds.length, router])

  const storeFilters = useRFQStore((state) => state.filters)
  const currentCompany = useAuthStore((state) => state.currentCompany)

  // Merge store filters with currentCompanyId to filter out RFQs with winners
  const filters = useMemo(() => ({
    ...storeFilters,
    currentCompanyId: currentCompany?.supplierEnabled ? currentCompany.id : undefined,
  }), [storeFilters, currentCompany])

  const { data, isLoading, error, refetch, isFetching } = usePublicRFQs(filters, initialPage)

  // Fetch offered RFQ IDs if the user is a supplier
  const { data: offeredRfqIds } = useMyOfferedRFQIds(
    currentCompany?.supplierEnabled ? currentCompany.id : undefined
  )

  // Fetch won RFQ IDs if the user is a supplier
  const { data: wonRfqIds } = useMyWonRFQIds(
    currentCompany?.supplierEnabled ? currentCompany.id : undefined
  )

  const offeredRfqIdsSet = useMemo(
    () => new Set(offeredRfqIds || []),
    [offeredRfqIds]
  )

  const wonRfqIdsSet = useMemo(
    () => new Set(wonRfqIds || []),
    [wonRfqIds]
  )

  return (
    <div className="space-y-6">
      <RFQFilters />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {data?.total !== undefined
            ? `Найдено: ${data.total} запрос${data.total === 1 ? '' : data.total >= 2 && data.total <= 4 ? 'а' : 'ов'}`
            : 'Загрузка...'}
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          Обновить
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <RFQCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <FileX className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Ошибка загрузки</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Что-то пошло не так. Попробуйте ещё раз.
          </p>
          <Button className="mt-4" onClick={() => refetch()}>
            Повторить
          </Button>
        </div>
      ) : data?.rfqs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <FileX className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Запросы не найдены</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Попробуйте изменить фильтры или зайдите позже.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.rfqs.map((rfq) => {
            const isHighlighted = highlightedIds.includes(rfq.id)
            const isFirstHighlighted = isHighlighted && highlightedIds[0] === rfq.id
            const isWon = wonRfqIdsSet.has(rfq.id)

            return (
              <RFQCard
                key={rfq.id}
                ref={isFirstHighlighted ? highlightedCardRef : undefined}
                rfq={rfq}
                hasMyOffer={offeredRfqIdsSet.has(rfq.id)}
                isHighlighted={isHighlighted}
                isWon={isWon}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

function RFQCardSkeleton() {
  return (
    <div className="rounded-lg border p-4">
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-16 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex justify-between pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  )
}
