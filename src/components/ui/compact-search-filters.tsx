import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";

interface FilterConfig {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text' | 'number';
  options?: { label: string; value: string }[];
  placeholder?: string;
  value?: any;
  onChange: (value: any) => void;
}

interface CompactSearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  rightContent?: ReactNode;
}

export function CompactSearchAndFilters({
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  filters = [],
  hasActiveFilters = false,
  onClearFilters,
  rightContent
}: CompactSearchAndFiltersProps) {
  const { t } = useUnifiedTranslation();
  const defaultPlaceholder = searchPlaceholder || t('search');
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2" />
        <Input
          placeholder={defaultPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-9"
        />
      </div>
      
      {/* Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          {filters.map((filter) => (
            <div key={filter.id} className="min-w-[120px]">
              {filter.type === 'select' && (
                <Select value={filter.value || ''} onValueChange={filter.onChange}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder={filter.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
          
          {/* Clear filters button */}
          {onClearFilters && hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-9 px-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
      
      {rightContent}
    </div>
  );
}