/**
 * Form-specific type definitions for safe migration
 * These interfaces replace any types in form components
 */

export interface FormFieldValue {
  id: string;
  value: string | number | boolean | Date | null;
  type: 'text' | 'number' | 'boolean' | 'date' | 'select' | 'textarea';
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
  };
}

export interface FormData {
  [key: string]: FormFieldValue | FormFieldValue[] | any; // Gradual migration - keeping any as fallback
}

export interface FormError {
  field: string;
  message: string;
  type: 'required' | 'validation' | 'server' | 'custom';
}

export interface FormState {
  data: FormData;
  errors: FormError[];
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  touched: Record<string, boolean>;
}

export interface FormChangeHandler {
  (field: string, value: any): void;
}

export interface FormSubmitHandler {
  (data: FormData): Promise<void> | void;
}

export interface FormProps {
  initialData?: FormData;
  onSubmit: FormSubmitHandler;
  onChange?: FormChangeHandler;
  onValidate?: (data: FormData) => FormError[];
  schema?: any; // Keep for backward compatibility
  className?: string;
  disabled?: boolean;
}

/**
 * Challenge form specific types
 */
export interface ChallengeFormData {
  title: string;
  description: string;
  requirements: string;
  deadline: Date;
  reward_amount?: number;
  reward_type?: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  submission_guidelines: string;
  evaluation_criteria: string;
  category_id?: string;
  tags?: string[];
  is_public: boolean;
  max_participants?: number;
  skills_required?: string[];
  resources?: Array<{
    title: string;
    url: string;
    type: 'document' | 'link' | 'video' | 'image';
  }>;
}

export interface ChallengeFormProps extends Omit<FormProps, 'onSubmit'> {
  challenge?: Partial<ChallengeFormData>;
  onSubmit: (data: ChallengeFormData) => Promise<void>;
  onCancel?: () => void;
  mode?: 'create' | 'edit' | 'clone';
}

/**
 * User form specific types
 */
export interface UserFormData {
  email: string;
  name: string;
  bio?: string;
  location?: string;
  skills?: string[];
  interests?: string[];
  social_links?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  preferences?: {
    notifications: boolean;
    email_updates: boolean;
    privacy_level: 'public' | 'private' | 'contacts';
  };
  role?: string;
  department?: string;
}

export interface UserFormProps extends Omit<FormProps, 'onSubmit'> {
  user?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => Promise<void>;
  editable?: boolean;
  showRoleFields?: boolean;
}

/**
 * Event form specific types
 */
export interface EventFormData {
  title: string;
  description: string;
  start_time: Date;
  end_time: Date;
  location?: string;
  virtual_link?: string;
  event_type: 'workshop' | 'webinar' | 'conference' | 'networking' | 'competition';
  capacity?: number;
  is_public: boolean;
  registration_required: boolean;
  tags?: string[];
  speakers?: Array<{
    name: string;
    bio: string;
    title: string;
    avatar_url?: string;
  }>;
  agenda?: Array<{
    time: string;
    topic: string;
    speaker?: string;
    duration: number;
  }>;
}

export interface EventFormProps extends Omit<FormProps, 'onSubmit'> {
  event?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

/**
 * Safe form field component props
 */
export interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'date';
  value?: any;
  onChange?: (value: any) => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  error?: string;
  help?: string;
  options?: Array<{
    value: string | number;
    label: string;
    disabled?: boolean;
  }>;
}

/**
 * Utility functions for form type checking
 */
export const FormTypeHelpers = {
  isFormFieldValue: (value: any): value is FormFieldValue => {
    return value && typeof value.id === 'string' && value.value !== undefined;
  },
  
  isFormData: (value: any): value is FormData => {
    return value && typeof value === 'object';
  },

  createEmptyFormData: (): FormData => ({}),
  
  createFormError: (field: string, message: string, type: FormError['type'] = 'validation'): FormError => ({
    field,
    message,
    type
  })
};