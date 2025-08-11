import React from 'react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  const { t, isRTL } = useUnifiedTranslation();

  const getSortIcon = (columnKey: string) => {
    const iconClass = cn("h-4 w-4", isRTL ? "mr-2" : "ml-2");
    
    if (!sortConfig || sortConfig.field !== columnKey) {
      return <ChevronsUpDown className={cn(iconClass, "text-muted-foreground")} />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className={iconClass} />
      : <ChevronDown className={iconClass} />;
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
      <div className={cn(
        "flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4",
        isRTL && "text-right"
      )}>
        {emptyState || (
          <>
            <p className="text-base sm:text-lg font-medium text-muted-foreground">
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
    <div className={cn(
      "border rounded-md overflow-x-auto",
      isRTL && "text-right",
      className
    )}>
      <Table>
        <TableHeader>
          <TableRow>
            {bulkSelection && (
              <TableHead className="w-10 sm:w-12">
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
                className={cn(
                  column.headerClassName,
                  column.sortable && "cursor-pointer select-none hover:bg-muted/50 transition-colors",
                  "text-xs sm:text-sm whitespace-nowrap"
                )}
                onClick={column.sortable && onSort ? () => onSort(column.key) : undefined}
              >
                <div className={cn(
                  "flex items-center min-h-[44px] sm:min-h-[auto]",
                  isRTL && "flex-row-reverse"
                )}>
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
                className={cn(
                  onRowClick && "cursor-pointer hover:bg-muted/50 transition-colors",
                  isSelected && "bg-muted/50",
                  "min-h-[44px]"
                )}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
              >
                {bulkSelection && (
                  <TableCell 
                    onClick={(e) => e.stopPropagation()}
                    className="py-2 px-2 sm:px-4"
                  >
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
                    className={cn(
                      "py-2 px-2 sm:px-4 text-xs sm:text-sm",
                      column.className
                    )}
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