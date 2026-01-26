import { SupabaseClient } from '@supabase/supabase-js'
import { RFQFile, RFQFileRow, rfqFileFromRow } from '@/entities/rfq/types'

const STORAGE_BUCKET = 'rfq-files'

export interface UploadFileData {
  rfqId: string
  file: File
}

export async function uploadRFQFile(
  supabase: SupabaseClient,
  data: UploadFileData
): Promise<RFQFile> {
  const { rfqId, file } = data
  
  // Generate unique file path
  const fileExt = file.name.split('.').pop()
  const fileName = `${rfqId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file)

  if (uploadError) throw uploadError

  // Create metadata record
  const { data: row, error: insertError } = await supabase
    .from('rfq_files')
    .insert({
      rfq_id: rfqId,
      file_name: file.name,
      file_path: fileName,
      file_size: file.size,
      mime_type: file.type || null,
    })
    .select()
    .single<RFQFileRow>()

  if (insertError) {
    // Clean up uploaded file if metadata insert fails
    await supabase.storage.from(STORAGE_BUCKET).remove([fileName])
    throw insertError
  }

  return rfqFileFromRow(row)
}

export async function listRFQFiles(
  supabase: SupabaseClient,
  rfqId: string
): Promise<RFQFile[]> {
  const { data: rows, error } = await supabase
    .from('rfq_files')
    .select('*')
    .eq('rfq_id', rfqId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (rows as RFQFileRow[]).map(rfqFileFromRow)
}

export async function getSignedDownloadUrl(
  supabase: SupabaseClient,
  filePath: string,
  expiresIn = 3600 // 1 hour default
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(filePath, expiresIn)

  if (error) throw error
  return data.signedUrl
}

export async function deleteRFQFile(
  supabase: SupabaseClient,
  fileId: string
): Promise<void> {
  // Get file info first
  const { data: fileRow, error: fetchError } = await supabase
    .from('rfq_files')
    .select('file_path')
    .eq('id', fileId)
    .single<{ file_path: string }>()

  if (fetchError) throw fetchError

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([fileRow.file_path])

  if (storageError) throw storageError

  // Delete metadata record
  const { error: deleteError } = await supabase
    .from('rfq_files')
    .delete()
    .eq('id', fileId)

  if (deleteError) throw deleteError
}

export async function getFileById(
  supabase: SupabaseClient,
  fileId: string
): Promise<RFQFile | null> {
  const { data: row, error } = await supabase
    .from('rfq_files')
    .select('*')
    .eq('id', fileId)
    .single<RFQFileRow>()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return rfqFileFromRow(row)
}
