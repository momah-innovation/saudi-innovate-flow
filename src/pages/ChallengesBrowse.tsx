import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LayoutSelector } from '@/components/ui/layout-selector';
import { ViewLayouts } from '@/components/ui/view-layouts';
import { useToast } from '@/hooks/use-toast';
import { useDirection } from '@/components/ui/direction-provider';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import { ChallengeDetailDialog } from '@/components/challenges/ChallengeDetailDialog';
import { ChallengeFilters, FilterState } from '@/components/challenges/ChallengeFilters';
import { ChallengeListView } from '@/components/challenges/ChallengeListView';
import { useChallengeDefaults } from '@/hooks/useChallengeDefaults';
import { Plus } from 'lucide-react';

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
  
  // State management
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
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
    let filtered = [...mockChallenges];

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
      const prizeValue = parseInt(challenge.prize.replace(/[^\d]/g, ''));
      return prizeValue >= filters.prizeRange[0] && prizeValue <= filters.prizeRange[1];
    });

    // Apply participant range filter
    filtered = filtered.filter(challenge => 
      challenge.participants >= filters.participantRange[0] && 
      challenge.participants <= filters.participantRange[1]
    );

    // Apply feature filters
    if (filters.features.includes('trending')) {
      filtered = filtered.filter(challenge => challenge.trending);
    }
    if (filters.features.includes('ending-soon')) {
      filtered = filtered.filter(challenge => {
        const deadline = new Date(challenge.deadline);
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
          aValue = a.participants;
          bValue = b.participants;
          break;
        case 'submissions':
          aValue = a.submissions;
          bValue = b.submissions;
          break;
        case 'prize':
          aValue = parseInt(a.prize.replace(/[^\d]/g, ''));
          bValue = parseInt(b.prize.replace(/[^\d]/g, ''));
          break;
        case 'deadline':
          aValue = new Date(a.deadline).getTime();
          bValue = new Date(b.deadline).getTime();
          break;
        default:
          aValue = isRTL ? a.title : a.title_en;
          bValue = isRTL ? b.title : b.title_en;
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
        return challenges.filter(c => c.status === 'upcoming');
      case 'trending':
        return challenges.filter(c => c.trending || c.participants > 200);
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

  const handleParticipate = (challenge: any) => {
    toast({
      title: isRTL ? 'تم التسجيل بنجاح' : 'Successfully Registered',
      description: isRTL ? 
        `تم تسجيلك في تحدي "${challenge.title}"` : 
        `You have been registered for "${challenge.title_en}"`,
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

  // Render challenge cards
  const renderChallengeCards = (challenges: any[]) => (
    <ViewLayouts viewMode={viewMode}>
      {challenges.map((challenge) => (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          onViewDetails={handleViewDetails}
          onParticipate={handleParticipate}
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
      <PageLayout
        title={isRTL ? 'استكشاف التحديات' : 'Browse Challenges'}
        description={isRTL ? 'اكتشف التحديات المثيرة وشارك في حلها' : 'Discover exciting challenges and participate in solving them'}
        itemCount={tabFilteredChallenges.length}
        primaryAction={
          <Button className="animate-pulse">
            <Plus className="w-4 h-4 mr-2" />
            {isRTL ? 'تحدي جديد' : 'New Challenge'}
          </Button>
        }
        headerContent={
          <LayoutSelector
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
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

        {/* Challenge Detail Dialog */}
        <ChallengeDetailDialog
          challenge={selectedChallenge}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          onParticipate={handleParticipate}
        />
      </PageLayout>
    </AppShell>
  );
};

export default ChallengesBrowse;