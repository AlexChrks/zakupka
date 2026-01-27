'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { RFQWithRelations, RFQStatus } from '@/entities/rfq/types'
import { useMyRFQs } from '@/shared/hooks/use-rfqs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate, formatRelativeDate } from '@/shared/lib/utils'
import { RFQStatusBadge } from './RFQStatusBadge'
import { FileX, Edit, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MyRFQsListProps {
  initialRFQs: RFQWithRelations[]
}

type TabValue = 'all' | RFQStatus

export function MyRFQsList({ initialRFQs }: MyRFQsListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [statusFilter, setStatusFilter] = useState<TabValue>('all')
  const highlightedRowRef = useRef<HTMLTableRowElement>(null)

  // Get highlighted RFQ IDs from URL
  const highlightParam = searchParams.get('highlight')
  const highlightedIds = highlightParam ? highlightParam.split(',') : []

  // Scroll to first highlighted row and clear highlight after delay
  useEffect(() => {
    if (highlightedIds.length > 0 && highlightedRowRef.current) {
      highlightedRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      
      // Clear highlight from URL after 5 seconds
      const timeout = setTimeout(() => {
        router.replace('/my-rfqs', { scroll: false })
      }, 5000)
      
      return () => clearTimeout(timeout)
    }
  }, [highlightedIds.length, router])

  const { data: rfqs, isLoading, isFetching, refetch } = useMyRFQs(
    statusFilter === 'all' ? undefined : statusFilter
  )

  const displayRFQs = rfqs || initialRFQs
  const filteredRFQs =
    statusFilter === 'all'
      ? displayRFQs
      : displayRFQs.filter((rfq) => rfq.status === statusFilter)

  // Каунтеры всегда считаем от initialRFQs, чтобы они не менялись при выборе фильтра
  const counts = {
    all: initialRFQs.length,
    open: initialRFQs.filter((r) => r.status === 'open').length,
    completed: initialRFQs.filter((r) => r.status === 'completed').length,
    cancelled: initialRFQs.filter((r) => r.status === 'cancelled').length,
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as TabValue)} className="w-full sm:w-auto">
          <TabsList className="w-full overflow-x-auto sm:w-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              Все <span className="ml-1">({counts.all})</span>
            </TabsTrigger>
            <TabsTrigger value="open" className="text-xs sm:text-sm">
              <span className="hidden xs:inline">Открытые</span>
              <span className="xs:hidden">Откр.</span>
              <span className="ml-1">({counts.open})</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm">
              <span className="hidden xs:inline">Завершённые</span>
              <span className="xs:hidden">Заверш.</span>
              <span className="ml-1">({counts.completed})</span>
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs sm:text-sm">
              <span className="hidden xs:inline">Отменённые</span>
              <span className="xs:hidden">Отмен.</span>
              <span className="ml-1">({counts.cancelled})</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()} 
          disabled={isFetching}
          className="w-full sm:w-auto"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          <span className="ml-2">Обновить</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : filteredRFQs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <FileX className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Запросы не найдены</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {statusFilter === 'all'
              ? 'Вы ещё не создали ни одного запроса'
              : `Нет запросов со статусом "${statusFilter === 'open' ? 'Открыт' : statusFilter === 'completed' ? 'Завершён' : 'Отменён'}"`}
          </p>
          {statusFilter === 'all' && (
            <Button asChild className="mt-4">
              <Link href="/my-rfqs/new">Создать первый запрос</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table className="min-w-[500px]">
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead className="hidden sm:table-cell">Категория</TableHead>
                <TableHead className="hidden md:table-cell">Срок</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="hidden sm:table-cell">Предл.</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRFQs.map((rfq, index) => {
                const isHighlighted = highlightedIds.includes(rfq.id)
                const isFirstHighlighted = isHighlighted && highlightedIds[0] === rfq.id
                
                return (
                <TableRow 
                  key={rfq.id}
                  ref={isFirstHighlighted ? highlightedRowRef : undefined}
                  onClick={() => router.push(`/rfqs/${rfq.id}`)}
                  className={cn(
                    'cursor-pointer hover:bg-muted/50',
                    isHighlighted && 'bg-blue-50 border-l-4 border-l-blue-500 animate-pulse'
                  )}
                >
                  <TableCell>
                    <span className="font-medium">{rfq.title}</span>
                    <p className="mt-1 text-xs text-muted-foreground md:hidden">
                      {formatRelativeDate(rfq.deadline)}
                    </p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {rfq.category ? (
                      <Badge variant="secondary">{rfq.category.name}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span
                      className={
                        new Date(rfq.deadline) < new Date() ? 'text-destructive' : ''
                      }
                    >
                      {formatDate(rfq.deadline)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <RFQStatusBadge status={rfq.status} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline">{rfq.offersCount || 0}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {rfq.status === 'open' && (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/my-rfqs/${rfq.id}/edit`)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
