import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ArrowLeft, ArrowRight, Lightbulb, Target, 
  FileText, Rocket, Check, Upload, X, Plus, 
  Save, Eye, AlertCircle, InfoIcon, Star,
  Users, Calendar, Clock, Sparkles
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useDirection } from '@/components/ui/direction-provider';
import { logger } from '@/utils/logger';
import { errorHandler } from '@/utils/error-handler';
import { useTimerManager } from '@/utils/timerManager';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface IdeaFormData {
  title_ar: string;
  description_ar: string;
  challenge_id?: string;
  focus_question_id?: string;
  solution_approach: string;
  implementation_plan: string;
  expected_impact: string;
  resource_requirements: string;
  tags: string[];
  collaboration_open: boolean;
  estimated_timeline: string;
  innovation_level: string;
}

interface Challenge {
  id: string;
  title_ar: string;
  description_ar: string;
  sector_id?: string;
  priority_level?: string;
}

interface FocusQuestion {
  id: string;
  question_text_ar: string;
  challenge_id: string;
}

interface IdeaDraft {
  id: string;
  title_ar: string;
  created_at: string;
}

// These arrays will be populated from translations
const STEPS = [
  { id: 1, key: 'basic_info', icon: Lightbulb },
  { id: 2, key: 'challenge_focus', icon: Target },
  { id: 3, key: 'solution_details', icon: FileText },
  { id: 4, key: 'implementation', icon: Rocket },
  { id: 5, key: 'review_submit', icon: Check }
];

const INNOVATION_LEVELS = [
  { value: 'incremental', key: 'incremental' },
  { value: 'radical', key: 'radical' },
  { value: 'disruptive', key: 'disruptive' }
];

