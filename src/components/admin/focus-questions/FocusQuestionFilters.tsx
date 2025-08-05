import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useAppTranslation";
import { useSystemLists } from "@/hooks/useSystemLists";
import { useRTLAware } from '@/hooks/useRTLAware';
import { 
  Search, 
  Filter, 
  X, 
  RotateCcw,
  Target,
  Shield,
  Hash,
  Calendar
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Challenge {
  id: string;
  title_ar: string;
  status: string;
}

interface FocusQuestionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  questionType: string;
  onQuestionTypeChange: (value: string) => void;
  sensitivity: string;
  onSensitivityChange: (value: string) => void;
  challengeId: string;
  onChallengeChange: (value: string) => void;
  challenges: Challenge[];
  sortBy: string;
  onSortChange: (value: string) => void;
  compact?: boolean;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

export function FocusQuestionFilters({
  searchTerm,
  onSearchChange,
  questionType,
  onQuestionTypeChange,
  sensitivity,
  onSensitivityChange,
  challengeId,
  onChallengeChange,
  challenges,
  sortBy,
  onSortChange,
  compact = false,
  onClearFilters,
  activeFiltersCount
}: FocusQuestionFiltersProps) {
  const { t, isRTL } = useTranslation();
  const { me, start, ps } = useRTLAware();
  const { focusQuestionTypes } = useSystemLists();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const questionTypeOptions = [
    { value: 'all', label: 'جميع الأنواع' },
    { value: 'general', label: 'عام' },
    { value: 'technical', label: 'تقني' },
    { value: 'business', label: 'أعمال' },
    { value: 'impact', label: 'تأثير' },
    { value: 'implementation', label: 'تنفيذ' },
    { value: 'social', label: 'اجتماعي' },
    { value: 'ethical', label: 'أخلاقي' },
    { value: 'medical', label: 'طبي' },
    { value: 'regulatory', label: 'تنظيمي' },
    { value: 'open_ended', label: 'سؤال مفتوح' },
    { value: 'multiple_choice', label: 'متعدد الخيارات' },
    { value: 'yes_no', label: 'نعم/لا' },
    { value: 'rating', label: 'تقييم' },
    { value: 'ranking', label: 'ترتيب' }
  ];

  const sensitivityOptions = [
    { value: 'all', label: 'جميع المستويات' },
    { value: 'sensitive', label: 'حساس' },
    { value: 'normal', label: 'عادي' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'الأحدث أولاً' },
    { value: 'oldest', label: 'الأقدم أولاً' },
    { value: 'order_asc', label: 'الترتيب (تصاعدي)' },
    { value: 'order_desc', label: 'الترتيب (تنازلي)' },
    { value: 'alphabetical', label: 'أبجدي' },
    { value: 'type', label: 'حسب النوع' }
  ];

  const getActiveFilters = () => {
    const filters = [];
    if (questionType !== 'all') {
      const typeLabel = questionTypeOptions.find(opt => opt.value === questionType)?.label;
      filters.push({ key: 'type', label: `النوع: ${typeLabel}` });
    }
    if (sensitivity !== 'all') {
      const sensitivityLabel = sensitivityOptions.find(opt => opt.value === sensitivity)?.label;
      filters.push({ key: 'sensitivity', label: `الحساسية: ${sensitivityLabel}` });
    }
    if (challengeId !== 'all') {
      const challengeLabel = challenges.find(c => c.id === challengeId)?.title_ar;
      filters.push({ key: 'challenge', label: `التحدي: ${challengeLabel}` });
    }
    return filters;
  };

  const activeFilters = getActiveFilters();

  return (
    <Card className="border-border/50" dir={isRTL ? 'rtl' : 'ltr'}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Filter className="w-5 h-5" />
            البحث والتصفية
          </CardTitle>
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {activeFiltersCount} مرشح نشط
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-8 px-2"
              >
                <RotateCcw className={`w-4 h-4 ${me('1')}`} />
                مسح
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className={`absolute ${start('3')} top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
          <Input
            placeholder="البحث في الأسئلة المحورية..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={ps('10')}
            dir="rtl"
          />
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <Badge key={filter.key} variant="secondary" className="flex items-center gap-1">
                {filter.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-auto p-0 ${me('1')} hover:bg-transparent`}
                  onClick={() => {
                    if (filter.key === 'type') onQuestionTypeChange('all');
                    if (filter.key === 'sensitivity') onSensitivityChange('all');
                    if (filter.key === 'challenge') onChallengeChange('all');
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Filters Section */}
        {!compact ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Question Type Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                نوع السؤال
              </Label>
              <Select value={questionType} onValueChange={onQuestionTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {questionTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sensitivity Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                مستوى الحساسية
              </Label>
              <Select value={sensitivity} onValueChange={onSensitivityChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sensitivityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Challenge Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                التحدي المرتبط
              </Label>
              <Select value={challengeId} onValueChange={onChallengeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التحديات</SelectItem>
                  <SelectItem value="none">غير مرتبط بتحدي</SelectItem>
                  {challenges.map((challenge) => (
                    <SelectItem key={challenge.id} value={challenge.id}>
                      {challenge.title_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                ترتيب حسب
              </Label>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger>
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
            </div>
          </div>
        ) : (
          <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  خيارات التصفية المتقدمة
                </span>
                {isFilterOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Filter className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نوع السؤال</Label>
                  <Select value={questionType} onValueChange={onQuestionTypeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>مستوى الحساسية</Label>
                  <Select value={sensitivity} onValueChange={onSensitivityChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sensitivityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>التحدي المرتبط</Label>
                  <Select value={challengeId} onValueChange={onChallengeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع التحديات</SelectItem>
                      <SelectItem value="none">غير مرتبط بتحدي</SelectItem>
                      {challenges.map((challenge) => (
                        <SelectItem key={challenge.id} value={challenge.id}>
                          {challenge.title_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>ترتيب حسب</Label>
                  <Select value={sortBy} onValueChange={onSortChange}>
                    <SelectTrigger>
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
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}