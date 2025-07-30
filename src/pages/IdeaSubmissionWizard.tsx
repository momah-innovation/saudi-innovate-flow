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

const STEPS = [
  { id: 1, title: 'المعلومات الأساسية', titleEn: 'Basic Information', icon: Lightbulb, description: 'عنوان ووصف الفكرة' },
  { id: 2, title: 'التحدي والتركيز', titleEn: 'Challenge & Focus', icon: Target, description: 'اختيار التحدي والسؤال المحوري' },
  { id: 3, title: 'تفاصيل الحل', titleEn: 'Solution Details', icon: FileText, description: 'نهج الحل والتأثير المتوقع' },
  { id: 4, title: 'خطة التنفيذ', titleEn: 'Implementation', icon: Rocket, description: 'خطة التنفيذ والموارد المطلوبة' },
  { id: 5, title: 'المراجعة والإرسال', titleEn: 'Review & Submit', icon: Check, description: 'مراجعة نهائية وإرسال الفكرة' },
];

const INNOVATION_LEVELS = [
  { value: 'incremental', label: 'تحسين تدريجي', labelEn: 'Incremental' },
  { value: 'radical', label: 'ابتكار جذري', labelEn: 'Radical' },
  { value: 'disruptive', label: 'ابتكار تحويلي', labelEn: 'Disruptive' }
];

