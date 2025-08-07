import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useDirection } from "@/components/ui/direction-provider";
import { ArraySettingsEditor } from "./ArraySettingsEditor";

interface EventSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function EventSettings({ settings, onSettingChange }: EventSettingsProps) {
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();


  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <ArraySettingsEditor
        settingKey="event_types"
        title={t('systemLists.eventTypes')}
        description="إدارة أنواع الفعاليات المتاحة في النظام"
        translationPrefix="eventTypes"
        category="events"
      />

      <ArraySettingsEditor
        settingKey="event_categories"
        title={t('systemLists.eventCategories')}
        description="إدارة فئات الفعاليات المتاحة في النظام"
        translationPrefix="eventCategories"
        category="events"
      />

      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>الإعدادات الافتراضية للفعاليات</CardTitle>
          <CardDescription>التحكم في إنشاء وإدارة الفعاليات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">الحد الأقصى للمشاركين</Label>
              <Input
                id="maxParticipants"
                type="number"
                value={settings.maxParticipants || 100}
                onChange={(e) => onSettingChange('maxParticipants', parseInt(e.target.value))}
                min="1"
                max="10000"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="registrationDeadlineDays">مهلة التسجيل (بالأيام قبل الفعالية)</Label>
              <Input
                id="registrationDeadlineDays"
                type="number"
                value={settings.registrationDeadlineDays || 3}
                onChange={(e) => onSettingChange('registrationDeadlineDays', parseInt(e.target.value))}
                min="0"
                max="30"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">التسجيل المفتوح</Label>
              <p className="text-sm text-muted-foreground">السماح بالتسجيل المفتوح للفعاليات</p>
            </div>
            <Switch 
              checked={settings.allowOpenRegistration !== false}
              onCheckedChange={(checked) => onSettingChange('allowOpenRegistration', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">تسجيل الحضور</Label>
              <p className="text-sm text-muted-foreground">تفعيل تسجيل الحضور للفعاليات</p>
            </div>
            <Switch 
              checked={settings.enableAttendanceTracking !== false}
              onCheckedChange={(checked) => onSettingChange('enableAttendanceTracking', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}