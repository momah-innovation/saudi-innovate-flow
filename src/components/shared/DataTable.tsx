import React from 'react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useTranslation } from 'react-i18next';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SortConfig } from '@/hooks/useDataTable';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  sortConfig?: SortConfig | null;
  onSort?: (field: string) => void;
  onRowClick?: (item: T) => void;
  bulkSelection?: {
    selectedItems: Set<string>;
    onToggleItem: (id: string) => void;
    onToggleAll: (items: T[]) => void;
    getItemId: (item: T) => string;
    isAllSelected: (items: T[]) => boolean;
    isIndeterminate: (items: T[]) => boolean;
  };
  emptyState?: React.ReactNode;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  sortConfig,
  onSort,
  onRowClick,
  bulkSelection,
  emptyState,
  className
}: DataTableProps<T>) {
  const { t } = useUnifiedTranslation();

  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.field !== columnKey) {
      return <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="ml-2 h-4 w-4" />
      : <ChevronDown className="ml-2 h-4 w-4" />;
  };

  const renderCell = (item: T, column: Column<T>, index: number) => {
    if (column.render) {
      return column.render(item, index);
    }

    const value = item[column.key];
    
    // Handle common data types
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">-</span>;
    }
    
    if (typeof value === 'boolean') {
      return <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Yes' : 'No'}</Badge>;
    }
    
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    
    if (Array.isArray(value)) {
      return value.length > 0 ? `${value.length} items` : '-';
    }
    
    return value.toString();
  };

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        {emptyState || (
          <>
            <p className="text-lg font-medium text-muted-foreground">
              {t('table.no_data', 'No data available')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('table.no_data_description', 'There are no items to display at the moment.')}
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`border rounded-md ${className || ''}`}>
      <Table>
        <TableHeader>
          <TableRow>
            {bulkSelection && (
              <TableHead className="w-12">
                <Checkbox
                  checked={bulkSelection.isAllSelected(data)}
                  onCheckedChange={() => bulkSelection.onToggleAll(data)}
                  aria-label={t('table.select_all', 'Select all')}
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead 
                key={column.key}
                className={`${column.headerClassName || ''} ${column.sortable ? 'cursor-pointer select-none' : ''}`}
                onClick={column.sortable && onSort ? () => onSort(column.key) : undefined}
              >
                <div className="flex items-center">
                  {column.label}
                  {column.sortable && onSort && getSortIcon(column.key)}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => {
            const itemId = bulkSelection?.getItemId(item) || index.toString();
            const isSelected = bulkSelection?.selectedItems.has(itemId) || false;
            
            return (
              <TableRow
                key={itemId}
                className={`${onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''} ${isSelected ? 'bg-muted/50' : ''}`}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
              >
                {bulkSelection && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => bulkSelection.onToggleItem(itemId)}
                      aria-label={t('table.select_item', 'Select item')}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell 
                    key={column.key}
                    className={column.className || ''}
                  >
                    {renderCell(item, column, index)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}