'use client'

import { ReactNode } from 'react'
import { QueryProvider } from '@/shared/lib/react-query/provider'
import { ModalProvider } from '@/shared/context/modal-context'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <ModalProvider>{children}</ModalProvider>
    </QueryProvider>
  )
}
