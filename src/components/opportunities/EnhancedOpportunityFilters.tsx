import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSettingsManager } from '@/hooks/useSettingsManager';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useDirection } from '@/components/ui/direction-provider';
import { supabase } from '@/integrations/supabase/client';
import { Category, Sector, Department } from '@/types/opportunities';
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  DollarSign,
  MapPin,
  Building2,
  Star,
  Clock,
  Target
} from 'lucide-react';

export interface OpportunityFilterState {
  search: string;
  status: string;
  type: string;
  category: string;
  priority: string;
  budgetRange: [number, number];
  location: string;
  deadline: string;
  sector: string;
  department: string;
  features: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface EnhancedOpportunityFiltersProps {
  filters: OpportunityFilterState;
  onFiltersChange: (filters: OpportunityFilterState) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  className?: string;
}

export const EnhancedOpportunityFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  activeFiltersCount,
  className = ""
}: EnhancedOpportunityFiltersProps) => {
  const { isRTL } = useDirection();
  const { getSettingValue } = useSettingsManager();
  const [categories, setCategories] = useState<Category[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadFilterData();
  }, []);

  const loadFilterData = async () => {
    try {
      // Load categories
      const { data: categoriesData } = await supabase
        .from('opportunity_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      // Load sectors
      const { data: sectorsData } = await supabase
        .from('sectors')
        .select('*')
        .order('name_ar');

      // Load departments
      const { data: departmentsData } = await supabase
        .from('departments')
        .select('*')
        .order('name_ar');

      setCategories(categoriesData || []);
      setSectors(sectorsData || []);
      setDepartments(departmentsData || []);
    } catch (error) {
      // Failed to load filter data - continue with empty arrays
    }
  };

  const updateFilter = (key: keyof OpportunityFilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const toggleFeature = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    
    updateFilter('features', newFeatures);
  };

  const opportunityTypes = [
    { value: 'sponsorship', label: isRTL ? 'رعاية' : 'Sponsorship' },
    { value: 'collaboration', label: isRTL ? 'تعاون' : 'Collaboration' },
    { value: 'research', label: isRTL ? 'بحث' : 'Research' },
    { value: 'training', label: isRTL ? 'تدريب' : 'Training' },
    { value: 'consulting', label: isRTL ? 'استشارات' : 'Consulting' }
  ];

  const opportunityStatusOptions = getSettingValue('opportunity_status_options', []) as string[];
  const priorityLevels = getSettingValue('priority_levels', []) as string[];

  const statusOptions = opportunityStatusOptions.map(status => ({ 
    value: status.toLowerCase(), 
    label: status 
  }));

  const priorityOptions = priorityLevels.map(priority => ({ 
    value: priority.toLowerCase(), 
    label: priority 
  }));

  const deadlineOptions = [
    { value: 'week', label: isRTL ? 'خلال أسبوع' : 'Within a week' },
    { value: 'month', label: isRTL ? 'خلال شهر' : 'Within a month' },
    { value: 'quarter', label: isRTL ? 'خلال ربع سنة' : 'Within 3 months' },
    { value: 'year', label: isRTL ? 'خلال سنة' : 'Within a year' }
  ];

  const sortOptions = [
    { value: 'deadline', label: isRTL ? 'الموعد النهائي' : 'Deadline' },
    { value: 'created_at', label: isRTL ? 'تاريخ الإنشاء' : 'Created Date' },
    { value: 'budget_max', label: isRTL ? 'الميزانية' : 'Budget' },
    { value: 'applications', label: isRTL ? 'عدد الطلبات' : 'Applications' },
    { value: 'title_ar', label: isRTL ? 'الاسم' : 'Name' }
  ];

  const features = [
    { value: 'featured', label: isRTL ? 'مميزة' : 'Featured', icon: Star },
    { value: 'urgent', label: isRTL ? 'عاجلة' : 'Urgent', icon: Clock },
    { value: 'high-budget', label: isRTL ? 'ميزانية عالية' : 'High Budget', icon: DollarSign },
    { value: 'government', label: isRTL ? 'حكومية' : 'Government', icon: Building2 }
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            {isRTL ? 'تصفية الفرص' : 'Filter Opportunities'}
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className={isRTL ? 'mr-2' : 'ml-2'}>
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                <X className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                {isRTL ? 'مسح الكل' : 'Clear All'}
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (isRTL ? 'إخفاء' : 'Collapse') : (isRTL ? 'توسيع' : 'Expand')}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className={`absolute top-3 w-4 h-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
          <Input
            placeholder={isRTL ? 'البحث في الفرص...' : 'Search opportunities...'}
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className={isRTL ? 'pr-10 text-right' : 'pl-10 text-left'}
          />
        </div>

        {/* Quick Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{isRTL ? 'الحالة' : 'Status'}</label>
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? 'جميع الحالات' : 'All statuses'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع الحالات' : 'All statuses'}</SelectItem>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{isRTL ? 'النوع' : 'Type'}</label>
            <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? 'جميع الأنواع' : 'All types'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع الأنواع' : 'All types'}</SelectItem>
                {opportunityTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{isRTL ? 'الأولوية' : 'Priority'}</label>
            <Select value={filters.priority} onValueChange={(value) => updateFilter('priority', value)}>
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? 'جميع الأولويات' : 'All priorities'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع الأولويات' : 'All priorities'}</SelectItem>
                {priorityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{isRTL ? 'ترتيب حسب' : 'Sort by'}</label>
            <div className="flex gap-2">
              <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3"
              >
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-6 pt-4 border-t">
            {/* Category and Organization Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{isRTL ? 'الفئة' : 'Category'}</label>
                <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? 'جميع الفئات' : 'All categories'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isRTL ? 'جميع الفئات' : 'All categories'}</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {isRTL ? category.name_ar : category.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{isRTL ? 'القطاع' : 'Sector'}</label>
                <Select value={filters.sector} onValueChange={(value) => updateFilter('sector', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? 'جميع القطاعات' : 'All sectors'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isRTL ? 'جميع القطاعات' : 'All sectors'}</SelectItem>
                    {sectors.map(sector => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {isRTL ? sector.name_ar : sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{isRTL ? 'الإدارة' : 'Department'}</label>
                <Select value={filters.department} onValueChange={(value) => updateFilter('department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? 'جميع الإدارات' : 'All departments'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isRTL ? 'جميع الإدارات' : 'All departments'}</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {isRTL ? dept.name_ar : dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Budget Range */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  {isRTL ? 'نطاق الميزانية' : 'Budget Range'}
                </label>
                <span className="text-sm text-muted-foreground">
                  {filters.budgetRange[0].toLocaleString()} - {filters.budgetRange[1].toLocaleString()} {isRTL ? 'ر.س' : 'SAR'}
                </span>
              </div>
              <Slider
                value={filters.budgetRange}
                onValueChange={(value) => updateFilter('budgetRange', value)}
                max={50000000}
                min={0}
                step={100000}
                className="w-full"
              />
            </div>

            {/* Location and Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {isRTL ? 'الموقع' : 'Location'}
                </label>
                <Input
                  placeholder={isRTL ? 'مثال: الرياض، جدة' : 'e.g. Riyadh, Jeddah'}
                  value={filters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                />
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {isRTL ? 'الموعد النهائي' : 'Deadline'}
                </label>
                <Select value={filters.deadline} onValueChange={(value) => updateFilter('deadline', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? 'أي موعد' : 'Any deadline'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isRTL ? 'أي موعد' : 'Any deadline'}</SelectItem>
                    {deadlineOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4" />
                {isRTL ? 'ميزات خاصة' : 'Special Features'}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {features.map(feature => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature.value}
                        checked={filters.features.includes(feature.value)}
                        onCheckedChange={() => toggleFeature(feature.value)}
                      />
                      <label
                        htmlFor={feature.value}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                      >
                        <Icon className="w-4 h-4" />
                        {feature.label}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};