import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

/**
 * Comprehensive RTL-aware utility hook
 * Provides all directional utilities needed for consistent RTL/LTR layouts
 */
export function useRTLAware() {
  const { isRTL, direction } = useDirection();

  // Helper function to create RTL-aware classes
  const rtlClass = (ltrClass: string, rtlClass: string) => isRTL ? rtlClass : ltrClass;

  return {
    // Core direction utilities
    isRTL,
    direction,
    
    // Flexbox utilities
    flexRow: rtlClass('flex-row', 'flex-row-reverse'),
    flexRowReverse: rtlClass('flex-row-reverse', 'flex-row'),
    
    // Text alignment
    textStart: rtlClass('text-left', 'text-right'),
    textEnd: rtlClass('text-right', 'text-left'),
    textLeft: 'text-left',
    textRight: 'text-right',
    
    // Margin utilities
    ml: (size: string) => rtlClass(`ml-${size}`, `mr-${size}`),
    mr: (size: string) => rtlClass(`mr-${size}`, `ml-${size}`),
    ms: (size: string) => rtlClass(`ml-${size}`, `mr-${size}`), // margin-start
    me: (size: string) => rtlClass(`mr-${size}`, `ml-${size}`), // margin-end
    
    // Padding utilities
    pl: (size: string) => rtlClass(`pl-${size}`, `pr-${size}`),
    pr: (size: string) => rtlClass(`pr-${size}`, `pl-${size}`),
    ps: (size: string) => rtlClass(`pl-${size}`, `pr-${size}`), // padding-start
    pe: (size: string) => rtlClass(`pr-${size}`, `pl-${size}`), // padding-end
    
    // Positioning utilities
    left: (size: string) => rtlClass(`left-${size}`, `right-${size}`),
    right: (size: string) => rtlClass(`right-${size}`, `left-${size}`),
    start: (size: string) => rtlClass(`left-${size}`, `right-${size}`),
    end: (size: string) => rtlClass(`right-${size}`, `left-${size}`),
    
    // Border radius
    roundedL: (size: string) => rtlClass(`rounded-l-${size}`, `rounded-r-${size}`),
    roundedR: (size: string) => rtlClass(`rounded-r-${size}`, `rounded-l-${size}`),
    roundedS: (size: string) => rtlClass(`rounded-l-${size}`, `rounded-r-${size}`), // rounded-start
    roundedE: (size: string) => rtlClass(`rounded-r-${size}`, `rounded-l-${size}`), // rounded-end
    
    // Transform utilities for icons that should mirror
    transform: isRTL ? 'scale-x-[-1]' : '',
    rotate180: isRTL ? 'rotate-180' : '',
    
    // Space and gap directions
    spaceXReverse: isRTL ? 'space-x-reverse' : '',
    
    // Float utilities
    floatStart: rtlClass('float-left', 'float-right'),
    floatEnd: rtlClass('float-right', 'float-left'),
    
    // Helper function to conditionally apply classes
    conditional: (ltrClasses: string, rtlClasses: string) => 
      isRTL ? rtlClasses : ltrClasses,
    
    // Helper to combine classes with RTL awareness
    classes: (...classes: (string | undefined | false | null)[]) => cn(...classes),
    
    // Icon direction helper
    iconDirection: (shouldMirror = false) => shouldMirror && isRTL ? 'scale-x-[-1]' : '',
    
    // Common layout patterns
    layouts: {
      cardHeader: cn(
        'flex items-center justify-between space-y-0 pb-2',
        rtlClass('flex-row', 'flex-row-reverse')
      ),
      searchInput: cn(
        'relative',
        rtlClass('pl-10', 'pr-10')
      ),
      buttonWithIcon: cn(
        'flex items-center gap-2',
        rtlClass('flex-row', 'flex-row-reverse')
      )
    }
  };
}

// Re-export for compatibility
export { useRTLAware as useRTLAwareClasses };