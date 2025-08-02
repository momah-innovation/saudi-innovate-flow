import { useState, useEffect } from 'react';
import { StandardBrowseLayout } from '@/components/layout/StandardBrowseLayout';
import { PageLayout } from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutSelector } from '@/components/ui/layout-selector';
import { ViewLayouts } from '@/components/ui/view-layouts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useDirection } from '@/components/ui/direction-provider';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import { EnhancedChallengeCard } from '@/components/challenges/EnhancedChallengeCard';
import { SuperChallengeCard } from '@/components/challenges/SuperChallengeCard';
import { TrendingChallengesWidget } from '@/components/challenges/TrendingChallengesWidget';
import { ChallengesHero } from '@/components/challenges/ChallengesHero';
import { EnhancedChallengesHero } from '@/components/challenges/EnhancedChallengesHero';
import { ChallengeRecommendations } from '@/components/challenges/ChallengeRecommendations';
import { ChallengeDetailDialog } from '@/components/challenges/ChallengeDetailDialog';
import { EnhancedChallengeDetailDialog } from '@/components/challenges/EnhancedChallengeDetailDialog';
import { ChallengeFilters, FilterState } from '@/components/challenges/ChallengeFilters';
import { EnhancedChallengeFilters } from '@/components/challenges/EnhancedChallengeFilters';
import { ChallengeSkeleton, ChallengeLoadingState, ChallengeEmptyState } from '@/components/challenges/ChallengeSkeletons';
import { EnhancedSubmissionDialog } from '@/components/challenges/EnhancedSubmissionDialog';
import { ChallengeNotificationCenter } from '@/components/challenges/ChallengeNotificationCenter';
import { ChallengeTemplatesDialog } from '@/components/challenges/ChallengeTemplatesDialog';
import { ChallengeAnalyticsDashboard } from '@/components/challenges/ChallengeAnalyticsDashboard';
import { ChallengeCollaborationHub } from '@/components/challenges/ChallengeCollaborationHub';
import { ChallengeListView } from '@/components/challenges/ChallengeListView';
import { ExpertAssignmentWizard } from '@/components/challenges/ExpertAssignmentWizard';
import { ChallengeSubmissionDialog } from '@/components/challenges/ChallengeSubmissionDialog';
import { ChallengeCommentsDialog } from '@/components/challenges/ChallengeCommentsDialog';
import { ChallengeSubmissionsDialog } from '@/components/challenges/ChallengeSubmissionsDialog';
import { CreateChallengeDialog } from '@/components/challenges/CreateChallengeDialog';
import { useChallengeDefaults } from '@/hooks/useChallengeDefaults';
import { useChallengesData } from '@/hooks/useChallengesData';
import { useRealTimeChallenges } from '@/hooks/useRealTimeChallenges';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Send, MessageSquare, Users, Eye, BookmarkIcon, TrendingUp, Clock, Calendar, Target, FileText, BarChart3 } from 'lucide-react';


