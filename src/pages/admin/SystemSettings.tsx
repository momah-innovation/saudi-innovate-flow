import React from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { UnifiedSettingsManager } from '@/components/admin/settings/UnifiedSettingsManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

export default function SystemSettings() {
  const { t } = useUnifiedTranslation();
  
  return (
    <AdminLayout
      title={t('system_settings_page.title', 'System Settings')}
      breadcrumbs={[
        { label: t('admin.label', 'Admin'), href: '/admin/dashboard' },
        { label: t('system_settings_page.title', 'System Settings'), href: '/admin/system-settings' }
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
            <Settings className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('system_settings_page.title', 'System Settings')}</h1>
            <p className="text-muted-foreground">
              {t('system_settings_page.description', 'Configure system-wide settings and preferences')}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings_management.title', 'Settings Management')}</CardTitle>
            <CardDescription>
              {t('settings_management.description', 'Manage all system settings from categories like general, security, AI features, and more.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UnifiedSettingsManager />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}