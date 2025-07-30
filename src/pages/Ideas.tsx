import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { LayoutSelector } from '@/components/ui/layout-selector';
import { ViewLayouts } from '@/components/ui/view-layouts';
import { useToast } from '@/hooks/use-toast';
import { useDirection } from '@/components/ui/direction-provider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, Lightbulb, TrendingUp, Filter, Heart, MessageSquare, 
  Eye, Star, Trophy, Target, Rocket, CheckCircle, Clock,
  Users, Building, Bookmark, Share2, Download, RefreshCw,
  BarChart3, Search, ThumbsUp, ThumbsDown, AlertCircle,
  Calendar, MapPin, User, Edit, Flag, ExternalLink,
  Sparkles, Award, Zap, FileText, Globe, Trash2
} from 'lucide-react';

interface Idea {
  id: string;
  title_ar: string;
  description_ar: string;
  solution_approach?: string;
  implementation_plan?: string;
  expected_impact?: string;
  resource_requirements?: string;
  status: string;
  maturity_level: string;
  challenge_id?: string;
  focus_question_id?: string;
  innovator_id: string;
  feasibility_score: number;
  impact_score: number;
  innovation_score: number;
  alignment_score: number;
  overall_score: number;
  created_at: string;
  updated_at: string;
  innovators?: {
    id: string;
    user_id: string;
    profiles?: {
      name: string;
      name_ar: string;
      profile_image_url?: string;
    };
  };
  challenges?: {
    title_ar: string;
    sector_id?: string;
    sectors?: {
      name_ar: string;
    };
  };
}

interface DraftIdea {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  created_at: string;
  updated_at: string;
  challenge_id?: string;
  focus_question_id?: string;
}

interface Challenge {
  id: string;
  title_ar: string;
}

interface IdeaComment {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  profiles?: {
    name: string;
    name_ar: string;
    profile_image_url?: string;
  };
}

