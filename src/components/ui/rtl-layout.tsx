import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useRTLAware } from '@/hooks/useRTLAware';

interface RTLLayoutProps {
  children: ReactNode;
  className?: string;
  /** Apply flex-row-reverse in RTL */
  flexRow?: boolean;
  /** Apply text alignment based on direction */
  textAlign?: 'start' | 'end' | 'center';
  /** Custom RTL classes to apply when in RTL mode */
  rtlClasses?: string;
  /** Custom LTR classes to apply when in LTR mode */
  ltrClasses?: string;
}

/**
 * RTLLayout - Wrapper component that handles RTL layout automatically
 * Use this for complex layouts that need comprehensive RTL support
 */
export function RTLLayout({ 
  children, 
  className,
  flexRow = false,
  textAlign,
  rtlClasses,
  ltrClasses
}: RTLLayoutProps) {
  const { isRTL, conditional, textStart, textEnd, flexRow: flexRowClass } = useRTLAware();

  const alignmentClass = textAlign === 'start' ? textStart : 
                        textAlign === 'end' ? textEnd : 
                        textAlign === 'center' ? 'text-center' : '';

  return (
    <div className={cn(
      className,
      flexRow && flexRowClass,
      alignmentClass,
      conditional(ltrClasses || '', rtlClasses || '')
    )}>
      {children}
    </div>
  );
}

interface RTLIconProps {
  children: ReactNode;
  /** Whether the icon should be mirrored in RTL */
  mirror?: boolean;
  className?: string;
}

/**
 * RTLIcon - Wrapper for icons that need RTL awareness
 * Automatically mirrors icons like arrows in RTL layouts
 */
export function RTLIcon({ children, mirror = false, className }: RTLIconProps) {
  const { iconDirection } = useRTLAware();

  return (
    <span className={cn(iconDirection(mirror), className)}>
      {children}
    </span>
  );
}

interface RTLFlexProps {
  children: ReactNode;
  className?: string;
  /** Gap between flex items */
  gap?: string;
  /** Alignment of flex items */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Justification of flex items */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

/**
 * RTLFlex - Flex container that automatically reverses in RTL
 */
export function RTLFlex({ 
  children, 
  className,
  gap = '2',
  align = 'center',
  justify = 'start'
}: RTLFlexProps) {
  const { flexRow } = useRTLAware();

  const alignClass = {
    start: 'items-start',
    center: 'items-center', 
    end: 'items-end',
    stretch: 'items-stretch'
  }[align];

  const justifyClass = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end', 
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }[justify];

  return (
    <div className={cn(
      'flex',
      flexRow,
      `gap-${gap}`,
      alignClass,
      justifyClass,
      className
    )}>
      {children}
    </div>
  );
}