import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDirection } from '@/components/ui/direction-provider';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveSidebarContextType {
  // State
  isOpen: boolean;
  isMiniMode: boolean;
  isOverlay: boolean;
  showNotifications: boolean;
  
  // Actions
  setIsOpen: (open: boolean) => void;
  setShowNotifications: (show: boolean) => void;
  toggleSidebar: () => void;
  closeBoth: () => void;
  
  // Responsive state
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  
  // RTL/LTR
  isRTL: boolean;
  sidePosition: 'left' | 'right';
}

const ResponsiveSidebarContext = createContext<ResponsiveSidebarContextType | undefined>(undefined);

export const useResponsiveSidebar = () => {
  const context = useContext(ResponsiveSidebarContext);
  if (context === undefined) {
    throw new Error('useResponsiveSidebar must be used within a ResponsiveSidebarProvider');
  }
  return context;
};

export const ResponsiveSidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isRTL } = useDirection();
  const isMobile = useIsMobile();
  
  // Responsive breakpoints
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;
  
  // Sidebar state
  const [isOpen, setIsOpenState] = useState(() => {
    // Get saved state from localStorage or default based on screen size
    const saved = localStorage.getItem('sidebar-open');
    if (saved !== null) return JSON.parse(saved);
    return isDesktop; // Open by default on desktop
  });
  
  const [showNotifications, setShowNotificationsState] = useState(false);
  
  // Responsive behavior
  const isMiniMode = isTablet && isOpen; // Tablet shows mini mode when "open"
  const isOverlay = isMobile; // Mobile uses overlay

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-collapse logic for tablet
  useEffect(() => {
    if (isTablet && isOpen && !isMiniMode) {
      setIsOpenState(true); // Keep it "open" but in mini mode
    }
  }, [isTablet, isOpen, isMiniMode]);

  // Sidebar position based on RTL
  const sidePosition: 'left' | 'right' = isRTL ? 'right' : 'left';

  const setIsOpen = useCallback((open: boolean) => {
    setIsOpenState(open);
    localStorage.setItem('sidebar-open', JSON.stringify(open));
    
    // Close notifications if opening sidebar (only one can be open)
    if (open && showNotifications) {
      setShowNotificationsState(false);
    }
  }, [showNotifications]);

  const setShowNotifications = useCallback((show: boolean) => {
    setShowNotificationsState(show);
    
    // Close sidebar if opening notifications (only one can be open)
    if (show && isOpen && isMobile) {
      setIsOpenState(false);
    }
  }, [isOpen, isMobile]);

  const toggleSidebar = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  const closeBoth = useCallback(() => {
    setIsOpenState(false);
    setShowNotificationsState(false);
  }, []);

  const value = {
    // State
    isOpen,
    isMiniMode,
    isOverlay,
    showNotifications,
    
    // Actions
    setIsOpen,
    setShowNotifications,
    toggleSidebar,
    closeBoth,
    
    // Responsive state
    isMobile,
    isTablet,
    isDesktop,
    
    // RTL/LTR
    isRTL,
    sidePosition,
  };

  return (
    <ResponsiveSidebarContext.Provider value={value}>
      {children}
    </ResponsiveSidebarContext.Provider>
  );
};