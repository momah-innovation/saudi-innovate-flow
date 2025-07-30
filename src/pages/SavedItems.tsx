import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useDirection } from '@/components/ui/direction-provider';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Heart, Bookmark, Calendar, Target, Users, Award, Settings, Edit3, Trash2,
  Search, Filter, Plus, FolderPlus, Eye, Share2, Download, Star,
  Lightbulb, Building, FileText, Clock, Bell, ChevronRight, Grid, List,
  MessageSquare, HelpCircle, Zap, UserCheck
} from 'lucide-react';

const SavedItemsPage = () => {
  const { 
    challengeBookmarks, 
    eventBookmarks, 
    ideaBookmarks, 
    loading, 
    removeBookmark,
    isBookmarked 
  } = useBookmarks();
  const { isRTL } = useDirection();
  const { t } = useTranslation();
  
  const [activeTab, setActiveTab] = useState('challenges');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<any>(null);

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
      completed: isRTL ? 'مكتمل' : 'Completed',
      draft: isRTL ? 'مسودة' : 'Draft',
      published: isRTL ? 'منشور' : 'Published'
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
      case 'focus_question': return <HelpCircle className="w-5 h-5" />;
      case 'campaign': return <Zap className="w-5 h-5" />;
      case 'team': return <Users className="w-5 h-5" />;
      case 'partner': return <Building className="w-5 h-5" />;
      case 'expert': return <UserCheck className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const renderChallengeCard = (bookmark: any) => {
    const challenge = bookmark.challenges;
    if (!challenge) return null;

    return (
      <Card key={bookmark.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
        {challenge.image_url && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={challenge.image_url} 
              alt={challenge.title_ar}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Badge variant="outline" className={getStatusColor(challenge.status)}>
                {getStatusText(challenge.status)}
              </Badge>
            </div>
          </div>
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {getTypeIcon('challenge')}
              </div>
              {!challenge.image_url && (
                <Badge variant="outline" className={getStatusColor(challenge.status)}>
                  {getStatusText(challenge.status)}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeBookmark(bookmark.id, 'challenge')}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <CardTitle className="text-lg line-clamp-2">{challenge.title_ar}</CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
            {challenge.description_ar}
          </p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span>{isRTL ? 'محفوظ في:' : 'Saved:'} {new Date(bookmark.created_at).toLocaleDateString()}</span>
            {challenge.end_date && (
              <span>{isRTL ? 'ينتهي في:' : 'Ends:'} {new Date(challenge.end_date).toLocaleDateString()}</span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => setSelectedItem({...challenge, type: 'challenge'})}>
                  <Eye className="w-4 h-4 mr-2" />
                  {isRTL ? 'عرض التفاصيل' : 'View Details'}
                </Button>
              </DialogTrigger>
            </Dialog>
            
            <Button size="sm">
              {isRTL ? 'المشاركة' : 'Participate'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderEventCard = (bookmark: any) => {
    const event = bookmark.events;
    if (!event) return null;

    return (
      <Card key={bookmark.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
        {event.image_url && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={event.image_url} 
              alt={event.title_ar}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Badge variant="outline" className={getStatusColor(event.status)}>
                {getStatusText(event.status)}
              </Badge>
            </div>
          </div>
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {getTypeIcon('event')}
              </div>
              {!event.image_url && (
                <Badge variant="outline" className={getStatusColor(event.status)}>
                  {getStatusText(event.status)}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeBookmark(bookmark.id, 'event')}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <CardTitle className="text-lg line-clamp-2">{event.title_ar}</CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
            {event.description_ar}
          </p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span>{isRTL ? 'محفوظ في:' : 'Saved:'} {new Date(bookmark.created_at).toLocaleDateString()}</span>
            {event.event_date && (
              <span>{isRTL ? 'موعد الفعالية:' : 'Event Date:'} {new Date(event.event_date).toLocaleDateString()}</span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => setSelectedItem({...event, type: 'event'})}>
                  <Eye className="w-4 h-4 mr-2" />
                  {isRTL ? 'عرض التفاصيل' : 'View Details'}
                </Button>
              </DialogTrigger>
            </Dialog>
            
            <Button size="sm">
              {isRTL ? 'التسجيل' : 'Register'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderIdeaCard = (bookmark: any) => {
    const idea = bookmark.ideas;
    if (!idea) return null;

    return (
      <Card key={bookmark.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <img 
            src="/saved-images/saved-ideas.jpg"
            alt={idea.title_ar}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Badge variant="outline" className={getStatusColor(idea.status)}>
              {getStatusText(idea.status)}
            </Badge>
            {bookmark.priority && (
              <Badge variant="outline" className={getPriorityColor(bookmark.priority)}>
                {bookmark.priority}
              </Badge>
            )}
          </div>
        </div>
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {getTypeIcon('idea')}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeBookmark(bookmark.id, 'idea')}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <CardTitle className="text-lg line-clamp-2">{idea.title_ar}</CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
            {idea.description_ar}
          </p>
          
          {bookmark.notes && (
            <div className="mb-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>{isRTL ? 'ملاحظة:' : 'Note:'}</strong> {bookmark.notes}
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span>{isRTL ? 'محفوظ في:' : 'Saved:'} {new Date(bookmark.created_at).toLocaleDateString()}</span>
          </div>
          
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => setSelectedItem({...idea, type: 'idea', notes: bookmark.notes})}>
                  <Eye className="w-4 h-4 mr-2" />
                  {isRTL ? 'عرض التفاصيل' : 'View Details'}
                </Button>
              </DialogTrigger>
            </Dialog>
            
            <Button size="sm">
              {isRTL ? 'عرض' : 'View'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderEmptyState = (icon: React.ReactNode, title: string, description: string) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md">{description}</p>
    </div>
  );

  const renderTabContent = (items: any[], renderCard: (item: any) => React.ReactNode, emptyIcon: React.ReactNode, emptyTitle: string, emptyDescription: string) => {
    if (loading) {
      return (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (items.length === 0) {
      return renderEmptyState(emptyIcon, emptyTitle, emptyDescription);
    }

    return (
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {items.map(renderCard)}
      </div>
    );
  };

  return (
    <AppShell>
      <PageLayout>
        {/* Hero Section */}
        <div className="relative mb-8 rounded-xl overflow-hidden">
          <img 
            src="/saved-images/bookmarks-hero.jpg"
            alt="Saved Items"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">
                {isRTL ? 'العناصر المحفوظة' : 'Saved Items'}
              </h1>
              <p className="text-xl opacity-90">
                {isRTL ? 'إدارة وتنظيم المحتوى المحفوظ' : 'Manage and organize your saved content'}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={isRTL ? 'البحث في العناصر المحفوظة...' : 'Search saved items...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder={isRTL ? 'الأولوية' : 'Priority'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'الكل' : 'All'}</SelectItem>
                <SelectItem value="high">{isRTL ? 'عالية' : 'High'}</SelectItem>
                <SelectItem value="medium">{isRTL ? 'متوسطة' : 'Medium'}</SelectItem>
                <SelectItem value="low">{isRTL ? 'منخفضة' : 'Low'}</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              {isRTL ? 'التحديات' : 'Challenges'} 
              <Badge variant="secondary" className="ml-1">
                {challengeBookmarks.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {isRTL ? 'الفعاليات' : 'Events'}
              <Badge variant="secondary" className="ml-1">
                {eventBookmarks.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="ideas" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              {isRTL ? 'الأفكار' : 'Ideas'}
              <Badge variant="secondary" className="ml-1">
                {ideaBookmarks.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="mt-6">
            {renderTabContent(
              challengeBookmarks,
              renderChallengeCard,
              <Target className="w-8 h-8 text-muted-foreground" />,
              isRTL ? 'لا توجد تحديات محفوظة' : 'No saved challenges',
              isRTL ? 'ابدأ بحفظ التحديات المثيرة للاهتمام' : 'Start saving interesting challenges'
            )}
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            {renderTabContent(
              eventBookmarks,
              renderEventCard,
              <Calendar className="w-8 h-8 text-muted-foreground" />,
              isRTL ? 'لا توجد فعاليات محفوظة' : 'No saved events',
              isRTL ? 'احفظ الفعاليات التي تهمك' : 'Save events that interest you'
            )}
          </TabsContent>

          <TabsContent value="ideas" className="mt-6">
            {renderTabContent(
              ideaBookmarks,
              renderIdeaCard,
              <Lightbulb className="w-8 h-8 text-muted-foreground" />,
              isRTL ? 'لا توجد أفكار محفوظة' : 'No saved ideas',
              isRTL ? 'احفظ الأفكار الملهمة' : 'Save inspiring ideas'
            )}
          </TabsContent>
        </Tabs>

        {/* Detail Modal */}
        {selectedItem && (
          <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getTypeIcon(selectedItem.type)}
                  {selectedItem.title_ar}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selectedItem.image_url && (
                  <img 
                    src={selectedItem.image_url} 
                    alt={selectedItem.title_ar}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                <p className="text-muted-foreground">{selectedItem.description_ar}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>{isRTL ? 'الحالة:' : 'Status:'}</strong> {getStatusText(selectedItem.status)}
                  </div>
                  <div>
                    <strong>{isRTL ? 'النوع:' : 'Type:'}</strong> {selectedItem.type}
                  </div>
                </div>
                {selectedItem.notes && (
                  <div>
                    <strong>{isRTL ? 'الملاحظات:' : 'Notes:'}</strong>
                    <p className="mt-2 p-3 bg-muted rounded-lg">{selectedItem.notes}</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </PageLayout>
    </AppShell>
  );
};

export default SavedItemsPage;