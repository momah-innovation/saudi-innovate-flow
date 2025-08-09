import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Reply, 
  ThumbsUp, 
  Pin, 
  MoreHorizontal,
  Send,
  Users,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

interface ChallengeDiscussionBoardProps {
  challengeId: string;
}

interface Discussion {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  is_pinned: boolean;
  is_expert_comment: boolean;
  parent_comment_id?: string;
  profiles?: {
    name: string;
    name_ar: string;
    profile_image_url?: string;
  } | null;
}

export const ChallengeDiscussionBoard: React.FC<ChallengeDiscussionBoardProps> = ({
  challengeId
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDiscussions();
    setupRealtimeSubscription();
  }, [challengeId]);

  const loadDiscussions = async () => {
    try {
      const { data, error } = await supabase
        .from('challenge_comments')
        .select(`
          *,
          profiles(name, name_ar, profile_image_url)
        `)
        .eq('challenge_id', challengeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiscussions((data as any[])?.filter(item => item.profiles) || []);
    } catch (error) {
      logger.error('Error loading discussions', { challengeId }, error as Error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel(`challenge_discussions:${challengeId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'challenge_comments',
          filter: `challenge_id=eq.${challengeId}`
        },
        (payload) => {
          // Add new comment to the list
          loadDiscussions(); // Reload to get profile data
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('challenge_comments')
        .insert({
          challenge_id: challengeId,
          user_id: user.id,
          content: newComment.trim(),
          is_expert_comment: false // TODO: Check if user is expert
        });

      if (error) throw error;

      setNewComment('');
      toast({
        title: 'تم إضافة التعليق',
        description: 'تم نشر تعليقك بنجاح'
      });
    } catch (error) {
      logger.error('Error submitting comment', { challengeId }, error as Error);
      toast({
        title: 'خطأ في إضافة التعليق',
        description: 'حدث خطأ أثناء نشر التعليق',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    // TODO: Implement like functionality
    toast({
      title: 'قريباً',
      description: 'خاصية الإعجاب ستكون متاحة قريباً'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    if (diffInMinutes < 1440) return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`;
    return `منذ ${Math.floor(diffInMinutes / 1440)} يوم`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">جاري تحميل النقاشات...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* New Comment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            مشاركة في النقاش
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="شارك أفكارك أو اطرح أسئلة حول التحدي..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {newComment.length}/500 حرف
            </div>
            <Button 
              onClick={handleSubmitComment} 
              disabled={!newComment.trim() || submitting}
              size="sm"
            >
              {submitting ? (
                'جاري النشر...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  نشر التعليق
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Discussion List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">النقاشات ({discussions.length})</h3>
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            عرض المشاركين النشطين
          </Button>
        </div>

        {discussions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">لا توجد نقاشات بعد</h3>
                <p className="text-muted-foreground">كن أول من يبدأ النقاش حول هذا التحدي</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <Card key={discussion.id}>
                <CardContent className="pt-6">
                  <div className="flex space-x-4 rtl:space-x-reverse">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={discussion.profiles?.profile_image_url} />
                      <AvatarFallback>
                        {discussion.profiles?.name_ar?.charAt(0) || 'ُم'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="font-medium">
                          {discussion.profiles?.name_ar || 'مستخدم'}
                        </span>
                        {discussion.is_expert_comment && (
                          <Badge variant="secondary" className="text-xs">
                            <UserCheck className="h-3 w-3 mr-1" />
                            خبير
                          </Badge>
                        )}
                        {discussion.is_pinned && (
                          <Badge variant="outline" className="text-xs">
                            <Pin className="h-3 w-3 mr-1" />
                            مثبت
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {formatTimeAgo(discussion.created_at)}
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {discussion.content}
                      </p>
                      
                      <div className="flex items-center space-x-4 rtl:space-x-reverse pt-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleLike(discussion.id)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {discussion.likes_count}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Reply className="h-4 w-4 mr-1" />
                          رد
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};