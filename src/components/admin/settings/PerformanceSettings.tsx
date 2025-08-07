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

interface PerformanceSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function PerformanceSettings({ settings, onSettingChange }: PerformanceSettingsProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const [newCacheStrategy, setNewCacheStrategy] = useState("");
  
  const cacheStrategies = settings.cache_strategies || ["memory", "redis", "filesystem", "database", "cdn"];

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
            {isRTL ? 'استراتيجيات التخزين المؤقت' : 'Cache Strategies'}
          </CardTitle>
          <CardDescription>
            {isRTL ? 'إدارة استراتيجيات التخزين المؤقت للنظام' : 'Manage cache strategies for the system'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newCacheStrategy}
              onChange={(e) => setNewCacheStrategy(e.target.value)}
              placeholder={isRTL ? "أضف استراتيجية تخزين مؤقت جديدة" : "Add new cache strategy"}
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
          <CardTitle>{isRTL ? 'إعدادات الأداء' : 'Performance Settings'}</CardTitle>
          <CardDescription>
            {isRTL ? 'التحكم في إعدادات أداء النظام' : 'Control system performance settings'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="cacheTimeout">
                {isRTL ? 'مهلة انتهاء التخزين المؤقت (دقائق)' : 'Cache Timeout (minutes)'}
              </Label>
              <Input
                id="cacheTimeout"
                type="number"
                min="1"
                max="1440"
                value={settings.cacheTimeout || 60}
                onChange={(e) => onSettingChange('cacheTimeout', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxCacheSize">
                {isRTL ? 'أقصى حجم تخزين مؤقت (ميجابايت)' : 'Max Cache Size (MB)'}
              </Label>
              <Input
                id="maxCacheSize"
                type="number"
                min="10"
                max="10240"
                value={settings.maxCacheSize || 512}
                onChange={(e) => onSettingChange('maxCacheSize', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dbConnectionPoolSize">
                {isRTL ? 'حجم مجموعة اتصالات قاعدة البيانات' : 'Database Connection Pool Size'}
              </Label>
              <Input
                id="dbConnectionPoolSize"
                type="number"
                min="5"
                max="100"
                value={settings.dbConnectionPoolSize || 20}
                onChange={(e) => onSettingChange('dbConnectionPoolSize', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requestTimeout">
                {isRTL ? 'مهلة انتهاء الطلب (ثانية)' : 'Request Timeout (seconds)'}
              </Label>
              <Input
                id="requestTimeout"
                type="number"
                min="5"
                max="300"
                value={settings.requestTimeout || 30}
                onChange={(e) => onSettingChange('requestTimeout', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultCacheStrategy">
                {isRTL ? 'استراتيجية التخزين المؤقت الافتراضية' : 'Default Cache Strategy'}
              </Label>
              <Select 
                value={settings.defaultCacheStrategy || 'memory'} 
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
                {isRTL ? 'مستوى الضغط' : 'Compression Level'}
              </Label>
              <Select 
                value={settings.compressionLevel || 'medium'} 
                onValueChange={(value) => onSettingChange('compressionLevel', value)}
              >
                <SelectTrigger className={isRTL ? 'text-right' : 'text-left'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{isRTL ? 'بدون ضغط' : 'None'}</SelectItem>
                  <SelectItem value="low">{isRTL ? 'منخفض' : 'Low'}</SelectItem>
                  <SelectItem value="medium">{isRTL ? 'متوسط' : 'Medium'}</SelectItem>
                  <SelectItem value="high">{isRTL ? 'عالي' : 'High'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">
                {isRTL ? 'تفعيل التخزين المؤقت' : 'Enable Caching'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'تفعيل نظام التخزين المؤقت لتحسين الأداء' : 'Enable caching system for improved performance'}
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
                {isRTL ? 'ضغط البيانات' : 'Data Compression'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'تفعيل ضغط البيانات لتوفير النطاق الترددي' : 'Enable data compression to save bandwidth'}
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
                {isRTL ? 'التحميل التدريجي' : 'Lazy Loading'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'تحميل المحتوى عند الحاجة لتحسين الأداء' : 'Load content on demand for better performance'}
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
                {isRTL ? 'مراقبة الأداء' : 'Performance Monitoring'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'تتبع ومراقبة أداء النظام' : 'Track and monitor system performance'}
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