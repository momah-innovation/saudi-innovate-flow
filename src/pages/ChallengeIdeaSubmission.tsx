import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import { GlobalBreadcrumb } from "@/components/layout/GlobalBreadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Lightbulb, Upload, FileText, Save, CheckCircle } from "lucide-react";
import { useDirection } from "@/components/ui/direction-provider";

interface Challenge {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  end_date?: string;
}

interface SubmissionFormData {
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  solution_approach: string;
  implementation_plan: string;
  expected_impact: string;
  business_model: string;
  technical_details: Record<string, any>;
  team_members: any[];
}

const INNOVATION_LEVELS = [
  { value: 'incremental', label_ar: 'تحسين تدريجي', label_en: 'Incremental Improvement' },
  { value: 'moderate', label_ar: 'ابتكار متوسط', label_en: 'Moderate Innovation' },
  { value: 'radical', label_ar: 'ابتكار جذري', label_en: 'Radical Innovation' },
  { value: 'disruptive', label_ar: 'ابتكار تحويلي', label_en: 'Disruptive Innovation' }
];

const IMPLEMENTATION_TIMELINES = [
  { value: '1-3_months', label_ar: '1-3 أشهر', label_en: '1-3 months' },
  { value: '3-6_months', label_ar: '3-6 أشهر', label_en: '3-6 months' },
  { value: '6-12_months', label_ar: '6-12 شهر', label_en: '6-12 months' },
  { value: '1-2_years', label_ar: '1-2 سنة', label_en: '1-2 years' },
  { value: '2+_years', label_ar: 'أكثر من سنتين', label_en: '2+ years' }
];

