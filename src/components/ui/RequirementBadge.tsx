import React from 'react';
import { cn } from '@/lib/utils';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface RequirementBadgeProps {
  requirement: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function RequirementBadge({ requirement, className, size = 'md' }: RequirementBadgeProps) {
  const { t } = useUnifiedTranslation();
  
  // Convert to translation key if needed
  const translationKey = requirement.includes('.') ? requirement : `requirement.${requirement}`;
  
  // Get translated text
  const requirementText = t(translationKey, requirement);
  
  // Get requirement-specific colors
  const getRequirementColor = (key: string): string => {
    const baseRequirement = key.replace(/^requirement\./, '');
    
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
  };
  
  const requirementColors = getRequirementColor(translationKey);
  
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
        requirementColors,
        sizeClasses[size],
        className
      )}
    >
      {requirementText}
    </span>
  );
}