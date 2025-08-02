import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MultiStepForm } from "@/components/ui/multi-step-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useAppTranslation";
import { useSystemLists } from "@/hooks/useSystemLists";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Challenge {
  id: string;
  title_ar: string;
  status: string;
  sensitivity_level: string;
}

interface FocusQuestion {
  id?: string;
  question_text_ar: string;
  question_type: string;
  is_sensitive: boolean;
  order_sequence: number;
  challenge_id?: string;
}

interface FocusQuestionWizardProps {
  isOpen: boolean;
  onClose: () => void;
  question?: FocusQuestion | null;
  challengeId?: string;
  onSave: () => void;
}

export function AdminFocusQuestionWizard({
  isOpen,
  onClose,
  question,
  challengeId,
  onSave,
}: FocusQuestionWizardProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    question_text_ar: "",
    question_type: "open_ended",
    is_sensitive: false,
    order_sequence: 0,
    challenge_id: challengeId || "none",
  });

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { focusQuestionTypes } = useSystemLists();

  // Question type options
  const questionTypes = focusQuestionTypes.map(type => ({ 
    value: type, 
    label: type === 'general' ? 'عام' :
           type === 'technical' ? 'تقني' :
           type === 'business' ? 'أعمال' :
           type === 'impact' ? 'تأثير' :
           type === 'implementation' ? 'تنفيذ' :
           type === 'social' ? 'اجتماعي' :
           type === 'ethical' ? 'أخلاقي' :
           type === 'medical' ? 'طبي' :
           type === 'regulatory' ? 'تنظيمي' : type
  }));

  useEffect(() => {
    if (isOpen) {
      fetchChallenges();
    }
  }, [isOpen]);

  useEffect(() => {
    if (question) {
      setFormData({
        question_text_ar: question.question_text_ar || "",
        question_type: question.question_type || "open_ended",
        is_sensitive: question.is_sensitive || false,
        order_sequence: question.order_sequence || 0,
        challenge_id: question.challenge_id || challengeId || "none",
      });
    } else {
      setFormData({
        question_text_ar: "",
        question_type: "open_ended",
        is_sensitive: false,
        order_sequence: 0,
        challenge_id: challengeId || "none",
      });
    }
  }, [question, challengeId, isOpen]);

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('id, title_ar, status, sensitivity_level')
        .order('title_ar');

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  const validateQuestionText = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.question_text_ar.trim()) {
      newErrors.question_text_ar = "نص السؤال مطلوب";
    } else if (formData.question_text_ar.length < 10) {
      newErrors.question_text_ar = "يجب أن يكون نص السؤال أكثر من 10 أحرف";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateQuestionDetails = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.question_type) {
      newErrors.question_type = "نوع السؤال مطلوب";
    }
    
    if (formData.order_sequence < 0) {
      newErrors.order_sequence = "ترتيب السؤال يجب أن يكون صفر أو أكثر";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setIsLoading(true);
    setErrors({});
    
    try {
      const questionData = {
        question_text_ar: formData.question_text_ar.trim(),
        question_type: formData.question_type,
        is_sensitive: formData.is_sensitive,
        order_sequence: formData.order_sequence,
        challenge_id: (formData.challenge_id && formData.challenge_id !== 'none') ? formData.challenge_id : null,
      };

      if (question?.id) {
        // Update existing question
        const { error } = await supabase
          .from('focus_questions')
          .update(questionData)
          .eq('id', question.id);

        if (error) throw error;
        
        toast({
          title: "نجح التحديث",
          description: "تم تحديث السؤال المحوري بنجاح",
        });
      } else {
        // Create new question
        const { error } = await supabase
          .from('focus_questions')
          .insert([questionData]);

        if (error) throw error;
        
        toast({
          title: "نجح الإنشاء",
          description: "تم إنشاء السؤال المحوري بنجاح",
        });
      }

      onSave();
      onClose();
    } catch (error: any) {
      // Handle specific database errors using toast notifications
      if (error?.message?.includes('duplicate')) {
        setErrors({ question_text_ar: "يوجد سؤال مماثل بالفعل" });
      } else if (error?.message?.includes('constraint')) {
        setErrors({ general: "خطأ في القيود المدخلة" });
      } else {
        toast({
          title: "خطأ",
          description: error?.message || "فشل في حفظ السؤال المحوري",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    {
      id: "question-content",
      title: "محتوى السؤال",
      description: "أدخل نص السؤال المحوري",
      validation: validateQuestionText,
      content: (
        <div className="space-y-6">
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="question_text_ar">نص السؤال المحوري *</Label>
            <Textarea
              id="question_text_ar"
              value={formData.question_text_ar}
              onChange={(e) => {
                setFormData({ ...formData, question_text_ar: e.target.value });
                if (errors.question_text_ar) {
                  setErrors({ ...errors, question_text_ar: "" });
                }
              }}
              placeholder="أدخل نص السؤال المحوري الذي ستطرحه على المبتكرين"
              rows={4}
              dir="rtl"
              className={errors.question_text_ar ? "border-destructive" : ""}
            />
            {errors.question_text_ar ? (
              <p className="text-sm text-destructive">{errors.question_text_ar}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                يجب أن يكون السؤال واضحاً ومفهوماً ولا يقل عن 10 أحرف
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "question-details",
      title: "تفاصيل السؤال",
      description: "حدد نوع السؤال وترتيبه",
      validation: validateQuestionDetails,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="question_type">نوع السؤال *</Label>
              <Select 
                value={formData.question_type} 
                onValueChange={(value) => {
                  setFormData({ ...formData, question_type: value });
                  if (errors.question_type) {
                    setErrors({ ...errors, question_type: "" });
                  }
                }}
              >
                <SelectTrigger className={errors.question_type ? "border-destructive" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {questionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.question_type && (
                <p className="text-sm text-destructive">{errors.question_type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="order_sequence">ترتيب السؤال</Label>
              <Input
                id="order_sequence"
                type="number"
                value={formData.order_sequence}
                onChange={(e) => {
                  setFormData({ ...formData, order_sequence: parseInt(e.target.value) || 0 });
                  if (errors.order_sequence) {
                    setErrors({ ...errors, order_sequence: "" });
                  }
                }}
                min="0"
                placeholder="0"
                className={errors.order_sequence ? "border-destructive" : ""}
              />
              {errors.order_sequence && (
                <p className="text-sm text-destructive">{errors.order_sequence}</p>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "question-association",
      title: "ربط السؤال",
      description: "ربط السؤال بتحدي محدد (اختياري)",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="challenge_id">التحدي المرتبط (اختياري)</Label>
            <Select 
              value={formData.challenge_id} 
              onValueChange={(value) => setFormData({ ...formData, challenge_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر التحدي (اختياري)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">بدون ربط بتحدي محدد</SelectItem>
                {challenges.map((challenge) => (
                  <SelectItem key={challenge.id} value={challenge.id}>
                    {challenge.title_ar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              يمكن ربط السؤال بتحدي محدد أو تركه عاماً لجميع التحديات
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "question-settings",
      title: "إعدادات السؤال",
      description: "إعدادات الخصوصية والأمان",
      content: (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              id="is_sensitive"
              checked={formData.is_sensitive}
              onCheckedChange={(checked) => setFormData({ ...formData, is_sensitive: checked })}
            />
            <div className="space-y-1">
              <Label htmlFor="is_sensitive">سؤال حساس</Label>
              <p className="text-sm text-muted-foreground">
                الأسئلة الحساسة تكون مرئية لأعضاء الفريق فقط
              </p>
            </div>
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
      title={question ? "تعديل السؤال المحوري" : "إضافة سؤال محوري جديد"}
      steps={steps}
      onComplete={handleSave}
      showProgress={true}
      allowSkip={false}
    />
  );
}