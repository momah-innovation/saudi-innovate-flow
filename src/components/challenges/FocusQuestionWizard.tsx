import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MultiStepForm } from "@/components/ui/multi-step-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { useSystemLists } from "@/hooks/useSystemLists";

interface FocusQuestion {
  id: string;
  question_text_ar: string;
  question_type?: string;
  is_sensitive: boolean;
  order_sequence: number;
}

interface FocusQuestionWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challengeId: string;
  question?: FocusQuestion;
  onQuestionSaved: () => void;
}

export function FocusQuestionWizard({ 
  open, 
  onOpenChange, 
  challengeId,
  question,
  onQuestionSaved 
}: FocusQuestionWizardProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    question_text_ar: "",
    question_type: "open_ended",
    is_sensitive: false,
    order_sequence: 0,
  });

  const isEditing = !!question;
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
    if (question) {
      setFormData({
        question_text_ar: question.question_text_ar || "",
        question_type: question.question_type || "open_ended",
        is_sensitive: question.is_sensitive || false,
        order_sequence: question.order_sequence || 0,
      });
    } else {
      setFormData({
        question_text_ar: "",
        question_type: "open_ended",
        is_sensitive: false,
        order_sequence: 0,
      });
    }
  }, [question, open]);

  const validateQuestionText = () => {
    if (!formData.question_text_ar.trim()) return false;
    if (formData.question_text_ar.length < 10) return false;
    return true;
  };

  const handleSave = async () => {
    try {
      const questionData = {
        challenge_id: challengeId,
        question_text_ar: formData.question_text_ar.trim(),
        question_type: formData.question_type,
        is_sensitive: formData.is_sensitive,
        order_sequence: formData.order_sequence
      };

      if (isEditing) {
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
        const { error } = await supabase
          .from('focus_questions')
          .insert(questionData);

        if (error) throw error;
        
        toast({
          title: "نجح الإنشاء", 
          description: "تم إنشاء السؤال المحوري بنجاح",
        });
      }

      onQuestionSaved();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving focus question:', error);
      toast({
        title: "خطأ",
        description: `فشل في ${isEditing ? 'تحديث' : 'إنشاء'} السؤال المحوري`,
        variant: "destructive",
      });
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
          <div className="space-y-2">
            <Label htmlFor="question_text_ar">نص السؤال المحوري *</Label>
            <Textarea
              id="question_text_ar"
              value={formData.question_text_ar}
              onChange={(e) => setFormData({ ...formData, question_text_ar: e.target.value })}
              placeholder="أدخل نص السؤال المحوري الذي ستطرحه على المبتكرين"
              rows={4}
              dir="rtl"
            />
            <p className="text-sm text-muted-foreground">
              يجب أن يكون السؤال واضحاً ومفهوماً ولا يقل عن 10 أحرف
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "question-details",
      title: "تفاصيل السؤال",
      description: "حدد نوع السؤال وترتيبه",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="question_type">نوع السؤال</Label>
              <Select 
                value={formData.question_type} 
                onValueChange={(value) => setFormData({ ...formData, question_type: value })}
              >
                <SelectTrigger>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="order_sequence">ترتيب السؤال</Label>
              <Input
                id="order_sequence"
                type="number"
                value={formData.order_sequence}
                onChange={(e) => setFormData({ ...formData, order_sequence: parseInt(e.target.value) || 0 })}
                min="0"
                placeholder="0"
              />
            </div>
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
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={question ? "تعديل السؤال المحوري" : "إضافة سؤال محوري جديد"}
      steps={steps}
      onComplete={handleSave}
      showProgress={true}
      allowSkip={false}
    />
  );
}