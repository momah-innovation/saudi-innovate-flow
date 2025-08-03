import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageSquare, Send, Heart, Flag, Pin, Reply, 
  ThumbsUp, MoreHorizontal, Edit3, Trash2, Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { challengesPageConfig } from '@/config/challengesPageConfig';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface ChallengeCommentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challenge: any;
}

export function ChallengeCommentsDialog({ 
  open, 
  onOpenChange, 
  challenge 
}: ChallengeCommentsDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && challenge) {
      fetchComments();
    }
  }, [open, challenge]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('challenge_comments')
        .select(`
          *,
          profiles:user_id (
            id,
            display_name,
            avatar_url
          )
        `)
        .eq('challenge_id', challenge.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل التعليقات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const { data, error } = await supabase
        .from('challenge_comments')
        .insert({
          challenge_id: challenge.id,
          user_id: user?.id,
          content: newComment,
          is_expert_comment: false
        })
        .select(`
          *,
          profiles:user_id (
            id,
            display_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      setComments(prev => [...prev, data]);
      setNewComment('');
      
      toast({
        title: "تم إضافة التعليق",
        description: "تم إضافة تعليقك بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إضافة التعليق",
        variant: "destructive",
      });
    }
  };

  const handleAddReply = async (parentId: string) => {
    if (!replyText.trim()) return;

    try {
      const { data, error } = await supabase
        .from('challenge_comments')
        .insert({
          challenge_id: challenge.id,
          user_id: user?.id,
          content: replyText,
          parent_comment_id: parentId,
          is_expert_comment: false
        })
        .select(`
          *,
          profiles:user_id (
            id,
            display_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      setComments(prev => [...prev, data]);
      setReplyText('');
      setReplyingTo(null);
      
      toast({
        title: "تم إضافة الرد",
        description: "تم إضافة ردك بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إضافة الرد",
        variant: "destructive",
      });
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const comment = comments.find(c => c.id === commentId);
      if (!comment) return;

      const { error } = await supabase
        .from('challenge_comments')
        .update({ likes_count: comment.likes_count + 1 })
        .eq('id', commentId);

      if (error) throw error;

      setComments(prev => prev.map(c => 
        c.id === commentId 
          ? { ...c, likes_count: c.likes_count + 1 }
          : c
      ));
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إعجاب التعليق",
        variant: "destructive",
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('challenge_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setComments(prev => prev.filter(c => c.id !== commentId));
      
      toast({
        title: "تم حذف التعليق",
        description: "تم حذف التعليق بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حذف التعليق",
        variant: "destructive",
      });
    }
  };

  const organizeComments = () => {
    const topLevel = comments.filter(c => !c.parent_comment_id);
    const replies = comments.filter(c => c.parent_comment_id);
    
    return topLevel.map(comment => ({
      ...comment,
      replies: replies.filter(r => r.parent_comment_id === comment.id)
    }));
  };

  const renderComment = (comment: any, isReply = false) => (
    <div key={comment.id} className={`space-y-3 ${isReply ? 'ml-8 pl-4 border-l-2 border-muted' : ''}`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.profiles?.profile_image_url} />
          <AvatarFallback>
            {comment.profiles?.display_name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">
              {comment.profiles?.display_name || 'مستخدم'}
            </span>
            {comment.is_expert_comment && (
              <Badge variant="secondary" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                خبير
              </Badge>
            )}
            {comment.is_pinned && (
              <Badge variant="outline" className="text-xs">
                <Pin className="h-3 w-3 mr-1" />
                مثبت
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {new Date(comment.created_at).toLocaleDateString('ar-SA')}
            </span>
          </div>
          
          <p className="text-sm">{comment.content}</p>
          
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleLikeComment(comment.id)}
              className="h-auto p-1 text-xs"
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              {comment.likes_count || 0}
            </Button>
            
            {!isReply && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setReplyingTo(comment.id)}
                className="h-auto p-1 text-xs"
              >
                <Reply className="h-3 w-3 mr-1" />
                رد
              </Button>
            )}
            
            {comment.user_id === user?.id && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteComment(comment.id)}
                className={`h-auto p-1 text-xs ${challengesPageConfig.badges.urgent.split(' ').filter(c => c.includes('text')).join(' ')} hover:text-red-700`}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                حذف
              </Button>
            )}
          </div>
          
          {replyingTo === comment.id && (
            <div className="space-y-2 mt-3">
              <Textarea
                placeholder="اكتب ردك..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={2}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleAddReply(comment.id)}
                  disabled={!replyText.trim()}
                >
                  إرسال الرد
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText('');
                  }}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {comment.replies?.map((reply: any) => renderComment(reply, true))}
    </div>
  );

  if (!challenge) return null;

  const organizedComments = organizeComments();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-w-2xl max-h-[80vh] flex flex-col", challengesPageConfig.ui.glassMorphism.heavy)}>
        <DialogHeader>
          <DialogTitle className={cn("flex items-center gap-2", challengesPageConfig.ui.colors.text.primary)}>
            <MessageSquare className={cn("h-5 w-5", challengesPageConfig.ui.colors.stats.blue)} />
            تعليقات التحدي
          </DialogTitle>
          <DialogDescription className={challengesPageConfig.ui.colors.text.secondary}>
            {challenge.title_ar}
          </DialogDescription>
        </DialogHeader>

        {/* Comments List */}
        <ScrollArea className="flex-1 px-1">
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <div className={cn("animate-spin rounded-full h-8 w-8 border-b-2 mx-auto", challengesPageConfig.ui.colors.stats.blue.replace('text-', 'border-'))}></div>
                <p className={cn("mt-2", challengesPageConfig.ui.colors.text.muted)}>جاري تحميل التعليقات...</p>
              </div>
            ) : organizedComments.length > 0 ? (
              organizedComments.map(comment => renderComment(comment))
            ) : (
              <Card className={challengesPageConfig.ui.glassMorphism.light}>
                <CardContent className="p-6 text-center">
                  <MessageSquare className={cn("h-12 w-12 mx-auto mb-3", challengesPageConfig.ui.colors.text.muted)} />
                  <p className={challengesPageConfig.ui.colors.text.muted}>لا توجد تعليقات بعد</p>
                  <p className={cn("text-sm", challengesPageConfig.ui.colors.text.muted)}>كن أول من يعلق على هذا التحدي</p>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        {/* Add Comment */}
        <div className="border-t pt-4 space-y-3 border-white/10">
          <Textarea
            placeholder="شاركنا رأيك أو اطرح سؤالاً..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className={cn("transition-all duration-200", challengesPageConfig.ui.effects.focus)}
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className={cn(
                challengesPageConfig.ui.gradients.button,
                challengesPageConfig.ui.gradients.buttonHover,
                challengesPageConfig.ui.effects.hoverScale
              )}
            >
              <Send className="h-4 w-4 mr-2" />
              إرسال التعليق
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}