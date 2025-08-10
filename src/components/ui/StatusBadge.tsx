import React from 'react';
import { cn } from '@/lib/utils';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { getStatusTranslationKey, getStatusColor } from '@/utils/translationHelpers';

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, className, size = 'md' }: StatusBadgeProps) {
  const { t } = useUnifiedTranslation();
  
  // Convert to translation key if needed
  const translationKey = getStatusTranslationKey(status);
  
  // Get translated text
  const statusText = t(translationKey, status);
  
  // Get status-specific colors
  const statusColors = getStatusColor(translationKey);
  
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
        statusColors,
        sizeClasses[size],
        className
      )}
    >
      {statusText}
    </span>
  );
}