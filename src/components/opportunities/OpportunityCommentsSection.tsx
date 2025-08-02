import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useDirection } from '@/components/ui/direction-provider';
import { 
  MessageCircle, 
  Heart, 
  Reply, 
  Pin, 
  MoreHorizontal,
  Send,
  Trash2,
  Edit3
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Comment {
  id: string;
  content: string;
  user_id: string;
  parent_comment_id?: string;
  is_public: boolean;
  is_pinned: boolean;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

interface OpportunityCommentsSectionProps {
  opportunityId: string;
}

export const OpportunityCommentsSection = ({ opportunityId }: OpportunityCommentsSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isRTL } = useDirection();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [opportunityId]);

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunity_comments')
        .select('*')
        .eq('opportunity_id', opportunityId)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async () => {
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('opportunity_comments')
        .insert({
          opportunity_id: opportunityId,
          user_id: user.id,
          content: newComment.trim(),
          parent_comment_id: replyTo,
          is_public: true
        });

      if (error) throw error;

      setNewComment('');
      setReplyTo(null);
      loadComments();
      
      toast({
        title: isRTL ? 'تم إضافة التعليق' : 'Comment Added',
        description: isRTL ? 'تم إضافة تعليقك بنجاح' : 'Your comment has been added successfully',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في إضافة التعليق' : 'Failed to add comment',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('opportunity_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      loadComments();
      toast({
        title: isRTL ? 'تم حذف التعليق' : 'Comment Deleted',
        description: isRTL ? 'تم حذف تعليقك بنجاح' : 'Your comment has been deleted',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في حذف التعليق' : 'Failed to delete comment',
        variant: 'destructive',
      });
    }
  };

  const likeComment = async (commentId: string) => {
    // This would require a separate likes table for comments
    // For now, just increment the count locally as a placeholder
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes_count: comment.likes_count + 1 }
        : comment
    ));
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return isRTL ? 'الآن' : 'now';
    if (diffInHours < 24) return isRTL ? `منذ ${diffInHours} ساعة` : `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return isRTL ? `منذ ${diffInDays} يوم` : `${diffInDays}d ago`;
  };

  const getInitials = (userId: string) => {
    return userId.substring(0, 2).toUpperCase();
  };

  const mainComments = comments.filter(comment => !comment.parent_comment_id);
  const getReplies = (parentId: string) => comments.filter(comment => comment.parent_comment_id === parentId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          {isRTL ? 'التعليقات' : 'Comments'}
          <Badge variant="secondary">{comments.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comment Input */}
        {user && (
          <div className="space-y-3">
            {replyTo && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Reply className="w-4 h-4" />
                {isRTL ? 'الرد على التعليق' : 'Replying to comment'}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyTo(null)}
                  className="h-auto p-0 text-blue-600 hover:text-blue-800"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Button>
              </div>
            )}
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback>{getInitials(user.id)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder={isRTL ? 'اكتب تعليقك...' : 'Write your comment...'}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={submitComment}
                    disabled={!newComment.trim() || submitting}
                    size="sm"
                  >
                    <Send className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {submitting ? (isRTL ? 'جارٍ الإرسال...' : 'Posting...') : (isRTL ? 'إرسال' : 'Post')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comments List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                  <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {mainComments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>{isRTL ? 'لا توجد تعليقات بعد' : 'No comments yet'}</p>
                <p className="text-sm">{isRTL ? 'كن أول من يعلق على هذه الفرصة' : 'Be the first to comment on this opportunity'}</p>
              </div>
            ) : (
              mainComments.map(comment => (
                <div key={comment.id} className="space-y-3">
                  {/* Main Comment */}
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{getInitials(comment.user_id)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">User {comment.user_id.substring(0, 8)}</span>
                            <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.created_at)}</span>
                            {comment.is_pinned && (
                              <Badge variant="secondary" className="text-xs">
                                <Pin className="w-3 h-3 mr-1" />
                                {isRTL ? 'مثبت' : 'Pinned'}
                              </Badge>
                            )}
                          </div>
                          {user?.id === comment.user_id && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-auto p-1">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => deleteComment(comment.id)}>
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  {isRTL ? 'حذف' : 'Delete'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      
                      {/* Comment Actions */}
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => likeComment(comment.id)}
                          className="h-auto p-0 text-muted-foreground hover:text-red-500"
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          {comment.likes_count || 0}
                        </Button>
                        {user && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyTo(comment.id)}
                            className="h-auto p-0 text-muted-foreground hover:text-blue-500"
                          >
                            <Reply className="w-4 h-4 mr-1" />
                            {isRTL ? 'رد' : 'Reply'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {getReplies(comment.id).map(reply => (
                    <div key={reply.id} className="flex gap-3 ml-8">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">{getInitials(reply.user_id)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted/50 rounded-lg p-2">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-xs">User {reply.user_id.substring(0, 8)}</span>
                              <span className="text-xs text-muted-foreground">{formatTimeAgo(reply.created_at)}</span>
                            </div>
                            {user?.id === reply.user_id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteComment(reply.id)}
                                className="h-auto p-1 text-muted-foreground hover:text-red-500"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                          <p className="text-xs">{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};