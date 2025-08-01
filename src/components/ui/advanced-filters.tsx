import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, Filter, X, ChevronDown, ChevronRight, Calendar, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "@/hooks/useAppTranslation";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text' | 'number';
  options?: FilterOption[];
  placeholder?: string;
  value?: any;
  onChange?: (value: any) => void;
}

interface AdvancedFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters: FilterConfig[];
  filtersOpen?: boolean;
  onFiltersOpenChange?: (open: boolean) => void;
  onClearAll?: () => void;
  rightContent?: ReactNode;
  quickFilters?: Array<{
    label: string;
    value: any;
    active: boolean;
    onClick: () => void;
  }>;
  className?: string;
}

export function AdvancedFilters({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  filtersOpen = false,
  onFiltersOpenChange,
  onClearAll,
  rightContent,
  quickFilters,
  className
}: AdvancedFiltersProps) {
  const { t } = useTranslation();
  const hasActiveFilters = filters.some(filter => 
    filter.value && 
    (Array.isArray(filter.value) ? filter.value.length > 0 : filter.value !== '')
  );

  const activeFilterCount = filters.filter(filter => 
    filter.value && 
    (Array.isArray(filter.value) ? filter.value.length > 0 : filter.value !== '')
  ).length;

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {/* Search and Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder || t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {rightContent}
      </div>

      {/* Quick Filters */}
      {quickFilters && quickFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter, index) => (
            <Badge
              key={index}
              variant={filter.active ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/80"
              onClick={filter.onClick}
            >
              {filter.label}
            </Badge>
          ))}
        </div>
      )}

      {/* Advanced Filters */}
      <Collapsible open={filtersOpen} onOpenChange={onFiltersOpenChange}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              {t('advancedFilters')}
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </span>
            {filtersOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filters.map((filter) => (
              <FilterField key={filter.id} filter={filter} />
            ))}
          </div>
          
          {onClearAll && hasActiveFilters && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={onClearAll}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                {t('clearAllFilters')}
              </Button>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

function FilterField({ filter }: { filter: FilterConfig }) {
  const { t } = useTranslation();
  
  switch (filter.type) {
    case 'select':
      return (
        <div className="space-y-2">
          <Label>{filter.label}</Label>
          <Select value={filter.value || ''} onValueChange={filter.onChange}>
            <SelectTrigger>
              <SelectValue placeholder={filter.placeholder || t('selectPlaceholder', { label: filter.label.toLowerCase() })} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('allOption')}</SelectItem>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case 'multiselect':
      return (
        <div className="space-y-2">
          <Label>{filter.label}</Label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {filter.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${filter.id}-${option.value}`}
                  checked={filter.value?.includes(option.value) || false}
                  onCheckedChange={(checked) => {
                    const currentValues = filter.value || [];
                    const newValues = checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: string) => v !== option.value);
                    filter.onChange?.(newValues);
                  }}
                />
                <Label htmlFor={`${filter.id}-${option.value}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      );

    case 'text':
      return (
        <div className="space-y-2">
          <Label>{filter.label}</Label>
          <Input
            value={filter.value || ''}
            onChange={(e) => filter.onChange?.(e.target.value)}
            placeholder={filter.placeholder}
          />
        </div>
      );

    case 'number':
      return (
        <div className="space-y-2">
          <Label>{filter.label}</Label>
          <Input
            type="number"
            value={filter.value || ''}
            onChange={(e) => filter.onChange?.(e.target.value)}
            placeholder={filter.placeholder}
          />
        </div>
      );

    case 'date':
      return (
        <div className="space-y-2">
          <Label>{filter.label}</Label>
          <Input
            type="date"
            value={filter.value || ''}
            onChange={(e) => filter.onChange?.(e.target.value)}
          />
        </div>
      );

    case 'daterange':
      return (
        <div className="space-y-2">
          <Label>{filter.label}</Label>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={filter.value?.from || ''}
              onChange={(e) => filter.onChange?.({ ...filter.value, from: e.target.value })}
              placeholder={t('fromPlaceholder')}
            />
            <span>{t('to')}</span>
            <Input
              type="date"
              value={filter.value?.to || ''}
              onChange={(e) => filter.onChange?.({ ...filter.value, to: e.target.value })}
              placeholder={t('toPlaceholder')}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
}