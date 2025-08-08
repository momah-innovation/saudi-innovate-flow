import { useDirection } from '@/components/ui/direction-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { cn } from '@/lib/utils';

interface PartnerSettingsProps {
  settings: Record<string, unknown>;
  onSettingChange: (key: string, value: unknown) => void;
}

export function PartnerSettings({ settings, onSettingChange }: PartnerSettingsProps) {
  const { direction, isRTL } = useDirection();
  const { t } = useUnifiedTranslation();

  // Type-safe getters with defaults
  const getSetting = (key: string, defaultValue: unknown = null) => settings[key] ?? defaultValue;
  const getBooleanSetting = (key: string, defaultValue = false) => Boolean(getSetting(key, defaultValue));
  const getStringSetting = (key: string, defaultValue = '') => String(getSetting(key, defaultValue));
  const getNumberSetting = (key: string, defaultValue = 0) => Number(getSetting(key, defaultValue)) || defaultValue;

  return (
    <div className={cn("space-y-6", direction)}>
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'إعدادات الشراكة' : 'Partner Settings'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="require-approval">
              {isRTL ? 'يتطلب موافقة' : 'Require Approval'}
            </Label>
            <Switch
              id="require-approval"
              checked={getBooleanSetting('requireApproval')}
              onCheckedChange={(checked) => onSettingChange('requireApproval', checked)}
            />
          </div>
          
          <div>
            <Label htmlFor="max-partners">
              {isRTL ? 'الحد الأقصى للشركاء لكل تحدي' : 'Max Partners Per Challenge'}
            </Label>
            <Input
              id="max-partners"
              type="number"
              value={getNumberSetting('maxPartnersPerChallenge', 5)}
              onChange={(e) => onSettingChange('maxPartnersPerChallenge', parseInt(e.target.value))}
              min="1"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="allow-self-registration">
              {isRTL ? 'السماح بالتسجيل الذاتي' : 'Allow Self Registration'}
            </Label>
            <Switch
              id="allow-self-registration"
              checked={getBooleanSetting('allowSelfRegistration')}
              onCheckedChange={(checked) => onSettingChange('allowSelfRegistration', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-partner-rating">
              {isRTL ? 'تفعيل تقييم الشركاء' : 'Enable Partner Rating'}
            </Label>
            <Switch
              id="enable-partner-rating"
              checked={getBooleanSetting('enablePartnerRating')}
              onCheckedChange={(checked) => onSettingChange('enablePartnerRating', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}