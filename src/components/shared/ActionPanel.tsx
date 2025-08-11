import React from 'react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Plus, Filter, Download, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export interface FilterOption {
  value: string;
  label: string;
}

export interface ActionButton {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
}

export interface ExportOption {
  id: string;
  label: string;
  onClick: () => void;
}

export interface ActionPanelProps {
  title?: string;
  description?: string;
  
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  
  // Filters
  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;
  statusOptions?: FilterOption[];
  
  typeFilter?: string;
  onTypeFilterChange?: (value: string) => void;
  typeOptions?: FilterOption[];
  
  customFilters?: Array<{
    key: string;
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }>;
  
  // Actions
  primaryAction?: ActionButton;
  secondaryActions?: ActionButton[];
  bulkActions?: ActionButton[];
  selectedCount?: number;
  
  // Export
  exportOptions?: ExportOption[];
  
  // Filters state
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  
  className?: string;
}

export function ActionPanel({
  title,
  description,
  searchValue = '',
  onSearchChange,
  searchPlaceholder,
  statusFilter = 'all',
  onStatusFilterChange,
  statusOptions = [],
  typeFilter = 'all',
  onTypeFilterChange,
  typeOptions = [],
  customFilters = [],
  primaryAction,
  secondaryActions = [],
  bulkActions = [],
  selectedCount = 0,
  exportOptions = [],
  hasActiveFilters = false,
  onClearFilters,
  className
}: ActionPanelProps) {
  const { t } = useUnifiedTranslation();

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {(title || description) && (
        <div>
          {title && <h2 className="text-2xl font-bold tracking-tight">{title}</h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          {/* Search */}
          {onSearchChange && (
            <div className="w-full sm:max-w-sm">
              <Input
                placeholder={searchPlaceholder || t('search.placeholder', 'Search...')}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-9"
              />
            </div>
          )}
          
          {/* Filters */}
          <div className="flex gap-2">
            {statusOptions.length > 0 && onStatusFilterChange && (
              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="h-9 w-[140px]">
                  <SelectValue placeholder={t('filter.status', 'Status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filter.all_status', 'All Status')}</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {typeOptions.length > 0 && onTypeFilterChange && (
              <Select value={typeFilter} onValueChange={onTypeFilterChange}>
                <SelectTrigger className="h-9 w-[140px]">
                  <SelectValue placeholder={t('filter.type', 'Type')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filter.all_types', 'All Types')}</SelectItem>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {customFilters.map((filter) => (
              <Select key={filter.key} value={filter.value} onValueChange={filter.onChange}>
                <SelectTrigger className="h-9 w-[140px]">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filter.all', 'All')}</SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
            
            {hasActiveFilters && onClearFilters && (
              <Button variant="ghost" onClick={onClearFilters} className="h-9 px-3">
                <Filter className="mr-2 h-4 w-4" />
                {t('filter.clear', 'Clear')}
              </Button>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Bulk Actions */}
          {bulkActions.length > 0 && selectedCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {t('table.selected_count', '{{count}} selected', { count: selectedCount })}
              </Badge>
              {bulkActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.id}
                    variant={action.variant || 'outline'}
                    size="sm"
                    onClick={action.onClick}
                    disabled={action.disabled}
                  >
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    {action.label}
                  </Button>
                );
              })}
            </div>
          )}
          
          {/* Export Options */}
          {exportOptions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  {t('actions.export', 'Export')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {exportOptions.map((option) => (
                  <DropdownMenuItem key={option.id} onClick={option.onClick}>
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {/* Secondary Actions */}
          {secondaryActions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {secondaryActions.map((action, index) => (
                  <React.Fragment key={action.id}>
                    <DropdownMenuItem onClick={action.onClick} disabled={action.disabled}>
                      {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                      {action.label}
                    </DropdownMenuItem>
                    {index < secondaryActions.length - 1 && <DropdownMenuSeparator />}
                  </React.Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {/* Primary Action */}
          {primaryAction && (
            <Button
              onClick={primaryAction.onClick}
              variant={primaryAction.variant || 'default'}
              size="sm"
              disabled={primaryAction.disabled}
            >
              {primaryAction.icon && <primaryAction.icon className="mr-2 h-4 w-4" />}
              {primaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}