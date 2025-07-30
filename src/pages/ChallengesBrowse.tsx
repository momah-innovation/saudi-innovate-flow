import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Send, MessageSquare, Users, Eye, BookmarkIcon } from 'lucide-react';

const mockChallenges = [
  {
    id: 1,
    title: 'تطوير حلول ذكية للنقل المستدام',
    title_en: 'Smart Sustainable Transportation Solutions',
    description: 'ابتكار حلول تقنية لتحسين وسائل النقل العام وتقليل الانبعاثات',
    description_en: 'Innovate technical solutions to improve public transport and reduce emissions',
    status: 'active',
    deadline: '2024-12-31',
    participants: 245,
    submissions: 67,
    category: 'البيئة والاستدامة',
    category_en: 'Environment & Sustainability',
    prize: '50,000 ريال',
    difficulty: 'متوسط',
    trending: true,
    experts: [
      { name: 'د. أحمد محمد', avatar: '/placeholder.svg', role: 'خبير النقل المستدام' },
      { name: 'م. فاطمة علي', avatar: '/placeholder.svg', role: 'مهندسة بيئية' }
    ]
  },
  {
    id: 2,
    title: 'منصة رقمية لدعم المشاريع الصغيرة',
    title_en: 'Digital Platform for Small Business Support',
    description: 'تطوير منصة شاملة لدعم وتمويل المشاريع الصغيرة والمتوسطة',
    description_en: 'Develop a comprehensive platform to support and finance small and medium enterprises',
    status: 'active',
    deadline: '2024-11-15',
    participants: 189,
    submissions: 43,
    category: 'التكنولوجيا المالية',
    category_en: 'FinTech',
    prize: '75,000 ريال',
    difficulty: 'صعب',
    experts: [
      { name: 'د. سارة الأحمد', avatar: '/placeholder.svg', role: 'خبيرة التكنولوجيا المالية' }
    ]
  },
  {
    id: 3,
    title: 'نظام ذكي لإدارة الموارد المائية',
    title_en: 'Smart Water Resource Management System',
    description: 'تصميم نظام متطور لمراقبة وإدارة استخدام الموارد المائية',
    description_en: 'Design an advanced system for monitoring and managing water resource usage',
    status: 'upcoming',
    deadline: '2025-01-20',
    participants: 0,
    submissions: 0,
    category: 'البيئة والاستدامة',
    category_en: 'Environment & Sustainability',
    prize: '60,000 ريال',
    difficulty: 'متوسط',
    experts: [
      { name: 'د. خالد البتراوي', avatar: '/placeholder.svg', role: 'خبير الموارد المائية' },
      { name: 'م. نور الهدى', avatar: '/placeholder.svg', role: 'مهندسة مياه' },
      { name: 'د. عمر السعد', avatar: '/placeholder.svg', role: 'استشاري بيئي' }
    ]
  },
  {
    id: 4,
    title: 'تطبيق ذكي للصحة النفسية',
    title_en: 'Smart Mental Health Application',
    description: 'تطوير تطبيق يستخدم الذكاء الاصطناعي لدعم الصحة النفسية',
    description_en: 'Develop an AI-powered application to support mental health',
    status: 'active',
    deadline: '2024-10-30',
    participants: 156,
    submissions: 29,
    category: 'الصحة',
    category_en: 'Healthcare',
    prize: '40,000 ريال',
    difficulty: 'سهل',
    trending: true
  },
  {
    id: 5,
    title: 'منصة تعليمية تفاعلية للأطفال',
    title_en: 'Interactive Educational Platform for Children',
    description: 'إنشاء منصة تعليمية مبتكرة تجعل التعلم ممتعاً للأطفال',
    description_en: 'Create an innovative educational platform that makes learning fun for children',
    status: 'closed',
    deadline: '2024-08-15',
    participants: 312,
    submissions: 84,
    category: 'التعليم',
    category_en: 'Education',
    prize: '30,000 ريال',
    difficulty: 'متوسط'
  }
];

const ChallengesBrowse = () => {
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const { ui } = useChallengeDefaults();
  const { user } = useAuth();
  
  // State management
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      // Fallback to mock data if database fails
      setChallenges(mockChallenges);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const getFilteredChallenges = () => {
    let filtered = [...(challenges.length > 0 ? challenges : mockChallenges)];

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(challenge =>
        (isRTL ? challenge.title : challenge.title_en).toLowerCase().includes(filters.search.toLowerCase()) ||
        (isRTL ? challenge.description : challenge.description_en).toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(challenge => challenge.status === filters.status);
    }

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(challenge => {
        const categoryKey = isRTL ? challenge.category : challenge.category_en;
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

    // Apply participant range filter - use 0 as default since we don't have participants count yet
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
    try {
      // Register participation
      await supabase
        .from('challenge_participants')
        .insert({
          challenge_id: challenge.id,
          user_id: user?.id,
          participation_type: 'individual'
        });

      toast({
        title: isRTL ? 'تم التسجيل بنجاح' : 'Successfully Registered',
        description: isRTL ? 
          `تم تسجيلك في تحدي "${challenge.title_ar}"` : 
          `You have been registered for "${challenge.title_en}"`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في التسجيل",
        variant: "destructive",
      });
    }
  };

  const handleBookmark = async (challenge: any) => {
    toast({
      title: isRTL ? 'تم الحفظ' : 'Bookmarked',
      description: isRTL ? 
        `تم حفظ تحدي "${challenge.title_ar}" في قائمة المفضلة` : 
        `Challenge "${challenge.title_ar}" saved to bookmarks`,
    });
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

  // Calculate statistics for hero
  const totalChallenges = challenges.length;
  const activeChallenges = challenges.filter(c => c.status === 'active').length;
  const totalParticipants = challenges.reduce((sum, c) => sum + (c.participants || 0), 0);
  const totalPrizes = challenges.reduce((sum, c) => sum + (c.estimated_budget || 0), 0);

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
        totalChallenges={totalChallenges}
        activeChallenges={activeChallenges}
        totalParticipants={totalParticipants}
        totalPrizes={totalPrizes}
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
          onChallengeCreated={fetchChallenges}
        />
      </PageLayout>
    </AppShell>
  );
};

export default ChallengesBrowse;