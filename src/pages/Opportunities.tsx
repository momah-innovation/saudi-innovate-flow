import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutSelector } from '@/components/ui/layout-selector';
import { ViewLayouts } from '@/components/ui/view-layouts';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useDirection } from '@/components/ui/direction-provider';
import { EnhancedOpportunitiesHero } from '@/components/opportunities/EnhancedOpportunitiesHero';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OpportunityDetailsDialog } from '@/components/opportunities/OpportunityDetailsDialog';
import { OpportunityApplicationDialog } from '@/components/opportunities/OpportunityApplicationDialog';
import { EnhancedOpportunityFilters, OpportunityFilterState } from '@/components/opportunities/EnhancedOpportunityFilters';
import { TrendingOpportunitiesWidget } from '@/components/opportunities/TrendingOpportunitiesWidget';
import { OpportunityRecommendations } from '@/components/opportunities/OpportunityRecommendations';
import { OpportunityNotificationCenter } from '@/components/opportunities/OpportunityNotificationCenter';
import { OpportunityTemplatesDialog } from '@/components/opportunities/OpportunityTemplatesDialog';
import { OpportunityAnalyticsDashboard } from '@/components/opportunities/OpportunityAnalyticsDashboard';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { useAuth } from '@/contexts/AuthContext';
import { useBookmarks } from '@/hooks/useBookmarks';
import { downloadOpportunityImages } from '@/utils/downloadOpportunityImages';
import { 
  Plus, 
  Send, 
  MessageSquare, 
  Users, 
  Eye, 
  BookmarkIcon, 
  TrendingUp, 
  Clock, 
  Calendar, 
  Target, 
  FileText, 
  BarChart3,
  Filter,
  Briefcase
} from 'lucide-react';
import { Opportunity } from '@/types/opportunities';

interface OpportunityItem extends Opportunity {
  applications_count?: number;
  views_count?: number;
  likes_count?: number;
  sector?: { name_ar?: string; name?: string };
  department?: { name_ar?: string; name?: string };
  category?: { name_ar?: string; name?: string; name_en?: string; color?: string };
  requirements?: string | null;
  benefits?: string | null;
}

