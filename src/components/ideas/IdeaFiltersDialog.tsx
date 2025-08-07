import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useDirection } from '@/components/ui/direction-provider';
import { supabase } from '@/integrations/supabase/client';
import { 
  Filter, X, RotateCcw, Target, Star, TrendingUp, 
   Calendar, Building, Users, Zap, FileCheck 
 } from 'lucide-react';
import { logger } from '@/utils/logger';

interface FilterState {
  status: string[];
  maturity: string[];
  sectors: string[];
  challenges: string[];
  scoreRange: [number, number];
  dateRange: string;
  featured: boolean;
  trending: boolean;
}

interface IdeaFiltersDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
}

export function IdeaFiltersDialog({ 
  isOpen, 
  onOpenChange, 
  filters, 
  onApplyFilters 
}: IdeaFiltersDialogProps) {
  const { isRTL } = useDirection();
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [sectors, setSectors] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadFilterOptions();
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  const loadFilterOptions = async () => {
    try {
      // Load sectors
      const { data: sectorsData } = await supabase
        .from('sectors')
        .select('id, name_ar')
        .order('name_ar');

      // Load challenges
      const { data: challengesData } = await supabase
        .from('challenges')
        .select('id, title_ar')
        .eq('status', 'active')
        .order('title_ar');

      setSectors(sectorsData || []);
      setChallenges(challengesData || []);
    } catch (error) {
      logger.error('Error loading filter options', { component: 'IdeaFiltersDialog', action: 'loadFilterOptions' }, error as Error);
    }
  };

  const ideaStatusOptions = getSettingValue('idea_status_options', []) as string[];
  const ideaMaturityLevels = getSettingValue('idea_maturity_levels', []) as string[];

  const statusOptions = ideaStatusOptions.map(status => ({ 
    value: status.toLowerCase().replace(' ', '_'), 
    label: status 
  }));

  const maturityOptions = ideaMaturityLevels.map(maturity => ({ 
    value: maturity.toLowerCase(), 
    label: maturity 
  }));

  const dateRangeOptions = [
    { value: 'all', label: isRTL ? 'جميع الفترات' : 'All time' },
    { value: 'week', label: isRTL ? 'آخر أسبوع' : 'Last week' },
    { value: 'month', label: isRTL ? 'آخر شهر' : 'Last month' },
    { value: 'quarter', label: isRTL ? 'آخر 3 أشهر' : 'Last quarter' },
    { value: 'year', label: isRTL ? 'آخر سنة' : 'Last year' }
  ];

  const handleStatusChange = (value: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      status: checked 
        ? [...prev.status, value]
        : prev.status.filter(s => s !== value)
    }));
  };

  const handleMaturityChange = (value: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      maturity: checked 
        ? [...prev.maturity, value]
        : prev.maturity.filter(m => m !== value)
    }));
  };

  const handleSectorChange = (value: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      sectors: checked 
        ? [...prev.sectors, value]
        : prev.sectors.filter(s => s !== value)
    }));
  };

  const handleChallengeChange = (value: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      challenges: checked 
        ? [...prev.challenges, value]
        : prev.challenges.filter(c => c !== value)
    }));
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      status: [],
      maturity: [],
      sectors: [],
      challenges: [],
      scoreRange: [0, 10],
      dateRange: 'all',
      featured: false,
      trending: false
    };
    setLocalFilters(defaultFilters);
  };

  const applyFilters = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.status.length > 0) count++;
    if (localFilters.maturity.length > 0) count++;
    if (localFilters.sectors.length > 0) count++;
    if (localFilters.challenges.length > 0) count++;
    if (localFilters.scoreRange[0] > 0 || localFilters.scoreRange[1] < 10) count++;
    if (localFilters.dateRange !== 'all') count++;
    if (localFilters.featured) count++;
    if (localFilters.trending) count++;
    return count;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl flex items-center gap-2">
              <Filter className="w-5 h-5" />
              {isRTL ? 'تصفية الأفكار' : 'Filter Ideas'}
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </DialogTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetFilters}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {isRTL ? 'إعادة تعيين' : 'Reset'}
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 p-1">
          {/* Quick Filters */}
          <div>
            <Label className="text-sm font-medium mb-3 flex items-center gap-2">
              <Star className="w-4 h-4" />
              {isRTL ? 'فلاتر سريعة' : 'Quick Filters'}
            </Label>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={localFilters.featured}
                  onCheckedChange={(checked) => 
                    setLocalFilters(prev => ({ ...prev, featured: Boolean(checked) }))
                  }
                />
                <Label htmlFor="featured" className="text-sm flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {isRTL ? 'الأفكار المميزة' : 'Featured Ideas'}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="trending"
                  checked={localFilters.trending}
                  onCheckedChange={(checked) => 
                    setLocalFilters(prev => ({ ...prev, trending: Boolean(checked) }))
                  }
                />
                <Label htmlFor="trending" className="text-sm flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {isRTL ? 'الأفكار الرائجة' : 'Trending Ideas'}
                </Label>
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              {isRTL ? 'حالة الفكرة' : 'Idea Status'}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {statusOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${option.value}`}
                    checked={localFilters.status.includes(option.value)}
                    onCheckedChange={(checked) => 
                      handleStatusChange(option.value, Boolean(checked))
                    }
                  />
                  <Label htmlFor={`status-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Maturity Level Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {isRTL ? 'مستوى النضج' : 'Maturity Level'}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {maturityOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`maturity-${option.value}`}
                    checked={localFilters.maturity.includes(option.value)}
                    onCheckedChange={(checked) => 
                      handleMaturityChange(option.value, Boolean(checked))
                    }
                  />
                  <Label htmlFor={`maturity-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Score Range Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              {isRTL ? 'نطاق النتيجة' : 'Score Range'}
            </Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{localFilters.scoreRange[0]}</span>
                <span>{localFilters.scoreRange[1]}</span>
              </div>
              <Slider
                value={localFilters.scoreRange}
                onValueChange={(value) => 
                  setLocalFilters(prev => ({ ...prev, scoreRange: value as [number, number] }))
                }
                max={10}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>
          </div>

          {/* Sectors Filter */}
          {sectors.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-3 flex items-center gap-2">
                <Building className="w-4 h-4" />
                {isRTL ? 'القطاعات' : 'Sectors'}
              </Label>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                {sectors.map((sector) => (
                  <div key={sector.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`sector-${sector.id}`}
                      checked={localFilters.sectors.includes(sector.id)}
                      onCheckedChange={(checked) => 
                        handleSectorChange(sector.id, Boolean(checked))
                      }
                    />
                    <Label htmlFor={`sector-${sector.id}`} className="text-sm">
                      {sector.name_ar}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenges Filter */}
          {challenges.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                {isRTL ? 'التحديات' : 'Challenges'}
              </Label>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                {challenges.slice(0, 10).map((challenge) => (
                  <div key={challenge.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`challenge-${challenge.id}`}
                      checked={localFilters.challenges.includes(challenge.id)}
                      onCheckedChange={(checked) => 
                        handleChallengeChange(challenge.id, Boolean(checked))
                      }
                    />
                    <Label htmlFor={`challenge-${challenge.id}`} className="text-sm">
                      {challenge.title_ar}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Date Range Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {isRTL ? 'فترة زمنية' : 'Date Range'}
            </Label>
            <Select 
              value={localFilters.dateRange} 
              onValueChange={(value) => 
                setLocalFilters(prev => ({ ...prev, dateRange: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-between">
          <div className="text-sm text-muted-foreground">
            {getActiveFiltersCount() > 0 
              ? `${getActiveFiltersCount()} ${isRTL ? 'فلاتر نشطة' : 'active filters'}`
              : isRTL ? 'لا توجد فلاتر نشطة' : 'No active filters'
            }
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button onClick={applyFilters} className="gap-2">
              <Filter className="w-4 h-4" />
              {isRTL ? 'تطبيق الفلاتر' : 'Apply Filters'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}