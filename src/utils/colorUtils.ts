/**
 * Color utility functions for semantic design system
 * Provides consistent color mappings throughout the application
 */

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'upcoming':
    case 'scheduled': 
      return 'bg-scheduled text-scheduled-foreground border-scheduled-border';
    case 'ongoing':
    case 'active':
      return 'bg-active text-active-foreground border-active-border';
    case 'completed':
    case 'done':
      return 'bg-complete text-complete-foreground border-complete-border';
    case 'cancelled':
    case 'rejected':
      return 'bg-destructive text-destructive-foreground border-destructive';
    case 'pending':
      return 'bg-pending text-pending-foreground border-pending-border';
    case 'open':
      return 'bg-success text-success-foreground border-success-border';
    case 'closed':
      return 'bg-inactive text-inactive-foreground border-inactive-border';
    case 'review':
      return 'bg-warning text-warning-foreground border-warning-border';
    default: 
      return 'bg-muted text-muted-foreground border-border';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
    case 'urgent':
      return 'bg-priority-high text-priority-high-foreground border-priority-high-border';
    case 'medium':
    case 'normal':
      return 'bg-priority-medium text-priority-medium-foreground border-priority-medium-border';
    case 'low':
      return 'bg-priority-low text-priority-low-foreground border-priority-low-border';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'innovation':
      return 'bg-innovation text-innovation-foreground border-innovation-border';
    case 'technology':
      return 'bg-technology text-technology-foreground border-technology-border';
    case 'sustainability':
      return 'bg-sustainability text-sustainability-foreground border-sustainability-border';
    case 'social':
      return 'bg-social text-social-foreground border-social-border';
    case 'research':
      return 'bg-info text-info-foreground border-info-border';
    case 'partnership':
      return 'bg-partner text-partner-foreground border-partner-border';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

export const getValidationColor = (type: 'success' | 'warning' | 'error' | 'info') => {
  switch (type) {
    case 'success':
      return 'bg-success text-success-foreground border-success-border';
    case 'warning':
      return 'bg-warning text-warning-foreground border-warning-border';
    case 'error':
      return 'bg-destructive text-destructive-foreground border-destructive';
    case 'info':
      return 'bg-info text-info-foreground border-info-border';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

export const getRatingColor = (rating: number, max: number = 5) => {
  const percentage = (rating / max) * 100;
  
  if (percentage >= 80) {
    return 'bg-success text-success-foreground';
  } else if (percentage >= 60) {
    return 'bg-warning text-warning-foreground';
  } else if (percentage >= 40) {
    return 'bg-pending text-pending-foreground';
  } else {
    return 'bg-destructive text-destructive-foreground';
  }
};

export const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return 'bg-trend-up text-trend-up-foreground';
    case 'down':
      return 'bg-trend-down text-trend-down-foreground';
    case 'stable':
      return 'bg-trend-stable text-trend-stable-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

/**
 * Get semantic color classes for interactive states
 */
export const getInteractiveColor = (state: 'default' | 'hover' | 'active' | 'disabled') => {
  switch (state) {
    case 'hover':
      return 'hover:bg-accent hover:text-accent-foreground';
    case 'active':
      return 'bg-primary text-primary-foreground';
    case 'disabled':
      return 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed';
    default:
      return 'bg-background text-foreground';
  }
};

/**
 * Generate semantic overlay colors for hero sections
 */
export const getOverlayColor = (variant: 'primary' | 'secondary' | 'accent') => {
  switch (variant) {
    case 'primary':
      return 'bg-overlay-background/20 text-overlay-text border-overlay-button/30';
    case 'secondary':
      return 'bg-background/20 text-overlay-text border-overlay-button/30';
    case 'accent':
      return 'bg-accent/20 text-accent-foreground border-accent/30';
    default:
      return 'bg-background/20 text-foreground border-border/30';
  }
};