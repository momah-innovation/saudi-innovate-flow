import React, { useState } from 'react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { 
  ChevronDown, 
  ChevronUp, 
  ArrowUpDown, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { Card } from './card';
import { Checkbox } from './checkbox';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './dropdown-menu';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

export interface TableAction<T> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (row: T) => void;
  variant?: 'default' | 'destructive';
}

interface AdvancedDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: TableAction<T>[];
  searchable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onSelectionChange?: (selectedRows: T[]) => void;
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

export function AdvancedDataTable<T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  searchable = true,
  filterable = true,
  selectable = false,
  pagination = true,
  pageSize = 10,
  onSelectionChange,
  className
}: AdvancedDataTableProps<T>) {
  const { t } = useUnifiedTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search term
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row =>
      columns.some(column => {
        const value = row[column.key];
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSelectRow = (index: number) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedRows(newSelection);
    
    if (onSelectionChange) {
      const selectedData = Array.from(newSelection).map(i => paginatedData[i]);
      onSelectionChange(selectedData);
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    } else {
      const allIndexes = new Set(paginatedData.map((_, i) => i));
      setSelectedRows(allIndexes);
      onSelectionChange?.(paginatedData);
    }
  };

  const renderSortIcon = (column: keyof T) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    }
    
    if (sortDirection === 'asc') {
      return <ChevronUp className="w-4 h-4" />;
    }
    
    return <ChevronDown className="w-4 h-4" />;
  };

  return (
    <Card className={cn("w-full", className)}>
      {/* Header with search and filters */}
      {(searchable || filterable) && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            {searchable && (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t('search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
            
            {filterable && (
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            )}
            
            {selectable && selectedRows.size > 0 && (
              <Badge variant="secondary">
                {selectedRows.size} selected
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              {selectable && (
                <th className="w-12 p-4">
                  <Checkbox
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
              )}
              
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "text-left p-4 font-medium text-muted-foreground",
                    column.sortable && "cursor-pointer hover:text-foreground transition-colors",
                    column.width && `w-[${column.width}]`
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
              
              {actions.length > 0 && (
                <th className="w-20 p-4">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                className={cn(
                  "border-b hover:bg-muted/50 transition-colors",
                  selectedRows.has(index) && "bg-primary/5"
                )}
              >
                {selectable && (
                  <td className="p-4">
                    <Checkbox
                      checked={selectedRows.has(index)}
                      onCheckedChange={() => handleSelectRow(index)}
                    />
                  </td>
                )}
                
                {columns.map((column) => (
                  <td key={String(column.key)} className="p-4">
                    {column.render 
                      ? column.render(row[column.key], row)
                      : String(row[column.key])
                    }
                  </td>
                ))}
                
                {actions.length > 0 && (
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {actions.map((action, actionIndex) => (
                          <DropdownMenuItem
                            key={actionIndex}
                            onClick={() => action.onClick(row)}
                            className={cn(
                              action.variant === 'destructive' && "text-destructive focus:text-destructive"
                            )}
                          >
                            {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
            </p>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                {t('previous')}
              </Button>
              
              <span className="text-sm text-muted-foreground">
                {t('page')} {currentPage} {t('of')} {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                {t('next')}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}