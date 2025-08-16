/**
 * Utility functions for converting between hardcoded values and translation keys
 * This helps migrate from hardcoded text to a key-based translation system
 */

import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

// Standard value mappings for common database fields
export const VALUE_KEY_MAPPINGS = {
  // Status mappings
  status: {
    'draft': 'status.draft',
    'مسودة': 'status.draft',
    'active': 'status.active', 
    'نشط': 'status.active',
    'published': 'status.published',
    'منشور': 'status.published',
    'completed': 'status.completed',
    'مكتمل': 'status.completed',
    'cancelled': 'status.cancelled',
    'ملغي': 'status.cancelled',
    'archived': 'status.archived',
    'مؤرشف': 'status.archived',
    'closed': 'status.closed',
    'مغلق': 'status.closed',
    'planning': 'status.planning',
    'تخطيط': 'status.planning',
    'upcoming': 'status.upcoming',
    'قادم': 'status.upcoming',
    'under_review': 'status.under_review',
    'قيد المراجعة': 'status.under_review',
    'approved': 'status.approved',
    'موافق عليه': 'status.approved',
    'rejected': 'status.rejected',
    'مرفوض': 'status.rejected',
    'submitted': 'status.submitted',
    'مقدم': 'status.submitted',
    'pending': 'status.pending',
    'معلق': 'status.pending',
    'in_progress': 'status.in_progress',
    'قيد التنفيذ': 'status.in_progress',
    'on_hold': 'status.on_hold',
    'suspended': 'status.suspended',
    'inactive': 'status.inactive',
    'غير نشط': 'status.inactive'
  },

  // Priority mappings
  priority: {
    'low': 'priority.low',
    'منخفض': 'priority.low',
    'medium': 'priority.medium',
    'متوسط': 'priority.medium',
    'high': 'priority.high',
    'عالي': 'priority.high',
    'critical': 'priority.critical',
    'حرج': 'priority.critical',
    'urgent': 'priority.urgent',
    'عاجل': 'priority.urgent'
  },

  // Challenge types
  challenge_type: {
    'innovation': 'challenge_type.innovation',
    'ابتكار': 'challenge_type.innovation',
    'improvement': 'challenge_type.improvement',
    'تحسين': 'challenge_type.improvement',
    'research': 'challenge_type.research',
    'بحث': 'challenge_type.research',
    'development': 'challenge_type.development',
    'تطوير': 'challenge_type.development',
    'technical': 'challenge_type.technical',
    'تقني': 'challenge_type.technical',
    'business': 'challenge_type.business',
    'تجاري': 'challenge_type.business',
    'environmental': 'challenge_type.environmental',
    'بيئي': 'challenge_type.environmental',
    'health': 'challenge_type.health',
    'صحي': 'challenge_type.health',
    'educational': 'challenge_type.educational',
    'تعليمي': 'challenge_type.educational',
    'social': 'challenge_type.social',
    'اجتماعي': 'challenge_type.social'
  },

  // Event types
  event_type: {
    'workshop': 'event_type.workshop',
    'ورشة عمل': 'event_type.workshop',
    'seminar': 'event_type.seminar',
    'ندوة': 'event_type.seminar',
    'conference': 'event_type.conference',
    'مؤتمر': 'event_type.conference',
    'webinar': 'event_type.webinar',
    'ندوة إلكترونية': 'event_type.webinar',
    'training': 'event_type.training',
    'تدريب': 'event_type.training',
    'networking': 'event_type.networking',
    'تواصل': 'event_type.networking',
    'competition': 'event_type.competition',
    'مسابقة': 'event_type.competition',
    'hackathon': 'event_type.hackathon',
    'هاكاثون': 'event_type.hackathon'
  },

  // Opportunity types
  opportunity_type: {
    'job': 'opportunity_type.job',
    'وظيفة': 'opportunity_type.job',
    'internship': 'opportunity_type.internship',
    'تدريب': 'opportunity_type.internship',
    'volunteer': 'opportunity_type.volunteer',
    'تطوع': 'opportunity_type.volunteer',
    'partnership': 'opportunity_type.partnership',
    'شراكة': 'opportunity_type.partnership',
    'funding': 'opportunity_type.funding',
    'تمويل': 'opportunity_type.funding',
    'mentorship': 'opportunity_type.mentorship',
    'إرشاد': 'opportunity_type.mentorship',
    'research': 'opportunity_type.research',
    'consultation': 'opportunity_type.consultation',
    'استشارة': 'opportunity_type.consultation'
  },

  // Sensitivity levels
  sensitivity: {
    'normal': 'sensitivity.normal',
    'عادي': 'sensitivity.normal',
    'confidential': 'sensitivity.confidential',
    'سري': 'sensitivity.confidential',
    'restricted': 'sensitivity.restricted',
    'مقيد': 'sensitivity.restricted',
    'public': 'sensitivity.public',
    'عام': 'sensitivity.public',
    'internal': 'sensitivity.internal',
    'داخلي': 'sensitivity.internal'
  },

  // Participation types
  participation_type: {
    'individual': 'participation_type.individual',
    'فردي': 'participation_type.individual',
    'team': 'participation_type.team',
    'فريق': 'participation_type.team',
    'organization': 'participation_type.organization',
    'مؤسسة': 'participation_type.organization'
  },

  // Registration types
  registration_type: {
    'open': 'registration_type.open',
    'مفتوح': 'registration_type.open',
    'invitation_only': 'registration_type.invitation_only',
    'بدعوة فقط': 'registration_type.invitation_only',
    'application_required': 'registration_type.application_required',
    'يتطلب تقديم طلب': 'registration_type.application_required',
    'closed': 'registration_type.closed',
    'مغلق': 'registration_type.closed'
  },

  // Assignment types
  assignment_type: {
    'campaign': 'assignment_type.campaign',
    'حملة': 'assignment_type.campaign',
    'challenge': 'assignment_type.challenge',
    'تحدي': 'assignment_type.challenge',
    'event': 'assignment_type.event',
    'فعالية': 'assignment_type.event',
    'idea': 'assignment_type.idea',
    'فكرة': 'assignment_type.idea',
    'project': 'assignment_type.project',
    'مشروع': 'assignment_type.project'
  },

  // Role types for experts
  role_type: {
    'evaluator': 'role_type.evaluator',
    'مقيم': 'role_type.evaluator',
    'advisor': 'role_type.advisor',
    'مستشار': 'role_type.advisor',
    'mentor': 'role_type.mentor',
    'موجه': 'role_type.mentor',
    'reviewer': 'role_type.reviewer',
    'مراجع': 'role_type.reviewer',
    'judge': 'role_type.judge',
    'حكم': 'role_type.judge'
  }
} as const;

