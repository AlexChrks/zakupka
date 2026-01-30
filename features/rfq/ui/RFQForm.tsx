'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Category, RFQFile } from '@/entities/rfq/types'
import { rfqFormSchema, RFQFormValues } from '@/shared/validation/rfq'
import { useRFQStore } from '@/shared/stores/rfq-store'
import { uploadRFQFileAction, deleteRFQFileAction } from '@/features/rfq/services/file-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Upload, X, FileIcon } from 'lucide-react'
import { toast } from 'sonner'

interface RFQFormProps {
  categories: Category[]
  defaultValues?: Partial<RFQFormValues>
  onSubmit: (values: RFQFormValues) => Promise<void>
  isSubmitting: boolean
  rfqId?: string
  existingFiles?: RFQFile[]
  mode: 'create' | 'edit'
}

export function RFQForm({
  categories,
  defaultValues,
  onSubmit,
  isSubmitting,
  rfqId,
  existingFiles = [],
  mode,
}: RFQFormProps) {
  const router = useRouter()
  const draftRFQ = useRFQStore((state) => state.draftRFQ)
  const setDraftRFQ = useRFQStore((state) => state.setDraftRFQ)

  const [files, setFiles] = useState<RFQFile[]>(existingFiles)
  const [isUploading, setIsUploading] = useState(false)

  const initialValues = mode === 'create' && draftRFQ ? { ...draftRFQ } : defaultValues

  const form = useForm<RFQFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(rfqFormSchema) as any,
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      categoryId: initialValues?.categoryId || '',
      quantity: initialValues?.quantity || '',
      budgetMin: initialValues?.budgetMin ?? undefined,
      budgetMax: initialValues?.budgetMax ?? undefined,
      deadline: initialValues?.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })

  useEffect(() => {
    if (mode !== 'create') return

    const subscription = form.watch((values) => {
      setDraftRFQ(values as Partial<RFQFormValues>)
    })
    return () => subscription.unsubscribe()
  }, [form, mode, setDraftRFQ])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!rfqId || !event.target.files?.length) return

    setIsUploading(true)
    const fileList = Array.from(event.target.files)

    for (const file of fileList) {
      const formData = new FormData()
      formData.append('file', file)

      const result = await uploadRFQFileAction(rfqId, formData)
      if (result.error) {
        toast.error(`Не удалось загрузить ${file.name}`)
      } else if (result.file) {
        setFiles((prev) => [...prev, result.file!])
        toast.success(`${file.name} загружен`)
      }
    }

    setIsUploading(false)
    event.target.value = ''
  }

  const handleFileDelete = async (fileId: string) => {
    if (!rfqId) return

    const result = await deleteRFQFileAction(fileId, rfqId)
    if (result.error) {
      toast.error('Не удалось удалить файл')
    } else {
      setFiles((prev) => prev.filter((f) => f.id !== fileId))
      toast.success('Файл удалён')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Название *</FormLabel>
                  <FormControl>
                    <Input placeholder="напр., Офисная мебель для нового офиса" {...field} />
                  </FormControl>
                  <FormDescription>Краткое и понятное название запроса</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Подробные требования, спецификации и другая важная информация..."
                      className="min-h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Категория *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Требования</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Количество</FormLabel>
                  <FormControl>
                    <Input placeholder="напр., 100 шт., 500 кг" {...field} />
                  </FormControl>
                  <FormDescription>Укажите объём или количество</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="budgetMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Минимальный бюджет (BYN)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budgetMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Максимальный бюджет (BYN)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Срок приёма предложений *</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().slice(0, 16)
                          : ''
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Последний срок для подачи предложений поставщиками
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {mode === 'edit' && rfqId && (
          <Card>
            <CardHeader>
              <CardTitle>Вложения</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileIcon className="h-6 w-6 text-muted-foreground" />
                        <span className="text-sm font-medium">{file.fileName}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFileDelete(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-center rounded-lg border border-dashed p-6">
                <label className="flex cursor-pointer flex-col items-center gap-2">
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {isUploading ? 'Загрузка...' : 'Нажмите для загрузки файлов'}
                  </span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.back()}
          >
            Отмена
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? 'Создать запрос' : 'Сохранить изменения'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
