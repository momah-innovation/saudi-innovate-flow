import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useDirection } from '@/components/ui/direction-provider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Heart, MessageSquare, Share2, Flag, Eye, Star, Trophy, Target, 
  Rocket, Zap, FileText, BarChart3, User, Plus, Bookmark,
  Calendar, MapPin, ExternalLink, ThumbsUp, CheckCircle,
  Lightbulb, Award, Sparkles, Users
 } from 'lucide-react';
import { logger } from '@/utils/logger';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';
import { CollaborationProvider } from '@/contexts/CollaborationContext';

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

interface IdeaDetailDialogProps {
  idea: Idea | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLike?: (idea: Idea) => void;
  onBookmark?: (ideaId: string) => void;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export function IdeaDetailDialog({ 
  idea, 
  isOpen, 
  onOpenChange, 
  onLike, 
  onBookmark,
  isLiked = false,
  isBookmarked = false
}: IdeaDetailDialogProps) {
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const { user } = useAuth();
  const [comments, setComments] = useState<IdeaComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    if (idea && isOpen) {
      loadComments();
      incrementViewCount();
    }
  }, [idea, isOpen]);

  const loadComments = async () => {
    if (!idea) return;
    
    try {
      const { data, error } = await supabase
        .from('idea_comments')
        .select(`
          *,
          profiles(name, name_ar, profile_image_url)
        `)
        .eq('idea_id', idea.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      logger.error('Error loading comments', { component: 'IdeaDetailDialog', action: 'loadComments', ideaId: idea.id }, error as Error);
    }
  };

  const incrementViewCount = async () => {
    if (!idea) return;
    
    try {
      await supabase
        .from('ideas')
        .update({ view_count: (idea.view_count || 0) + 1 })
        .eq('id', idea.id);
    } catch (error) {
      logger.error('Error incrementing view count', { component: 'IdeaDetailDialog', action: 'incrementViewCount', ideaId: idea.id }, error as Error);
    }
  };

  const handleAddComment = async () => {
    if (!user || !idea || !newComment.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('idea_comments')
        .insert({
          idea_id: idea.id,
          author_id: user.id,
          content: newComment.trim(),
          comment_type: 'general'
        });

      if (error) throw error;

      // Update comment count
      await supabase
        .from('ideas')
        .update({ comment_count: (idea.comment_count || 0) + 1 })
        .eq('id', idea.id);

      toast({
        title: isRTL ? 'تم إضافة التعليق' : 'Comment added',
        description: isRTL ? 'تم إضافة تعليقك بنجاح' : 'Your comment has been added successfully'
      });

      setNewComment('');
      setShowCommentForm(false);
      await loadComments();
    } catch (error) {
      logger.error('Error adding comment', { component: 'IdeaDetailDialog', action: 'handleAddComment', ideaId: idea.id }, error as Error);
      toast({
        title: isRTL ? 'خطأ في إضافة التعليق' : 'Error adding comment',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!idea) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: idea.title_ar,
          text: idea.description_ar,
          url: window.location.href
        });
      } catch (error) {
        // Share cancelled or failed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: isRTL ? 'تم نسخ الرابط' : 'Link copied',
        description: isRTL ? 'تم نسخ رابط الفكرة إلى الحافظة' : 'Idea link copied to clipboard'
      });
    }
  };

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

  if (!idea) return null;

  return (
    <CollaborationProvider>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl mb-3 line-clamp-2">
                {idea.title_ar}
              </DialogTitle>
              <div className="flex items-center flex-wrap gap-2 mb-4">
                <Badge className={getStatusColor(idea.status)}>
                  {getStatusText(idea.status)}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  {getMaturityIcon(idea.maturity_level)}
                  {idea.maturity_level}
                </Badge>
                {idea.featured && (
                  <Badge className="bg-yellow-500 text-white border-0">
                    <Star className="w-3 h-3 mr-1" />
                    {isRTL ? 'مميزة' : 'Featured'}
                  </Badge>
                )}
                {idea.challenges && (
                  <Badge variant="secondary">{idea.challenges.title_ar}</Badge>
                )}
                {idea.challenges?.sectors && (
                  <Badge variant="outline" className="text-xs">
                    {idea.challenges.sectors.name_ar}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onBookmark?.(idea.id)}
                className={isBookmarked ? 'text-yellow-500 border-yellow-200' : ''}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Flag className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 px-1">
          {/* Hero Image */}
          {idea.image_url && (
            <div className="relative h-64 w-full overflow-hidden rounded-lg">
              <img 
                src={idea.image_url} 
                alt={idea.title_ar}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4 text-sm">
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
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => onLike?.(idea)}
                    className={`gap-1 ${isLiked ? 'text-red-500' : ''}`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    {isRTL ? 'إعجاب' : 'Like'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {isRTL ? 'الوصف' : 'Description'}
                </h4>
                <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg leading-relaxed">
                  {idea.description_ar}
                </p>
              </div>

              {/* Solution Approach */}
              {idea.solution_approach && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    {isRTL ? 'نهج الحل' : 'Solution Approach'}
                  </h4>
                  <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg leading-relaxed">
                    {idea.solution_approach}
                  </p>
                </div>
              )}

              {/* Implementation Plan */}
              {idea.implementation_plan && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Rocket className="w-4 h-4" />
                    {isRTL ? 'خطة التنفيذ' : 'Implementation Plan'}
                  </h4>
                  <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg leading-relaxed">
                    {idea.implementation_plan}
                  </p>
                </div>
              )}

              {/* Expected Impact */}
              {idea.expected_impact && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    {isRTL ? 'التأثير المتوقع' : 'Expected Impact'}
                  </h4>
                  <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg leading-relaxed">
                    {idea.expected_impact}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Collaboration Workspace */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {isRTL ? 'مساحة التعاون' : 'Collaboration Space'}
                </h4>
                <WorkspaceCollaboration
                  workspaceType="user"
                  entityId={idea.id}
                  showWidget={true}
                  showPresence={true}
                  showActivity={false}
                />
              </div>

              {/* Evaluation Scores */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  {isRTL ? 'نتائج التقييم' : 'Evaluation Scores'}
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{isRTL ? 'الجدوى الفنية' : 'Technical Feasibility'}</span>
                      <span className="font-semibold">{idea.feasibility_score}/10</span>
                    </div>
                    <Progress value={idea.feasibility_score * 10} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{isRTL ? 'التأثير' : 'Impact'}</span>
                      <span className="font-semibold">{idea.impact_score}/10</span>
                    </div>
                    <Progress value={idea.impact_score * 10} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{isRTL ? 'الابتكار' : 'Innovation'}</span>
                      <span className="font-semibold">{idea.innovation_score}/10</span>
                    </div>
                    <Progress value={idea.innovation_score * 10} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{isRTL ? 'التوافق الاستراتيجي' : 'Strategic Alignment'}</span>
                      <span className="font-semibold">{idea.alignment_score}/10</span>
                    </div>
                    <Progress value={idea.alignment_score * 10} className="h-3" />
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg mb-2">
                      <span className="font-semibold">{isRTL ? 'النتيجة الإجمالية' : 'Overall Score'}</span>
                      <span className="font-bold text-primary">{idea.overall_score}/10</span>
                    </div>
                    <Progress value={idea.overall_score * 10} className="h-4" />
                  </div>
                </div>
              </div>

              {/* Innovator Info */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {isRTL ? 'معلومات المبتكر' : 'Innovator Info'}
                </h4>
                <div className="bg-gradient-to-br from-muted/50 to-muted/30 p-4 rounded-lg border">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={idea.profile?.profile_image_url} />
                      <AvatarFallback className="text-lg">
                        {(isRTL ? idea.profile?.name_ar : idea.profile?.name)?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-lg">
                        {isRTL ? idea.profile?.name_ar : idea.profile?.name || 'Anonymous'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? 'مبتكر' : 'Innovator'}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div className="flex justify-between items-center">
                      <span>{isRTL ? 'تاريخ التقديم:' : 'Submitted:'}</span>
                      <span>{new Date(idea.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{isRTL ? 'آخر تحديث:' : 'Last Updated:'}</span>
                      <span>{new Date(idea.updated_at).toLocaleDateString()}</span>
                    </div>
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
                onClick={() => setShowCommentForm(!showCommentForm)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                {isRTL ? 'إضافة تعليق' : 'Add Comment'}
              </Button>
            </div>

            {/* Comment Form */}
            {showCommentForm && (
              <div className="mb-6 p-4 bg-muted/30 rounded-lg border">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={isRTL ? 'اكتب تعليقك هنا...' : 'Write your comment here...'}
                  rows={3}
                  className="resize-none mb-3"
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setShowCommentForm(false);
                      setNewComment('');
                    }}
                  >
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleAddComment} 
                    disabled={!newComment.trim() || loading}
                    className="gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {loading ? (isRTL ? 'جاري الإضافة...' : 'Adding...') : (isRTL ? 'إضافة تعليق' : 'Add Comment')}
                  </Button>
                </div>
              </div>
            )}
            
            {/* Comments List */}
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {comments.length > 0 ? comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-4 bg-muted/30 rounded-lg border-l-4 border-primary/20">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={comment.profiles?.profile_image_url} />
                    <AvatarFallback>
                      {(isRTL ? comment.profiles?.name_ar : comment.profiles?.name)?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">
                        {isRTL ? comment.profiles?.name_ar : comment.profiles?.name || 'Anonymous'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg mb-2">{isRTL ? 'لا توجد تعليقات بعد' : 'No comments yet'}</p>
                  <p className="text-sm">{isRTL ? 'كن أول من يضيف تعليقاً على هذه الفكرة' : 'Be the first to comment on this idea'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </CollaborationProvider>
  );
}