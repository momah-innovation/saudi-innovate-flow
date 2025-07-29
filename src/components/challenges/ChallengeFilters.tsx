import { useState } from 'react';
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
  Calendar,
  Award,
  Users,
  Target,
  SlidersHorizontal 
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

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
}

export const ChallengeFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  activeFiltersCount 
}: ChallengeFiltersProps) => {
  const { isRTL } = useDirection();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

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
    { value: 'all', label: isRTL ? 'جميع الحالات' : 'All Status' },
    { value: 'active', label: isRTL ? 'نشط' : 'Active' },
    { value: 'upcoming', label: isRTL ? 'قريباً' : 'Upcoming' },
    { value: 'closed', label: isRTL ? 'مغلق' : 'Closed' }
  ];

  const categoryOptions = [
    { value: 'all', label: isRTL ? 'جميع الفئات' : 'All Categories' },
    { value: 'environment', label: isRTL ? 'البيئة والاستدامة' : 'Environment & Sustainability' },
    { value: 'fintech', label: isRTL ? 'التكنولوجيا المالية' : 'FinTech' },
    { value: 'health', label: isRTL ? 'الصحة' : 'Healthcare' },
    { value: 'education', label: isRTL ? 'التعليم' : 'Education' },
    { value: 'transport', label: isRTL ? 'النقل' : 'Transportation' }
  ];

  const difficultyOptions = [
    { value: 'all', label: isRTL ? 'جميع المستويات' : 'All Levels' },
    { value: 'easy', label: isRTL ? 'سهل' : 'Easy' },
    { value: 'medium', label: isRTL ? 'متوسط' : 'Medium' },
    { value: 'hard', label: isRTL ? 'صعب' : 'Hard' }
  ];

  const sortOptions = [
    { value: 'deadline', label: isRTL ? 'الموعد النهائي' : 'Deadline' },
    { value: 'participants', label: isRTL ? 'عدد المشاركين' : 'Participants' },
    { value: 'prize', label: isRTL ? 'قيمة الجائزة' : 'Prize Amount' },
    { value: 'submissions', label: isRTL ? 'عدد المساهمات' : 'Submissions' },
    { value: 'created', label: isRTL ? 'تاريخ الإنشاء' : 'Created Date' }
  ];

  const featureOptions = [
    { value: 'trending', label: isRTL ? 'رائج' : 'Trending' },
    { value: 'featured', label: isRTL ? 'مميز' : 'Featured' },
    { value: 'new', label: isRTL ? 'جديد' : 'New' },
    { value: 'ending-soon', label: isRTL ? 'ينتهي قريباً' : 'Ending Soon' }
  ];

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg animate-fade-in">
      {/* Search and Basic Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={isRTL ? 'البحث في التحديات...' : 'Search challenges...'}
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
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

        <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
          <SelectTrigger className="w-full sm:w-[200px]">
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
            {/* Difficulty Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4" />
                {isRTL ? 'مستوى الصعوبة' : 'Difficulty Level'}
              </label>
              <Select value={filters.difficulty} onValueChange={(value) => updateFilter('difficulty', value)}>
                <SelectTrigger>
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

            {/* Deadline Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {isRTL ? 'الموعد النهائي' : 'Deadline'}
              </label>
              <Select value={filters.deadline} onValueChange={(value) => updateFilter('deadline', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? 'اختر المدة' : 'Select timeframe'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? 'جميع المواعيد' : 'All deadlines'}</SelectItem>
                  <SelectItem value="week">{isRTL ? 'خلال أسبوع' : 'Within a week'}</SelectItem>
                  <SelectItem value="month">{isRTL ? 'خلال شهر' : 'Within a month'}</SelectItem>
                  <SelectItem value="quarter">{isRTL ? 'خلال 3 أشهر' : 'Within 3 months'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Prize Range Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Award className="w-4 h-4" />
              {isRTL ? 'نطاق الجائزة (ريال)' : 'Prize Range (SAR)'}
            </label>
            <div className="px-3">
              <Slider
                value={filters.prizeRange}
                onValueChange={(value) => updateFilter('prizeRange', value)}
                max={100000}
                min={0}
                step={5000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>{filters.prizeRange[0].toLocaleString()}</span>
                <span>{filters.prizeRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Participants Range Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              {isRTL ? 'عدد المشاركين' : 'Number of Participants'}
            </label>
            <div className="px-3">
              <Slider
                value={filters.participantRange}
                onValueChange={(value) => updateFilter('participantRange', value)}
                max={1000}
                min={0}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>{filters.participantRange[0]}</span>
                <span>{filters.participantRange[1]}</span>
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