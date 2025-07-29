import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, ArrowRight, Lightbulb, Target, 
  FileText, Rocket, Check 
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AppShell } from '@/components/layout/AppShell';

interface IdeaFormData {
  title_ar: string;
  description_ar: string;
  challenge_id?: string;
  focus_question_id?: string;
  solution_approach: string;
  implementation_plan: string;
  expected_impact: string;
  resource_requirements: string;
}

interface Challenge {
  id: string;
  title_ar: string;
  description_ar: string;
}

interface FocusQuestion {
  id: string;
  question_text_ar: string;
  challenge_id: string;
}

const STEPS = [
  { id: 1, title: 'Basic Information', icon: Lightbulb },
  { id: 2, title: 'Challenge & Focus', icon: Target },
  { id: 3, title: 'Solution Details', icon: FileText },
  { id: 4, title: 'Implementation', icon: Rocket },
  { id: 5, title: 'Review & Submit', icon: Check },
];

export default function IdeaSubmissionWizard() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [focusQuestions, setFocusQuestions] = useState<FocusQuestion[]>([]);
  const [filteredFocusQuestions, setFilteredFocusQuestions] = useState<FocusQuestion[]>([]);
  
  const [formData, setFormData] = useState<IdeaFormData>({
    title_ar: '',
    description_ar: '',
    challenge_id: '',
    focus_question_id: '',
    solution_approach: '',
    implementation_plan: '',
    expected_impact: '',
    resource_requirements: ''
  });

  useEffect(() => {
    loadChallengesAndQuestions();
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
        supabase.from('challenges').select('id, title_ar, description_ar').eq('status', 'active'),
        supabase.from('focus_questions').select('id, question_text_ar, challenge_id')
      ]);

      if (challengesResponse.data) setChallenges(challengesResponse.data);
      if (questionsResponse.data) setFocusQuestions(questionsResponse.data);
    } catch (error) {
      console.error('Error loading challenges and questions:', error);
      toast.error('Error loading challenges and focus questions');
    }
  };

  const handleInputChange = (field: keyof IdeaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      toast.error('Please fill in all required fields before proceeding');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitIdea = async () => {
    if (!userProfile?.id) {
      toast.error('User not authenticated');
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

      const { data, error } = await supabase
        .from('ideas')
        .insert(ideaData)
        .select()
        .single();

      if (error) throw error;

      toast.success('Idea submitted successfully!');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error submitting idea:', error);
      toast.error('Error submitting idea. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title_ar">Idea Title (Arabic) *</Label>
              <Input
                id="title_ar"
                value={formData.title_ar}
                onChange={(e) => handleInputChange('title_ar', e.target.value)}
                placeholder="Enter your idea title in Arabic"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description_ar">Idea Description (Arabic) *</Label>
              <Textarea
                id="description_ar"
                value={formData.description_ar}
                onChange={(e) => handleInputChange('description_ar', e.target.value)}
                placeholder="Describe your idea in detail..."
                rows={6}
                className="mt-1"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="challenge">Select Challenge *</Label>
              <Select value={formData.challenge_id} onValueChange={(value) => handleInputChange('challenge_id', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a challenge" />
                </SelectTrigger>
                <SelectContent>
                  {challenges.map((challenge) => (
                    <SelectItem key={challenge.id} value={challenge.id}>
                      {challenge.title_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {filteredFocusQuestions.length > 0 && (
              <div>
                <Label htmlFor="focus_question">Focus Question (Optional)</Label>
                <Select value={formData.focus_question_id} onValueChange={(value) => handleInputChange('focus_question_id', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a focus question" />
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
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="solution_approach">Solution Approach *</Label>
              <Textarea
                id="solution_approach"
                value={formData.solution_approach}
                onChange={(e) => handleInputChange('solution_approach', e.target.value)}
                placeholder="Describe your proposed solution approach..."
                rows={4}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="expected_impact">Expected Impact *</Label>
              <Textarea
                id="expected_impact"
                value={formData.expected_impact}
                onChange={(e) => handleInputChange('expected_impact', e.target.value)}
                placeholder="What impact do you expect this idea to have?"
                rows={4}
                className="mt-1"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="implementation_plan">Implementation Plan *</Label>
              <Textarea
                id="implementation_plan"
                value={formData.implementation_plan}
                onChange={(e) => handleInputChange('implementation_plan', e.target.value)}
                placeholder="How would you implement this idea?"
                rows={4}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="resource_requirements">Resource Requirements *</Label>
              <Textarea
                id="resource_requirements"
                value={formData.resource_requirements}
                onChange={(e) => handleInputChange('resource_requirements', e.target.value)}
                placeholder="What resources would be needed?"
                rows={4}
                className="mt-1"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Review Your Idea</h3>
              <div className="space-y-4">
                <div>
                  <strong>Title:</strong> {formData.title_ar}
                </div>
                <div>
                  <strong>Description:</strong> {formData.description_ar}
                </div>
                <div>
                  <strong>Challenge:</strong> {challenges.find(c => c.id === formData.challenge_id)?.title_ar || 'Not selected'}
                </div>
                {formData.focus_question_id && (
                  <div>
                    <strong>Focus Question:</strong> {filteredFocusQuestions.find(fq => fq.id === formData.focus_question_id)?.question_text_ar}
                  </div>
                )}
                <div>
                  <strong>Solution Approach:</strong> {formData.solution_approach}
                </div>
                <div>
                  <strong>Expected Impact:</strong> {formData.expected_impact}
                </div>
                <div>
                  <strong>Implementation Plan:</strong> {formData.implementation_plan}
                </div>
                <div>
                  <strong>Resource Requirements:</strong> {formData.resource_requirements}
                </div>
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
      <PageLayout
        title="معالج تقديم الفكرة"
        description="شاركنا فكرتك الابتكارية خطوة بخطوة"
        maxWidth="lg"
        className="space-y-6"
      >
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Step {currentStep} of {STEPS.length}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-between items-center">
          {STEPS.map((step) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex flex-col items-center space-y-2">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2
                  ${isActive ? 'bg-primary text-primary-foreground border-primary' : 
                    isCompleted ? 'bg-primary/10 text-primary border-primary' : 
                    'bg-muted text-muted-foreground border-muted'}
                `}>
                  <StepIcon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(STEPS[currentStep - 1].icon, { className: "w-5 h-5" })}
              {STEPS[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            
            {currentStep < STEPS.length ? (
              <Button
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={submitIdea}
                disabled={loading || !validateStep(currentStep)}
              >
                {loading ? 'Submitting...' : 'Submit Idea'}
              </Button>
            )}
          </div>
        </div>
      </div>
      </PageLayout>
    </AppShell>
  );
}