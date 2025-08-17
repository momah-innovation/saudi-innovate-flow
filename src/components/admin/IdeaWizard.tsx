import { useState, useEffect } from "react";
import { useIdeaManagement } from "@/hooks/useIdeaManagement";
import { useChallengeList } from "@/hooks/useChallengeList";
import { useFocusQuestionManagement } from "@/hooks/useFocusQuestionManagement";
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
import { useUnifiedLoading } from "@/hooks/useUnifiedLoading";
import { createErrorHandler } from "@/utils/unified-error-handler";

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
  const { createIdea, updateIdea } = useIdeaManagement();
  const { challenges } = useChallengeList();
  const { focusQuestions } = useFocusQuestionManagement();
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

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [innovators, setInnovators] = useState<Innovator[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { isLoading, withLoading } = useUnifiedLoading({
    component: 'IdeaWizard',
    showToast: true,
    logErrors: true,
    timeout: 30000
  });

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
      // Mock data for now - replace with actual API calls when available
      setCampaigns([]);
      setEvents([]);
      setInnovators([]);
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

  const errorHandler = createErrorHandler({
    component: 'IdeaWizard',
    showToast: false,
    logError: true
  });

  const handleSave = async () => {
    setErrors({});
    
    const result = await withLoading('save', async () => {
      const ideaData = {
        title_ar: formData.title_ar.trim(),
        description_ar: formData.description_ar.trim(),
        status: formData.status,
        maturity_level: formData.maturity_level,
        innovator_id: formData.innovator_id,
        challenge_id: formData.challenge_id && formData.challenge_id.trim() !== "" ? formData.challenge_id : null,
        focus_question_id: formData.focus_question_id && formData.focus_question_id.trim() !== "" ? formData.focus_question_id : null,
        solution_approach: formData.solution_approach.trim() || null,
        implementation_plan: formData.implementation_plan.trim() || null,
        expected_impact: formData.expected_impact.trim() || null,
        resource_requirements: formData.resource_requirements.trim() || null,
      };

      if (idea?.id) {
        await updateIdea(idea.id, ideaData);
        return 'update';
      } else {
        await createIdea(ideaData);
        return 'create';
      }
    }, {
      successMessage: idea?.id ? t('idea_wizard.update_success_description') : t('idea_wizard.create_success_description'),
      errorMessage: idea?.id ? t('idea_wizard.save_error_description') : t('idea_wizard.save_error_description'),
      logContext: { ideaId: idea?.id, status: formData.status, maturityLevel: formData.maturity_level }
    });

    if (result) {
      onSave();
      onClose();
    }
  };

  // Filter focus questions based on selected challenge
  const filteredFocusQuestions = focusQuestions.filter(fq => 
    !formData.challenge_id || fq.challenge_id === formData.challenge_id || !fq.challenge_id
  );

  // Filter challenges based on selected campaign/event
  const filteredChallenges = challenges;

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
      title: t('idea_wizard.details_title'),
      description: t('idea_wizard.details_description'),
      validation: validateDetails,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">{t('idea_wizard.status_label')} *</Label>
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
              <Label htmlFor="maturity_level">{t('idea_wizard.maturity_label')} *</Label>
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
      title: t('idea_wizard.campaigns_events_title'),
      description: t('idea_wizard.campaigns_events_description'),
      validation: () => true, // Always valid as optional
      content: (
        <div className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t('idea_wizard.campaigns_events_note')}
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="campaign_id">{t('idea_wizard.campaign_label')}</Label>
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
                  <SelectValue placeholder={t('idea_wizard.campaign_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('idea_wizard.campaign_none')}</SelectItem>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.title_ar} ({campaign.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_id">{t('idea_wizard.event_label')}</Label>
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
                  <SelectValue placeholder={t('idea_wizard.event_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('idea_wizard.event_none')}</SelectItem>
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
      title: t('idea_wizard.challenges_questions_title'),
      description: t('idea_wizard.challenges_questions_description'),
      validation: validateAssociations,
      content: (
        <div className="space-y-6">
          {/* Status Information */}
          {formData.status === 'draft' && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('idea_wizard.draft_note')}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Required Associations */}
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium text-sm">
              {t('idea_wizard.required_linking')} {formData.status === 'draft' ? `(${t('idea_wizard.required_when_submitting')})` : '*'}
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="challenge_id">{t('idea_wizard.challenge_label')} *</Label>
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
                  <SelectValue placeholder={t('idea_wizard.challenge_placeholder')} />
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
                  {t('idea_wizard.challenge_help')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="focus_question_id">{t('idea_wizard.focus_question_label')} *</Label>
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
                  <SelectValue placeholder={t('idea_wizard.focus_question_placeholder')} />
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
                    ? t('idea_wizard.focus_question_help_no_challenge')
                    : t('idea_wizard.focus_question_help')
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
      title: t('idea_wizard.additional_content_title'),
      description: t('idea_wizard.additional_content_description'),
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="solution_approach">{t('idea_wizard.solution_approach_label')}</Label>
            <Textarea
              id="solution_approach"
              value={formData.solution_approach}
              onChange={(e) => setFormData({ ...formData, solution_approach: e.target.value })}
              placeholder={t('idea_wizard.solution_approach_placeholder')}
              rows={3}
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="implementation_plan">{t('idea_wizard.implementation_plan_label')}</Label>
            <Textarea
              id="implementation_plan"
              value={formData.implementation_plan}
              onChange={(e) => setFormData({ ...formData, implementation_plan: e.target.value })}
              placeholder={t('idea_wizard.implementation_plan_placeholder')}
              rows={3}
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected_impact">{t('idea_wizard.expected_impact_label')}</Label>
            <Textarea
              id="expected_impact"
              value={formData.expected_impact}
              onChange={(e) => setFormData({ ...formData, expected_impact: e.target.value })}
              placeholder={t('idea_wizard.expected_impact_placeholder')}
              rows={3}
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resource_requirements">{t('idea_wizard.resource_requirements_label')}</Label>
            <Textarea
              id="resource_requirements"
              value={formData.resource_requirements}
              onChange={(e) => setFormData({ ...formData, resource_requirements: e.target.value })}
              placeholder={t('idea_wizard.resource_requirements_placeholder')}
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
        
      }}
      title={idea ? t('idea_wizard.edit_title') : t('idea_wizard.create_title')}
      steps={steps}
      onComplete={handleSave}
      showProgress={true}
      allowSkip={false}
    />
  );
}