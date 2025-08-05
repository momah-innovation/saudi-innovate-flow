import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/hooks/useAppTranslation";
import { useRTLAware } from "@/hooks/useRTLAware";

interface AnalyticsSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function AnalyticsSettings({ settings, onSettingChange }: AnalyticsSettingsProps) {
  const { t } = useTranslation();
  const { textStart, flexRowReverse } = useRTLAware();

  return (
    <div className={`space-y-6 ${textStart}`}>
      <Card>
        <CardHeader className={textStart}>
          <CardTitle>{t('analytics_settings')}</CardTitle>
          <CardDescription>{t('analytics_settings_description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${textStart}`}>
            <div className="space-y-2">
              <Label htmlFor="dataRetention">{t('data_retention_days')}</Label>
              <Input
                id="dataRetention"
                type="number"
                value={settings.analyticsDataRetention || 365}
                onChange={(e) => onSettingChange('analyticsDataRetention', parseInt(e.target.value))}
                min="30"
                max="3650"
                className={textStart}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reportFrequency">{t('report_frequency')}</Label>
              <Select 
                value={settings.analyticsReportFrequency || "weekly"}
                onValueChange={(value) => onSettingChange('analyticsReportFrequency', value)}
              >
                <SelectTrigger className={textStart}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {settings.reportFrequencyOptions?.map(freq => (
                    <SelectItem key={freq} value={freq}>
                      {t(`frequency_${freq}`)}
                    </SelectItem>
                  )) || (
                    <>
                      <SelectItem value="daily">{t('daily')}</SelectItem>
                      <SelectItem value="weekly">{t('weekly')}</SelectItem>
                      <SelectItem value="monthly">{t('monthly')}</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={`flex items-center justify-between ${flexRowReverse}`}>
            <div className={`space-y-0.5 ${textStart}`}>
              <Label className="text-base">{t('realtime_analytics')}</Label>
              <p className="text-sm text-muted-foreground">{t('realtime_analytics_description')}</p>
            </div>
            <Switch 
              checked={settings.analyticsRealtimeUpdates !== false}
              onCheckedChange={(checked) => onSettingChange('analyticsRealtimeUpdates', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}