import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, Check, Target, Users, Star } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector
  placement?: 'top' | 'bottom' | 'left' | 'right';
  action?: {
    label: string;
    onClick: () => void;
  };
  showNext?: boolean;
  showSkip?: boolean;
}

interface ProductTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  currentStep?: number;
  className?: string;
}

export function ProductTour({
  steps,
  isOpen,
  onClose,
  onComplete,
  currentStep = 0,
  className
}: ProductTourProps) {
  const [activeStep, setActiveStep] = useState(currentStep);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const currentStepData = steps[activeStep];

  useEffect(() => {
    if (isOpen && currentStepData) {
      const element = document.querySelector(currentStepData.target) as HTMLElement;
      if (element) {
        setTargetElement(element);
        
        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Highlight element
        element.style.position = 'relative';
        element.style.zIndex = '1001';
        element.style.boxShadow = '0 0 0 4px rgba(124, 58, 237, 0.3)';
        element.style.borderRadius = '4px';
        
        // Calculate tooltip position
        const rect = element.getBoundingClientRect();
        const placement = currentStepData.placement || 'bottom';
        
        let top = 0;
        let left = 0;
        
        switch (placement) {
          case 'top':
            top = rect.top - 10;
            left = rect.left + rect.width / 2;
            break;
          case 'bottom':
            top = rect.bottom + 10;
            left = rect.left + rect.width / 2;
            break;
          case 'left':
            top = rect.top + rect.height / 2;
            left = rect.left - 10;
            break;
          case 'right':
            top = rect.top + rect.height / 2;
            left = rect.right + 10;
            break;
        }
        
        setTooltipPosition({ top, left });
      }
    }

    return () => {
      // Clean up highlighting
      if (targetElement) {
        targetElement.style.position = '';
        targetElement.style.zIndex = '';
        targetElement.style.boxShadow = '';
        targetElement.style.borderRadius = '';
      }
    };
  }, [isOpen, activeStep, currentStepData, targetElement]);

  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen || !currentStepData) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-1000" />
      
      {/* Tooltip */}
      <Card
        className={cn(
          "fixed z-1002 w-80 max-w-sm",
          className
        )}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {activeStep + 1} of {steps.length}
              </Badge>
              <Target className="w-4 h-4 text-primary" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{currentStepData.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentStepData.content}
            </p>

            {/* Custom Action */}
            {currentStepData.action && (
              <Button
                variant="outline"
                size="sm"
                onClick={currentStepData.action.onClick}
                className="w-full"
              >
                {currentStepData.action.label}
              </Button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t">
            <div className="flex gap-2">
              {currentStepData.showSkip !== false && (
                <Button variant="ghost" size="sm" onClick={handleSkip}>
                  Skip Tour
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {activeStep > 0 && (
                <Button variant="outline" size="sm" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              )}
              
              {currentStepData.showNext !== false && (
                <Button size="sm" onClick={nextStep}>
                  {activeStep === steps.length - 1 ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Finish
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="mt-3">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1 flex-1 rounded-full",
                    index <= activeStep ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// Hook to manage tour state
export function useProductTour(steps: TourStep[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);

  useEffect(() => {
    // Check if user has completed tour before
    const completed = localStorage.getItem('product-tour-completed');
    setHasCompletedTour(!!completed);
  }, []);

  const startTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  const closeTour = () => {
    setIsOpen(false);
  };

  const completeTour = () => {
    setHasCompletedTour(true);
    localStorage.setItem('product-tour-completed', 'true');
    setIsOpen(false);
  };

  const resetTour = () => {
    localStorage.removeItem('product-tour-completed');
    setHasCompletedTour(false);
  };

  return {
    isOpen,
    currentStep,
    hasCompletedTour,
    startTour,
    closeTour,
    completeTour,
    resetTour
  };
}

// Welcome tour for new users
export function WelcomeTour({ onComplete }: { onComplete: () => void }) {
  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Innovation Hub! 🎉',
      content: 'Take a quick tour to discover how to make the most of your innovation journey.',
      target: 'body',
      showSkip: true
    },
    {
      id: 'navigation',
      title: 'Navigation Menu',
      content: 'Use the sidebar to navigate between different sections like challenges, ideas, and analytics.',
      target: '[data-tour="sidebar"]',
      placement: 'right'
    },
    {
      id: 'create',
      title: 'Create Content',
      content: 'Click here to create new challenges, submit ideas, or start collaborating.',
      target: '[data-tour="create-button"]',
      placement: 'bottom'
    },
    {
      id: 'notifications',
      title: 'Stay Updated',
      content: 'Check your notifications for updates on evaluations, challenges, and team activities.',
      target: '[data-tour="notifications"]',
      placement: 'bottom'
    }
  ];

  const { isOpen, startTour, closeTour, completeTour } = useProductTour(tourSteps);

  useEffect(() => {
    // Auto-start tour for new users
    const timer = setTimeout(() => {
      startTour();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ProductTour
      steps={tourSteps}
      isOpen={isOpen}
      onClose={closeTour}
      onComplete={() => {
        completeTour();
        onComplete();
      }}
    />
  );
}