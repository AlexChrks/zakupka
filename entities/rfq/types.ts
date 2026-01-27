export type RFQStatus = 'open' | 'completed' | 'cancelled'

export interface Category {
  id: string
  name: string
  createdAt: string
}

export interface RFQ {
  id: string
  companyId: string
  title: string
  description: string | null
  categoryId: string | null
  quantity: string | null
  budgetMin: number | null
  budgetMax: number | null
  deadline: string
  status: RFQStatus
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface RFQWithRelations extends RFQ {
  company?: {
    id: string
    name: string
    location: string | null
    contactPhone: string | null
    contactEmail: string | null
    contactPerson: string | null
  }
  category?: Category | null
  offersCount?: number
}

export interface RFQFile {
  id: string
  rfqId: string
  fileName: string
  filePath: string
  fileSize: number | null
  mimeType: string | null
  createdAt: string
}

// Database row types (snake_case from Supabase)
export interface CategoryRow {
  id: string
  name: string
  created_at: string
}

export interface RFQRow {
  id: string
  company_id: string
  title: string
  description: string | null
  category_id: string | null
  quantity: string | null
  budget_min: number | null
  budget_max: number | null
  deadline: string
  status: RFQStatus
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface RFQFileRow {
  id: string
  rfq_id: string
  file_name: string
  file_path: string
  file_size: number | null
  mime_type: string | null
  created_at: string
}

// Transform functions
export function categoryFromRow(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
  }
}

export function rfqFromRow(row: RFQRow): RFQ {
  return {
    id: row.id,
    companyId: row.company_id,
    title: row.title,
    description: row.description,
    categoryId: row.category_id,
    quantity: row.quantity,
    budgetMin: row.budget_min,
    budgetMax: row.budget_max,
    deadline: row.deadline,
    status: row.status,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function rfqFileFromRow(row: RFQFileRow): RFQFile {
  return {
    id: row.id,
    rfqId: row.rfq_id,
    fileName: row.file_name,
    filePath: row.file_path,
    fileSize: row.file_size,
    mimeType: row.mime_type,
    createdAt: row.created_at,
  }
}
