import React from 'react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'search' | 'multi-select';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export interface FilterPanelProps {
  filters: FilterConfig[];
  values: Record<string, string | string[]>;
  onFilterChange: (key: string, value: string | string[]) => void;
  onClearAll: () => void;
  activeFiltersCount?: number;
  className?: string;
}

export function FilterPanel({
  filters,
  values,
  onFilterChange,
  onClearAll,
  activeFiltersCount = 0,
  className
}: FilterPanelProps) {
  const { t } = useUnifiedTranslation();

  const renderFilter = (filter: FilterConfig) => {
    const value = values[filter.key] || (filter.type === 'multi-select' ? [] : '');

    switch (filter.type) {
      case 'search':
        return (
          <Input
            key={filter.key}
            placeholder={filter.placeholder || t('filter.search_placeholder', 'Search {{label}}...', { label: filter.label.toLowerCase() })}
            value={value as string}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            className="max-w-sm"
          />
        );

      case 'select':
        return (
          <Select
            key={filter.key}
            value={value as string}
            onValueChange={(newValue) => onFilterChange(filter.key, newValue)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={filter.placeholder || filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('filter.all', 'All')}</SelectItem>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multi-select':
        // For now, return a simple implementation. Can be enhanced with a proper multi-select component
        return (
          <Select
            key={filter.key}
            value={(value as string[])?.[0] || ''}
            onValueChange={(newValue) => onFilterChange(filter.key, [newValue])}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={filter.placeholder || filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('filter.all', 'All')}</SelectItem>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{t('filter.title', 'Filters')}</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-8 px-2 lg:px-3"
          >
            <X className="mr-1 h-3 w-3" />
            {t('filter.clear_all', 'Clear all')}
          </Button>
        )}
      </div>
      
      <Separator />
      
      <div className="flex flex-wrap gap-3">
        {filters.map(renderFilter)}
      </div>
      
      {activeFiltersCount > 0 && (
        <>
          <Separator />
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const value = values[filter.key];
              if (!value || (Array.isArray(value) && value.length === 0) || value === '') {
                return null;
              }
              
              return (
                <Badge key={filter.key} variant="outline" className="gap-1">
                  <span className="text-xs">{filter.label}:</span>
                  <span className="text-xs font-medium">
                    {Array.isArray(value) ? value.join(', ') : value}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => onFilterChange(filter.key, Array.isArray(value) ? [] : '')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}