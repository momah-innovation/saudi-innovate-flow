/**
 * Translation helper utilities for consistent key-based translation usage
 */

import type { SupportedLanguage } from '@/types/translation';

// Status translation mappings
export const STATUS_TRANSLATIONS = {
  // Core statuses
  draft: 'status.draft',
  submitted: 'status.submitted',
  under_review: 'status.under_review',
  approved: 'status.approved',
  rejected: 'status.rejected',
  in_development: 'status.in_development',
  implemented: 'status.implemented',
  archived: 'status.archived',
  active: 'status.active',
  inactive: 'status.inactive',
  pending: 'status.pending',
  suspended: 'status.suspended',
  planning: 'status.planning',
  paused: 'status.paused',
  completed: 'status.completed',
  cancelled: 'status.cancelled',
  published: 'status.published',
  registration_open: 'status.registration_open',
  registration_closed: 'status.registration_closed',
  ongoing: 'status.ongoing',
  open: 'status.open',
  closed: 'status.closed',
} as const;

// Type translation mappings
export const TYPE_TRANSLATIONS = {
  // Challenge types
  innovation: 'challenge_type.innovation',
  improvement: 'challenge_type.improvement',
  research: 'challenge_type.research',
  technology: 'challenge_type.technology',
  
  // Event formats
  in_person: 'format.in_person',
  virtual: 'format.virtual',
  hybrid: 'format.hybrid',
  
  // Opportunity types
  partnership: 'opportunity_type.partnership',
  investment: 'opportunity_type.investment',
  collaboration: 'opportunity_type.collaboration',
  procurement: 'opportunity_type.procurement',
} as const;

// Visibility translation mappings
export const VISIBILITY_TRANSLATIONS = {
  public: 'visibility.public',
  private: 'visibility.private',
  internal: 'visibility.internal',
  restricted: 'visibility.restricted',
} as const;

// Sensitivity translation mappings
export const SENSITIVITY_TRANSLATIONS = {
  normal: 'sensitivity.normal',
  sensitive: 'sensitivity.sensitive',
  classified: 'sensitivity.classified',
} as const;

// Team role translation mappings
export const TEAM_ROLE_TRANSLATIONS = {
  manager: 'team_role.manager',
  member: 'team_role.member',
  lead: 'team_role.lead',
  coordinator: 'team_role.coordinator',
  admin: 'team_role.admin',
} as const;

// Participation translation mappings
export const PARTICIPATION_TRANSLATIONS = {
  individual: 'participation.individual',
  team: 'participation.team',
} as const;

// Notification translation mappings
export const NOTIFICATION_TRANSLATIONS = {
  reminder: 'notification.reminder',
  update: 'notification.update',
  deadline: 'notification.deadline',
  result: 'notification.result',
  registration: 'notification.registration',
  cancellation: 'notification.cancellation',
} as const;

/**
 * Convert legacy status value to translation key
 */
export function getStatusTranslationKey(status: string): string {
  // If already a translation key, return as-is
  if (status.includes('.')) {
    return status;
  }
  
  return STATUS_TRANSLATIONS[status as keyof typeof STATUS_TRANSLATIONS] || status;
}

/**
 * Convert legacy type value to translation key
 */
export function getTypeTranslationKey(type: string): string {
  // If already a translation key, return as-is
  if (type.includes('.')) {
    return type;
  }
  
  return TYPE_TRANSLATIONS[type as keyof typeof TYPE_TRANSLATIONS] || type;
}

/**
 * Convert legacy visibility value to translation key
 */
export function getVisibilityTranslationKey(visibility: string): string {
  // If already a translation key, return as-is
  if (visibility.includes('.')) {
    return visibility;
  }
  
  return VISIBILITY_TRANSLATIONS[visibility as keyof typeof VISIBILITY_TRANSLATIONS] || visibility;
}

// Removed duplicate - see line 255 for the correct implementation

/**
 * Convert legacy team role value to translation key
 */
export function getTeamRoleTranslationKey(role: string): string {
  // If already a translation key, return as-is
  if (role.includes('.')) {
    return role;
  }
  
  return TEAM_ROLE_TRANSLATIONS[role as keyof typeof TEAM_ROLE_TRANSLATIONS] || role;
}

/**
 * Get status color based on translation key
 */
export function getStatusColor(statusKey: string): string {
  const baseStatus = statusKey.replace(/^status\./, '');
  
  switch (baseStatus) {
    case 'draft':
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100';
    case 'submitted':
    case 'pending':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
    case 'under_review':
    case 'ongoing':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
    case 'approved':
    case 'active':
    case 'published':
    case 'open':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
    case 'rejected':
    case 'cancelled':
    case 'suspended':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    case 'completed':
    case 'implemented':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100';
    case 'paused':
    case 'closed':
    case 'archived':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    case 'in_development':
    case 'planning':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
  }
}

/**
 * Get type color based on translation key
 */
export function getTypeColor(typeKey: string): string {
  const baseType = typeKey.replace(/^[^.]+\./, '');
  
  switch (baseType) {
    case 'innovation':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
    case 'improvement':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
    case 'research':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
    case 'technology':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
    case 'partnership':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100';
    case 'investment':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100';
    case 'collaboration':
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-100';
    case 'procurement':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
  }
}

/**
 * Get visibility color based on translation key
 */
export function getVisibilityColor(visibilityKey: string): string {
  const baseVisibility = visibilityKey.replace(/^visibility\./, '');
  
  switch (baseVisibility) {
    case 'public':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
    case 'internal':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
    case 'private':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
    case 'restricted':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
  }
}

/**
 * Convert priority value to translation key
 */
export function getPriorityTranslationKey(priority: string): string {
  if (priority.includes('.')) {
    return priority;
  }
  
  return `priority.${priority}`;
}

/**
 * Convert sensitivity value to translation key  
 */
export function getSensitivityTranslationKey(sensitivity: string): string {
  if (sensitivity.includes('.')) {
    return sensitivity;
  }
  
  return SENSITIVITY_TRANSLATIONS[sensitivity as keyof typeof SENSITIVITY_TRANSLATIONS] || sensitivity;
}

/**
 * Convert requirement value to translation key
 */
export function getRequirementTranslationKey(requirement: string): string {
  if (requirement.includes('.')) {
    return requirement;
  }
  
  return `requirement.${requirement}`;
}

/**
 * Get priority color based on translation key
 */
export function getPriorityColor(priorityKey: string): string {
  const basePriority = priorityKey.replace(/^priority\./, '');
  
  switch (basePriority) {
    case 'low':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
    case 'high':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
    case 'urgent':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
  }
}

/**
 * Get sensitivity color based on translation key
 */
export function getSensitivityColor(sensitivityKey: string): string {
  const baseSensitivity = sensitivityKey.replace(/^sensitivity\./, '');
  
  switch (baseSensitivity) {
    case 'normal':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
    case 'sensitive':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
    case 'classified':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
  }
}

/**
 * Get requirement color based on translation key
 */
export function getRequirementColor(requirementKey: string): string {
  const baseRequirement = requirementKey.replace(/^requirement\./, '');
  
  switch (baseRequirement) {
    case 'technical':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
    case 'business':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
    case 'legal':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
    case 'documentation':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100';
    case 'presentation':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100';
    case 'criteria':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100';
    case 'validation':
      return 'bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
  }
}