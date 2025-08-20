import { useState, useEffect } from 'react';
import { StandardBrowseLayout } from '@/components/layout/StandardBrowseLayout';
import { PageLayout } from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutSelector, ViewMode } from '@/components/ui/layout-selector';
import { ViewLayouts } from '@/components/ui/view-layouts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useDirection } from '@/components/ui/direction-provider';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import { ChallengeTrendingWidget } from '@/components/challenges/ChallengeTrendingWidget';
import { ChallengesHero } from '@/components/challenges/ChallengesHero';
import { ChallengeRecommendations } from '@/components/challenges/ChallengeRecommendations';

import { ChallengeFilters, FilterState } from '@/components/challenges/ChallengeFilters';
import { challengesPageConfig, getViewModeConfig } from '@/config/challengesPageConfig';
import { ChallengeSkeleton, ChallengeLoadingState, ChallengeEmptyState } from '@/components/challenges/ChallengeSkeletons';
import { ChallengeSubmitDialog } from '@/components/challenges/ChallengeSubmitDialog';
import { ChallengeNotificationCenter } from '@/components/challenges/ChallengeNotificationCenter';
import { ChallengeTemplatesDialog } from '@/components/challenges/ChallengeTemplatesDialog';
import { ChallengeAnalyticsDashboard } from '@/components/challenges/ChallengeAnalyticsDashboard';

import { ChallengeListView } from '@/components/challenges/ChallengeListView';
import { ChallengeExpertAssignmentWizard } from '@/components/challenges/ChallengeExpertAssignmentWizard';
import { ChallengeCommentsDialog } from '@/components/challenges/ChallengeCommentsDialog';
import { ChallengeViewDialog } from '@/components/challenges/ChallengeViewDialog';
import { ChallengeCreateDialog } from '@/components/challenges/ChallengeCreateDialog';
import { useChallengeDefaults } from '@/hooks/useChallengeDefaults';
import { useChallengesData } from '@/hooks/useChallengesData';
import { useRealTimeChallenges } from '@/hooks/useRealTimeChallenges';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';
import { Plus, Send, MessageSquare, Users, Eye, BookmarkIcon, TrendingUp, Clock, Calendar, Target, FileText, BarChart3 } from 'lucide-react';


