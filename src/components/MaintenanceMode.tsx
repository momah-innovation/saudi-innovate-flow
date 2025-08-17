// Maintenance Mode Component for Critical Updates
// Used during implementation phases for safe deployment

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { createErrorHandler } from '@/utils/errorHandler';
import { AlertTriangle, Wrench, Clock } from 'lucide-react';

interface MaintenanceModeProps {
  enabled?: boolean;
  message?: string;
  estimatedTime?: string;
  contact?: string;
}

export function MaintenanceMode({ 
  enabled = false,
  message = "We're improving your experience. Back shortly!",
  estimatedTime = "15-30 minutes",
  contact = "support@saudiinnovate.gov.sa"
}: MaintenanceModeProps) {
  // Only show if maintenance mode is enabled
  if (!enabled && process.env.NODE_ENV !== 'development') {
    return null;
  }

  const isMaintenanceMode = enabled || process.env.MAINTENANCE_MODE === "true";
  
  if (!isMaintenanceMode) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Wrench className="h-12 w-12 text-primary animate-pulse" />
              <AlertTriangle className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            System Maintenance
          </CardTitle>
          <div className="text-lg font-semibold text-foreground" dir="rtl">
            صيانة النظام
          </div>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground text-lg">
            {message}
          </p>
          
          <p className="text-muted-foreground text-right" dir="rtl">
            نعمل على تحسين تجربتك. سنعود قريباً!
          </p>
          
          {estimatedTime && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Estimated time: {estimatedTime}</span>
            </div>
          )}
          
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Need urgent assistance?
            </p>
            <p className="text-xs text-muted-foreground">
              Contact: {contact}
            </p>
          </div>
          
          {/* Progress indicator */}
          <div className="w-full bg-secondary rounded-full h-2 mt-4">
            <div 
              className="bg-primary h-2 rounded-full animate-pulse" 
              style={{ width: '60%' }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook to check maintenance status
export function useMaintenanceMode() {
  const [isMaintenanceMode, setIsMaintenanceMode] = React.useState(false);
  
  const { withLoading } = useUnifiedLoading({
    component: 'MaintenanceMode',
    showToast: false,
    logErrors: true,
    timeout: 5000
  });
  
  const { handleError } = createErrorHandler({
    component: 'MaintenanceMode',
    showToast: false,
    logErrors: true
  });
  
  React.useEffect(() => {
    // Check if maintenance mode is enabled
    const checkMaintenanceMode = async () => {
      try {
        const envMaintenanceMode = process.env.MAINTENANCE_MODE === "true";
        const localStorageMaintenanceMode = localStorage.getItem('maintenance_mode') === 'true';
        
        setIsMaintenanceMode(envMaintenanceMode || localStorageMaintenanceMode);
      } catch (error) {
        handleError(error as Error, 'check_maintenance_mode');
      }
    };
    
    checkMaintenanceMode();
    
    // Check periodically for changes using standard timer
    const intervalId = setInterval(checkMaintenanceMode, 30000); // Every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [handleError]);
  
  return {
    isMaintenanceMode,
    enableMaintenanceMode: async () => {
      await withLoading('enable', async () => {
        localStorage.setItem('maintenance_mode', 'true');
        setIsMaintenanceMode(true);
      }, {
        logContext: { action: 'enable_maintenance' }
      });
    },
    disableMaintenanceMode: async () => {
      await withLoading('disable', async () => {
        localStorage.removeItem('maintenance_mode');
        setIsMaintenanceMode(false);
      }, {
        logContext: { action: 'disable_maintenance' }
      });
    }
  };
}

export default MaintenanceMode;