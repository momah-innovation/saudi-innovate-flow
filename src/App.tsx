// Simplified App.tsx with Unified Router
// Clean implementation using the unified routing system

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/enhanced-config-v3";
import { AuthProvider } from "@/contexts/AuthContext";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import { DirectionProvider } from "@/components/ui/direction-provider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SystemSettingsProvider } from "@/contexts/SystemSettingsContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { SidebarPersistenceProvider } from "@/contexts/SidebarContext";
import { MaintenanceGuard } from "@/components/maintenance/MaintenanceGuard";
import { UploaderSettingsProvider } from "./contexts/UploaderSettingsContext";
import { UnifiedRouter } from '@/routing/UnifiedRouter';
import { preloadCriticalTranslations } from '@/hooks/useTranslationAppShell';
import { useEffect } from 'react';

// Use the isolated query client to prevent React Error #321
import { createIsolatedQueryClient } from '@/lib/query/isolated-query-client';

const queryClient = createIsolatedQueryClient();

// Enhanced App component with V3 translation system integration
const App = () => {
  // Preload critical translations on app startup (no router dependency)

  // Preload critical translations on app startup
  useEffect(() => {
    preloadCriticalTranslations();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <DirectionProvider>
          <ThemeProvider>
            <TooltipProvider>
              <SystemSettingsProvider>
                <SettingsProvider>
                  <AuthProvider>
                    <WorkspaceProvider>
                      <SidebarPersistenceProvider>
                        <MaintenanceGuard>
                          <UploaderSettingsProvider>
                            <Toaster />
                            <Sonner />
                            <UnifiedRouter />
                          </UploaderSettingsProvider>
                        </MaintenanceGuard>
                      </SidebarPersistenceProvider>
                    </WorkspaceProvider>
                  </AuthProvider>
                </SettingsProvider>
              </SystemSettingsProvider>
            </TooltipProvider>
          </ThemeProvider>
        </DirectionProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
};

export default App;