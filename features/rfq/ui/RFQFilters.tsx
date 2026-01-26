'use client'

import { useCategories } from '@/shared/hooks/use-rfqs'
import { useRFQStore, selectActiveFiltersCount } from '@/shared/stores/rfq-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, Filter, Search } from 'lucide-react'

export function RFQFilters() {
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const filters = useRFQStore((state) => state.filters)
  const setFilters = useRFQStore((state) => state.setFilters)
  const clearFilters = useRFQStore((state) => state.clearFilters)
  const activeCount = useRFQStore(selectActiveFiltersCount)

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <h3 className="font-medium">Фильтры</h3>
          {activeCount > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" />
            Сбросить
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Поиск</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Поиск запросов..."
              className="pl-9"
              value={filters.search || ''}
              onChange={(e) => setFilters({ search: e.target.value || undefined })}
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Категория</Label>
          <Select
            value={filters.categoryId || 'all'}
            onValueChange={(value) =>
              setFilters({ categoryId: value === 'all' ? undefined : value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Все категории" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              {!categoriesLoading &&
                categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Местоположение</Label>
          <Input
            id="location"
            placeholder="Любое"
            value={filters.location || ''}
            onChange={(e) => setFilters({ location: e.target.value || undefined })}
          />
        </div>

        {/* Deadline */}
        <div className="space-y-2">
          <Label htmlFor="deadline">Срок до</Label>
          <Input
            id="deadline"
            type="date"
            value={filters.deadlineBefore?.split('T')[0] || ''}
            onChange={(e) =>
              setFilters({
                deadlineBefore: e.target.value ? new Date(e.target.value).toISOString() : undefined,
              })
            }
          />
        </div>
      </div>
    </div>
  )
}
