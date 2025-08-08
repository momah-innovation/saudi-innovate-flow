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
import { SidebarPersistenceProvider } from "@/contexts/SidebarContext";
import { MaintenanceGuard } from "@/components/maintenance/MaintenanceGuard";
import { UploaderSettingsProvider } from "./contexts/UploaderSettingsContext";
import { UnifiedRouter } from '@/routing/UnifiedRouter';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <DirectionProvider>
          <TooltipProvider>
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
          </TooltipProvider>
        </DirectionProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
};

export default App;