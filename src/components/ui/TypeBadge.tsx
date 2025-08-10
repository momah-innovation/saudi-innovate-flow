import React from 'react';
import { cn } from '@/lib/utils';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { getTypeTranslationKey, getTypeColor } from '@/utils/translationHelpers';

interface TypeBadgeProps {
  type: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function TypeBadge({ type, className, size = 'md' }: TypeBadgeProps) {
  const { t } = useUnifiedTranslation();
  
  // Convert to translation key if needed
  const translationKey = getTypeTranslationKey(type);
  
  // Get translated text
  const typeText = t(translationKey, type);
  
  // Get type-specific colors
  const typeColors = getTypeColor(translationKey);
  
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
        typeColors,
        sizeClasses[size],
        className
      )}
    >
      {typeText}
    </span>
  );
}