export default function ChallengeIdeaSubmission() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const { isRTL } = useDirection();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState<SubmissionFormData>({
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: '',
    solution_approach: '',
    implementation_plan: '',
    expected_impact: '',
    business_model: '',
    technical_details: {},
    team_members: []
  });

  useEffect(() => {
    if (challengeId) {
      fetchChallenge();
    }
  }, [challengeId]);

  const fetchChallenge = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('id, title_ar, description_ar, status, end_date')
        .eq('id', challengeId)
        .maybeSingle();

      if (error) {
        toast({
          title: "خطأ",
          description: "فشل في تحميل تفاصيل التحدي",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setChallenge(data);
      } else {
        toast({
          title: "غير موجود",
          description: "التحدي غير موجود",
          variant: "destructive",
        });
        navigate('/challenges');
      }
    } catch (error) {
      console.error('Error fetching challenge:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل التحدي",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.title_ar.trim().length > 0 && formData.description_ar.trim().length > 0;
      case 2:
        return formData.solution_approach.trim().length > 0 && formData.implementation_plan.trim().length > 0;
      case 3:
        return formData.expected_impact.trim().length > 0 && formData.business_model.trim().length > 0;
      case 4:
        return true; // Review step, no additional validation
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!userProfile?.id || !challengeId) {
      toast({
        title: "خطأ",
        description: "المستخدم غير مسجل الدخول أو التحدي غير محدد",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      const submissionData = {
        title_ar: formData.title_ar,
        title_en: formData.title_en || null,
        description_ar: formData.description_ar,
        description_en: formData.description_en || null,
        challenge_id: challengeId,
        submitted_by: userProfile.id,
        solution_approach: formData.solution_approach,
        implementation_plan: formData.implementation_plan,
        expected_impact: formData.expected_impact,
        business_model: formData.business_model,
        technical_details: formData.technical_details,
        team_members: formData.team_members,
        status: 'submitted',
        submission_date: new Date().toISOString()
      };

      const { error } = await supabase
        .from('challenge_submissions')
        .insert(submissionData);

      if (error) {
        throw error;
      }

      toast({
        title: "تم بنجاح!",
        description: "تم تقديم فكرتك بنجاح للتحدي",
      });

      navigate(`/challenges/${challengeId}`);
    } catch (error) {
      console.error('Error submitting idea:', error);
      toast({
        title: "خطأ",
        description: "فشل في تقديم الفكرة، حاول مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(`/challenges/${challengeId}`);
  };

  if (loading) {
    return (
      <AppShell>
        <div className="container mx-auto px-4 py-8">
          <div className="h-8 bg-muted rounded animate-pulse mb-6" />
          <div className="grid gap-4">
            <div className="h-64 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (!challenge) {
    return (
      <AppShell>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">التحدي غير موجود</h3>
            <Button onClick={() => navigate('/challenges')}>العودة للتحديات</Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const breadcrumbs = [
    { label: "التحديات", href: "/challenges" },
    { label: challenge.title_ar, href: `/challenges/${challengeId}` },
    { label: "تقديم فكرة" }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">معلومات الفكرة الأساسية</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">عنوان الفكرة (بالعربية) *</label>
                  <Input
                    value={formData.title_ar}
                    onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                    placeholder="أدخل عنواناً واضحاً ومختصراً لفكرتك"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">عنوان الفكرة (بالإنجليزية)</label>
                  <Input
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    placeholder="Enter a clear and concise title for your idea"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">وصف الفكرة (بالعربية) *</label>
                  <Textarea
                    value={formData.description_ar}
                    onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                    placeholder="اشرح فكرتك بالتفصيل، كيف تحل مشكلة التحدي، وما الفائدة المتوقعة"
                    rows={6}
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">وصف الفكرة (بالإنجليزية)</label>
                  <Textarea
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    placeholder="Describe your idea in detail, how it solves the challenge problem, and the expected benefits"
                    rows={6}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">الحل المقترح وخطة التنفيذ</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">نهج الحل المقترح *</label>
                  <Textarea
                    value={formData.solution_approach}
                    onChange={(e) => setFormData({ ...formData, solution_approach: e.target.value })}
                    placeholder="اشرح النهج التقني والمنهجي لحل المشكلة"
                    rows={4}
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">خطة التنفيذ *</label>
                  <Textarea
                    value={formData.implementation_plan}
                    onChange={(e) => setFormData({ ...formData, implementation_plan: e.target.value })}
                    placeholder="حدد خطة التنفيذ التفصيلية والجدولة الزمنية"
                    rows={4}
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">التأثير ونموذج العمل</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">التأثير المتوقع *</label>
                  <Textarea
                    value={formData.expected_impact}
                    onChange={(e) => setFormData({ ...formData, expected_impact: e.target.value })}
                    placeholder="اشرح التأثير المتوقع لفكرتك على المؤسسة أو المجتمع"
                    rows={4}
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">نموذج العمل *</label>
                  <Textarea
                    value={formData.business_model}
                    onChange={(e) => setFormData({ ...formData, business_model: e.target.value })}
                    placeholder="اشرح نموذج العمل والجدوى الاقتصادية للحل"
                    rows={4}
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">مراجعة الفكرة</h3>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{formData.title_ar}</CardTitle>
                    {formData.title_en && (
                      <CardDescription>{formData.title_en}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium">الوصف:</h4>
                      <p className="text-sm text-muted-foreground" dir="rtl">{formData.description_ar}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">نهج الحل:</h4>
                      <p className="text-sm text-muted-foreground" dir="rtl">{formData.solution_approach}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">خطة التنفيذ:</h4>
                      <p className="text-sm text-muted-foreground" dir="rtl">{formData.implementation_plan}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">التأثير المتوقع:</h4>
                      <p className="text-sm text-muted-foreground" dir="rtl">{formData.expected_impact}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">نموذج العمل:</h4>
                      <p className="text-sm text-muted-foreground" dir="rtl">{formData.business_model}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8">
        <GlobalBreadcrumb customItems={breadcrumbs} />
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                العودة للتحدي
              </Button>
              <div>
                <h1 className="text-2xl font-bold">تقديم فكرة للتحدي</h1>
                <p className="text-muted-foreground">{challenge.title_ar}</p>
              </div>
            </div>
            <Badge variant={challenge.status === 'active' ? 'default' : 'secondary'}>
              {challenge.status}
            </Badge>
          </div>

          {/* Challenge Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                تفاصيل التحدي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm" dir="rtl">{challenge.description_ar}</p>
              {challenge.end_date && (
                <p className="text-sm text-muted-foreground mt-2">
                  آخر موعد للتقديم: {new Date(challenge.end_date).toLocaleDateString('ar-SA')}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Progress Indicator */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div key={i} className={`flex items-center ${i < totalSteps - 1 ? 'flex-1' : ''}`}>
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${currentStep > i + 1 ? 'bg-primary text-primary-foreground' : 
                        currentStep === i + 1 ? 'bg-primary text-primary-foreground' : 
                        'bg-muted text-muted-foreground'}
                    `}>
                      {currentStep > i + 1 ? <CheckCircle className="h-4 w-4" /> : i + 1}
                    </div>
                    {i < totalSteps - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 ${currentStep > i + 1 ? 'bg-primary' : 'bg-muted'}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">الخطوة {currentStep} من {totalSteps}</p>
              </div>
            </CardContent>
          </Card>

          {/* Form Content */}
          <Card>
            <CardContent className="pt-6">
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              السابق
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
              >
                التالي
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitting || !validateStep(currentStep)}
                className="bg-primary"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    تقديم الفكرة
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}