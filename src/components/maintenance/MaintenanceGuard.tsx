import React from 'react';
import { useMaintenanceMode } from '@/hooks/useMaintenanceMode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Clock } from 'lucide-react';

interface MaintenanceGuardProps {
  children: React.ReactNode;
}

export const MaintenanceGuard: React.FC<MaintenanceGuardProps> = ({ children }) => {
  const { isMaintenanceMode, systemName } = useMaintenanceMode();

  if (isMaintenanceMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Settings className="w-16 h-16 text-primary animate-spin" />
                <Clock className="w-6 h-6 absolute -bottom-1 -right-1 text-muted-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              صيانة مجدولة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {systemName} في وضع الصيانة حالياً
            </p>
            <p className="text-sm text-muted-foreground">
              نعتذر عن الإزعاج. نحن نعمل على تحسين النظام وسيكون متاحاً قريباً.
            </p>
            <div className="pt-4">
              <p className="text-xs text-muted-foreground">
                للاستفسارات الطارئة، يرجى التواصل مع فريق الدعم
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};