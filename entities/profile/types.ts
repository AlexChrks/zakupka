export interface Profile {
  id: string
  fullName: string | null
  createdAt: string
  updatedAt: string
}

// Database row types (snake_case from Supabase)
export interface ProfileRow {
  id: string
  full_name: string | null
  created_at: string
  updated_at: string
}

// Transform functions
export function profileFromRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    fullName: row.full_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
