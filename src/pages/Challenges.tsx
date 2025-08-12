import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { GlobalBreadcrumb } from '@/components/layout/GlobalBreadcrumb';
import { EnhancedChallengeCard } from '@/components/challenges/EnhancedChallengeCard';
import { EnhancedChallengesHero } from '@/components/challenges/EnhancedChallengesHero';
import { ChallengeFilters, FilterState } from '@/components/challenges/ChallengeFilters';
import { ChallengeListView } from '@/components/challenges/ChallengeListView';
import { LayoutSelector, ViewMode } from '@/components/ui/layout-selector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [activeTab, setActiveTab] = useState(challengesPageConfig.defaultTab);
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

  // Filter and search logic
  const getFilteredChallenges = () => {
    logger.debug('Starting challenge filtering', { 
      component: 'Challenges', 
      action: 'getFilteredChallenges',
      data: { 
        totalChallenges: challenges.length,
        filters: {
          search: filters.search,
          status: filters.status,
          category: filters.category,
          difficulty: filters.difficulty,
          prizeRange: filters.prizeRange,
          participantRange: filters.participantRange,
          features: filters.features
        }
      }
    });
    
    let filtered = [...challenges];

    // Apply search filter
    if (filters.search) {
      const beforeSearch = filtered.length;
      filtered = filtered.filter(challenge =>
        (isRTL ? challenge.title_ar : challenge.title_ar).toLowerCase().includes(filters.search.toLowerCase()) ||
        (isRTL ? challenge.description_ar : challenge.description_ar).toLowerCase().includes(filters.search.toLowerCase())
      );
      logger.debug('Applied search filter', { 
        component: 'Challenges',
        action: 'searchFilter',
        data: { searchTerm: filters.search, beforeCount: beforeSearch, afterCount: filtered.length }
      });
    }

    // Apply status filter
    if (filters.status !== 'all') {
      const beforeStatus = filtered.length;
      filtered = filtered.filter(challenge => challenge.status === filters.status);
      logger.debug('Applied status filter', { 
        component: 'Challenges',
        action: 'statusFilter',
        data: { status: filters.status, beforeCount: beforeStatus, afterCount: filtered.length, availableStatuses: [...new Set(challenges.map(c => c.status))] }
      });
    }

    // Apply category filter
    if (filters.category !== 'all') {
      const beforeCategory = filtered.length;
      filtered = filtered.filter(challenge => {
        const categoryKey = isRTL ? challenge.category : challenge.category || challenge.category;
        return categoryKey && categoryKey.toLowerCase().includes(filters.category.toLowerCase());
      });
      logger.debug('Applied category filter', { 
        component: 'Challenges',
        action: 'categoryFilter',
        data: { category: filters.category, beforeCount: beforeCategory, afterCount: filtered.length, availableCategories: [...new Set(challenges.map(c => c.category))] }
      });
    }

    // Apply difficulty filter
    if (filters.difficulty !== 'all') {
      const beforeDifficulty = filtered.length;
      filtered = filtered.filter(challenge => challenge.difficulty && challenge.difficulty.toLowerCase() === filters.difficulty.toLowerCase());
      logger.debug('Applied difficulty filter', { 
        component: 'Challenges',
        action: 'difficultyFilter',
        data: { 
          difficulty: filters.difficulty, 
          beforeCount: beforeDifficulty, 
          afterCount: filtered.length, 
          availableDifficulties: [...new Set(challenges.map(c => c.difficulty).filter(Boolean))]
        }
      });
    }

    // Apply prize range filter
    const beforePrize = filtered.length;
    filtered = filtered.filter(challenge => {
      const budgetValue = challenge.estimated_budget || 0;
      return budgetValue >= filters.prizeRange[0] && budgetValue <= filters.prizeRange[1];
    });
    logger.debug('Applied prize range filter', { 
      component: 'Challenges',
      action: 'prizeRangeFilter',
      data: { 
        prizeRange: filters.prizeRange, 
        beforeCount: beforePrize, 
        afterCount: filtered.length
      }
    });

    // Apply participant range filter
    const beforeParticipants = filtered.length;
    filtered = filtered.filter(challenge => {
      const participantCount = challenge.participants || 0;
      return participantCount >= filters.participantRange[0] && participantCount <= filters.participantRange[1];
    });
    logger.debug('Applied participant range filter', { 
      component: 'Challenges',
      action: 'participantRangeFilter',
      data: { 
        participantRange: filters.participantRange, 
        beforeCount: beforeParticipants, 
        afterCount: filtered.length
      }
    });

    // Apply feature filters
    if (filters.features.includes('trending')) {
      const beforeTrending = filtered.length;
      filtered = filtered.filter(challenge => challenge.trending || challenge.priority_level === 'عالي');
      logger.debug('Applied trending filter', { 
        component: 'Challenges',
        action: 'trendingFilter',
        data: { beforeCount: beforeTrending, afterCount: filtered.length }
      });
    }
    if (filters.features.includes('ending-soon')) {
      const beforeEndingSoon = filtered.length;
      filtered = filtered.filter(challenge => {
        if (!challenge.end_date) return false;
        const deadline = new Date(challenge.end_date);
        const now = new Date();
        const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysLeft <= 7 && daysLeft > 0;
      });
      logger.debug('Applied ending-soon filter', { 
        component: 'Challenges',
        action: 'endingSoonFilter',
        data: { beforeCount: beforeEndingSoon, afterCount: filtered.length }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case 'participants':
          aValue = a.participants || 0;
          bValue = b.participants || 0;
          break;
        case 'submissions':
          aValue = a.submissions || 0;
          bValue = b.submissions || 0;
          break;
        case 'prize':
          aValue = a.estimated_budget || 0;
          bValue = b.estimated_budget || 0;
          break;
        case 'deadline':
          aValue = a.end_date ? new Date(a.end_date).getTime() : 0;
          bValue = b.end_date ? new Date(b.end_date).getTime() : 0;
          break;
        default:
          aValue = a.title_ar || '';
          bValue = b.title_ar || '';
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    logger.info('Challenge filtering completed', { 
      component: 'Challenges',
      action: 'getFilteredChallenges',
      data: { finalCount: filtered.length, originalCount: challenges.length }
    });
    return filtered;
  };

  const getTabFilteredChallenges = (challenges: any[]) => {
    logger.debug('Starting tab filtering', { 
      component: 'Challenges',
      action: 'getTabFilteredChallenges',
      data: { inputCount: challenges.length, activeTab }
    });
    
    let tabFiltered;
    switch (activeTab) {
      case 'active':
        tabFiltered = challenges.filter(c => c.status === 'active');
        break;
      case 'upcoming':
        tabFiltered = challenges.filter(c => c.status === 'planning' || c.status === 'upcoming');
        break;
      case 'trending':
        tabFiltered = challenges.filter(c => c.priority_level === 'عالي' || (c.participants || 0) > 50);
        break;
      default:
        tabFiltered = challenges;
        break;
    }
    
    logger.debug('Tab filtering completed', { 
      component: 'Challenges',
      action: 'getTabFilteredChallenges',
      data: { afterTabFilter: tabFiltered.length, activeTab }
    });
    
    return tabFiltered;
  };

  const filteredChallenges = getFilteredChallenges();
  const tabFilteredChallenges = getTabFilteredChallenges(filteredChallenges);
  
  logger.info('Challenge data processing completed', { 
    component: 'Challenges',
    action: 'finalCounts',
    data: { filteredCount: filteredChallenges.length, tabFilteredCount: tabFilteredChallenges.length }
  });

  // Event handlers
  const handleViewDetails = (challenge: any) => {
    navigate(`/challenges/${challenge.id}`);
  };

  const handleParticipate = async (challenge: any) => {
    if (!user) {
      toast({
        title: t('pleaseSignIn', isRTL ? 'يرجى تسجيل الدخول' : 'Please sign in'),
        description: t('signInToParticipate', isRTL ? 'يجب تسجيل الدخول للمشاركة في التحديات' : 'You need to sign in to participate in challenges'),
        variant: "destructive",
      });
      return;
    }

    try {
      // Register participation
      const { error } = await supabase
        .from('challenge_participants')
        .insert({
          challenge_id: challenge.id,
          user_id: user.id,
          participation_type: 'individual'
        });

      if (error) throw error;

      toast({
        title: t('successfullyRegistered', isRTL ? 'تم التسجيل بنجاح' : 'Successfully Registered'),
        description: t('challengeRegistrationSuccess', isRTL ? 
          `تم تسجيلك في تحدي "${challenge.title_ar}"` : 
          `You have been registered for "${challenge.title_ar}"`),
      });
      
      // Refresh challenges to update participant count
      refetch();
    } catch (error) {
      logger.error('Challenge participation failed', { component: 'Challenges', action: 'handleParticipate', key: challenge.id }, error as Error);
      toast({
        title: t('error', isRTL ? 'خطأ' : 'Error'),
        description: t('registrationFailed', isRTL ? 'فشل في التسجيل' : 'Failed to register'),
        variant: "destructive",
      });
    }
  };

  const handleLike = async (challenge: any) => {
    if (!user) {
      toast({
        title: t('pleaseSignIn', isRTL ? 'يرجى تسجيل الدخول' : 'Please sign in'),
        description: t('signInToBookmark', isRTL ? 'يجب تسجيل الدخول لحفظ التحديات' : 'You need to sign in to bookmark challenges'),
        variant: "destructive",
      });
      return;
    }

    try {
      const isLiked = likedChallenges.has(challenge.id);
      
      if (isLiked) {
        // Remove like
        await supabase
          .from('challenge_bookmarks')
          .delete()
          .eq('challenge_id', challenge.id)
          .eq('user_id', user.id);
        
        setLikedChallenges(prev => {
          const newSet = new Set(prev);
          newSet.delete(challenge.id);
          return newSet;
        });
      } else {
        // Add like
        await supabase
          .from('challenge_bookmarks')
          .insert({
            challenge_id: challenge.id,
            user_id: user.id
          });
        
        setLikedChallenges(prev => new Set([...prev, challenge.id]));
      }

      toast({
        title: isLiked ? 'تم إلغاء الإعجاب' : 'تم الإعجاب',
        description: isLiked ? 'تم إلغاء إعجابك بالتحدي' : 'تم إضافة إعجابك للتحدي',
      });
      
    } catch (error) {
      logger.error('Failed to toggle like', { component: 'Challenges', action: 'like', challengeId: challenge.id }, error as Error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحديث الإعجاب',
        variant: 'destructive',
      });
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
        toast({
          title: 'تم المشاركة بنجاح',
          description: 'تم مشاركة التحدي بنجاح',
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: 'تم نسخ الرابط',
          description: 'تم نسخ رابط التحدي إلى الحافظة',
        });
      } catch (error) {
        toast({
          title: 'خطأ',
          description: 'فشل في نسخ الرابط',
          variant: 'destructive',
        });
      }
    }
  };

  // Filter management
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

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'search') return value !== '';
    if (key === 'status' || key === 'category' || key === 'difficulty') return value !== 'all';
    if (key === 'features') return Array.isArray(value) && value.length > 0;
    if (key === 'prizeRange') return value[0] !== 0 || value[1] !== dynamicMaxBudget;
    if (key === 'participantRange') return value[0] !== 0 || value[1] !== dynamicMaxParticipants;
    return false;
  }).length;

  // Render content based on view mode
  const renderChallenges = () => {
    const currentViewModeConfig = getViewModeConfig(viewMode);
    
    if (viewMode === 'list') {
      return (
        <ChallengeListView
          challenges={tabFilteredChallenges}
          onViewDetails={handleViewDetails}
          onParticipate={handleParticipate}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSort={(field) => setFilters(prev => ({ ...prev, sortBy: field }))}
        />
      );
    }

    const gridClasses = `grid ${currentViewModeConfig.gridConfig.gap} ` +
      `grid-cols-${currentViewModeConfig.gridConfig.cols.mobile} ` +
      `md:grid-cols-${currentViewModeConfig.gridConfig.cols.tablet} ` +
      `lg:grid-cols-${currentViewModeConfig.gridConfig.cols.desktop}` +
      (currentViewModeConfig.gridConfig.cols.xl ? ` xl:grid-cols-${currentViewModeConfig.gridConfig.cols.xl}` : '');

    return (
      <div className={gridClasses}>
        {tabFilteredChallenges.map((challenge) => (
          <EnhancedChallengeCard
            key={challenge.id}
            challenge={challenge}
            onViewDetails={() => handleViewDetails(challenge)}
            onParticipate={() => handleParticipate(challenge)}
            onLike={() => handleLike(challenge)}
            onShare={() => handleShare(challenge)}
            isLiked={likedChallenges.has(challenge.id)}
            variant={currentViewModeConfig.variant as any}
            showActions={true}
            showStats={true}
            showOwner={true}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <AppShell enableCollaboration={true}>
        <div className="container mx-auto px-4 py-8">
          <GlobalBreadcrumb />
          <div className="mb-8">
            <h1 className={cn("text-3xl font-bold mb-2", isRTL && "text-right")}>التحديات الابتكارية</h1>
            <p className={cn("text-muted-foreground", isRTL && "text-right")}>استكشف التحديات المتاحة وشارك في الابتكار</p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell enableCollaboration={true}>
      <div className="space-y-6">
        {/* Hero Section */}
        <EnhancedChallengesHero
          totalChallenges={stats.totalChallenges}
          activeChallenges={stats.activeChallenges}
          participantsCount={stats.totalParticipants}
          completedChallenges={challenges.filter(c => c.status === 'completed').length}
          canCreateChallenge={hasRole('admin')}
          featuredChallenge={challenges.find(c => c.status === 'active') ? {
            id: challenges.find(c => c.status === 'active')!.id,
            title_ar: challenges.find(c => c.status === 'active')!.title_ar,
            participant_count: challenges.find(c => c.status === 'active')!.participants || 0,
            end_date: challenges.find(c => c.status === 'active')!.end_date || ''
          } : undefined}
        />
        
        <div className="container mx-auto px-4 py-8">
          <GlobalBreadcrumb />
          
          <div className="space-y-6">
            {/* Enhanced Filters */}
            <ChallengeFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              activeFiltersCount={activeFiltersCount}
              dynamicMaxBudget={dynamicMaxBudget}
              dynamicMaxParticipants={dynamicMaxParticipants}
            />

            {/* View Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <LayoutSelector
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
                
                {hasRole('admin') && (
                  <Button className={cn("gap-2", isRTL && "flex-row-reverse")}>
                    <Plus className="w-4 h-4" />
                    إضافة تحدي جديد
                  </Button>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground">
                {tabFilteredChallenges.length} من {stats.totalChallenges} تحدي
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">جميع التحديات ({filteredChallenges.length})</TabsTrigger>
                <TabsTrigger value="active">النشطة ({filteredChallenges.filter(c => c.status === 'active').length})</TabsTrigger>
                <TabsTrigger value="upcoming">القادمة ({filteredChallenges.filter(c => c.status === 'planning').length})</TabsTrigger>
                <TabsTrigger value="trending">الرائجة ({filteredChallenges.filter(c => c.trending).length})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {tabFilteredChallenges.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <Target className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">لا توجد تحديات</h3>
                      <p className="text-muted-foreground text-center">
                        لا توجد تحديات متاحة حاليًا وفقًا للمعايير المحددة
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  renderChallenges()
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Collaboration Integration */}
          <WorkspaceCollaboration
            workspaceType="user"
            entityId="challenges"
            showWidget={false}
            showPresence={true}
            showActivity={false}
          />
        </div>
      </div>
    </AppShell>
  );
}