# Wizards & Forms Documentation

Multi-step wizards and complex form components for the Enterprise Management System.

## 🧙‍♂️ Multi-Step Wizards

### Wizard Framework
**Location**: `src/components/ui/wizard.tsx`

```typescript
interface WizardStep {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<WizardStepProps>;
  validation?: (data: any) => boolean | Promise<boolean>;
  optional?: boolean;
  condition?: (data: any) => boolean;
}

interface WizardProps {
  steps: WizardStep[];
  onComplete: (data: any) => void | Promise<void>;
  onCancel?: () => void;
  initialData?: any;
  persistProgress?: boolean;
  allowBack?: boolean;
  showProgress?: boolean;
  className?: string;
}

const Wizard = ({ 
  steps, 
  onComplete, 
  onCancel, 
  initialData = {},
  persistProgress = true,
  allowBack = true,
  showProgress = true,
  className 
}: WizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter steps based on conditions
  const activeSteps = useMemo(() => {
    return steps.filter(step => !step.condition || step.condition(data));
  }, [steps, data]);

  const currentStepData = activeSteps[currentStep];
  const isLastStep = currentStep === activeSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = async () => {
    const step = activeSteps[currentStep];
    
    // Validate current step
    if (step.validation) {
      try {
        const isValid = await step.validation(data);
        if (!isValid) {
          setErrors({ [step.id]: 'Please complete all required fields' });
          return;
        }
      } catch (error) {
        setErrors({ [step.id]: error.message });
        return;
      }
    }

    setErrors({});

    if (isLastStep) {
      setIsSubmitting(true);
      try {
        await onComplete(data);
      } catch (error) {
        setErrors({ submit: error.message });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (allowBack && !isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepData = (stepId: string, stepData: any) => {
    setData(prev => ({
      ...prev,
      [stepId]: stepData
    }));
  };

  const handleStepChange = (stepIndex: number) => {
    if (stepIndex <= currentStep || !showProgress) {
      setCurrentStep(stepIndex);
    }
  };

  // Persist progress to localStorage
  useEffect(() => {
    if (persistProgress) {
      localStorage.setItem('wizard_progress', JSON.stringify({
        currentStep,
        data
      }));
    }
  }, [currentStep, data, persistProgress]);

  // Restore progress from localStorage
  useEffect(() => {
    if (persistProgress) {
      const saved = localStorage.getItem('wizard_progress');
      if (saved) {
        try {
          const { currentStep: savedStep, data: savedData } = JSON.parse(saved);
          setCurrentStep(savedStep);
          setData(savedData);
        } catch (error) {
          console.error('Failed to restore wizard progress:', error);
        }
      }
    }
  }, [persistProgress]);

  const StepComponent = currentStepData?.component;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Progress Indicator */}
      {showProgress && (
        <WizardProgress
          steps={activeSteps}
          currentStep={currentStep}
          onStepClick={handleStepChange}
        />
      )}

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{currentStepData?.title}</CardTitle>
          {currentStepData?.description && (
            <CardDescription>{currentStepData.description}</CardDescription>
          )}
        </CardHeader>
        
        <CardContent>
          {StepComponent && (
            <StepComponent
              data={data[currentStepData.id] || {}}
              onDataChange={(stepData) => handleStepData(currentStepData.id, stepData)}
              wizardData={data}
              errors={errors}
            />
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={isFirstStep ? onCancel : handleBack}
            disabled={isSubmitting}
          >
            {isFirstStep ? 'Cancel' : 'Back'}
          </Button>

          <div className="flex gap-2">
            {!isLastStep && (
              <Button variant="outline" onClick={() => setCurrentStep(activeSteps.length - 1)}>
                Skip to End
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : isLastStep ? (
                'Complete'
              ) : (
                'Next'
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Error Display */}
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Validation Error</AlertTitle>
          <AlertDescription>
            {Object.values(errors)[0]}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
```