export default function IdeaSubmissionWizard() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const { isRTL } = useDirection();
  
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
    const autoSaveInterval = setInterval(() => {
      if (formData.title_ar.trim() || formData.description_ar.trim()) {
        autoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, []);

  const loadPredefinedTags = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'idea_predefined_tags')
        .single();

      if (data && !error && data.setting_value) {
        const tags = JSON.parse(data.setting_value as string);
        setPredefinedTags(Array.isArray(tags) ? tags : []);
      }
    } catch (error) {
      console.error('Error loading predefined tags:', error);
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
      const [challengesResponse, questionsResponse] = await Promise.all([
        supabase.from('challenges').select('id, title_ar, description_ar, sector_id, priority_level').eq('status', 'active'),
        supabase.from('focus_questions').select('id, question_text_ar, challenge_id')
      ]);

      if (challengesResponse.data) setChallenges(challengesResponse.data);
      if (questionsResponse.data) setFocusQuestions(questionsResponse.data);
    } catch (error) {
      console.error('Error loading challenges and questions:', error);
      toast.error(isRTL ? 'خطأ في تحميل التحديات والأسئلة المحورية' : 'Error loading challenges and focus questions');
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
      console.error('Error loading drafts:', error);
    }
  };

  const autoSave = async () => {
    if (!userProfile?.id || autoSaving || (!formData.title_ar.trim() && !formData.description_ar.trim())) {
      return;
    }

    try {
      setAutoSaving(true);
      
      const ideaData = {
        ...formData,
        innovator_id: userProfile.id,
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
          .single();
        
        if (error) throw error;
        if (data) setDraftId(data.id);
      }
      
      toast.success(isRTL ? 'تم حفظ المسودة تلقائياً' : 'Draft auto-saved', { duration: 2000 });
    } catch (error) {
      console.error('Auto-save error:', error);
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
        .single();

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
      
      toast.success(isRTL ? 'تم تحميل المسودة بنجاح' : 'Draft loaded successfully');
    } catch (error) {
      console.error('Error loading draft:', error);
      toast.error(isRTL ? 'خطأ في تحميل المسودة' : 'Error loading draft');
    }
  };

  const debounceRef = useRef<NodeJS.Timeout>();

  const handleInputChange = async (field: keyof IdeaFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Debounced auto-save on significant content changes
    if (field === 'title_ar' || field === 'description_ar' || field === 'solution_approach' || field === 'implementation_plan') {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
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
      toast.error(isRTL ? 'يرجى ملء جميع الحقول المطلوبة قبل المتابعة' : 'Please fill in all required fields before proceeding');
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
      toast.error(isRTL ? 'المستخدم غير مسجل الدخول' : 'User not authenticated');
      return;
    }

    try {
      setLoading(true);
      
      const ideaData = {
        ...formData,
        innovator_id: userProfile.id,
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
          .single();
      } else {
        result = await supabase
          .from('ideas')
          .insert(ideaData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast.success(isRTL ? 'تم إرسال الفكرة بنجاح!' : 'Idea submitted successfully!');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error submitting idea:', error);
      toast.error(isRTL ? 'خطأ في إرسال الفكرة. يرجى المحاولة مرة أخرى.' : 'Error submitting idea. Please try again.');
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
                {isRTL ? 'المعلومات الأساسية' : 'Basic Information'}
              </h3>
              {drafts.length > 0 && (
                <Dialog open={showDrafts} onOpenChange={setShowDrafts}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      {isRTL ? 'تحميل مسودة' : 'Load Draft'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{isRTL ? 'المسودات المحفوظة' : 'Saved Drafts'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                      {drafts.map((draft) => (
                        <Card key={draft.id} className="p-3 cursor-pointer hover:bg-muted/50" 
                              onClick={() => loadDraft(draft.id)}>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{draft.title_ar || 'Untitled'}</span>
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
                {isRTL ? 'عنوان الفكرة (عربي)' : 'Idea Title (Arabic)'} 
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title_ar"
                value={formData.title_ar}
                onChange={(e) => handleInputChange('title_ar', e.target.value)}
                placeholder={isRTL ? 'أدخل عنوان فكرتك بالعربية' : 'Enter your idea title in Arabic'}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description_ar" className="flex items-center gap-2">
                {isRTL ? 'وصف الفكرة (عربي)' : 'Idea Description (Arabic)'} 
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description_ar"
                value={formData.description_ar}
                onChange={(e) => handleInputChange('description_ar', e.target.value)}
                placeholder={isRTL ? 'اوصف فكرتك بالتفصيل...' : 'Describe your idea in detail...'}
                rows={6}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.description_ar.length}/500 {isRTL ? 'حرف' : 'characters'}
              </p>
            </div>

            <div>
              <Label className="flex items-center gap-2">
                {isRTL ? 'العلامات' : 'Tags'} 
                <span className="text-muted-foreground text-sm">({isRTL ? 'اختياري' : 'Optional'})</span>
              </Label>
              
              {/* Predefined Tags */}
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-2">
                  {isRTL ? 'اختر من العلامات المحددة مسبقاً:' : 'Select from predefined tags:'}
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
                  placeholder={isRTL ? 'أضف علامة مخصصة...' : 'Add custom tag...'}
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
                    {isRTL ? 'العلامات المختارة:' : 'Selected tags:'}
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
              {isRTL ? 'التحدي والتركيز' : 'Challenge & Focus'}
            </h3>
            
            <div>
              <Label htmlFor="challenge" className="flex items-center gap-2">
                {isRTL ? 'اختر التحدي' : 'Select Challenge'} 
                <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.challenge_id} onValueChange={(value) => handleInputChange('challenge_id', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={isRTL ? 'اختر تحدي' : 'Choose a challenge'} />
                </SelectTrigger>
                <SelectContent>
                  {challenges.map((challenge) => (
                    <SelectItem key={challenge.id} value={challenge.id}>
                      <div className="flex items-center gap-2">
                        <span>{challenge.title_ar}</span>
                        {challenge.priority_level === 'high' && (
                          <Badge variant="destructive" className="text-xs">
                            {isRTL ? 'عالي الأولوية' : 'High Priority'}
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
                  {isRTL ? 'السؤال المحوري' : 'Focus Question'} 
                  <span className="text-muted-foreground text-sm">({isRTL ? 'اختياري' : 'Optional'})</span>
                </Label>
                <Select value={formData.focus_question_id} onValueChange={(value) => handleInputChange('focus_question_id', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={isRTL ? 'اختر سؤال محوري' : 'Choose a focus question'} />
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
                {isRTL ? 'مستوى الابتكار' : 'Innovation Level'}
              </Label>
              <Select value={formData.innovation_level} onValueChange={(value) => handleInputChange('innovation_level', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INNOVATION_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {isRTL ? level.label : level.labelEn}
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
              {isRTL ? 'تفاصيل الحل' : 'Solution Details'}
            </h3>
            
            <div>
              <Label htmlFor="solution_approach" className="flex items-center gap-2">
                {isRTL ? 'نهج الحل' : 'Solution Approach'} 
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="solution_approach"
                value={formData.solution_approach}
                onChange={(e) => handleInputChange('solution_approach', e.target.value)}
                placeholder={isRTL ? 'اوصف النهج المقترح للحل...' : 'Describe your proposed solution approach...'}
                rows={4}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="expected_impact" className="flex items-center gap-2">
                {isRTL ? 'التأثير المتوقع' : 'Expected Impact'} 
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="expected_impact"
                value={formData.expected_impact}
                onChange={(e) => handleInputChange('expected_impact', e.target.value)}
                placeholder={isRTL ? 'ما التأثير المتوقع لهذه الفكرة؟' : 'What impact do you expect this idea to have?'}
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
                {isRTL ? 'مفتوح للتعاون مع فرق أخرى' : 'Open for collaboration with other teams'}
              </Label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Rocket className="w-5 h-5 text-primary" />
              {isRTL ? 'خطة التنفيذ' : 'Implementation Plan'}
            </h3>
            
            <div>
              <Label htmlFor="implementation_plan" className="flex items-center gap-2">
                {isRTL ? 'خطة التنفيذ' : 'Implementation Plan'} 
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="implementation_plan"
                value={formData.implementation_plan}
                onChange={(e) => handleInputChange('implementation_plan', e.target.value)}
                placeholder={isRTL ? 'كيف ستقوم بتنفيذ هذه الفكرة؟' : 'How would you implement this idea?'}
                rows={4}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="resource_requirements" className="flex items-center gap-2">
                {isRTL ? 'المتطلبات والموارد' : 'Resource Requirements'} 
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="resource_requirements"
                value={formData.resource_requirements}
                onChange={(e) => handleInputChange('resource_requirements', e.target.value)}
                placeholder={isRTL ? 'ما الموارد التي ستحتاجها؟' : 'What resources would be needed?'}
                rows={4}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="estimated_timeline" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {isRTL ? 'الجدول الزمني المقدر' : 'Estimated Timeline'}
              </Label>
              <Select value={formData.estimated_timeline} onValueChange={(value) => handleInputChange('estimated_timeline', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={isRTL ? 'اختر الجدول الزمني' : 'Select timeline'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-3months">{isRTL ? '1-3 أشهر' : '1-3 months'}</SelectItem>
                  <SelectItem value="3-6months">{isRTL ? '3-6 أشهر' : '3-6 months'}</SelectItem>
                  <SelectItem value="6-12months">{isRTL ? '6-12 شهر' : '6-12 months'}</SelectItem>
                  <SelectItem value="1year+">{isRTL ? 'أكثر من سنة' : '1+ years'}</SelectItem>
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
              {isRTL ? 'المراجعة والإرسال' : 'Review & Submit'}
            </h3>
            
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                {isRTL ? 
                  'يرجى مراجعة جميع المعلومات قبل الإرسال. سيتم إشعارك عند بدء مراجعة فكرتك.' :
                  'Please review all information before submitting. You will be notified when your idea review begins.'
                }
              </AlertDescription>
            </Alert>
            
            <div className="bg-muted/50 p-6 rounded-lg space-y-4">
              <h4 className="text-lg font-semibold">{isRTL ? 'ملخص الفكرة' : 'Idea Summary'}</h4>
              
              <div className="grid gap-4">
                <div>
                  <strong>{isRTL ? 'العنوان:' : 'Title:'}</strong>
                  <p className="mt-1">{formData.title_ar}</p>
                </div>
                
                <div>
                  <strong>{isRTL ? 'الوصف:' : 'Description:'}</strong>
                  <p className="mt-1 text-muted-foreground">{formData.description_ar}</p>
                </div>
                
                <div>
                  <strong>{isRTL ? 'التحدي:' : 'Challenge:'}</strong>
                  <p className="mt-1">{challenges.find(c => c.id === formData.challenge_id)?.title_ar || 'لم يتم اختياره'}</p>
                </div>
                
                {formData.focus_question_id && (
                  <div>
                    <strong>{isRTL ? 'السؤال المحوري:' : 'Focus Question:'}</strong>
                    <p className="mt-1">{filteredFocusQuestions.find(fq => fq.id === formData.focus_question_id)?.question_text_ar}</p>
                  </div>
                )}

                <div>
                  <strong>{isRTL ? 'مستوى الابتكار:' : 'Innovation Level:'}</strong>
                  <p className="mt-1">
                    {INNOVATION_LEVELS.find(l => l.value === formData.innovation_level)?.[isRTL ? 'label' : 'labelEn']}
                  </p>
                </div>
                
                <div>
                  <strong>{isRTL ? 'نهج الحل:' : 'Solution Approach:'}</strong>
                  <p className="mt-1 text-muted-foreground">{formData.solution_approach}</p>
                </div>
                
                <div>
                  <strong>{isRTL ? 'التأثير المتوقع:' : 'Expected Impact:'}</strong>
                  <p className="mt-1 text-muted-foreground">{formData.expected_impact}</p>
                </div>
                
                <div>
                  <strong>{isRTL ? 'خطة التنفيذ:' : 'Implementation Plan:'}</strong>
                  <p className="mt-1 text-muted-foreground">{formData.implementation_plan}</p>
                </div>
                
                <div>
                  <strong>{isRTL ? 'المتطلبات والموارد:' : 'Resource Requirements:'}</strong>
                  <p className="mt-1 text-muted-foreground">{formData.resource_requirements}</p>
                </div>

                {formData.tags.length > 0 && (
                  <div>
                    <strong>{isRTL ? 'العلامات:' : 'Tags:'}</strong>
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
                      {isRTL ? 'مفتوح للتعاون' : 'Open for collaboration'}
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
              {isRTL ? 'معالج تقديم الفكرة الابتكارية' : 'Innovation Idea Submission Wizard'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isRTL ? 'شاركنا فكرتك الابتكارية خطوة بخطوة وساعد في بناء مستقبل أفضل' : 'Share your innovative idea step by step and help build a better future'}
            </p>
          </div>

          {/* Enhanced Progress Section */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    {isRTL ? `الخطوة ${currentStep} من ${STEPS.length}` : `Step ${currentStep} of ${STEPS.length}`}
                  </span>
                  <div className="flex items-center gap-3">
                    {autoSaving && (
                      <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-3 py-1 rounded-full">
                        <Save className="w-4 h-4 animate-pulse" />
                        {isRTL ? 'جاري الحفظ...' : 'Auto-saving...'}
                      </div>
                    )}
                    <div className="text-sm font-medium text-primary">
                      {Math.round(progress)}% {isRTL ? 'مكتمل' : 'Complete'}
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
                      isCompleted ? 'bg-gradient-to-br from-green-400 to-green-600 text-white border-green-500 shadow-md' : 
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
                      {isRTL ? step.title : step.titleEn}
                    </span>
                    <span className="text-xs text-muted-foreground leading-tight">
                      {step.description}
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
                  {isRTL ? STEPS[currentStep - 1].title : STEPS[currentStep - 1].titleEn}
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
                  {isRTL ? 'السابق' : 'Previous'}
                </Button>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3"
                  >
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </Button>
                  
                  {currentStep < STEPS.length ? (
                    <Button
                      onClick={nextStep}
                      disabled={!validateStep(currentStep)}
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 disabled:opacity-50"
                    >
                      {isRTL ? 'التالي' : 'Next'}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  ) : (
                    <Button
                      onClick={submitIdea}
                      disabled={loading || !validateStep(currentStep)}
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 shadow-lg"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {isRTL ? 'جاري الإرسال...' : 'Submitting...'}
                        </>
                      ) : (
                        <>
                          <Rocket className="w-5 h-5" />
                          {isRTL ? 'إرسال الفكرة' : 'Submit Idea'}
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