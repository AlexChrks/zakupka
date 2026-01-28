'use client'

import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { Company } from '@/entities/company/types'
import { RFQWithRelations } from '@/entities/rfq/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Package, PlusCircle, ArrowRight, Clock, CheckCircle2 } from 'lucide-react'
import { formatRelativeDate } from '@/shared/lib/utils'

interface DashboardContentProps {
  company: Company
  rfqs: RFQWithRelations[]
  user: User
}

export function DashboardContent({ company, rfqs, user }: DashboardContentProps) {
  const openRFQs = rfqs.filter((rfq) => rfq.status === 'open')
  const completedRFQs = rfqs.filter((rfq) => rfq.status === 'completed')

  const fullName = user.user_metadata?.full_name || 'Пользователь'

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">
          С возвращением, {fullName}!
        </h1>
        <p className="text-muted-foreground">
          Обзор вашей активности на платформе Закупка
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {company.buyerEnabled && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Открытые запросы</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{openRFQs.length}</div>
                <p className="text-xs text-muted-foreground">Активных запросов</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Завершённые</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedRFQs.length}</div>
                <p className="text-xs text-muted-foreground">Успешно закрытых запросов</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Всего предложений</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {rfqs.reduce((sum, rfq) => sum + (rfq.offersCount || 0), 0)}
                </div>
                <p className="text-xs text-muted-foreground">По всем вашим запросам</p>
              </CardContent>
            </Card>
          </>
        )}

        {company.supplierEnabled && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Просмотр запросов</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Найдите и отправьте предложения на открытые запросы
              </p>
              <Button asChild variant="link" className="mt-2 h-auto p-0">
                <Link href="/rfqs">
                  Перейти <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        {company.buyerEnabled && (
          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
              <CardDescription>Основные действия для покупателей</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full justify-start">
                <Link href="/my-rfqs/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Создать новый запрос
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/my-rfqs">
                  <FileText className="mr-2 h-4 w-4" />
                  Управление запросами
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {company.supplierEnabled && (
          <Card>
            <CardHeader>
              <CardTitle>Для поставщиков</CardTitle>
              <CardDescription>Найдите возможности и отправьте предложения</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full justify-start">
                <Link href="/rfqs">
                  <FileText className="mr-2 h-4 w-4" />
                  Просмотр открытых запросов
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent RFQs (for buyers) */}
      {company.buyerEnabled && openRFQs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ваши недавние запросы</CardTitle>
            <CardDescription>Последние открытые запросы</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {openRFQs.slice(0, 5).map((rfq) => (
                <div
                  key={rfq.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <Link
                      href={`/rfqs/${rfq.id}`}
                      className="font-medium hover:text-primary hover:underline"
                    >
                      {rfq.title}
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Срок: {formatRelativeDate(rfq.deadline)}</span>
                      {rfq.category && (
                        <>
                          <span>•</span>
                          <span>{rfq.category.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{rfq.offersCount || 0} предл.</Badge>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/rfqs/${rfq.id}`}>Открыть</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {openRFQs.length > 5 && (
              <Button asChild variant="link" className="mt-4">
                <Link href="/my-rfqs">
                  Все запросы <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