export default function Opportunities() {
  const { t, isRTL, getDynamicText } = useUnifiedTranslation();
  const { user, hasRole } = useAuth();
  const { isRTL: direction } = useDirection();
  const { toast } = useToast();
  const { addBookmark, removeBookmark, isBookmarked, getBookmarkId } = useBookmarks();
  
  // State management
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingImages, setDownloadingImages] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityItem | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  const [templatesDialogOpen, setTemplatesDialogOpen] = useState(false);
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [activeTab, setActiveTab] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Enhanced filters state - following challenges pattern
  const [filters, setFilters] = useState<OpportunityFilterState>({
    search: '',
    status: 'all',
    type: 'all',
    priority: 'all',
    category: 'all',
    sector: 'all',
    department: 'all',
    budgetRange: [0, 10000000],
    location: '',
    deadline: 'all',
    features: [],
    sortBy: 'deadline',
    sortOrder: 'asc'
  });

  // Stats for hero
  const [stats, setStats] = useState({
    totalOpportunities: 0,
    activeOpportunities: 0,
    totalApplications: 0,
    totalBudget: 0
  });

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      
      const { useOpportunityData } = await import('@/hooks/useOpportunityData');
      const { loadMetadataForOpportunities } = useOpportunityData();
      
      // Get the opportunities from the main table
      const { data: opportunitiesData, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('deadline', { ascending: true });

      if (error) throw error;

      // Load metadata using the hook
      const { sectors, departments } = await loadMetadataForOpportunities(opportunitiesData || []);

      const opportunitiesWithCounts = await Promise.all(
        (opportunitiesData || []).map(async (opp) => {
          // Get application count
          const { count: applicationsCount } = await supabase
            .from('opportunity_applications')
            .select('*', { count: 'exact', head: true })
            .eq('opportunity_id', opp.id);

          // Get likes count
          const { count: likesCount } = await supabase
            .from('opportunity_likes')
            .select('*', { count: 'exact', head: true })
            .eq('opportunity_id', opp.id);

          // Get analytics data
          const { data: analyticsData } = await supabase
            .from('opportunity_analytics')
            .select('view_count')
            .eq('opportunity_id', opp.id)
            .single();

          // Manually attach sector and department data
          const sector = sectors.find(s => s.id === opp.sector_id) || null;
          const department = departments.find(d => d.id === opp.department_id) || null;

          return {
            ...opp,
            sector,
            department,
            applications_count: applicationsCount || 0,
            likes_count: likesCount || 0,
            views_count: analyticsData?.view_count || 0,
            requirements: opp.requirements as string || null,
            benefits: opp.benefits as string || null,
            category: { name_ar: opp.opportunity_type, name: opp.opportunity_type, name_en: opp.opportunity_type, color: '#3B82F6' }
          };
        })
      );

      setOpportunities(opportunitiesWithCounts);

      // Calculate stats
      const totalOpps = opportunitiesWithCounts.length;
      const activeOpps = opportunitiesWithCounts.filter(o => o.status === 'open').length;
      const totalApps = opportunitiesWithCounts.reduce((sum, o) => sum + (o.applications_count || 0), 0);
      const totalBudget = opportunitiesWithCounts.reduce((sum, o) => sum + (o.budget_max || o.budget_min || 0), 0);

      setStats({
        totalOpportunities: totalOpps,
        activeOpportunities: activeOpps,
        totalApplications: totalApps,
        totalBudget: totalBudget
      });

    } catch (error) {
      logger.error('Error loading opportunities', { type: activeTab }, error as Error);
      toast({
        title: t('error'),
        description: t('errorLoadingData'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic - following challenges pattern
  const getFilteredOpportunities = () => {
    let filtered = [...opportunities];

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(opp =>
        (isRTL ? opp.title_ar : (opp.title_en as string) || opp.title_ar).toLowerCase().includes(filters.search.toLowerCase()) ||
        (isRTL ? (opp.description_ar as string) : (opp.description_en as string) || (opp.description_ar as string)).toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(opp => opp.status === filters.status);
    }

    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(opp => opp.opportunity_type === filters.type);
    }

    // Apply priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(opp => opp.priority_level === filters.priority);
    }

    // Apply budget range filter
    filtered = filtered.filter(opp => {
      const maxBudget = opp.budget_max || opp.budget_min || 0;
      return maxBudget >= filters.budgetRange[0] && maxBudget <= filters.budgetRange[1];
    });

    // Apply feature filters
    if (filters.features.includes('trending')) {
      filtered = filtered.filter(opp => opp.priority_level === 'high' || (opp.applications_count || 0) > 10);
    }
    if (filters.features.includes('ending-soon')) {
      filtered = filtered.filter(opp => {
        const deadline = new Date(opp.deadline);
        const now = new Date();
        const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysLeft <= 7 && daysLeft > 0;
      });
    }
    if (filters.features.includes('high-budget')) {
      filtered = filtered.filter(opp => (opp.budget_max || opp.budget_min || 0) > 1000000);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case 'applications':
          aValue = a.applications_count || 0;
          bValue = b.applications_count || 0;
          break;
        case 'likes':
          aValue = a.likes_count || 0;
          bValue = b.likes_count || 0;
          break;
        case 'budget':
          aValue = a.budget_max || a.budget_min || 0;
          bValue = b.budget_max || b.budget_min || 0;
          break;
        case 'deadline':
          aValue = new Date(a.deadline).getTime();
          bValue = new Date(b.deadline).getTime();
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

  const getTabFilteredOpportunities = (opportunities: OpportunityItem[]) => {
    switch (activeTab) {
      case 'active':
        return opportunities.filter(o => o.status === 'open');
      case 'upcoming':
        return opportunities.filter(o => new Date(o.deadline) > new Date());
      case 'trending':
        return opportunities.filter(o => o.priority_level === 'high' || (o.applications_count || 0) > 10);
      default:
        return opportunities;
    }
  };

  const filteredOpportunities = getFilteredOpportunities();
  const tabFilteredOpportunities = getTabFilteredOpportunities(filteredOpportunities);

  // Event handlers
  const handleViewDetails = (opportunity: OpportunityItem) => {
    setSelectedOpportunity(opportunity);
    setDetailDialogOpen(true);
  };

  const handleApply = (opportunity: OpportunityItem) => {
    setSelectedOpportunity(opportunity);
    setApplicationDialogOpen(true);
  };

  const handleBookmark = async (opportunity: OpportunityItem) => {
    if (!user) {
      toast({
        title: isRTL ? 'يرجى تسجيل الدخول' : 'Please sign in',
        description: isRTL ? 'يجب تسجيل الدخول لحفظ الفرص' : 'You need to sign in to bookmark opportunities',
        variant: "destructive",
      });
      return;
    }

    try {
      const bookmarked = isBookmarked('opportunity', opportunity.id);
      
      if (bookmarked) {
        const bookmarkId = getBookmarkId('opportunity', opportunity.id);
        if (bookmarkId) {
          await removeBookmark(bookmarkId, 'opportunity');
          toast({
            title: isRTL ? 'تم إلغاء الحفظ' : 'Bookmark Removed',
            description: isRTL ? 'تم إلغاء حفظ الفرصة' : 'Opportunity removed from bookmarks',
          });
        }
      } else {
        await addBookmark('opportunity', opportunity.id);
        toast({
          title: isRTL ? 'تم الحفظ' : 'Bookmarked',
          description: isRTL ? 'تم حفظ الفرصة في المفضلة' : 'Opportunity saved to bookmarks',
        });
      }
    } catch (error) {
      logger.error('Bookmark error', { opportunityId: opportunity.id }, error as Error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في حفظ الفرصة' : 'Failed to bookmark opportunity',
        variant: "destructive",
      });
    }
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      type: 'all',
      priority: 'all',
      category: 'all',
      sector: 'all',
      department: 'all',
      budgetRange: [0, 10000000],
      location: '',
      deadline: 'all',
      features: [],
      sortBy: 'deadline',
      sortOrder: 'asc'
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'all') count++;
    if (filters.type !== 'all') count++;
    if (filters.priority !== 'all') count++;
    if (filters.category !== 'all') count++;
    if (filters.sector !== 'all') count++;
    if (filters.department !== 'all') count++;
    if (filters.location) count++;
    if (filters.deadline !== 'all') count++;
    if (filters.features.length > 0) count += filters.features.length;
    if (filters.budgetRange[0] > 0 || filters.budgetRange[1] < 10000000) count++;
    return count;
  };

  const handleDownloadImages = async () => {
    setDownloadingImages(true);
    try {
      const result = await downloadOpportunityImages();
      
      if (result.success) {
        toast({
          title: isRTL ? 'تم تحميل الصور بنجاح' : 'Images downloaded successfully',
          description: isRTL ? `تم معالجة ${result.results?.length || 0} فرصة` : `Processed ${result.results?.length || 0} opportunities`,
        });
        // Reload opportunities to show the new images
        await loadOpportunities();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      logger.error('Error downloading images', {}, error as Error);
      toast({
        title: isRTL ? 'خطأ في تحميل الصور' : 'Error downloading images',
        description: isRTL ? 'فشل في تحميل الصور' : 'Failed to download images',
        variant: "destructive",
      });
    } finally {
      setDownloadingImages(false);
    }
  };

  // Render opportunity cards
  const renderOpportunityCards = (opportunities: OpportunityItem[]) => (
    <ViewLayouts viewMode={viewMode}>
      {opportunities.map((opportunity) => (
        <OpportunityCard
          key={opportunity.id}
          opportunity={{
            ...opportunity,
            description_ar: opportunity.description_ar || '',
            opportunity_type: opportunity.opportunity_type || 'general',
            deadline: opportunity.deadline || new Date().toISOString()
          }}
          onView={handleViewDetails}
          onEdit={() => {}}
          showActions={true}
        />
      ))}
    </ViewLayouts>
  );

  const featuredOpportunity = opportunities.length > 0 ? {
    id: opportunities[0].id,
    title_ar: opportunities[0].title_ar,
    title_en: opportunities[0].title_en as string || opportunities[0].title_ar,
    applications: opportunities[0].applications_count || 0,
    budget: opportunities[0].budget_max || opportunities[0].budget_min || 0,
    daysLeft: Math.ceil((new Date(opportunities[0].deadline || '').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
    image: '/opportunity-images/opportunities-hero.jpg'
  } : undefined;

  return (
    <div>
      {/* Enhanced Hero Section */}
      <EnhancedOpportunitiesHero 
        totalOpportunities={stats.totalOpportunities}
        activeOpportunities={stats.activeOpportunities}
        totalApplications={stats.totalApplications}
        totalBudget={stats.totalBudget}
        onCreateOpportunity={() => {}} // Only for admins
        onShowFilters={() => setShowAdvancedFilters(true)}
        featuredOpportunity={featuredOpportunity}
      />
      
      <PageLayout
        title={isRTL ? 'فرص الشراكة المتاحة' : 'Available Partnership Opportunities'}
        description={isRTL ? 'تصفح واختر فرص الشراكة التي تناسب أهدافك' : 'Browse and select partnership opportunities that match your goals'}
        itemCount={tabFilteredOpportunities.length}
        secondaryActions={
          <div className="flex gap-2">
            <OpportunityNotificationCenter />
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadImages}
              disabled={downloadingImages}
            >
              <FileText className="w-4 h-4 mr-2" />
              {downloadingImages ? (isRTL ? 'جارٍ التحميل...' : 'Downloading...') : (isRTL ? 'تحميل الصور' : 'Download Images')}
            </Button>
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
              onViewModeChange={(mode) => {
                if (['cards', 'list', 'grid'].includes(mode)) {
                  setViewMode(mode as 'cards' | 'list' | 'grid');
                }
              }}
              supportedLayouts={['cards', 'list', 'grid']}
            />
          </div>
        }
      >
        <div className="space-y-6">
          {/* Enhanced Layout with Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Enhanced Filters with Animations */}
              <EnhancedOpportunityFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={handleClearFilters}
                activeFiltersCount={getActiveFiltersCount()}
                className="animate-fade-in"
              />

              {/* Enhanced Tabs with Counters */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className={`grid w-full grid-cols-4 ${isRTL ? 'rtl' : 'ltr'}`}>
                  <TabsTrigger value="all" className="relative">
                    {isRTL ? 'الكل' : 'All'}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {filteredOpportunities.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="active" className="relative">
                    {isRTL ? 'نشط' : 'Active'}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {filteredOpportunities.filter(o => o.status === 'open').length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="relative">
                    {isRTL ? 'قادم' : 'Upcoming'}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {filteredOpportunities.filter(o => new Date(o.deadline) > new Date()).length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="trending" className="relative">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {isRTL ? 'رائج' : 'Trending'}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {filteredOpportunities.filter(o => o.priority_level === 'high' || (o.applications_count || 0) > 10).length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-6 animate-fade-in">
                  {loading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-48 bg-gray-200 rounded-lg" />
                        </div>
                      ))}
                    </div>
                  ) : tabFilteredOpportunities.length > 0 ? (
                    renderOpportunityCards(tabFilteredOpportunities)
                  ) : (
                    <div className="text-center py-12">
                      <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        {isRTL ? 'لا توجد فرص متاحة' : 'No opportunities found'}
                      </h3>
                      <p className="text-muted-foreground">
                        {isRTL ? 'جرب تعديل المرشحات أو تحقق لاحقاً' : 'Try adjusting your filters or check back later'}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar with Widgets */}
            <div className="space-y-6">
            <TrendingOpportunitiesWidget opportunities={opportunities.slice(0, 5) as Opportunity[]} />
            <OpportunityRecommendations opportunities={opportunities.slice(0, 3) as Opportunity[]} />
            </div>
          </div>
        </div>

        {/* Dialogs */}
        <OpportunityDetailsDialog
          opportunityId={selectedOpportunity?.id || ''}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
        />

        <OpportunityApplicationDialog
          opportunity={selectedOpportunity}
          open={applicationDialogOpen}
          onOpenChange={setApplicationDialogOpen}
          onSuccess={() => {
            setApplicationDialogOpen(false);
            loadOpportunities(); // Refresh to update application counts
          }}
        />

        <OpportunityTemplatesDialog
          open={templatesDialogOpen}
          onOpenChange={setTemplatesDialogOpen}
        />

        <OpportunityAnalyticsDashboard 
          open={analyticsDialogOpen}
          onOpenChange={setAnalyticsDialogOpen}
          opportunities={opportunities as Opportunity[]}
        />
      </PageLayout>
    </div>
  );
}