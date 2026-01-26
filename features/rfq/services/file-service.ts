'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { getSignedDownloadUrl, uploadRFQFile, deleteRFQFile, listRFQFiles } from '@/entities/file/repo'
import { RFQFile } from '@/entities/rfq/types'
import { revalidatePath } from 'next/cache'

export async function getSignedDownloadUrlAction(
  filePath: string
): Promise<{ url?: string; error?: string }> {
  try {
    const supabase = await createClient()
    const url = await getSignedDownloadUrl(supabase, filePath)
    return { url }
  } catch (error) {
    console.error('Get signed URL error:', error)
    return { error: 'Failed to get download URL' }
  }
}

export async function uploadRFQFileAction(
  rfqId: string,
  formData: FormData
): Promise<{ file?: RFQFile; error?: string }> {
  try {
    const supabase = await createClient()
    const file = formData.get('file') as File
    
    if (!file) {
      return { error: 'No file provided' }
    }

    const uploadedFile = await uploadRFQFile(supabase, { rfqId, file })
    revalidatePath(`/rfqs/${rfqId}`)
    revalidatePath(`/my-rfqs/${rfqId}/edit`)
    return { file: uploadedFile }
  } catch (error) {
    console.error('Upload file error:', error)
    return { error: 'Failed to upload file' }
  }
}

export async function deleteRFQFileAction(
  fileId: string,
  rfqId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    await deleteRFQFile(supabase, fileId)
    revalidatePath(`/rfqs/${rfqId}`)
    revalidatePath(`/my-rfqs/${rfqId}/edit`)
    return { success: true }
  } catch (error) {
    console.error('Delete file error:', error)
    return { error: 'Failed to delete file' }
  }
}

export async function listRFQFilesAction(rfqId: string): Promise<RFQFile[]> {
  const supabase = await createClient()
  return listRFQFiles(supabase, rfqId)
}
