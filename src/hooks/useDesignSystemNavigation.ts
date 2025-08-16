/**
 * Design System Navigation Hook - Phase 8: Link Navigation Fixes
 * Replaces anchor tag navigation with React Router navigation in DesignSystem.tsx
 */

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { debugLog } from '@/utils/debugLogger';

export interface NavigationProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

export const useDesignSystemNavigation = () => {
  const navigate = useNavigate();

  // Create navigation handler for demo links
  const createDemoNavigation = useCallback((path: string, label: string) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      debugLog.debug('Demo navigation clicked', { 
        component: 'DesignSystem', 
        path, 
        label 
      });
      
      // For demo purposes, don't actually navigate
      // In production, would use: navigate(path);
    };
  }, [navigate]);

  // Navigation component that replaces anchor tags
  const DemoLink = ({ href, onClick, className, children }: NavigationProps) => {
    const handleClick = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      if (onClick) {
        onClick();
      } else if (href && href !== '#') {
        // Only navigate for real paths, not demo anchors
        if (!href.startsWith('#')) {
          navigate(href);
        }
      }
    }, [href, onClick]);

    return React.createElement(
      'button',
      {
        type: 'button',
        onClick: handleClick,
        className: className,
        style: { border: 'none', background: 'none', padding: 0, textAlign: 'inherit' }
      },
      children
    );
  };

  // Breadcrumb navigation
  const createBreadcrumbNavigation = useCallback((items: Array<{ label: string; path?: string }>) => {
    return items.map((item, index) => ({
      ...item,
      onClick: item.path ? () => navigate(item.path!) : undefined
    }));
  }, [navigate]);

  // Tab navigation for design system sections
  const createTabNavigation = useCallback((tabs: Array<{ id: string; label: string }>) => {
    return tabs.map(tab => ({
      ...tab,
      onClick: () => {
        debugLog.debug('Tab navigation', { 
          component: 'DesignSystem', 
          tabId: tab.id,
          label: tab.label 
        });
        // Scroll to section or update state
        const element = document.getElementById(tab.id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }));
  }, []);

  return {
    DemoLink,
    createDemoNavigation,
    createBreadcrumbNavigation,
    createTabNavigation
  };
};