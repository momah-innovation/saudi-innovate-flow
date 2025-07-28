import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { SystemSettingsProvider } from "./contexts/SystemSettingsContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { DirectionProvider } from "@/components/ui/direction-provider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <DirectionProvider>
        <ThemeProvider>
          <SystemSettingsProvider>
            <SettingsProvider>
              <AuthProvider>
                <App />
                <Toaster />
              </AuthProvider>
            </SettingsProvider>
          </SystemSettingsProvider>
        </ThemeProvider>
      </DirectionProvider>
    </QueryClientProvider>
  </StrictMode>
);
