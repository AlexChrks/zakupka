'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { ModalRenderer } from '@/shared/ui/ModalRenderer'

// Modal types and their payloads
export type ModalType =
  | 'confirm-cancel-rfq'
  | 'confirm-select-winner'
  | 'confirm-delete'
  | null

export interface ModalPayloads {
  'confirm-cancel-rfq': { rfqId: string; rfqTitle: string }
  'confirm-select-winner': { offerId: string; rfqId: string; companyName: string; price: number }
  'confirm-delete': { id: string; type: string; name: string }
}

interface ModalState {
  type: ModalType
  payload: ModalPayloads[keyof ModalPayloads] | null
  onConfirm: (() => void | Promise<void>) | null
}

interface ModalContextValue {
  modalState: ModalState
  openModal: <T extends NonNullable<ModalType>>(
    type: T,
    payload: ModalPayloads[T],
    onConfirm: () => void | Promise<void>
  ) => void
  closeModal: () => void
  isOpen: boolean
}

const ModalContext = createContext<ModalContextValue | null>(null)

const initialState: ModalState = {
  type: null,
  payload: null,
  onConfirm: null,
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<ModalState>(initialState)

  const openModal = useCallback<ModalContextValue['openModal']>((type, payload, onConfirm) => {
    setModalState({ type, payload, onConfirm })
  }, [])

  const closeModal = useCallback(() => {
    setModalState(initialState)
  }, [])

  const isOpen = modalState.type !== null

  return (
    <ModalContext.Provider value={{ modalState, openModal, closeModal, isOpen }}>
      {children}
      <ModalRenderer />
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

// Type-safe helper hooks for specific modals
export function useCancelRFQModal() {
  const { openModal, closeModal } = useModal()
  
  return {
    open: (payload: ModalPayloads['confirm-cancel-rfq'], onConfirm: () => void | Promise<void>) =>
      openModal('confirm-cancel-rfq', payload, onConfirm),
    close: closeModal,
  }
}

export function useSelectWinnerModal() {
  const { openModal, closeModal } = useModal()
  
  return {
    open: (payload: ModalPayloads['confirm-select-winner'], onConfirm: () => void | Promise<void>) =>
      openModal('confirm-select-winner', payload, onConfirm),
    close: closeModal,
  }
}
