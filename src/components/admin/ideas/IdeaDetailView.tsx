import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useAppTranslation";
import { supabase } from "@/integrations/supabase/client";
import { 
  Lightbulb, 
  Target, 
  Star,
  TrendingUp,
  Calendar,
  Edit,
  User,
  ChevronDown,
  ChevronRight,
  BarChart3,
  MessageSquare,
  FileText,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import type { IdeaDetailView, IdeaDetailViewProps } from "@/types/api";

export function IdeaDetailView({ 
  isOpen, 
  onClose, 
  idea, 
  onEdit, 
  onRefresh 
}: IdeaDetailViewProps) {
  const { toast } = useToast();
  const { t, isRTL } = useTranslation();
  
  const [relatedData, setRelatedData] = useState({
    evaluations: [],
    analytics: {
      totalEvaluations: 0,
      averageScore: 0,
      lastEvaluation: null,
      evaluationStatus: 'pending'
    }
  });
  const [loading, setLoading] = useState(false);
  
  // Collapsible sections state
  const [openSections, setOpenSections] = useState({
    details: true,
    content: true,
    evaluations: true,
    analytics: true
  });

  useEffect(() => {
    if (idea && isOpen) {
      fetchRelatedData();
    }
  }, [idea, isOpen]);

  const fetchRelatedData = async () => {
    if (!idea) return;
    
    setLoading(true);
    try {
      const [evaluationsRes] = await Promise.all([
        supabase
          .from('idea_evaluations')
          .select(`
            id,
            technical_feasibility,
            financial_viability,
            market_potential,
            strategic_alignment,
            innovation_level,
            implementation_complexity,
            strengths,
            weaknesses,
            recommendations,
            next_steps,
            evaluation_date,
            evaluator_id,
            evaluator_type
          `)
          .eq('idea_id', idea.id)
          .order('evaluation_date', { ascending: false })
      ]);

      const evaluations = evaluationsRes.data || [];
      const analytics = {
        totalEvaluations: evaluations.length,
        averageScore: evaluations.length > 0 
          ? evaluations.reduce((sum, e) => sum + ((e.technical_feasibility + e.financial_viability + e.market_potential + e.strategic_alignment + e.innovation_level) / 5), 0) / evaluations.length 
          : 0,
        lastEvaluation: evaluations.length > 0 ? evaluations[0].evaluation_date : null,
        evaluationStatus: evaluations.length > 0 ? 'completed' : 'pending'
      };

      setRelatedData({
        evaluations,
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

  const getStatusLabel = (status: string) => {
    const labels = {
      submitted: 'مُرسلة',
      under_review: 'قيد المراجعة',
      approved: 'موافق عليها',
      rejected: 'مرفوضة',
      in_development: 'قيد التطوير',
      implemented: 'منفذة'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getMaturityLabel = (maturity: string) => {
    const labels = {
      concept: 'مفهوم',
      prototype: 'نموذج أولي',
      pilot: 'تجريبي',
      scaled: 'قابل للتوسع'
    };
    return labels[maturity as keyof typeof labels] || maturity;
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
      <div className="border rounded-lg" dir={isRTL ? 'rtl' : 'ltr'}>
        <CollapsibleTrigger asChild>
          <div className="cursor-pointer hover:bg-muted/50 transition-colors p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                <span className="font-semibold">{title}</span>
                {count !== undefined && (
                  <Badge variant="secondary">{count}</Badge>
                )}
              </div>
              {openSections[id] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-4 pt-0">
            {children}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );

  if (!idea) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold" dir="rtl">{idea.title_ar}</DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline">{getStatusLabel(idea.status)}</Badge>
                <Badge variant="secondary">{getMaturityLabel(idea.maturity_level)}</Badge>
                <Badge variant={idea.overall_score >= 70 ? 'default' : 'outline'}>
                  {idea.overall_score}/100
                </Badge>
                {idea.challenge && (
                  <Badge variant="outline">مرتبط بتحدي</Badge>
                )}
              </div>
            </div>
            <Button onClick={() => onEdit(idea)} size="sm">
              <Edit className="w-4 h-4 mr-2" />
              تعديل
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="space-y-6 pb-6">
            
            {/* Analytics Overview */}
            <CollapsibleSection 
              id="analytics" 
              title="إحصائيات الفكرة" 
              icon={BarChart3}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary" dir="ltr">{relatedData.analytics.totalEvaluations}</div>
                  <div className="text-sm text-muted-foreground" dir="rtl">إجمالي التقييمات</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary" dir="ltr">{relatedData.analytics.averageScore.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground" dir="rtl">متوسط التقييم</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary" dir="ltr">{idea.overall_score}</div>
                  <div className="text-sm text-muted-foreground" dir="rtl">النقاط الإجمالية</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {relatedData.analytics.evaluationStatus === 'completed' ? (
                      <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-500" />
                    ) : (
                      <AlertCircle className="w-6 h-6 mx-auto mb-1 text-yellow-500" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground" dir="rtl">
                    {relatedData.analytics.evaluationStatus === 'completed' ? 'مُقيمة' : 'في انتظار التقييم'}
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Idea Details */}
            <CollapsibleSection 
              id="details" 
              title="تفاصيل الفكرة" 
              icon={Lightbulb}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">الحالة</h4>
                    <p className="text-sm text-muted-foreground">{getStatusLabel(idea.status)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">مستوى النضج</h4>
                    <p className="text-sm text-muted-foreground">{getMaturityLabel(idea.maturity_level)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">النقاط الإجمالية</h4>
                    <p className="text-sm flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {idea.overall_score}/100
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">تاريخ الإرسال</h4>
                    <p className="text-sm flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(idea.created_at), 'dd/MM/yyyy')}
                    </p>
                  </div>
                </div>

                {idea.challenge && (
                  <div>
                    <h4 className="font-semibold mb-2">التحدي المرتبط</h4>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span className="font-medium" dir="rtl">{idea.challenge.title_ar}</span>
                        <Badge variant="outline">{idea.challenge.status}</Badge>
                      </div>
                    </div>
                  </div>
                )}

                {idea.focus_question && (
                  <div>
                    <h4 className="font-semibold mb-2">السؤال المحوري المرتبط</h4>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm" dir="rtl">{idea.focus_question.question_text_ar}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">تواريخ التعديل</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span dir="rtl">تاريخ الإرسال: </span>
                      <span dir="ltr">{format(new Date(idea.created_at), 'PPp')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      <span dir="rtl">آخر تحديث: </span>
                      <span dir="ltr">{format(new Date(idea.updated_at), 'PPp')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Idea Content */}
            <CollapsibleSection 
              id="content" 
              title="محتوى الفكرة" 
              icon={FileText}
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">وصف الفكرة</h4>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-base leading-relaxed" dir="rtl">{idea.description_ar}</p>
                  </div>
                </div>

                {idea.solution_approach && (
                  <div>
                    <h4 className="font-semibold mb-2">منهجية الحل</h4>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm leading-relaxed" dir="rtl">{idea.solution_approach}</p>
                    </div>
                  </div>
                )}

                {idea.implementation_plan && (
                  <div>
                    <h4 className="font-semibold mb-2">خطة التنفيذ</h4>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm leading-relaxed" dir="rtl">{idea.implementation_plan}</p>
                    </div>
                  </div>
                )}

                {idea.expected_impact && (
                  <div>
                    <h4 className="font-semibold mb-2">الأثر المتوقع</h4>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm leading-relaxed" dir="rtl">{idea.expected_impact}</p>
                    </div>
                  </div>
                )}

                {idea.resource_requirements && (
                  <div>
                    <h4 className="font-semibold mb-2">متطلبات الموارد</h4>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm leading-relaxed" dir="rtl">{idea.resource_requirements}</p>
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleSection>

            {/* Evaluations */}
            <CollapsibleSection 
              id="evaluations" 
              title="التقييمات" 
              icon={MessageSquare}
              count={relatedData.evaluations.length}
            >
              {relatedData.evaluations.length > 0 ? (
                <div className="space-y-3">
                  {relatedData.evaluations.map((evaluation: any) => (
                    <div key={evaluation.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {evaluation.evaluator_type === 'expert' ? 'خبير' : 'مقيم'}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(evaluation.evaluation_date), 'dd/MM/yyyy')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">الجدوى التقنية: </span>
                          <span>{evaluation.technical_feasibility}/10</span>
                        </div>
                        <div>
                          <span className="font-medium">الجدوى المالية: </span>
                          <span>{evaluation.financial_viability}/10</span>
                        </div>
                        <div>
                          <span className="font-medium">إمكانية السوق: </span>
                          <span>{evaluation.market_potential}/10</span>
                        </div>
                      </div>

                      {evaluation.strengths && (
                        <div>
                          <h6 className="font-medium text-sm text-green-600">نقاط القوة:</h6>
                          <p className="text-sm text-muted-foreground" dir="rtl">{evaluation.strengths}</p>
                        </div>
                      )}

                      {evaluation.weaknesses && (
                        <div>
                          <h6 className="font-medium text-sm text-red-600">نقاط الضعف:</h6>
                          <p className="text-sm text-muted-foreground" dir="rtl">{evaluation.weaknesses}</p>
                        </div>
                      )}

                      {evaluation.recommendations && (
                        <div>
                          <h6 className="font-medium text-sm text-blue-600">التوصيات:</h6>
                          <p className="text-sm text-muted-foreground" dir="rtl">{evaluation.recommendations}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground" dir="rtl">لا توجد تقييمات لهذه الفكرة</p>
                </div>
              )}
            </CollapsibleSection>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}