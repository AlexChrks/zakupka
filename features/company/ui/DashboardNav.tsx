'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Company } from '@/entities/company/types'
import { cn } from '@/lib/utils'
import { LayoutDashboard, FileText, Package, PlusCircle } from 'lucide-react'

interface DashboardNavProps {
  company: Company
}

export function DashboardNav({ company }: DashboardNavProps) {
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
    <nav className="hidden w-64 border-r bg-muted/40 md:block">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Навигация</h2>
          <div className="space-y-1">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
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
          </div>
        </div>

        <div className="mt-auto rounded-lg border bg-card p-4">
          <h3 className="font-medium">{company.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {company.buyerEnabled && company.supplierEnabled
              ? 'Покупатель и Поставщик'
              : company.buyerEnabled
                ? 'Покупатель'
                : 'Поставщик'}
          </p>
          {company.location && (
            <p className="mt-1 text-xs text-muted-foreground">{company.location}</p>
          )}
        </div>
      </div>
    </nav>
  )
}
