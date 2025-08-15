import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MultiStepForm } from "@/components/ui/multi-step-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useSettingsManager } from "@/hooks/useSettingsManager";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { logger } from "@/utils/error-handler";

interface Challenge {
  id: string;
  title_ar: string;
  title_en?: string;
  status: string;
  sensitivity_level: string;
}

interface FocusQuestion {
  id?: string;
  question_text_ar: string;
  question_text_en?: string;
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
  const { t } = useUnifiedTranslation();
  
  const [formData, setFormData] = useState({
    question_text_ar: "",
    question_text_en: "",
    question_type: "open_ended",
    is_sensitive: false,
    order_sequence: 0,
    challenge_id: challengeId || "none",
  });

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { getSettingValue } = useSettingsManager();

  // Get focus question types from settings
  const focusQuestionTypes = getSettingValue('focus_question_types', []) as string[];
  const questionTypes = focusQuestionTypes.map(type => ({ 
    value: type, 
    label: t(`focusQuestionTypes.${type}`) || type
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
        question_text_en: question.question_text_en || "",
        question_type: question.question_type || "open_ended",
        is_sensitive: question.is_sensitive || false,
        order_sequence: question.order_sequence || 0,
        challenge_id: question.challenge_id || challengeId || "none",
      });
    } else {
      setFormData({
        question_text_ar: "",
        question_text_en: "",
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
      logger.error('Error fetching challenges', error);
    }
  };

  const validateQuestionText = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.question_text_ar.trim()) {
      newErrors.question_text_ar = t('admin.focus_questions.question_text_required');
    } else if (formData.question_text_ar.length < 10) {
      newErrors.question_text_ar = t('admin.focus_questions.question_text_min_length');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateQuestionDetails = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.question_type) {
      newErrors.question_type = t('admin.focus_questions.question_type_required');
    }
    
    if (formData.order_sequence < 0) {
      newErrors.order_sequence = t('admin.focus_questions.order_sequence_positive');
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
        question_text_en: formData.question_text_en?.trim() || null,
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
          title: t('success.update_success'),
          description: t('success.question_updated'),
        });
      } else {
        // Create new question
        const { error } = await supabase
          .from('focus_questions')
          .insert([questionData]);

        if (error) throw error;
        
        toast({
          title: t('success.create_success'),
          description: t('success.question_created'),
        });
      }

      onSave();
      onClose();
    } catch (error: unknown) {
      // Handle specific database errors using toast notifications
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('duplicate')) {
        setErrors({ question_text_ar: t('error.duplicate_error') });
      } else if (errorMessage.includes('constraint')) {
        setErrors({ general: t('error.constraint_error') });
      } else {
        toast({
          title: t('error.validation_error'),
          description: errorMessage || t('error.save_failed'),
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
      title: t('admin.focus_questions.content_step_title'),
      description: t('description.enter_question_details'),
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
            <Label htmlFor="question_text_ar">{t('admin.focus_questions.question_text_label')}</Label>
            <Textarea
              id="question_text_ar"
              value={formData.question_text_ar}
              onChange={(e) => {
                setFormData({ ...formData, question_text_ar: e.target.value });
                if (errors.question_text_ar) {
                  setErrors({ ...errors, question_text_ar: "" });
                }
              }}
              placeholder={t('placeholder.enter_question_text')}
              rows={4}
              dir="rtl"
              className={errors.question_text_ar ? "border-destructive" : ""}
            />
            {errors.question_text_ar ? (
              <p className="text-sm text-destructive">{errors.question_text_ar}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t('admin.focus_questions.question_text_help')}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="question_text_en">{t('form.question_text_english_label', 'Question Text (English)')}</Label>
            <Textarea
              id="question_text_en"
              value={formData.question_text_en}
              onChange={(e) => {
                setFormData({ ...formData, question_text_en: e.target.value });
              }}
              placeholder={t('placeholder.enter_question_english', 'Enter the focus question in English')}
              rows={4}
              dir="ltr"
            />
            <p className="text-sm text-muted-foreground">
              {t('admin.focus_question_wizard.optional_english', 'Optional English translation of the question')}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "question-details",
      title: t('admin.focus_questions.details_step_title'),
      description: t('admin.focus_questions.details_step_description'),
      validation: validateQuestionDetails,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="question_type">{t('admin.focus_questions.question_type_label')}</Label>
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
              <Label htmlFor="order_sequence">{t('admin.focus_questions.order_sequence_label')}</Label>
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
      title: t('admin.focus_questions.link_step_title'),
      description: t('admin.focus_questions.link_step_description'),
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="challenge_id">{t('admin.focus_questions.challenge_link_label')}</Label>
            <Select 
              value={formData.challenge_id} 
              onValueChange={(value) => setFormData({ ...formData, challenge_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('placeholder.select_challenge')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t('admin.focus_questions.no_challenge_link')}</SelectItem>
                {challenges.map((challenge) => (
                  <SelectItem key={challenge.id} value={challenge.id}>
                    {challenge.title_ar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {t('admin.focus_questions.link_help')}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "question-settings",
      title: t('admin.focus_questions.settings_step_title'),
      description: t('admin.focus_questions.settings_step_description'),
      content: (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              id="is_sensitive"
              checked={formData.is_sensitive}
              onCheckedChange={(checked) => setFormData({ ...formData, is_sensitive: checked })}
            />
            <div className="space-y-1">
              <Label htmlFor="is_sensitive">{t('form.sensitive_question')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('description.sensitive_questions')}
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
      title={question ? t('admin.focus_questions.edit_title') : t('admin.focus_questions.add_title')}
      steps={steps}
      onComplete={handleSave}
      showProgress={true}
      allowSkip={false}
    />
  );
}