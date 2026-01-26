'use client'

import { useState } from 'react'
import { RFQFile } from '@/entities/rfq/types'
import { Button } from '@/components/ui/button'
import { FileIcon, Download, Loader2 } from 'lucide-react'
import { getSignedDownloadUrlAction } from '@/features/rfq/services/file-service'
import { toast } from 'sonner'

interface RFQFilesProps {
  files: RFQFile[]
}

export function RFQFiles({ files }: RFQFilesProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const handleDownload = async (file: RFQFile) => {
    setDownloadingId(file.id)
    try {
      const result = await getSignedDownloadUrlAction(file.filePath)
      if (result.error) {
        toast.error(result.error)
        return
      }
      
      window.open(result.url, '_blank')
    } catch {
      toast.error('Не удалось скачать файл')
    } finally {
      setDownloadingId(null)
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Размер неизвестен'
    if (bytes < 1024) return `${bytes} Б`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <div className="flex items-center gap-3">
            <FileIcon className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">{file.fileName}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.fileSize)}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDownload(file)}
            disabled={downloadingId === file.id}
          >
            {downloadingId === file.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        </div>
      ))}
    </div>
  )
}
