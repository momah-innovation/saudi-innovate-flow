// Simplified App.tsx with Unified Router
// Clean implementation using the unified routing system

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/enhanced-config-v2";
import { AuthProvider } from "@/contexts/AuthContext";
import { DirectionProvider } from "@/components/ui/direction-provider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SystemSettingsProvider } from "@/contexts/SystemSettingsContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { SidebarPersistenceProvider } from "@/contexts/SidebarContext";
import { MaintenanceGuard } from "@/components/maintenance/MaintenanceGuard";
import { UploaderSettingsProvider } from "./contexts/UploaderSettingsContext";
import { UnifiedRouter } from '@/routing/UnifiedRouter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <DirectionProvider>
          <ThemeProvider>
            <TooltipProvider>
              <SystemSettingsProvider>
                <SettingsProvider>
                  <AuthProvider>
                    <SidebarPersistenceProvider>
                      <MaintenanceGuard>
                        <UploaderSettingsProvider>
                          <Toaster />
                          <Sonner />
                          <UnifiedRouter />
                        </UploaderSettingsProvider>
                      </MaintenanceGuard>
                    </SidebarPersistenceProvider>
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