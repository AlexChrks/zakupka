// Re-export for convenient imports
// Use createClient from './server' for Server Components and Server Actions
// Use createClient from './client' for Client Components
export { createClient as createServerClient } from './server'
export { createClient as createBrowserClient } from './client'
