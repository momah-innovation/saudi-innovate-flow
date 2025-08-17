import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Trash2, RefreshCw, Settings, BarChart3, Zap } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useCacheData } from '@/hooks/useCacheData';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface CacheEntry {
  id: string;
  key: string;
  type: 'redis' | 'memory' | 'database' | 'cdn';
  size_mb: number;
  hits: number;
  misses: number;
  hit_rate: number;
  ttl_seconds?: number;
  created_at: string;
  last_accessed: string;
  expires_at?: string;
  tags: string[];
}

interface CacheConfig {
  id: string;
  name: string;
  type: 'redis' | 'memory' | 'database' | 'cdn';
  enabled: boolean;
  config: {
    max_size_mb: number;
    default_ttl_seconds: number;
    eviction_policy: 'lru' | 'lfu' | 'fifo' | 'ttl';
    compression_enabled: boolean;
  };
  performance: {
    hit_rate: number;
    avg_response_time_ms: number;
    total_operations: number;
    memory_usage_mb: number;
  };
  created_at: string;
  updated_at: string;
}

export function CacheManagement() {
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  
  // ✅ MIGRATED: Using centralized hooks
  const {
    entries,
    configs,
    metrics,
    loading,
    refreshCacheData,
    clearCacheEntry,
    clearCacheByTag,
    updateCacheConfig,
    flushAllCache,
    preloadCache
  } = useCacheData();
  
  const loadingManager = useUnifiedLoading({
    component: 'CacheManagement',
    showToast: true,
    logErrors: true
  });

  useEffect(() => {
    refreshCacheData();
  }, [refreshCacheData]);

  const entryColumns: Column<CacheEntry>[] = [
    {
      key: 'key',
      title: t('cache.key'),
      render: (value: string) => (
        <code className="text-sm bg-muted px-2 py-1 rounded">
          {value.length > 30 ? `${value.substring(0, 30)}...` : value}
        </code>
      ),
    },
    {
      key: 'type',
      title: t('cache.type'),
      render: (value: string) => (
        <Badge variant="outline">
          {value}
        </Badge>
      ),
    },
    {
      key: 'size_mb',
      title: t('cache.size'),
      render: (value: number) => `${value.toFixed(3)} MB`,
    },
    {
      key: 'hit_rate',
      title: t('cache.hit_rate'),
      render: (value: number) => (
        <Badge variant={value > 90 ? 'default' : value > 70 ? 'secondary' : 'destructive'}>
          {value.toFixed(1)}%
        </Badge>
      ),
    },
    {
      key: 'tags',
      title: t('cache.tags'),
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
    {
      key: 'expires_at',
      title: t('cache.expires_at'),
      render: (value?: string) => 
        value ? new Date(value).toLocaleString() : t('cache.no_expiry'),
    },
    {
      key: 'id' as keyof CacheEntry,
      title: t('common.actions'),
      render: (_, item: CacheEntry) => (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => clearCacheEntry(item.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const configColumns: Column<CacheConfig>[] = [
    {
      key: 'name',
      title: t('cache.config_name'),
    },
    {
      key: 'type',
      title: t('cache.type'),
      render: (value: string) => (
        <Badge variant="outline">
          {value}
        </Badge>
      ),
    },
    {
      key: 'enabled',
      title: t('cache.status'),
      render: (value: boolean, item: CacheConfig) => (
        <div className="flex items-center gap-2">
          <Switch 
            checked={value} 
            onCheckedChange={(checked) => updateCacheConfig(item.id, { enabled: checked })}
          />
          <span className="text-sm">
            {value ? t('cache.enabled') : t('cache.disabled')}
          </span>
        </div>
      ),
    },
    {
      key: 'performance',
      title: t('cache.hit_rate'),
      render: (performance: CacheConfig['performance']) => 
        `${performance.hit_rate.toFixed(1)}%`,
    },
    {
      key: 'performance',
      title: t('cache.memory_usage'),
      render: (performance: CacheConfig['performance']) => 
        `${performance.memory_usage_mb.toFixed(1)} MB`,
    },
    {
      key: 'config',
      title: t('cache.max_size'),
      render: (config: CacheConfig['config']) => 
        `${config.max_size_mb} MB`,
    },
  ];

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('cache.total_entries')}</p>
                <p className="text-2xl font-bold">{metrics?.totalEntries || 0}</p>
              </div>
              <Database className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('cache.total_size')}</p>
                <p className="text-2xl font-bold">{metrics?.totalSizeMB?.toFixed(1) || 0} MB</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('cache.hit_rate')}</p>
                <p className="text-2xl font-bold">{metrics?.overallHitRate?.toFixed(1) || 0}%</p>
              </div>
              <Zap className={`w-8 h-8 ${(metrics?.overallHitRate || 0) > 90 ? 'text-green-600' : 'text-yellow-600'}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('cache.operations_today')}</p>
                <p className="text-2xl font-bold">{metrics?.operationsToday?.toLocaleString() || 0}</p>
              </div>
              <RefreshCw className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('cache.cache_performance')}</CardTitle>
            <CardDescription>{t('cache.performance_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {configs.map((config) => (
                <div key={config.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">{config.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {config.performance.avg_response_time_ms.toFixed(1)}ms avg
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={config.performance.hit_rate > 90 ? 'default' : 'secondary'}>
                      {config.performance.hit_rate.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('cache.cache_actions')}</CardTitle>
            <CardDescription>{t('cache.actions_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                onClick={refreshCacheData} 
                className="w-full" 
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('cache.refresh_stats')}
              </Button>
              
              <Button 
                onClick={() => clearCacheByTag('user')} 
                className="w-full" 
                variant="outline"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t('cache.clear_user_cache')}
              </Button>
              
              <Button 
                onClick={() => preloadCache(['popular_challenges', 'recent_events'])} 
                className="w-full" 
                variant="outline"
              >
                <Zap className="w-4 h-4 mr-2" />
                {t('cache.preload_common')}
              </Button>
              
              <Button 
                onClick={flushAllCache} 
                className="w-full" 
                variant="destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t('cache.flush_all')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const EntriesTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('cache.cache_entries')}</h3>
        <Button onClick={refreshCacheData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          {t('common.refresh')}
        </Button>
      </div>
      
      <DataTable
        columns={entryColumns}
        data={entries || []}
        loading={loading}
        searchable={true}
      />
    </div>
  );

  const ConfigsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('cache.cache_configurations')}</h3>
        <Button>
          <Settings className="w-4 h-4 mr-2" />
          {t('cache.add_config')}
        </Button>
      </div>
      
      <DataTable
        columns={configColumns}
        data={configs || []}
        loading={loading}
        searchable={true}
      />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb />
      <PageLayout
        title={t('cache_management.title')}
        description={t('cache_management.description')}
        className="space-y-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t('cache_management.overview_tab')}
            </TabsTrigger>
            <TabsTrigger value="entries" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              {t('cache_management.entries_tab')}
            </TabsTrigger>
            <TabsTrigger value="configs" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {t('cache_management.configs_tab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="entries">
            <EntriesTab />
          </TabsContent>

          <TabsContent value="configs">
            <ConfigsTab />
          </TabsContent>
        </Tabs>
      </PageLayout>
    </div>
  );
}