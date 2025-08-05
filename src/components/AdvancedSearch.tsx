import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useAppTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
  const { t, language, isRTL } = useTranslation();
  
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

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
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

  const handleSearch = () => {
    onSearch(filters);
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
      { value: 'draft', label: 'Draft', labelAr: 'مسودة' },
      { value: 'active', label: 'Active', labelAr: 'نشط' },
      { value: 'completed', label: 'Completed', labelAr: 'مكتمل' },
      { value: 'cancelled', label: 'Cancelled', labelAr: 'ملغي' }
    ],
    ideas: [
      { value: 'draft', label: 'Draft', labelAr: 'مسودة' },
      { value: 'submitted', label: 'Submitted', labelAr: 'مقدم' },
      { value: 'under_review', label: 'Under Review', labelAr: 'قيد المراجعة' },
      { value: 'approved', label: 'Approved', labelAr: 'معتمد' },
      { value: 'rejected', label: 'Rejected', labelAr: 'مرفوض' }
    ],
    events: [
      { value: 'upcoming', label: 'Upcoming', labelAr: 'قادم' },
      { value: 'registration_open', label: 'Registration Open', labelAr: 'التسجيل مفتوح' },
      { value: 'registration_closed', label: 'Registration Closed', labelAr: 'التسجيل مغلق' },
      { value: 'ongoing', label: 'Ongoing', labelAr: 'جاري' },
      { value: 'completed', label: 'Completed', labelAr: 'مكتمل' }
    ],
    opportunities: [
      { value: 'open', label: 'Open', labelAr: 'مفتوح' },
      { value: 'closed', label: 'Closed', labelAr: 'مغلق' },
      { value: 'paused', label: 'Paused', labelAr: 'متوقف مؤقتاً' }
    ]
  };

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', labelAr: 'أولوية منخفضة' },
    { value: 'medium', label: 'Medium Priority', labelAr: 'أولوية متوسطة' },
    { value: 'high', label: 'High Priority', labelAr: 'أولوية عالية' },
    { value: 'urgent', label: 'Urgent', labelAr: 'طارئ' }
  ];

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {t('advanced_search') || 'البحث المتقدم'}
          </CardTitle>
          <div className="flex items-center gap-2">
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="text-xs">
                {getActiveFiltersCount()} {t('filters_active') || 'مرشحات نشطة'}
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
            {t('search_query') || 'استعلام البحث'}
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-query"
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              placeholder={t('search_placeholder') || 'ابحث في العناوين والأوصاف...'}
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
                  {t('status') || 'الحالة'}
                </Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_status') || 'اختر الحالة'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      {t('all_statuses') || 'جميع الحالات'}
                    </SelectItem>
                    {statusOptions[searchType]?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {language === 'ar' ? option.labelAr : option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('priority') || 'الأولوية'}
                </Label>
                <Select
                  value={filters.priority}
                  onValueChange={(value) => handleFilterChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_priority') || 'اختر الأولوية'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      {t('all_priorities') || 'جميع الأولويات'}
                    </SelectItem>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {language === 'ar' ? option.labelAr : option.label}
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
                {t('date_range') || 'نطاق التاريخ'}
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="start-date" className="text-xs text-muted-foreground">
                    {t('start_date') || 'تاريخ البداية'}
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
                    {t('end_date') || 'تاريخ الانتهاء'}
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
                  {t('budget_range') || 'نطاق الميزانية'}
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="min-budget" className="text-xs text-muted-foreground">
                      {t('minimum_budget') || 'الحد الأدنى'}
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
                      {t('maximum_budget') || 'الحد الأقصى'}
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
                {t('tags') || 'العلامات'}
              </Label>
              <div className="text-sm text-muted-foreground">
                Tag selector will be available in the next phase
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t">
          <Button onClick={handleSearch} className="flex-1 md:flex-none">
            <Search className="h-4 w-4 mr-2" />
            {t('search') || 'بحث'}
          </Button>
          
          {getActiveFiltersCount() > 0 && (
            <Button variant="outline" onClick={handleReset}>
              <X className="h-4 w-4 mr-2" />
              {t('clear_filters') || 'مسح المرشحات'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}