/**
 * Convert a hardcoded value to its corresponding translation key
 */
export function valueToKey(value: string, category: keyof typeof VALUE_KEY_MAPPINGS): string {
  const mapping = VALUE_KEY_MAPPINGS[category];
  if (!mapping) {
    // Use structured logging instead of console.warn
    if (typeof window !== 'undefined' && (window as any).debugLog) {
      (window as any).debugLog.warn('No mapping found for category', { component: 'ValueKeys', data: { category } });
    }
    return value;
  }

  const key = mapping[value as keyof typeof mapping];
  return key || value;
}

/**
 * Convert a translation key back to its raw value (for database storage)
 */
export function keyToValue(key: string, category: keyof typeof VALUE_KEY_MAPPINGS): string {
  const mapping = VALUE_KEY_MAPPINGS[category];
  if (!mapping) {
    // Use structured logging instead of console.warn
    if (typeof window !== 'undefined' && (window as any).debugLog) {
      (window as any).debugLog.warn('No mapping found for category', { component: 'ValueKeys', data: { category } });
    }
    return key;
  }

  // Find the original value that maps to this key
  for (const [originalValue, mappedKey] of Object.entries(mapping)) {
    if (mappedKey === key) {
      return originalValue;
    }
  }

  return key;
}

/**
 * Get all available keys for a category
 */
export function getCategoryKeys(category: keyof typeof VALUE_KEY_MAPPINGS): string[] {
  const mapping = VALUE_KEY_MAPPINGS[category];
  if (!mapping) return [];
  
  return [...new Set(Object.values(mapping))];
}

/**
 * Hook to get translated value for a database field
 */
export function useTranslatedValue(value: string | null | undefined, category: keyof typeof VALUE_KEY_MAPPINGS): string {
  const { t } = useUnifiedTranslation();
  
  if (!value) return '';
  
  const key = valueToKey(value, category);
  
  // If it's already a translation key, translate it
  if (key.includes('.')) {
    return t(key, value);
  }
  
  // Otherwise return the original value
  return value;
}

/**
 * Get all standard values for a category (useful for migration)
 */
export function getStandardValues(category: keyof typeof VALUE_KEY_MAPPINGS): { value: string; key: string }[] {
  const mapping = VALUE_KEY_MAPPINGS[category];
  if (!mapping) return [];
  
  const standardValues: { value: string; key: string }[] = [];
  const seenKeys = new Set<string>();
  
  for (const [originalValue, key] of Object.entries(mapping)) {
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      // Prefer English values for standard database storage
      const standardValue = Object.keys(mapping).find(k => 
        mapping[k as keyof typeof mapping] === key && 
        !k.includes('ي') && !k.includes('ة') && !k.includes('ر') // Simple check for Arabic
      ) || originalValue;
      
      standardValues.push({ value: standardValue, key });
    }
  }
  
  return standardValues;
}
