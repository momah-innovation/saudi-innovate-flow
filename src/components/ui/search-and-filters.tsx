import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, Filter, ChevronDown, ChevronRight, X } from "lucide-react";

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filtersOpen: boolean;
  onFiltersOpenChange: (open: boolean) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  children?: ReactNode;
  rightContent?: ReactNode;
}

export function SearchAndFilters({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  filtersOpen,
  onFiltersOpenChange,
  hasActiveFilters = false,
  onClearFilters,
  children,
  rightContent
}: SearchAndFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Main search and controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {rightContent}
      </div>

      {/* Collapsible Filters */}
      {children && (
        <Collapsible open={filtersOpen} onOpenChange={onFiltersOpenChange}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters {hasActiveFilters && '(Active)'}
              </span>
              {filtersOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="space-y-4">
              {children}
              
              {onClearFilters && (
                <div className="flex items-end gap-2">
                  <Button
                    variant="outline"
                    onClick={onClearFilters}
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}