const ChallengesBrowse = () => {
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const { ui } = useChallengeDefaults();
  const { user, hasRole } = useAuth();
  
  // Use enhanced challenges data hook
  const { challenges, loading, stats, refetch } = useChallengesData();
  
  // State management
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [commentsDialogOpen, setCommentsDialogOpen] = useState(false);
  const [submissionsDialogOpen, setSubmissionsDialogOpen] = useState(false);
  const [createChallengeOpen, setCreateChallengeOpen] = useState(false);
  const [templatesDialogOpen, setTemplatesDialogOpen] = useState(false);
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>(ui.defaultViewMode as any || 'cards');
  const [activeTab, setActiveTab] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Real-time updates
  const { isConnected } = useRealTimeChallenges({
    onChallengeUpdate: (update) => {
      console.log('Challenge update:', update);
      refetch();
    },
    onParticipantUpdate: (challengeId, count) => {
      console.log('Participant update:', challengeId, count);
      refetch();
    }
  });

  // Enhanced dialog states
  const [expertAssignmentOpen, setExpertAssignmentOpen] = useState(false);
  
  // Basic search - events style
  const [searchQuery, setSearchQuery] = useState('');
  
  // Advanced filters state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    category: 'all',
    difficulty: 'all',
    prizeRange: [0, 100000],
    participantRange: [0, 1000],
    deadline: 'all',
    features: [],
    sortBy: 'deadline',
    sortOrder: 'desc'
  });

  // Filter and search logic
  const getFilteredChallenges = () => {
    let filtered = [...challenges];

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(challenge =>
        (isRTL ? challenge.title_ar : challenge.title_en || challenge.title_ar).toLowerCase().includes(filters.search.toLowerCase()) ||
        (isRTL ? challenge.description_ar : challenge.description_en || challenge.description_ar).toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(challenge => challenge.status === filters.status);
    }

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(challenge => {
        const categoryKey = isRTL ? challenge.category : challenge.category_en || challenge.category;
        return categoryKey.toLowerCase().includes(filters.category.toLowerCase());
      });
    }

    // Apply difficulty filter
    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(challenge => challenge.difficulty.toLowerCase() === filters.difficulty.toLowerCase());
    }

    // Apply prize range filter
    filtered = filtered.filter(challenge => {
      const budgetValue = challenge.estimated_budget || 0;
      return budgetValue >= filters.prizeRange[0] && budgetValue <= filters.prizeRange[1];
    });

    // Apply participant range filter
    filtered = filtered.filter(challenge => {
      const participantCount = challenge.participants || 0;
      return participantCount >= filters.participantRange[0] && participantCount <= filters.participantRange[1];
    });

    // Apply feature filters
    if (filters.features.includes('trending')) {
      filtered = filtered.filter(challenge => challenge.trending || challenge.priority_level === 'عالي');
    }
    if (filters.features.includes('ending-soon')) {
      filtered = filtered.filter(challenge => {
        if (!challenge.end_date) return false;
        const deadline = new Date(challenge.end_date);
        const now = new Date();
        const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysLeft <= 7 && daysLeft > 0;
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

    return filtered;
  };

  const getTabFilteredChallenges = (challenges: any[]) => {
    switch (activeTab) {
      case 'active':
        return challenges.filter(c => c.status === 'active');
      case 'upcoming':
        return challenges.filter(c => c.status === 'planning');
      case 'trending':
        return challenges.filter(c => c.priority_level === 'عالي' || (c.participants || 0) > 50);
      default:
        return challenges;
    }
  };

  const filteredChallenges = getFilteredChallenges();
  const tabFilteredChallenges = getTabFilteredChallenges(filteredChallenges);

  // Event handlers
  const handleViewDetails = (challenge: any) => {
    setSelectedChallenge(challenge);
    setDetailDialogOpen(true);
  };

  const handleSubmitToChallenge = (challenge: any) => {
    setSelectedChallenge(challenge);
    setSubmissionDialogOpen(true);
  };

  const handleViewComments = (challenge: any) => {
    setSelectedChallenge(challenge);
    setCommentsDialogOpen(true);
  };

  const handleViewSubmissions = (challenge: any) => {
    setSelectedChallenge(challenge);
    setSubmissionsDialogOpen(true);
  };

  const handleParticipate = async (challenge: any) => {
    if (!user) {
      toast({
        title: isRTL ? 'يرجى تسجيل الدخول' : 'Please sign in',
        description: isRTL ? 'يجب تسجيل الدخول للمشاركة في التحديات' : 'You need to sign in to participate in challenges',
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
        title: isRTL ? 'تم التسجيل بنجاح' : 'Successfully Registered',
        description: isRTL ? 
          `تم تسجيلك في تحدي "${challenge.title_ar}"` : 
          `You have been registered for "${challenge.title_ar}"`,
      });
      
      // Refresh challenges to update participant count
      refetch();
    } catch (error) {
      console.error('Participation error:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في التسجيل' : 'Failed to register',
        variant: "destructive",
      });
    }
  };

  const handleBookmark = async (challenge: any) => {
    if (!user) {
      toast({
        title: isRTL ? 'يرجى تسجيل الدخول' : 'Please sign in',
        description: isRTL ? 'يجب تسجيل الدخول لحفظ التحديات' : 'You need to sign in to bookmark challenges',
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
          title: isRTL ? 'تم إلغاء الحفظ' : 'Bookmark Removed',
          description: isRTL ? 
            `تم إلغاء حفظ تحدي "${challenge.title_ar}"` : 
            `Removed "${challenge.title_ar}" from bookmarks`,
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
          title: isRTL ? 'تم الحفظ' : 'Bookmarked',
          description: isRTL ? 
            `تم حفظ تحدي "${challenge.title_ar}" في قائمة المفضلة` : 
            `Challenge "${challenge.title_ar}" saved to bookmarks`,
        });
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في حفظ التحدي' : 'Failed to bookmark challenge',
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
    setFilters({
      search: '',
      status: 'all',
      category: 'all',
      difficulty: 'all',
      prizeRange: [0, 100000],
      participantRange: [0, 1000],
      deadline: 'all',
      features: [],
      sortBy: 'deadline',
      sortOrder: 'desc'
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'all') count++;
    if (filters.category !== 'all') count++;
    if (filters.difficulty !== 'all') count++;
    if (filters.deadline !== 'all') count++;
    if (filters.features.length > 0) count += filters.features.length;
    if (filters.prizeRange[0] > 0 || filters.prizeRange[1] < 100000) count++;
    if (filters.participantRange[0] > 0 || filters.participantRange[1] < 1000) count++;
    return count;
  };

  // Render enhanced challenge cards
  const renderChallengeCards = (challenges: any[]) => (
    <ViewLayouts viewMode={viewMode}>
      {challenges.map((challenge) => (
        <SuperChallengeCard
          key={challenge.id}
          challenge={challenge}
          onViewDetails={handleViewDetails}
          onParticipate={handleParticipate}
          onBookmark={handleBookmark}
          viewMode={viewMode}
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
        <EnhancedChallengesHero 
          totalChallenges={stats.totalChallenges}
          activeChallenges={stats.activeChallenges}
          totalParticipants={stats.totalParticipants}
          totalPrizes={stats.totalPrizes}
          onCreateChallenge={() => setCreateChallengeOpen(true)}
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
          title={isRTL ? 'التحديات المتاحة' : 'Available Challenges'}
          description={isRTL ? 'تصفح واختر التحديات التي تناسب مهاراتك واهتماماتك' : 'Browse and select challenges that match your skills and interests'}
          itemCount={tabFilteredChallenges.length}
          primaryAction={user && (hasRole('admin') || hasRole('super_admin')) ? {
            label: isRTL ? 'تحدي جديد' : 'New Challenge',
            onClick: () => setCreateChallengeOpen(true),
            icon: <Plus className="w-4 h-4" />
          } : undefined}
          secondaryActions={
            <div className="flex gap-2">
              <ChallengeNotificationCenter />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTemplatesDialogOpen(true)}
              >
                <FileText className="w-4 h-4 mr-2" />
                {isRTL ? 'القوالب' : 'Templates'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAnalyticsDialogOpen(true)}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {isRTL ? 'الإحصائيات' : 'Analytics'}
              </Button>
              <LayoutSelector
                viewMode={viewMode}
                onViewModeChange={(mode) => mode !== 'calendar' && setViewMode(mode)}
              />
            </div>
          }
        >
          <div className="space-y-6">
            {/* Enhanced Filters */}
            <EnhancedChallengeFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
              activeFiltersCount={getActiveFiltersCount()}
              className="animate-fade-in"
            />

            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all" className="animate-fade-in">
                  {isRTL ? 'جميع التحديات' : 'All Challenges'}
                  {activeTab === 'all' && (
                    <span className="ml-2 bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs">
                      {filteredChallenges.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="active" className="animate-fade-in">
                  {isRTL ? 'النشطة' : 'Active'}
                  {activeTab === 'active' && (
                    <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                      {filteredChallenges.filter(c => c.status === 'active').length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="animate-fade-in">
                  {isRTL ? 'القادمة' : 'Upcoming'}
                  {activeTab === 'upcoming' && (
                    <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                      {filteredChallenges.filter(c => c.status === 'upcoming').length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="trending" className="animate-fade-in">
                  {isRTL ? 'الأكثر شعبية' : 'Trending'}
                  {activeTab === 'trending' && (
                    <span className="ml-2 bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs">
                      {filteredChallenges.filter(c => c.trending || c.participants > 200).length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {loading ? (
                  <ChallengeSkeleton viewMode={viewMode} count={6} className="animate-fade-in" />
                ) : tabFilteredChallenges.length === 0 ? (
                  <ChallengeEmptyState
                    title={isRTL ? 'لا توجد تحديات' : 'No challenges found'}
                    description={isRTL ? 'جرب تعديل الفلاتر أو البحث' : 'Try adjusting your filters or search terms'}
                    icon={Target}
                    actionLabel={isRTL ? 'مسح الفلاتر' : 'Clear Filters'}
                    onAction={handleClearFilters}
                    className="animate-fade-in"
                  />
                ) : (
                  <div className="animate-fade-in">
                    {viewMode === 'list' ? renderChallengeList(filteredChallenges) : renderChallengeCards(filteredChallenges)}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="active" className="space-y-4">
                {loading ? (
                  <ChallengeSkeleton viewMode={viewMode} count={4} />
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
                  <ChallengeSkeleton viewMode={viewMode} count={4} />
                ) : (
                  <div className="animate-fade-in">
                    {viewMode === 'list' ? 
                      renderChallengeList(filteredChallenges.filter(c => c.status === 'upcoming')) : 
                      renderChallengeCards(filteredChallenges.filter(c => c.status === 'upcoming'))
                    }
                  </div>
                )}
              </TabsContent>

              <TabsContent value="trending" className="space-y-4">
                {loading ? (
                  <ChallengeSkeleton viewMode={viewMode} count={4} />
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
          <TrendingChallengesWidget
            onChallengeClick={handleViewDetails}
            onChallengeSelect={(challengeId) => {
              const challenge = challenges.find(c => c.id === challengeId);
              if (challenge) handleViewDetails(challenge);
            }}
            className="sticky top-4"
          />
          <ChallengeRecommendations
            onChallengeSelect={handleViewDetails}
            className="sticky top-4"
          />
        </div>
      }
      dialogs={
        <>
          {/* Enhanced Challenge Detail Dialog */}
          <EnhancedChallengeDetailDialog
            challenge={selectedChallenge}
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
            onParticipate={handleParticipate}
            onSubmit={handleSubmitToChallenge}
            onBookmark={handleBookmark}
          />

          {/* Expert Assignment Wizard */}
          <ExpertAssignmentWizard
            challenge={selectedChallenge}
            open={expertAssignmentOpen}
            onOpenChange={setExpertAssignmentOpen}
            onAssignmentComplete={() => {
              refetch();
              toast({
                title: isRTL ? 'تم التعيين بنجاح' : 'Assignment Successful',
                description: isRTL ? 'تم تعيين الخبراء للتحدي بنجاح' : 'Experts have been successfully assigned to the challenge',
              });
            }}
          />

          {/* Enhanced Submission Dialog */}
          <EnhancedSubmissionDialog
            challenge={selectedChallenge}
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
          <ChallengeSubmissionsDialog
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
                  {isRTL ? 'لوحة إحصائيات التحديات' : 'Challenge Analytics Dashboard'}
                </DialogTitle>
              </DialogHeader>
              <ChallengeAnalyticsDashboard />
            </DialogContent>
          </Dialog>

          {/* Create Challenge Dialog - Only for Admins */}
          {user && (hasRole('admin') || hasRole('super_admin')) && (
            <CreateChallengeDialog
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