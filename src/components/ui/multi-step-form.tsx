import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";

interface FormStep {
  id: string;
  title: string;
  description?: string;
  content: ReactNode;
  validation?: () => Promise<boolean> | boolean;
}

interface MultiStepFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  steps: FormStep[];
  onComplete: () => void;
  showProgress?: boolean;
  allowSkip?: boolean;
}

export function MultiStepForm({
  isOpen,
  onClose,
  title,
  steps,
  onComplete,
  showProgress = true,
  allowSkip = false
}: MultiStepFormProps) {
  const { t } = useUnifiedTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isValidating, setIsValidating] = useState(false);

  const handleNext = async () => {
    const step = steps[currentStep];
    
    if (step.validation) {
      setIsValidating(true);
      try {
        const isValid = await step.validation();
        if (!isValid) {
          setIsValidating(false);
          return;
        }
      } catch (error) {
        setIsValidating(false);
        return;
      }
      setIsValidating(false);
    }

    if (currentStep === steps.length - 1) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{title}</span>
            <span className="text-sm font-normal text-muted-foreground">
              {t('step')} {currentStep + 1} {t('of')} {steps.length}
            </span>
          </DialogTitle>
        </DialogHeader>

        {showProgress && (
          <div className="space-y-4">
            <Progress value={progressPercentage} className="h-2" />
            
            {/* Step indicators with icons and titles */}
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center space-y-2 flex-1">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                    ${index <= currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {index + 1}
                  </div>
                  <span className={`
                    text-sm text-center leading-tight max-w-[100px] font-medium
                    ${index <= currentStep 
                      ? 'text-foreground' 
                      : 'text-muted-foreground'
                    }
                  `}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{currentStepData.title}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
              {currentStepData.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {currentStepData.description}
                </p>
              )}
            </div>
            
            <div className="space-y-4">
              {currentStepData.content}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              {t('previous')}
            </Button>
            
            {allowSkip && currentStep < steps.length - 1 && (
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                {t('skip')}
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              {t('cancel')}
            </Button>
            <Button 
              onClick={handleNext}
              disabled={isValidating}
              className="gap-2"
            >
              {isValidating ? (
                t('validating')
              ) : currentStep === steps.length - 1 ? (
                t('complete')
              ) : (
                <>
                  {t('next')}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}