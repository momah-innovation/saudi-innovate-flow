import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Brain,
  Filter,
  TrendingUp,
  Clock,
  Star,
  Eye,
  Lightbulb,
  Target,
  Users,
  Calendar,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { aiService } from '@/services/AIService';
import { useRTLAware } from '@/hooks/useRTLAware';

interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
  relevanceScore: number;
  tags: string[];
  createdAt: string;
  author?: string;
  status?: string;
}

interface SearchFilter {
  entityTypes: string[];
  dateRange: string;
  sortBy: string;
  minRelevance: number;
}

const ENTITY_TYPES = [
  { value: 'idea', label: 'الأفكار', icon: Lightbulb },
  { value: 'challenge', label: 'التحديات', icon: Target },
  { value: 'opportunity', label: 'الفرص', icon: Star },
  { value: 'event', label: 'الفعاليات', icon: Calendar },
  { value: 'partner', label: 'الشركاء', icon: Users },
];

export const SmartSearchPanel: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilter>({
    entityTypes: [],
    dateRange: 'all',
    sortBy: 'relevance',
    minRelevance: 0
  });
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [popularQueries, setPopularQueries] = useState<string[]>([]);
  const { toast } = useToast();
  const { start, me, ps } = useRTLAware();

  useEffect(() => {
    loadSearchHistory();
    loadPopularQueries();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // In a real implementation, you'd load this from a user_search_history table
      const savedHistory = localStorage.getItem(`search_history_${user.id}`);
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory).slice(0, 10));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const loadPopularQueries = async () => {
    try {
      // Mock popular queries - in real implementation, fetch from analytics
      setPopularQueries([
        'الذكاء الاصطناعي',
        'التحول الرقمي',
        'الاستدامة',
        'الابتكار الحكومي',
        'تقنية البلوك تشين'
      ]);
    } catch (error) {
      console.error('Error loading popular queries:', error);
    }
  };

  const saveSearchToHistory = async (searchQuery: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !searchQuery.trim()) return;

      const updatedHistory = [
        searchQuery,
        ...searchHistory.filter(h => h !== searchQuery)
      ].slice(0, 10);

      setSearchHistory(updatedHistory);
      localStorage.setItem(`search_history_${user.id}`, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const performSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      saveSearchToHistory(query);

      const searchResults = await aiService.semanticSearch(
        query,
        filters.entityTypes,
        20
      );

      // Transform and filter results based on user preferences
      const processedResults = searchResults
        .filter(result => result.relevanceScore >= filters.minRelevance)
        .sort((a, b) => {
          switch (filters.sortBy) {
            case 'date':
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'popularity':
              return (b.popularityScore || 0) - (a.popularityScore || 0);
            default:
              return b.relevanceScore - a.relevanceScore;
          }
        });

      setResults(processedResults);

      if (processedResults.length === 0) {
        toast({
          title: 'لا توجد نتائج',
          description: 'لم يتم العثور على نتائج مطابقة لبحثك',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error performing search:', error);
      toast({
        title: 'خطأ في البحث',
        description: 'فشل في تنفيذ البحث، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const updateEntityTypeFilter = (entityType: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      entityTypes: checked
        ? [...prev.entityTypes, entityType]
        : prev.entityTypes.filter(type => type !== entityType)
    }));
  };

  const getEntityIcon = (type: string) => {
    const entityType = ENTITY_TYPES.find(et => et.value === type);
    return entityType ? entityType.icon : Search;
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">البحث الذكي</h1>
          <p className="text-muted-foreground">
            البحث الدلالي المتقدم بالذكاء الاصطناعي
          </p>
        </div>
      </div>

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            <CardTitle>البحث الدلالي</CardTitle>
          </div>
          <CardDescription>
            ابحث باستخدام المعنى والسياق، وليس فقط الكلمات المفتاحية
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className={`absolute ${start('3')} top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4`} />
              <Input
                placeholder="ابحث عن الأفكار والتحديات والفرص..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className={ps('10')}
              />
            </div>
            <Button onClick={performSearch} disabled={loading}>
              {loading ? (
                <Brain className="h-4 w-4 animate-pulse" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Quick Actions */}
          {(searchHistory.length > 0 || popularQueries.length > 0) && (
            <div className="space-y-3">
              {searchHistory.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">البحث السابق:</h4>
                  <div className="flex flex-wrap gap-1">
                    {searchHistory.slice(0, 5).map((historyQuery, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setQuery(historyQuery);
                          performSearch();
                        }}
                        className="text-xs h-7"
                      >
                        <Clock className={`h-3 w-3 ${me('1')}`} />
                        {historyQuery}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {popularQueries.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">البحث الشائع:</h4>
                  <div className="flex flex-wrap gap-1">
                    {popularQueries.map((popularQuery, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setQuery(popularQuery);
                          performSearch();
                        }}
                        className="text-xs h-7"
                      >
                        <TrendingUp className={`h-3 w-3 ${me('1')}`} />
                        {popularQuery}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <CardTitle className="text-lg">المرشحات</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Entity Types */}
              <div>
                <h4 className="text-sm font-medium mb-2">نوع المحتوى:</h4>
                <div className="space-y-2">
                  {ENTITY_TYPES.map((entityType) => {
                    const IconComponent = entityType.icon;
                    return (
                      <div key={entityType.value} className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id={entityType.value}
                          checked={filters.entityTypes.includes(entityType.value)}
                          onCheckedChange={(checked) => 
                            updateEntityTypeFilter(entityType.value, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={entityType.value}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                        >
                          <IconComponent className="h-4 w-4" />
                          {entityType.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <h4 className="text-sm font-medium mb-2">النطاق الزمني:</h4>
                <Select 
                  value={filters.dateRange} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأوقات</SelectItem>
                    <SelectItem value="week">الأسبوع الماضي</SelectItem>
                    <SelectItem value="month">الشهر الماضي</SelectItem>
                    <SelectItem value="quarter">الربع الماضي</SelectItem>
                    <SelectItem value="year">السنة الماضية</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div>
                <h4 className="text-sm font-medium mb-2">ترتيب النتائج:</h4>
                <Select 
                  value={filters.sortBy} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">الصلة</SelectItem>
                    <SelectItem value="date">التاريخ</SelectItem>
                    <SelectItem value="popularity">الشعبية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 animate-pulse mx-auto mb-4 text-blue-500" />
              <p className="text-lg font-medium">جاري البحث الذكي...</p>
              <p className="text-sm text-muted-foreground">تحليل المحتوى والعثور على أفضل النتائج</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  العثور على {results.length} نتيجة للبحث "{query}"
                </h3>
                <Badge variant="secondary" className="text-xs">
                  <Zap className={`h-3 w-3 ${me('1')}`} />
                  بحث ذكي
                </Badge>
              </div>

              <div className="space-y-4">
                {results.map((result) => {
                  const IconComponent = getEntityIcon(result.type);
                  return (
                    <Card key={result.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-5 w-5 text-gray-500" />
                              <h4 className="font-medium text-lg">{result.title}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {ENTITY_TYPES.find(et => et.value === result.type)?.label || result.type}
                              </Badge>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${getRelevanceColor(result.relevanceScore)}`}
                              >
                                {Math.round(result.relevanceScore * 100)}% مطابقة
                              </Badge>
                            </div>
                          </div>

                          <p className="text-gray-600 line-clamp-2">
                            {result.description}
                          </p>

                          {result.tags && result.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {result.tags.slice(0, 5).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {result.tags.length > 5 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{result.tags.length - 5} أكثر
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              {result.author && (
                                <span>بواسطة: {result.author}</span>
                              )}
                              <span>{new Date(result.createdAt).toLocaleDateString('ar')}</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className={`h-4 w-4 ${me('1')}`} />
                              عرض التفاصيل
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          ) : query ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">لم يتم العثور على نتائج</p>
              <p className="text-sm text-muted-foreground">جرب تعديل كلمات البحث أو المرشحات</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">ابدأ البحث الذكي</p>
              <p className="text-sm text-muted-foreground">استخدم البحث الدلالي للعثور على المحتوى ذي الصلة</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};