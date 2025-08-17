import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Search, Download, Trash2, Settings, AlertTriangle } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useLogsData } from '@/hooks/useLogsData';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  source: string;
  message: string;
  metadata: Record<string, any>;
  user_id?: string;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  stack_trace?: string;
  tags: string[];
}

interface LogSource {
  id: string;
  name: string;
  type: 'application' | 'database' | 'server' | 'security' | 'api';
  enabled: boolean;
  log_level: 'debug' | 'info' | 'warn' | 'error';
  retention_days: number;
  format: 'json' | 'text' | 'structured';
  entries_today: number;
  last_entry: string;
}

export function LogsManagement() {
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  
  // ✅ MIGRATED: Using centralized hooks
  const {
    logs,
    sources,
    metrics,
    loading,
    refreshLogsData,
    searchLogs,
    exportLogs,
    updateLogSource,
    clearOldLogs
  } = useLogsData();
  
  const loadingManager = useUnifiedLoading({
    component: 'LogsManagement',
    showToast: true,
    logErrors: true
  });

  useEffect(() => {
    refreshLogsData();
  }, [refreshLogsData]);

  const logColumns: Column<LogEntry>[] = [
    {
      key: 'timestamp',
      title: t('logs.timestamp'),
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      key: 'level',
      title: t('logs.level'),
      render: (value: string) => (
        <Badge variant={
          value === 'fatal' || value === 'error' ? 'destructive' : 
          value === 'warn' ? 'secondary' : 
          value === 'info' ? 'default' : 'outline'
        }>
          {value.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'source',
      title: t('logs.source'),
      render: (value: string) => (
        <Badge variant="outline">
          {value}
        </Badge>
      ),
    },
    {
      key: 'message',
      title: t('logs.message'),
      render: (value: string) => (
        <span className="text-sm">
          {value.length > 80 ? `${value.substring(0, 80)}...` : value}
        </span>
      ),
    },
    {
      key: 'user_id',
      title: t('logs.user'),
      render: (value?: string) => value ? (
        <code className="text-xs bg-muted px-1 py-0.5 rounded">
          {value.substring(0, 8)}
        </code>
      ) : '-',
    },
    {
      key: 'tags',
      title: t('logs.tags'),
      render: (tags: string[]) => (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{tags.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
  ];

  const sourceColumns: Column<LogSource>[] = [
    {
      key: 'name',
      title: t('logs.source_name'),
    },
    {
      key: 'type',
      title: t('logs.type'),
      render: (value: string) => (
        <Badge variant="outline">
          {value}
        </Badge>
      ),
    },
    {
      key: 'enabled',
      title: t('logs.status'),
      render: (value: boolean, item: LogSource) => (
        <div className="flex items-center gap-2">
          <Switch 
            checked={value} 
            onCheckedChange={(checked) => updateLogSource(item.id, { enabled: checked })}
          />
          <span className="text-sm">
            {value ? t('logs.enabled') : t('logs.disabled')}
          </span>
        </div>
      ),
    },
    {
      key: 'log_level',
      title: t('logs.log_level'),
      render: (value: string) => (
        <Badge variant="secondary">
          {value.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'entries_today',
      title: t('logs.entries_today'),
      render: (value: number) => value.toLocaleString(),
    },
    {
      key: 'retention_days',
      title: t('logs.retention'),
      render: (value: number) => `${value} ${t('logs.days')}`,
    },
    {
      key: 'last_entry',
      title: t('logs.last_entry'),
      render: (value: string) => new Date(value).toLocaleString(),
    },
  ];

  const handleSearch = () => {
    searchLogs({
      search: searchTerm,
      level: levelFilter || undefined,
      source: sourceFilter || undefined
    });
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('logs.total_entries')}</p>
                <p className="text-2xl font-bold">{metrics?.totalEntries?.toLocaleString() || 0}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('logs.entries_today')}</p>
                <p className="text-2xl font-bold">{metrics?.entriesToday?.toLocaleString() || 0}</p>
              </div>
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('logs.errors_today')}</p>
                <p className="text-2xl font-bold">{metrics?.errorCount || 0}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('logs.warnings_today')}</p>
                <p className="text-2xl font-bold">{metrics?.warningCount || 0}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('logs.top_sources')}</CardTitle>
            <CardDescription>{t('logs.top_sources_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics?.topSources?.map((source) => (
                <div key={source.source} className="flex justify-between items-center p-2 border rounded">
                  <span className="font-medium">{source.source}</span>
                  <Badge variant="outline">{source.count.toLocaleString()}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('logs.log_level_distribution')}</CardTitle>
            <CardDescription>{t('logs.distribution_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(metrics?.logLevelDistribution || {}).map(([level, percentage]) => (
                <div key={level} className="flex justify-between items-center p-2 border rounded">
                  <Badge variant={
                    level === 'fatal' || level === 'error' ? 'destructive' : 
                    level === 'warn' ? 'secondary' : 'outline'
                  }>
                    {level.toUpperCase()}
                  </Badge>
                  <span>{percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const LogsTab = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <Input 
            placeholder={t('logs.search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder={t('logs.level')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t('logs.all_levels')}</SelectItem>
            <SelectItem value="debug">DEBUG</SelectItem>
            <SelectItem value="info">INFO</SelectItem>
            <SelectItem value="warn">WARN</SelectItem>
            <SelectItem value="error">ERROR</SelectItem>
            <SelectItem value="fatal">FATAL</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t('logs.source')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t('logs.all_sources')}</SelectItem>
            {sources.map((source) => (
              <SelectItem key={source.id} value={source.name.toLowerCase()}>
                {source.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button onClick={handleSearch}>
          <Search className="w-4 h-4 mr-2" />
          {t('logs.search')}
        </Button>
        
        <Button onClick={() => exportLogs('json')} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          {t('logs.export')}
        </Button>
      </div>
      
      <DataTable
        columns={logColumns}
        data={logs || []}
        loading={loading}
        searchable={false}
      />
    </div>
  );

  const SourcesTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('logs.log_sources')}</h3>
        <div className="flex gap-2">
          <Button onClick={() => clearOldLogs(30)} variant="outline">
            <Trash2 className="w-4 h-4 mr-2" />
            {t('logs.clear_old_logs')}
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            {t('logs.add_source')}
          </Button>
        </div>
      </div>
      
      <DataTable
        columns={sourceColumns}
        data={sources || []}
        loading={loading}
        searchable={true}
      />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb />
      <PageLayout
        title={t('logs_management.title')}
        description={t('logs_management.description')}
        className="space-y-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {t('logs_management.overview_tab')}
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              {t('logs_management.logs_tab')}
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {t('logs_management.sources_tab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="logs">
            <LogsTab />
          </TabsContent>

          <TabsContent value="sources">
            <SourcesTab />
          </TabsContent>
        </Tabs>
      </PageLayout>
    </div>
  );
}