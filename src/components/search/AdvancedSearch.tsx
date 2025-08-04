import { useState } from 'react';
import { Search, Filter, X, Sparkles, Mic, MicOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { TagSelector } from '@/components/ui/tag-selector';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SearchFilters {
  query: string;
  tags: string[];
  dateRange: string;
  contentType: string[];
  status: string[];
  priority: string[];
  author: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
  loading?: boolean;
  className?: string;
}

export function AdvancedSearch({ 
  onSearch, 
  onClear, 
  loading = false, 
  className 
}: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    tags: [],
    dateRange: 'all',
    contentType: [],
    status: [],
    priority: [],
    author: '',
    sortBy: 'relevance',
    sortOrder: 'desc'
  });
  
  const [aiSearchEnabled, setAiSearchEnabled] = useState(false);
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();

  const contentTypes = [
    { id: 'challenges', label: 'التحديات', label_en: 'Challenges' },
    { id: 'ideas', label: 'الأفكار', label_en: 'Ideas' },
    { id: 'events', label: 'الفعاليات', label_en: 'Events' },
    { id: 'opportunities', label: 'الفرص', label_en: 'Opportunities' },
    { id: 'partners', label: 'الشركاء', label_en: 'Partners' }
  ];

  const statusOptions = [
    { id: 'active', label: 'نشط', label_en: 'Active' },
    { id: 'planning', label: 'قيد التخطيط', label_en: 'Planning' },
    { id: 'completed', label: 'مكتمل', label_en: 'Completed' },
    { id: 'paused', label: 'متوقف', label_en: 'Paused' }
  ];

  const priorityOptions = [
    { id: 'critical', label: 'حرج', label_en: 'Critical' },
    { id: 'high', label: 'عالي', label_en: 'High' },
    { id: 'medium', label: 'متوسط', label_en: 'Medium' },
    { id: 'low', label: 'منخفض', label_en: 'Low' }
  ];

  const sortOptions = [
    { id: 'relevance', label: 'الصلة', label_en: 'Relevance' },
    { id: 'date', label: 'التاريخ', label_en: 'Date' },
    { id: 'title', label: 'العنوان', label_en: 'Title' },
    { id: 'popularity', label: 'الشعبية', label_en: 'Popularity' }
  ];

  const handleAiSearch = async () => {
    if (!filters.query.trim()) {
      toast({
        title: 'استعلام مطلوب',
        description: 'يرجى إدخال نص للبحث الذكي',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Call AI semantic search edge function
      const { data, error } = await supabase.functions.invoke('ai-semantic-search', {
        body: {
          query: filters.query,
          filters: {
            content_types: filters.contentType,
            tags: filters.tags,
            status: filters.status
          },
          limit: 20
        }
      });

      if (error) throw error;

      // Process AI search results
      toast({
        title: 'البحث الذكي مكتمل',
        description: `تم العثور على ${data.results?.length || 0} نتيجة ذات صلة`,
      });

      // Trigger search with AI enhancement
      onSearch({ ...filters, sortBy: 'ai_relevance' });
      
    } catch (error) {
      console.error('AI search error:', error);
      toast({
        title: 'خطأ في البحث الذكي',
        description: 'سيتم استخدام البحث التقليدي بدلاً من ذلك',
        variant: 'destructive',
      });
      
      // Fallback to regular search
      onSearch(filters);
    }
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: 'غير مدعوم',
        description: 'البحث الصوتي غير مدعوم في هذا المتصفح',
        variant: 'destructive',
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'ar-SA';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceSearchActive(true);
      toast({
        title: 'الاستماع...',
        description: 'تحدث الآن للبحث',
      });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setFilters(prev => ({ ...prev, query: transcript }));
      
      toast({
        title: 'تم التقاط الصوت',
        description: `البحث عن: ${transcript}`,
      });
    };

    recognition.onerror = () => {
      toast({
        title: 'خطأ في البحث الصوتي',
        description: 'حدث خطأ أثناء التقاط الصوت',
        variant: 'destructive',
      });
    };

    recognition.onend = () => {
      setVoiceSearchActive(false);
    };

    recognition.start();
  };

  const handleClear = () => {
    setFilters({
      query: '',
      tags: [],
      dateRange: 'all',
      contentType: [],
      status: [],
      priority: [],
      author: '',
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
    setShowAdvanced(false);
    onClear();
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'contentType' | 'status' | 'priority', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          البحث المتقدم
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث في المحتوى..."
              value={filters.query}
              onChange={(e) => updateFilter('query', e.target.value)}
              className="pl-10"
              onKeyPress={(e) => e.key === 'Enter' && onSearch(filters)}
            />
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleVoiceSearch}
            disabled={voiceSearchActive}
            className={cn(voiceSearchActive && 'bg-red-50 border-red-200')}
          >
            {voiceSearchActive ? (
              <MicOff className="h-4 w-4 text-red-600" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>

          {aiSearchEnabled ? (
            <Button 
              onClick={handleAiSearch}
              disabled={loading}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              بحث ذكي
            </Button>
          ) : (
            <Button 
              onClick={() => onSearch(filters)}
              disabled={loading}
            >
              بحث
            </Button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            فلاتر متقدمة
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAiSearchEnabled(!aiSearchEnabled)}
            className={cn(
              'gap-2',
              aiSearchEnabled && 'bg-primary text-primary-foreground'
            )}
          >
            <Sparkles className="h-4 w-4" />
            البحث الذكي
          </Button>

          {(filters.tags.length > 0 || filters.contentType.length > 0) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              مسح الفلاتر
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {(filters.tags.length > 0 || filters.contentType.length > 0 || filters.status.length > 0) && (
          <div className="flex flex-wrap gap-1">
            {filters.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('tags', filters.tags.filter(t => t !== tag))}
                />
              </Badge>
            ))}
            {filters.contentType.map(type => (
              <Badge key={type} variant="outline" className="gap-1">
                {contentTypes.find(ct => ct.id === type)?.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleArrayFilter('contentType', type)}
                />
              </Badge>
            ))}
          </div>
        )}

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            {/* Tag Selector */}
            <div>
              <label className="text-sm font-medium mb-2 block">العلامات</label>
              <TagSelector
                selectedTags={filters.tags}
                onTagsChange={(tags) => updateFilter('tags', tags)}
                category="all"
                placeholder="اختر العلامات..."
              />
            </div>

            {/* Content Type */}
            <div>
              <label className="text-sm font-medium mb-2 block">نوع المحتوى</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {contentTypes.map(type => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.id}
                      checked={filters.contentType.includes(type.id)}
                      onCheckedChange={() => toggleArrayFilter('contentType', type.id)}
                    />
                    <label htmlFor={type.id} className="text-sm">
                      {type.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">الحالة</label>
                <div className="space-y-2">
                  {statusOptions.map(status => (
                    <div key={status.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={status.id}
                        checked={filters.status.includes(status.id)}
                        onCheckedChange={() => toggleArrayFilter('status', status.id)}
                      />
                      <label htmlFor={status.id} className="text-sm">
                        {status.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">الأولوية</label>
                <div className="space-y-2">
                  {priorityOptions.map(priority => (
                    <div key={priority.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={priority.id}
                        checked={filters.priority.includes(priority.id)}
                        onCheckedChange={() => toggleArrayFilter('priority', priority.id)}
                      />
                      <label htmlFor={priority.id} className="text-sm">
                        {priority.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">ترتيب حسب</label>
                <Select 
                  value={filters.sortBy} 
                  onValueChange={(value) => updateFilter('sortBy', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">ترتيب</label>
                <Select 
                  value={filters.sortOrder} 
                  onValueChange={(value: 'asc' | 'desc') => updateFilter('sortOrder', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">تنازلي</SelectItem>
                    <SelectItem value="asc">تصاعدي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">المدة الزمنية</label>
              <Select 
                value={filters.dateRange} 
                onValueChange={(value) => updateFilter('dateRange', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأوقات</SelectItem>
                  <SelectItem value="today">اليوم</SelectItem>
                  <SelectItem value="week">هذا الأسبوع</SelectItem>
                  <SelectItem value="month">هذا الشهر</SelectItem>
                  <SelectItem value="year">هذا العام</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}