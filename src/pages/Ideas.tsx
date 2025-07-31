import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { EnhancedIdeasHero } from '@/components/ideas/EnhancedIdeasHero';
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
import { MetricCard } from '@/components/ui/metric-card';
import { IdeaDetailDialog } from '@/components/ideas/IdeaDetailDialog';
import { IdeaTemplatesDialog } from '@/components/ideas/IdeaTemplatesDialog';
import { IdeaFiltersDialog } from '@/components/ideas/IdeaFiltersDialog';
import { TrendingIdeasWidget } from '@/components/ideas/TrendingIdeasWidget';
import { IdeaAnalyticsDashboard } from '@/components/ideas/IdeaAnalyticsDashboard';
import { IdeaNotificationCenter } from '@/components/ideas/IdeaNotificationCenter';
import { useRealTimeIdeas } from '@/hooks/useRealTimeIdeas';
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
  Sparkles, Award, Zap, FileText, Globe, Trash2,
  Flame, BookOpen, Palette, Settings, Hash, TrendingDown,
  Bell
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
  image_url?: string;
  featured?: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  innovators?: {
    id: string;
    user_id: string;
  };
  challenges?: {
    title_ar: string;
    sector_id?: string;
    sectors?: {
      name_ar: string;
    };
  };
  profile?: {
    name: string;
    name_ar: string;
    profile_image_url?: string;
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

interface IdeaTemplate {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  template_data: any;
  category: string;
}

interface PersonalMetrics {
  totalIdeas: number;
  totalViews: number;
  totalComments: number;
  successRate: number;
  trendingIdeas: number;
}

export default function IdeasPage() {
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  
  // Real-time ideas hook
  const { ideas: realtimeIdeas, loading: ideasLoading, refreshIdeas } = useRealTimeIdeas();
  
  // State management
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [drafts, setDrafts] = useState<DraftIdea[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [templates, setTemplates] = useState<IdeaTemplate[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [activeTab, setActiveTab] = useState('published');
  const [loading, setLoading] = useState(true);
  
  // Personal metrics
  const [personalMetrics, setPersonalMetrics] = useState<PersonalMetrics>({
    totalIdeas: 0,
    totalViews: 0,
    totalComments: 0,
    successRate: 0,
    trendingIdeas: 0
  });
  
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
  const [likedIdeas, setLikedIdeas] = useState<string[]>([]);
  const [featuredIdeas, setFeaturedIdeas] = useState<string[]>([]);
  const [filterState, setFilterState] = useState({
    status: [],
    maturity: [],
    sectors: [],
    challenges: [],
    scoreRange: [0, 10] as [number, number],
    dateRange: 'all',
    featured: false,
    trending: false
  });

  useEffect(() => {
    // Use real-time ideas for published tab
    if (activeTab === 'published') {
      setIdeas(realtimeIdeas);
      setLoading(ideasLoading);
    } else if (activeTab === 'drafts') {
      fetchDrafts();
    } else if (activeTab === 'analytics') {
      loadPersonalMetrics();
    }
    
    loadBookmarks();
    loadLikes();
    loadFeaturedIdeas();
    fetchChallenges();
    loadTemplates();
  }, [activeTab, realtimeIdeas, ideasLoading, statusFilter, maturityFilter, sectorFilter, sortBy, userProfile]);

  const loadIdeas = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('ideas')
        .select(`
          *,
          innovators!ideas_innovator_id_fkey(
            id,
            user_id
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
          query = query.order('like_count', { ascending: false });
          break;
        case 'trending':
          query = query.order('view_count', { ascending: false });
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

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('idea_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const loadPersonalMetrics = async () => {
    if (!userProfile) return;

    try {
      setLoading(true);
      
      // Get innovator ID
      const { data: innovatorId } = await supabase.rpc('ensure_innovator_exists', {
        user_uuid: userProfile.id
      });

      if (!innovatorId) return;

      // Get user's ideas
      const { data: userIdeas } = await supabase
        .from('ideas')
        .select('id, view_count, like_count, comment_count, status')
        .eq('innovator_id', innovatorId);

      if (userIdeas) {
        const totalViews = userIdeas.reduce((sum, idea) => sum + (idea.view_count || 0), 0);
        const totalComments = userIdeas.reduce((sum, idea) => sum + (idea.comment_count || 0), 0);
        const implementedIdeas = userIdeas.filter(idea => idea.status === 'implemented').length;
        const successRate = userIdeas.length > 0 ? (implementedIdeas / userIdeas.length) * 100 : 0;
        const trendingIdeas = userIdeas.filter(idea => (idea.view_count || 0) > 100).length;

        setPersonalMetrics({
          totalIdeas: userIdeas.length,
          totalViews,
          totalComments,
          successRate,
          trendingIdeas
        });
      }
    } catch (error) {
      console.error('Error loading personal metrics:', error);
    } finally {
      setLoading(false);
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

  const createFromTemplate = (template: IdeaTemplate) => {
    navigate(`/submit-idea?template=${template.id}`);
    setTemplateDialogOpen(false);
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
      const { data, error } = await supabase
        .from('idea_bookmarks')
        .select('idea_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setBookmarkedIdeas(data?.map(bookmark => bookmark.idea_id) || []);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const loadLikes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('idea_likes')
        .select('idea_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setLikedIdeas(data?.map(like => like.idea_id) || []);
    } catch (error) {
      console.error('Error loading likes:', error);
    }
  };

  const loadFeaturedIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('id')
        .eq('featured', true);
        
      if (error) throw error;
      setFeaturedIdeas(data?.map(idea => idea.id) || []);
    } catch (error) {
      console.error('Error loading featured ideas:', error);
    }
  };

  const handleViewDetails = async (idea: Idea) => {
    setSelectedIdea(idea);
    setDetailDialogOpen(true);
    
    // Increment view count
    await supabase
      .from('ideas')
      .update({ view_count: (idea.view_count || 0) + 1 })
      .eq('id', idea.id);
    
    // Load comments for this idea
    await loadIdeaComments(idea.id);
  };

  const loadIdeaComments = async (ideaId: string) => {
    try {
      const { data, error } = await supabase
        .from('idea_comments')
        .select(`
          *,
          profiles(name, name_ar, profile_image_url)
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

      // Update comment count
      await supabase
        .from('ideas')
        .update({ comment_count: (selectedIdea.comment_count || 0) + 1 })
        .eq('id', selectedIdea.id);

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
    
    try {
      const isBookmarked = bookmarkedIdeas.includes(ideaId);
      
      if (isBookmarked) {
        await supabase
          .from('idea_bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('idea_id', ideaId);
        setBookmarkedIdeas(prev => prev.filter(id => id !== ideaId));
      } else {
        await supabase
          .from('idea_bookmarks')
          .insert({ user_id: user.id, idea_id: ideaId });
        setBookmarkedIdeas(prev => [...prev, ideaId]);
      }
      
      toast({
        title: isBookmarked ? 
          (isRTL ? 'تم إلغاء الإشارة المرجعية' : 'Bookmark removed') :
          (isRTL ? 'تم حفظ الإشارة المرجعية' : 'Bookmark saved')
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const toggleLike = async (idea: Idea) => {
    if (!user) return;
    
    try {
      const isLiked = likedIdeas.includes(idea.id);
      
      if (isLiked) {
        await supabase
          .from('idea_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('idea_id', idea.id);
        setLikedIdeas(prev => prev.filter(id => id !== idea.id));
        
        // Update like count
        await supabase
          .from('ideas')
          .update({ like_count: Math.max(0, (idea.like_count || 0) - 1) })
          .eq('id', idea.id);
      } else {
        await supabase
          .from('idea_likes')
          .insert({ user_id: user.id, idea_id: idea.id });
        setLikedIdeas(prev => [...prev, idea.id]);
        
        // Update like count
        await supabase
          .from('ideas')
          .update({ like_count: (idea.like_count || 0) + 1 })
          .eq('id', idea.id);
      }
      
      // Refresh ideas to show updated counts
      loadIdeas();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
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
    <Card key={idea.id} className="hover:shadow-lg transition-all duration-300 hover-scale animate-fade-in group cursor-pointer overflow-hidden">
      {/* Idea Image */}
      {idea.image_url && (
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={idea.image_url} 
            alt={idea.title_ar}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 right-4 flex gap-2">
            {featuredIdeas.includes(idea.id) && (
              <Badge className="bg-yellow-500 text-white border-0">
                <Star className="w-3 h-3 mr-1" />
                {isRTL ? 'مميزة' : 'Featured'}
              </Badge>
            )}
            {idea.view_count > 100 && (
              <Badge className="bg-red-500 text-white border-0">
                <Flame className="w-3 h-3 mr-1" />
                {isRTL ? 'رائجة' : 'Trending'}
              </Badge>
            )}
          </div>
        </div>
      )}
      
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

      <CardContent className="pt-0">
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

        {/* Engagement stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{idea.view_count || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{idea.like_count || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{idea.comment_count || 0}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(idea.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className={`gap-1 ${likedIdeas.includes(idea.id) ? 'text-red-500 border-red-200' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(idea);
              }}
            >
              <Heart className={`w-4 h-4 ${likedIdeas.includes(idea.id) ? 'fill-current' : ''}`} />
              <span className="text-xs">{idea.like_count || 0}</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails(idea);
              }}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs">{idea.comment_count || 0}</span>
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
      <EnhancedIdeasHero 
        totalIdeas={personalMetrics.totalIdeas}
        publishedIdeas={ideas.filter(idea => idea.status === 'published').length}
        totalViews={personalMetrics.totalViews}
        totalLikes={personalMetrics.totalViews * 0.1}
        onCreateIdea={() => navigate('/submit-idea')}
        onShowFilters={() => setFiltersDialogOpen(true)}
        canCreateIdea={!!user}
        featuredIdea={ideas.length > 0 ? {
          id: ideas[0].id,
          title_ar: ideas[0].title_ar,
          views: ideas[0].view_count || 0,
          likes: ideas[0].like_count || 0,
          innovator: ideas[0].profile?.name_ar || 'مبدع مجهول',
          image: ideas[0].image_url
        } : undefined}
      />
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTemplateDialogOpen(true)}
              className="gap-2"
            >
              <Palette className="w-4 h-4" />
              {isRTL ? 'القوالب' : 'Templates'}
            </Button>
            <LayoutSelector
              viewMode={viewMode}
              onViewModeChange={(mode) => mode !== 'calendar' && setViewMode(mode)}
            />
            <Button variant="outline" size="sm" onClick={() => {
              if (activeTab === 'published') {
                loadIdeas();
              } else if (activeTab === 'drafts') {
                fetchDrafts();
              } else if (activeTab === 'analytics') {
                loadPersonalMetrics();
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
          {/* Personal Dashboard */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MetricCard
                title={isRTL ? 'أفكاري' : 'My Ideas'}
                value={personalMetrics.totalIdeas}
                trend={{
                  value: 12,
                  label: isRTL ? 'هذا الشهر' : 'this month',
                  direction: 'up'
                }}
                icon={<Lightbulb className="w-5 h-5" />}
              />
              <MetricCard
                title={isRTL ? 'إجمالي المشاهدات' : 'Total Views'}
                value={personalMetrics.totalViews}
                trend={{
                  value: 24,
                  label: isRTL ? 'هذا الشهر' : 'this month',
                  direction: 'up'
                }}
                icon={<Eye className="w-5 h-5" />}
              />
              <MetricCard
                title={isRTL ? 'التعليقات المستلمة' : 'Comments Received'}
                value={personalMetrics.totalComments}
                trend={{
                  value: 8,
                  label: isRTL ? 'هذا الشهر' : 'this month',
                  direction: 'up'
                }}
                icon={<MessageSquare className="w-5 h-5" />}
              />
              <MetricCard
                title={isRTL ? 'معدل النجاح' : 'Success Rate'}
                value={`${personalMetrics.successRate.toFixed(1)}%`}
                trend={{
                  value: personalMetrics.successRate > 50 ? 5 : -3,
                  label: isRTL ? 'هذا الشهر' : 'this month',
                  direction: personalMetrics.successRate > 50 ? 'up' : 'down'
                }}
                icon={<Trophy className="w-5 h-5" />}
              />
            </div>
          )}

          {/* Enhanced Filters */}
          {activeTab === 'published' && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border">
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
                  <SelectItem value="trending">{isRTL ? 'الأكثر مشاهدة' : 'Trending'}</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                {isRTL ? 'تصدير' : 'Export'}
              </Button>

              <Button variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                {isRTL ? 'المزيد' : 'More'}
              </Button>
            </div>
          )}

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="published" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                {isRTL ? 'الأفكار المنشورة' : 'Published Ideas'}
              </TabsTrigger>
              <TabsTrigger value="drafts" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {isRTL ? 'المسودات' : 'Drafts'}
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {isRTL ? 'التحليلات' : 'Analytics'}
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
                  <img 
                    src="/idea-images/innovation-lightbulb.jpg" 
                    alt="Innovation" 
                    className="w-32 h-32 mx-auto mb-4 rounded-lg object-cover opacity-50" 
                  />
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

            <TabsContent value="analytics" className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">{isRTL ? 'جاري تحميل التحليلات...' : 'Loading analytics...'}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Personal performance overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        {isRTL ? 'نظرة عامة على الأداء' : 'Performance Overview'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{personalMetrics.totalIdeas}</div>
                          <div className="text-sm text-muted-foreground">{isRTL ? 'أفكاري' : 'Ideas Published'}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{personalMetrics.totalViews}</div>
                          <div className="text-sm text-muted-foreground">{isRTL ? 'مشاهدات' : 'Views'}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{personalMetrics.totalComments}</div>
                          <div className="text-sm text-muted-foreground">{isRTL ? 'تعليقات' : 'Comments'}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{personalMetrics.trendingIdeas}</div>
                          <div className="text-sm text-muted-foreground">{isRTL ? 'أفكاري رائجة' : 'Trending Ideas'}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Enhanced Dialogs */}
          <IdeaDetailDialog 
            idea={selectedIdea}
            isOpen={detailDialogOpen}
            onOpenChange={(open) => {
              setDetailDialogOpen(open);
              if (!open) setSelectedIdea(null);
            }}
            onLike={toggleLike}
            onBookmark={toggleBookmark}
            isLiked={selectedIdea ? likedIdeas.includes(selectedIdea.id) : false}
            isBookmarked={selectedIdea ? bookmarkedIdeas.includes(selectedIdea.id) : false}
          />

        <IdeaTemplatesDialog
          isOpen={templateDialogOpen}
          onOpenChange={setTemplateDialogOpen}
          onSelectTemplate={createFromTemplate}
        />

        <IdeaFiltersDialog
          isOpen={filtersDialogOpen}
          onOpenChange={setFiltersDialogOpen}
          filters={filterState}
          onApplyFilters={setFilterState}
        />


      </PageLayout>
    </AppShell>
  );
}
