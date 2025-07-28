import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/integrations/supabase/client";
import { 
  HelpCircle, 
  Target, 
  Hash,
  Shield,
  Calendar,
  Edit,
  Users,
  Eye
} from "lucide-react";
import { format } from "date-fns";

interface Challenge {
  id: string;
  title_ar: string;
  status: string;
  sensitivity_level: string;
}

interface FocusQuestion {
  id: string;
  question_text_ar: string;
  question_type: string;
  is_sensitive: boolean;
  order_sequence: number;
  challenge_id?: string;
  challenge?: Challenge;
  created_at: string;
  updated_at: string;
}

interface FocusQuestionDetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  question: FocusQuestion | null;
  onEdit: (question: FocusQuestion) => void;
  onRefresh: () => void;
}

export function FocusQuestionDetailView({ 
  isOpen, 
  onClose, 
  question, 
  onEdit, 
  onRefresh 
}: FocusQuestionDetailViewProps) {
  const { toast } = useToast();
  const { t, isRTL } = useTranslation();
  
  const [relatedData, setRelatedData] = useState({
    ideas: [],
    events: [],
    analytics: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (question && isOpen) {
      fetchRelatedData();
    }
  }, [question, isOpen]);

  const fetchRelatedData = async () => {
    if (!question) return;
    
    setLoading(true);
    try {
      const [
        ideasRes,
        eventsRes
      ] = await Promise.all([
        supabase
          .from('ideas')
          .select('*')
          .eq('focus_question_id', question.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('event_focus_question_links')
          .select(`
            *,
            events:event_id (
              id,
              title_ar,
              event_date,
              status
            )
          `)
          .eq('focus_question_id', question.id)
      ]);

      setRelatedData({
        ideas: ideasRes.data || [],
        events: eventsRes.data || [],
        analytics: null // Will be calculated
      });
    } catch (error) {
      console.error('Error fetching related data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      open_ended: 'سؤال مفتوح',
      multiple_choice: 'متعدد الخيارات',
      yes_no: 'نعم/لا',
      rating: 'تقييم',
      ranking: 'ترتيب'
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (!question) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold">{question.question_text_ar}</DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{getTypeLabel(question.question_type)}</Badge>
                {question.is_sensitive && (
                  <Badge variant="destructive">حساس</Badge>
                )}
                {question.challenge ? (
                  <Badge variant="outline">مرتبط بتحدي</Badge>
                ) : (
                  <Badge variant="secondary">سؤال عام</Badge>
                )}
              </div>
            </div>
            <Button onClick={() => onEdit(question)} size="sm">
              <Edit className="w-4 h-4 mr-2" />
              تعديل
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 pb-6">
            
            {/* Question Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  تفاصيل السؤال
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">نوع السؤال</h4>
                    <p className="text-sm text-muted-foreground">{getTypeLabel(question.question_type)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">ترتيب السؤال</h4>
                    <p className="text-sm flex items-center gap-1">
                      <Hash className="w-4 h-4" />
                      {question.order_sequence}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">مستوى الحساسية</h4>
                    <p className="text-sm flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      {question.is_sensitive ? 'حساس' : 'عادي'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">تاريخ الإنشاء</h4>
                    <p className="text-sm flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(question.created_at), 'PPP')}
                    </p>
                  </div>
                </div>

                {question.challenge && (
                  <div>
                    <h4 className="font-semibold mb-2">التحدي المرتبط</h4>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span className="font-medium">{question.challenge.title_ar}</span>
                        <Badge variant="outline">{question.challenge.status}</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Related Ideas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  الأفكار المرتبطة ({relatedData.ideas.length})
                </CardTitle>
                <CardDescription>الأفكار التي تم تقديمها استجابة لهذا السؤال</CardDescription>
              </CardHeader>
              <CardContent>
                {relatedData.ideas.length > 0 ? (
                  <div className="space-y-3">
                    {relatedData.ideas.map((idea: any) => (
                      <div key={idea.id} className="flex items-center gap-3 p-3 border rounded">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium">{idea.title_ar}</p>
                          <p className="text-sm text-muted-foreground">{idea.status}</p>
                        </div>
                        <Badge variant={idea.status === 'approved' ? 'default' : 'secondary'}>
                          {idea.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">لا توجد أفكار مرتبطة بهذا السؤال</p>
                )}
              </CardContent>
            </Card>

            {/* Related Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  الفعاليات المرتبطة ({relatedData.events.length})
                </CardTitle>
                <CardDescription>الفعاليات التي تتضمن هذا السؤال</CardDescription>
              </CardHeader>
              <CardContent>
                {relatedData.events.length > 0 ? (
                  <div className="space-y-3">
                    {relatedData.events.map((eventLink: any) => (
                      <div key={eventLink.id} className="flex items-center gap-3 p-3 border rounded">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium">{eventLink.events?.title_ar}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(eventLink.events?.event_date), 'PPP')}
                          </p>
                        </div>
                        <Badge variant={eventLink.events?.status === 'completed' ? 'default' : 'secondary'}>
                          {eventLink.events?.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">لا توجد فعاليات مرتبطة بهذا السؤال</p>
                )}
              </CardContent>
            </Card>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}