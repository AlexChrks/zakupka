import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RFQFormValues } from '@/shared/validation/rfq'

export interface RFQFilters {
  categoryId?: string
  location?: string
  deadlineBefore?: string
  search?: string
}

interface RFQStore {
  // Filters for public RFQ browsing
  filters: RFQFilters
  setFilters: (filters: Partial<RFQFilters>) => void
  clearFilters: () => void

  // Selected RFQ for detail view
  selectedRFQId: string | null
  setSelectedRFQ: (id: string | null) => void

  // Draft RFQ form state (for persistence during navigation)
  draftRFQ: Partial<RFQFormValues> | null
  setDraftRFQ: (draft: Partial<RFQFormValues> | null) => void
  clearDraftRFQ: () => void
}

export const useRFQStore = create<RFQStore>()(
  persist(
    (set) => ({
      // Filters
      filters: {},
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      clearFilters: () => set({ filters: {} }),

      // Selected RFQ
      selectedRFQId: null,
      setSelectedRFQ: (id) => set({ selectedRFQId: id }),

      // Draft RFQ
      draftRFQ: null,
      setDraftRFQ: (draft) => set({ draftRFQ: draft }),
      clearDraftRFQ: () => set({ draftRFQ: null }),
    }),
    {
      name: 'rfq-store',
      partialize: (state) => ({
        // Only persist draft, not filters or selection
        draftRFQ: state.draftRFQ,
      }),
    }
  )
)

// Selectors
export const selectActiveFiltersCount = (state: RFQStore) =>
  Object.values(state.filters).filter(Boolean).length

export const selectHasActiveFilters = (state: RFQStore) =>
  Object.values(state.filters).some(Boolean)
