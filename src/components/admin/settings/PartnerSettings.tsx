import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useDirection } from "@/components/ui/direction-provider";
import { ArraySettingsEditor } from "./ArraySettingsEditor";

interface PartnerSettingsProps {
  settings: Record<string, unknown>;
  onSettingChange: (key: string, value: unknown) => void;
}

export function PartnerSettings({ settings, onSettingChange }: PartnerSettingsProps) {
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();


  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <ArraySettingsEditor
        settingKey="partner_type_options"
        title={t('systemLists.partnerTypes')}
        description="إدارة أنواع الشركاء المتاحة"
        translationPrefix="partnerTypes"
        category="partners"
      />

      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>إعدادات الشركاء</CardTitle>
          <CardDescription>التحكم في إدارة الشركاء والتعاون معهم</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="maxPartnersPerProject">الحد الأقصى للشركاء لكل مشروع</Label>
              <Input
                id="maxPartnersPerProject"
                type="number"
                value={settings.max_partners_per_project || 5}
                onChange={(e) => onSettingChange('max_partners_per_project', parseInt(e.target.value))}
                min="1"
                max="20"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="partnershipDefaultDuration">مدة الشراكة الافتراضية (بالأشهر)</Label>
              <Input
                id="partnershipDefaultDuration"
                type="number"
                value={settings.partnership_default_duration || 12}
                onChange={(e) => onSettingChange('partnership_default_duration', parseInt(e.target.value))}
                min="1"
                max="60"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minPartnershipValue">الحد الأدنى لقيمة الشراكة</Label>
              <Input
                id="minPartnershipValue"
                type="number"
                value={settings.min_partnership_value || 10000}
                onChange={(e) => onSettingChange('min_partnership_value', parseInt(e.target.value))}
                min="0"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partnershipRenewalPeriod">فترة تجديد الشراكة (بالأيام)</Label>
              <Input
                id="partnershipRenewalPeriod"
                type="number"
                value={settings.partnership_renewal_period || 30}
                onChange={(e) => onSettingChange('partnership_renewal_period', parseInt(e.target.value))}
                min="7"
                max="90"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">الموافقة على الشراكات</Label>
              <p className="text-sm text-muted-foreground">مطالبة موافقة إدارية على الشراكات الجديدة</p>
            </div>
            <Switch 
              checked={settings.require_partnership_approval !== false}
              onCheckedChange={(checked) => onSettingChange('require_partnership_approval', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">تقييم دوري للشركاء</Label>
              <p className="text-sm text-muted-foreground">إجراء تقييم دوري لأداء الشركاء</p>
            </div>
            <Switch 
              checked={settings.enable_periodic_partner_evaluation !== false}
              onCheckedChange={(checked) => onSettingChange('enable_periodic_partner_evaluation', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">إشعارات انتهاء الشراكة</Label>
              <p className="text-sm text-muted-foreground">إرسال إشعارات قبل انتهاء مدة الشراكة</p>
            </div>
            <Switch 
              checked={settings.enable_partnership_expiry_notifications !== false}
              onCheckedChange={(checked) => onSettingChange('enable_partnership_expiry_notifications', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}