import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Upload, 
  FileText, 
  Users, 
  Clock, 
  Award,
  Target,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  ArrowLeft,
  Send,
  Save,
  X
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface Challenge {
  id: string;
  title_ar: string;
  description_ar: string;
  challenge_type: string;
  end_date: string;
  estimated_budget: number;
  participants?: number;
}

interface EnhancedSubmissionDialogProps {
  challenge: Challenge | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmissionComplete?: () => void;
}

interface SubmissionData {
  title: string;
  description: string;
  approach: string;
  implementation: string;
  businessModel: string;
  expectedImpact: string;
  teamMembers: string;
  attachments: File[];
}

export const EnhancedSubmissionDialog = ({
  challenge,
  open,
  onOpenChange,
  onSubmissionComplete
}: EnhancedSubmissionDialogProps) => {
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submissionData, setSubmissionData] = useState<SubmissionData>({
    title: '',
    description: '',
    approach: '',
    implementation: '',
    businessModel: '',
    expectedImpact: '',
    teamMembers: '',
    attachments: []
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { 
      number: 1, 
      title: isRTL ? 'المعلومات الأساسية' : 'Basic Information',
      icon: Info,
      description: isRTL ? 'اسم المشروع ووصفه' : 'Project title and description'
    },
    { 
      number: 2, 
      title: isRTL ? 'الحل والتنفيذ' : 'Solution & Implementation',
      icon: Target,
      description: isRTL ? 'خطة الحل وآلية التنفيذ' : 'Solution approach and implementation plan'
    },
    { 
      number: 3, 
      title: isRTL ? 'النموذج التجاري' : 'Business Model',
      icon: Award,
      description: isRTL ? 'النموذج التجاري والأثر المتوقع' : 'Business model and expected impact'
    },
    { 
      number: 4, 
      title: isRTL ? 'الفريق والمرفقات' : 'Team & Attachments',
      icon: Users,
      description: isRTL ? 'أعضاء الفريق والملفات' : 'Team members and files'
    }
  ];

  const updateSubmissionData = (field: keyof SubmissionData, value: any) => {
    setSubmissionData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      updateSubmissionData('attachments', [...submissionData.attachments, ...fileArray]);
    }
  };

  const removeFile = (index: number) => {
    const newAttachments = submissionData.attachments.filter((_, i) => i !== index);
    updateSubmissionData('attachments', newAttachments);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return submissionData.title.trim().length >= 10 && submissionData.description.trim().length >= 50;
      case 2:
        return submissionData.approach.trim().length >= 100 && submissionData.implementation.trim().length >= 100;
      case 3:
        return submissionData.businessModel.trim().length >= 50 && submissionData.expectedImpact.trim().length >= 50;
      case 4:
        return submissionData.teamMembers.trim().length >= 10;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user || !challenge) return;

    try {
      setLoading(true);

      const submissionPayload = {
        challenge_id: challenge.id,
        submitted_by: user.id,
        title_ar: submissionData.title,
        description_ar: submissionData.description,
        solution_approach: submissionData.approach,
        implementation_plan: submissionData.implementation,
        business_model: submissionData.businessModel,
        expected_impact: submissionData.expectedImpact,
        team_members: JSON.parse(submissionData.teamMembers || '[]'),
        status: 'submitted',
        submission_date: new Date().toISOString()
      };

      const { error } = await supabase
        .from('challenge_submissions')
        .insert(submissionPayload);

      if (error) throw error;

      toast({
        title: isRTL ? 'تم تسليم المشروع بنجاح!' : 'Submission Successful!',
        description: isRTL ? 
          'تم تسليم مشروعك بنجاح. سيتم مراجعته قريباً.' : 
          'Your submission has been received and will be reviewed soon.',
      });

      onSubmissionComplete?.();
      onOpenChange(false);
      
      // Reset form
      setCurrentStep(1);
      setSubmissionData({
        title: '',
        description: '',
        approach: '',
        implementation: '',
        businessModel: '',
        expectedImpact: '',
        teamMembers: '',
        attachments: []
      });

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: isRTL ? 'خطأ في التسليم' : 'Submission Error',
        description: isRTL ? 'حدث خطأ أثناء تسليم المشروع' : 'An error occurred while submitting',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isRTL ? 'عنوان المشروع' : 'Project Title'} *
              </label>
              <Input
                value={submissionData.title}
                onChange={(e) => updateSubmissionData('title', e.target.value)}
                placeholder={isRTL ? 'أدخل عنوان مشروعك المبتكر...' : 'Enter your innovative project title...'}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground">
                {submissionData.title.length}/10 {isRTL ? 'حرف على الأقل' : 'characters minimum'}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isRTL ? 'وصف المشروع' : 'Project Description'} *
              </label>
              <Textarea
                value={submissionData.description}
                onChange={(e) => updateSubmissionData('description', e.target.value)}
                placeholder={isRTL ? 
                  'اشرح فكرة مشروعك، المشكلة التي يحلها، والفئة المستهدفة...' : 
                  'Explain your project idea, the problem it solves, and target audience...'
                }
                rows={6}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground">
                {submissionData.description.length}/50 {isRTL ? 'حرف على الأقل' : 'characters minimum'}
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isRTL ? 'نهج الحل' : 'Solution Approach'} *
              </label>
              <Textarea
                value={submissionData.approach}
                onChange={(e) => updateSubmissionData('approach', e.target.value)}
                placeholder={isRTL ? 
                  'اشرح كيف سيحل مشروعك المشكلة المطروحة في التحدي...' : 
                  'Explain how your project will solve the challenge problem...'
                }
                rows={5}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground">
                {submissionData.approach.length}/100 {isRTL ? 'حرف على الأقل' : 'characters minimum'}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isRTL ? 'خطة التنفيذ' : 'Implementation Plan'} *
              </label>
              <Textarea
                value={submissionData.implementation}
                onChange={(e) => updateSubmissionData('implementation', e.target.value)}
                placeholder={isRTL ? 
                  'اشرح خطة تنفيذ المشروع، المراحل، والجدول الزمني...' : 
                  'Explain the implementation plan, phases, and timeline...'
                }
                rows={5}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground">
                {submissionData.implementation.length}/100 {isRTL ? 'حرف على الأقل' : 'characters minimum'}
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isRTL ? 'النموذج التجاري' : 'Business Model'} *
              </label>
              <Textarea
                value={submissionData.businessModel}
                onChange={(e) => updateSubmissionData('businessModel', e.target.value)}
                placeholder={isRTL ? 
                  'اشرح كيف سيحقق المشروع الإيرادات ونموذج الاستدامة المالية...' : 
                  'Explain revenue generation and financial sustainability model...'
                }
                rows={4}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isRTL ? 'الأثر المتوقع' : 'Expected Impact'} *
              </label>
              <Textarea
                value={submissionData.expectedImpact}
                onChange={(e) => updateSubmissionData('expectedImpact', e.target.value)}
                placeholder={isRTL ? 
                  'اشرح الأثر المتوقع لمشروعك على المجتمع والاقتصاد...' : 
                  'Explain the expected impact on society and economy...'
                }
                rows={4}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isRTL ? 'أعضاء الفريق' : 'Team Members'} *
              </label>
              <Textarea
                value={submissionData.teamMembers}
                onChange={(e) => updateSubmissionData('teamMembers', e.target.value)}
                placeholder={isRTL ? 
                  'اذكر أعضاء فريقك ومهاراتهم (JSON format)' : 
                  'List team members and their skills (JSON format)'
                }
                rows={4}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isRTL ? 'المرفقات' : 'Attachments'}
              </label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  {isRTL ? 'اختر الملفات أو اسحبها هنا' : 'Choose files or drag them here'}
                </p>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Button variant="outline" size="sm" asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {isRTL ? 'اختر الملفات' : 'Choose Files'}
                  </label>
                </Button>
              </div>

              {submissionData.attachments.length > 0 && (
                <div className="space-y-2">
                  {submissionData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!challenge) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Send className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {isRTL ? 'تسليم مشروع' : 'Submit Project'}
                </h2>
                <p className="text-muted-foreground">
                  {challenge.title_ar}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{isRTL ? 'التقدم' : 'Progress'}</span>
                <span>{currentStep} / {totalSteps}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Steps */}
            <div className="flex justify-between">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div key={step.number} className="flex flex-col items-center space-y-2 flex-1">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                      isActive && "bg-primary text-primary-foreground scale-110",
                      isCompleted && "bg-green-500 text-white",
                      !isActive && !isCompleted && "bg-muted text-muted-foreground"
                    )}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium">{step.title}</p>
                      <p className="text-xs text-muted-foreground hidden md:block">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="py-6">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isRTL ? 'السابق' : 'Previous'}
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              {isRTL ? 'حفظ كمسودة' : 'Save Draft'}
              <Save className="w-4 h-4 ml-2" />
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!validateCurrentStep()}
                className="transition-all duration-200"
              >
                {isRTL ? 'التالي' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!validateCurrentStep() || loading}
                className="transition-all duration-200"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {isRTL ? 'تسليم المشروع' : 'Submit Project'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};