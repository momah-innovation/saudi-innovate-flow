/**
 * Form Type Definitions
 * Replaces 'any' types with proper interfaces
 */

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: FormSelectOption[];
  validation?: FormValidation;
  description?: string;
  defaultValue?: string | number | boolean;
}

export interface FormSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface FormValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  customValidator?: (value: unknown) => string | null;
}

export interface FormState<T = Record<string, unknown>> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface FormConfig {
  fields: FormField[];
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
  resetOnSubmit?: boolean;
}

export interface FormSubmissionResult {
  success: boolean;
  message?: string;
  data?: Record<string, unknown>;
  errors?: Record<string, string>;
}

export interface DynamicFormData {
  id?: string;
  formConfig: FormConfig;
  initialValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => Promise<FormSubmissionResult>;
  className?: string;
}

export interface FormFieldProps {
  field: FormField;
  value: unknown;
  error?: string;
  touched?: boolean;
  onChange: (name: string, value: unknown) => void;
  onBlur: (name: string) => void;
}

export interface MultiStepFormConfig {
  steps: FormStep[];
  allowSkipSteps?: boolean;
  showProgress?: boolean;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  validation?: (values: Record<string, unknown>) => Record<string, string>;
  canSkip?: boolean;
}

export interface FileUploadField extends Omit<FormField, 'type'> {
  type: 'file';
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
}

export interface ConditionalField extends FormField {
  showWhen?: {
    field: string;
    value: unknown;
    operator?: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  };
}

// Form validation helpers
export type ValidationRule<T = unknown> = (value: T) => string | null;
export type AsyncValidationRule<T = unknown> = (value: T) => Promise<string | null>;

export interface FormValidationSchema {
  [fieldName: string]: ValidationRule | ValidationRule[] | AsyncValidationRule | AsyncValidationRule[];
}

// Specific form types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ProfileFormData {
  name: string;
  email: string;
  position?: string;
  organization?: string;
  department?: string;
  bio?: string;
  avatar?: File;
}

export interface ChallengeFormData {
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  type: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'active' | 'paused' | 'completed';
  start_date: string;
  end_date: string;
  submission_deadline: string;
  max_participants?: number;
  reward_amount?: number;
  budget?: number;
  expert_ids?: string[];
  partner_ids?: string[];
  tags?: string[];
}