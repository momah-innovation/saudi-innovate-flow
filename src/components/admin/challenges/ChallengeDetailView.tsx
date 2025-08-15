import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { logger } from "@/utils/logger";

import { supabase } from "@/integrations/supabase/client";
import { 
  Target, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock,
  Eye,
  Settings,
  Lightbulb,
  Building,
  HelpCircle,
  BarChart3,
  Workflow,
  Edit,
  FileText,
  CheckCircle,
  AlertCircle,
  Zap
} from "lucide-react";
import { format } from "date-fns";

import { Challenge, ChallengeDetailViewProps } from "@/types/api";

interface RelatedExpert {
  id: string;
  status: string;
  role_type: string;
  experts?: {
    id: string;
    expertise_areas?: string[];
    user_id: string;
  };
}

interface RelatedPartner {
  id: string;
  status: string;
  partnership_type: string;
  partners?: {
    id: string;
    name_ar?: string;
    name?: string;
  };
}

interface FocusQuestion {
  id: string;
  question_text_ar: string;
  question_type: string;
  is_sensitive: boolean;
}

interface Event {
  id: string;
  title_ar: string;
  title_en?: string;
  event_date: string;
  status: string;
}

interface Idea {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  status: string;
  created_at: string;
  overall_score?: number;
}

interface Implementation {
  id: string;
  completion_percentage: number;
  milestones_completed?: number;
  total_milestones?: number;
  health_status?: string;
}

