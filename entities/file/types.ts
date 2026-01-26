export interface UploadedFile {
  path: string
  fullPath: string
}

export interface FileMetadata {
  id: string
  rfqId: string
  fileName: string
  filePath: string
  fileSize: number | null
  mimeType: string | null
  createdAt: string
}

export interface SignedUrl {
  signedUrl: string
  path: string
}
