import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Globe, Settings, Trash2, Save, Edit, Check, X } from "lucide-react";
import { useSettingsManager } from "@/hooks/useSettingsManager";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useDirection } from "@/components/ui/direction-provider";
import { cn } from "@/lib/utils";
import { ArrayEditor } from "./ArrayEditor";
import { ObjectEditor } from "./ObjectEditor";

interface UnifiedSettingsManagerProps {
  category?: string;
  showSharedOnly?: boolean;
}

export const UnifiedSettingsManager: React.FC<UnifiedSettingsManagerProps> = ({ 
  category, 
  showSharedOnly = false 
}) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const [expandedArrays, setExpandedArrays] = useState<Set<string>>(new Set());
  const [pendingChanges, setPendingChanges] = useState<Record<string, { value: unknown; category: string; dataType: string }>>({});
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

  const handleSettingChange = (key: string, value: unknown, category: string, dataType: string) => {
    // Store pending change
    setPendingChanges(prev => ({ ...prev, [key]: { value, category, dataType } }));
  };

  const handleSaveSetting = (key: string) => {
    const change = pendingChanges[key];
    if (change) {
      updateSetting({ key, value: change.value, category: change.category, dataType: change.dataType });
      setPendingChanges(prev => {
        const newChanges = { ...prev };
        delete newChanges[key];
        return newChanges;
      });
    }
  };

  const handleRevertSetting = (key: string) => {
    setPendingChanges(prev => {
      const newChanges = { ...prev };
      delete newChanges[key];
      return newChanges;
    });
  };

  const handleDeleteSetting = (key: string) => {
    if (confirm(t('common:confirmation.delete_message'))) {
      deleteSetting(key);
      // Also remove from pending changes
      setPendingChanges(prev => {
        const newChanges = { ...prev };
        delete newChanges[key];
        return newChanges;
      });
    }
  };

  const toggleArrayEditor = (key: string) => {
    setExpandedArrays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const renderSettingInput = (setting: { id: string; setting_key: string; setting_category: string; data_type: string; setting_value: unknown; default_value?: unknown }) => {
    const originalValue = getSettingValue(setting.setting_key, setting.default_value || setting.setting_value);
    const pendingChange = pendingChanges[setting.setting_key];
    const currentValue = pendingChange?.value ?? originalValue;
    const hasChanges = pendingChange !== undefined;
    const label = t(`admin-settings:settings.${setting.setting_key}.label`) || getSettingLabel(setting.setting_key);
    const description = t(`admin-settings:settings.${setting.setting_key}.description`) || getSettingDescription(setting.setting_key);
    const isShared = isSharedSetting(setting.setting_key);
    const affectedSystems = getAffectedSystems(setting.setting_key);
    const isArrayExpanded = expandedArrays.has(setting.setting_key);

    return (
      <div key={setting.id} className={cn(
        "space-y-3 p-3 sm:p-4 border rounded-lg transition-colors",
        hasChanges ? 'border-amber-200 bg-amber-50/50' : '',
        isRTL && 'text-right'
      )}>
        <div className={cn(
          "flex flex-col sm:flex-row items-start justify-between gap-3",
          isRTL && "sm:flex-row-reverse"
        )}>
          <div className="flex-1">
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Label className="font-medium">{label}</Label>
              {hasChanges && (
                <Badge variant="outline" className="flex items-center gap-1 text-amber-600 border-amber-600">
                  <Edit className="w-3 h-3" />
                  {t('admin.settings.modified')}
                </Badge>
              )}
              {isShared && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {t('admin.settings.shared')}
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
                  {t('admin.settings.affects')}: {affectedSystems.join(', ')}
                </span>
              </div>
            )}
          </div>
          
          <div className={cn(
            "flex items-center gap-1 sm:gap-2 flex-wrap",
            isRTL && "flex-row-reverse"
          )}>
            {hasChanges && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRevertSetting(setting.setting_key)}
                  className="text-orange-500 hover:text-orange-700 gap-1"
                >
                  <X className="w-4 h-4" />
                  {t('admin.settings.revert')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSaveSetting(setting.setting_key)}
                  className="text-green-600 hover:text-green-700 gap-1"
                >
                  <Check className="w-4 h-4" />
                  {t('admin.settings.save')}
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteSetting(setting.setting_key)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Setting Input Based on Type */}
        <div className="space-y-2">
          {setting.data_type === 'boolean' ? (
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-sm">{t('admin.settings.enabled')}</span>
              <Switch
                checked={currentValue || false}
                onCheckedChange={(checked) => 
                  handleSettingChange(setting.setting_key, checked, setting.setting_category, setting.data_type)
                }
              />
            </div>
          ) : setting.data_type === 'number' ? (
            <Input
              type="number"
              value={currentValue || 0}
              onChange={(e) => 
                handleSettingChange(setting.setting_key, parseFloat(e.target.value), setting.setting_category, setting.data_type)
              }
              className={isRTL ? 'text-right' : 'text-left'}
            />
          ) : setting.data_type === 'array' ? (
            <div className="space-y-2">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm font-medium">
                  {t('admin.settings.array_editor')}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleArrayEditor(setting.setting_key)}
                  className="gap-1"
                >
                  <Edit className="w-4 h-4" />
                  {isArrayExpanded 
                    ? t('admin.settings.close_editor')
                    : t('admin.settings.open_editor')
                  }
                </Button>
              </div>
              
              {isArrayExpanded ? (
                <ArrayEditor
                  value={Array.isArray(currentValue) ? currentValue : []}
                  onChange={(newValue) => 
                    handleSettingChange(setting.setting_key, newValue, setting.setting_category, setting.data_type)
                  }
                  onSave={() => handleSaveSetting(setting.setting_key)}
                  title={label}
                  description={description}
                  itemType="string"
                  isRTL={isRTL}
                />
              ) : (
                <div className="p-3 bg-muted rounded text-sm">
                  <code className="text-xs">
                    {Array.isArray(currentValue) 
                      ? `[${currentValue.length} ${t('admin.settings.items')}]`
                      : '[]'
                    }
                  </code>
                </div>
              )}
            </div>
          ) : setting.data_type === 'object' ? (
            <div className="space-y-2">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm font-medium">
                  {t('admin.settings.object_editor')}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleArrayEditor(setting.setting_key)}
                  className="gap-1"
                >
                  <Edit className="w-4 h-4" />
                  {isArrayExpanded 
                    ? t('admin.settings.close_editor')
                    : t('admin.settings.open_editor')
                  }
                </Button>
              </div>
              
              {isArrayExpanded ? (
                <ObjectEditor
                  value={typeof currentValue === 'object' && currentValue !== null ? currentValue : {}}
                  onChange={(newValue) => 
                    handleSettingChange(setting.setting_key, newValue, setting.setting_category, setting.data_type)
                  }
                  onSave={() => handleSaveSetting(setting.setting_key)}
                  title={label}
                  description={description}
                  isRTL={isRTL}
                />
              ) : (
                <div className="p-3 bg-muted rounded text-sm">
                  <code className="text-xs">
                    {typeof currentValue === 'object' && currentValue !== null
                      ? `{${Object.keys(currentValue).length} ${t('admin.settings.properties')}}`
                      : '{}'
                    }
                  </code>
                </div>
              )}
            </div>
          ) : (
            <Input
              value={currentValue || ''}
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
    <div className={cn(
      "space-y-4 sm:space-y-6 p-4 sm:p-0",
      isRTL && 'text-right'
    )}>
      {Object.entries(groupedSettings).map(([categoryName, categorySettings]) => (
        <Card key={categoryName}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Settings className="w-5 h-5" />
              {t(`settings.category.${categoryName}`) || categoryName}
            </CardTitle>
            <CardDescription>
              {t(`settings.category.${categoryName}.description`) || `Settings for ${categoryName}`}
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
              {t('admin.settings.no_settings')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};