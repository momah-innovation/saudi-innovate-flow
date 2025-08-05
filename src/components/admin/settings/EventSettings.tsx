import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/hooks/useAppTranslation";
import { useRTLAware } from "@/hooks/useRTLAware";

interface EventSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function EventSettings({ settings, onSettingChange }: EventSettingsProps) {
  const { t } = useTranslation();
  const { textStart, flexRowReverse } = useRTLAware();
  
  return (
    <div className={`space-y-6 ${textStart}`}>
      <Card>
        <CardHeader className={textStart}>
          <CardTitle>{t('event_settings')}</CardTitle>
          <CardDescription>{t('event_management_control')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${textStart}`}>
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">{t('max_participants')}</Label>
              <Input
                id="maxParticipants"
                type="number"
                defaultValue="100"
                min="1"
                max="10000"
                className={textStart}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="registrationDeadline">{t('registration_deadline_days')}</Label>
              <Input
                id="registrationDeadline"
                type="number"
                defaultValue="3"
                min="0"
                max="30"
                className={textStart}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between ${flexRowReverse}`}>
            <div className={`space-y-0.5 ${textStart}`}>
              <Label className="text-base">{t('open_registration')}</Label>
              <p className="text-sm text-muted-foreground">{t('open_registration_description')}</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}