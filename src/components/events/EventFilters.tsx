import { useState } from 'react';
import { useSettingsManager } from '@/hooks/useSettingsManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Filter, 
  Search, 
  X, 
  ChevronDown, 
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Globe,
  Building,
  SlidersHorizontal,
  Clock
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

export interface EventFilterState {
  search: string;
  format: string;
  eventType: string;
  category: string;
  status: string;
  location: string;
  capacityRange: [number, number];
  features: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface EventFiltersProps {
  filters: EventFilterState;
  onFiltersChange: (filters: EventFilterState) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

export const EventFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  activeFiltersCount 
}: EventFiltersProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const { getSettingValue } = useSettingsManager();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const updateFilter = (key: keyof EventFilterState, value: string | string[] | boolean | number[]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleFeature = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    updateFilter('features', newFeatures);
  };

  const eventFormatOptions = getSettingValue('event_format_options', []) as string[];
  const eventTypeOptionsData = getSettingValue('event_type_options', []) as string[];
  const eventCategoriesData = getSettingValue('event_categories', []) as string[];
  const eventStatusOptionsData = getSettingValue('event_status_options', []) as string[];

  const formatOptions = [
    { value: 'all', label: t('events:filters.all_formats') },
    ...eventFormatOptions.map(format => ({ value: format.toLowerCase(), label: format }))
  ];

  const eventTypeOptions = [
    { value: 'all', label: t('events:filters.all_types') },
    ...eventTypeOptionsData.map(type => ({ value: type.toLowerCase(), label: type }))
  ];

  const categoryOptions = [
    { value: 'all', label: t('events:filters.all_categories') },
    ...eventCategoriesData.map(category => ({ value: category.toLowerCase(), label: category }))
  ];

  const statusOptions = [
    { value: 'all', label: t('events:filters.all_status') },
    ...eventStatusOptionsData.map(status => ({ value: status.toLowerCase(), label: status }))
  ];

  const sortOptions = [
    { value: 'event_date', label: t('events:filters.sort.event_date') },
    { value: 'registered_participants', label: t('events:filters.sort.participants') },
    { value: 'created_at', label: t('events:filters.sort.created_date') },
    { value: 'title_ar', label: t('events:filters.sort.title') }
  ];

  const featureOptions = [
    { value: 'virtual_link', label: t('events:filters.features.virtual_link') },
    { value: 'recurring', label: t('events:filters.features.recurring') },
    { value: 'free', label: t('events:filters.features.free') },
    { value: 'open_registration', label: t('events:filters.features.open_registration') }
  ];

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg animate-fade-in">
      {/* Search and Basic Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={t('events.search.placeholder')}
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filters.format} onValueChange={(value) => updateFilter('format', value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {formatOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.eventType} onValueChange={(value) => updateFilter('eventType', value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {eventTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="w-full sm:w-auto"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          {t('events:filters.advanced_filters')}
          <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">
            {t('events:filters.active_filters')}
          </span>
          <Badge variant="secondary" className="animate-scale-in">
            {activeFiltersCount} {t('events:filters.filter_count')}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-auto p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
            {t('events:filters.clear_all')}
          </Button>
        </div>
      )}

      {/* Advanced Filters */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleContent className="space-y-6 animate-accordion-down">
          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                {t('events:filters.event_category')}
              </label>
              <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {t('events:filters.event_status')}
              </label>
              <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {t('events:filters.sort_by')}
              </label>
              <div className="flex gap-2">
                <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
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

          {/* Capacity Range Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t('events:filters.participant_capacity')}
            </label>
            <div className="px-3">
              <Slider
                value={filters.capacityRange}
                onValueChange={(value) => updateFilter('capacityRange', value)}
                max={1000}
                min={0}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>{filters.capacityRange[0]}</span>
                <span>{filters.capacityRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Special Features */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              {t('events:filters.special_features')}
            </label>
            <div className="flex flex-wrap gap-3">
              {featureOptions.map((feature) => (
                <div key={feature.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature.value}
                    checked={filters.features.includes(feature.value)}
                    onCheckedChange={() => toggleFeature(feature.value)}
                  />
                  <label
                    htmlFor={feature.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {feature.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
