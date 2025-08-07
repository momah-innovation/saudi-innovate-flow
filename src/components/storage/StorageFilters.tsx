import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Filter, 
  X, 
  ArrowUpDown,
  FileImage,
  FileText,
  FileVideo,
  FileAudio,
  File
} from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

export interface FilterOptions {
  fileType: string;
  bucket: string;
  visibility: string;
  sizeRange: string;
  dateRange: string;
}

export interface SortOptions {
  field: 'name' | 'size' | 'date' | 'type';
  direction: 'asc' | 'desc';
}

interface StorageFiltersProps {
  buckets: any[];
  filters: FilterOptions;
  sortBy: SortOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onSortChange: (sort: SortOptions) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export function StorageFilters({
  buckets,
  filters,
  sortBy,
  onFiltersChange,
  onSortChange,
  onClearFilters,
  activeFilterCount
}: StorageFiltersProps) {
  const { t, isRTL } = useUnifiedTranslation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fileTypeOptions = [
    { value: 'all', label: t('all_types'), icon: File },
    { value: 'image', label: t('images'), icon: FileImage },
    { value: 'document', label: t('documents'), icon: FileText },
    { value: 'video', label: t('videos'), icon: FileVideo },
    { value: 'audio', label: t('audio'), icon: FileAudio },
  ];

  const sizeRangeOptions = [
    { value: 'all', label: t('any_size') },
    { value: 'small', label: t('small_1mb') },
    { value: 'medium', label: t('medium_1_10mb') },
    { value: 'large', label: t('large_10mb') },
  ];

  const dateRangeOptions = [
    { value: 'all', label: t('any_date') },
    { value: 'today', label: t('today') },
    { value: 'week', label: t('this_week') },
    { value: 'month', label: t('this_month') },
    { value: 'year', label: t('this_year') },
  ];

  const sortOptions = [
    { value: 'name', label: t('name') },
    { value: 'size', label: t('size') },
    { value: 'date', label: t('date_modified') },
    { value: 'type', label: t('file_type') },
  ];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : 'font-english'}>
    <div className="flex flex-wrap items-center gap-3">
      {/* Sort Controls */}
      <div className="flex items-center gap-2">
        <Select
          value={sortBy.field}
          onValueChange={(field) => onSortChange({ ...sortBy, field: field as any })}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder={t('sort_by')} />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-lg z-50">
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onSortChange({ 
            ...sortBy, 
            direction: sortBy.direction === 'asc' ? 'desc' : 'asc' 
          })}
          className="px-2"
        >
          <ArrowUpDown className="w-4 h-4" />
          {sortBy.direction === 'asc' ? t('a_z') : t('z_a')}
        </Button>
      </div>

      {/* Filter Controls */}
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Filter className="w-4 h-4 mr-2" />
            {t('filters')}
            {activeFilterCount > 0 && (
              <Badge 
                variant="destructive" 
                className="ml-2 px-1.5 py-0.5 text-xs min-w-0"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-background border shadow-lg z-50" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{t('filters')}</h4>
              {activeFilterCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClearFilters}
                  className="text-xs"
                >
                  <X className="w-3 h-3 mr-1" />
                  {t('clear_all')}
                </Button>
              )}
            </div>

            {/* File Type Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">{t('file_type')}</label>
              <Select
                value={filters.fileType}
                onValueChange={(value) => onFiltersChange({ ...filters, fileType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('all_types')} />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  {fileTypeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <Icon className="w-4 h-4 mr-2" />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Bucket Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">{t('bucket')}</label>
              <Select
                value={filters.bucket}
                onValueChange={(value) => onFiltersChange({ ...filters, bucket: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('all_buckets')} />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="all">{t('all_buckets')}</SelectItem>
                  {buckets.map((bucket) => (
                    <SelectItem key={bucket.id} value={bucket.id}>
                      {bucket.name || bucket.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Visibility Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">{t('visibility')}</label>
              <Select
                value={filters.visibility}
                onValueChange={(value) => onFiltersChange({ ...filters, visibility: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('all_files')} />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="all">{t('all_files')}</SelectItem>
                  <SelectItem value="public">{t('public_only')}</SelectItem>
                  <SelectItem value="private">{t('private_only')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Size Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">{t('file_size')}</label>
              <Select
                value={filters.sizeRange}
                onValueChange={(value) => onFiltersChange({ ...filters, sizeRange: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('any_size')} />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  {sizeRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">{t('date_added')}</label>
              <Select
                value={filters.dateRange}
                onValueChange={(value) => onFiltersChange({ ...filters, dateRange: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('any_date')} />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  {dateRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1">
          {filters.fileType && filters.fileType !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              {t('file_type')}: {fileTypeOptions.find(o => o.value === filters.fileType)?.label}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer" 
                onClick={() => onFiltersChange({ ...filters, fileType: 'all' })}
              />
            </Badge>
          )}
          {filters.bucket && filters.bucket !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              {t('bucket_label')}: {buckets.find(b => b.id === filters.bucket)?.name || filters.bucket}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer" 
                onClick={() => onFiltersChange({ ...filters, bucket: 'all' })}
              />
            </Badge>
          )}
          {filters.visibility && filters.visibility !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              {filters.visibility === 'public' ? t('public') : t('private')}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer" 
                onClick={() => onFiltersChange({ ...filters, visibility: 'all' })}
              />
            </Badge>
          )}
          {filters.sizeRange && filters.sizeRange !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              {sizeRangeOptions.find(o => o.value === filters.sizeRange)?.label}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer" 
                onClick={() => onFiltersChange({ ...filters, sizeRange: 'all' })}
              />
            </Badge>
          )}
          {filters.dateRange && filters.dateRange !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              {dateRangeOptions.find(o => o.value === filters.dateRange)?.label}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer" 
                onClick={() => onFiltersChange({ ...filters, dateRange: 'all' })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
    </div>
  );
}