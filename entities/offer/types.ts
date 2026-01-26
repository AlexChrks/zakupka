export interface Offer {
  id: string
  rfqId: string
  companyId: string
  price: number
  currency: string
  deliveryDays: number | null
  notes: string | null
  isSelected: boolean
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface OfferWithCompany extends Offer {
  company: {
    id: string
    name: string
    location: string | null
  }
}

// Database row types (snake_case from Supabase)
export interface OfferRow {
  id: string
  rfq_id: string
  company_id: string
  price: number
  currency: string
  delivery_days: number | null
  notes: string | null
  is_selected: boolean
  deleted_at: string | null
  created_at: string
  updated_at: string
}

// Transform functions
export function offerFromRow(row: OfferRow): Offer {
  return {
    id: row.id,
    rfqId: row.rfq_id,
    companyId: row.company_id,
    price: row.price,
    currency: row.currency,
    deliveryDays: row.delivery_days,
    notes: row.notes,
    isSelected: row.is_selected,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
