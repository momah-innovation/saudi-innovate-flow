import { cn } from '@/lib/utils';
import { useDirection } from '@/components/ui/direction-provider';
import { ReactNode } from 'react';

interface RTLAwareProps {
  children: ReactNode;
  className?: string;
  rtlClassName?: string;
  ltrClassName?: string;
}

/**
 * RTLAware - A wrapper component that applies different styles based on text direction
 * Usage:
 * <RTLAware rtlClassName="flex-row-reverse" ltrClassName="flex-row">
 *   <div>Content</div>
 * </RTLAware>
 */
export function RTLAware({ 
  children, 
  className, 
  rtlClassName, 
  ltrClassName 
}: RTLAwareProps) {
  const { isRTL } = useDirection();

  const appliedClassName = cn(
    className,
    isRTL ? rtlClassName : ltrClassName
  );

  return (
    <div className={appliedClassName}>
      {children}
    </div>
  );
}

/**
 * Hook for RTL-aware class names
 */
export function useRTLAwareClasses() {
  const { isRTL } = useDirection();

  return {
    // Flexbox utilities
    flexRow: isRTL ? 'flex-row-reverse' : 'flex-row',
    
    // Text alignment
    textStart: isRTL ? 'text-right' : 'text-left',
    textEnd: isRTL ? 'text-left' : 'text-right',
    
    // Margins
    ml: (size: string) => isRTL ? `mr-${size}` : `ml-${size}`,
    mr: (size: string) => isRTL ? `ml-${size}` : `mr-${size}`,
    
    // Padding
    pl: (size: string) => isRTL ? `pr-${size}` : `pl-${size}`,
    pr: (size: string) => isRTL ? `pl-${size}` : `pr-${size}`,
    
    // Positioning
    left: (size: string) => isRTL ? `right-${size}` : `left-${size}`,
    right: (size: string) => isRTL ? `left-${size}` : `right-${size}`,
    
    // Border radius
    roundedL: (size: string) => isRTL ? `rounded-r-${size}` : `rounded-l-${size}`,
    roundedR: (size: string) => isRTL ? `rounded-l-${size}` : `rounded-r-${size}`,
    
    // Utilities
    isRTL,
    direction: isRTL ? 'rtl' : 'ltr'
  };
}