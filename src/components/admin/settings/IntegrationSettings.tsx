import { useDirection } from '@/components/ui/direction-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface IntegrationSettingsProps {
  settings: Record<string, unknown>;
  onSettingChange: (key: string, value: unknown) => void;
}

export function IntegrationSettings({ settings, onSettingChange }: IntegrationSettingsProps) {
  const { direction, isRTL } = useDirection();
  const { t } = useUnifiedTranslation();

  // Type-safe getters with defaults
  const getSetting = (key: string, defaultValue: unknown = null) => settings[key] ?? defaultValue;
  const getBooleanSetting = (key: string, defaultValue = false) => Boolean(getSetting(key, defaultValue));
  const getStringSetting = (key: string, defaultValue = '') => String(getSetting(key, defaultValue));
  const getArraySetting = (key: string, defaultValue: string[] = []) => {
    const value = getSetting(key, defaultValue);
    return Array.isArray(value) ? value : defaultValue;
  };

  const integrationTypes = getArraySetting('integration_types', []);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(integrationTypes);

  const handleTypeToggle = (value: string, checked: boolean) => {
    if (checked) {
      const newTypes = [...selectedTypes, value];
      setSelectedTypes(newTypes);
      onSettingChange('integration_types', newTypes);
    } else {
      const newTypes = selectedTypes.filter(type => type !== value);
      setSelectedTypes(newTypes);
      onSettingChange('integration_types', newTypes);
    }
  };

  const availableIntegrationTypes = [
    'slack', 'teams', 'email', 'webhook', 'api'
  ];

  return (
    <div className={cn("space-y-6", direction)}>
      {/* Integration Types */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'أنواع التكامل' : 'Integration Types'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableIntegrationTypes.map((type) => (
              <div key={type} className="flex items-center justify-between">
                <Label htmlFor={`integration-${type}`} className="capitalize">
                  {type}
                </Label>
                <Switch
                  id={`integration-${type}`}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={(checked) => handleTypeToggle(type, checked)}
                />
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              {isRTL ? 'الأنواع المفعلة:' : 'Enabled Types:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedTypes.map((type) => (
                <Badge key={type} variant="secondary">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Slack Integration */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'تكامل Slack' : 'Slack Integration'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="slack-enabled">
              {isRTL ? 'تفعيل تكامل Slack' : 'Enable Slack Integration'}
            </Label>
            <Switch
              id="slack-enabled"
              checked={getBooleanSetting('enableSlackIntegration')}
              onCheckedChange={(checked) => onSettingChange('enableSlackIntegration', checked)}
            />
          </div>
          
          <div>
            <Label htmlFor="slack-webhook">
              {isRTL ? 'رابط Webhook للـ Slack' : 'Slack Webhook URL'}
            </Label>
            <Input
              id="slack-webhook"
              type="url"
              value={getStringSetting('slackWebhookUrl')}
              onChange={(e) => onSettingChange('slackWebhookUrl', e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Teams Integration */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'تكامل Microsoft Teams' : 'Microsoft Teams Integration'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="teams-enabled">
              {isRTL ? 'تفعيل تكامل Teams' : 'Enable Teams Integration'}
            </Label>
            <Switch
              id="teams-enabled"
              checked={getBooleanSetting('enableTeamsIntegration')}
              onCheckedChange={(checked) => onSettingChange('enableTeamsIntegration', checked)}
            />
          </div>
          
          <div>
            <Label htmlFor="teams-webhook">
              {isRTL ? 'رابط Webhook للـ Teams' : 'Teams Webhook URL'}
            </Label>
            <Input
              id="teams-webhook"
              type="url"
              value={getStringSetting('teamsWebhookUrl')}
              onChange={(e) => onSettingChange('teamsWebhookUrl', e.target.value)}
              placeholder="https://outlook.office.com/webhook/..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Integration */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'تكامل البريد الإلكتروني' : 'Email Integration'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-enabled">
              {isRTL ? 'تفعيل إشعارات البريد الإلكتروني' : 'Enable Email Notifications'}
            </Label>
            <Switch
              id="email-enabled"
              checked={getBooleanSetting('enableEmailNotifications')}
              onCheckedChange={(checked) => onSettingChange('enableEmailNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}