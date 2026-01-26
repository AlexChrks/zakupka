export type CompanyRole = 'owner' | 'member'

export interface Company {
  id: string
  name: string
  description: string | null
  industry: string | null
  location: string | null
  buyerEnabled: boolean
  supplierEnabled: boolean
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CompanyMember {
  id: string
  companyId: string
  userId: string
  role: CompanyRole
  createdAt: string
}

export interface CompanyWithMembers extends Company {
  members: CompanyMember[]
}

// Database row types (snake_case from Supabase)
export interface CompanyRow {
  id: string
  name: string
  description: string | null
  industry: string | null
  location: string | null
  buyer_enabled: boolean
  supplier_enabled: boolean
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface CompanyMemberRow {
  id: string
  company_id: string
  user_id: string
  role: CompanyRole
  created_at: string
}

// Transform functions
export function companyFromRow(row: CompanyRow): Company {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    industry: row.industry,
    location: row.location,
    buyerEnabled: row.buyer_enabled,
    supplierEnabled: row.supplier_enabled,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function companyMemberFromRow(row: CompanyMemberRow): CompanyMember {
  return {
    id: row.id,
    companyId: row.company_id,
    userId: row.user_id,
    role: row.role,
    createdAt: row.created_at,
  }
}
