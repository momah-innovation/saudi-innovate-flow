import React, { useState, useEffect } from 'react';
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
    
    // Auto-save functionality
    const autoSaveInterval = setInterval(() => {
      if (formData.title_ar.trim() || formData.description_ar.trim()) {
        autoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, []);

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
    if (!userProfile?.id || autoSaving) return;
    
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
        await supabase.from('ideas').update(ideaData).eq('id', draftId);
      } else {
        const { data, error } = await supabase
          .from('ideas')
          .insert(ideaData)
          .select()
          .single();
        
        if (error) throw error;
        setDraftId(data.id);
      }
      
      toast.success(isRTL ? 'تم حفظ المسودة تلقائياً' : 'Draft auto-saved', { duration: 2000 });
    } catch (error) {
      console.error('Auto-save error:', error);
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
        tags: [],
        collaboration_open: false,
        estimated_timeline: '',
        innovation_level: 'incremental'
      });
      
      setDraftId(id);
      setShowDrafts(false);
      
      toast.success(isRTL ? 'تم تحميل المسودة بنجاح' : 'Draft loaded successfully');
    } catch (error) {
      console.error('Error loading draft:', error);
      toast.error(isRTL ? 'خطأ في تحميل المسودة' : 'Error loading draft');
    }
  };

  const handleInputChange = (field: keyof IdeaFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    } else {
      toast.error(isRTL ? 'يرجى ملء جميع الحقول المطلوبة قبل المتابعة' : 'Please fill in all required fields before proceeding');
    }
  };

  const prevStep = () => {
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
              <div className="flex gap-2 mt-1">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder={isRTL ? 'أضف علامة...' : 'Add a tag...'}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
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
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            {isRTL ? 'معالج تقديم الفكرة الابتكارية' : 'Innovation Idea Submission Wizard'}
          </h1>
          <p className="text-muted-foreground">
            {isRTL ? 'شاركنا فكرتك الابتكارية خطوة بخطوة' : 'Share your innovative idea step by step'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {isRTL ? `الخطوة ${currentStep} من ${STEPS.length}` : `Step ${currentStep} of ${STEPS.length}`}
            </span>
            <div className="flex items-center gap-2">
              {autoSaving && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Save className="w-3 h-3 animate-pulse" />
                  {isRTL ? 'جاري الحفظ...' : 'Auto-saving...'}
                </div>
              )}
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% {isRTL ? 'مكتمل' : 'Complete'}
              </span>
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-between items-center overflow-x-auto pb-2">
          {STEPS.map((step) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex flex-col items-center space-y-2 min-w-[120px]">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
                  ${isActive ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-110' : 
                    isCompleted ? 'bg-primary/10 text-primary border-primary' : 
                    'bg-muted text-muted-foreground border-muted'}
                `}>
                  <StepIcon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className={`text-sm font-medium block ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {isRTL ? step.title : step.titleEn}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {step.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <Card className="border-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              {React.createElement(STEPS[currentStep - 1].icon, { className: "w-6 h-6 text-primary" })}
              {isRTL ? STEPS[currentStep - 1].title : STEPS[currentStep - 1].titleEn}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {isRTL ? 'السابق' : 'Previous'}
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            
            {currentStep < STEPS.length ? (
              <Button
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
                className="flex items-center gap-2"
              >
                {isRTL ? 'التالي' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={submitIdea}
                disabled={loading || !validateStep(currentStep)}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isRTL ? 'جاري الإرسال...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    {isRTL ? 'إرسال الفكرة' : 'Submit Idea'}
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