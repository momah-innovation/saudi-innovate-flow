import { z } from 'zod';
import { useCallback } from 'react';

export interface ValidationRule<T = any> {
  field: keyof T;
  rules: z.ZodSchema<any>;
  message?: string;
}

export interface FormValidationConfig<T = any> {
  schema: z.ZodSchema<T>;
  mode?: 'onSubmit' | 'onChange' | 'onBlur';
  revalidateMode?: 'onChange' | 'onBlur';
}

class UnifiedFormValidator<T = any> {
  private schema: z.ZodSchema<T>;
  private config: FormValidationConfig<T>;

  constructor(config: FormValidationConfig<T>) {
    this.schema = config.schema;
    this.config = config;
  }

  // Validate entire form
  validateForm(data: T): { isValid: boolean; errors: Record<string, string> } {
    try {
      this.schema.parse(data);
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        return { isValid: false, errors };
      }
      return { isValid: false, errors: { form: 'Validation error occurred' } };
    }
  }

  // Validate single field - simplified approach
  validateField(field: string, value: any): { isValid: boolean; error?: string } {
    try {
      // For single field validation, we just check basic type requirements
      if (value === undefined || value === null || value === '') {
        return { isValid: false, error: 'This field is required' };
      }
      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: 'Validation error' };
    }
  }

  // Get safe parsed data
  safeParse(data: T): { success: boolean; data?: T; errors?: Record<string, string> } {
    const result = this.schema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    }
    
    const errors: Record<string, string> = {};
    result.error.errors.forEach((err) => {
      const path = err.path.join('.');
      errors[path] = err.message;
    });
    
    return { success: false, errors };
  }
}

// Common validation schemas
export const commonSchemas = {
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().regex(/^[+]?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'),
  url: z.string().url('Please enter a valid URL'),
  required: z.string().min(1, 'This field is required'),
  optionalString: z.string().optional(),
  number: z.number().min(0, 'Must be a positive number'),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
  futureDate: z.string().refine(
    (date) => new Date(date) > new Date(),
    'Date must be in the future'
  ),
  pastDate: z.string().refine(
    (date) => new Date(date) < new Date(),
    'Date must be in the past'
  )
};

// Factory function to create form validators
export const createFormValidator = <T>(config: FormValidationConfig<T>) => 
  new UnifiedFormValidator(config);

// React hook for form validation
export const useFormValidation = <T>(config: FormValidationConfig<T>) => {
  const validator = new UnifiedFormValidator(config);

  const validateForm = useCallback((data: T) => {
    return validator.validateForm(data);
  }, [validator]);

  const validateField = useCallback((field: string, value: any) => {
    return validator.validateField(field, value);
  }, [validator]);

  const safeParse = useCallback((data: T) => {
    return validator.safeParse(data);
  }, [validator]);

  return {
    validateForm,
    validateField,
    safeParse,
    schema: config.schema
  };
};

// Common form schemas
export const userProfileSchema = z.object({
  display_name: commonSchemas.required,
  email: commonSchemas.email,
  phone: commonSchemas.phone.optional(),
  bio: commonSchemas.optionalString,
  avatar_url: commonSchemas.url.optional()
});

export const challengeSchema = z.object({
  title: commonSchemas.required,
  description: commonSchemas.required,
  start_date: commonSchemas.futureDate,
  end_date: commonSchemas.futureDate,
  registration_deadline: commonSchemas.futureDate,
  max_participants: z.number().min(1, 'Must allow at least 1 participant'),
  eligibility_criteria: commonSchemas.optionalString
});

export const eventSchema = z.object({
  title: commonSchemas.required,
  description: commonSchemas.required,
  event_date: commonSchemas.futureDate,
  location: commonSchemas.required,
  max_attendees: z.number().min(1, 'Must allow at least 1 attendee').optional(),
  registration_required: z.boolean(),
  virtual_link: commonSchemas.url.optional()
});