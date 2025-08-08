import { useState, useMemo } from 'react';
import { useFilters, UseFiltersConfig } from './useFilters';
import { useBulkActions, UseBulkActionsConfig } from './useBulkActions';

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface UseDataTableConfig<T> extends UseFiltersConfig {
  defaultSort?: SortConfig;
  bulkActions?: UseBulkActionsConfig<T>;
  pageSize?: number;
}

export function useDataTable<T extends Record<string, any>>(
  data: T[],
  config: UseDataTableConfig<T> = {}
) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(
    config.defaultSort || null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = config.pageSize || 10;

  // Use filters hook
  const filterResults = useFilters(data, config);

  // Use bulk actions hook if configured
  const bulkActionsResults = config.bulkActions 
    ? useBulkActions(config.bulkActions)
    : null;

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filterResults.filteredData;

    return [...filterResults.filteredData].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortConfig.direction === 'desc' ? -comparison : comparison;
    });
  }, [filterResults.filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (field: string) => {
    setSortConfig(prevSort => {
      if (prevSort?.field === field) {
        return {
          field,
          direction: prevSort.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { field, direction: 'asc' };
    });
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  // Reset pagination when filters change
  const { setSearchTerm, setStatusFilter, setTypeFilter, clearFilters } = filterResults;
  const wrappedSetSearchTerm = (term: string) => {
    setSearchTerm(term);
    resetPagination();
  };
  const wrappedSetStatusFilter = (status: string) => {
    setStatusFilter(status);
    resetPagination();
  };
  const wrappedSetTypeFilter = (type: string) => {
    setTypeFilter(type);
    resetPagination();
  };
  const wrappedClearFilters = () => {
    clearFilters();
    resetPagination();
  };

  return {
    // Data
    data: paginatedData,
    sortedData,
    originalData: data,
    
    // Pagination
    currentPage,
    totalPages,
    pageSize,
    totalItems: sortedData.length,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    setCurrentPage,
    resetPagination,
    
    // Sorting
    sortConfig,
    handleSort,
    setSortConfig,
    
    // Filtering (wrapped to reset pagination)
    ...filterResults,
    setSearchTerm: wrappedSetSearchTerm,
    setStatusFilter: wrappedSetStatusFilter,
    setTypeFilter: wrappedSetTypeFilter,
    clearFilters: wrappedClearFilters,
    
    // Bulk actions
    bulkActions: bulkActionsResults,
    
    // Utilities
    isEmpty: paginatedData.length === 0,
    isLoading: false, // Can be extended with loading state
  };
}