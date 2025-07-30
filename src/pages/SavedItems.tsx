import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useDirection } from '@/components/ui/direction-provider';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Heart, Bookmark, Calendar, Target, Users, Award, Settings, Edit3, Trash2,
  Search, Filter, Plus, FolderPlus, Eye, Share2, Download, Star,
  Lightbulb, Building, FileText, Clock, Bell, ChevronRight, Grid, List
} from 'lucide-react';

interface BookmarkedItem {
  id: string;
  type: 'challenge' | 'event' | 'idea' | 'team' | 'partner';
  title: string;
  description: string;
  date: string;
  status: string;
  bookmarked_at: string;
  notes?: string;
  priority?: string;
  image_url?: string;
  metadata?: any;
}

interface Collection {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  color: string;
  icon: string;
  is_public: boolean;
  item_count: number;
}

const EnhancedSavedItemsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isRTL } = useDirection();
  const { t, language } = useTranslation();
  
  const [bookmarkedChallenges, setBookmarkedChallenges] = useState<BookmarkedItem[]>([]);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<BookmarkedItem[]>([]);
  const [bookmarkedIdeas, setBookmarkedIdeas] = useState<BookmarkedItem[]>([]);
  const [bookmarkedTeams, setBookmarkedTeams] = useState<BookmarkedItem[]>([]);
  const [bookmarkedPartners, setBookmarkedPartners] = useState<BookmarkedItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('challenges');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BookmarkedItem | null>(null);

  const currentLanguage = language;

  useEffect(() => {
    if (user) {
      loadAllBookmarkedItems();
      loadCollections();
    }
  }, [user]);

  const loadAllBookmarkedItems = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadBookmarkedChallenges(),
        loadBookmarkedEvents(),
        loadBookmarkedIdeas(),
        loadBookmarkedTeams(),
        loadBookmarkedPartners()
      ]);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      toast({
        title: isRTL ? 'خطأ في تحميل البيانات' : 'Error loading data',
        description: isRTL ? 'حدث خطأ أثناء تحميل العناصر المحفوظة' : 'An error occurred while loading saved items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadBookmarkedChallenges = async () => {
    const { data: challengeBookmarks } = await supabase
      .from('challenge_bookmarks')
      .select(`
        created_at,
        challenge_id
      `)
      .eq('user_id', user?.id);

    const challengeIds = challengeBookmarks?.map(b => b.challenge_id) || [];
    if (challengeIds.length === 0) {
      setBookmarkedChallenges([]);
      return;
    }

    const { data: challenges } = await supabase
      .from('challenges')
      .select('id, title_ar, description_ar, status, end_date, image_url')
      .in('id', challengeIds);

    const challengeData = (challengeBookmarks || []).map(bookmark => {
      const challenge = challenges?.find(c => c.id === bookmark.challenge_id);
      return challenge ? {
        id: challenge.id,
        type: 'challenge' as const,
        title: challenge.title_ar,
        description: challenge.description_ar,
        date: challenge.end_date || '',
        status: challenge.status,
        bookmarked_at: bookmark.created_at,
        priority: 'medium',
        image_url: challenge.image_url
      } : null;
    }).filter(Boolean);

    setBookmarkedChallenges(challengeData as BookmarkedItem[]);
  };

  const loadBookmarkedEvents = async () => {
    const { data: eventBookmarks } = await supabase
      .from('event_bookmarks')
      .select(`
        created_at,
        event_id
      `)
      .eq('user_id', user?.id);

    const eventIds = eventBookmarks?.map(b => b.event_id) || [];
    if (eventIds.length === 0) {
      setBookmarkedEvents([]);
      return;
    }

    const { data: events } = await supabase
      .from('events')
      .select('id, title_ar, description_ar, status, event_date, image_url')
      .in('id', eventIds);

    const eventData = (eventBookmarks || []).map(bookmark => {
      const event = events?.find(e => e.id === bookmark.event_id);
      return event ? {
        id: event.id,
        type: 'event' as const,
        title: event.title_ar,
        description: event.description_ar,
        date: event.event_date,
        status: event.status,
        bookmarked_at: bookmark.created_at,
        priority: 'medium',
        image_url: event.image_url
      } : null;
    }).filter(Boolean);

    setBookmarkedEvents(eventData as BookmarkedItem[]);
  };

  const loadBookmarkedIdeas = async () => {
    // For now, use placeholder data since tables may not exist yet
    setBookmarkedIdeas([
      {
        id: '1',
        type: 'idea',
        title: 'تطبيق ذكي لإدارة النفايات',
        description: 'فكرة لتطوير تطبيق يستخدم الذكاء الاصطناعي لتحسين عملية جمع النفايات',
        date: '2024-02-15',
        status: 'under_review',
        bookmarked_at: '2024-01-20',
        priority: 'high',
        image_url: '/saved-images/saved-ideas.jpg'
      }
    ]);
  };

  const loadBookmarkedTeams = async () => {
    // Placeholder data
    setBookmarkedTeams([
      {
        id: '1',
        type: 'team',
        title: 'فريق الابتكار التقني',
        description: 'فريق متخصص في تطوير الحلول التقنية المبتكرة',
        date: '2024-01-15',
        status: 'active',
        bookmarked_at: '2024-01-10',
        priority: 'medium'
      }
    ]);
  };

  const loadBookmarkedPartners = async () => {
    // Placeholder data
    setBookmarkedPartners([
      {
        id: '1',
        type: 'partner',
        title: 'شركة التقنيات المتقدمة',
        description: 'شريك تقني متخصص في حلول الذكاء الاصطناعي',
        date: '2024-01-01',
        status: 'active',
        bookmarked_at: '2024-01-05',
        priority: 'high'
      }
    ]);
  };

  const loadCollections = async () => {
    // Placeholder collections
    setCollections([
      {
        id: '1',
        name_ar: 'مجموعة المفضلة',
        name_en: 'Favorites',
        description_ar: 'العناصر المفضلة والمهمة',
        description_en: 'Favorite and important items',
        color: '#EF4444',
        icon: 'heart',
        is_public: false,
        item_count: 5
      },
      {
        id: '2',
        name_ar: 'للمراجعة لاحقاً',
        name_en: 'Review Later',
        description_ar: 'عناصر للمراجعة في وقت لاحق',
        description_en: 'Items to review later',
        color: '#F59E0B',
        icon: 'clock',
        is_public: false,
        item_count: 3
      }
    ]);
  };

  const removeBookmark = async (itemId: string, type: string) => {
    try {
      const tableMap = {
        challenge: 'challenge_bookmarks',
        event: 'event_bookmarks',
        idea: 'idea_bookmarks',
        team: 'team_bookmarks',
        partner: 'partner_bookmarks'
      };

      const tableName = tableMap[type as keyof typeof tableMap];
      const columnName = `${type}_id`;

      if (tableName) {
        const { error } = await supabase
          .from(tableName as any)
          .delete()
          .eq(columnName, itemId)
          .eq('user_id', user?.id);

        if (error) throw error;
      }

      // Update local state
      switch (type) {
        case 'challenge':
          setBookmarkedChallenges(prev => prev.filter(item => item.id !== itemId));
          break;
        case 'event':
          setBookmarkedEvents(prev => prev.filter(item => item.id !== itemId));
          break;
        case 'idea':
          setBookmarkedIdeas(prev => prev.filter(item => item.id !== itemId));
          break;
        case 'team':
          setBookmarkedTeams(prev => prev.filter(item => item.id !== itemId));
          break;
        case 'partner':
          setBookmarkedPartners(prev => prev.filter(item => item.id !== itemId));
          break;
      }

      toast({
        title: isRTL ? 'تم إلغاء الحفظ' : 'Bookmark removed',
        description: isRTL ? 'تم إزالة العنصر من المحفوظات' : 'Item removed from bookmarks',
      });
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في إزالة العنصر' : 'Failed to remove item',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'closed':
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      active: isRTL ? 'نشط' : 'Active',
      upcoming: isRTL ? 'قادم' : 'Upcoming',
      under_review: isRTL ? 'قيد المراجعة' : 'Under Review',
      closed: isRTL ? 'مغلق' : 'Closed',
      completed: isRTL ? 'مكتمل' : 'Completed'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'challenge': return <Target className="w-5 h-5" />;
      case 'event': return <Calendar className="w-5 h-5" />;
      case 'idea': return <Lightbulb className="w-5 h-5" />;
      case 'team': return <Users className="w-5 h-5" />;
      case 'partner': return <Building className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const renderItemCard = (item: BookmarkedItem) => (
    <Card key={item.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      {item.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={item.image_url} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Badge variant="outline" className={getStatusColor(item.status)}>
              {getStatusText(item.status)}
            </Badge>
            {item.priority && (
              <Badge variant="outline" className={getPriorityColor(item.priority)}>
                {item.priority}
              </Badge>
            )}
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {getTypeIcon(item.type)}
            </div>
            {!item.image_url && (
              <div className="flex gap-2">
                <Badge variant="outline" className={getStatusColor(item.status)}>
                  {getStatusText(item.status)}
                </Badge>
                {item.priority && (
                  <Badge variant="outline" className={getPriorityColor(item.priority)}>
                    {item.priority}
                  </Badge>
                )}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeBookmark(item.id, item.type)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {item.description}
        </p>
        
        {item.notes && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>{isRTL ? 'ملاحظة:' : 'Note:'}</strong> {item.notes}
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>{isRTL ? 'محفوظ في:' : 'Saved:'} {new Date(item.bookmarked_at).toLocaleDateString()}</span>
          <span>{isRTL ? 'الموعد:' : 'Date:'} {new Date(item.date).toLocaleDateString()}</span>
        </div>
        
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" onClick={() => setSelectedItem(item)}>
                <Eye className="w-4 h-4 mr-2" />
                {isRTL ? 'عرض التفاصيل' : 'View Details'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedItem?.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selectedItem?.image_url && (
                  <img 
                    src={selectedItem.image_url} 
                    alt={selectedItem.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                <p className="text-muted-foreground">{selectedItem?.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>{isRTL ? 'الحالة:' : 'Status:'}</strong> {selectedItem && getStatusText(selectedItem.status)}
                  </div>
                  <div>
                    <strong>{isRTL ? 'الأولوية:' : 'Priority:'}</strong> {selectedItem?.priority || 'Medium'}
                  </div>
                  <div>
                    <strong>{isRTL ? 'تاريخ الحفظ:' : 'Saved Date:'}</strong> {selectedItem && new Date(selectedItem.bookmarked_at).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>{isRTL ? 'الموعد:' : 'Date:'}</strong> {selectedItem && new Date(selectedItem.date).toLocaleDateString()}
                  </div>
                </div>
                {selectedItem?.notes && (
                  <div>
                    <strong>{isRTL ? 'الملاحظات:' : 'Notes:'}</strong>
                    <p className="mt-2 p-3 bg-muted rounded-lg">{selectedItem.notes}</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          <Button size="sm">
            {item.type === 'challenge' ? 
              (isRTL ? 'المشاركة' : 'Participate') : 
              item.type === 'event' ?
              (isRTL ? 'التسجيل' : 'Register') :
              (isRTL ? 'عرض' : 'View')
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderTabContent = (items: BookmarkedItem[], emptyIcon: any, emptyTitle: string, emptyDescription: string) => {
    const filteredItems = items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });

    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      );
    }

    if (filteredItems.length === 0) {
      return (
        <div className="text-center py-12">
          {emptyIcon}
          <h3 className="text-lg font-medium mb-2">{emptyTitle}</h3>
          <p className="text-muted-foreground">{emptyDescription}</p>
        </div>
      );
    }

    return (
      <div className={viewMode === 'grid' ? 
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : 
        "space-y-4"
      }>
        {filteredItems.map(renderItemCard)}
      </div>
    );
  };

  if (!user) {
    return (
      <AppShell>
        <PageLayout
          title={isRTL ? 'العناصر المحفوظة' : 'Saved Items'}
          description={isRTL ? 'قم بتسجيل الدخول لعرض عناصرك المحفوظة' : 'Please sign in to view your saved items'}
        >
          <div className="text-center py-12">
            <Bookmark className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {isRTL ? 'يرجى تسجيل الدخول' : 'Please Sign In'}
            </h3>
            <p className="text-muted-foreground">
              {isRTL ? 'قم بتسجيل الدخول لعرض التحديات والفعاليات المحفوظة' : 'Sign in to view your saved challenges and events'}
            </p>
          </div>
        </PageLayout>
      </AppShell>
    );
  }

  const totalItems = bookmarkedChallenges.length + bookmarkedEvents.length + 
                    bookmarkedIdeas.length + bookmarkedTeams.length + bookmarkedPartners.length;

  return (
    <AppShell>
      <PageLayout
        title={isRTL ? 'العناصر المحفوظة' : 'Saved Items'}
        description={isRTL ? 'إدارة وتنظيم العناصر المحفوظة' : 'Manage and organize your saved items'}
        itemCount={totalItems}
      >
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-6">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {isRTL ? 'مكتبتك الشخصية' : 'Your Personal Library'}
                </h1>
                <p className="text-white/80">
                  {isRTL ? `${totalItems} عنصر محفوظ` : `${totalItems} saved items`}
                </p>
              </div>
              <div className="hidden md:block">
                <img 
                  src="/saved-images/bookmarks-hero.jpg" 
                  alt="Bookmarks" 
                  className="w-24 h-24 rounded-lg object-cover opacity-80"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={isRTL ? 'البحث في العناصر المحفوظة...' : 'Search saved items...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={isRTL ? 'تصفية حسب الأولوية' : 'Filter by priority'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isRTL ? 'جميع الأولويات' : 'All priorities'}</SelectItem>
              <SelectItem value="high">{isRTL ? 'عالية' : 'High'}</SelectItem>
              <SelectItem value="medium">{isRTL ? 'متوسطة' : 'Medium'}</SelectItem>
              <SelectItem value="low">{isRTL ? 'منخفضة' : 'Low'}</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              {isRTL ? 'التحديات' : 'Challenges'}
              <Badge variant="secondary" className="ml-1">
                {bookmarkedChallenges.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {isRTL ? 'الفعاليات' : 'Events'}
              <Badge variant="secondary" className="ml-1">
                {bookmarkedEvents.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="ideas" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              {isRTL ? 'الأفكار' : 'Ideas'}
              <Badge variant="secondary" className="ml-1">
                {bookmarkedIdeas.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {isRTL ? 'الفرق' : 'Teams'}
              <Badge variant="secondary" className="ml-1">
                {bookmarkedTeams.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="partners" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              {isRTL ? 'الشركاء' : 'Partners'}
              <Badge variant="secondary" className="ml-1">
                {bookmarkedPartners.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="collections" className="flex items-center gap-2">
              <FolderPlus className="w-4 h-4" />
              {isRTL ? 'المجموعات' : 'Collections'}
              <Badge variant="secondary" className="ml-1">
                {collections.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="space-y-4">
            {renderTabContent(
              bookmarkedChallenges,
              <Target className="w-16 h-16 mx-auto text-muted-foreground mb-4" />,
              isRTL ? 'لا توجد تحديات محفوظة' : 'No saved challenges',
              isRTL ? 'احفظ التحديات المهمة لسهولة الوصول إليها لاحقاً' : 'Save important challenges for easy access later'
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            {renderTabContent(
              bookmarkedEvents,
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />,
              isRTL ? 'لا توجد فعاليات محفوظة' : 'No saved events',
              isRTL ? 'احفظ الفعاليات المهمة لسهولة الوصول إليها لاحقاً' : 'Save important events for easy access later'
            )}
          </TabsContent>

          <TabsContent value="ideas" className="space-y-4">
            {renderTabContent(
              bookmarkedIdeas,
              <Lightbulb className="w-16 h-16 mx-auto text-muted-foreground mb-4" />,
              isRTL ? 'لا توجد أفكار محفوظة' : 'No saved ideas',
              isRTL ? 'احفظ الأفكار الملهمة لمراجعتها لاحقاً' : 'Save inspiring ideas to review later'
            )}
          </TabsContent>

          <TabsContent value="teams" className="space-y-4">
            {renderTabContent(
              bookmarkedTeams,
              <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />,
              isRTL ? 'لا توجد فرق محفوظة' : 'No saved teams',
              isRTL ? 'تابع الفرق المثيرة للاهتمام للحصول على التحديثات' : 'Follow interesting teams to get updates'
            )}
          </TabsContent>

          <TabsContent value="partners" className="space-y-4">
            {renderTabContent(
              bookmarkedPartners,
              <Building className="w-16 h-16 mx-auto text-muted-foreground mb-4" />,
              isRTL ? 'لا توجد شركاء محفوظين' : 'No saved partners',
              isRTL ? 'احفظ الشركاء المهمين لمتابعة فرص التعاون' : 'Save important partners to track collaboration opportunities'
            )}
          </TabsContent>

          <TabsContent value="collections" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <Card key={collection.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div 
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: `${collection.color}20`, color: collection.color }}
                      >
                        <Heart className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {currentLanguage === 'ar' ? collection.name_ar : collection.name_en}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {collection.item_count} {isRTL ? 'عنصر' : 'items'}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {currentLanguage === 'ar' ? collection.description_ar : collection.description_en}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        {isRTL ? 'عرض' : 'View'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit3 className="w-4 h-4 mr-2" />
                        {isRTL ? 'تعديل' : 'Edit'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </PageLayout>
    </AppShell>
  );
};

export default EnhancedSavedItemsPage;