import React, { useMemo, memo, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
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
  
  // Use portal to render outside normal DOM flow
  const sidebarContent = (
    <div style={{
      position: 'fixed', 
      top: '0px', 
      left: '0px', 
      width: open ? '300px' : '0px',
      height: '100vh',
      background: 'blue', 
      color: 'white', 
      padding: '20px', 
      zIndex: 99999,
      transition: 'width 0.3s ease',
      overflow: 'hidden'
    }}>
      <div>PORTAL SIDEBAR TEST: {String(open)}</div>
      {open && (
        <div style={{ marginTop: '20px' }}>
          <div>✅ Sidebar is OPEN</div>
          <button onClick={() => onOpenChange(false)} style={{ 
            background: 'white', 
            color: 'blue', 
            border: 'none', 
            padding: '8px 16px', 
            margin: '10px 0',
            cursor: 'pointer'
          }}>
            Close Sidebar
          </button>
        </div>
      )}
    </div>
  );

  return createPortal(sidebarContent, document.body);
});

NavigationSidebar.displayName = 'NavigationSidebar';