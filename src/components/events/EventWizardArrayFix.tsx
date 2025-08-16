/**
 * Array Mutation Fix for EventWizard
 * Replaces direct array mutations with immutable operations
 */

import React from 'react';
import { useArrayMutationFix } from '@/hooks/useArrayMutationFix';

interface EventFormData {
  title_ar: string;
  title_en: string;
  event_type: string;
  description_ar: string;
  description_en: string;
  event_date: string;
  format: 'in_person' | 'virtual' | 'hybrid';
  location?: string;
  virtual_link?: string;
  max_participants?: number;
  budget?: number;
  end_time?: string;
  end_date?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
}

interface ValidationError {
  field: string;
  message: string;
}

export const useEventValidationFix = () => {
  const { push: addError } = useArrayMutationFix<ValidationError>();

  const validateEventForm = (formData: EventFormData): ValidationError[] => {
    let errors: ValidationError[] = [];

    // ✅ FIXED: Use immutable array operations instead of push()
    if (!formData.title_ar.trim()) {
      errors = addError(errors, { field: 'title_ar', message: "العنوان بالعربية مطلوب" });
    }
    
    if (!formData.event_type) {
      errors = addError(errors, { field: 'event_type', message: "نوع الحدث مطلوب" });
    }
    
    if (!formData.description_ar?.trim()) {
      errors = addError(errors, { field: 'description_ar', message: "الوصف بالعربية مطلوب" });
    }

    if (!formData.event_date) {
      errors = addError(errors, { field: 'event_date', message: "تاريخ الحدث مطلوب" });
    }
    
    if (!formData.format) {
      errors = addError(errors, { field: 'format', message: "تنسيق الحدث مطلوب" });
    }

    if (formData.format === 'in_person' && !formData.location?.trim()) {
      errors = addError(errors, { field: 'location', message: "الموقع مطلوب للأحداث الحضورية" });
    }

    if (formData.format === 'virtual' && !formData.virtual_link?.trim()) {
      errors = addError(errors, { field: 'virtual_link', message: "الرابط الافتراضي مطلوب للأحداث الافتراضية" });
    }

    if (formData.format === 'hybrid' && (!formData.location?.trim() || !formData.virtual_link?.trim())) {
      errors = addError(errors, { field: 'hybrid', message: "الموقع والرابط الافتراضي مطلوبان للأحداث المختلطة" });
    }

    if (formData.max_participants && formData.max_participants <= 0) {
      errors = addError(errors, { field: 'max_participants', message: "الحد الأقصى للمشاركين يجب أن يكون أكبر من صفر" });
    }

    if (formData.budget && formData.budget < 0) {
      errors = addError(errors, { field: 'budget', message: "الميزانية لا يمكن أن تكون سالبة" });
    }

    if (formData.end_time && formData.event_date && formData.end_time <= formData.event_date) {
      errors = addError(errors, { field: 'end_time', message: "وقت الانتهاء يجب أن يكون بعد وقت البداية" });
    }

    if (formData.end_date && formData.event_date && formData.end_date < formData.event_date.split('T')[0]) {
      errors = addError(errors, { field: 'end_date', message: "تاريخ الانتهاء لا يمكن أن يكون قبل تاريخ البداية" });
    }

    if (formData.is_recurring) {
      if (!formData.recurrence_pattern) {
        errors = addError(errors, { field: 'recurrence_pattern', message: "نمط التكرار مطلوب للأحداث المتكررة" });
      }

      if (!formData.recurrence_end_date) {
        errors = addError(errors, { field: 'recurrence_end_date', message: "تاريخ انتهاء التكرار مطلوب للأحداث المتكررة" });
      }
    }

    return errors;
  };

  return {
    validateEventForm
  };
};

export default useEventValidationFix;