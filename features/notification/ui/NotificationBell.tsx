'use client'

import { useEffect, useState } from 'react'
import { Bell, Package, FileText, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/shared/lib/supabase/client'
import { getNotificationCounts } from '@/entities/notification/repo'
import { markOffersSeenAction, markRfqsSeenAction, markWinsSeenAction } from '../services/notification-actions'
import Link from 'next/link'

interface NotificationBellProps {
  userId: string
  isBuyer: boolean
  isSupplier: boolean
}

export function NotificationBell({ userId, isBuyer, isSupplier }: NotificationBellProps) {
  const [newOffers, setNewOffers] = useState(0)
  const [newRfqs, setNewRfqs] = useState(0)
  const [newWins, setNewWins] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const totalCount = (isBuyer ? newOffers : 0) + (isSupplier ? (newRfqs + newWins) : 0)

  useEffect(() => {
    const fetchCounts = async () => {
      const supabase = createClient()
      const counts = await getNotificationCounts(supabase, userId)
      setNewOffers(counts.newOffers)
      setNewRfqs(counts.newRfqs)
      setNewWins(counts.newWins)
    }

    fetchCounts()

    // Refresh every 60 seconds
    const interval = setInterval(fetchCounts, 60000)
    return () => clearInterval(interval)
  }, [userId])

  const handleMarkOffersSeen = async () => {
    await markOffersSeenAction()
    setNewOffers(0)
    setIsOpen(false)
  }

  const handleMarkRfqsSeen = async () => {
    await markRfqsSeenAction()
    setNewRfqs(0)
    setIsOpen(false)
  }

  const handleMarkWinsSeen = async () => {
    await markWinsSeenAction()
    setNewWins(0)
    setIsOpen(false)
  }

  // Don't show bell if user is neither buyer nor supplier
  if (!isBuyer && !isSupplier) {
    return null
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {totalCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
            >
              {totalCount > 99 ? '99+' : totalCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>Уведомления</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {totalCount === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Нет новых уведомлений
          </div>
        ) : (
          <>
            {isBuyer && newOffers > 0 && (
              <DropdownMenuItem asChild>
                <Link
                  href="/my-rfqs"
                  onClick={handleMarkOffersSeen}
                  className="flex items-start gap-3 p-3 cursor-pointer"
                >
                  <div className="rounded-full bg-blue-100 p-2">
                    <Package className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Новые предложения</p>
                    <p className="text-xs text-muted-foreground">
                      {newOffers} {getOffersWord(newOffers)} на ваши заявки
                    </p>
                  </div>
                  <Badge variant="secondary">{newOffers}</Badge>
                </Link>
              </DropdownMenuItem>
            )}

            {isSupplier && newWins > 0 && (
              <DropdownMenuItem asChild>
                <Link
                  href="/my-rfqs"
                  onClick={handleMarkWinsSeen}
                  className="flex items-start gap-3 p-3 cursor-pointer"
                >
                  <div className="rounded-full bg-yellow-100 p-2">
                    <Trophy className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Вы победили!</p>
                    <p className="text-xs text-muted-foreground">
                      {newWins} {getWinsWord(newWins)} выбрали ваше предложение
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">{newWins}</Badge>
                </Link>
              </DropdownMenuItem>
            )}

            {isSupplier && newRfqs > 0 && (
              <DropdownMenuItem asChild>
                <Link
                  href="/rfqs"
                  onClick={handleMarkRfqsSeen}
                  className="flex items-start gap-3 p-3 cursor-pointer"
                >
                  <div className="rounded-full bg-green-100 p-2">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Новые заявки</p>
                    <p className="text-xs text-muted-foreground">
                      {newRfqs} {getRfqsWord(newRfqs)} для вашего предложения
                    </p>
                  </div>
                  <Badge variant="secondary">{newRfqs}</Badge>
                </Link>
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Russian pluralization helpers
function getOffersWord(count: number): string {
  const lastTwo = count % 100
  const lastOne = count % 10

  if (lastTwo >= 11 && lastTwo <= 19) return 'предложений'
  if (lastOne === 1) return 'предложение'
  if (lastOne >= 2 && lastOne <= 4) return 'предложения'
  return 'предложений'
}

function getRfqsWord(count: number): string {
  const lastTwo = count % 100
  const lastOne = count % 10

  if (lastTwo >= 11 && lastTwo <= 19) return 'заявок'
  if (lastOne === 1) return 'заявка'
  if (lastOne >= 2 && lastOne <= 4) return 'заявки'
  return 'заявок'
}

function getWinsWord(count: number): string {
  const lastTwo = count % 100
  const lastOne = count % 10

  if (lastTwo >= 11 && lastTwo <= 19) return 'покупателей'
  if (lastOne === 1) return 'покупатель'
  if (lastOne >= 2 && lastOne <= 4) return 'покупателя'
  return 'покупателей'
}
