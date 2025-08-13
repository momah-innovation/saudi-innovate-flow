import React, { useMemo, memo, useState, useLayoutEffect } from 'react';
import { 
  Home, Calendar, Users, Lightbulb, Briefcase, Target, 
  Settings, Shield, ChevronDown, ChevronRight
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { MenuItem, GroupedMenuItems } from '@/types/navigation';

/**
 * NavigationSidebar - Fast overlay navigation with core menu items
 * Optimized for performance with minimal re-renders
 */

interface NavigationSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NavigationSidebar = memo(function NavigationSidebar({ open, onOpenChange }: NavigationSidebarProps) {
  console.log('NavigationSidebar render', { open });
  
  React.useEffect(() => {
    console.log('NavigationSidebar open state changed', { open });
  }, [open]);
  
  // Return the absolute simplest possible JSX
  return (
    <div style={{position: 'fixed', top: '50px', left: '50px', background: 'red', color: 'white', padding: '20px', zIndex: 99999}}>
      SIDEBAR TEST: {String(open)}
    </div>
  );
});

NavigationSidebar.displayName = 'NavigationSidebar';