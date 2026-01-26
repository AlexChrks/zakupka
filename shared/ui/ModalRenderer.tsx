'use client'

import { useModal, ModalPayloads } from '@/shared/context/modal-context'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { formatCurrency } from '@/shared/lib/utils'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export function ModalRenderer() {
  const { modalState, closeModal, isOpen } = useModal()
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    if (!modalState.onConfirm) return
    
    setIsLoading(true)
    try {
      await modalState.onConfirm()
    } finally {
      setIsLoading(false)
      closeModal()
    }
  }

  if (!isOpen) return null

  if (modalState.type === 'confirm-cancel-rfq') {
    const payload = modalState.payload as ModalPayloads['confirm-cancel-rfq']
    return (
      <AlertDialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Отменить запрос?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите отменить «{payload.rfqTitle}»? Это действие нельзя отменить,
              и поставщики больше не смогут отправлять предложения.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Оставить открытым</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Отменить запрос
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  if (modalState.type === 'confirm-select-winner') {
    const payload = modalState.payload as ModalPayloads['confirm-select-winner']
    return (
      <AlertDialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Выбрать победителя?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите выбрать <strong>{payload.companyName}</strong> победителем
              с предложением <strong>{formatCurrency(payload.price)}</strong>?
              <br />
              <br />
              Вы сможете изменить победителя позже, пока запрос открыт.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Выбрать победителя
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  if (modalState.type === 'confirm-delete') {
    const payload = modalState.payload as ModalPayloads['confirm-delete']
    return (
      <AlertDialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить {payload.type}?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить «{payload.name}»? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return null
}
