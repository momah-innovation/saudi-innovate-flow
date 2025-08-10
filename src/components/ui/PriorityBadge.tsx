import React from 'react';
import { cn } from '@/lib/utils';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface PriorityBadgeProps {
  priority: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PriorityBadge({ priority, className, size = 'md' }: PriorityBadgeProps) {
  const { t } = useUnifiedTranslation();
  
  // Convert to translation key if needed
  const translationKey = priority.includes('.') ? priority : `priority.${priority}`;
  
  // Get translated text
  const priorityText = t(translationKey, priority);
  
  // Get priority-specific colors
  const getPriorityColor = (key: string): string => {
    const basePriority = key.replace(/^priority\./, '');
    
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
  };
  
  const priorityColors = getPriorityColor(translationKey);
  
  // Size variations
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base'
  };
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        priorityColors,
        sizeClasses[size],
        className
      )}
    >
      {priorityText}
    </span>
  );
}