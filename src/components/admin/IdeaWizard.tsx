import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MultiStepForm } from "@/components/ui/multi-step-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Challenge {
  id: string;
  title_ar: string;
  status: string;
}

interface FocusQuestion {
  id: string;
  question_text_ar: string;
  challenge_id?: string;
}

interface Innovator {
  id: string;
  user_id: string;
  innovation_score: number;
}

interface Idea {
  id?: string;
  title_ar: string;
  description_ar: string;
  status: string;
  maturity_level: string;
  overall_score?: number;
  innovator_id: string;
  challenge_id?: string;
  focus_question_id?: string;
  solution_approach?: string;
  implementation_plan?: string;
  expected_impact?: string;
  resource_requirements?: string;
}

interface IdeaWizardProps {
  isOpen: boolean;
  onClose: () => void;
  idea?: Idea | null;
  onSave: () => void;
}

export function IdeaWizard({
  isOpen,
  onClose,
  idea,
  onSave,
}: IdeaWizardProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    title_ar: "",
    description_ar: "",
    status: "submitted",
    maturity_level: "concept",
    innovator_id: "",
    challenge_id: "",
    focus_question_id: "",
    solution_approach: "",
    implementation_plan: "",
    expected_impact: "",
    resource_requirements: "",
  });

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [focusQuestions, setFocusQuestions] = useState<FocusQuestion[]>([]);
  const [innovators, setInnovators] = useState<Innovator[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Status options
  const statusOptions = [
    { value: 'submitted', label: 'مُرسلة' },
    { value: 'under_review', label: 'قيد المراجعة' },
    { value: 'approved', label: 'موافق عليها' },
    { value: 'rejected', label: 'مرفوضة' },
    { value: 'in_development', label: 'قيد التطوير' },
    { value: 'implemented', label: 'منفذة' }
  ];

  // Maturity options
  const maturityOptions = [
    { value: 'concept', label: 'مفهوم' },
    { value: 'prototype', label: 'نموذج أولي' },
    { value: 'pilot', label: 'تجريبي' },
    { value: 'scaled', label: 'قابل للتوسع' }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (idea) {
      setFormData({
        title_ar: idea.title_ar || "",
        description_ar: idea.description_ar || "",
        status: idea.status || "submitted",
        maturity_level: idea.maturity_level || "concept",
        innovator_id: idea.innovator_id || "",
        challenge_id: idea.challenge_id || "",
        focus_question_id: idea.focus_question_id || "",
        solution_approach: idea.solution_approach || "",
        implementation_plan: idea.implementation_plan || "",
        expected_impact: idea.expected_impact || "",
        resource_requirements: idea.resource_requirements || "",
      });
    } else {
      setFormData({
        title_ar: "",
        description_ar: "",
        status: "submitted",
        maturity_level: "concept",
        innovator_id: "",
        challenge_id: "",
        focus_question_id: "",
        solution_approach: "",
        implementation_plan: "",
        expected_impact: "",
        resource_requirements: "",
      });
    }
  }, [idea, isOpen]);

  const fetchData = async () => {
    try {
      const [challengesRes, focusQuestionsRes, innovatorsRes] = await Promise.all([
        supabase
          .from('challenges')
          .select('id, title_ar, status')
          .order('title_ar'),
        supabase
          .from('focus_questions')
          .select('id, question_text_ar, challenge_id')
          .order('order_sequence'),
        supabase
          .from('innovators')
          .select('id, user_id, innovation_score')
          .order('innovation_score', { ascending: false })
      ]);

      if (challengesRes.error) throw challengesRes.error;
      if (focusQuestionsRes.error) throw focusQuestionsRes.error;
      if (innovatorsRes.error) throw innovatorsRes.error;

      setChallenges(challengesRes.data || []);
      setFocusQuestions(focusQuestionsRes.data || []);
      setInnovators(innovatorsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const validateBasicInfo = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title_ar.trim()) {
      newErrors.title_ar = "عنوان الفكرة مطلوب";
    } else if (formData.title_ar.length < 10) {
      newErrors.title_ar = "يجب أن يكون عنوان الفكرة أكثر من 10 أحرف";
    }
    
    if (!formData.description_ar.trim()) {
      newErrors.description_ar = "وصف الفكرة مطلوب";
    } else if (formData.description_ar.length < 50) {
      newErrors.description_ar = "يجب أن يكون وصف الفكرة أكثر من 50 حرف";
    }
    
    if (!formData.innovator_id) {
      newErrors.innovator_id = "يجب اختيار المبتكر";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDetails = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.status) {
      newErrors.status = "حالة الفكرة مطلوبة";
    }
    
    if (!formData.maturity_level) {
      newErrors.maturity_level = "مستوى النضج مطلوب";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setIsLoading(true);
    setErrors({});
    
    try {
      const ideaData = {
        title_ar: formData.title_ar.trim(),
        description_ar: formData.description_ar.trim(),
        status: formData.status,
        maturity_level: formData.maturity_level,
        innovator_id: formData.innovator_id,
        challenge_id: formData.challenge_id || null,
        focus_question_id: formData.focus_question_id || null,
        solution_approach: formData.solution_approach.trim() || null,
        implementation_plan: formData.implementation_plan.trim() || null,
        expected_impact: formData.expected_impact.trim() || null,
        resource_requirements: formData.resource_requirements.trim() || null,
      };

      if (idea?.id) {
        // Update existing idea
        const { error } = await supabase
          .from('ideas')
          .update(ideaData)
          .eq('id', idea.id);

        if (error) throw error;
        
        toast({
          title: "نجح التحديث",
          description: "تم تحديث الفكرة بنجاح",
        });
      } else {
        // Create new idea
        const { error } = await supabase
          .from('ideas')
          .insert([ideaData]);

        if (error) throw error;
        
        toast({
          title: "نجح الإنشاء",
          description: "تم إنشاء الفكرة بنجاح",
        });
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error("Error saving idea:", error);
      
      // Handle specific database errors
      if (error?.message?.includes('duplicate')) {
        setErrors({ title_ar: "يوجد فكرة بنفس العنوان بالفعل" });
      } else if (error?.message?.includes('constraint')) {
        setErrors({ general: "خطأ في القيود المدخلة" });
      } else {
        toast({
          title: "خطأ",
          description: error?.message || "فشل في حفظ الفكرة",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Filter focus questions based on selected challenge
  const filteredFocusQuestions = focusQuestions.filter(fq => 
    !formData.challenge_id || fq.challenge_id === formData.challenge_id || !fq.challenge_id
  );

  const steps = [
    {
      id: "basic-info",
      title: "المعلومات الأساسية",
      description: "أدخل المعلومات الأساسية للفكرة",
      validation: validateBasicInfo,
      content: (
        <div className="space-y-6">
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title_ar">عنوان الفكرة *</Label>
            <Input
              id="title_ar"
              value={formData.title_ar}
              onChange={(e) => {
                setFormData({ ...formData, title_ar: e.target.value });
                if (errors.title_ar) {
                  setErrors({ ...errors, title_ar: "" });
                }
              }}
              placeholder="أدخل عنوان الفكرة"
              dir="rtl"
              className={errors.title_ar ? "border-destructive" : ""}
            />
            {errors.title_ar ? (
              <p className="text-sm text-destructive">{errors.title_ar}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                يجب أن يكون العنوان وصفياً وواضحاً
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description_ar">وصف الفكرة *</Label>
            <Textarea
              id="description_ar"
              value={formData.description_ar}
              onChange={(e) => {
                setFormData({ ...formData, description_ar: e.target.value });
                if (errors.description_ar) {
                  setErrors({ ...errors, description_ar: "" });
                }
              }}
              placeholder="اكتب وصفاً مفصلاً للفكرة وأهدافها"
              rows={4}
              dir="rtl"
              className={errors.description_ar ? "border-destructive" : ""}
            />
            {errors.description_ar ? (
              <p className="text-sm text-destructive">{errors.description_ar}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                وصف شامل يوضح الفكرة وأهدافها (لا يقل عن 50 حرف)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="innovator_id">المبتكر *</Label>
            <Select 
              value={formData.innovator_id} 
              onValueChange={(value) => {
                setFormData({ ...formData, innovator_id: value });
                if (errors.innovator_id) {
                  setErrors({ ...errors, innovator_id: "" });
                }
              }}
            >
              <SelectTrigger className={errors.innovator_id ? "border-destructive" : ""}>
                <SelectValue placeholder="اختر المبتكر" />
              </SelectTrigger>
              <SelectContent>
                {innovators.map((innovator) => (
                  <SelectItem key={innovator.id} value={innovator.id}>
                    المبتكر {innovator.user_id} (نقاط: {innovator.innovation_score})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.innovator_id && (
              <p className="text-sm text-destructive">{errors.innovator_id}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "details",
      title: "تفاصيل الفكرة",
      description: "حدد حالة الفكرة ومستوى نضجها",
      validation: validateDetails,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">حالة الفكرة *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => {
                  setFormData({ ...formData, status: value });
                  if (errors.status) {
                    setErrors({ ...errors, status: "" });
                  }
                }}
              >
                <SelectTrigger className={errors.status ? "border-destructive" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maturity_level">مستوى النضج *</Label>
              <Select 
                value={formData.maturity_level} 
                onValueChange={(value) => {
                  setFormData({ ...formData, maturity_level: value });
                  if (errors.maturity_level) {
                    setErrors({ ...errors, maturity_level: "" });
                  }
                }}
              >
                <SelectTrigger className={errors.maturity_level ? "border-destructive" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {maturityOptions.map((maturity) => (
                    <SelectItem key={maturity.value} value={maturity.value}>
                      {maturity.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.maturity_level && (
                <p className="text-sm text-destructive">{errors.maturity_level}</p>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "associations",
      title: "الربط والعلاقات",
      description: "ربط الفكرة بالتحديات والأسئلة المحورية",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="challenge_id">التحدي المرتبط (اختياري)</Label>
            <Select 
              value={formData.challenge_id} 
              onValueChange={(value) => {
                setFormData({ ...formData, challenge_id: value, focus_question_id: "" });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر التحدي (اختياري)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">بدون ربط بتحدي محدد</SelectItem>
                {challenges.map((challenge) => (
                  <SelectItem key={challenge.id} value={challenge.id}>
                    {challenge.title_ar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              يمكن ربط الفكرة بتحدي محدد أو تركها عامة
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="focus_question_id">السؤال المحوري المرتبط (اختياري)</Label>
            <Select 
              value={formData.focus_question_id} 
              onValueChange={(value) => setFormData({ ...formData, focus_question_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر السؤال المحوري (اختياري)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">بدون ربط بسؤال محوري</SelectItem>
                {filteredFocusQuestions.map((question) => (
                  <SelectItem key={question.id} value={question.id}>
                    {question.question_text_ar.substring(0, 100)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              الأسئلة المحورية المتاحة {formData.challenge_id ? 'للتحدي المختار' : 'العامة'}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "content",
      title: "محتوى إضافي",
      description: "معلومات تفصيلية عن الفكرة",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="solution_approach">منهجية الحل</Label>
            <Textarea
              id="solution_approach"
              value={formData.solution_approach}
              onChange={(e) => setFormData({ ...formData, solution_approach: e.target.value })}
              placeholder="اشرح المنهجية المتبعة في حل المشكلة"
              rows={3}
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="implementation_plan">خطة التنفيذ</Label>
            <Textarea
              id="implementation_plan"
              value={formData.implementation_plan}
              onChange={(e) => setFormData({ ...formData, implementation_plan: e.target.value })}
              placeholder="وضح خطة تنفيذ الفكرة والخطوات المطلوبة"
              rows={3}
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected_impact">الأثر المتوقع</Label>
            <Textarea
              id="expected_impact"
              value={formData.expected_impact}
              onChange={(e) => setFormData({ ...formData, expected_impact: e.target.value })}
              placeholder="صف الأثر المتوقع من تطبيق هذه الفكرة"
              rows={3}
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resource_requirements">متطلبات الموارد</Label>
            <Textarea
              id="resource_requirements"
              value={formData.resource_requirements}
              onChange={(e) => setFormData({ ...formData, resource_requirements: e.target.value })}
              placeholder="حدد الموارد المطلوبة لتنفيذ الفكرة"
              rows={3}
              dir="rtl"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <MultiStepForm
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setErrors({});
        setIsLoading(false);
      }}
      title={idea ? "تعديل الفكرة" : "إضافة فكرة جديدة"}
      steps={steps}
      onComplete={handleSave}
      showProgress={true}
      allowSkip={false}
    />
  );
}