export function ChallengeDetailView({ 
  isOpen, 
  onClose, 
  challenge, 
  onEdit, 
  onRefresh 
}: ChallengeDetailViewProps) {
  const { toast } = useToast();
  const { t, isRTL } = useUnifiedTranslation();
  
  const [relatedData, setRelatedData] = useState<{
    experts: RelatedExpert[];
    partners: RelatedPartner[];
    focusQuestions: FocusQuestion[];
    events: Event[];
    ideas: Idea[];
    implementation: Implementation | null;
    analytics: {
      views?: number;
      submissions?: number;
      participants?: number;
      completion_rate?: number;
    };
  }>({
    experts: [],
    partners: [],
    focusQuestions: [],
    events: [],
    ideas: [],
    implementation: null,
    analytics: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (challenge && isOpen) {
      fetchRelatedData();
    }
  }, [challenge, isOpen]);

  const fetchRelatedData = async () => {
    if (!challenge) return;
    
    setLoading(true);
    try {
      const [
        expertsRes,
        partnersRes,
        focusQuestionsRes,
        eventsRes,
        ideasRes,
        implementationRes
      ] = await Promise.all([
        supabase
          .from('challenge_experts')
          .select(`
            *,
            experts:expert_id (
              id,
              expertise_areas,
              user_id
            )
          `)
          .eq('challenge_id', challenge.id),
        supabase
          .from('challenge_partners')
          .select(`
            *,
            partners:partner_id (
              id,
              name_ar,
              name
            )
          `)
          .eq('challenge_id', challenge.id),
        supabase
          .from('focus_questions')
          .select('*')
          .eq('challenge_id', challenge.id)
          .order('order_sequence'),
        supabase
          .from('events')
          .select('*')
          .eq('challenge_id', challenge.id)
          .order('event_date', { ascending: false }),
        supabase
          .from('ideas')
          .select('*')
          .eq('challenge_id', challenge.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('implementation_tracker')
          .select('*')
          .eq('challenge_id', challenge.id)
          .single()
      ]);

      setRelatedData({
        experts: expertsRes.data || [],
        partners: partnersRes.data || [],
        focusQuestions: focusQuestionsRes.data || [],
        events: eventsRes.data || [],
        ideas: ideasRes.data || [],
        implementation: implementationRes.data,
        analytics: null // Will be calculated
      });
    } catch (error) {
      logger.error('Error fetching related data', { component: 'ChallengeDetailView', action: 'fetchRelatedData', data: { challengeId: challenge.id } }, error as Error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'active': return 'default';
      case 'completed': return 'success';
      case 'cancelled': return 'destructive';
      case 'on_hold': return 'warning';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      draft: t('status.draft', 'مسودة'),
      active: t('status.active', 'نشط'),
      completed: t('status.completed', 'مكتمل'),
      cancelled: t('status.cancelled', 'ملغي'),
      on_hold: t('status.on_hold', 'معلق')
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      high: 'عالي',
      medium: 'متوسط',
      low: 'منخفض'
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  if (!challenge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold">{challenge.title_ar}</DialogTitle>
              {challenge.title_en && (
                <p className="text-lg text-muted-foreground" dir="ltr">{challenge.title_en}</p>
              )}
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(challenge.status) as 'default' | 'secondary' | 'destructive' | 'outline'}>
                  {getStatusLabel(challenge.status)}
                </Badge>
                <Badge variant={getPriorityColor(challenge.priority_level) as 'default' | 'secondary' | 'destructive' | 'outline'}>
                  {getPriorityLabel(challenge.priority_level)}
                </Badge>
                <Badge variant="outline">{challenge.challenge_type}</Badge>
                <Badge variant="outline">{challenge.sensitivity_level}</Badge>
              </div>
            </div>
            <Button onClick={() => onEdit(challenge)} size="sm">
              <Edit className="w-4 h-4 mr-2" />
              {t('challenges:detail.edit', 'تعديل')}
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <Accordion type="multiple" defaultValue={["overview", "team", "questions"]} className="space-y-2">
            
            {/* Overview */}
            <AccordionItem value="overview">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {t('challenges:detail.overview', 'نظرة عامة')}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('challenges:detail.challenge_details', 'تفاصيل التحدي')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">{t('challenges:detail.description', 'الوصف')}</h4>
                        <p className="text-sm text-muted-foreground" dir="rtl">{challenge.description_ar}</p>
                        {challenge.description_en && (
                          <>
                            <h4 className="font-semibold mb-2 mt-4">Description (English)</h4>
                            <p className="text-sm text-muted-foreground" dir="ltr">{challenge.description_en}</p>
                          </>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {challenge.start_date && (
                          <div>
                            <h4 className="font-semibold mb-1 text-sm">{t('challenges:detail.start_date', 'تاريخ البداية')}</h4>
                            <p className="text-sm flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(challenge.start_date), 'PPP')}
                            </p>
                          </div>
                        )}
                        {challenge.end_date && (
                          <div>
                            <h4 className="font-semibold mb-1 text-sm">{t('challenges:detail.end_date', 'تاريخ النهاية')}</h4>
                            <p className="text-sm flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {format(new Date(challenge.end_date), 'PPP')}
                            </p>
                          </div>
                        )}
                        {challenge.estimated_budget && (
                          <div>
                            <h4 className="font-semibold mb-1 text-sm">{t('challenges:detail.estimated_budget', 'الميزانية المقدرة')}</h4>
                            <p className="text-sm flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {challenge.estimated_budget.toLocaleString()} {t('currency', 'ريال')}
                            </p>
                          </div>
                        )}
                        {challenge.actual_budget && (
                          <div>
                            <h4 className="font-semibold mb-1 text-sm">{t('challenges:detail.actual_budget', 'الميزانية الفعلية')}</h4>
                            <p className="text-sm flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {challenge.actual_budget.toLocaleString()} {t('currency', 'ريال')}
                            </p>
                          </div>
                        )}
                      </div>

                      {challenge.vision_2030_goal && (
                        <div>
                          <h4 className="font-semibold mb-2">{t('challenges:detail.vision_2030_goal', 'هدف رؤية 2030')}</h4>
                          <p className="text-sm text-muted-foreground">{challenge.vision_2030_goal}</p>
                        </div>
                      )}

                      {challenge.kpi_alignment && (
                        <div>
                          <h4 className="font-semibold mb-2">{t('challenges:detail.kpi_alignment', 'مؤشرات الأداء')}</h4>
                          <p className="text-sm text-muted-foreground">{challenge.kpi_alignment}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Team & Experts */}
            <AccordionItem value="team">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {t('challenges:detail.team_experts', 'الفريق والخبراء')} ({relatedData.experts.length + relatedData.partners.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">الخبراء المعينون</CardTitle>
                        <CardDescription>{relatedData.experts.length} خبير</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {relatedData.experts.length > 0 ? (
                          <div className="space-y-2">
                            {relatedData.experts.map((expert: RelatedExpert) => (
                              <div key={expert.id} className="flex items-center justify-between p-2 border rounded">
                                <div>
                                  <p className="font-medium">{expert.experts?.expertise_areas?.join(', ') || 'خبير'}</p>
                                  <p className="text-sm text-muted-foreground">{expert.role_type}</p>
                                </div>
                                <Badge variant={expert.status === 'active' ? 'default' : 'secondary'}>
                                  {expert.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">لا يوجد خبراء معينون</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">الشركاء</CardTitle>
                        <CardDescription>{relatedData.partners.length} شريك</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {relatedData.partners.length > 0 ? (
                          <div className="space-y-2">
                            {relatedData.partners.map((partner: RelatedPartner) => (
                              <div key={partner.id} className="flex items-center justify-between p-2 border rounded">
                                <div>
                                  <p className="font-medium">{partner.partners?.name_ar || partner.partners?.name}</p>
                                  <p className="text-sm text-muted-foreground">{partner.partnership_type}</p>
                                </div>
                                <Badge variant={partner.status === 'active' ? 'default' : 'secondary'}>
                                  {partner.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">لا يوجد شركاء</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {challenge.collaboration_details && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">تفاصيل التعاون</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{challenge.collaboration_details}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Focus Questions */}
            <AccordionItem value="questions">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  الأسئلة المحورية ({relatedData.focusQuestions.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6">
                    {relatedData.focusQuestions.length > 0 ? (
                      <div className="space-y-4">
                        {relatedData.focusQuestions.map((question: FocusQuestion, index) => (
                          <div key={question.id} className="p-4 border rounded-lg">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{question.question_text_ar}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline">{question.question_type}</Badge>
                                  {question.is_sensitive && (
                                    <Badge variant="destructive">حساس</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">{t('challenge.no_focus_questions', 'لا توجد أسئلة محورية مرتبطة')}</p>
                    )}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Events */}
            <AccordionItem value="events">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  الفعاليات ({relatedData.events.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6">
                    {relatedData.events.length > 0 ? (
                      <div className="space-y-3">
                        {relatedData.events.map((event: Event) => (
                          <div key={event.id} className="flex items-center gap-3 p-3 border rounded">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="font-medium">{event.title_ar}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(event.event_date), 'PPP')}
                              </p>
                            </div>
                            <Badge variant="outline">{event.status}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">{t('challenge.no_related_events', 'لا توجد فعاليات مرتبطة')}</p>
                    )}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Ideas */}
            <AccordionItem value="ideas">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  الأفكار المقترحة ({relatedData.ideas.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6">
                    {relatedData.ideas.length > 0 ? (
                      <div className="space-y-3">
                        {relatedData.ideas.slice(0, 5).map((idea: Idea) => (
                          <div key={idea.id} className="flex items-center gap-3 p-3 border rounded">
                            <Lightbulb className="w-4 h-4 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="font-medium">{idea.title_ar}</p>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {idea.description_ar}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline">{idea.status}</Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                نقاط: {idea.overall_score || 0}
                              </p>
                            </div>
                          </div>
                        ))}
                        {relatedData.ideas.length > 5 && (
                          <p className="text-sm text-muted-foreground text-center pt-2">
                            وأكثر من {relatedData.ideas.length - 5} فكرة أخرى...
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">{t('challenge.no_suggested_ideas', 'لا توجد أفكار مقترحة')}</p>
                    )}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Implementation */}
            <AccordionItem value="implementation">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Workflow className="w-5 h-5" />
                  متابعة التنفيذ
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6">
                    {relatedData.implementation ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-primary">
                              {relatedData.implementation.completion_percentage || 0}%
                            </p>
                            <p className="text-sm text-muted-foreground">نسبة الإنجاز</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">
                              {relatedData.implementation.milestones_completed || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">المعالم المكتملة</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">
                              {relatedData.implementation.total_milestones || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">إجمالي المعالم</p>
                          </div>
                          <div className="text-center">
                            <Badge 
                              variant={
                                relatedData.implementation.health_status === 'on_track' ? 'default' :
                                relatedData.implementation.health_status === 'at_risk' ? 'secondary' : 'destructive'
                              }
                            >
                              {relatedData.implementation.health_status}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">حالة المشروع</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">{t('challenge.no_implementation_data', 'لا توجد بيانات تنفيذ متاحة')}</p>
                    )}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Analytics */}
            <AccordionItem value="analytics">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  تحليلات وإحصائيات
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Lightbulb className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold">{relatedData.ideas.length}</p>
                      <p className="text-sm text-muted-foreground">أفكار مقترحة</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold">{relatedData.experts.length}</p>
                      <p className="text-sm text-muted-foreground">خبراء معينون</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold">{relatedData.events.length}</p>
                      <p className="text-sm text-muted-foreground">فعاليات</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Building className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold">{relatedData.partners.length}</p>
                      <p className="text-sm text-muted-foreground">شركاء</p>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Internal Notes */}
            {challenge.internal_team_notes && (
              <AccordionItem value="notes">
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    ملاحظات الفريق الداخلي
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm">{challenge.internal_team_notes}</p>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            )}

          </Accordion>
        </ScrollArea>

        <div className="p-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              آخر تحديث: {format(new Date(challenge.updated_at), 'PPp')}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                إغلاق
              </Button>
              <Button onClick={() => onEdit(challenge)}>
                <Edit className="w-4 h-4 mr-2" />
                تعديل التحدي
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}