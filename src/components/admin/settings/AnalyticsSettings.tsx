import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AnalyticsSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function AnalyticsSettings({ settings, onSettingChange }: AnalyticsSettingsProps) {
  return (
    <div className="space-y-6 rtl:text-right ltr:text-left">
      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات التحليلات</CardTitle>
          <CardDescription>التحكم في جمع وعرض البيانات التحليلية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rtl:text-right ltr:text-left">
            <div className="space-y-2">
              <Label htmlFor="dataRetention">مدة الاحتفاظ بالبيانات (بالأيام)</Label>
              <Input
                id="dataRetention"
                type="number"
                value={settings.analyticsDataRetention || 365}
                onChange={(e) => onSettingChange('analyticsDataRetention', parseInt(e.target.value))}
                min="30"
                max="3650"
                className="rtl:text-right ltr:text-left"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reportFrequency">تكرار التقارير</Label>
              <Select 
                value={settings.analyticsReportFrequency || "weekly"}
                onValueChange={(value) => onSettingChange('analyticsReportFrequency', value)}
              >
                <SelectTrigger className="rtl:text-right ltr:text-left">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {settings.reportFrequencyOptions?.map(freq => (
                    <SelectItem key={freq} value={freq}>
                      {freq === 'daily' ? 'يومي' : freq === 'weekly' ? 'أسبوعي' : freq === 'monthly' ? 'شهري' : freq}
                    </SelectItem>
                  )) || (
                    <>
                      <SelectItem value="daily">يومي</SelectItem>
                      <SelectItem value="weekly">أسبوعي</SelectItem>
                      <SelectItem value="monthly">شهري</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">التحليل في الوقت الفعلي</Label>
              <p className="text-sm text-muted-foreground">تحديث البيانات التحليلية في الوقت الفعلي</p>
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