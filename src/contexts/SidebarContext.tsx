import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebarPersistence = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebarPersistence must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarPersistenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpenState] = useState(() => {
    // Get saved state from localStorage or default to true
    const saved = localStorage.getItem('sidebar-open');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const setIsOpen = (open: boolean) => {
    setIsOpenState(open);
    localStorage.setItem('sidebar-open', JSON.stringify(open));
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const value = {
    isOpen,
    setIsOpen,
    toggleSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};