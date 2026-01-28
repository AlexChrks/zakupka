'use client'

import { User } from '@supabase/supabase-js'
import { Company } from '@/entities/company/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Building2, LogOut, User as UserIcon } from 'lucide-react'
import { logout } from '@/features/auth/services/auth-actions'
import Link from 'next/link'
import { MobileNav } from './MobileNav'
import { NotificationBell } from '@/features/notification/ui'
import Image from 'next/image'
interface DashboardHeaderProps {
  user: User
  company: Company
}

export function DashboardHeader({ user, company }: DashboardHeaderProps) {
  const initials =
    user.user_metadata?.full_name
      ?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase() || user.email?.[0].toUpperCase() || 'U'

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <MobileNav company={company} />
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Image className="mt-2" src="/logo_with_text.png" alt="Закупка" width={190} height={40} />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell
            userId={user.id}
            isBuyer={company.buyerEnabled}
            isSupplier={company.supplierEnabled}
          />
          <span className="hidden text-sm text-muted-foreground md:inline">{company.name}</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.user_metadata?.full_name || 'Пользователь'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Главная
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Выйти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