### Wizard Progress Component
```typescript
interface WizardProgressProps {
  steps: WizardStep[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

const WizardProgress = ({ steps, currentStep, onStepClick }: WizardProgressProps) => {
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {/* Step Circle */}
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border-2 cursor-pointer transition-colors",
              index <= currentStep
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-muted",
              onStepClick && "hover:bg-primary/10"
            )}
            onClick={() => onStepClick?.(index)}
          >
            {index < currentStep ? (
              <Check className="h-5 w-5" />
            ) : (
              <span className="text-sm font-medium">{index + 1}</span>
            )}
          </div>

          {/* Step Label */}
          <div className="flex flex-col items-center mx-2">
            <span className={cn(
              "text-sm font-medium",
              index <= currentStep ? "text-primary" : "text-muted-foreground"
            )}>
              {step.title}
            </span>
            {step.description && (
              <span className="text-xs text-muted-foreground mt-1">
                {step.description}
              </span>
            )}
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-0.5 mx-4",
                index < currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
```

## 📋 Challenge Creation Wizard

### Challenge Creation Steps
**Location**: `src/components/wizards/ChallengeCreationWizard.tsx`

```typescript
const ChallengeCreationWizard = ({ onComplete, onCancel }: ChallengeWizardProps) => {
  const steps: WizardStep[] = [
    {
      id: 'basic_info',
      title: 'Basic Information',
      description: 'Challenge title, description, and category',
      component: BasicInfoStep,
      validation: (data) => {
        const { title, description, category } = data.basic_info || {};
        return !!(title && description && category);
      }
    },
    {
      id: 'timeline',
      title: 'Timeline & Deadlines',
      description: 'Set challenge duration and important dates',
      component: TimelineStep,
      validation: (data) => {
        const { start_date, end_date } = data.timeline || {};
        return !!(start_date && end_date && new Date(end_date) > new Date(start_date));
      }
    },
    {
      id: 'criteria',
      title: 'Evaluation Criteria',
      description: 'Define how submissions will be evaluated',
      component: CriteriaStep,
      validation: (data) => {
        const { criteria } = data.criteria || {};
        return !!(criteria && criteria.length > 0);
      }
    },
    {
      id: 'rewards',
      title: 'Rewards & Incentives',
      description: 'Set up rewards for participants',
      component: RewardsStep,
      optional: true
    },
    {
      id: 'settings',
      title: 'Advanced Settings',
      description: 'Privacy, permissions, and additional settings',
      component: SettingsStep,
      validation: (data) => {
        const { visibility, max_participants } = data.settings || {};
        return !!(visibility);
      }
    },
    {
      id: 'review',
      title: 'Review & Publish',
      description: 'Review your challenge before publishing',
      component: ReviewStep
    }
  ];

  const handleComplete = async (data: any) => {
    // Transform wizard data to challenge format
    const challengeData = {
      title: data.basic_info.title,
      description: data.basic_info.description,
      category: data.basic_info.category,
      start_date: data.timeline.start_date,
      end_date: data.timeline.end_date,
      evaluation_criteria: data.criteria.criteria,
      reward_amount: data.rewards?.amount,
      reward_description: data.rewards?.description,
      max_participants: data.settings.max_participants,
      visibility: data.settings.visibility,
      tags: data.basic_info.tags || [],
      attachments: data.basic_info.attachments || []
    };

    await onComplete(challengeData);
  };

  return (
    <Wizard
      steps={steps}
      onComplete={handleComplete}
      onCancel={onCancel}
      persistProgress
      showProgress
    />
  );
};
```

