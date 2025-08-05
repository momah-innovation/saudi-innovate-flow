import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/hooks/useAppTranslation";
import { useRTLAware } from "@/hooks/useRTLAware";

interface CampaignSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function CampaignSettings({ settings, onSettingChange }: CampaignSettingsProps) {
  const { t } = useTranslation();
  const { textStart, flexRowReverse } = useRTLAware();
  
  return (
    <div className={`space-y-6 ${textStart}`}>
      <Card>
        <CardHeader className={textStart}>
          <CardTitle>{t('campaign_settings')}</CardTitle>
          <CardDescription>{t('campaign_management_control')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${textStart}`}>
            <div className="space-y-2">
              <Label htmlFor="campaignDuration">{t('default_campaign_duration_days')}</Label>
              <Input
                id="campaignDuration"
                type="number"
                defaultValue="30"
                min="1"
                max="365"
                className={textStart}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxCampaigns">{t('max_active_campaigns')}</Label>
              <Input
                id="maxCampaigns"
                type="number"
                defaultValue="5"
                min="1"
                max="50"
                className={textStart}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between ${flexRowReverse}`}>
            <div className={`space-y-0.5 ${textStart}`}>
              <Label className="text-base">{t('automatic_approval')}</Label>
              <p className="text-sm text-muted-foreground">{t('automatic_approval_description')}</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}