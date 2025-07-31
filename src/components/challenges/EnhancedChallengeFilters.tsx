import { useState, useEffect } from 'react';
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
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
  Zap
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

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

interface EnhancedChallengeFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  className?: string;
}

export const EnhancedChallengeFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  activeFiltersCount,
  className = ""
}: EnhancedChallengeFiltersProps) => {
  const { isRTL } = useDirection();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [animateFilters, setAnimateFilters] = useState(false);

  useEffect(() => {
    if (activeFiltersCount > 0) {
      setAnimateFilters(true);
      const timer = setTimeout(() => setAnimateFilters(false), 300);
      return () => clearTimeout(timer);
    }
  }, [activeFiltersCount]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleFeature = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    updateFilter('features', newFeatures);
  };

  const statusOptions = [
    { value: 'all', label: isRTL ? 'جميع الحالات' : 'All Status', icon: Target },
    { value: 'active', label: isRTL ? 'نشط' : 'Active', icon: Zap },
    { value: 'upcoming', label: isRTL ? 'قريباً' : 'Upcoming', icon: Calendar },
    { value: 'closed', label: isRTL ? 'مغلق' : 'Closed', icon: X }
  ];

  const categoryOptions = [
    { value: 'all', label: isRTL ? 'جميع الفئات' : 'All Categories' },
    { value: 'technical', label: isRTL ? 'تقني' : 'Technical' },
    { value: 'business', label: isRTL ? 'أعمال' : 'Business' },
    { value: 'health', label: isRTL ? 'صحة' : 'Health' },
    { value: 'educational', label: isRTL ? 'تعليمي' : 'Educational' },
    { value: 'environmental', label: isRTL ? 'بيئي' : 'Environmental' }
  ];

  const difficultyOptions = [
    { value: 'all', label: isRTL ? 'جميع المستويات' : 'All Levels' },
    { value: 'سهل', label: isRTL ? 'سهل' : 'Easy' },
    { value: 'متوسط', label: isRTL ? 'متوسط' : 'Medium' },
    { value: 'صعب', label: isRTL ? 'صعب' : 'Hard' }
  ];

  const sortOptions = [
    { value: 'deadline', label: isRTL ? 'الموعد النهائي' : 'Deadline', icon: Clock },
    { value: 'participants', label: isRTL ? 'عدد المشاركين' : 'Participants', icon: Users },
    { value: 'prize', label: isRTL ? 'قيمة الجائزة' : 'Prize Amount', icon: Award },
    { value: 'submissions', label: isRTL ? 'عدد المساهمات' : 'Submissions', icon: Target }
  ];

  const featureOptions = [
    { 
      value: 'trending', 
      label: isRTL ? 'رائج' : 'Trending', 
      icon: TrendingUp,
      color: 'orange'
    },
    { 
      value: 'featured', 
      label: isRTL ? 'مميز' : 'Featured', 
      icon: Star,
      color: 'yellow'
    },
    { 
      value: 'new', 
      label: isRTL ? 'جديد' : 'New', 
      icon: Sparkles,
      color: 'blue'
    },
    { 
      value: 'ending-soon', 
      label: isRTL ? 'ينتهي قريباً' : 'Ending Soon', 
      icon: Clock,
      color: 'red'
    }
  ];

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
        "transition-all duration-200 hover:scale-105 animate-fade-in",
        isSelected && "shadow-lg",
        animateFilters && "animate-pulse"
      )}
    >
      <option.icon className="w-3 h-3 mr-1" />
      {option.label}
    </Button>
  );

  return (
    <div className={cn("space-y-4 animate-fade-in", className)}>
      {/* Enhanced Search Bar */}
      <Card className={cn(
        "transition-all duration-300",
        searchFocused && "ring-2 ring-primary/20 shadow-lg scale-[1.02]"
      )}>
        <CardContent className="p-4">
          <div className="relative">
            <Search className={cn(
              "absolute left-3 top-3 h-4 w-4 transition-colors duration-200",
              searchFocused ? "text-primary" : "text-muted-foreground"
            )} />
            <Input
              placeholder={isRTL ? 'البحث في التحديات...' : 'Search challenges...'}
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="pl-10 h-12 text-base transition-all duration-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Filter Chips */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">
            {isRTL ? 'فلاتر سريعة' : 'Quick Filters'}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {featureOptions.map((option) => (
            <QuickFilterChip
              key={option.value}
              option={option}
              isSelected={filters.features.includes(option.value)}
              onClick={() => toggleFeature(option.value)}
            />
          ))}
        </div>
      </div>

      {/* Main Filters Row */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4" />
                {isRTL ? 'الحالة' : 'Status'}
              </label>
              <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                <SelectTrigger className="transition-all duration-200 hover:border-primary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {isRTL ? 'الفئة' : 'Category'}
              </label>
              <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                <SelectTrigger className="transition-all duration-200 hover:border-primary/50">
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

            {/* Difficulty Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                {isRTL ? 'الصعوبة' : 'Difficulty'}
              </label>
              <Select value={filters.difficulty} onValueChange={(value) => updateFilter('difficulty', value)}>
                <SelectTrigger className="transition-all duration-200 hover:border-primary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficultyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Award className="w-4 h-4" />
                {isRTL ? 'ترتيب حسب' : 'Sort by'}
              </label>
              <div className="flex gap-2">
                <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                  <SelectTrigger className="transition-all duration-200 hover:border-primary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className="w-4 h-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 transition-all duration-200 hover:scale-105"
                >
                  {filters.sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full transition-all duration-200 hover:bg-muted/80"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            {isRTL ? 'فلاتر متقدمة' : 'Advanced Filters'}
            <ChevronDown className={cn(
              "w-4 h-4 ml-2 transition-transform duration-200",
              isAdvancedOpen && "rotate-180"
            )} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="animate-accordion-down">
          <Card className="mt-4">
            <CardContent className="p-6 space-y-6">
              {/* Prize Range */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  {isRTL ? 'نطاق الجائزة (ر.س)' : 'Prize Range (SAR)'}
                </label>
                <div className="px-3">
                  <Slider
                    value={filters.prizeRange}
                    onValueChange={(value) => updateFilter('prizeRange', value as [number, number])}
                    max={10000000}
                    min={0}
                    step={10000}
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
                  {isRTL ? 'نطاق المشاركين' : 'Participants Range'}
                </label>
                <div className="px-3">
                  <Slider
                    value={filters.participantRange}
                    onValueChange={(value) => updateFilter('participantRange', value as [number, number])}
                    max={5000}
                    min={0}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>{filters.participantRange[0]}</span>
                    <span>{filters.participantRange[1]}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Active Filters & Clear */}
      {activeFiltersCount > 0 && (
        <Card className="animate-scale-in">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "transition-all duration-200",
                    animateFilters && "animate-pulse"
                  )}
                >
                  {activeFiltersCount} {isRTL ? 'فلتر نشط' : 'active filters'}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-muted-foreground hover:text-destructive transition-colors duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                {isRTL ? 'مسح الكل' : 'Clear all'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};