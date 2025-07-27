import { ReactNode } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, ArrowUpDown, Search } from "lucide-react";

export interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: any, item: T) => ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  selectedItems?: string[];
  onSelectItem?: (id: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  sortKey?: keyof T;
  sortDirection?: 'asc' | 'desc';
  searchable?: boolean;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  actions?: (item: T) => ReactNode;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
  idField?: keyof T;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  selectedItems = [],
  onSelectItem,
  onSelectAll,
  onSort,
  sortKey,
  sortDirection,
  searchable = false,
  searchTerm = "",
  onSearchChange,
  actions,
  emptyMessage = "No data available",
  loading = false,
  className,
  idField = 'id' as keyof T
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && selectedItems.length === data.length;
  const someSelected = selectedItems.length > 0;

  const handleSort = (key: keyof T) => {
    if (!onSort) return;
    const direction = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(key, direction);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {searchable && (
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {(onSelectItem || onSelectAll) && (
                <TableHead className="w-12">
                  {onSelectAll && (
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={onSelectAll}
                      className={someSelected && !allSelected ? "data-[state=checked]:bg-primary" : ""}
                    />
                  )}
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead 
                  key={String(column.key)} 
                  className={column.width ? `w-${column.width}` : ''}
                >
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8 data-[state=open]:bg-accent"
                      onClick={() => handleSort(column.key)}
                    >
                      <span>{column.title}</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    column.title
                  )}
                </TableHead>
              ))}
              {actions && <TableHead className="w-12"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (onSelectItem ? 1 : 0) + (actions ? 1 : 0)} 
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={String(item[idField])}>
                  {onSelectItem && (
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(String(item[idField]))}
                        onCheckedChange={(checked) => 
                          onSelectItem(String(item[idField]), checked as boolean)
                        }
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      {column.render 
                        ? column.render(item[column.key], item)
                        : String(item[column.key] || '')
                      }
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell>
                      {actions(item)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Common column renderers
export const badgeRenderer = (variants: Record<string, string>) => 
  (value: string) => (
    <Badge className={variants[value] || 'bg-gray-100 text-gray-800'}>
      {value}
    </Badge>
  );

export const dateRenderer = (value: string) => 
  value ? new Date(value).toLocaleDateString() : '';

export const truncateRenderer = (maxLength: number = 50) => 
  (value: string) => 
    value && value.length > maxLength 
      ? `${value.substring(0, maxLength)}...` 
      : value;