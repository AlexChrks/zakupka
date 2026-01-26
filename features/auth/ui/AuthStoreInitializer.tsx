'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/shared/stores/auth-store'
import { Company } from '@/entities/company/types'

interface AuthStoreInitializerProps {
  company: Company
}

export function AuthStoreInitializer({ company }: AuthStoreInitializerProps) {
  const setCurrentCompany = useAuthStore((state) => state.setCurrentCompany)
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      setCurrentCompany(company)
      initialized.current = true
    }
  }, [company, setCurrentCompany])

  return null
}
