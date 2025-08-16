import { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Users, Calendar, Target, Building, Lightbulb } from 'lucide-react';
import { useTimerManager } from '@/utils/timerManager';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TypeBadge } from '@/components/ui/TypeBadge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useDirection } from '@/components/ui/direction-provider';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { cn } from '@/lib/utils';
import { logger } from '@/utils/logger';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'campaign' | 'challenge' | 'event' | 'stakeholder' | 'expert' | 'idea' | 'partner';
  status?: string;
  icon: React.ElementType;
  url: string;
  metadata?: Record<string, any>;
}

interface GlobalSearchProps {
  placeholder?: string;
  className?: string;
  onResultClick?: (result: SearchResult) => void;
}

export function GlobalSearch({ placeholder, className, onResultClick }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const { hasRole, userProfile } = useAuth();
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchTimeout = useRef<number>();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const { setTimeout: scheduleTimeout } = useTimerManager();
    const clearTimer = scheduleTimeout(() => {
      performSearch(query.trim());
    }, 300);
    searchTimeout.current = Date.now(); // Simple reference for cleanup

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    let searchResults: SearchResult[] = [];

    try {
      const searchLower = searchQuery.toLowerCase();

      // Check if user is team member once
      const { data: teamMemberData } = await supabase
        .from('innovation_team_members')
        .select('id')
        .eq('user_id', userProfile?.id)
        .maybeSingle();
      
      const isTeamMemberFlag = !!teamMemberData;
      const isAdmin = hasRole('admin');

      // Search campaigns (all users can view campaigns)
      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('id, title_ar, description_ar, status')
        .or(`title_ar.ilike.%${searchQuery}%,description_ar.ilike.%${searchQuery}%`)
        .limit(5);

      campaigns?.forEach(campaign => {
        searchResults.push({
          id: campaign.id,
          title: campaign.title_ar,
          description: campaign.description_ar,
          type: 'campaign',
          status: campaign.status,
          icon: Target,
          url: `/admin/campaigns?highlight=${campaign.id}`,
          metadata: { status: campaign.status }
        });
      });

      // Search challenges (based on sensitivity level and user permissions)
      let challengeQuery = supabase
        .from('challenges')
        .select('id, title_ar, description_ar, status, sensitivity_level')
        .or(`title_ar.ilike.%${searchQuery}%,description_ar.ilike.%${searchQuery}%`)
        .limit(5);

      // Filter based on user permissions
      if (!isAdmin) {
        challengeQuery = challengeQuery.eq('sensitivity_level', 'normal');
        
        // Team members can see sensitive challenges
        if (isTeamMemberFlag) {
          challengeQuery = challengeQuery.in('sensitivity_level', ['normal', 'sensitive']);
        }
      }

      const { data: challenges } = await challengeQuery;

      challenges?.forEach(challenge => {
        searchResults = [...searchResults, {
          id: challenge.id,
          title: challenge.title_ar,
          description: challenge.description_ar,
          type: 'challenge',
          status: challenge.status,
          icon: Lightbulb,
          url: `/challenges/${challenge.id}`,
          metadata: { 
            status: challenge.status,
            sensitivity: challenge.sensitivity_level 
          }
        }];
      });

      // Search events (all users can view events)
      const { data: events } = await supabase
        .from('events')
        .select('id, title_ar, description_ar, status, event_date')
        .or(`title_ar.ilike.%${searchQuery}%,description_ar.ilike.%${searchQuery}%`)
        .limit(5);

      events?.forEach(event => {
        searchResults.push({
          id: event.id,
          title: event.title_ar,
          description: event.description_ar,
          type: 'event',
          status: event.status,
          icon: Calendar,
          url: `/admin/events?highlight=${event.id}`,
          metadata: { 
            status: event.status,
            date: event.event_date 
          }
        });
      });

      // Search stakeholders (team members and admins only)
      if (isAdmin || isTeamMemberFlag) {
        const { data: stakeholders } = await supabase
          .from('stakeholders')
          .select('id, name, organization, email')
          .or(`name.ilike.%${searchQuery}%,organization.ilike.%${searchQuery}%`)
          .limit(5);

        stakeholders?.forEach(stakeholder => {
          searchResults.push({
            id: stakeholder.id,
            title: stakeholder.name,
            description: `${stakeholder.organization} - ${stakeholder.email}`,
            type: 'stakeholder',
            icon: Users,
            url: `/admin/stakeholders?highlight=${stakeholder.id}`,
            metadata: { organization: stakeholder.organization }
          });
        });
      }

      // Search partners (team members and admins only)
      if (isAdmin || isTeamMemberFlag) {
        const { data: partners } = await supabase
          .from('partners')
          .select('id, name, partner_type, email')
          .or(`name.ilike.%${searchQuery}%,partner_type.ilike.%${searchQuery}%`)
          .limit(5);

        partners?.forEach(partner => {
          searchResults.push({
            id: partner.id,
            title: partner.name,
            description: `${partner.partner_type} - ${partner.email || 'No email'}`,
            type: 'partner',
            icon: Building,
            url: `/admin/partners?highlight=${partner.id}`,
            metadata: { type: partner.partner_type }
          });
        });
      }

      // Search ideas (users can see their own ideas, evaluators can see assigned ideas, admins see all)
      let ideaQuery = supabase
        .from('ideas')
        .select(`
          id, title_ar, description_ar, status,
          innovators!inner(user_id)
        `)
        .or(`title_ar.ilike.%${searchQuery}%,description_ar.ilike.%${searchQuery}%`)
        .limit(5);

      if (!isAdmin) {
        // Regular users see only their own ideas
        ideaQuery = ideaQuery.eq('innovators.user_id', userProfile?.id);
      }

      const { data: ideas } = await ideaQuery;

      ideas?.forEach(idea => {
        searchResults.push({
          id: idea.id,
          title: idea.title_ar,
          description: idea.description_ar,
          type: 'idea',
          status: idea.status,
          icon: FileText,
          url: `/ideas/${idea.id}`,
          metadata: { status: idea.status }
        });
      });

      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
      setSelectedIndex(0);

    } catch (error) {
      logger.error('Global search failed', { 
        component: 'GlobalSearch', 
        action: 'performSearch',
        query: searchQuery 
      }, error as Error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery('');
    setIsOpen(false);
    
    if (onResultClick) {
      onResultClick(result);
    } else {
      navigate(result.url);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'campaign': return 'bg-blue-100 text-blue-800';
      case 'challenge': return 'bg-purple-100 text-purple-800';
      case 'event': return 'bg-green-100 text-green-800';
      case 'stakeholder': return 'bg-orange-100 text-orange-800';
      case 'partner': return 'bg-cyan-100 text-cyan-800';
      case 'idea': return 'bg-yellow-100 text-yellow-800';
      case 'expert': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      campaign: isRTL ? 'حملة' : 'Campaign',
      challenge: isRTL ? 'تحدي' : 'Challenge',
      event: isRTL ? 'فعالية' : 'Event',
      stakeholder: isRTL ? 'معني' : 'Stakeholder',
      partner: isRTL ? 'شريك' : 'Partner',
      idea: isRTL ? 'فكرة' : 'Idea',
      expert: isRTL ? 'خبير' : 'Expert'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div ref={searchRef} className={cn("relative flex-1 max-w-md", className)}>
      <div className="relative">
        <Search className={cn(
          "absolute top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4",
          isRTL ? "right-3" : "left-3"
        )} />
        <Input
          ref={inputRef}
          placeholder={placeholder || (isRTL ? 'البحث في التحديات والأفكار والمعنيين...' : 'Search challenges, ideas, stakeholders...')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          className={cn(
            "bg-background/10 border-background/20 text-primary-foreground placeholder:text-primary-foreground/60",
            isRTL ? "pr-10 pl-8 text-right" : "pl-10 pr-8"
          )}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className={cn(
              "absolute top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground",
              isRTL ? "left-2" : "right-2"
            )}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (results.length > 0 || isLoading) && (
        <Card className={cn(
          "absolute top-full mt-1 w-full max-h-96 overflow-y-auto z-50 shadow-lg border",
          isRTL ? "right-0" : "left-0"
        )}>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                {isRTL ? 'جاري البحث...' : 'Searching...'}
              </div>
            ) : (
              <>
                {results.map((result, index) => {
                  const IconComponent = result.icon;
                  return (
                    <div
                      key={`${result.type}-${result.id}`}
                      className={cn(
                        "flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-border/50 last:border-b-0",
                        index === selectedIndex ? "bg-muted" : "hover:bg-muted/50",
                        isRTL ? "flex-row-reverse text-right" : ""
                      )}
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className={cn("flex items-center gap-2 mb-1", isRTL ? "flex-row-reverse" : "")}>
                          <h4 className="font-medium text-sm truncate">{result.title}</h4>
                          <TypeBadge type={result.type} size="sm" />
                        </div>
                        {result.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {result.description}
                          </p>
                        )}
                        {result.metadata?.status && (
                          <div className={cn("flex items-center gap-1 mt-1", isRTL ? "flex-row-reverse" : "")}>
                            <Badge variant="outline" className="text-xs">
                              {result.metadata.status}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {results.length === 0 && !isLoading && (
                  <div className="p-4 text-center text-muted-foreground">
                    {isRTL ? 'لا توجد نتائج' : 'No results found'}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}