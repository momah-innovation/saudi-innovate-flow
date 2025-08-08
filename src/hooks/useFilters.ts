import { useState, useMemo } from 'react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface UseFiltersConfig {
  searchFields?: string[];
  statusOptions?: FilterOption[];
  typeOptions?: FilterOption[];
  customFilters?: Record<string, FilterOption[]>;
}

export function useFilters<T extends Record<string, any>>(
  data: T[],
  config: UseFiltersConfig = {}
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [customFilters, setCustomFilters] = useState<Record<string, string>>({});

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search filter
      if (searchTerm && config.searchFields) {
        const searchMatch = config.searchFields.some(field => {
          const value = item[field];
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });
        if (!searchMatch) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      // Type filter
      if (typeFilter !== 'all' && item.type !== typeFilter) {
        return false;
      }

      // Custom filters
      for (const [filterKey, filterValue] of Object.entries(customFilters)) {
        if (filterValue !== 'all' && item[filterKey] !== filterValue) {
          return false;
        }
      }

      return true;
    });
  }, [data, searchTerm, statusFilter, typeFilter, customFilters, config.searchFields]);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setCustomFilters({});
  };

  const setCustomFilter = (key: string, value: string) => {
    setCustomFilters(prev => ({ ...prev, [key]: value }));
  };

  return {
    // State
    searchTerm,
    statusFilter,
    typeFilter,
    customFilters,
    filteredData,
    
    // Actions
    setSearchTerm,
    setStatusFilter,
    setTypeFilter,
    setCustomFilter,
    clearFilters,
    
    // Computed
    hasActiveFilters: searchTerm !== '' || statusFilter !== 'all' || typeFilter !== 'all' || 
      Object.values(customFilters).some(value => value !== 'all'),
    totalFiltered: filteredData.length,
    totalOriginal: data.length
  };
}