export default function IdeasPage() {
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [drafts, setDrafts] = useState<DraftIdea[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [activeTab, setActiveTab] = useState('published');
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [maturityFilter, setMaturityFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Dialog states
  const [comments, setComments] = useState<IdeaComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [bookmarkedIdeas, setBookmarkedIdeas] = useState<string[]>([]);
  const [featuredIdeas, setFeaturedIdeas] = useState<string[]>([]);

  useEffect(() => {
    if (activeTab === 'published') {
      loadIdeas();
    } else if (activeTab === 'drafts') {
      fetchDrafts();
    }
    loadBookmarks();
    loadFeaturedIdeas();
    fetchChallenges();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('ideas-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ideas' }, () => {
        if (activeTab === 'published') {
          loadIdeas();
        } else if (activeTab === 'drafts') {
          fetchDrafts();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [activeTab, statusFilter, maturityFilter, sectorFilter, sortBy, userProfile]);

  const loadIdeas = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('ideas')
        .select(`
          *,
          innovators!ideas_innovator_id_fkey(
            id,
            user_id,
            profiles!innovators_user_id_fkey(name, name_ar, profile_image_url)
          ),
          challenges!ideas_challenge_id_fkey(
            title_ar,
            sector_id,
            sectors!challenges_sector_id_fkey(name_ar)
          )
        `)
        .neq('status', 'draft');

      // Apply filters
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      if (maturityFilter !== 'all') {
        query = query.eq('maturity_level', maturityFilter);
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'highest_score':
          query = query.order('overall_score', { ascending: false });
          break;
        case 'most_popular':
          query = query.order('created_at', { ascending: false }); // Placeholder
          break;
      }

      const { data, error } = await query;

      if (error) throw error;
      setIdeas((data as any) || []);
      
    } catch (error) {
      console.error('Error loading ideas:', error);
      toast({
        title: isRTL ? 'خطأ في تحميل الأفكار' : 'Error loading ideas',
        description: isRTL ? 'حدث خطأ أثناء تحميل الأفكار' : 'An error occurred while loading ideas',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDrafts = async () => {
    if (!userProfile) return;

    try {
      setLoading(true);
      
      // Ensure innovator exists first
      const { data: innovatorId, error: innovatorError } = await supabase.rpc('ensure_innovator_exists', {
        user_uuid: userProfile.id
      });
      
      if (innovatorError) throw innovatorError;

      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('innovator_id', innovatorId)
        .eq('status', 'draft')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setDrafts(data || []);
    } catch (error) {
      console.error('Error fetching drafts:', error);
      toast({
        title: isRTL ? 'فشل في تحميل المسودات' : 'Failed to load drafts',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('id, title_ar')
        .eq('status', 'active');

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  const deleteDraft = async (draftId: string) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', draftId);

      if (error) throw error;

      setDrafts(drafts.filter(draft => draft.id !== draftId));
      toast({
        title: isRTL ? 'تم حذف المسودة بنجاح' : 'Draft deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast({
        title: isRTL ? 'فشل في حذف المسودة' : 'Failed to delete draft',
        variant: 'destructive'
      });
    }
  };

  const editDraft = (draftId: string) => {
    navigate(`/submit-idea?draft=${draftId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const loadBookmarks = async () => {
    if (!user) return;
    
    try {
      // Placeholder for bookmarks - would need to create bookmarks table
      setBookmarkedIdeas([]);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const loadFeaturedIdeas = async () => {
    try {
      // Placeholder for featured ideas logic
      setFeaturedIdeas([]);
    } catch (error) {
      console.error('Error loading featured ideas:', error);
    }
  };

  const handleViewDetails = async (idea: Idea) => {
    setSelectedIdea(idea);
    setDetailDialogOpen(true);
    
    // Load comments for this idea
    await loadIdeaComments(idea.id);
  };

  const loadIdeaComments = async (ideaId: string) => {
    try {
      const { data, error } = await supabase
        .from('idea_comments')
        .select(`
          *,
          profiles!idea_comments_author_id_fkey(name, name_ar, profile_image_url)
        `)
        .eq('idea_id', ideaId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments((data as any) || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!user || !selectedIdea || !newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('idea_comments')
        .insert({
          idea_id: selectedIdea.id,
          author_id: user.id,
          content: newComment.trim(),
          comment_type: 'general'
        });

      if (error) throw error;

      toast({
        title: isRTL ? 'تم إضافة التعليق' : 'Comment added',
        description: isRTL ? 'تم إضافة تعليقك بنجاح' : 'Your comment has been added successfully'
      });

      setNewComment('');
      await loadIdeaComments(selectedIdea.id);
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: isRTL ? 'خطأ في إضافة التعليق' : 'Error adding comment',
        variant: 'destructive'
      });
    }
  };

  const toggleBookmark = async (ideaId: string) => {
    if (!user) return;
    
    // Placeholder for bookmark functionality
    const isBookmarked = bookmarkedIdeas.includes(ideaId);
    
    if (isBookmarked) {
      setBookmarkedIdeas(prev => prev.filter(id => id !== ideaId));
    } else {
      setBookmarkedIdeas(prev => [...prev, ideaId]);
    }
    
    toast({
      title: isBookmarked ? 
        (isRTL ? 'تم إلغاء الإشارة المرجعية' : 'Bookmark removed') :
        (isRTL ? 'تم حفظ الإشارة المرجعية' : 'Bookmark saved')
    });
  };

  // Filter ideas based on search
  const getFilteredIdeas = () => {
    let filtered = [...ideas];

    if (searchQuery) {
      filtered = filtered.filter(idea =>
        idea.title_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (idea.description_ar && idea.description_ar.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  };

  const filteredIdeas = getFilteredIdeas();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'under_review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'in_development': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'implemented': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: isRTL ? 'في الانتظار' : 'Pending',
      under_review: isRTL ? 'قيد المراجعة' : 'Under Review',
      approved: isRTL ? 'موافق عليها' : 'Approved',
      rejected: isRTL ? 'مرفوضة' : 'Rejected',
      in_development: isRTL ? 'قيد التطوير' : 'In Development',
      implemented: isRTL ? 'منفذة' : 'Implemented'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getMaturityIcon = (maturity: string) => {
    switch (maturity) {
      case 'concept': return <Lightbulb className="w-4 h-4" />;
      case 'prototype': return <Zap className="w-4 h-4" />;
      case 'mvp': return <Rocket className="w-4 h-4" />;
      case 'pilot': return <Award className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const renderIdeaCard = (idea: Idea) => (
    <Card key={idea.id} className="hover:shadow-lg transition-all duration-300 hover-scale animate-fade-in group cursor-pointer">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(idea.status)}>
                {getStatusText(idea.status)}
              </Badge>
              <Badge variant="outline" className="gap-1">
                {getMaturityIcon(idea.maturity_level)}
                {idea.maturity_level}
              </Badge>
              {featuredIdeas.includes(idea.id) && (
                <Badge variant="secondary" className="gap-1 bg-yellow-100 text-yellow-800">
                  <Star className="w-3 h-3" />
                  {isRTL ? 'مميزة' : 'Featured'}
                </Badge>
              )}
            </div>
            
            <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {idea.title_ar}
            </CardTitle>
            
            <CardDescription className="text-sm line-clamp-3">
              {idea.description_ar}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(idea.id);
              }}
              className={bookmarkedIdeas.includes(idea.id) ? 'text-yellow-500' : ''}
            >
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0" onClick={() => handleViewDetails(idea)}>
        {/* Score indicators */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {isRTL ? 'النتيجة الإجمالية' : 'Overall Score'}
              </span>
              <span className="font-semibold">{idea.overall_score}/10</span>
            </div>
            <Progress value={idea.overall_score * 10} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {isRTL ? 'الابتكار' : 'Innovation'}
              </span>
              <span className="font-semibold">{idea.innovation_score}/10</span>
            </div>
            <Progress value={idea.innovation_score * 10} className="h-2" />
          </div>
        </div>

        {/* Challenge info */}
        {idea.challenges && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-muted/50 rounded-lg">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{idea.challenges.title_ar}</span>
            {idea.challenges.sectors && (
              <Badge variant="outline" className="text-xs">
                {idea.challenges.sectors.name_ar}
              </Badge>
            )}
          </div>
        )}

        {/* Meta information */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
               <AvatarImage src={idea.innovators?.profiles?.profile_image_url} />
               <AvatarFallback>
                 {(isRTL ? idea.innovators?.profiles?.name_ar : idea.innovators?.profiles?.name)?.charAt(0) || 'U'}
               </AvatarFallback>
             </Avatar>
             <span>{isRTL ? idea.innovators?.profiles?.name_ar : idea.innovators?.profiles?.name || 'Anonymous'}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(idea.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-xs">12</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs">5</span>
            </Button>
          </div>
          
          <Button 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(idea);
            }}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            {isRTL ? 'عرض التفاصيل' : 'View Details'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderDraftCard = (draft: DraftIdea) => {
    const challenge = challenges.find(c => c.id === draft.challenge_id);
    
    return (
      <Card key={draft.id} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {draft.title_ar || (isRTL ? 'فكرة بدون عنوان' : 'Untitled Idea')}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  {isRTL ? 'مسودة' : 'Draft'}
                </Badge>
                {challenge && (
                  <Badge variant="outline" className="text-xs">
                    {challenge.title_ar}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {draft.description_ar || (isRTL ? 'لا يوجد وصف' : 'No description')}
          </p>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{isRTL ? 'آخر تحديث:' : 'Last updated:'} {formatDate(draft.updated_at)}</span>
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => editDraft(draft.id)}
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Edit className="w-3 h-3 mr-1" />
              {isRTL ? 'متابعة التحرير' : 'Continue Editing'}
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {isRTL ? 'حذف المسودة' : 'Delete Draft'}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {isRTL ? 
                      'هل أنت متأكد من حذف هذه المسودة؟ لا يمكن التراجع عن هذا الإجراء.' :
                      'Are you sure you want to delete this draft? This action cannot be undone.'
                    }
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteDraft(draft.id)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {isRTL ? 'حذف' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <AppShell>
      <PageLayout
        title={isRTL ? 'الأفكار الابتكارية' : 'Innovation Ideas'}
        description={isRTL ? 'اكتشف واستكشف أحدث الأفكار الابتكارية' : 'Discover and explore the latest innovative ideas'}
        itemCount={activeTab === 'published' ? filteredIdeas.length : drafts.length}
        primaryAction={{
          label: isRTL ? 'فكرة جديدة' : 'New Idea',
          onClick: () => navigate('/submit-idea'),
          icon: <Plus className="w-4 h-4" />
        }}
        secondaryActions={
          <div className="flex items-center gap-2">
            <LayoutSelector
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
            <Button variant="outline" size="sm" onClick={() => {
              if (activeTab === 'published') {
                loadIdeas();
              } else {
                fetchDrafts();
              }
            }}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        }
        showSearch={true}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={isRTL ? 'البحث في الأفكار...' : 'Search ideas...'}
      >
        <div className="space-y-6">
          {activeTab === 'published' && (
            /* Enhanced Filters */
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? 'الحالة' : 'Status'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? 'جميع الحالات' : 'All Status'}</SelectItem>
                  <SelectItem value="pending">{isRTL ? 'في الانتظار' : 'Pending'}</SelectItem>
                  <SelectItem value="under_review">{isRTL ? 'قيد المراجعة' : 'Under Review'}</SelectItem>
                  <SelectItem value="approved">{isRTL ? 'موافق عليها' : 'Approved'}</SelectItem>
                  <SelectItem value="implemented">{isRTL ? 'منفذة' : 'Implemented'}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={maturityFilter} onValueChange={setMaturityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? 'مستوى النضج' : 'Maturity'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? 'جميع المستويات' : 'All Levels'}</SelectItem>
                  <SelectItem value="concept">{isRTL ? 'مفهوم' : 'Concept'}</SelectItem>
                  <SelectItem value="prototype">{isRTL ? 'نموذج أولي' : 'Prototype'}</SelectItem>
                  <SelectItem value="mvp">{isRTL ? 'منتج قابل للتطبيق' : 'MVP'}</SelectItem>
                  <SelectItem value="pilot">{isRTL ? 'تجريبي' : 'Pilot'}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? 'ترتيب حسب' : 'Sort by'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{isRTL ? 'الأحدث' : 'Newest'}</SelectItem>
                  <SelectItem value="oldest">{isRTL ? 'الأقدم' : 'Oldest'}</SelectItem>
                  <SelectItem value="highest_score">{isRTL ? 'أعلى نتيجة' : 'Highest Score'}</SelectItem>
                  <SelectItem value="most_popular">{isRTL ? 'الأكثر شعبية' : 'Most Popular'}</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                {isRTL ? 'تصدير' : 'Export'}
              </Button>
            </div>
          )}

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="published" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                {isRTL ? 'الأفكار المنشورة' : 'Published Ideas'}
              </TabsTrigger>
              <TabsTrigger value="drafts" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {isRTL ? 'المسودات' : 'Drafts'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="published" className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">{isRTL ? 'جاري تحميل الأفكار...' : 'Loading ideas...'}</p>
                </div>
              ) : filteredIdeas.length > 0 ? (
                <ViewLayouts viewMode={viewMode}>
                  {filteredIdeas.map(renderIdeaCard)}
                </ViewLayouts>
              ) : (
                <div className="text-center py-12">
                  <Lightbulb className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {isRTL ? 'لا توجد أفكار' : 'No ideas found'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 
                      (isRTL ? `لا توجد أفكار تطابق البحث "${searchQuery}"` : `No ideas match your search for "${searchQuery}"`) :
                      (isRTL ? 'لا توجد أفكار في الوقت الحالي' : 'No ideas available at the moment')
                    }
                  </p>
                  <Button onClick={() => navigate('/submit-idea')} className="gap-2">
                    <Plus className="w-4 h-4" />
                    {isRTL ? 'تقديم فكرة جديدة' : 'Submit New Idea'}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="drafts" className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">{isRTL ? 'جاري تحميل المسودات...' : 'Loading drafts...'}</p>
                </div>
              ) : drafts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {drafts.map(renderDraftCard)}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {isRTL ? 'لا توجد مسودات' : 'No Drafts Found'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {isRTL ? 
                        'لم تقم بحفظ أي مسودات بعد. ابدأ بإنشاء فكرة جديدة!' :
                        'You haven\'t saved any drafts yet. Start by creating a new idea!'
                      }
                    </p>
                    <Button 
                      onClick={() => navigate('/submit-idea')}
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {isRTL ? 'إنشاء فكرة جديدة' : 'Create New Idea'}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Enhanced Idea Detail Dialog */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedIdea && (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <DialogTitle className="text-2xl mb-2">{selectedIdea.title_ar}</DialogTitle>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className={getStatusColor(selectedIdea.status)}>
                          {getStatusText(selectedIdea.status)}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          {getMaturityIcon(selectedIdea.maturity_level)}
                          {selectedIdea.maturity_level}
                        </Badge>
                        {selectedIdea.challenges && (
                          <Badge variant="secondary">{selectedIdea.challenges.title_ar}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Flag className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Idea Description */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {isRTL ? 'الوصف' : 'Description'}
                    </h4>
                    <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg">{selectedIdea.description_ar}</p>
                  </div>

                  {/* Solution Details */}
                  {selectedIdea.solution_approach && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        {isRTL ? 'نهج الحل' : 'Solution Approach'}
                      </h4>
                      <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg">{selectedIdea.solution_approach}</p>
                    </div>
                  )}

                  {/* Implementation Plan */}
                  {selectedIdea.implementation_plan && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Rocket className="w-4 h-4" />
                        {isRTL ? 'خطة التنفيذ' : 'Implementation Plan'}
                      </h4>
                      <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg">{selectedIdea.implementation_plan}</p>
                    </div>
                  )}

                  {/* Expected Impact */}
                  {selectedIdea.expected_impact && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        {isRTL ? 'التأثير المتوقع' : 'Expected Impact'}
                      </h4>
                      <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg">{selectedIdea.expected_impact}</p>
                    </div>
                  )}

                  {/* Enhanced Scores */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        {isRTL ? 'نتائج التقييم' : 'Evaluation Scores'}
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>{isRTL ? 'الجدوى الفنية' : 'Technical Feasibility'}</span>
                            <span className="font-semibold">{selectedIdea.feasibility_score}/10</span>
                          </div>
                          <Progress value={selectedIdea.feasibility_score * 10} className="h-3" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>{isRTL ? 'التأثير' : 'Impact'}</span>
                            <span className="font-semibold">{selectedIdea.impact_score}/10</span>
                          </div>
                          <Progress value={selectedIdea.impact_score * 10} className="h-3" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>{isRTL ? 'الابتكار' : 'Innovation'}</span>
                            <span className="font-semibold">{selectedIdea.innovation_score}/10</span>
                          </div>
                          <Progress value={selectedIdea.innovation_score * 10} className="h-3" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>{isRTL ? 'التوافق الاستراتيجي' : 'Strategic Alignment'}</span>
                            <span className="font-semibold">{selectedIdea.alignment_score}/10</span>
                          </div>
                          <Progress value={selectedIdea.alignment_score * 10} className="h-3" />
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between text-lg mb-2">
                            <span className="font-semibold">{isRTL ? 'النتيجة الإجمالية' : 'Overall Score'}</span>
                            <span className="font-bold text-primary">{selectedIdea.overall_score}/10</span>
                          </div>
                          <Progress value={selectedIdea.overall_score * 10} className="h-4" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {isRTL ? 'معلومات المبتكر' : 'Innovator Info'}
                      </h4>
                      <div className="bg-gradient-to-br from-muted/50 to-muted/30 p-4 rounded-lg border">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="w-12 h-12">
                             <AvatarImage src={selectedIdea.innovators?.profiles?.profile_image_url} />
                             <AvatarFallback className="text-lg">
                               {(isRTL ? selectedIdea.innovators?.profiles?.name_ar : selectedIdea.innovators?.profiles?.name)?.charAt(0) || 'U'}
                             </AvatarFallback>
                           </Avatar>
                           <div>
                             <p className="font-medium text-lg">
                               {isRTL ? selectedIdea.innovators?.profiles?.name_ar : selectedIdea.innovators?.profiles?.name || 'Anonymous'}
                             </p>
                            <p className="text-sm text-muted-foreground">
                              {isRTL ? 'مبتكر' : 'Innovator'}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex justify-between items-center mb-2">
                            <span>{isRTL ? 'تاريخ التقديم:' : 'Submitted:'}</span>
                            <span>{new Date(selectedIdea.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>{isRTL ? 'آخر تحديث:' : 'Last Updated:'}</span>
                            <span>{new Date(selectedIdea.updated_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        {isRTL ? 'التعليقات' : 'Comments'} ({comments.length})
                      </h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCommentDialogOpen(true)}
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        {isRTL ? 'إضافة تعليق' : 'Add Comment'}
                      </Button>
                    </div>
                    
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {comments.length > 0 ? comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 p-4 bg-muted/50 rounded-lg border-l-4 border-primary/20">
                          <Avatar className="w-8 h-8">
                             <AvatarImage src={comment.profiles?.profile_image_url} />
                             <AvatarFallback>{(isRTL ? comment.profiles?.name_ar : comment.profiles?.name)?.charAt(0) || 'U'}</AvatarFallback>
                           </Avatar>
                           <div className="flex-1">
                             <div className="flex items-center gap-2 mb-1">
                               <span className="font-medium text-sm">{isRTL ? comment.profiles?.name_ar : comment.profiles?.name || 'Anonymous'}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>{isRTL ? 'لا توجد تعليقات بعد' : 'No comments yet'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Comment Dialog */}
        <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {isRTL ? 'إضافة تعليق' : 'Add Comment'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={isRTL ? 'اكتب تعليقك هنا...' : 'Write your comment here...'}
                rows={4}
                className="resize-none"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setCommentDialogOpen(false)}>
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button onClick={handleAddComment} disabled={!newComment.trim()} className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  {isRTL ? 'إضافة تعليق' : 'Add Comment'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </PageLayout>
    </AppShell>
  );
}
