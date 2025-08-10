import React from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { UnifiedSettingsManager } from '@/components/admin/settings/UnifiedSettingsManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function SystemSettings() {
  return (
    <AdminLayout
      title="System Settings"
      breadcrumbs={[
        { label: 'Admin', href: '/admin/dashboard' },
        { label: 'System Settings', href: '/admin/system-settings' }
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
            <Settings className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">System Settings</h1>
            <p className="text-muted-foreground">
              Configure system-wide settings and preferences
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Settings Management</CardTitle>
            <CardDescription>
              Manage all system settings from categories like general, security, AI features, and more.
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