import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useLogflareAnalytics } from '@/hooks/useLogflareAnalytics';
import { Activity, Database, TrendingUp, AlertCircle, Info, AlertTriangle, Bug } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';

interface AnalyticsData {
  data: {
    rows: Array<{
      level?: string;
      timestamp?: string;
      message?: string;
      event_message?: string;
      metadata?: Record<string, unknown>;
    }>;
    schema?: Array<{ name: string; type: string }>;
  };
}

export const LogflareAnalyticsDashboard = () => {
  const { getAnalytics, createSource, logEvent, isLoading } = useLogflareAnalytics();
  const { t } = useUnifiedTranslation();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [customQuery, setCustomQuery] = useState('SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100');
  const [sourceName, setSourceName] = useState('innovation-platform');
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceDescription, setNewSourceDescription] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      logger.info('Loading analytics data', { component: 'LogflareAnalyticsDashboard', action: 'loadAnalytics', data: { sourceName } });
      const data = await getAnalytics({ source_name: sourceName, query: customQuery });
      setAnalyticsData(data);
    } catch (error) {
      logger.error('Failed to load analytics', { component: 'LogflareAnalyticsDashboard', action: 'loadAnalytics' }, error as Error);
    }
  };

  const handleCreateSource = async () => {
    if (!newSourceName.trim()) return;
    
    try {
      await createSource(newSourceName, newSourceDescription);
      setNewSourceName('');
      setNewSourceDescription('');
    } catch (error) {
      logger.error('Failed to create source', { component: 'LogflareAnalyticsDashboard', action: 'handleCreateSource' }, error as Error);
    }
  };

  const handleTestLog = async (level: 'info' | 'warn' | 'error' | 'debug') => {
    const messages = {
      info: 'Test info message from Logflare integration',
      warn: 'Test warning message - something might need attention',
      error: 'Test error message - simulated error condition',
      debug: 'Test debug message - detailed diagnostic information'
    };

    await logEvent(level, messages[level], {
      component: 'LogflareAnalyticsDashboard',
      test: true,
      feature: 'log_testing'
    });
    
    // Refresh analytics after logging
    setTimeout(() => loadAnalytics(), 2000);
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warn': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'debug': return <Bug className="h-4 w-4 text-muted-foreground" />;
      default: return <Info className="h-4 w-4 text-info" />;
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'error': return 'destructive';
      case 'warn': return 'secondary';
      case 'debug': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">{t('analytics.logflare.title', 'Logflare Analytics')}</h2>
          <p className="text-muted-foreground">{t('analytics.logflare.description', 'Monitor logs and analytics for your innovation platform')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <Badge variant="outline">
            {analyticsData?.data?.rows?.length || 0} logs
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Query Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Source Name</label>
                  <Input
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}
                    placeholder="innovation-platform"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Query</label>
                  <Textarea
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    placeholder="SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100"
                    rows={3}
                  />
                </div>
              </div>
              <Button onClick={loadAnalytics} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Run Query'}
              </Button>
            </CardContent>
          </Card>

          {analyticsData && (
            <Card>
              <CardHeader>
                <CardTitle>Query Results</CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData.data?.rows?.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="text-2xl font-bold">{analyticsData.data.rows.length}</div>
                        <div className="text-sm text-muted-foreground">Total Records</div>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="text-2xl font-bold">
                          {analyticsData.data.schema?.length || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Columns</div>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="text-2xl font-bold">
                          {new Date().toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Last Updated</div>
                      </div>
                    </div>
                    
                    <div className="max-h-96 overflow-auto">
                      <div className="space-y-2">
                        {analyticsData.data.rows.slice(0, 20).map((row, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                            {row.level && getLevelIcon(row.level)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {row.level && (
                                  <Badge variant={getLevelBadgeColor(row.level)}>
                                    {row.level}
                                  </Badge>
                                )}
                                {row.timestamp && (
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(row.timestamp).toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm font-medium break-words">
                                {row.message || row.event_message || JSON.stringify(row)}
                              </div>
                              {row.metadata && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {JSON.stringify(row.metadata, null, 2)}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No data found for the current query
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Create New Source
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Source Name</label>
                  <Input
                    value={newSourceName}
                    onChange={(e) => setNewSourceName(e.target.value)}
                    placeholder="my-new-source"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={newSourceDescription}
                    onChange={(e) => setNewSourceDescription(e.target.value)}
                    placeholder="Description for this log source"
                  />
                </div>
              </div>
              <Button onClick={handleCreateSource} disabled={isLoading || !newSourceName.trim()}>
                {isLoading ? 'Creating...' : 'Create Source'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Log Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleTestLog('info')}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Info className="h-4 w-4" />
                  Info
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleTestLog('warn')}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Warning
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleTestLog('error')}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  Error
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleTestLog('debug')}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Bug className="h-4 w-4" />
                  Debug
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};