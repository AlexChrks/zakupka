import { RFQStatus } from '@/entities/rfq/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface RFQStatusBadgeProps {
  status: RFQStatus
  size?: 'default' | 'sm' | 'responsive'
}

const statusConfig: Record<RFQStatus, { label: string; className: string }> = {
  open: { 
    label: 'Открыт', 
    className: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' 
  },
  completed: { 
    label: 'Завершён', 
    className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' 
  },
  cancelled: { 
    label: 'Отменён', 
    className: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' 
  },
}

export function RFQStatusBadge({ status, size = 'default' }: RFQStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge 
      variant="outline" 
      size={size}
      className={cn(config.className)}
    >
      {config.label}
    </Badge>
  )
}
