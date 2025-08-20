import { useState, useEffect } from 'react';
import { useTimerManager } from '@/utils/timerManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Filter, 
  Search, 
  X, 
  ChevronDown, 
  Calendar,
  Award,
  Users,
  Target,
  SlidersHorizontal
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';
import { challengesPageConfig, getFilterOptions } from '@/config/challengesPageConfig';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

export interface FilterState {
  search: string;
  status: string;
  category: string;
  difficulty: string;
  prizeRange: [number, number];
  participantRange: [number, number];
  deadline: string;
  features: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface ChallengeFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  className?: string;
  dynamicMaxBudget?: number;
  dynamicMaxParticipants?: number;
}

export const ChallengeFilters = ({
  filters, 
  onFiltersChange, 
  onClearFilters, 
  activeFiltersCount,
  className = "",
  dynamicMaxBudget = 10000000,
  dynamicMaxParticipants = 1000
}: ChallengeFiltersProps) => {
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [animateFilters, setAnimateFilters] = useState(false);
  const { setTimeout: scheduleTimeout } = useTimerManager();

  useEffect(() => {
    if (activeFiltersCount > 0) {
      setAnimateFilters(true);
      const cleanup = scheduleTimeout(() => setAnimateFilters(false), 300);
      return cleanup;
    }
  }, [activeFiltersCount]);

  const updateFilter = (key: keyof FilterState, value: string | string[] | boolean | number[]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
    setSearchExpanded(true);
  };

  const handleSearchBlur = () => {
    setSearchFocused(false);
    // Only collapse if no search text
    if (!filters.search) {
      setSearchExpanded(false);
    }
  };

  const handleSearchClick = () => {
    if (!searchExpanded) {
      setSearchExpanded(true);
    }
  };

  const toggleFeature = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    updateFilter('features', newFeatures);
  };

  // Get filter options from configuration
  const statusOptions = getFilterOptions('status');
  const categoryOptions = getFilterOptions('category');
  const difficultyOptions = getFilterOptions('difficulty');
  const sortOptions = getFilterOptions('sortOptions');
  const featureOptions = getFilterOptions('features');

  const QuickFilterChip = ({ 
    option, 
    isSelected, 
    onClick 
  }: { 
    option: typeof featureOptions[0]; 
    isSelected: boolean; 
    onClick: () => void; 
  }) => (
    <Button
      variant={isSelected ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={cn(
        "transition-all duration-200 hover:scale-[1.02] animate-fade-in",
        isSelected && "shadow-lg",
        animateFilters && "animate-pulse"
      )}
    >
      <option.icon className="w-3 h-3 mr-1" />
      {option.label}
    </Button>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Filter Bar - Match existing design system */}
      <Card className="border border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('challenges:filters.search_placeholder')}
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
              {filters.search && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateFilter('search', '')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Quick Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {featureOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant={filters.features.includes(option.value) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => toggleFeature(option.value)}
                >
                  <option.icon className="w-3 h-3 mr-1" />
                  {isRTL ? option.labelAr : option.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-2 mt-4">
            {/* Status Filter */}
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder={t('challenges:filters.status')} />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {option.icon && <option.icon className="w-4 h-4" />}
                      {isRTL ? option.labelAr : option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder={t('challenges:filters.category')} />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {isRTL ? option.labelAr : option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Difficulty Filter */}
            <Select value={filters.difficulty} onValueChange={(value) => updateFilter('difficulty', value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder={t('challenges:filters.level')} />
              </SelectTrigger>
              <SelectContent>
                {difficultyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {isRTL ? option.labelAr : option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Filter */}
            <div className="flex gap-1">
              <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder={t('challenge_filters.sort')} />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {option.icon && <option.icon className="w-4 h-4" />}
                        {isRTL ? option.labelAr : option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2"
                title={filters.sortOrder === 'asc' ? t('challenge_filters.ascending', 'Ascending') : t('challenge_filters.descending', 'Descending')}
              >
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>

            {/* Advanced Filters Toggle */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="ml-auto"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {t('challenges:filters.advanced')}
              <ChevronDown className={cn(
                "w-4 h-4 ml-1 transition-transform",
                isAdvancedOpen && "rotate-180"
              )} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>        
        <CollapsibleContent className="space-y-0 data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prize Range */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    {t('challenges:filters.prize_range')}
                  </label>
                  <div className="px-3">
                    <Slider
                      value={filters.prizeRange}
                      onValueChange={(value) => updateFilter('prizeRange', value)}
                      max={dynamicMaxBudget}
                      min={0}
                      step={dynamicMaxBudget > 1000000 ? 100000 : 10000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>{filters.prizeRange[0].toLocaleString()}</span>
                      <span>{filters.prizeRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Participant Range */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {t('challenges:filters.participants_range')}
                  </label>
                  <div className="px-3">
                    <Slider
                      value={filters.participantRange}
                      onValueChange={(value) => updateFilter('participantRange', value)}
                      max={dynamicMaxParticipants}
                      min={0}
                      step={dynamicMaxParticipants > 100 ? 10 : 5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>{filters.participantRange[0]}</span>
                      <span>{filters.participantRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Active Filters & Clear */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <Badge variant="secondary">
            {activeFiltersCount} {isRTL ? t('challenge_filters.filters_active_ar', 'فلتر نشط') : t('challenge_filters.filters_active', 'active filters')}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="w-4 h-4 mr-2" />
            {isRTL ? t('challenge_filters.clear_all_ar', 'مسح الكل') : t('challenge_filters.clear_all', 'Clear all')}
          </Button>
        </div>
      )}
    </div>
  );
};