export default function IdeaSubmissionWizard() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  
  // Predefined tags state
  const [predefinedTags, setPredefinedTags] = useState<string[]>([
    'الذكاء الاصطناعي', 'البيانات الضخمة', 'إنترنت الأشياء', 'البلوك تشين', 
    'الأمن السيبراني', 'التحول الرقمي', 'التطبيقات المحمولة', 'الحوسبة السحابية'
  ]);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [focusQuestions, setFocusQuestions] = useState<FocusQuestion[]>([]);
  const [filteredFocusQuestions, setFilteredFocusQuestions] = useState<FocusQuestion[]>([]);
  const [drafts, setDrafts] = useState<IdeaDraft[]>([]);
  const [showDrafts, setShowDrafts] = useState(false);
  
  const [formData, setFormData] = useState<IdeaFormData>({
    title_ar: '',
    description_ar: '',
    challenge_id: '',
    focus_question_id: '',
    solution_approach: '',
    implementation_plan: '',
    expected_impact: '',
    resource_requirements: '',
    tags: [],
    collaboration_open: false,
    estimated_timeline: '',
    innovation_level: 'incremental'
  });

  const [newTag, setNewTag] = useState('');
  const [draftId, setDraftId] = useState<string | null>(null);

  useEffect(() => {
    loadChallengesAndQuestions();
    loadDrafts();
    loadPredefinedTags();
    
    // Auto-save functionality
    const { setInterval: scheduleInterval } = useTimerManager();
    const clearAutoSave = scheduleInterval(() => {
      if (formData.title_ar.trim() || formData.description_ar.trim()) {
        autoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return clearAutoSave;
  }, []);

  const loadPredefinedTags = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'idea_predefined_tags')
        .maybeSingle();

      if (data && !error && data.setting_value) {
        const tags = JSON.parse(data.setting_value as string);
        setPredefinedTags(Array.isArray(tags) ? tags : []);
      }
    } catch (error) {
      logger.error('Error loading predefined tags', {}, error as Error);
    }
  };

  useEffect(() => {
    if (formData.challenge_id) {
      const filtered = focusQuestions.filter(fq => fq.challenge_id === formData.challenge_id);
      setFilteredFocusQuestions(filtered);
      // Reset focus question selection when challenge changes
      setFormData(prev => ({ ...prev, focus_question_id: '' }));
    }
  }, [formData.challenge_id, focusQuestions]);

  const loadChallengesAndQuestions = async () => {
    try {
      const { useIdeaSubmissionData } = await import('@/hooks/useIdeaSubmissionData');
      const { loadChallengesAndQuestions: loadData } = useIdeaSubmissionData();
      
      const data = await loadData();
      setChallenges(data.challenges);
      setFocusQuestions(data.focusQuestions);
    } catch (error) {
      logger.error('Error loading challenges and questions', {}, error as Error);
      toast.error(t('ideas:messages.error_loading'));
    }
  };

  const loadDrafts = async () => {
    if (!userProfile?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('id, title_ar, created_at')
        .eq('status', 'draft')
        .eq('innovator_id', userProfile.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setDrafts(data || []);
    } catch (error) {
      logger.error('Error loading drafts', {}, error as Error);
    }
  };

  const autoSave = async () => {
    if (!userProfile?.id || autoSaving || (!formData.title_ar.trim() && !formData.description_ar.trim())) {
      return;
    }

    try {
      setAutoSaving(true);
      
      // Ensure innovator exists first
      const { data: innovatorId, error: innovatorError } = await supabase.rpc('ensure_innovator_exists', {
        user_uuid: userProfile.id
      });
      
      if (innovatorError) throw innovatorError;

      const ideaData = {
        ...formData,
        innovator_id: innovatorId,
        challenge_id: formData.challenge_id || null,
        focus_question_id: formData.focus_question_id || null,
        status: 'draft',
        maturity_level: 'concept'
      };

      if (draftId) {
        const { error } = await supabase
          .from('ideas')
          .update(ideaData)
          .eq('id', draftId);
        
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('ideas')
          .insert(ideaData)
          .select()
          .maybeSingle();
        
        if (error) throw error;
        if (data) setDraftId(data.id);
      }
      
      toast.success(t('ideas:messages.draft_auto_saved'), { duration: 2000 });
    } catch (error) {
      logger.error('Auto-save error', {}, error as Error);
      // Don't show error toast for auto-save failures to avoid spam
    } finally {
      setAutoSaving(false);
    }
  };

  const loadDraft = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      
      setFormData({
        title_ar: data.title_ar || '',
        description_ar: data.description_ar || '',
        challenge_id: data.challenge_id || '',
        focus_question_id: data.focus_question_id || '',
        solution_approach: data.solution_approach || '',
        implementation_plan: data.implementation_plan || '',
        expected_impact: data.expected_impact || '',
        resource_requirements: data.resource_requirements || '',
        tags: data.tags || [],
        collaboration_open: data.collaboration_open || false,
        estimated_timeline: data.estimated_timeline || '',
        innovation_level: data.innovation_level || 'incremental'
      });
      
      setDraftId(id);
      setShowDrafts(false);
      
      toast.success(t('ideas:messages.draft_loaded'));
    } catch (error) {
      logger.error('Error loading draft', {}, error as Error);
      toast.error(t('ideas:messages.error_loading_draft'));
    }
  };

  const manualSave = async () => {
    await autoSave();
    if (!autoSaving) {
      toast.success(t('ideas:messages.draft_saved_manually'));
    }
  };

  const debounceRef = useRef<(() => void) | undefined>();

  const handleInputChange = async (field: keyof IdeaFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Debounced auto-save on significant content changes
    if (field === 'title_ar' || field === 'description_ar' || field === 'solution_approach' || field === 'implementation_plan') {
      if (debounceRef.current) debounceRef.current();
      const { setTimeout: scheduleTimeout } = useTimerManager();
      debounceRef.current = scheduleTimeout(() => {
        if (value && typeof value === 'string' && value.trim()) {
          autoSave();
        }
      }, 2000); // Auto-save 2 seconds after stopping typing
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      tags: prev.tags.filter(tag => tag !== tagToRemove) 
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.title_ar.trim() !== '' && formData.description_ar.trim() !== '';
      case 2:
        return formData.challenge_id !== '';
      case 3:
        return formData.solution_approach.trim() !== '' && formData.expected_impact.trim() !== '';
      case 4:
        return formData.implementation_plan.trim() !== '' && formData.resource_requirements.trim() !== '';
      case 5:
        return true;
      default:
        return false;
    }
  };

  const nextStep = async () => {
    if (validateStep(currentStep)) {
      // Auto-save when moving to next step
      if (formData.title_ar.trim() || formData.description_ar.trim()) {
        await autoSave();
      }
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    } else {
      toast.error(t('ideas:messages.validation_error'));
    }
  };

  const prevStep = async () => {
    // Auto-save when moving to previous step
    if (formData.title_ar.trim() || formData.description_ar.trim()) {
      await autoSave();
    }
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitIdea = async () => {
    if (!userProfile?.id) {
      toast.error(t('ideas:messages.user_not_authenticated'));
      return;
    }

    try {
      setLoading(true);
      
      // Ensure innovator exists first
      const { data: innovatorId, error: innovatorError } = await supabase.rpc('ensure_innovator_exists', {
        user_uuid: userProfile.id
      });
      
      if (innovatorError) throw innovatorError;
      
      const ideaData = {
        ...formData,
        innovator_id: innovatorId,
        challenge_id: formData.challenge_id || null,
        focus_question_id: formData.focus_question_id || null,
        status: 'pending',
        maturity_level: 'concept',
        feasibility_score: 0,
        impact_score: 0,
        innovation_score: 0,
        alignment_score: 0,
        overall_score: 0
      };

      let result;
      if (draftId) {
        result = await supabase
          .from('ideas')
          .update({ ...ideaData, status: 'pending' })
          .eq('id', draftId)
          .select()
          .maybeSingle();
      } else {
        result = await supabase
          .from('ideas')
          .insert(ideaData)
          .select()
          .maybeSingle();
      }

      if (result.error) throw result.error;

      toast.success(t('ideas:messages.submit_success'));
      navigate('/dashboard');
      
    } catch (error) {
      errorHandler.handleError(error, 'IdeaSubmissionWizard.handleSubmit');
      toast.error(t('ideas:messages.submit_error'));
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                {t('ideas:steps.basic_info.title')}
              </h3>
              {drafts.length > 0 && (
                <Dialog open={showDrafts} onOpenChange={setShowDrafts}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      {t('ideas:actions.load_draft')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('ideas:drafts.title')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                      {drafts.map((draft) => (
                        <Card key={draft.id} className="p-3 cursor-pointer hover:bg-muted/50" 
                              onClick={() => loadDraft(draft.id)}>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{draft.title_ar || t('ideas:drafts.untitled')}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(draft.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            <div>
              <Label htmlFor="title_ar" className="flex items-center gap-2">
                {t('ideas:fields.title')} 
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title_ar"
                value={formData.title_ar}
                onChange={(e) => handleInputChange('title_ar', e.target.value)}
                placeholder={t('ideas:fields.title_placeholder')}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description_ar" className="flex items-center gap-2">
                {t('ideas:fields.description')} 
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description_ar"
                value={formData.description_ar}
                onChange={(e) => handleInputChange('description_ar', e.target.value)}
                placeholder={t('ideas:fields.description_placeholder')}
                rows={6}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.description_ar.length}/500 {t('ideas:fields.characters')}
              </p>
            </div>

            <div>
              <Label className="flex items-center gap-2">
                {t('ideas:fields.tags')} 
                <span className="text-muted-foreground text-sm">({t('ideas:fields.tags_optional')})</span>
              </Label>
              
              {/* Predefined Tags */}
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-2">
                  {t('ideas:fields.tags_predefined')}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {predefinedTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={formData.tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => {
                        if (formData.tags.includes(tag)) {
                          removeTag(tag);
                        } else {
                          setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                        }
                      }}
                    >
                      {tag}
                      {formData.tags.includes(tag) && (
                        <X className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Custom Tag Input */}
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder={t('ideas:fields.tags_custom_placeholder')}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Selected Tags */}
              {formData.tags.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('ideas:fields.tags_selected')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 w-4 h-4"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              {t('ideas:steps.challenge_focus.title')}
            </h3>
            
            <div>
              <Label htmlFor="challenge" className="flex items-center gap-2">
                {t('ideas:fields.challenge')} 
                <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.challenge_id} onValueChange={(value) => handleInputChange('challenge_id', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={t('ideas:fields.challenge_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {challenges.map((challenge) => (
                    <SelectItem key={challenge.id} value={challenge.id}>
                      <div className="flex items-center gap-2">
                        <span>{challenge.title_ar}</span>
                        {challenge.priority_level === 'high' && (
                          <Badge variant="destructive" className="text-xs">
                            {t('ideas:fields.challenge_high_priority')}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {formData.challenge_id && (
                <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {challenges.find(c => c.id === formData.challenge_id)?.description_ar}
                  </p>
                </div>
              )}
            </div>
            
            {filteredFocusQuestions.length > 0 && (
              <div>
                <Label htmlFor="focus_question" className="flex items-center gap-2">
                  {t('ideas:fields.focus_question')} 
                  <span className="text-muted-foreground text-sm">({t('ideas:fields.focus_question_optional')})</span>
                </Label>
                <Select value={formData.focus_question_id} onValueChange={(value) => handleInputChange('focus_question_id', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t('ideas:fields.focus_question_placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredFocusQuestions.map((question) => (
                      <SelectItem key={question.id} value={question.id}>
                        {question.question_text_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label className="flex items-center gap-2">
                {t('ideas:fields.innovation_level')}
              </Label>
              <Select value={formData.innovation_level} onValueChange={(value) => handleInputChange('innovation_level', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INNOVATION_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {t(`ideas:innovation_levels.${level.key}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {t('ideas:steps.solution_details.title')}
            </h3>
            
            <div>
              <Label htmlFor="solution_approach" className="flex items-center gap-2">
                {t('ideas:fields.solution_approach')} 
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="solution_approach"
                value={formData.solution_approach}
                onChange={(e) => handleInputChange('solution_approach', e.target.value)}
                placeholder={t('ideas:fields.solution_approach_placeholder')}
                rows={4}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="expected_impact" className="flex items-center gap-2">
                {t('ideas:fields.expected_impact')} 
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="expected_impact"
                value={formData.expected_impact}
                onChange={(e) => handleInputChange('expected_impact', e.target.value)}
                placeholder={t('ideas:fields.expected_impact_placeholder')}
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Checkbox
                id="collaboration"
                checked={formData.collaboration_open}
                onCheckedChange={(checked) => handleInputChange('collaboration_open', checked as boolean)}
              />
              <Label htmlFor="collaboration" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {t('ideas:fields.collaboration_open')}
              </Label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Rocket className="w-5 h-5 text-primary" />
              {t('ideas:steps.implementation.title')}
            </h3>
            
            <div>
              <Label htmlFor="implementation_plan" className="flex items-center gap-2">
                {t('ideas:fields.implementation_plan')} 
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="implementation_plan"
                value={formData.implementation_plan}
                onChange={(e) => handleInputChange('implementation_plan', e.target.value)}
                placeholder={t('ideas:fields.implementation_plan_placeholder')}
                rows={4}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="resource_requirements" className="flex items-center gap-2">
                {t('ideas:fields.resource_requirements')} 
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="resource_requirements"
                value={formData.resource_requirements}
                onChange={(e) => handleInputChange('resource_requirements', e.target.value)}
                placeholder={t('ideas:fields.resource_requirements_placeholder')}
                rows={4}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="estimated_timeline" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {t('ideas:fields.timeline')}
              </Label>
              <Select value={formData.estimated_timeline} onValueChange={(value) => handleInputChange('estimated_timeline', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={t('ideas:fields.timeline_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-3months">{t('ideas:timelines.1_3_months')}</SelectItem>
                  <SelectItem value="3-6months">{t('ideas:timelines.3_6_months')}</SelectItem>
                  <SelectItem value="6-12months">{t('ideas:timelines.6_12_months')}</SelectItem>
                  <SelectItem value="1year+">{t('ideas:timelines.1_year_plus')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              {t('ideas:steps.review_submit.title')}
            </h3>
            
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                {t('ideas:review.info_message')}
              </AlertDescription>
            </Alert>
            
            <div className="bg-muted/50 p-6 rounded-lg space-y-4">
              <h4 className="text-lg font-semibold">{t('ideas:review.title')}</h4>
              
              <div className="grid gap-4">
                <div>
                  <strong>{t('ideas:review.field_title')}</strong>
                  <p className="mt-1">{formData.title_ar}</p>
                </div>
                
                <div>
                  <strong>{t('ideas:review.field_description')}</strong>
                  <p className="mt-1 text-muted-foreground">{formData.description_ar}</p>
                </div>
                
                <div>
                  <strong>{t('ideas:review.field_challenge')}</strong>
                  <p className="mt-1">{challenges.find(c => c.id === formData.challenge_id)?.title_ar || t('ideas:review.not_selected')}</p>
                </div>
                
                {formData.focus_question_id && (
                  <div>
                    <strong>{t('ideas:review.field_focus_question')}</strong>
                    <p className="mt-1">{filteredFocusQuestions.find(fq => fq.id === formData.focus_question_id)?.question_text_ar}</p>
                  </div>
                )}

                <div>
                  <strong>{t('ideas:review.field_innovation_level')}</strong>
                  <p className="mt-1">
                    {formData.innovation_level && t(`ideas:innovation_levels.${INNOVATION_LEVELS.find(l => l.value === formData.innovation_level)?.key}`)}
                  </p>
                </div>
                
                <div>
                  <strong>{t('ideas:review.field_solution_approach')}</strong>
                  <p className="mt-1 text-muted-foreground">{formData.solution_approach}</p>
                </div>
                
                <div>
                  <strong>{t('ideas:review.field_expected_impact')}</strong>
                  <p className="mt-1 text-muted-foreground">{formData.expected_impact}</p>
                </div>
                
                <div>
                  <strong>{t('ideas:review.field_implementation_plan')}</strong>
                  <p className="mt-1 text-muted-foreground">{formData.implementation_plan}</p>
                </div>
                
                <div>
                  <strong>{t('ideas:review.field_resource_requirements')}</strong>
                  <p className="mt-1 text-muted-foreground">{formData.resource_requirements}</p>
                </div>

                {formData.tags.length > 0 && (
                  <div>
                    <strong>{t('ideas:review.field_tags')}</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {formData.collaboration_open && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">
                      {t('ideas:review.field_collaboration')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <AppShell>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Hero Header with Animation */}
          <div className="text-center space-y-4 py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mb-4 animate-pulse">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('ideas:wizard.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('ideas:wizard.description')}
            </p>
          </div>

          {/* Enhanced Progress Section */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    {t('ideas:wizard.step_label', { current: currentStep, total: STEPS.length })}
                  </span>
                  <div className="flex items-center gap-3">
                    {autoSaving && (
                      <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-3 py-1 rounded-full">
                        <Save className="w-4 h-4 animate-pulse" />
                        {t('ideas:wizard.auto_saving')}
                      </div>
                    )}
                    <div className="text-sm font-medium text-primary">
                      {t('ideas:wizard.complete_percentage', { percent: Math.round(progress) })}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Progress value={progress} className="w-full h-3 bg-muted" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-20 rounded-full" 
                       style={{ width: `${progress}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Steps Indicator with Animations */}
          <div className="grid grid-cols-5 gap-4 p-6 bg-card rounded-xl border shadow-sm">
            {STEPS.map((step) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center space-y-3 group cursor-pointer">
                  <div className={`
                    relative w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 transform
                    ${isActive ? 'bg-gradient-to-br from-primary to-secondary text-white border-primary shadow-lg scale-110 animate-pulse' : 
                      isCompleted ? 'bg-gradient-primary text-white border-primary/50 shadow-md' : 
                      'bg-muted text-muted-foreground border-muted group-hover:border-primary/50 group-hover:scale-105'}
                  `}>
                    {isCompleted ? (
                      <Check className="w-8 h-8" />
                    ) : (
                      <StepIcon className="w-8 h-8" />
                    )}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                    )}
                  </div>
                  <div className="text-center space-y-1">
                    <span className={`text-sm font-semibold block transition-colors ${
                      isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
                    }`}>
                      {t(`ideas:steps.${step.key}.title`)}
                    </span>
                    <span className="text-xs text-muted-foreground leading-tight">
                      {t(`ideas:steps.${step.key}.description`)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Main Content Card */}
          <Card className="border-2 shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader className="pb-6 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardTitle className="flex items-center gap-3 text-2xl">
                {React.createElement(STEPS[currentStep - 1].icon, { 
                  className: "w-8 h-8 text-primary" 
                })}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {t(`ideas:steps.${STEPS[currentStep - 1].key}.title`)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 pb-8">
              <div className="animate-fade-in">
                {renderStepContent()}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Navigation with Better Styling */}
          <Card className="border bg-gradient-to-r from-card to-muted/20">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-6 py-3 disabled:opacity-50"
                >
                  <ArrowLeft className="w-5 h-5" />
                  {t('ideas:actions.previous')}
                </Button>

                 <div className="flex gap-3">
                   {/* Manual Save Button */}
                   <Button
                     variant="outline"
                     onClick={manualSave}
                     disabled={autoSaving || (!formData.title_ar.trim() && !formData.description_ar.trim())}
                     className="flex items-center gap-2 px-6 py-3"
                   >
                     <Save className={`w-4 h-4 ${autoSaving ? 'animate-pulse' : ''}`} />
                     {t('ideas:actions.save_draft')}
                   </Button>
                   
                   <Button
                     variant="outline"
                     onClick={() => navigate('/dashboard')}
                     className="px-6 py-3"
                   >
                     {t('ideas:actions.cancel')}
                   </Button>
                  
                  {currentStep < STEPS.length ? (
                    <Button
                      onClick={nextStep}
                      disabled={!validateStep(currentStep)}
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 disabled:opacity-50"
                    >
                      {t('ideas:actions.next')}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  ) : (
                    <Button
                      onClick={submitIdea}
                      disabled={loading || !validateStep(currentStep)}
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-primary hover:opacity-90 disabled:opacity-50 shadow-lg"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {t('ideas:wizard.submitting')}
                        </>
                      ) : (
                        <>
                          <Rocket className="w-5 h-5" />
                          {t('ideas:actions.submit')}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
