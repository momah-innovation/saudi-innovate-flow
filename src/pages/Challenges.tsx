import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { EnhancedChallengeCard } from '@/components/challenges/EnhancedChallengeCard';
import { EnhancedChallengesHero } from '@/components/challenges/EnhancedChallengesHero';
import { ChallengeFilters, FilterState } from '@/components/challenges/ChallengeFilters';
import { ChallengeListView } from '@/components/challenges/ChallengeListView';
import { ChallengeTableView } from '@/components/challenges/ChallengeTableView';
import { ChallengeCalendarView } from '@/components/challenges/ChallengeCalendarView';
import { LayoutSelector, ViewMode } from '@/components/ui/layout-selector';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';
import { useChallengesData } from '@/hooks/useChallengesData';
import { useRealTimeChallenges } from '@/hooks/useRealTimeChallenges';
import { useChallengeDefaults } from '@/hooks/useChallengeDefaults';
import { challengesPageConfig, getViewModeConfig } from '@/config/challengesPageConfig';
import { logger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import { 
  Target, 
  Plus, 
  Eye,
  Heart,
  Share2
} from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

export default function Challenges() {
  const { t, isRTL } = useUnifiedTranslation();
  const { toast } = useToast();
  const { user, hasRole } = useAuth();
  const { ui } = useChallengeDefaults();
  const navigate = useNavigate();
  
  // Use enhanced challenges data hook
  const { challenges, loading, stats, refetch } = useChallengesData();
  
  // State management
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(challengesPageConfig.defaultViewMode as ViewMode);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [likedChallenges, setLikedChallenges] = useState<Set<string>>(new Set());
  
  // Dynamic max values state
  const [dynamicMaxBudget, setDynamicMaxBudget] = useState(10000000);
  const [dynamicMaxParticipants, setDynamicMaxParticipants] = useState(1000);

  // Advanced filters state
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...challengesPageConfig.defaultFilters,
    prizeRange: [0, dynamicMaxBudget] as [number, number],
    participantRange: [0, dynamicMaxParticipants] as [number, number]
  }));

  // Helper function to normalize values to nice round numbers
  const normalizeMaxValue = (value: number): number => {
    if (value <= 100) return Math.ceil(value / 10) * 10;
    if (value <= 1000) return Math.ceil(value / 100) * 100;
    if (value <= 10000) return Math.ceil(value / 1000) * 1000;
    if (value <= 100000) return Math.ceil(value / 10000) * 10000;
    if (value <= 1000000) return Math.ceil(value / 100000) * 100000;
    return Math.ceil(value / 1000000) * 1000000; // For millions
  };

  // Real-time updates
  const { isConnected } = useRealTimeChallenges({
    onChallengeUpdate: (update) => {
      logger.info('Challenge updated via real-time', { component: 'Challenges', action: 'onChallengeUpdate', data: update });
      refetch();
    },
    onParticipantUpdate: (challengeId, count) => {
      logger.info('Participant count updated', { component: 'Challenges', action: 'onParticipantUpdate', key: challengeId, data: { count } });
      refetch();
    }
  });

  // Calculate dynamic max values when challenges data changes
  useEffect(() => {
    if (challenges.length > 0) {
      const maxBudget = Math.max(...challenges.map(c => c.estimated_budget || 0));
      const maxParticipants = Math.max(...challenges.map(c => c.participants || 0));
      
      const normalizedMaxBudget = normalizeMaxValue(maxBudget);
      const normalizedMaxParticipants = normalizeMaxValue(maxParticipants);
      
      setDynamicMaxBudget(normalizedMaxBudget);
      setDynamicMaxParticipants(normalizedMaxParticipants);
      
      // Update filter ranges if they're at default values
      setFilters(prev => ({
        ...prev,
        prizeRange: [prev.prizeRange[0], normalizedMaxBudget],
        participantRange: [prev.participantRange[0], normalizedMaxParticipants]
      }));
    }
  }, [challenges]);

  // Advanced filtering logic with optimized performance
  const filteredChallenges = challenges.filter(challenge => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const title = (challenge.title_ar || '').toLowerCase();
      const description = (challenge.description_ar || '').toLowerCase();
      
      if (!title.includes(searchTerm) && !description.includes(searchTerm)) {
        return false;
      }
    }

    // Status filter
    if (filters.status !== 'all' && !challenge.status?.includes(filters.status) && challenge.status !== filters.status) {
      return false;
    }

    // Category filter
    if (filters.category !== 'all' && challenge.category !== filters.category) {
      return false;
    }

    // Difficulty filter
    if (filters.difficulty !== 'all' && challenge.difficulty !== filters.difficulty) {
      return false;
    }

    // Prize range filter
    const budget = challenge.estimated_budget || 0;
    if (budget < filters.prizeRange[0] || budget > filters.prizeRange[1]) {
      return false;
    }

    // Participant range filter
    const participants = challenge.participants || 0;
    if (participants < filters.participantRange[0] || participants > filters.participantRange[1]) {
      return false;
    }

    // Features filter
    if (filters.features.length > 0) {
      const hasFeature = filters.features.some(feature => {
        switch (feature) {
          case 'trending': return challenge.trending;
          case 'new': return new Date(challenge.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
          case 'ending_soon': return challenge.end_date && new Date(challenge.end_date).getTime() < Date.now() + 7 * 24 * 60 * 60 * 1000;
          case 'high_prize': return (challenge.estimated_budget || 0) > 100000;
          default: return false;
        }
      });
      if (!hasFeature) return false;
    }

    return true;
  });

  // Sorting logic
  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
    const order = filters.sortOrder === 'asc' ? 1 : -1;
    
    switch (filters.sortBy) {
      case 'title':
        return order * (a.title_ar || '').localeCompare(b.title_ar || '');
      case 'date':
        return order * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'participants':
        return order * ((a.participants || 0) - (b.participants || 0));
      case 'prize':
        return order * ((a.estimated_budget || 0) - (b.estimated_budget || 0));
      case 'deadline':
        const aDeadline = a.end_date ? new Date(a.end_date).getTime() : Infinity;
        const bDeadline = b.end_date ? new Date(b.end_date).getTime() : Infinity;
        return order * (aDeadline - bDeadline);
      default:
        return 0;
    }
  });

  // Event handlers
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      ...challengesPageConfig.defaultFilters,
      prizeRange: [0, dynamicMaxBudget] as [number, number],
      participantRange: [0, dynamicMaxParticipants] as [number, number]
    });
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'search') return value !== '';
      if (key === 'status' || key === 'category' || key === 'difficulty') return value !== 'all';
      if (key === 'features') return Array.isArray(value) && value.length > 0;
      if (key === 'prizeRange') return value[0] !== 0 || value[1] !== dynamicMaxBudget;
      if (key === 'participantRange') return value[0] !== 0 || value[1] !== dynamicMaxParticipants;
      return false;
    }).length;
  };

  const handleSort = (field: string) => {
    const newOrder = filters.sortBy === field && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    setFilters(prev => ({ ...prev, sortBy: field, sortOrder: newOrder }));
  };

  const handleViewDetails = (challenge: any) => {
    navigate(`/challenges/${challenge.id}`);
  };

  const handleParticipate = async (challenge: any) => {
    if (!user) {
      toast({
        title: t('auth_required', 'Authentication Required'),
        description: t('please_login_to_participate', 'Please log in to participate in challenges.'),
        variant: 'destructive',
      });
      return;
    }

    try {
      await supabase.from('challenge_participants').insert({
        challenge_id: challenge.id,
        user_id: user.id,
        participation_type: 'individual'
      });

      toast({
        title: t('participation_success', 'Successfully Registered'),
        description: t('challenge_participation_confirmed', 'You have been registered for this challenge.'),
      });

      refetch();
    } catch (error) {
      toast({
        title: t('participation_error', 'Registration Failed'),
        description: t('challenge_participation_failed', 'Failed to register for this challenge.'),
        variant: 'destructive',
      });
    }
  };

  const handleLike = async (challenge: any) => {
    if (!user) {
      toast({
        title: t('auth_required', 'Authentication Required'),
        description: t('please_login_to_like', 'Please log in to like challenges.'),
        variant: 'destructive',
      });
      return;
    }

    try {
      const isLiked = likedChallenges.has(challenge.id);
      
      if (isLiked) {
        await supabase.from('challenge_likes').delete().eq('challenge_id', challenge.id).eq('user_id', user.id);
        setLikedChallenges(prev => {
          const newSet = new Set(prev);
          newSet.delete(challenge.id);
          return newSet;
        });
      } else {
        await supabase.from('challenge_likes').insert({
          challenge_id: challenge.id,
          user_id: user.id
        });
        setLikedChallenges(prev => new Set([...prev, challenge.id]));
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleShare = async (challenge: any) => {
    const shareData = {
      title: challenge.title_ar,
      text: challenge.description_ar,
      url: `${window.location.origin}/challenges/${challenge.id}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(shareData.url);
      toast({
        title: t('link_copied', 'Link Copied'),
        description: t('challenge_link_copied', 'Challenge link copied to clipboard.'),
      });
    }
  };

  // Debug console logs
  console.log('🎯 Challenges Page Debug:', {
    challengesCount: challenges.length,
    filteredCount: sortedChallenges.length,
    loading,
    stats,
    user: user?.id
  });

  // Show auth prompt for unauthenticated users with no data
  if (!user && challenges.length === 0 && !loading) {
    return (
      <AppShell enableCollaboration={true}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Target className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">
              {isRTL ? 'مرحباً بك في منصة التحديات' : 'Welcome to Challenges Platform'}
            </h1>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {isRTL 
                ? 'يرجى تسجيل الدخول لعرض التحديات المتاحة والمشاركة فيها. ستتمكن من الوصول إلى تحديات مثيرة ومكافآت قيمة!'
                : 'Please sign in to view available challenges and participate. You\'ll gain access to exciting challenges and valuable rewards!'
              }
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate('/auth/login')} size="lg">
                {isRTL ? 'تسجيل الدخول' : 'Sign In'}
              </Button>
              <div className="text-sm text-muted-foreground">
                {isRTL ? 'أو' : 'or'}{' '}
                <Button variant="link" onClick={() => navigate('/auth/register')} className="p-0 h-auto">
                  {isRTL ? 'إنشاء حساب جديد' : 'create a new account'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell enableCollaboration={true}>
      {/* Enhanced Hero Section - Full Width */}
      <EnhancedChallengesHero 
        totalChallenges={stats.totalChallenges}
        activeChallenges={stats.activeChallenges}
        participantsCount={stats.totalParticipants}
        completedChallenges={challenges.filter(c => c.status === 'completed' || c.status?.includes('completed')).length}
        canCreateChallenge={hasRole('admin') || hasRole('evaluator')}
        onCreateChallenge={() => navigate('/admin/challenges/create')}
        featuredChallenge={challenges.find(c => c.trending) ? {
          id: challenges.find(c => c.trending)!.id,
          title_ar: challenges.find(c => c.trending)!.title_ar,
          participant_count: challenges.find(c => c.trending)!.participants,
          end_date: challenges.find(c => c.trending)!.end_date || ''
        } : undefined}
      />

      {/* Main Content - Full Width without extra containers */}
      <div className="w-full">
        <div className="container mx-auto px-4 py-8">
          {/* Enhanced Filters */}
          <ChallengeFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            activeFiltersCount={getActiveFiltersCount()}
            className="mb-6"
            dynamicMaxBudget={dynamicMaxBudget}
            dynamicMaxParticipants={dynamicMaxParticipants}
          />

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {t('challengesCount', isRTL 
                  ? `عُثر على ${sortedChallenges.length} تحدي من أصل ${challenges.length}`
                  : `Found ${sortedChallenges.length} of ${challenges.length} challenges`
                )}
              </span>
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {getActiveFiltersCount()} {isRTL ? 'مرشحات نشطة' : 'active filters'}
                </Badge>
              )}
              {isConnected && (
                <Badge variant="outline" className="text-xs">
                  {isRTL ? 'متصل مباشرة' : 'Live'}
                </Badge>
              )}
            </div>
            
            <LayoutSelector
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              supportedLayouts={['cards', 'grid', 'list', 'table', 'calendar']}
            />
          </div>

          {/* Challenge Views */}
          <div className="space-y-6">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted rounded w-1/2 mb-4" />
                      <div className="space-y-2">
                        <div className="h-2 bg-muted rounded" />
                        <div className="h-2 bg-muted rounded w-5/6" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {viewMode === 'cards' && (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedChallenges.map((challenge) => (
                      <EnhancedChallengeCard
                        key={challenge.id}
                        challenge={challenge as any}
                        onViewDetails={handleViewDetails}
                        onParticipate={handleParticipate}
                        onLike={handleLike}
                        onShare={handleShare}
                        isLiked={likedChallenges.has(challenge.id)}
                      />
                    ))}
                  </div>
                )}

                {viewMode === 'grid' && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {sortedChallenges.map((challenge) => (
                      <EnhancedChallengeCard
                        key={challenge.id}
                        challenge={challenge as any}
                        onViewDetails={handleViewDetails}
                        onParticipate={handleParticipate}
                        onLike={handleLike}
                        onShare={handleShare}
                        isLiked={likedChallenges.has(challenge.id)}
                        variant="compact"
                      />
                    ))}
                  </div>
                )}

                {viewMode === 'list' && (
                  <ChallengeListView
                    challenges={sortedChallenges as any[]}
                    onViewDetails={handleViewDetails}
                    onParticipate={handleParticipate}
                    sortBy={filters.sortBy}
                    sortOrder={filters.sortOrder}
                    onSort={handleSort}
                  />
                )}

                {viewMode === 'table' && (
                  <ChallengeTableView
                    challenges={sortedChallenges as any[]}
                    onViewDetails={handleViewDetails}
                    onParticipate={handleParticipate}
                    onLike={handleLike}
                    onShare={handleShare}
                    likedChallenges={likedChallenges}
                  />
                )}

                {viewMode === 'calendar' && (
                  <ChallengeCalendarView
                    challenges={sortedChallenges as any[]}
                    onViewDetails={handleViewDetails}
                    onParticipate={handleParticipate}
                    onLike={handleLike}
                    onShare={handleShare}
                    likedChallenges={likedChallenges}
                  />
                )}

                {sortedChallenges.length === 0 && !loading && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Target className="w-12 h-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        {t('noChallenges', isRTL ? 'لا توجد تحديات' : 'No Challenges Found')}
                      </h3>
                      <p className="text-muted-foreground text-center mb-4">
                        {t('noChallengesDescription', isRTL 
                          ? 'لم يتم العثور على تحديات تطابق المعايير المحددة. جرب تعديل المرشحات.' 
                          : 'No challenges match your current filters. Try adjusting your search criteria.'
                        )}
                      </p>
                      <Button onClick={handleClearFilters} variant="outline">
                        {t('clearFilters', isRTL ? 'مسح المرشحات' : 'Clear Filters')}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}