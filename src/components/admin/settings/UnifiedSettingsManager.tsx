import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Globe, Settings, Trash2, Save } from "lucide-react";
import { useSettingsManager } from "@/hooks/useSettingsManager";
import { useTranslation } from "@/hooks/useAppTranslation";
import { useDirection } from "@/components/ui/direction-provider";
import { useSystemTranslations } from "@/hooks/useSystemTranslations";

interface UnifiedSettingsManagerProps {
  category?: string;
  showSharedOnly?: boolean;
}

export const UnifiedSettingsManager: React.FC<UnifiedSettingsManagerProps> = ({ 
  category, 
  showSharedOnly = false 
}) => {
  const { isRTL } = useDirection();
  const { getTranslation } = useSystemTranslations();
  const {
    settings,
    updateSetting,
    deleteSetting,
    getSettingValue,
    getSettingLabel,
    getSettingDescription,
    isSharedSetting,
    getAffectedSystems,
    isUpdating,
  } = useSettingsManager();

  // Filter settings based on props
  const filteredSettings = settings.filter(setting => {
    if (category && setting.setting_category !== category) return false;
    if (showSharedOnly && !isSharedSetting(setting.setting_key)) return false;
    return true;
  });

  // Group settings by category
  const groupedSettings = filteredSettings.reduce((acc, setting) => {
    const cat = setting.setting_category || 'general';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(setting);
    return acc;
  }, {} as Record<string, typeof filteredSettings>);

  const handleSettingChange = (key: string, value: any, category: string, dataType: string) => {
    updateSetting({ key, value, category, dataType });
  };

  const handleDeleteSetting = (key: string) => {
    if (confirm(getTranslation('settings.delete.confirm', 'Are you sure you want to delete this setting?'))) {
      deleteSetting(key);
    }
  };

  const renderSettingInput = (setting: any) => {
    const value = getSettingValue(setting.setting_key, setting.default_value);
    const label = getSettingLabel(setting.setting_key);
    const description = getSettingDescription(setting.setting_key);
    const isShared = isSharedSetting(setting.setting_key);
    const affectedSystems = getAffectedSystems(setting.setting_key);

    return (
      <div key={setting.id} className={`space-y-3 p-4 border rounded-lg ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex-1">
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Label className="font-medium">{label}</Label>
              {isShared && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {getTranslation('settings.shared', 'Shared')}
                </Badge>
              )}
              {setting.data_type && (
                <Badge variant="outline" className="text-xs">
                  {setting.data_type}
                </Badge>
              )}
            </div>
            
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
            
            {isShared && affectedSystems.length > 0 && (
              <div className={`flex items-center gap-1 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                <span className="text-xs text-muted-foreground">
                  {getTranslation('settings.affects', 'Affects')}: {affectedSystems.join(', ')}
                </span>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteSetting(setting.setting_key)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Setting Input Based on Type */}
        <div className="space-y-2">
          {setting.data_type === 'boolean' ? (
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-sm">{getTranslation('settings.enabled', 'Enabled')}</span>
              <Switch
                checked={value || false}
                onCheckedChange={(checked) => 
                  handleSettingChange(setting.setting_key, checked, setting.setting_category, setting.data_type)
                }
              />
            </div>
          ) : setting.data_type === 'number' ? (
            <Input
              type="number"
              value={value || 0}
              onChange={(e) => 
                handleSettingChange(setting.setting_key, parseFloat(e.target.value), setting.setting_category, setting.data_type)
              }
              className={isRTL ? 'text-right' : 'text-left'}
            />
          ) : setting.data_type === 'array' ? (
            <Textarea
              value={Array.isArray(value) ? JSON.stringify(value, null, 2) : value || '[]'}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  handleSettingChange(setting.setting_key, parsed, setting.setting_category, setting.data_type);
                } catch (err) {
                  // Invalid JSON, don't update
                }
              }}
              rows={4}
              className={`font-mono ${isRTL ? 'text-right' : 'text-left'}`}
              placeholder={getTranslation('settings.array.placeholder', 'Enter JSON array...')}
            />
          ) : (
            <Input
              value={value || ''}
              onChange={(e) => 
                handleSettingChange(setting.setting_key, e.target.value, setting.setting_category, setting.data_type)
              }
              className={isRTL ? 'text-right' : 'text-left'}
            />
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          <code className="bg-muted px-1 py-0.5 rounded">{setting.setting_key}</code>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      {Object.entries(groupedSettings).map(([categoryName, categorySettings]) => (
        <Card key={categoryName}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Settings className="w-5 h-5" />
              {getTranslation(`settings.category.${categoryName}`, categoryName)}
            </CardTitle>
            <CardDescription>
              {getTranslation(`settings.category.${categoryName}.description`, `Settings for ${categoryName}`)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categorySettings.map(renderSettingInput)}
          </CardContent>
        </Card>
      ))}
      
      {filteredSettings.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              {getTranslation('settings.no_settings', 'No settings found for the selected criteria')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};