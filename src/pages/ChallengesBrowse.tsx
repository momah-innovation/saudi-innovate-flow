import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutSelector } from '@/components/ui/layout-selector';
import { ViewLayouts } from '@/components/ui/view-layouts';
import { useToast } from '@/hooks/use-toast';
import { useDirection } from '@/components/ui/direction-provider';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import { EnhancedChallengeCard } from '@/components/challenges/EnhancedChallengeCard';
import { ChallengesHero } from '@/components/challenges/ChallengesHero';
import { ChallengeDetailDialog } from '@/components/challenges/ChallengeDetailDialog';
import { EnhancedChallengeDetailDialog } from '@/components/challenges/EnhancedChallengeDetailDialog';
import { ChallengeFilters, FilterState } from '@/components/challenges/ChallengeFilters';
import { ChallengeListView } from '@/components/challenges/ChallengeListView';
import { ChallengeSubmissionDialog } from '@/components/challenges/ChallengeSubmissionDialog';
import { ChallengeCommentsDialog } from '@/components/challenges/ChallengeCommentsDialog';
import { ChallengeSubmissionsDialog } from '@/components/challenges/ChallengeSubmissionsDialog';
import { CreateChallengeDialog } from '@/components/challenges/CreateChallengeDialog';
import { useChallengeDefaults } from '@/hooks/useChallengeDefaults';
import { useChallengesData } from '@/hooks/useChallengesData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Send, MessageSquare, Users, Eye, BookmarkIcon, TrendingUp, Clock, Calendar } from 'lucide-react';


const ChallengesBrowse = () => {
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const { ui } = useChallengeDefaults();
  const { user } = useAuth();
  
  // Use enhanced challenges data hook
  const { challenges, loading, stats, refetch } = useChallengesData();
  
  // State management
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [commentsDialogOpen, setCommentsDialogOpen] = useState(false);
  const [submissionsDialogOpen, setSubmissionsDialogOpen] = useState(false);
  const [createChallengeOpen, setCreateChallengeOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>(ui.defaultViewMode as any || 'cards');
  const [activeTab, setActiveTab] = useState('all');
  
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

  // Use stats from the hook

  // Render enhanced challenge cards
  const renderChallengeCards = (challenges: any[]) => (
    <ViewLayouts viewMode={viewMode}>
      {challenges.map((challenge) => (
        <EnhancedChallengeCard
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
    <AppShell>
      {/* Enhanced Hero Section */}
      <ChallengesHero 
        totalChallenges={stats.totalChallenges}
        activeChallenges={stats.activeChallenges}
        totalParticipants={stats.totalParticipants}
        totalPrizes={stats.totalPrizes}
      />
      
      <PageLayout
        title={isRTL ? 'التحديات المتاحة' : 'Available Challenges'}
        description={isRTL ? 'تصفح واختر التحديات التي تناسب مهاراتك واهتماماتك' : 'Browse and select challenges that match your skills and interests'}
        itemCount={tabFilteredChallenges.length}
        primaryAction={{
          label: isRTL ? 'تحدي جديد' : 'New Challenge',
          onClick: () => setCreateChallengeOpen(true),
          icon: <Plus className="w-4 h-4" />
        }}
        secondaryActions={
          <div className="flex gap-2">
            <LayoutSelector
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
            <Button size="sm" variant="outline" onClick={() => handleSubmitToChallenge(selectedChallenge)}>
              <Send className="w-4 h-4 mr-2" />
              {isRTL ? 'مشاركة' : 'Submit'}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Advanced Filters */}
          <ChallengeFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={handleClearFilters}
            activeFiltersCount={getActiveFiltersCount()}
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
              {viewMode === 'list' ? renderChallengeList(filteredChallenges) : renderChallengeCards(filteredChallenges)}
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              {viewMode === 'list' ? 
                renderChallengeList(filteredChallenges.filter(c => c.status === 'active')) : 
                renderChallengeCards(filteredChallenges.filter(c => c.status === 'active'))
              }
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              {viewMode === 'list' ? 
                renderChallengeList(filteredChallenges.filter(c => c.status === 'upcoming')) : 
                renderChallengeCards(filteredChallenges.filter(c => c.status === 'upcoming'))
              }
            </TabsContent>

            <TabsContent value="trending" className="space-y-4">
              {viewMode === 'list' ? 
                renderChallengeList(filteredChallenges.filter(c => c.trending || c.participants > 200)) : 
                renderChallengeCards(filteredChallenges.filter(c => c.trending || c.participants > 200))
              }
            </TabsContent>
          </Tabs>
        </div>

        {/* Enhanced Challenge Detail Dialog */}
        <EnhancedChallengeDetailDialog
          challenge={selectedChallenge}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          onParticipate={handleParticipate}
          onSubmit={handleSubmitToChallenge}
          onViewComments={handleViewComments}
        />

        {/* Challenge Submission Dialog */}
        <ChallengeSubmissionDialog
          challenge={selectedChallenge}
          open={submissionDialogOpen}
          onOpenChange={setSubmissionDialogOpen}
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

        {/* Create Challenge Dialog */}
        <CreateChallengeDialog
          open={createChallengeOpen}
          onOpenChange={setCreateChallengeOpen}
          onChallengeCreated={refetch}
        />
      </PageLayout>
    </AppShell>
  );
};

export default ChallengesBrowse;