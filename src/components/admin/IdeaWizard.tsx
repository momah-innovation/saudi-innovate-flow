import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MultiStepForm } from "@/components/ui/multi-step-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useSettingsManager } from "@/hooks/useSettingsManager";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { IdeaFormData, SystemLists } from "@/types";

interface Challenge {
  id: string;
  title_ar: string;
  title_en?: string;
  status: string;
}

interface FocusQuestion {
  id: string;
  question_text_ar: string;
  challenge_id?: string;
}

interface Campaign {
  id: string;
  title_ar: string;
  title_en?: string;
  status: string;
}

interface Event {
  id: string;
  title_ar: string;
  title_en?: string;
  status: string;
}

interface Innovator {
  id: string;
  user_id: string;
  innovation_score: number;
  display_name?: string;
  profiles?: {
    name: string;
    name_ar?: string;
  };
}

interface Idea {
  id?: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
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
  const { t } = useUnifiedTranslation();
  const { getSettingValue } = useSettingsManager();
  const generalStatusOptions = getSettingValue('workflow_statuses', []) as string[];
  const experienceLevels = getSettingValue('experience_levels', []) as string[];
  
  const [formData, setFormData] = useState<IdeaFormData>({
    title_ar: "",
    description_ar: "",
    status: "draft",
    maturity_level: "concept",
    innovator_id: "",
    challenge_id: "",
    focus_question_id: "",
    campaign_id: "none",
    event_id: "none",
    solution_approach: "",
    implementation_plan: "",
    expected_impact: "",
    resource_requirements: "",
  });

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [focusQuestions, setFocusQuestions] = useState<FocusQuestion[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [innovators, setInnovators] = useState<Innovator[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Status options from system lists
  const statusOptions = generalStatusOptions.map(status => ({ 
    value: status, 
    label: t(`idea_status.${status}`, status)
  }));

  // Maturity options from system lists
  const ideaMaturityLevels = getSettingValue('idea_maturity_levels', []) as string[];
  
  const maturityOptions = ideaMaturityLevels.map(level => ({ 
    value: level, 
    label: t(`idea_maturity.${level}`, level)
  }));

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
        status: idea.status || "draft",
        maturity_level: idea.maturity_level || "concept",
        innovator_id: idea.innovator_id || "",
        challenge_id: idea.challenge_id || "",
        focus_question_id: idea.focus_question_id || "",
        campaign_id: "none",
        event_id: "none",
        solution_approach: idea.solution_approach || "",
        implementation_plan: idea.implementation_plan || "",
        expected_impact: idea.expected_impact || "",
        resource_requirements: idea.resource_requirements || "",
      });
    } else {
      setFormData({
        title_ar: "",
        description_ar: "",
        status: "draft",
        maturity_level: "concept",
        innovator_id: "",
        challenge_id: "",
        focus_question_id: "",
        campaign_id: "none",
        event_id: "none",
        solution_approach: "",
        implementation_plan: "",
        expected_impact: "",
        resource_requirements: "",
      });
    }
  }, [idea, isOpen]);

  const fetchData = async () => {
    try {
      const [challengesRes, focusQuestionsRes, campaignsRes, eventsRes, innovatorsRes, profilesRes] = await Promise.all([
        supabase
          .from('challenges')
          .select('id, title_ar, status')
          .order('title_ar'),
        supabase
          .from('focus_questions')
          .select('id, question_text_ar, challenge_id')
          .order('order_sequence'),
        supabase
          .from('campaigns')
          .select('id, title_ar, status')
          .order('title_ar'),
        supabase
          .from('events')
          .select('id, title_ar, status')
          .order('title_ar'),
        supabase
          .from('innovators')
          .select('id, user_id, innovation_score')
          .order('innovation_score', { ascending: false }),
        supabase
          .from('profiles')
          .select('id, name, name_ar')
      ]);

      if (challengesRes.error) throw challengesRes.error;
      if (focusQuestionsRes.error) throw focusQuestionsRes.error;
      if (campaignsRes.error) throw campaignsRes.error;
      if (eventsRes.error) throw eventsRes.error;
      if (innovatorsRes.error) throw innovatorsRes.error;
      if (profilesRes.error) throw profilesRes.error;

      setChallenges(challengesRes.data || []);
      setFocusQuestions(focusQuestionsRes.data || []);
      setCampaigns(campaignsRes.data || []);
      setEvents(eventsRes.data || []);
      
      // Map profiles to innovators
      const profilesMap = new Map((profilesRes.data || []).map(p => [p.id, p]));
      const enrichedInnovators = (innovatorsRes.data || []).map(innovator => {
        const profile = profilesMap.get(innovator.user_id);
         return {
           ...innovator,
           display_name: profile?.name_ar || profile?.name || `${t('idea_wizard.innovator_prefix')} ${innovator.user_id?.slice(0, 8) || t('idea_wizard.not_specified')}`
         };
      });
      setInnovators(enrichedInnovators);
    } catch (error) {
      // Failed to fetch idea wizard data
    }
  };

  const validateBasicInfo = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title_ar.trim()) {
      newErrors.title_ar = t('idea_wizard.title_required');
    } else if (formData.title_ar.length < 10) {
      newErrors.title_ar = t('idea_wizard.title_min_length');
    }
    
    if (!formData.description_ar.trim()) {
      newErrors.description_ar = t('idea_wizard.description_required');
    } else if (formData.description_ar.length < 50) {
      newErrors.description_ar = t('idea_wizard.description_min_length');
    }
    
    if (!formData.innovator_id) {
      newErrors.innovator_id = t('idea_wizard.innovator_required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDetails = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.status) {
      newErrors.status = t('idea_wizard.status_required');
    }
    
    if (!formData.maturity_level) {
      newErrors.maturity_level = t('idea_wizard.maturity_required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAssociations = () => {
    const newErrors: Record<string, string> = {};
    
    // Only validate mandatory associations if status is not draft
    if (formData.status !== 'draft') {
      if (!formData.challenge_id || formData.challenge_id.trim() === "") {
        newErrors.challenge_id = t('idea_wizard.challenge_required_when_submitted');
      }
      
      if (!formData.focus_question_id || formData.focus_question_id.trim() === "") {
        newErrors.focus_question_id = t('idea_wizard.focus_question_required_when_submitted');
      }
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
        innovator_id: formData.innovator_id, // Now correctly references innovators.id
        challenge_id: formData.challenge_id && formData.challenge_id.trim() !== "" ? formData.challenge_id : null,
        focus_question_id: formData.focus_question_id && formData.focus_question_id.trim() !== "" ? formData.focus_question_id : null,
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
          title: t('idea_wizard.update_success_title'),
          description: t('idea_wizard.update_success_description'),
        });
      } else {
        // Create new idea
        const { error } = await supabase
          .from('ideas')
          .insert([ideaData]);

        if (error) throw error;
        
        toast({
          title: t('idea_wizard.create_success_title'),
          description: t('idea_wizard.create_success_description'),
        });
      }

      onSave();
      onClose();
    } catch (error: Error | unknown) {
      // Failed to save idea - show error to user
      
      // Handle specific database errors
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (errorMessage.includes('duplicate')) {
        setErrors({ title_ar: t('idea_wizard.duplicate_title_error') });
      } else if (errorMessage.includes('constraint')) {
        setErrors({ general: t('idea_wizard.constraint_error') });
      } else {
        toast({
          title: t('idea_wizard.save_error_title'),
          description: errorMessage || t('idea_wizard.save_error_description'),
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

  // Filter challenges based on selected campaign/event
  const filteredChallenges = challenges; // For now, show all challenges until linking tables are implemented

  const steps = [
    {
      id: "basic-info",
      title: t('idea_wizard.basic_info_title'),
      description: t('idea_wizard.basic_info_description'),
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
            <Label htmlFor="title_ar">{t('idea_wizard.title_label')}</Label>
            <Input
              id="title_ar"
              value={formData.title_ar}
              onChange={(e) => {
                setFormData({ ...formData, title_ar: e.target.value });
                if (errors.title_ar) {
                  setErrors({ ...errors, title_ar: "" });
                }
              }}
              placeholder={t('idea_wizard.title_placeholder')}
              dir="rtl"
              className={errors.title_ar ? "border-destructive" : ""}
            />
            {errors.title_ar ? (
              <p className="text-sm text-destructive">{errors.title_ar}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t('idea_wizard.title_help')}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description_ar">{t('idea_wizard.description_label')}</Label>
            <Textarea
              id="description_ar"
              value={formData.description_ar}
              onChange={(e) => {
                setFormData({ ...formData, description_ar: e.target.value });
                if (errors.description_ar) {
                  setErrors({ ...errors, description_ar: "" });
                }
              }}
              placeholder={t('idea_wizard.description_placeholder')}
              rows={4}
              dir="rtl"
              className={errors.description_ar ? "border-destructive" : ""}
            />
            {errors.description_ar ? (
              <p className="text-sm text-destructive">{errors.description_ar}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t('idea_wizard.description_help')}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="innovator_id">{t('idea_wizard.innovator_label')}</Label>
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
                <SelectValue placeholder={t('idea_wizard.innovator_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                 {innovators.map((innovator) => (
                   <SelectItem key={innovator.id} value={innovator.id}>
                     {innovator.display_name} ({t('idea_wizard.points_label')}: {innovator.innovation_score})
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
      id: "campaigns-events",
      title: "الحملات والفعاليات",
      description: "ربط الفكرة بالحملات والفعاليات (اختياري)",
      validation: () => true, // Always valid as optional
      content: (
        <div className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              ربط الفكرة بالحملات والفعاليات اختياري. إذا تم اختيار حملة أو فعالية، ستتم تصفية التحديات المتاحة في الخطوة التالية.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="campaign_id">الحملة</Label>
              <Select 
                value={formData.campaign_id} 
                onValueChange={(value) => {
                  setFormData({ 
                    ...formData, 
                    campaign_id: value,
                    challenge_id: "", // Reset challenge when campaign changes
                    focus_question_id: "" // Reset focus question
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحملة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون حملة</SelectItem>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.title_ar} ({campaign.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_id">الفعالية</Label>
              <Select 
                value={formData.event_id} 
                onValueChange={(value) => {
                  setFormData({ 
                    ...formData, 
                    event_id: value,
                    challenge_id: "", // Reset challenge when event changes
                    focus_question_id: "" // Reset focus question
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفعالية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون فعالية</SelectItem>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title_ar} ({event.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "challenges-questions",
      title: "التحديات والأسئلة المحورية",
      description: "ربط الفكرة بالتحديات والأسئلة المحورية",
      validation: validateAssociations,
      content: (
        <div className="space-y-6">
          {/* Status Information */}
          {formData.status === 'draft' && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                هذه الفكرة محفوظة كمسودة. يمكنك حفظها بدون ربط إجباري بالتحديات، ولكن ستحتاج لربطها عند تقديمها رسمياً.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Required Associations */}
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium text-sm">
              الربط المطلوب {formData.status === 'draft' ? '(عند التقديم)' : '*'}
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="challenge_id">التحدي المرتبط *</Label>
              <Select 
                value={formData.challenge_id} 
                onValueChange={(value) => {
                  setFormData({ ...formData, challenge_id: value, focus_question_id: "" });
                  if (errors.challenge_id) {
                    setErrors({ ...errors, challenge_id: "" });
                  }
                }}
              >
                <SelectTrigger className={errors.challenge_id ? "border-destructive" : ""}>
                  <SelectValue placeholder="اختر التحدي المرتبط" />
                </SelectTrigger>
                 <SelectContent>
                   {filteredChallenges.map((challenge) => (
                     <SelectItem key={challenge.id} value={challenge.id}>
                       {challenge.title_ar}
                     </SelectItem>
                   ))}
                 </SelectContent>
              </Select>
              {errors.challenge_id ? (
                <p className="text-sm text-destructive">{errors.challenge_id}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  اختر التحدي الذي تهدف الفكرة إلى حله
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="focus_question_id">السؤال المحوري المرتبط *</Label>
              <Select 
                value={formData.focus_question_id} 
                onValueChange={(value) => {
                  setFormData({ ...formData, focus_question_id: value });
                  if (errors.focus_question_id) {
                    setErrors({ ...errors, focus_question_id: "" });
                  }
                }}
                disabled={!formData.challenge_id}
              >
                <SelectTrigger className={errors.focus_question_id ? "border-destructive" : ""}>
                  <SelectValue placeholder="اختر السؤال المحوري المرتبط" />
                </SelectTrigger>
                <SelectContent>
                  {filteredFocusQuestions.map((question) => (
                    <SelectItem key={question.id} value={question.id}>
                      {question.question_text_ar.substring(0, 100)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.focus_question_id ? (
                <p className="text-sm text-destructive">{errors.focus_question_id}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {!formData.challenge_id 
                    ? 'اختر التحدي أولاً لعرض الأسئلة المحورية المرتبطة' 
                    : 'اختر السؤال المحوري الذي تجيب عليه الفكرة'
                  }
                </p>
              )}
            </div>
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