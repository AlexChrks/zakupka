import { create } from 'zustand'
import type { Company } from '@/entities/company/types'

interface AuthStore {
  // Current user's company (loaded after login)
  currentCompany: Company | null
  setCurrentCompany: (company: Company | null) => void

  // Registration wizard state
  registrationStep: number
  setRegistrationStep: (step: number) => void

  // Pending registration data (before final submit)
  registrationData: {
    email?: string
    password?: string
    fullName?: string
    companyName?: string
    description?: string
    industry?: string
    location?: string
    buyerEnabled?: boolean
    supplierEnabled?: boolean
  }
  setRegistrationData: (data: Partial<AuthStore['registrationData']>) => void
  clearRegistrationData: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  currentCompany: null,
  setCurrentCompany: (company) => set({ currentCompany: company }),

  registrationStep: 1,
  setRegistrationStep: (step) => set({ registrationStep: step }),

  registrationData: {},
  setRegistrationData: (data) =>
    set((state) => ({
      registrationData: { ...state.registrationData, ...data },
    })),
  clearRegistrationData: () => set({ registrationData: {}, registrationStep: 1 }),
}))
