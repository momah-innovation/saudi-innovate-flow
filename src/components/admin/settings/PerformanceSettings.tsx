import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useDirection } from "@/components/ui/direction-provider";
import { PerformanceSettingsProps } from "@/types/admin-settings";

export function PerformanceSettings({ settings, onSettingChange }: PerformanceSettingsProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const [newCacheStrategy, setNewCacheStrategy] = useState("");
  
  const cacheStrategies = Array.isArray(settings.cache_strategies) 
    ? settings.cache_strategies 
    : ["memory", "redis", "filesystem", "database", "cdn"];

  const addCacheStrategy = () => {
    if (newCacheStrategy.trim() && !cacheStrategies.includes(newCacheStrategy)) {
      const updatedStrategies = [...cacheStrategies, newCacheStrategy.trim()];
      onSettingChange('cache_strategies', updatedStrategies);
      setNewCacheStrategy("");
      toast({
        title: t('success'),
        description: t('itemAddedSuccessfully')
      });
    }
  };

  const removeCacheStrategy = (strategyToRemove: string) => {
    const updatedStrategies = cacheStrategies.filter((strategy: string) => strategy !== strategyToRemove);
    onSettingChange('cache_strategies', updatedStrategies);
    toast({
      title: t('success'),
      description: t('itemRemovedSuccessfully')
    });
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Zap className="w-5 h-5" />
            {t('admin.settings.cache_strategies')}
          </CardTitle>
          <CardDescription>
            {t('admin.settings.cache_strategies_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newCacheStrategy}
              onChange={(e) => setNewCacheStrategy(e.target.value)}
              placeholder={t('admin.settings.add_cache_strategy')}
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addCacheStrategy} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {cacheStrategies.map((strategy: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`cacheStrategies.${strategy}`) || strategy}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeCacheStrategy(strategy)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>{t('admin.settings.performance_settings')}</CardTitle>
          <CardDescription>
            {t('admin.settings.performance_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="cacheTimeout">
                {t('admin.settings.cache_timeout')}
              </Label>
              <Input
                id="cacheTimeout"
                type="number"
                min="1"
                max="1440"
                value={typeof settings.cacheTimeout === 'number' ? settings.cacheTimeout : 60}
                onChange={(e) => onSettingChange('cacheTimeout', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxCacheSize">
                {t('admin.settings.max_cache_size')}
              </Label>
              <Input
                id="maxCacheSize"
                type="number"
                min="10"
                max="10240"
                value={typeof settings.maxCacheSize === 'number' ? settings.maxCacheSize : 512}
                onChange={(e) => onSettingChange('maxCacheSize', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dbConnectionPoolSize">
                {t('admin.settings.db_pool_size')}
              </Label>
              <Input
                id="dbConnectionPoolSize"
                type="number"
                min="5"
                max="100"
                value={typeof settings.dbConnectionPoolSize === 'number' ? settings.dbConnectionPoolSize : 20}
                onChange={(e) => onSettingChange('dbConnectionPoolSize', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requestTimeout">
                {t('admin.settings.request_timeout')}
              </Label>
              <Input
                id="requestTimeout"
                type="number"
                min="5"
                max="300"
                value={typeof settings.requestTimeout === 'number' ? settings.requestTimeout : 30}
                onChange={(e) => onSettingChange('requestTimeout', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultCacheStrategy">
                {t('admin.settings.default_cache_strategy')}
              </Label>
              <Select 
                value={typeof settings.defaultCacheStrategy === 'string' ? settings.defaultCacheStrategy : 'memory'} 
                onValueChange={(value) => onSettingChange('defaultCacheStrategy', value)}
              >
                <SelectTrigger className={isRTL ? 'text-right' : 'text-left'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cacheStrategies.map((strategy: string) => (
                    <SelectItem key={strategy} value={strategy}>
                      {t(`cacheStrategies.${strategy}`) || strategy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="compressionLevel">
                {t('admin.settings.compression_level')}
              </Label>
              <Select 
                value={typeof settings.compressionLevel === 'string' ? settings.compressionLevel : 'medium'} 
                onValueChange={(value) => onSettingChange('compressionLevel', value)}
              >
                <SelectTrigger className={isRTL ? 'text-right' : 'text-left'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('admin.settings.compression_levels.none')}</SelectItem>
                  <SelectItem value="low">{t('admin.settings.compression_levels.low')}</SelectItem>
                  <SelectItem value="medium">{t('admin.settings.compression_levels.medium')}</SelectItem>
                  <SelectItem value="high">{t('admin.settings.compression_levels.high')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">
                {t('admin.settings.enable_caching')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('admin.settings.caching_desc')}
              </p>
            </div>
            <Switch
              checked={settings.enableCaching !== false}
              onCheckedChange={(checked) => onSettingChange('enableCaching', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">
                {t('admin.settings.data_compression')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('admin.settings.compression_desc')}
              </p>
            </div>
            <Switch
              checked={settings.enableCompression !== false}
              onCheckedChange={(checked) => onSettingChange('enableCompression', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">
                {t('admin.settings.lazy_loading')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('admin.settings.lazy_loading_desc')}
              </p>
            </div>
            <Switch
              checked={settings.enableLazyLoading !== false}
              onCheckedChange={(checked) => onSettingChange('enableLazyLoading', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">
                {t('admin.settings.performance_monitoring')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('admin.settings.monitoring_desc')}
              </p>
            </div>
            <Switch
              checked={settings.enablePerformanceMonitoring !== false}
              onCheckedChange={(checked) => onSettingChange('enablePerformanceMonitoring', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}