const ChallengesBrowse = () => {
  const { t, isRTL } = useUnifiedTranslation();
  const { toast } = useToast();
  const { ui } = useChallengeDefaults();
  const { user, hasRole } = useAuth();
  
  // Use enhanced challenges data hook
  const { challenges, loading, stats, refetch } = useChallengesData();
  
  // State management
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeData | null>(null);

interface ChallengeData {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  status: string;
  category?: string;
  category_en?: string;
  difficulty?: string;
  estimated_budget?: number;
  participants?: number;
  submissions?: number;
  trending?: boolean;
  priority_level?: string;
  start_date?: string;
  end_date?: string;
  challenge_type?: string; // Made optional to match actual data
  image_url?: string;
}
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [commentsDialogOpen, setCommentsDialogOpen] = useState(false);
  const [submissionsDialogOpen, setSubmissionsDialogOpen] = useState(false);
  const [createChallengeOpen, setCreateChallengeOpen] = useState(false);
  const [templatesDialogOpen, setTemplatesDialogOpen] = useState(false);
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(challengesPageConfig.defaultViewMode as ViewMode);
  const [activeTab, setActiveTab] = useState(challengesPageConfig.defaultTab);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
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
      logger.info('Challenge updated via real-time', { component: 'ChallengesBrowse', action: 'onChallengeUpdate', data: update });
      refetch();
    },
    onParticipantUpdate: (challengeId, count) => {
      logger.info('Participant count updated', { component: 'ChallengesBrowse', action: 'onParticipantUpdate', key: challengeId, data: { count } });
      refetch();
    }
  });

  // Enhanced dialog states
  const [expertAssignmentOpen, setExpertAssignmentOpen] = useState(false);
  
  // Basic search - events style
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic max values state
  const [dynamicMaxBudget, setDynamicMaxBudget] = useState(10000000);
  const [dynamicMaxParticipants, setDynamicMaxParticipants] = useState(1000);

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

  // Advanced filters state
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...challengesPageConfig.defaultFilters,
    prizeRange: [0, dynamicMaxBudget] as [number, number],
    participantRange: [0, dynamicMaxParticipants] as [number, number]
  }));

  // Filter and search logic
  const getFilteredChallenges = () => {
    logger.debug('Starting challenge filtering', { 
      component: 'ChallengesBrowse', 
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
        (isRTL ? challenge.title_ar : challenge.title_en || challenge.title_ar).toLowerCase().includes(filters.search.toLowerCase()) ||
        (isRTL ? challenge.description_ar : challenge.description_en || challenge.description_ar).toLowerCase().includes(filters.search.toLowerCase())
      );
      logger.debug('Applied search filter', { 
        component: 'ChallengesBrowse',
        action: 'searchFilter',
        data: { searchTerm: filters.search, beforeCount: beforeSearch, afterCount: filtered.length }
      });
    }

    // Apply status filter
    if (filters.status !== 'all') {
      const beforeStatus = filtered.length;
      filtered = filtered.filter(challenge => challenge.status === filters.status);
      logger.debug('Applied status filter', { 
        component: 'ChallengesBrowse',
        action: 'statusFilter',
        data: { status: filters.status, beforeCount: beforeStatus, afterCount: filtered.length, availableStatuses: [...new Set(challenges.map(c => c.status))] }
      });
    }

    // Apply category filter
    if (filters.category !== 'all') {
      const beforeCategory = filtered.length;
      filtered = filtered.filter(challenge => {
        const categoryKey = isRTL ? challenge.category : challenge.category_en || challenge.category;
        return categoryKey.toLowerCase().includes(filters.category.toLowerCase());
      });
      logger.debug('Applied category filter', { 
        component: 'ChallengesBrowse',
        action: 'categoryFilter',
        data: { category: filters.category, beforeCount: beforeCategory, afterCount: filtered.length, availableCategories: [...new Set(challenges.map(c => c.category))] }
      });
    }

    // Apply difficulty filter
    if (filters.difficulty !== 'all') {
      const beforeDifficulty = filtered.length;
      filtered = filtered.filter(challenge => challenge.difficulty && challenge.difficulty.toLowerCase() === filters.difficulty.toLowerCase());
      logger.debug('Applied difficulty filter', { 
        component: 'ChallengesBrowse',
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
      component: 'ChallengesBrowse',
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
      component: 'ChallengesBrowse',
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
        component: 'ChallengesBrowse',
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
        component: 'ChallengesBrowse',
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
      component: 'ChallengesBrowse',
      action: 'getFilteredChallenges',
      data: { finalCount: filtered.length, originalCount: challenges.length }
    });
    return filtered;
  };

  const getTabFilteredChallenges = (challenges: ChallengeData[]) => {
    logger.debug('Starting tab filtering', { 
      component: 'ChallengesBrowse',
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
      component: 'ChallengesBrowse',
      action: 'getTabFilteredChallenges',
      data: { afterTabFilter: tabFiltered.length, activeTab }
    });
    
    return tabFiltered;
  };

  const filteredChallenges = getFilteredChallenges();
  const tabFilteredChallenges = getTabFilteredChallenges(filteredChallenges as any);
  
  logger.info('Challenge data processing completed', { 
    component: 'ChallengesBrowse',
    action: 'finalCounts',
    data: { filteredCount: filteredChallenges.length, tabFilteredCount: tabFilteredChallenges.length }
  });

  // Event handlers
  const handleViewDetails = (challenge: ChallengeData) => {
    setSelectedChallenge(challenge);
    setDetailDialogOpen(true);
  };

  const handleSubmitToChallenge = (challenge: ChallengeData) => {
    setSelectedChallenge(challenge);
    setSubmissionDialogOpen(true);
  };

  const handleViewComments = (challenge: ChallengeData) => {
    setSelectedChallenge(challenge);
    setCommentsDialogOpen(true);
  };

  const handleViewSubmissions = (challenge: ChallengeData) => {
    setSelectedChallenge(challenge);
    setSubmissionsDialogOpen(true);
  };

  const handleParticipate = async (challenge: ChallengeData) => {
    if (!user) {
      toast({
        title: t('challenges:messages.please_sign_in'),
        description: t('challenges:messages.sign_in_to_participate'),
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
        title: t('challenges:messages.successfully_registered'),
        description: isRTL ? 
          `تم تسجيلك في تحدي "${challenge.title_ar}"` : 
          `You have been registered for "${challenge.title_en || challenge.title_ar}"`,
      });
      
      // Refresh challenges to update participant count
      refetch();
    } catch (error) {
      logger.error('Challenge participation failed', { component: 'ChallengesBrowse', action: 'handleParticipate', key: challenge.id }, error as Error);
      toast({
        title: t('common:status.error'),
        description: t('challenges:messages.registration_failed'),
        variant: "destructive",
      });
    }
  };

  const handleBookmark = async (challenge: ChallengeData) => {
    if (!user) {
      toast({
        title: t('challenges:messages.please_sign_in'),
        description: t('challenges:messages.sign_in_to_bookmark'),
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if already bookmarked
      const { data: existingBookmark } = await supabase
        .from('challenge_bookmarks')
        .select('id')
        .eq('challenge_id', challenge.id)
        .eq('user_id', user.id)
        .single();

      if (existingBookmark) {
        // Remove bookmark
        const { error } = await supabase
          .from('challenge_bookmarks')
          .delete()
          .eq('challenge_id', challenge.id)
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: t('challenges:messages.bookmark_removed'),
          description: isRTL ? 
            `تم إلغاء حفظ تحدي "${challenge.title_ar}"` : 
            `Removed "${challenge.title_en || challenge.title_ar}" from bookmarks`,
        });
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('challenge_bookmarks')
          .insert({
            challenge_id: challenge.id,
            user_id: user.id,
          });

        if (error) throw error;

        toast({
          title: t('challenges:messages.bookmarked'),
          description: isRTL ? 
            `تم حفظ تحدي "${challenge.title_ar}" في قائمة المفضلة` : 
            `Challenge "${challenge.title_en || challenge.title_ar}" saved to bookmarks`,
        });
      }
    } catch (error) {
      logger.error('Challenge bookmark failed', { component: 'ChallengesBrowse', action: 'handleBookmark', key: challenge.id }, error as Error);
      toast({
        title: t('common:status.error'),
        description: t('challenges:messages.bookmark_failed'),
        variant: "destructive",
      });
    }
  };

  const handleSort = (field: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleClearFilters = () => {
    const defaultFilters = { 
      ...challengesPageConfig.defaultFilters,
      prizeRange: [0, dynamicMaxBudget] as [number, number],
      participantRange: [0, dynamicMaxParticipants] as [number, number]
    };
    setFilters(defaultFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'all') count++;
    if (filters.category !== 'all') count++;
    if (filters.difficulty !== 'all') count++;
    if (filters.deadline !== 'all') count++;
    if (filters.features.length > 0) count += filters.features.length;
    if (filters.prizeRange[0] > 0 || filters.prizeRange[1] < dynamicMaxBudget) count++;
    if (filters.participantRange[0] > 0 || filters.participantRange[1] < dynamicMaxParticipants) count++;
    return count;
  };

  // Render challenge cards
  const renderChallengeCards = (challenges: any[]) => (
    <ViewLayouts viewMode={viewMode}>
      {challenges.map((challenge) => (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          onViewDetails={handleViewDetails}
          onParticipate={handleParticipate}
          onBookmark={handleBookmark}
          viewMode={viewMode as 'cards' | 'list' | 'grid'}
          variant={getViewModeConfig(viewMode).variant}
        />
      ))}
    </ViewLayouts>
  );

  // Render challenge list
  const renderChallengeList = (challenges: any[]) => (
    <ChallengeListView
      challenges={challenges}
      onViewDetails={handleViewDetails}
      onParticipate={handleParticipate}
      sortBy={filters.sortBy}
      sortOrder={filters.sortOrder}
      onSort={handleSort}
    />
  );

  return (
    <StandardBrowseLayout
      hero={
        <ChallengesHero 
          totalChallenges={stats.totalChallenges}
          activeChallenges={stats.activeChallenges}
          totalParticipants={stats.totalParticipants}
          totalPrizes={stats.totalPrizes}
          onCreateChallenge={user && (hasRole('admin') || hasRole('super_admin') || hasRole('sector_lead') || hasRole('challenge_manager')) ? () => setCreateChallengeOpen(true) : undefined}
          onShowFilters={() => setShowAdvancedFilters(true)}
          featuredChallenge={challenges.length > 0 ? {
            id: challenges[0].id,
            title_ar: challenges[0].title_ar,
            participants: challenges[0].participants || 0,
            prize: challenges[0].estimated_budget || 0,
            daysLeft: challenges[0].end_date ? Math.ceil((new Date(challenges[0].end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0,
            image: challenges[0].image_url
          } : undefined}
        />
      }
      mainContent={
        <PageLayout
          title={t('challenges:browse.available_challenges')}
          description={t('challenges:browse.description')}
          itemCount={tabFilteredChallenges.length}
          primaryAction={user && (hasRole('admin') || hasRole('super_admin') || hasRole('sector_lead') || hasRole('challenge_manager') || hasRole('moderator')) ? {
            label: t('challenges:actions.new_challenge'),
            onClick: () => setCreateChallengeOpen(true),
            icon: <Plus className="w-4 h-4" />
          } : undefined}
          secondaryActions={
            <div className="flex items-center gap-4">
              {/* Management Actions - Admin/Sector Lead/Challenge Manager Only */}
              {user && (hasRole('admin') || hasRole('super_admin') || hasRole('sector_lead') || hasRole('challenge_manager') || hasRole('moderator')) && (
                <>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setTemplatesDialogOpen(true)}
                      className={`h-8 ${challengesPageConfig.ui.gradients.button} ${challengesPageConfig.ui.gradients.buttonHover} ${challengesPageConfig.ui.colors.text.accent} border-0 shadow-md`}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      {t('challenges:templates.title')}
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setAnalyticsDialogOpen(true)}
                      className={`h-8 ${challengesPageConfig.ui.gradients.info} ${challengesPageConfig.ui.colors.text.accent} border-0 shadow-md hover:scale-105 transition-transform`}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      {t('challenges:admin.analytics')}
                    </Button>
                  </div>
                  
                  {/* Separator */}
                  <div className={`h-6 w-px ${challengesPageConfig.ui.gradients.featured}`}></div>
                </>
              )}
              
              {/* User Actions - Available to All */}
              <div className="flex items-center gap-2">
                <ChallengeNotificationCenter />
                <LayoutSelector
                  viewMode={viewMode}
                  onViewModeChange={(mode) => ['cards', 'list', 'grid'].includes(mode) && setViewMode(mode)}
                />
              </div>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Enhanced Filters */}
            <ChallengeFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
              activeFiltersCount={getActiveFiltersCount()}
              dynamicMaxBudget={dynamicMaxBudget}
              dynamicMaxParticipants={dynamicMaxParticipants}
              className="animate-fade-in"
            />

            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all" className="animate-fade-in">
                  {t('challenges:filters.all')}
                  {activeTab === 'all' && (
                    <span className={`ml-2 ${challengesPageConfig.ui.glassMorphism.badge} px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm`}>
                      {filteredChallenges.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="active" className="animate-fade-in">
                  {t('challenges:status.active')}
                  {activeTab === 'active' && (
                    <span className={`ml-2 ${challengesPageConfig.ui.gradients.success} px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm`}>
                      {filteredChallenges.filter(c => c.status === 'active').length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="animate-fade-in">
                  {t('challenges:status.upcoming')}
                  {activeTab === 'upcoming' && (
                    <span className={`ml-2 ${challengesPageConfig.ui.gradients.info} px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm`}>
                      {filteredChallenges.filter(c => c.status === 'planning' || c.status === 'upcoming').length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="trending" className="animate-fade-in">
                  {t('challenges:filters.trending')}
                  {activeTab === 'trending' && (
                    <span className={`ml-2 ${challengesPageConfig.ui.gradients.warning} px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm`}>
                      {filteredChallenges.filter(c => c.trending || c.participants > 200).length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {loading ? (
                  <ChallengeSkeleton viewMode={viewMode as 'cards' | 'list' | 'grid'} count={6} className="animate-fade-in" />
                ) : tabFilteredChallenges.length === 0 ? (
                  <ChallengeEmptyState
                    title={t('challenges:messages.no_challenges_found')}
                    description={t('challenges:messages.try_adjusting_filters')}
                    icon={Target}
                    actionLabel={t('challenges:actions.clear_filters')}
                    onAction={handleClearFilters}
                    className="animate-fade-in"
                  />
                ) : (
                  <div className="animate-fade-in">
                    {viewMode === 'list' ? renderChallengeList(tabFilteredChallenges) : renderChallengeCards(tabFilteredChallenges)}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="active" className="space-y-4">
                {loading ? (
                  <ChallengeSkeleton viewMode={viewMode as 'cards' | 'list' | 'grid'} count={4} />
                ) : (
                  <div className="animate-fade-in">
                    {viewMode === 'list' ? 
                      renderChallengeList(filteredChallenges.filter(c => c.status === 'active')) : 
                      renderChallengeCards(filteredChallenges.filter(c => c.status === 'active'))
                    }
                  </div>
                )}
              </TabsContent>

              <TabsContent value="upcoming" className="space-y-4">
                {loading ? (
                  <ChallengeSkeleton viewMode={viewMode as 'cards' | 'list' | 'grid'} count={4} />
                ) : (
                  <div className="animate-fade-in">
                    {viewMode === 'list' ? 
                      renderChallengeList(filteredChallenges.filter(c => c.status === 'planning' || c.status === 'upcoming')) : 
                      renderChallengeCards(filteredChallenges.filter(c => c.status === 'planning' || c.status === 'upcoming'))
                    }
                  </div>
                )}
              </TabsContent>

              <TabsContent value="trending" className="space-y-4">
                {loading ? (
                  <ChallengeSkeleton viewMode={viewMode as 'cards' | 'list' | 'grid'} count={4} />
                ) : (
                  <div className="animate-fade-in">
                    {viewMode === 'list' ? 
                      renderChallengeList(filteredChallenges.filter(c => c.trending || c.participants > 200)) : 
                      renderChallengeCards(filteredChallenges.filter(c => c.trending || c.participants > 200))
                    }
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </PageLayout>
      }
      sidebar={
        <div className="space-y-6">
          <ChallengeTrendingWidget
            onChallengeClick={handleViewDetails}
            onChallengeSelect={(challengeId) => {
              const challenge = challenges.find(c => c.id === challengeId);
              if (challenge) handleViewDetails(challenge as any);
            }}
            className="sticky top-4"
          />
          <ChallengeRecommendations
            onChallengeSelect={(challenge: any) => handleViewDetails(challenge)}
            className="sticky top-4"
          />
        </div>
      }
      dialogs={
        <>
          {/* Enhanced Challenge View Dialog */}
          <ChallengeViewDialog
            challenge={selectedChallenge as any}
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
            onParticipate={handleParticipate}
            onSubmit={handleSubmitToChallenge}
            onBookmark={handleBookmark}
          />

          {/* Expert Assignment Wizard */}
          <ChallengeExpertAssignmentWizard
            challenge={selectedChallenge}
            open={expertAssignmentOpen}
            onOpenChange={setExpertAssignmentOpen}
            onAssignmentComplete={() => {
              refetch();
              toast({
                title: t('challenges:messages.assignment_successful'),
                description: t('challenges:messages.experts_assigned_successfully'),
              });
            }}
          />

          {/* Enhanced Submission Dialog */}
          <ChallengeSubmitDialog
            challenge={selectedChallenge as any}
            open={submissionDialogOpen}
            onOpenChange={setSubmissionDialogOpen}
            onSubmissionComplete={refetch}
          />

          {/* Challenge Comments Dialog */}
          <ChallengeCommentsDialog
            challenge={selectedChallenge}
            open={commentsDialogOpen}
            onOpenChange={setCommentsDialogOpen}
          />

          {/* Challenge Submissions Dialog */}
          <ChallengeViewDialog
            challenge={selectedChallenge}
            open={submissionsDialogOpen}
            onOpenChange={setSubmissionsDialogOpen}
          />

          {/* Templates Dialog */}
          <ChallengeTemplatesDialog
            open={templatesDialogOpen}
            onOpenChange={setTemplatesDialogOpen}
            onTemplateSelect={(template) => {
              setCreateChallengeOpen(true);
            }}
          />

          {/* Analytics Dashboard Dialog */}
          <Dialog open={analyticsDialogOpen} onOpenChange={setAnalyticsDialogOpen}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {t('challenges:analytics.dashboard_title')}
                </DialogTitle>
              </DialogHeader>
              <ChallengeAnalyticsDashboard />
            </DialogContent>
          </Dialog>

          {/* Create Challenge Dialog - Only for Admins/Managers */}
          {user && (hasRole('admin') || hasRole('super_admin') || hasRole('sector_lead') || hasRole('challenge_manager') || hasRole('moderator')) && (
            <ChallengeCreateDialog
              open={createChallengeOpen}
              onOpenChange={setCreateChallengeOpen}
              onChallengeCreated={refetch}
            />
          )}
        </>
      }
    />
  );
};

export default ChallengesBrowse;
