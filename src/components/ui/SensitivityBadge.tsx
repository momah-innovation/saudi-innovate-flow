import React from 'react';
import { cn } from '@/lib/utils';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface SensitivityBadgeProps {
  sensitivity: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SensitivityBadge({ sensitivity, className, size = 'md' }: SensitivityBadgeProps) {
  const { t } = useUnifiedTranslation();
  
  // Convert to translation key if needed
  const translationKey = sensitivity.includes('.') ? sensitivity : `sensitivity.${sensitivity}`;
  
  // Get translated text
  const sensitivityText = t(translationKey, sensitivity);
  
  // Get sensitivity-specific colors
  const getSensitivityColor = (key: string): string => {
    const baseSensitivity = key.replace(/^sensitivity\./, '');
    
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
  };
  
  const sensitivityColors = getSensitivityColor(translationKey);
  
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
        sensitivityColors,
        sizeClasses[size],
        className
      )}
    >
      {sensitivityText}
    </span>
  );
}