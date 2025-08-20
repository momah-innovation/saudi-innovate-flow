/**
 * Activity Filtering Utilities
 * Smart filtering system for important activities only
 */

import { 
  ActivityActionType, 
  ActivityImportance,
  CRITICAL_ACTIVITIES,
  HIGH_PRIORITY_ACTIVITIES,
  MEDIUM_PRIORITY_ACTIVITIES 
} from '@/types/activity';

export interface ActivityFilterConfig {
  enableSmartFiltering: boolean;
  logLevel: 'critical' | 'high' | 'medium' | 'all';
  excludePatterns: string[];
  includePatterns: string[];
  rateLimitPerHour: number;
}

export const DEFAULT_FILTER_CONFIG: ActivityFilterConfig = {
  enableSmartFiltering: true,
  logLevel: 'medium', // Log medium priority and above
  excludePatterns: [
    'navigation',
    'page_viewed',
    'tab_changed',
    'dashboard_accessed'
  ],
  includePatterns: [
    'challenge_*',
    'idea_*',
    'security_*',
    'role_*',
    'system_*'
  ],
  rateLimitPerHour: 50 // Max 50 activities per user per hour
};

// Activity categories for better organization
export const ACTIVITY_CATEGORIES = {
  innovation: [
    'challenge_created', 'challenge_published', 'challenge_completed',
    'idea_created', 'idea_submitted', 'idea_approved', 'idea_implemented'
  ],
  collaboration: [
    'team_joined', 'team_left', 'workspace_created', 'workspace_joined',
    'task_assigned', 'task_completed'
  ],
  events: [
    'event_created', 'event_registered', 'event_attended', 'event_cancelled'
  ],
  business: [
    'opportunity_created', 'opportunity_applied', 'opportunity_awarded',
    'partnership_created', 'partnership_activated', 'campaign_launched'
  ],
  security: [
    'failed_login', 'suspicious_activity', 'permission_denied', 'security_alert',
    'role_assigned', 'role_revoked', 'user_suspended'
  ],
  system: [
    'maintenance_started', 'configuration_changed', 'backup_created',
    'system_alert', 'data_export_requested'
  ]
} as const;

export function getActivityCategory(actionType: ActivityActionType): keyof typeof ACTIVITY_CATEGORIES | 'other' {
  for (const [category, activities] of Object.entries(ACTIVITY_CATEGORIES)) {
    if ((activities as readonly ActivityActionType[]).includes(actionType)) {
      return category as keyof typeof ACTIVITY_CATEGORIES;
    }
  }
  return 'other';
}

export function getActivityImportance(actionType: ActivityActionType): ActivityImportance {
  if (CRITICAL_ACTIVITIES.includes(actionType)) return 'critical';
  if (HIGH_PRIORITY_ACTIVITIES.includes(actionType)) return 'high';
  if (MEDIUM_PRIORITY_ACTIVITIES.includes(actionType)) return 'medium';
  return 'low';
}

export function shouldLogActivity(
  actionType: ActivityActionType, 
  config: Partial<ActivityFilterConfig> = {}
): boolean {
  const finalConfig = { ...DEFAULT_FILTER_CONFIG, ...config };
  
  if (!finalConfig.enableSmartFiltering) {
    return true; // Log everything if smart filtering is disabled
  }

  // Check exclude patterns
  if (finalConfig.excludePatterns.some(pattern => 
    actionType.includes(pattern) || new RegExp(pattern).test(actionType)
  )) {
    return false;
  }

  // Check include patterns (if any)
  if (finalConfig.includePatterns.length > 0) {
    const matchesInclude = finalConfig.includePatterns.some(pattern => {
      const regex = new RegExp(pattern.replace('*', '.*'));
      return regex.test(actionType);
    });
    if (!matchesInclude) return false;
  }

  // Check log level
  const importance = getActivityImportance(actionType);
  switch (finalConfig.logLevel) {
    case 'critical':
      return importance === 'critical';
    case 'high':
      return ['critical', 'high'].includes(importance);
    case 'medium':
      return ['critical', 'high', 'medium'].includes(importance);
    case 'all':
      return true;
    default:
      return importance !== 'low';
  }
}

// Rate limiting for activity logging
const activityCounters = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(userId: string, config: Partial<ActivityFilterConfig> = {}): boolean {
  const finalConfig = { ...DEFAULT_FILTER_CONFIG, ...config };
  const now = Date.now();
  const hourInMs = 60 * 60 * 1000;
  
  const userKey = `activity_${userId}`;
  const counter = activityCounters.get(userKey);
  
  // Reset counter if hour has passed
  if (!counter || now > counter.resetTime) {
    activityCounters.set(userKey, {
      count: 1,
      resetTime: now + hourInMs
    });
    return true;
  }
  
  // Check if under limit
  if (counter.count < finalConfig.rateLimitPerHour) {
    counter.count++;
    return true;
  }
  
  return false; // Rate limit exceeded
}

// Activity metadata enhancement
export function enhanceActivityMetadata(
  actionType: ActivityActionType,
  baseMetadata: Record<string, any> = {}
): Record<string, any> {
  const importance = getActivityImportance(actionType);
  const category = getActivityCategory(actionType);
  
  return {
    ...baseMetadata,
    importance,
    category,
    enhanced_at: new Date().toISOString(),
    version: '2.0',
    ...(importance === 'critical' && { alert_required: true }),
    ...(category === 'security' && { security_review: true })
  };
}