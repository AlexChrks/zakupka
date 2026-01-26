'use client'

import { useState } from 'react'
import Link from 'next/link'
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
import { FileX, Edit, Eye, RefreshCw } from 'lucide-react'

interface MyRFQsListProps {
  initialRFQs: RFQWithRelations[]
}

type TabValue = 'all' | RFQStatus

export function MyRFQsList({ initialRFQs }: MyRFQsListProps) {
  const [statusFilter, setStatusFilter] = useState<TabValue>('all')

  const { data: rfqs, isLoading, isFetching, refetch } = useMyRFQs(
    statusFilter === 'all' ? undefined : statusFilter
  )

  const displayRFQs = rfqs || initialRFQs
  const filteredRFQs =
    statusFilter === 'all'
      ? displayRFQs
      : displayRFQs.filter((rfq) => rfq.status === statusFilter)

  const counts = {
    all: displayRFQs.length,
    open: displayRFQs.filter((r) => r.status === 'open').length,
    completed: displayRFQs.filter((r) => r.status === 'completed').length,
    cancelled: displayRFQs.filter((r) => r.status === 'cancelled').length,
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as TabValue)}>
          <TabsList>
            <TabsTrigger value="all">Все ({counts.all})</TabsTrigger>
            <TabsTrigger value="open">Открытые ({counts.open})</TabsTrigger>
            <TabsTrigger value="completed">Завершённые ({counts.completed})</TabsTrigger>
            <TabsTrigger value="cancelled">Отменённые ({counts.cancelled})</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          Обновить
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
        <div className="rounded-md border">
          <Table>
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
              {filteredRFQs.map((rfq) => (
                <TableRow key={rfq.id}>
                  <TableCell>
                    <Link
                      href={`/rfqs/${rfq.id}`}
                      className="font-medium hover:text-primary hover:underline"
                    >
                      {rfq.title}
                    </Link>
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
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/rfqs/${rfq.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {rfq.status === 'open' && (
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/my-rfqs/${rfq.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
