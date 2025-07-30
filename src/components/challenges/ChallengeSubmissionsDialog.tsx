import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users, Calendar, Trophy, Target, Eye, ThumbsUp,
  FileText, Download, Share2, Bookmark, Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ChallengeSubmissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challenge: any;
}

export function ChallengeSubmissionsDialog({ 
  open, 
  onOpenChange, 
  challenge 
}: ChallengeSubmissionsDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (open && challenge) {
      fetchSubmissions();
    }
  }, [open, challenge]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('challenge_submissions')
        .select(`
          *,
          profiles:submitted_by (
            id,
            display_name,
            avatar_url
          )
        `)
        .eq('challenge_id', challenge.id)
        .eq('is_public', true)
        .order('score', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل المشاركات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVoteSubmission = async (submissionId: string) => {
    try {
      // This would implement voting logic
      toast({
        title: "تم التصويت",
        description: "تم تسجيل تصويتك بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في التصويت",
        variant: "destructive",
      });
    }
  };

  const handleBookmarkSubmission = async (submissionId: string) => {
    try {
      // This would implement bookmarking logic
      toast({
        title: "تم الحفظ",
        description: "تم حفظ المشاركة في مفضلتك",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ المشاركة",
        variant: "destructive",
      });
    }
  };

  const getFilteredSubmissions = () => {
    switch (activeTab) {
      case 'winners':
        return submissions.filter(s => s.status === 'winner');
      case 'top-rated':
        return submissions.filter(s => s.score && s.score >= 8);
      case 'recent':
        return submissions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      default:
        return submissions;
    }
  };

  const renderSubmissionCard = (submission: any) => (
    <Card key={submission.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={submission.profiles?.profile_image_url} />
              <AvatarFallback>
                {submission.profiles?.display_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{submission.title_ar}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {submission.profiles?.display_name || 'مستخدم'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {submission.status === 'winner' && (
              <Badge variant="default" className="gap-1">
                <Trophy className="h-3 w-3" />
                فائز
              </Badge>
            )}
            {submission.score && (
              <Badge variant="secondary">
                <Star className="h-3 w-3 mr-1" />
                {submission.score}/10
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm line-clamp-3">{submission.description_ar}</p>
        
        {submission.team_members && JSON.parse(submission.team_members).length > 0 && (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              فريق من {JSON.parse(submission.team_members).length} أعضاء
            </span>
          </div>
        )}
        
        {submission.score && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>التقييم</span>
              <span>{submission.score}/10</span>
            </div>
            <Progress value={submission.score * 10} className="h-2" />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleVoteSubmission(submission.id)}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              إعجاب
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleBookmarkSubmission(submission.id)}
            >
              <Bookmark className="h-4 w-4 mr-1" />
              حفظ
            </Button>
          </div>
          
          <div className="flex gap-1">
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-1" />
              عرض
            </Button>
            {submission.attachment_urls && submission.attachment_urls.length > 0 && (
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                تحميل
              </Button>
            )}
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          تم الإرسال في {new Date(submission.created_at).toLocaleDateString('ar-SA')}
        </div>
      </CardContent>
    </Card>
  );

  if (!challenge) return null;

  const filteredSubmissions = getFilteredSubmissions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            مشاركات التحدي
          </DialogTitle>
          <DialogDescription>
            {challenge.title_ar}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                جميع المشاركات
                <Badge variant="secondary" className="ml-2">
                  {submissions.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="winners">
                الفائزون
                <Badge variant="secondary" className="ml-2">
                  {submissions.filter(s => s.status === 'winner').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="top-rated">
                الأعلى تقييماً
                <Badge variant="secondary" className="ml-2">
                  {submissions.filter(s => s.score && s.score >= 8).length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="recent">الأحدث</TabsTrigger>
            </TabsList>

            <div className="flex-1 mt-4">
              <TabsContent value="all" className="h-full m-0">
                <ScrollArea className="h-full">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-muted-foreground mt-2">جاري تحميل المشاركات...</p>
                    </div>
                  ) : filteredSubmissions.length > 0 ? (
                    <div className="space-y-4 pb-4">
                      {filteredSubmissions.map(renderSubmissionCard)}
                    </div>
                  ) : (
                    <Card className="bg-muted/50">
                      <CardContent className="p-8 text-center">
                        <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-muted-foreground mb-2">لا توجد مشاركات عامة بعد</p>
                        <p className="text-sm text-muted-foreground">
                          كن أول من يشارك في هذا التحدي
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="winners" className="h-full m-0">
                <ScrollArea className="h-full">
                  <div className="space-y-4 pb-4">
                    {filteredSubmissions.map(renderSubmissionCard)}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="top-rated" className="h-full m-0">
                <ScrollArea className="h-full">
                  <div className="space-y-4 pb-4">
                    {filteredSubmissions.map(renderSubmissionCard)}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="recent" className="h-full m-0">
                <ScrollArea className="h-full">
                  <div className="space-y-4 pb-4">
                    {filteredSubmissions.map(renderSubmissionCard)}
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="border-t pt-4 flex justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {submissions.length} مشاركة
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              {submissions.filter(s => s.status === 'winner').length} فائز
            </div>
          </div>
          
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            مشاركة
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}