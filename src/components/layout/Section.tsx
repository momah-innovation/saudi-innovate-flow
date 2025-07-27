import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'transparent' | 'muted' | 'card' | 'accent';
  border?: boolean;
  rounded?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  id?: string;
}

/**
 * Section - Semantic section wrapper
 * Provides consistent spacing and styling for page sections
 */
export function Section({ 
  children, 
  className,
  spacing = 'md',
  background = 'transparent',
  border = false,
  rounded = false,
  shadow = 'none',
  id
}: SectionProps) {
  const spacingClasses = {
    none: '',
    sm: 'py-4',
    md: 'py-6',
    lg: 'py-8',
    xl: 'py-12'
  };

  const backgroundClasses = {
    transparent: '',
    muted: 'bg-muted/30',
    card: 'bg-card',
    accent: 'bg-accent/10'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  return (
    <section 
      id={id}
      className={cn(
        'w-full',
        spacingClasses[spacing],
        backgroundClasses[background],
        border && 'border',
        rounded && 'rounded-lg',
        shadowClasses[shadow],
        className
      )}
    >
      {children}
    </section>
  );
}