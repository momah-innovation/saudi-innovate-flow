import React from 'react';
import { LogflareAnalyticsDashboard } from '@/components/analytics/LogflareAnalyticsDashboard';
import { AppShell } from '@/components/layout/AppShell';

const LogflareAnalyticsPage = () => {
  return (
    <AppShell>
      <LogflareAnalyticsDashboard />
    </AppShell>
  );
};

export default LogflareAnalyticsPage;