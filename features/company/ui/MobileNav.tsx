'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Company } from '@/entities/company/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Menu, LayoutDashboard, FileText, Package, PlusCircle, Trophy } from 'lucide-react'

interface MobileNavProps {
  company: Company
}

export function MobileNav({ company }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    {
      title: 'Главная',
      href: '/dashboard',
      icon: LayoutDashboard,
      show: true,
    },
    {
      title: 'Запросы',
      href: '/rfqs',
      icon: FileText,
      show: company.supplierEnabled,
    },
    {
      title: 'Мои сделки',
      href: '/my-deals',
      icon: Trophy,
      show: company.supplierEnabled,
    },
    {
      title: 'Мои запросы',
      href: '/my-rfqs',
      icon: Package,
      show: company.buyerEnabled,
    },
    {
      title: 'Создать запрос',
      href: '/my-rfqs/new',
      icon: PlusCircle,
      show: company.buyerEnabled,
    },
  ]

  const visibleItems = navItems.filter((item) => item.show)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Открыть меню</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>{company.name}</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-2">
          {visibleItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
