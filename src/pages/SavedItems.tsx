import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useDirection } from '@/components/ui/direction-provider';
import { 
  Heart, 
  Bookmark, 
  Calendar, 
  Target, 
  Users, 
  Award,
  Settings,
  Edit3,
  Trash2
} from 'lucide-react';

interface BookmarkedItem {
  id: string;
  type: 'challenge' | 'event';
  title: string;
  description: string;
  date: string;
  status: string;
  bookmarked_at: string;
}

const SavedItemsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isRTL } = useDirection();
  
  const [bookmarkedChallenges, setBookmarkedChallenges] = useState<BookmarkedItem[]>([]);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<BookmarkedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('challenges');

  useEffect(() => {
    if (user) {
      loadBookmarkedItems();
    }
  }, [user]);

  const loadBookmarkedItems = async () => {
    try {
      setLoading(true);
      
      // Load bookmarked challenges
      const { data: challengeBookmarks } = await supabase
        .from('challenge_bookmarks')
        .select(`
          created_at,
          challenge_id
        `)
        .eq('user_id', user?.id);

      const challengeIds = challengeBookmarks?.map(b => b.challenge_id) || [];
      const { data: challenges } = challengeIds.length > 0 ? await supabase
        .from('challenges')
        .select('id, title_ar, description_ar, status, end_date')
        .in('id', challengeIds) : { data: [] };

      // Load bookmarked events
      const { data: eventBookmarks } = await supabase
        .from('event_bookmarks')
        .select(`
          created_at,
          event_id
        `)
        .eq('user_id', user?.id);

      const eventIds = eventBookmarks?.map(b => b.event_id) || [];
      const { data: events } = eventIds.length > 0 ? await supabase
        .from('events')
        .select('id, title_ar, description_ar, status, event_date')
        .in('id', eventIds) : { data: [] };

      // Transform challenges data
      const challengeData = (challengeBookmarks || []).map(bookmark => {
        const challenge = challenges?.find(c => c.id === bookmark.challenge_id);
        return challenge ? {
          id: challenge.id,
          type: 'challenge' as const,
          title: challenge.title_ar,
          description: challenge.description_ar,
          date: challenge.end_date || '',
          status: challenge.status,
          bookmarked_at: bookmark.created_at
        } : null;
      }).filter(Boolean);

      // Transform events data
      const eventData = (eventBookmarks || []).map(bookmark => {
        const event = events?.find(e => e.id === bookmark.event_id);
        return event ? {
          id: event.id,
          type: 'event' as const,
          title: event.title_ar,
          description: event.description_ar,
          date: event.event_date,
          status: event.status,
          bookmarked_at: bookmark.created_at
        } : null;
      }).filter(Boolean);

      setBookmarkedChallenges(challengeData as BookmarkedItem[]);
      setBookmarkedEvents(eventData as BookmarkedItem[]);
      
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

  const removeBookmark = async (itemId: string, type: 'challenge' | 'event') => {
    try {
      const tableName = type === 'challenge' ? 'challenge_bookmarks' : 'event_bookmarks';
      const columnName = `${type}_id`;

      const { error } = await supabase
        .from(tableName as any)
        .delete()
        .eq(columnName, itemId)
        .eq('user_id', user?.id);

      if (error) throw error;

      // Update local state
      if (type === 'challenge') {
        setBookmarkedChallenges(prev => prev.filter(item => item.id !== itemId));
      } else {
        setBookmarkedEvents(prev => prev.filter(item => item.id !== itemId));
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
      case 'closed':
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return isRTL ? 'نشط' : 'Active';
      case 'upcoming': return isRTL ? 'قادم' : 'Upcoming';
      case 'closed': return isRTL ? 'مغلق' : 'Closed';
      case 'completed': return isRTL ? 'مكتمل' : 'Completed';
      default: return status;
    }
  };

  const renderItemCard = (item: BookmarkedItem) => (
    <Card key={item.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {item.type === 'challenge' ? (
              <Target className="w-5 h-5 text-primary" />
            ) : (
              <Calendar className="w-5 h-5 text-blue-500" />
            )}
            <Badge variant="outline" className={getStatusColor(item.status)}>
              {getStatusText(item.status)}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeBookmark(item.id, item.type)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{isRTL ? 'محفوظ في:' : 'Saved:'} {new Date(item.bookmarked_at).toLocaleDateString()}</span>
          <span>{isRTL ? 'الموعد:' : 'Date:'} {new Date(item.date).toLocaleDateString()}</span>
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline">
            {isRTL ? 'عرض التفاصيل' : 'View Details'}
          </Button>
          <Button size="sm">
            {item.type === 'challenge' ? 
              (isRTL ? 'المشاركة' : 'Participate') : 
              (isRTL ? 'التسجيل' : 'Register')
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );

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

  return (
    <AppShell>
      <PageLayout
        title={isRTL ? 'العناصر المحفوظة' : 'Saved Items'}
        description={isRTL ? 'التحديات والفعاليات التي حفظتها' : 'Your bookmarked challenges and events'}
        itemCount={bookmarkedChallenges.length + bookmarkedEvents.length}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
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
          </TabsList>

          <TabsContent value="challenges" className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
              </div>
            ) : bookmarkedChallenges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedChallenges.map(renderItemCard)}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {isRTL ? 'لا توجد تحديات محفوظة' : 'No saved challenges'}
                </h3>
                <p className="text-muted-foreground">
                  {isRTL ? 'احفظ التحديات المهمة لسهولة الوصول إليها لاحقاً' : 'Save important challenges for easy access later'}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
              </div>
            ) : bookmarkedEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedEvents.map(renderItemCard)}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {isRTL ? 'لا توجد فعاليات محفوظة' : 'No saved events'}
                </h3>
                <p className="text-muted-foreground">
                  {isRTL ? 'احفظ الفعاليات المهمة لسهولة الوصول إليها لاحقاً' : 'Save important events for easy access later'}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </PageLayout>
    </AppShell>
  );
};

export default SavedItemsPage;