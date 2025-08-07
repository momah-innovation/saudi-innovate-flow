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
  const { getSettingValue } = useSettingsManager();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const updateFilter = (key: keyof EventFilterState, value: any) => {
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
    { value: 'all', label: isRTL ? 'جميع الأشكال' : 'All Formats' },
    ...eventFormatOptions.map(format => ({ value: format.toLowerCase(), label: format }))
  ];

  const eventTypeOptions = [
    { value: 'all', label: isRTL ? 'جميع الأنواع' : 'All Types' },
    ...eventTypeOptionsData.map(type => ({ value: type.toLowerCase(), label: type }))
  ];

  const categoryOptions = [
    { value: 'all', label: isRTL ? 'جميع الفئات' : 'All Categories' },
    ...eventCategoriesData.map(category => ({ value: category.toLowerCase(), label: category }))
  ];

  const statusOptions = [
    { value: 'all', label: isRTL ? 'جميع الحالات' : 'All Status' },
    ...eventStatusOptionsData.map(status => ({ value: status.toLowerCase(), label: status }))
  ];

  const sortOptions = [
    { value: 'event_date', label: isRTL ? 'تاريخ الفعالية' : 'Event Date' },
    { value: 'registered_participants', label: isRTL ? 'عدد المسجلين' : 'Participants' },
    { value: 'created_at', label: isRTL ? 'تاريخ الإنشاء' : 'Created Date' },
    { value: 'title_ar', label: isRTL ? 'العنوان' : 'Title' }
  ];

  const featureOptions = [
    { value: 'virtual_link', label: isRTL ? 'رابط افتراضي' : 'Virtual Link' },
    { value: 'recurring', label: isRTL ? 'متكرر' : 'Recurring' },
    { value: 'free', label: isRTL ? 'مجاني' : 'Free' },
    { value: 'open_registration', label: isRTL ? 'تسجيل مفتوح' : 'Open Registration' }
  ];

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg animate-fade-in">
      {/* Search and Basic Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={isRTL ? 'البحث في الفعاليات...' : 'Search events...'}
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
          {isRTL ? 'فلاتر متقدمة' : 'Advanced Filters'}
          <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">
            {isRTL ? 'الفلاتر النشطة:' : 'Active filters:'}
          </span>
          <Badge variant="secondary" className="animate-scale-in">
            {activeFiltersCount} {isRTL ? 'فلتر' : 'filters'}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-auto p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
            {isRTL ? 'مسح الكل' : 'Clear all'}
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
                {isRTL ? 'فئة الفعالية' : 'Event Category'}
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
                {isRTL ? 'حالة الفعالية' : 'Event Status'}
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
                {isRTL ? 'ترتيب حسب' : 'Sort by'}
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
              {isRTL ? 'سعة المشاركين' : 'Participant Capacity'}
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
              {isRTL ? 'ميزات خاصة' : 'Special Features'}
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