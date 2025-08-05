import React, { useState } from 'react';
import { Search, Filter, SortAsc, SortDesc, X, Calendar } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { Badge } from './badge';
import { Card } from './card';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Checkbox } from './checkbox';
import { DateTimePicker } from './date-time-picker';
import { cn } from '@/lib/utils';

export interface SearchFilter {
  id: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'checkbox';
  options?: Array<{ value: string; label: string }>;
  value?: any;
  placeholder?: string;
}

export interface SortOption {
  field: string;
  label: string;
  direction?: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  onSearch: (query: string) => void;
  onFiltersChange: (filters: Record<string, any>) => void;
  onSortChange: (sort: { field: string; direction: 'asc' | 'desc' } | null) => void;
  filters?: SearchFilter[];
  sortOptions?: SortOption[];
  placeholder?: string;
  showFilters?: boolean;
  showSort?: boolean;
  className?: string;
}

export function AdvancedSearch({
  onSearch,
  onFiltersChange,
  onSortChange,
  filters = [],
  sortOptions = [],
  placeholder = "Search...",
  showFilters = true,
  showSort = true,
  className
}: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [currentSort, setCurrentSort] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch(searchQuery);
  };

  const handleFilterChange = (filterId: string, value: any) => {
    const newFilters = { ...activeFilters, [filterId]: value };
    if (value === '' || value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
      delete newFilters[filterId];
    }
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSortChange = (field: string) => {
    let newSort: { field: string; direction: 'asc' | 'desc' } | null = null;
    
    if (currentSort?.field === field) {
      if (currentSort.direction === 'asc') {
        newSort = { field, direction: 'desc' };
      } else {
        newSort = null; // Clear sort
      }
    } else {
      newSort = { field, direction: 'asc' };
    }
    
    setCurrentSort(newSort);
    onSortChange(newSort);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setCurrentSort(null);
    setQuery('');
    onFiltersChange({});
    onSortChange(null);
    onSearch('');
  };

  const activeFilterCount = Object.keys(activeFilters).length + (currentSort ? 1 : 0);

  const renderFilter = (filter: SearchFilter) => {
    const value = activeFilters[filter.id];

    switch (filter.type) {
      case 'text':
        return (
          <Input
            placeholder={filter.placeholder || `Filter by ${filter.label.toLowerCase()}`}
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
          />
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={(val) => handleFilterChange(filter.id, val)}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${filter.id}-${option.value}`}
                  checked={(value || []).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentValues = value || [];
                    const newValues = checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: string) => v !== option.value);
                    handleFilterChange(filter.id, newValues);
                  }}
                />
                <label htmlFor={`${filter.id}-${option.value}`} className="text-sm">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case 'date':
        return (
          <DateTimePicker
            value={value}
            onChange={(date) => handleFilterChange(filter.id, date)}
            placeholder={filter.placeholder || `Select ${filter.label.toLowerCase()}`}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={filter.id}
              checked={!!value}
              onCheckedChange={(checked) => handleFilterChange(filter.id, checked)}
            />
            <label htmlFor={filter.id} className="text-sm">
              {filter.label}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main search bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={placeholder}
            className="pl-10"
          />
        </div>

        {/* Filter button */}
        {showFilters && filters.length > 0 && (
          <Popover open={showFilterPanel} onOpenChange={setShowFilterPanel}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <Card className="border-0">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Filters</h3>
                    {activeFilterCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                        Clear all
                      </Button>
                    )}
                  </div>
                </div>
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                  {filters.map((filter) => (
                    <div key={filter.id}>
                      <label className="text-sm font-medium mb-2 block">
                        {filter.label}
                      </label>
                      {renderFilter(filter)}
                    </div>
                  ))}
                </div>
              </Card>
            </PopoverContent>
          </Popover>
        )}

        {/* Sort button */}
        {showSort && sortOptions.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {currentSort ? (
                  currentSort.direction === 'asc' ? (
                    <SortAsc className="w-4 h-4 mr-2" />
                  ) : (
                    <SortDesc className="w-4 h-4 mr-2" />
                  )
                ) : (
                  <SortAsc className="w-4 h-4 mr-2" />
                )}
                Sort
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="space-y-2">
                {sortOptions.map((option) => (
                  <Button
                    key={option.field}
                    variant={currentSort?.field === option.field ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleSortChange(option.field)}
                    className="w-full justify-start"
                  >
                    {currentSort?.field === option.field && (
                      currentSort.direction === 'asc' ? (
                        <SortAsc className="w-4 h-4 mr-2" />
                      ) : (
                        <SortDesc className="w-4 h-4 mr-2" />
                      )
                    )}
                    {option.label}
                  </Button>
                ))}
                {currentSort && (
                  <>
                    <div className="border-t my-2" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSortChange('')}
                      className="w-full justify-start text-muted-foreground"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear sort
                    </Button>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Active filters display */}
      {(Object.keys(activeFilters).length > 0 || currentSort) && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([filterId, value]) => {
            const filter = filters.find(f => f.id === filterId);
            if (!filter || !value) return null;

            let displayValue = value;
            if (Array.isArray(value)) {
              displayValue = value.join(', ');
            } else if (value instanceof Date) {
              displayValue = value.toLocaleDateString();
            }

            return (
              <Badge key={filterId} variant="secondary" className="gap-1">
                {filter.label}: {String(displayValue)}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFilterChange(filterId, null)}
                  className="h-auto p-0 w-4 h-4 hover:bg-transparent"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            );
          })}

          {currentSort && (
            <Badge variant="secondary" className="gap-1">
              Sort: {sortOptions.find(s => s.field === currentSort.field)?.label} 
              ({currentSort.direction})
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSortChange('')}
                className="h-auto p-0 w-4 h-4 hover:bg-transparent"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}