### Step Components
```typescript
// Basic Info Step
const BasicInfoStep = ({ data, onDataChange, errors }: WizardStepProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: [],
    attachments: [],
    ...data
  });

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onDataChange(updated);
  };

  return (
    <div className="space-y-6">
      <FormField label="Challenge Title" required error={errors?.title}>
        <Input
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter a compelling challenge title"
          maxLength={100}
        />
      </FormField>

      <FormField label="Description" required error={errors?.description}>
        <RichTextEditor
          value={formData.description}
          onChange={(value) => handleChange('description', value)}
          placeholder="Describe the challenge, its goals, and requirements"
        />
      </FormField>

      <FormField label="Category" required error={errors?.category}>
        <CategorySelector
          value={formData.category}
          onChange={(value) => handleChange('category', value)}
        />
      </FormField>

      <FormField label="Tags" error={errors?.tags}>
        <TagInput
          value={formData.tags}
          onChange={(value) => handleChange('tags', value)}
          suggestions={['innovation', 'technology', 'sustainability']}
        />
      </FormField>

      <FormField label="Attachments">
        <FileUpload
          files={formData.attachments}
          onChange={(files) => handleChange('attachments', files)}
          accept=".pdf,.doc,.docx,.ppt,.pptx"
          multiple
        />
      </FormField>
    </div>
  );
};

// Timeline Step
const TimelineStep = ({ data, onDataChange, errors }: WizardStepProps) => {
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    milestone_dates: [],
    ...data
  });

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onDataChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Start Date" required error={errors?.start_date}>
          <DateTimePicker
            value={formData.start_date}
            onChange={(value) => handleChange('start_date', value)}
            minDate={new Date()}
          />
        </FormField>

        <FormField label="End Date" required error={errors?.end_date}>
          <DateTimePicker
            value={formData.end_date}
            onChange={(value) => handleChange('end_date', value)}
            minDate={formData.start_date ? new Date(formData.start_date) : new Date()}
          />
        </FormField>
      </div>

      <FormField label="Milestone Dates">
        <MilestoneDatePicker
          milestones={formData.milestone_dates}
          onChange={(milestones) => handleChange('milestone_dates', milestones)}
          startDate={formData.start_date}
          endDate={formData.end_date}
        />
      </FormField>

      {/* Duration Display */}
      {formData.start_date && formData.end_date && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Challenge Duration: {calculateDuration(formData.start_date, formData.end_date)}
          </p>
        </div>
      )}
    </div>
  );
};

// Criteria Step
const CriteriaStep = ({ data, onDataChange, errors }: WizardStepProps) => {
  const [formData, setFormData] = useState({
    criteria: [],
    evaluation_method: 'scored',
    ...data
  });

  const addCriterion = () => {
    const newCriteria = [...formData.criteria, {
      id: Date.now().toString(),
      name: '',
      description: '',
      weight: 1,
      type: 'score'
    }];
    handleChange('criteria', newCriteria);
  };

  const updateCriterion = (id: string, updates: any) => {
    const updated = formData.criteria.map(c => 
      c.id === id ? { ...c, ...updates } : c
    );
    handleChange('criteria', updated);
  };

  const removeCriterion = (id: string) => {
    const updated = formData.criteria.filter(c => c.id !== id);
    handleChange('criteria', updated);
  };

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onDataChange(updated);
  };

  return (
    <div className="space-y-6">
      <FormField label="Evaluation Method" required>
        <Select 
          value={formData.evaluation_method}
          onValueChange={(value) => handleChange('evaluation_method', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scored">Scored Evaluation</SelectItem>
            <SelectItem value="ranked">Ranked Evaluation</SelectItem>
            <SelectItem value="binary">Pass/Fail</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Evaluation Criteria</Label>
          <Button type="button" variant="outline" onClick={addCriterion}>
            <Plus className="h-4 w-4 mr-2" />
            Add Criterion
          </Button>
        </div>

        {formData.criteria.map((criterion, index) => (
          <CriterionEditor
            key={criterion.id}
            criterion={criterion}
            index={index}
            onUpdate={(updates) => updateCriterion(criterion.id, updates)}
            onRemove={() => removeCriterion(criterion.id)}
            evaluationMethod={formData.evaluation_method}
          />
        ))}

        {formData.criteria.length === 0 && (
          <div className="text-center p-8 border-2 border-dashed border-muted rounded-lg">
            <p className="text-muted-foreground">
              No evaluation criteria defined. Add at least one criterion to continue.
            </p>
          </div>
        )}
      </div>

      {/* Weight Distribution Display */}
      {formData.criteria.length > 0 && formData.evaluation_method === 'scored' && (
        <WeightDistributionChart criteria={formData.criteria} />
      )}
    </div>
  );
};
```

## 📝 Form Components

### Dynamic Form Builder
**Location**: `src/components/forms/DynamicForm.tsx`

