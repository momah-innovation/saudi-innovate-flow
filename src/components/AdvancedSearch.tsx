import React, { useState } from 'react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useSettingsManager } from '@/hooks/useSettingsManager';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { formatDate, formatDateArabic } from '@/utils/unified-date-handler';
import { createErrorHandler } from '@/utils/errorHandler';
// TagSelector will be implemented in next phase
import { 
  Search, 
  Filter, 
  Calendar, 
  Tag, 
  MapPin, 
  DollarSign,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchFilters {
  query: string;
  category: string;
  status: string;
  priority: string;
  dateRange: {
    start: string;
    end: string;
  };
  budgetRange: {
    min: string;
    max: string;
  };
  tags: string[];
  sector: string;
  department: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
  initialFilters?: Partial<SearchFilters>;
  searchType?: 'challenges' | 'ideas' | 'events' | 'opportunities';
  className?: string;
}

export function AdvancedSearch({
  onSearch,
  onReset,
  initialFilters = {},
  searchType = 'challenges',
  className
}: AdvancedSearchProps) {
  const { t, language, isRTL } = useUnifiedTranslation();
  const { getSettingValue } = useSettingsManager();
  
  const { isLoading, withLoading } = useUnifiedLoading({
    component: 'AdvancedSearch',
    showToast: true,
    logErrors: true,
    timeout: 10000
  });
  
  const { handleError } = createErrorHandler({
    component: 'AdvancedSearch',
    showToast: true,
    logErrors: true
  });
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    status: '',
    priority: '',
    dateRange: { start: '', end: '' },
    budgetRange: { min: '', max: '' },
    tags: [],
    sector: '',
    department: '',
    ...initialFilters
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { ...prev.dateRange, [type]: value }
    }));
  };

  const handleBudgetRangeChange = (type: 'min' | 'max', value: string) => {
    setFilters(prev => ({
      ...prev,
      budgetRange: { ...prev.budgetRange, [type]: value }
    }));
  };

  const handleSearch = async () => {
    await withLoading('search', async () => {
      onSearch(filters);
    }, {
      successMessage: t('advanced_search.search_success', 'Search completed'),
      errorMessage: t('advanced_search.search_error', 'Search failed'),
      logContext: { filters, searchType }
    });
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      query: '',
      category: '',
      status: '',
      priority: '',
      dateRange: { start: '', end: '' },
      budgetRange: { min: '', max: '' },
      tags: [],
      sector: '',
      department: ''
    };
    setFilters(resetFilters);
    onReset();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.query) count++;
    if (filters.category) count++;
    if (filters.status) count++;
    if (filters.priority) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.budgetRange.min || filters.budgetRange.max) count++;
    if (filters.tags.length > 0) count++;
    if (filters.sector) count++;
    if (filters.department) count++;
    return count;
  };

  const statusOptions = {
    challenges: [
      { value: 'draft', key: 'status.draft' },
      { value: 'active', key: 'status.active' },
      { value: 'completed', key: 'status.completed' },
      { value: 'cancelled', key: 'status.cancelled' }
    ],
    ideas: [
      { value: 'draft', key: 'status.draft' },
      { value: 'submitted', key: 'status.submitted' },
      { value: 'under_review', key: 'status.under_review' },
      { value: 'approved', key: 'status.approved' },
      { value: 'rejected', key: 'status.rejected' }
    ],
    events: [
      { value: 'upcoming', key: 'status.upcoming' },
      { value: 'registration_open', key: 'status.registration_open' },
      { value: 'registration_closed', key: 'status.registration_closed' },
      { value: 'ongoing', key: 'status.ongoing' },
      { value: 'completed', key: 'status.completed' }
    ],
    opportunities: [
      { value: 'open', key: 'status.open' },
      { value: 'closed', key: 'status.closed' },
      { value: 'paused', key: 'status.paused' }
    ]
  };

  const priorityLevels = getSettingValue('priority_levels', []) as string[];
  const priorityOptions = priorityLevels.map(priority => ({ 
    value: priority.toLowerCase(), 
    label: priority, 
    labelAr: priority 
  }));

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {t('advanced_search.title')}
          </CardTitle>
          <div className="flex items-center gap-2">
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="text-xs">
                {getActiveFiltersCount()} {t('advanced_search.filters_active')}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Search Query */}
        <div className="space-y-2">
          <Label htmlFor="search-query" className="text-sm font-medium">
            {t('advanced_search.search_query')}
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-query"
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              placeholder={t('advanced_search.search_placeholder')}
              className="pl-10"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
        </div>

        {/* Expandable Filters */}
        {isExpanded && (
          <div className="space-y-6 border-t pt-6">
            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  {t('advanced_search.status')}
                </Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('advanced_search.select_status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      {t('advanced_search.all_statuses')}
                    </SelectItem>
                    {statusOptions[searchType]?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {t(option.key, option.value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('advanced_search.priority')}
                </Label>
                <Select
                  value={filters.priority}
                  onValueChange={(value) => handleFilterChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('advanced_search.select_priority')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      {t('advanced_search.all_priorities')}
                    </SelectItem>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {t(`priority.${option.value}`, option.value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t('advanced_search.date_range')}
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="start-date" className="text-xs text-muted-foreground">
                    {t('advanced_search.start_date')}
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="end-date" className="text-xs text-muted-foreground">
                    {t('advanced_search.end_date')}
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Budget Range */}
            {(searchType === 'challenges' || searchType === 'opportunities') && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {t('advanced_search.budget_range')}
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="min-budget" className="text-xs text-muted-foreground">
                      {t('advanced_search.minimum_budget')}
                    </Label>
                    <Input
                      id="min-budget"
                      type="number"
                      value={filters.budgetRange.min}
                      onChange={(e) => handleBudgetRangeChange('min', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="max-budget" className="text-xs text-muted-foreground">
                      {t('advanced_search.maximum_budget')}
                    </Label>
                    <Input
                      id="max-budget"
                      type="number"
                      value={filters.budgetRange.max}
                      onChange={(e) => handleBudgetRangeChange('max', e.target.value)}
                      placeholder="∞"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {t('advanced_search.tags')}
              </Label>
              <div className="text-sm text-muted-foreground">
                {t('advanced_search.tag_selector_coming_soon')}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t">
            <Button 
              onClick={handleSearch} 
              className="flex-1 md:flex-none"
              disabled={isLoading('search')}
            >
              <Search className="h-4 w-4 mr-2" />
              {isLoading('search') ? t('advanced_search.searching', 'Searching...') : t('advanced_search.search')}
            </Button>
          
          {getActiveFiltersCount() > 0 && (
            <Button variant="outline" onClick={handleReset}>
              <X className="h-4 w-4 mr-2" />
              {t('advanced_search.clear_filters')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}