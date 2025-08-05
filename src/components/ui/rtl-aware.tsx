import { cn } from '@/lib/utils';
import { useDirection } from '@/components/ui/direction-provider';
import { ReactNode } from 'react';
import { useRTLAware } from '@/hooks/useRTLAware';

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
 * Hook for RTL-aware class names - Legacy compatibility
 * @deprecated Use useRTLAware from @/hooks/useRTLAware instead
 */
export function useRTLAwareClasses() {
  return useRTLAware();
}