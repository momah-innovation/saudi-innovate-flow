/**
 * Status Mappings for Translation System
 * Standardized mappings to avoid hardcoded Arabic values
 */

import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

// Standard status mapping functions
export const STATUS_MAPPINGS = {
  active: 'status.active',
  inactive: 'status.inactive',
  pending: 'status.pending',
  approved: 'status.approved', 
  rejected: 'status.rejected',
  draft: 'status.draft',
  published: 'status.published',
  completed: 'status.completed',
  cancelled: 'status.cancelled',
  on_hold: 'status.on_hold'
} as const;

export const PRIORITY_MAPPINGS = {
  high: 'priority.high',
  medium: 'priority.medium',
  low: 'priority.low'
} as const;

export const LEVEL_MAPPINGS = {
  high: 'level.high',
  medium: 'level.medium', 
  low: 'level.low'
} as const;

export const VISIBILITY_MAPPINGS = {
  public: 'visibility.public',
  internal: 'visibility.internal',
  restricted: 'visibility.restricted',
  private: 'visibility.private'
} as const;

// Hook for status translations
export function useStatusTranslations() {
  const { t } = useUnifiedTranslation();
  
  return {
    // Status translations
    getStatusLabel: (status: keyof typeof STATUS_MAPPINGS) => 
      t(STATUS_MAPPINGS[status], status),
    
    getStatusOptions: () => Object.keys(STATUS_MAPPINGS).map(status => ({
      value: status,
      label: t(STATUS_MAPPINGS[status as keyof typeof STATUS_MAPPINGS], status)
    })),
    
    // Priority translations  
    getPriorityLabel: (priority: keyof typeof PRIORITY_MAPPINGS) =>
      t(PRIORITY_MAPPINGS[priority], priority),
      
    getPriorityOptions: () => Object.keys(PRIORITY_MAPPINGS).map(priority => ({
      value: priority,
      label: t(PRIORITY_MAPPINGS[priority as keyof typeof PRIORITY_MAPPINGS], priority)
    })),
    
    // Level translations
    getLevelLabel: (level: keyof typeof LEVEL_MAPPINGS) =>
      t(LEVEL_MAPPINGS[level], level),
      
    getLevelOptions: () => Object.keys(LEVEL_MAPPINGS).map(level => ({
      value: level,
      label: t(LEVEL_MAPPINGS[level as keyof typeof LEVEL_MAPPINGS], level)
    })),
    
    // Visibility translations
    getVisibilityLabel: (visibility: keyof typeof VISIBILITY_MAPPINGS) =>
      t(VISIBILITY_MAPPINGS[visibility], visibility),
      
    getVisibilityOptions: () => Object.keys(VISIBILITY_MAPPINGS).map(visibility => ({
      value: visibility,
      label: t(VISIBILITY_MAPPINGS[visibility as keyof typeof VISIBILITY_MAPPINGS], visibility)
    }))
  };
}

// Badge/indicator mapping with variants
export function useStatusStyles() {
  return {
    getStatusVariant: (status: string) => {
      switch (status) {
        case 'active':
        case 'approved':
        case 'published':
        case 'completed':
          return 'default' as const;
        case 'inactive':
        case 'rejected':
        case 'cancelled':
          return 'destructive' as const;
        case 'pending':
        case 'draft':
        case 'on_hold':
          return 'secondary' as const;
        default:
          return 'outline' as const;
      }
    },
    
    getPriorityVariant: (priority: string) => {
      switch (priority) {
        case 'high':
          return 'destructive' as const;
        case 'medium':
          return 'default' as const;
        case 'low':
          return 'secondary' as const;
        default:
          return 'outline' as const;
      }
    }
  };
}