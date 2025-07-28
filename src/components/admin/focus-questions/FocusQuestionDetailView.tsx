import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  Eye,
  ChevronDown,
  ChevronRight,
  BarChart3,
  MessageSquare,
  FileText,
  Activity,
  Clock,
  User
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
    responses: [],
    submissions: [],
    analytics: {
      totalResponses: 0,
      averageRating: 0,
      completionRate: 0,
      lastActivity: null
    }
  });
  const [loading, setLoading] = useState(false);
  
  // Collapsible sections state
  const [openSections, setOpenSections] = useState({
    details: true,
    ideas: true,
    events: true,
    responses: true,
    analytics: true
  });

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
        // Get ideas related to this focus question
        supabase
          .from('ideas')
          .select(`
            id,
            title_ar,
            description_ar,
            status,
            created_at,
            innovator_id
          `)
          .eq('focus_question_id', question.id)
          .order('created_at', { ascending: false }),
        
        // Get events that include this focus question
        supabase
          .from('event_focus_question_links')
          .select(`
            id,
            events:event_id (
              id,
              title_ar,
              description_ar,
              event_date,
              status,
              format,
              location,
              max_participants
            )
          `)
          .eq('focus_question_id', question.id)
      ]);

      // Mock responses and analytics for now since tables might not exist
      const mockResponses: any[] = [];
      const analytics = {
        totalResponses: mockResponses.length,
        averageRating: 0,
        completionRate: ideasRes.data?.length || 0 > 0 ? 75 : 0,
        lastActivity: ideasRes.data?.length || 0 > 0 
          ? ideasRes.data![0].created_at 
          : question.created_at
      };

      setRelatedData({
        ideas: ideasRes.data || [],
        events: eventsRes.data || [],
        responses: mockResponses,
        submissions: [],
        analytics
      });
    } catch (error) {
      console.error('Error fetching related data:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل البيانات المرتبطة",
        variant: "destructive"
      });
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

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const CollapsibleSection = ({ 
    id, 
    title, 
    icon: Icon, 
    count, 
    children 
  }: { 
    id: keyof typeof openSections; 
    title: string; 
    icon: any; 
    count?: number; 
    children: React.ReactNode; 
  }) => (
    <Collapsible open={openSections[id]} onOpenChange={() => toggleSection(id)}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                {title}
                {count !== undefined && (
                  <Badge variant="secondary" className="ml-2">{count}</Badge>
                )}
              </div>
              {openSections[id] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );

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
            
            {/* Analytics Overview */}
            <CollapsibleSection 
              id="analytics" 
              title="إحصائيات السؤال" 
              icon={BarChart3}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{relatedData.analytics.totalResponses}</div>
                  <div className="text-sm text-muted-foreground">إجمالي الردود</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{relatedData.analytics.averageRating.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">متوسط التقييم</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{relatedData.analytics.completionRate}%</div>
                  <div className="text-sm text-muted-foreground">معدل الإكمال</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    <Clock className="w-6 h-6 mx-auto mb-1" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {relatedData.analytics.lastActivity 
                      ? format(new Date(relatedData.analytics.lastActivity), 'dd/MM/yyyy')
                      : 'لا يوجد نشاط'
                    }
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Question Details */}
            <CollapsibleSection 
              id="details" 
              title="تفاصيل السؤال" 
              icon={HelpCircle}
            >
              <div className="space-y-4">
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
                      {format(new Date(question.created_at), 'dd/MM/yyyy')}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">نص السؤال الكامل</h4>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-base leading-relaxed" dir="rtl">{question.question_text_ar}</p>
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

                <div>
                  <h4 className="font-semibold mb-2">تواريخ التعديل</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>تاريخ الإنشاء: {format(new Date(question.created_at), 'PPp')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      <span>آخر تحديث: {format(new Date(question.updated_at), 'PPp')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Related Ideas */}
            <CollapsibleSection 
              id="ideas" 
              title="الأفكار المرتبطة" 
              icon={Users}
              count={relatedData.ideas.length}
            >
              {relatedData.ideas.length > 0 ? (
                <div className="space-y-3">
                  {relatedData.ideas.map((idea: any) => (
                    <div key={idea.id} className="flex items-start gap-3 p-4 border rounded-lg">
                      <Eye className="w-5 h-5 text-muted-foreground mt-1" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <h5 className="font-medium">{idea.title_ar}</h5>
                          <Badge variant={idea.status === 'approved' ? 'default' : 'secondary'}>
                            {idea.status}
                          </Badge>
                        </div>
                        {idea.description_ar && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{idea.description_ar}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            مبتكر
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(idea.created_at), 'dd/MM/yyyy')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">لا توجد أفكار مرتبطة بهذا السؤال</p>
                </div>
              )}
            </CollapsibleSection>

            {/* Responses */}
            <CollapsibleSection 
              id="responses" 
              title="الردود والاستجابات" 
              icon={MessageSquare}
              count={relatedData.responses.length}
            >
              {relatedData.responses.length > 0 ? (
                <div className="space-y-3">
                  {relatedData.responses.slice(0, 10).map((response: any) => (
                    <div key={response.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="text-sm font-medium">مستخدم</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">5/5</Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(), 'dd/MM/yyyy')}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm bg-muted/30 p-3 rounded" dir="rtl">
                        نموذج رد على السؤال المحوري. سيتم عرض الردود الفعلية هنا عند توفرها.
                      </p>
                    </div>
                  ))}
                  {relatedData.responses.length > 10 && (
                    <p className="text-center text-sm text-muted-foreground">
                      +{relatedData.responses.length - 10} ردود إضافية
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">لا توجد ردود على هذا السؤال</p>
                </div>
              )}
            </CollapsibleSection>

            {/* Related Events */}
            <CollapsibleSection 
              id="events" 
              title="الفعاليات المرتبطة" 
              icon={Calendar}
              count={relatedData.events.length}
            >
              {relatedData.events.length > 0 ? (
                <div className="space-y-3">
                  {relatedData.events.map((eventLink: any) => (
                    <div key={eventLink.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium">{eventLink.events?.title_ar}</h5>
                          {eventLink.events?.description_ar && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {eventLink.events.description_ar}
                            </p>
                          )}
                        </div>
                        <Badge variant={eventLink.events?.status === 'completed' ? 'default' : 'secondary'}>
                          {eventLink.events?.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(eventLink.events?.event_date), 'PPP')}
                        </div>
                        {eventLink.events?.format && (
                          <div className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            {eventLink.events.format}
                          </div>
                        )}
                        {eventLink.events?.location && (
                          <div className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {eventLink.events.location}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">لا توجد فعاليات مرتبطة بهذا السؤال</p>
                </div>
              )}
            </CollapsibleSection>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}