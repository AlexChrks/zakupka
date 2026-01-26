'use client'

import { useState } from 'react'
import { RFQWithRelations } from '@/entities/rfq/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUpdateRFQStatus } from '@/shared/hooks/use-rfqs'
import { useCancelRFQModal } from '@/shared/context/modal-context'
import { ChevronDown, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface RFQStatusActionsProps {
  rfq: RFQWithRelations
}

export function RFQStatusActions({ rfq }: RFQStatusActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const updateStatus = useUpdateRFQStatus()
  const cancelModal = useCancelRFQModal()

  const handleComplete = async () => {
    setIsOpen(false)
    updateStatus.mutate(
      { rfqId: rfq.id, status: 'completed' },
      {
        onSuccess: () => toast.success('Запрос отмечен как завершённый'),
        onError: () => toast.error('Не удалось обновить статус'),
      }
    )
  }

  const handleCancel = () => {
    setIsOpen(false)
    cancelModal.open(
      { rfqId: rfq.id, rfqTitle: rfq.title },
      async () => {
        updateStatus.mutate(
          { rfqId: rfq.id, status: 'cancelled' },
          {
            onSuccess: () => toast.success('Запрос отменён'),
            onError: () => toast.error('Не удалось отменить запрос'),
          }
        )
      }
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={updateStatus.isPending}>
          {updateStatus.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'Действия'
          )}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleComplete}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Завершить
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCancel} className="text-destructive">
          <XCircle className="mr-2 h-4 w-4" />
          Отменить запрос
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
