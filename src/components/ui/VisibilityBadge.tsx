import React from 'react';
import { cn } from '@/lib/utils';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { getVisibilityTranslationKey, getVisibilityColor } from '@/utils/translationHelpers';

interface VisibilityBadgeProps {
  visibility: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function VisibilityBadge({ visibility, className, size = 'md' }: VisibilityBadgeProps) {
  const { t } = useUnifiedTranslation();
  
  // Convert to translation key if needed
  const translationKey = getVisibilityTranslationKey(visibility);
  
  // Get translated text
  const visibilityText = t(translationKey, visibility);
  
  // Get visibility-specific colors
  const visibilityColors = getVisibilityColor(translationKey);
  
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
        visibilityColors,
        sizeClasses[size],
        className
      )}
    >
      {visibilityText}
    </span>
  );
}