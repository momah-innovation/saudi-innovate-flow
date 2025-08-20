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
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
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
  const { t } = useUnifiedTranslation();
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
    { value: 'sponsorship', label: t('opportunities:filters.types.sponsorship') },
    { value: 'collaboration', label: t('opportunities:filters.types.collaboration') },
    { value: 'research', label: t('opportunities:filters.types.research') },
    { value: 'training', label: t('opportunities:filters.types.training') },
    { value: 'consulting', label: t('opportunities:filters.types.consulting') }
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
    { value: 'week', label: t('opportunities:filters.deadlines.week') },
    { value: 'month', label: t('opportunities:filters.deadlines.month') },
    { value: 'quarter', label: t('opportunities:filters.deadlines.quarter') },
    { value: 'year', label: t('opportunities:filters.deadlines.year') }
  ];

  const sortOptions = [
    { value: 'deadline', label: t('opportunities:filters.sort.deadline') },
    { value: 'created_at', label: t('opportunities:filters.sort.created_date') },
    { value: 'budget_max', label: t('opportunities:filters.sort.budget') },
    { value: 'applications', label: t('opportunities:filters.sort.applications') },
    { value: 'title_ar', label: t('opportunities:filters.sort.name') }
  ];

  const features = [
    { value: 'featured', label: t('opportunities:filters.features.featured'), icon: Star },
    { value: 'urgent', label: t('opportunities:filters.features.urgent'), icon: Clock },
    { value: 'high-budget', label: t('opportunities:filters.features.high_budget'), icon: DollarSign },
    { value: 'government', label: t('opportunities:filters.features.government'), icon: Building2 }
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            {t('opportunities:filters.title')}
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
                {t('opportunities:filters.clear_all')}
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? t('opportunities:filters.collapse') : t('opportunities:filters.expand')}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className={`absolute top-3 w-4 h-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
          <Input
            placeholder={t('opportunities.placeholders.search_opportunities')}
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className={isRTL ? 'pr-10 text-right' : 'pl-10 text-left'}
          />
        </div>

        {/* Quick Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('opportunities:filters.labels.status')}</label>
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('opportunities:filters.placeholders.all_statuses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('opportunities:filters.placeholders.all_statuses')}</SelectItem>
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
            <label className="text-sm font-medium">{t('opportunities:filters.labels.type')}</label>
            <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('opportunities:filters.placeholders.all_types')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('opportunities:filters.placeholders.all_types')}</SelectItem>
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
            <label className="text-sm font-medium">{t('opportunities:filters.labels.priority')}</label>
            <Select value={filters.priority} onValueChange={(value) => updateFilter('priority', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('opportunities:filters.placeholders.all_priorities')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('opportunities:filters.placeholders.all_priorities')}</SelectItem>
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
            <label className="text-sm font-medium">{t('opportunities:filters.labels.sort_by')}</label>
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
                <label className="text-sm font-medium">{t('opportunities:filters.labels.category')}</label>
                <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('opportunities:filters.placeholders.all_categories')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('opportunities:filters.placeholders.all_categories')}</SelectItem>
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
                <label className="text-sm font-medium">{t('opportunities:filters.labels.sector')}</label>
                <Select value={filters.sector} onValueChange={(value) => updateFilter('sector', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('opportunities:filters.placeholders.all_sectors')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('opportunities:filters.placeholders.all_sectors')}</SelectItem>
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
                <label className="text-sm font-medium">{t('opportunities:filters.labels.department')}</label>
                <Select value={filters.department} onValueChange={(value) => updateFilter('department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('opportunities:filters.placeholders.all_departments')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('opportunities:filters.placeholders.all_departments')}</SelectItem>
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
                  {t('opportunities:filters.labels.budget_range')}
                </label>
                <span className="text-sm text-muted-foreground">
                  {filters.budgetRange[0].toLocaleString()} - {filters.budgetRange[1].toLocaleString()} {t('opportunities:common.currency')}
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
                  {t('opportunities:filters.labels.location')}
                </label>
                <Input
                  placeholder={t('opportunities:filters.placeholders.location_example')}
                  value={filters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                />
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t('opportunities:filters.labels.deadline')}
                </label>
                <Select value={filters.deadline} onValueChange={(value) => updateFilter('deadline', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('opportunities:filters.placeholders.any_deadline')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('opportunities:filters.placeholders.any_deadline')}</SelectItem>
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
                {t('opportunities:filters.labels.special_features')}
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
