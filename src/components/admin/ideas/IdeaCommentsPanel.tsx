import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Send, Reply, Edit, Trash, Flag } from "lucide-react";
import { format } from "date-fns";

interface Comment {
  id: string;
  content: string;
  author_id: string;
  parent_comment_id?: string;
  is_internal: boolean;
  comment_type: string;
  created_at: string;
  updated_at: string;
  author?: {
    name: string;
    email: string;
    profile_image_url?: string;
  };
  replies?: Comment[];
}

interface IdeaCommentsPanelProps {
  ideaId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function IdeaCommentsPanel({ ideaId, isOpen, onClose }: IdeaCommentsPanelProps) {
  const { toast } = useToast();
  const { t, isRTL } = useTranslation();
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && ideaId) {
      fetchComments();
    }
  }, [isOpen, ideaId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('idea_comments')
        .select(`
          *,
          profiles!author_id(name, name_ar, profile_image_url)
        `)
        .eq('idea_id', ideaId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Organize comments into tree structure
      const commentMap = new Map();
      const rootComments: Comment[] = [];

      // First pass: create all comments
      data.forEach((comment: any) => {
        const formattedComment: Comment = {
          ...comment,
          author: comment.author?.[0] || { name: 'مستخدم', email: '' },
          replies: []
        };
        commentMap.set(comment.id, formattedComment);
      });

      // Second pass: organize into tree
      data.forEach((comment: any) => {
        const formattedComment = commentMap.get(comment.id);
        if (comment.parent_comment_id) {
          const parent = commentMap.get(comment.parent_comment_id);
          if (parent) {
            parent.replies!.push(formattedComment);
          }
        } else {
          rootComments.push(formattedComment);
        }
      });

      setComments(rootComments);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل التعليقات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('غير مصرح للمستخدم');

      const { error } = await supabase
        .from('idea_comments')
        .insert({
          idea_id: ideaId,
          author_id: user.id,
          content: newComment.trim(),
          is_internal: isInternal,
          comment_type: 'general'
        });

      if (error) throw error;

      setNewComment("");
      setIsInternal(false);
      await fetchComments();
      
      toast({
        title: "تم إضافة التعليق",
        description: "تم إضافة تعليقك بنجاح"
      });
    } catch (error: any) {
      console.error('Error submitting comment:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة التعليق",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('غير مصرح للمستخدم');

      const { error } = await supabase
        .from('idea_comments')
        .insert({
          idea_id: ideaId,
          author_id: user.id,
          parent_comment_id: parentId,
          content: replyContent.trim(),
          is_internal: false,
          comment_type: 'reply'
        });

      if (error) throw error;

      setReplyContent("");
      setReplyingTo(null);
      await fetchComments();
      
      toast({
        title: "تم إضافة الرد",
        description: "تم إضافة ردك بنجاح"
      });
    } catch (error: any) {
      console.error('Error submitting reply:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة الرد",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderComment = (comment: Comment, level: number = 0) => (
    <div key={comment.id} className={`${level > 0 ? 'mr-6 border-r pr-4' : ''} mb-4`}>
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={comment.author?.profile_image_url} />
          <AvatarFallback>
            {comment.author?.name?.charAt(0) || 'م'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.author?.name || 'مستخدم'}</span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(comment.created_at), 'dd/MM/yyyy HH:mm')}
            </span>
            {comment.is_internal && (
              <Badge variant="secondary" className="text-xs">داخلي</Badge>
            )}
            {comment.comment_type === 'reply' && (
              <Badge variant="outline" className="text-xs">رد</Badge>
            )}
          </div>
          
          <p className="text-sm mb-2" dir="rtl">{comment.content}</p>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(comment.id)}
              className="text-xs h-auto p-1"
            >
              <Reply className="w-3 h-3 ml-1" />
              رد
            </Button>
          </div>
          
          {/* Reply form */}
          {replyingTo === comment.id && (
            <div className="mt-3 p-3 bg-muted rounded-lg">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="اكتب ردك..."
                rows={2}
                dir="rtl"
                className="mb-2"
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={!replyContent.trim() || submitting}
                >
                  <Send className="w-4 h-4 ml-1" />
                  إرسال الرد
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent("");
                  }}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          )}
          
          {/* Render replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map(reply => renderComment(reply, level + 1))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <Card className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          التعليقات والمناقشات
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* New comment form */}
        <div className="space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="اكتب تعليقك..."
            rows={3}
            dir="rtl"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                />
                تعليق داخلي (للفريق فقط)
              </label>
            </div>
            
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || submitting}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              إرسال التعليق
            </Button>
          </div>
        </div>
        
        <Separator />
        
        {/* Comments list */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">جارٍ تحميل التعليقات...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">لا توجد تعليقات بعد</p>
              <p className="text-xs text-muted-foreground">كن أول من يعلق على هذه الفكرة</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map(comment => renderComment(comment))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}