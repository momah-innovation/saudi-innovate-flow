import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useUnifiedTranslation } from '@/hooks/useAppTranslation';
import { Search, Filter, Tag, FileText, Lightbulb, Target } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchResult {
  result_type: string;
  result_id: string;
  title: string;
  description: string;
  relevance_score: number;
}

interface SearchSuggestion {
  suggestion: string;
  suggestion_type: string;
  result_count: number;
}

interface SmartSearchProps {
  onResults: (results: SearchResult[]) => void;
  placeholder?: string;
  searchTypes?: string[];
  showFilters?: boolean;
}

export function SmartSearch({ 
  onResults, 
  placeholder = "search_placeholder", 
  searchTypes = ['all'],
  showFilters = true 
}: SmartSearchProps) {
  const { t, language } = useUnifiedTranslation();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(searchTypes);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  
  const debouncedQuery = useDebounce(query, 300);

  // Load search suggestions
  useEffect(() => {
    const loadSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        // Use basic tag search for now
        const { data: tagData, error: tagError } = await supabase
          .from('tags')
          .select('name_ar, name_en')
          .or(`name_ar.ilike.%${debouncedQuery}%,name_en.ilike.%${debouncedQuery}%`)
          .limit(5);

        if (!tagError && tagData) {
          const tagSuggestions = tagData.map(tag => ({
            suggestion: tag.name_ar || tag.name_en,
            suggestion_type: 'tag',
            result_count: 1
          }));
          setSuggestions(tagSuggestions);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error loading suggestions:', error);
        setSuggestions([]);
      }
    };

    loadSuggestions();
  }, [debouncedQuery, selectedTypes]);

  // Perform search
  const performSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setShowSuggestions(false);

    try {
      // For now, use basic search until RPC functions are fully registered
      let searchResults: SearchResult[] = [];

      // Search challenges
      if (selectedTypes.includes('all') || selectedTypes.includes('challenges')) {
        const { data: challengeData, error: challengeError } = await supabase
          .from('challenges')
          .select('id, title_ar, description_ar')
          .or(`title_ar.ilike.%${searchQuery}%,description_ar.ilike.%${searchQuery}%`)
          .limit(10);

        if (!challengeError && challengeData) {
          const challengeResults = challengeData.map(challenge => ({
            result_type: 'challenge',
            result_id: challenge.id,
            title: challenge.title_ar,
            description: challenge.description_ar || '',
            relevance_score: 1.0
          }));
          searchResults.push(...challengeResults);
        }
      }

      // Search ideas
      if (selectedTypes.includes('all') || selectedTypes.includes('ideas')) {
        const { data: ideaData, error: ideaError } = await supabase
          .from('ideas')
          .select('id, title_ar, description_ar')
          .or(`title_ar.ilike.%${searchQuery}%,description_ar.ilike.%${searchQuery}%`)
          .limit(10);

        if (!ideaError && ideaData) {
          const ideaResults = ideaData.map(idea => ({
            result_type: 'idea',
            result_id: idea.id,
            title: idea.title_ar,
            description: idea.description_ar || '',
            relevance_score: 1.0
          }));
          searchResults.push(...ideaResults);
        }
      }

      // Sort results based on user preference
      const sortedResults = searchResults.sort((a: SearchResult, b: SearchResult) => {
        switch (sortBy) {
          case 'relevance':
            return b.relevance_score - a.relevance_score;
          case 'type':
            return a.result_type.localeCompare(b.result_type);
          case 'title':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });

      onResults(sortedResults);

      // Track search analytics
      await supabase.from('analytics_events').insert({
        event_type: 'search_performed',
        event_category: 'user_interaction',
        properties: {
          query: searchQuery,
          result_count: sortedResults.length,
          search_types: selectedTypes,
          language: language
        }
      });

    } catch (error) {
      console.error('Search error:', error);
      onResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.suggestion);
    setShowSuggestions(false);
    performSearch(suggestion.suggestion);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'challenge': return <Target className="h-4 w-4" />;
      case 'idea': return <Lightbulb className="h-4 w-4" />;
      case 'tag': return <Tag className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'challenge': return 'bg-primary/10 text-primary';
      case 'idea': return 'bg-accent/10 text-accent-foreground';
      case 'tag': return 'bg-secondary/10 text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <Input
            type="text"
            placeholder={t(placeholder)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                performSearch();
              }
              if (e.key === 'Escape') {
                setShowSuggestions(false);
              }
            }}
            className="pl-10 pr-4"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />

          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
              <CardContent className="p-2">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {getTypeIcon(suggestion.suggestion_type)}
                      <span className="text-sm">{suggestion.suggestion}</span>
                    </div>
                    <Badge variant="outline" className={getTypeColor(suggestion.suggestion_type)}>
                      {t(suggestion.suggestion_type)}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <Button 
          onClick={() => performSearch()} 
          disabled={isLoading || !query.trim()}
          className="shrink-0"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>

        {showFilters && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{t('search_types')}</h4>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: t('all') },
                      { value: 'challenges', label: t('challenges') },
                      { value: 'ideas', label: t('ideas') },
                      { value: 'events', label: t('events') },
                      { value: 'partners', label: t('partners') }
                    ].map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={type.value}
                          checked={selectedTypes.includes(type.value)}
                          onCheckedChange={(checked) => {
                            if (type.value === 'all') {
                              setSelectedTypes(checked ? ['all'] : []);
                            } else {
                              setSelectedTypes(prev => {
                                const filtered = prev.filter(t => t !== 'all' && t !== type.value);
                                return checked ? [...filtered, type.value] : filtered;
                              });
                            }
                          }}
                        />
                        <Label htmlFor={type.value} className="text-sm">
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">{t('sort_by')}</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">{t('relevance')}</SelectItem>
                      <SelectItem value="type">{t('type')}</SelectItem>
                      <SelectItem value="title">{t('title')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}