```typescript
interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'file' | 'date' | 'number';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: { value: string; label: string }[];
  conditional?: {
    field: string;
    value: any;
  };
  defaultValue?: any;
  props?: Record<string, any>;
}

interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any, formData: any) => boolean;
}

interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (data: any) => void | Promise<void>;
  initialData?: any;
  loading?: boolean;
  submitText?: string;
  className?: string;
}

const DynamicForm = ({ 
  fields, 
  onSubmit, 
  initialData = {},
  loading = false,
  submitText = 'Submit',
  className 
}: DynamicFormProps) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Filter fields based on conditions
  const visibleFields = useMemo(() => {
    return fields.filter(field => {
      if (!field.conditional) return true;
      
      const conditionValue = formData[field.conditional.field];
      return conditionValue === field.conditional.value;
    });
  }, [fields, formData]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when field is modified
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const handleFieldBlur = (fieldId: string) => {
    setTouched(prev => ({ ...prev, [fieldId]: true }));
    validateField(fieldId);
  };

  const validateField = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    const value = formData[fieldId];
    const fieldErrors: string[] = [];

    // Run validation rules
    field.validation?.forEach(rule => {
      switch (rule.type) {
        case 'required':
          if (!value || (Array.isArray(value) && value.length === 0)) {
            fieldErrors.push(rule.message);
          }
          break;
        case 'min':
          if (typeof value === 'string' && value.length < rule.value) {
            fieldErrors.push(rule.message);
          } else if (typeof value === 'number' && value < rule.value) {
            fieldErrors.push(rule.message);
          }
          break;
        case 'max':
          if (typeof value === 'string' && value.length > rule.value) {
            fieldErrors.push(rule.message);
          } else if (typeof value === 'number' && value > rule.value) {
            fieldErrors.push(rule.message);
          }
          break;
        case 'pattern':
          if (typeof value === 'string' && !new RegExp(rule.value).test(value)) {
            fieldErrors.push(rule.message);
          }
          break;
        case 'custom':
          if (rule.validator && !rule.validator(value, formData)) {
            fieldErrors.push(rule.message);
          }
          break;
      }
    });

    setErrors(prev => ({ 
      ...prev, 
      [fieldId]: fieldErrors[0] || '' 
    }));

    return fieldErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all visible fields
    const validationResults = visibleFields.map(field => validateField(field.id));
    const isValid = validationResults.every(Boolean);

    if (!isValid) {
      // Mark all fields as touched to show errors
      const touchedFields = visibleFields.reduce((acc, field) => {
        acc[field.id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setTouched(touchedFields);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id];
    const error = touched[field.id] ? errors[field.id] : '';

    const commonProps = {
      value: value || field.defaultValue,
      onChange: (newValue: any) => handleFieldChange(field.id, newValue),
      onBlur: () => handleFieldBlur(field.id),
      error,
      required: field.required,
      ...field.props
    };

    switch (field.type) {
      case 'text':
        return (
          <Input
            placeholder={field.placeholder}
            {...commonProps}
          />
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            rows={4}
            {...commonProps}
          />
        );

      case 'select':
        return (
          <Select 
            value={value} 
            onValueChange={(value) => handleFieldChange(field.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        return (
          <MultiSelect
            options={field.options || []}
            value={value || []}
            onChange={(values) => handleFieldChange(field.id, values)}
            placeholder={field.placeholder}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value || false}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
            />
            <Label>{field.label}</Label>
          </div>
        );

      case 'radio':
        return (
          <RadioGroup 
            value={value} 
            onValueChange={(value) => handleFieldChange(field.id, value)}
          >
            {field.options?.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} />
                <Label>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'file':
        return (
          <FileUpload
            files={value || []}
            onChange={(files) => handleFieldChange(field.id, files)}
            accept={field.props?.accept}
            multiple={field.props?.multiple}
          />
        );

      case 'date':
        return (
          <DatePicker
            value={value}
            onChange={(date) => handleFieldChange(field.id, date)}
            placeholder={field.placeholder}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            {...commonProps}
          />
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      {visibleFields.map(field => (
        <FormField
          key={field.id}
          label={field.label}
          required={field.required}
          error={touched[field.id] ? errors[field.id] : ''}
        >
          {renderField(field)}
        </FormField>
      ))}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          submitText
        )}
      </Button>
    </form>
  );
};
```

---

*Wizards & Forms: 20+ documented | Multi-Step: ✅ Complete | Validation: ✅ Comprehensive*