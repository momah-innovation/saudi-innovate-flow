import { useEffect } from "react";
import { useDirection } from "@/components/ui/direction-provider";
import { cn } from "@/lib/utils";

interface RTLProviderProps {
  children: React.ReactNode;
  className?: string;
}

export function RTLProvider({ children, className }: RTLProviderProps) {
  const { direction } = useDirection();
  
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.setAttribute('data-direction', direction);
  }, [direction]);

  return (
    <div 
      className={cn(
        "rtl-container",
        direction === 'rtl' && 'rtl:space-x-reverse',
        className
      )}
      dir={direction}
    >
      {children}
    </div>
  );
}

export function useRTLAware() {
  const { direction, isRTL } = useDirection();
  
  const getMarginClass = (side: 'left' | 'right', size: string) => {
    if (side === 'left') {
      return isRTL ? 'mr-' + size : 'ml-' + size;
    } else {
      return isRTL ? 'ml-' + size : 'mr-' + size;
    }
  };

  const getPaddingClass = (side: 'left' | 'right', size: string) => {
    if (side === 'left') {
      return isRTL ? 'pr-' + size : 'pl-' + size;
    } else {
      return isRTL ? 'pl-' + size : 'pr-' + size;
    }
  };

  const getTextAlignClass = (align: 'left' | 'right') => {
    if (align === 'left') {
      return isRTL ? 'text-right' : 'text-left';
    } else {
      return isRTL ? 'text-left' : 'text-right';
    }
  };

  return {
    direction,
    isRTL,
    getMarginClass,
    getPaddingClass,
    getTextAlignClass,
    flexReverse: isRTL ? 'flex-row-reverse' : 'flex-row'
  };
}