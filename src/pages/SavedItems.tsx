import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { EnhancedSavedHero } from '@/components/saved/EnhancedSavedHero';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { 
  Heart, Bookmark, Calendar, Target, Users, Award, Settings, Edit3, Trash2,
  Search, Filter, Plus, FolderPlus, Eye, Share2, Download, Star,
  Lightbulb, Building, FileText, Clock, Bell, ChevronRight, Grid, List,
  MessageSquare, HelpCircle, Zap, UserCheck, MoreHorizontal, Move, Copy,
  X, Archive, Tag, CheckSquare, Square, Briefcase, Network
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

const SavedItemsPage = () => {
  const { 
    challengeBookmarks, 
    eventBookmarks, 
    ideaBookmarks,
    focusQuestionBookmarks,
    campaignBookmarks,
    sectorBookmarks,
    stakeholderBookmarks,
    expertBookmarks,
    partnerBookmarks,
    publicTeams,
    collections,
    loading, 
    removeBookmark,
    isBookmarked 
  } = useBookmarks();
  
  // Add state for partner-related bookmarks
  const [opportunityBookmarks, setOpportunityBookmarks] = useState([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(false);
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  
  const [activeTab, setActiveTab] = useState('challenges');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showNewCollectionDialog, setShowNewCollectionDialog] = useState(false);
  const [newCollectionData, setNewCollectionData] = useState({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    color: '#3B82F6',
    icon: 'folder'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'closed':
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
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
      case 'opportunity': return <Briefcase className="w-5 h-5" />;
      case 'expert': return <UserCheck className="w-5 h-5" />;
      case 'sector': return <Award className="w-5 h-5" />;
      case 'stakeholder': return <Users className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = (items: any[]) => {
    const itemIds = items.map(item => item.id);
    setSelectedItems(prev => 
      prev.length === itemIds.length 
        ? []
        : itemIds
    );
  };

  const renderGenericCard = (bookmark: any, type: string, dataField?: string) => {
    const data = dataField ? bookmark[dataField] : bookmark;
    if (!data) return null;

    const imageMap = {
      challenge: data.image_url,
      event: data.image_url,
      idea: '/ideas-images-public/saved/saved-ideas.jpg',
      focus_question: '/ideas-images-public/saved/focus-questions.jpg',
      campaign: '/campaigns-images-public/saved/campaigns.jpg',
      expert: '/partners-logos-public/experts/experts.jpg',
      stakeholder: '/partners-logos-public/stakeholders/stakeholders.jpg',
      team: '/ideas-images-public/saved/collections-grid.jpg',
      partner: '/partner-logos/corporate-partner.jpg',
      opportunity: '/partner-images/partnership-opportunities.jpg',
      sector: '/sector-images/digital-transformation.jpg'
    };

    const isSelected = selectedItems.includes(bookmark.id);

    return (
      <Card key={bookmark.id} className={`group hover:shadow-lg transition-all duration-200 overflow-hidden ${isSelected ? 'ring-2 ring-primary' : ''}`}>
        <div className="relative">
          {imageMap[type as keyof typeof imageMap] && (
            <div className="relative h-48 overflow-hidden">
              <img 
                src={imageMap[type as keyof typeof imageMap]} 
                alt={data.title_ar || data.name_ar || data.question_ar || 'Image'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Badge variant="outline" className={getStatusColor(data.status || 'active')}>
                  {getStatusText(data.status || 'active')}
                </Badge>
                {bookmark.priority && (
                  <Badge variant="outline" className={getPriorityColor(bookmark.priority)}>
                    {bookmark.priority}
                  </Badge>
                )}
              </div>
              <div className="absolute top-2 left-2">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleSelectItem(bookmark.id)}
                  className="bg-white border-white/50"
                />
              </div>
            </div>
          )}
          
          {!imageMap[type as keyof typeof imageMap] && (
            <div className="absolute top-2 left-2">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => handleSelectItem(bookmark.id)}
              />
            </div>
          )}
        </div>
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {getTypeIcon(type)}
              </div>
              {!imageMap[type as keyof typeof imageMap] && (
                <div className="flex gap-2">
                  <Badge variant="outline" className={getStatusColor(data.status || 'active')}>
                    {getStatusText(data.status || 'active')}
                  </Badge>
                  {bookmark.priority && (
                    <Badge variant="outline" className={getPriorityColor(bookmark.priority)}>
                      {bookmark.priority}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedItem({...data, type, notes: bookmark.notes})}>
                  <Eye className="w-4 h-4 mr-2" />
                  {isRTL ? 'عرض التفاصيل' : 'View Details'}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isRTL ? 'تعديل الملاحظات' : 'Edit Notes'}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Move className="w-4 h-4 mr-2" />
                  {isRTL ? 'نقل إلى مجموعة' : 'Move to Collection'}
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem 
                  onClick={() => removeBookmark(bookmark.id, type as any)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isRTL ? 'حذف من المحفوظات' : 'Remove Bookmark'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardTitle className="text-lg line-clamp-2">
            {data.title_ar || data.name_ar || data.question_ar || 'عنصر محفوظ'}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
            {data.description_ar || data.details_ar || 'وصف العنصر المحفوظ'}
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
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setSelectedItem({...data, type, notes: bookmark.notes})}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isRTL ? 'عرض' : 'View'}
            </Button>
            
            <Button size="sm">
              {type === 'challenge' ? 
                (isRTL ? 'المشاركة' : 'Participate') : 
                type === 'event' ?
                (isRTL ? 'التسجيل' : 'Register') :
                (isRTL ? 'فتح' : 'Open')
              }
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

  const renderTabContent = (
    items: any[], 
    renderCard: (item: any) => React.ReactNode, 
    emptyIcon: React.ReactNode, 
    emptyTitle: string, 
    emptyDescription: string
  ) => {
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
      <div className="space-y-4">
        {items.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedItems.length === items.length}
                onCheckedChange={() => handleSelectAll(items)}
              />
              <span className="text-sm text-muted-foreground">
                {selectedItems.length > 0 && (
                  <span>{selectedItems.length} {isRTL ? 'عنصر محدد' : 'items selected'}</span>
                )}
              </span>
            </div>
            
            {selectedItems.length > 0 && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  {isRTL ? 'نسخ' : 'Copy'}
                </Button>
                <Button size="sm" variant="outline">
                  <Move className="w-4 h-4 mr-2" />
                  {isRTL ? 'نقل' : 'Move'}
                </Button>
                <Button size="sm" variant="outline">
                  <Archive className="w-4 h-4 mr-2" />
                  {isRTL ? 'أرشفة' : 'Archive'}
                </Button>
                <Button size="sm" variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isRTL ? 'حذف' : 'Delete'}
                </Button>
              </div>
            )}
          </div>
        )}
        
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {items.map(renderCard)}
        </div>
      </div>
    );
  };

  return (
    <AppShell>
      <EnhancedSavedHero 
        totalBookmarks={challengeBookmarks.length + eventBookmarks.length + ideaBookmarks.length}
        totalCollections={collections.length}
        totalTags={8}
        recentActivity={5}
        onCreateCollection={() => setShowNewCollectionDialog(true)}
        onShowFilters={() => console.log('Show filters')}
      />
      <PageLayout>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{challengeBookmarks.length}</div>
              <div className="text-sm text-muted-foreground">{isRTL ? 'التحديات' : 'Challenges'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{eventBookmarks.length}</div>
              <div className="text-sm text-muted-foreground">{isRTL ? 'الفعاليات' : 'Events'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{ideaBookmarks.length}</div>
              <div className="text-sm text-muted-foreground">{isRTL ? 'الأفكار' : 'Ideas'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{opportunityBookmarks.length + partnerBookmarks.length}</div>
              <div className="text-sm text-muted-foreground">{isRTL ? 'الشراكات' : 'Partnerships'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{collections.length}</div>
              <div className="text-sm text-muted-foreground">{isRTL ? 'المجموعات' : 'Collections'}</div>
            </CardContent>
          </Card>
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
            <Dialog open={showNewCollectionDialog} onOpenChange={setShowNewCollectionDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FolderPlus className="w-4 h-4 mr-2" />
                  {isRTL ? 'مجموعة جديدة' : 'New Collection'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{isRTL ? 'إنشاء مجموعة جديدة' : 'Create New Collection'}</DialogTitle>
                  <DialogDescription>
                    {isRTL ? 'أنشئ مجموعة لتنظيم العناصر المحفوظة' : 'Create a collection to organize your saved items'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">{isRTL ? 'الاسم بالعربية' : 'Name (Arabic)'}</label>
                    <Input 
                      value={newCollectionData.name_ar}
                      onChange={(e) => setNewCollectionData(prev => ({...prev, name_ar: e.target.value}))}
                      placeholder={isRTL ? 'اسم المجموعة بالعربية' : 'Collection name in Arabic'}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{isRTL ? 'الاسم بالإنجليزية' : 'Name (English)'}</label>
                    <Input 
                      value={newCollectionData.name_en}
                      onChange={(e) => setNewCollectionData(prev => ({...prev, name_en: e.target.value}))}
                      placeholder={isRTL ? 'اسم المجموعة بالإنجليزية' : 'Collection name in English'}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{isRTL ? 'الوصف' : 'Description'}</label>
                    <Textarea 
                      value={newCollectionData.description_ar}
                      onChange={(e) => setNewCollectionData(prev => ({...prev, description_ar: e.target.value}))}
                      placeholder={isRTL ? 'وصف المجموعة' : 'Collection description'}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">{isRTL ? 'إنشاء' : 'Create'}</Button>
                    <Button variant="outline" onClick={() => setShowNewCollectionDialog(false)}>
                      {isRTL ? 'إلغاء' : 'Cancel'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

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
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
            <TabsTrigger value="challenges" className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              <span className="hidden sm:inline">{isRTL ? 'التحديات' : 'Challenges'}</span>
              <Badge variant="secondary" className="ml-1">{challengeBookmarks.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span className="hidden sm:inline">{isRTL ? 'الفعاليات' : 'Events'}</span>
              <Badge variant="secondary" className="ml-1">{eventBookmarks.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="ideas" className="flex items-center gap-1">
              <Lightbulb className="w-3 h-3" />
              <span className="hidden sm:inline">{isRTL ? 'الأفكار' : 'Ideas'}</span>
              <Badge variant="secondary" className="ml-1">{ideaBookmarks.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              <span className="hidden sm:inline">{isRTL ? 'الأسئلة' : 'Questions'}</span>
              <Badge variant="secondary" className="ml-1">{focusQuestionBookmarks.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span className="hidden sm:inline">{isRTL ? 'الحملات' : 'Campaigns'}</span>
              <Badge variant="secondary" className="ml-1">{campaignBookmarks.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              <span className="hidden sm:inline">{isRTL ? 'الفرص' : 'Opportunities'}</span>
              <Badge variant="secondary" className="ml-1">{opportunityBookmarks.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="partners" className="flex items-center gap-1">
              <Building className="w-3 h-3" />
              <span className="hidden sm:inline">{isRTL ? 'الشركاء' : 'Partners'}</span>
              <Badge variant="secondary" className="ml-1">{partnerBookmarks.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span className="hidden sm:inline">{isRTL ? 'الفرق' : 'Teams'}</span>
              <Badge variant="secondary" className="ml-1">{publicTeams.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="experts" className="flex items-center gap-1">
              <UserCheck className="w-3 h-3" />
              <span className="hidden sm:inline">{isRTL ? 'الخبراء' : 'Experts'}</span>
              <Badge variant="secondary" className="ml-1">{expertBookmarks.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="collections" className="flex items-center gap-1">
              <FolderPlus className="w-3 h-3" />
              <span className="hidden sm:inline">{isRTL ? 'المجموعات' : 'Collections'}</span>
              <Badge variant="secondary" className="ml-1">{collections.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="mt-6">
            {renderTabContent(
              challengeBookmarks,
              (bookmark) => renderGenericCard(bookmark, 'challenge', 'challenges'),
              <Target className="w-8 h-8 text-muted-foreground" />,
              isRTL ? 'لا توجد تحديات محفوظة' : 'No saved challenges',
              isRTL ? 'ابدأ بحفظ التحديات المثيرة للاهتمام' : 'Start saving interesting challenges'
            )}
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            {renderTabContent(
              eventBookmarks,
              (bookmark) => renderGenericCard(bookmark, 'event', 'events'),
              <Calendar className="w-8 h-8 text-muted-foreground" />,
              isRTL ? 'لا توجد فعاليات محفوظة' : 'No saved events',
              isRTL ? 'احفظ الفعاليات التي تهمك' : 'Save events that interest you'
            )}
          </TabsContent>

          <TabsContent value="ideas" className="mt-6">
            {renderTabContent(
              ideaBookmarks,
              (bookmark) => renderGenericCard(bookmark, 'idea', 'ideas'),
              <Lightbulb className="w-8 h-8 text-muted-foreground" />,
              isRTL ? 'لا توجد أفكار محفوظة' : 'No saved ideas',
              isRTL ? 'احفظ الأفكار الملهمة' : 'Save inspiring ideas'
            )}
          </TabsContent>

          <TabsContent value="questions" className="mt-6">
            {renderTabContent(
              focusQuestionBookmarks,
              (bookmark) => renderGenericCard(bookmark, 'focus_question', 'focus_questions'),
              <HelpCircle className="w-8 h-8 text-muted-foreground" />,
              isRTL ? 'لا توجد أسئلة محفوظة' : 'No saved questions',
              isRTL ? 'احفظ الأسئلة المهمة' : 'Save important questions'
            )}
          </TabsContent>

          <TabsContent value="campaigns" className="mt-6">
            {renderTabContent(
              campaignBookmarks,
              (bookmark) => renderGenericCard(bookmark, 'campaign', 'campaigns'),
              <Zap className="w-8 h-8 text-muted-foreground" />,
              isRTL ? 'لا توجد حملات محفوظة' : 'No saved campaigns',
              isRTL ? 'احفظ الحملات التي تتابعها' : 'Save campaigns you follow'
            )}
          </TabsContent>

          <TabsContent value="opportunities" className="mt-6">
            {renderTabContent(
              opportunityBookmarks,
              (bookmark) => renderGenericCard(bookmark, 'opportunity', 'partnership_opportunities'),
              <Briefcase className="w-8 h-8 text-muted-foreground" />,
              isRTL ? 'لا توجد فرص شراكة محفوظة' : 'No saved partnership opportunities',
              isRTL ? 'احفظ فرص الشراكة المثيرة للاهتمام' : 'Save interesting partnership opportunities'
            )}
          </TabsContent>

          <TabsContent value="partners" className="mt-6">
            {renderTabContent(
              partnerBookmarks,
              (bookmark) => renderGenericCard(bookmark, 'partner', 'partners'),
              <Building className="w-8 h-8 text-muted-foreground" />,
              isRTL ? 'لا توجد شركاء محفوظون' : 'No saved partners',
              isRTL ? 'احفظ ملفات الشركاء المهمين' : 'Save important partner profiles'
            )}
          </TabsContent>

          <TabsContent value="teams" className="mt-6">
            {renderTabContent(
              publicTeams,
              (team) => renderGenericCard(team, 'team'),
              <Users className="w-8 h-8 text-muted-foreground" />,
              isRTL ? 'لا توجد فرق عامة' : 'No public teams',
              isRTL ? 'اكتشف الفرق العامة النشطة' : 'Discover active public teams'
            )}
          </TabsContent>

          <TabsContent value="experts" className="mt-6">
            {renderTabContent(
              expertBookmarks,
              (bookmark) => renderGenericCard(bookmark, 'expert'),
              <UserCheck className="w-8 h-8 text-muted-foreground" />,
              isRTL ? 'لا توجد خبراء محفوظون' : 'No saved experts',
              isRTL ? 'احفظ ملفات الخبراء المهمين' : 'Save important expert profiles'
            )}
          </TabsContent>

          <TabsContent value="collections" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection) => (
                <Card key={collection.id} className="group hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: collection.color }}
                      >
                        {collection.icon === 'heart' ? <Heart className="w-6 h-6" /> : 
                         collection.icon === 'clock' ? <Clock className="w-6 h-6" /> :
                         <FolderPlus className="w-6 h-6" />}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {isRTL ? collection.name_ar : collection.name_en}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? collection.description_ar : collection.description_en}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        0 {isRTL ? 'عنصر' : 'items'}
                      </span>
                      <Button size="sm" variant="outline">
                        {isRTL ? 'عرض' : 'View'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Detail Modal */}
        {selectedItem && (
          <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getTypeIcon(selectedItem.type)}
                  {selectedItem.title_ar || selectedItem.name_ar || selectedItem.question_ar || 'تفاصيل العنصر'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {selectedItem.description_ar || selectedItem.details_ar || 'لا يوجد وصف متاح'}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>{isRTL ? 'الحالة:' : 'Status:'}</strong> {getStatusText(selectedItem.status || 'active')}
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