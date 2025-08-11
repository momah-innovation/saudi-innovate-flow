import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useDirection } from "@/components/ui/direction-provider";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";

interface SettingsData {
  [key: string]: any;
}

interface IdeaSettingsProps {
  settings: SettingsData;
  onSettingChange: (key: string, value: unknown) => void;
}

export function IdeaSettings({ settings, onSettingChange }: IdeaSettingsProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const [newAttachmentType, setNewAttachmentType] = useState("");
  const [newAssignmentType, setNewAssignmentType] = useState("");
  const [systemSettings, setSystemSettings] = useState<SettingsData>({});

  useEffect(() => {
    fetchSystemSettings();
  }, []);

  const fetchSystemSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_key, setting_value')
        .in('setting_key', [
          'idea_allowed_attachment_types',
          'idea_assignment_types',
          'idea_max_per_user',
          'idea_min_description_length',
          'idea_max_attachments',
          'idea_max_attachment_size_mb',
          'idea_allow_anonymous',
          'idea_require_review',
          'idea_enable_collaboration'
        ]);

      if (error) throw error;

      const settingsObj = data?.reduce((acc: Record<string, unknown>, setting: { setting_key: string; setting_value: unknown }) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {} as SettingsData) || {};

      setSystemSettings(settingsObj);
    } catch (error) {
      logger.error('Error fetching idea settings', { component: 'IdeaSettings', action: 'fetchSystemSettings' }, error as Error);
    }
  };

  const updateSystemSetting = async (key: string, value: unknown) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({ 
          setting_key: key, 
          setting_value: value as never,
          setting_category: 'ideas',
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSystemSettings(prev => ({ ...prev, [key]: value }));
      onSettingChange(key, value);
      
      toast({
        title: t('success'),
        description: t('settingUpdated')
      });
    } catch (error) {
      logger.error('Error updating idea setting', { component: 'IdeaSettings', action: 'updateSystemSetting', key }, error as Error);
      toast({
        title: t('error'),
        description: t('updateSettingError'),
        variant: "destructive"
      });
    }
  };
  
  const allowedAttachmentTypes = (systemSettings.idea_allowed_attachment_types as string[]) || ["pdf", "doc", "docx", "ppt", "pptx", "jpg", "jpeg", "png", "gif"];
  const assignmentTypes = (systemSettings.idea_assignment_types as string[]) || ["reviewer", "evaluator", "implementer", "observer"];

  const addAttachmentType = () => {
    if (newAttachmentType.trim() && !allowedAttachmentTypes.includes(newAttachmentType)) {
      const updatedTypes = [...allowedAttachmentTypes, newAttachmentType.trim()];
      updateSystemSetting('idea_allowed_attachment_types', updatedTypes);
      setNewAttachmentType("");
    }
  };

  const removeAttachmentType = (typeToRemove: string) => {
    const updatedTypes = allowedAttachmentTypes.filter((type: string) => type !== typeToRemove);
    updateSystemSetting('idea_allowed_attachment_types', updatedTypes);
  };

  const addAssignmentType = () => {
    if (newAssignmentType.trim() && !assignmentTypes.includes(newAssignmentType)) {
      const updatedTypes = [...assignmentTypes, newAssignmentType.trim()];
      updateSystemSetting('idea_assignment_types', updatedTypes);
      setNewAssignmentType("");
    }
  };

  const removeAssignmentType = (typeToRemove: string) => {
    const updatedTypes = assignmentTypes.filter((type: string) => type !== typeToRemove);
    updateSystemSetting('idea_assignment_types', updatedTypes);
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>{t('systemLists.ideaAttachmentTypes')}</CardTitle>
          <CardDescription>إدارة أنواع المرفقات المسموحة للأفكار</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newAttachmentType}
              onChange={(e) => setNewAttachmentType(e.target.value)}
              placeholder="أضف نوع مرفق جديد (مثل: pdf)"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addAttachmentType} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {allowedAttachmentTypes.map((type: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>.{type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeAttachmentType(type)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>{t('systemLists.ideaAssignmentTypes')}</CardTitle>
          <CardDescription>إدارة أنواع مهام الأفكار المتاحة في النظام</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newAssignmentType}
              onChange={(e) => setNewAssignmentType(e.target.value)}
              placeholder="أضف نوع مهمة جديد"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addAssignmentType} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {assignmentTypes.map((type: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`ideaAssignmentTypes.${type}`) || type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeAssignmentType(type)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>إعدادات الأفكار</CardTitle>
          <CardDescription>التحكم في إنشاء وإدارة الأفكار</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="maxIdeasPerUser">{t('ideas.maxIdeasPerUser')}</Label>
              <Input
                id="maxIdeasPerUser"
                type="number"
                value={systemSettings.idea_max_per_user || 50}
                onChange={(e) => updateSystemSetting('idea_max_per_user', parseInt(e.target.value))}
                min="1"
                max="500"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ideaMinLength">{t('ideas.minDescriptionLength')}</Label>
              <Input
                id="ideaMinLength"
                type="number"
                value={systemSettings.idea_min_description_length || 50}
                onChange={(e) => updateSystemSetting('idea_min_description_length', parseInt(e.target.value))}
                min="10"
                max="200"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxAttachments">{t('ideas.maxAttachments')}</Label>
              <Input
                id="maxAttachments"
                type="number"
                value={systemSettings.idea_max_attachments || 5}
                onChange={(e) => updateSystemSetting('idea_max_attachments', parseInt(e.target.value))}
                min="0"
                max="20"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxAttachmentSize">{t('ideas.maxAttachmentSize')}</Label>
              <Input
                id="maxAttachmentSize"
                type="number"
                value={systemSettings.idea_max_attachment_size_mb || 10}
                onChange={(e) => updateSystemSetting('idea_max_attachment_size_mb', parseInt(e.target.value))}
                min="1"
                max="100"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">{t('ideas.allowAnonymous')}</Label>
              <p className="text-sm text-muted-foreground">{t('ideas.allowAnonymousDescription')}</p>
            </div>
            <Switch 
              checked={Boolean(systemSettings.idea_allow_anonymous) || false}
              onCheckedChange={(checked) => updateSystemSetting('idea_allow_anonymous', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">{t('ideas.requireReview')}</Label>
              <p className="text-sm text-muted-foreground">{t('ideas.requireReviewDescription')}</p>
            </div>
            <Switch 
              checked={systemSettings.idea_require_review !== false}
              onCheckedChange={(checked) => updateSystemSetting('idea_require_review', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">{t('ideas.enableCollaboration')}</Label>
              <p className="text-sm text-muted-foreground">{t('ideas.enableCollaborationDescription')}</p>
            </div>
            <Switch 
              checked={systemSettings.idea_enable_collaboration !== false}
              onCheckedChange={(checked) => updateSystemSetting('idea_enable_collaboration', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}