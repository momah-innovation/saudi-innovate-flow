import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useDirection } from "@/components/ui/direction-provider";
import { OpportunitySettingsProps } from "@/types/admin-settings";

export function OpportunitySettings({ settings, onSettingChange }: OpportunitySettingsProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const [newOpportunityType, setNewOpportunityType] = useState("");
  const [newApplicationStatus, setNewApplicationStatus] = useState("");
  
  const opportunityTypes = (settings.opportunity_types as string[]) || ["solution_development", "technical_partnership", "project_implementation", "consultation", "training"];
  const applicationStatusOptions = (settings.application_status_options as string[]) || ["submitted", "under_review", "accepted", "rejected", "pending"];

  const addOpportunityType = () => {
    if (newOpportunityType.trim() && !opportunityTypes.includes(newOpportunityType)) {
      const updatedTypes = [...opportunityTypes, newOpportunityType.trim()];
      onSettingChange('opportunity_types', updatedTypes);
      setNewOpportunityType("");
      toast({
        title: t('success'),
        description: t('itemAddedSuccessfully')
      });
    }
  };

  const removeOpportunityType = (typeToRemove: string) => {
    const updatedTypes = opportunityTypes.filter((type: string) => type !== typeToRemove);
    onSettingChange('opportunity_types', updatedTypes);
    toast({
      title: t('success'),
      description: t('itemRemovedSuccessfully')
    });
  };

  const addApplicationStatus = () => {
    if (newApplicationStatus.trim() && !applicationStatusOptions.includes(newApplicationStatus)) {
      const updatedOptions = [...applicationStatusOptions, newApplicationStatus.trim()];
      onSettingChange('application_status_options', updatedOptions);
      setNewApplicationStatus("");
      toast({
        title: t('success'),
        description: t('itemAddedSuccessfully')
      });
    }
  };

  const removeApplicationStatus = (statusToRemove: string) => {
    const updatedOptions = applicationStatusOptions.filter((status: string) => status !== statusToRemove);
    onSettingChange('application_status_options', updatedOptions);
    toast({
      title: t('success'),
      description: t('itemRemovedSuccessfully')
    });
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <FileText className="w-5 h-5" />
            {t('admin.settings.opportunity_types')}
          </CardTitle>
          <CardDescription>
            {t('admin.settings.opportunity_types_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newOpportunityType}
              onChange={(e) => setNewOpportunityType(e.target.value)}
              placeholder={t('admin.settings.add_opportunity_type')}
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addOpportunityType} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {opportunityTypes.map((type: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`opportunityTypes.${type}`) || type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeOpportunityType(type)}
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
          <CardTitle>{t('admin.settings.application_status')}</CardTitle>
          <CardDescription>
            {t('admin.settings.application_status_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newApplicationStatus}
              onChange={(e) => setNewApplicationStatus(e.target.value)}
              placeholder={t('admin.settings.add_application_status')}
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addApplicationStatus} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {applicationStatusOptions.map((status: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`applicationStatus.${status}`) || status}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeApplicationStatus(status)}
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
          <CardTitle>{t('admin.settings.default_opportunity_settings')}</CardTitle>
          <CardDescription>
            {t('admin.settings.default_settings_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="defaultOpportunityDuration">
                {t('admin.settings.default_duration')}
              </Label>
              <Input
                id="defaultOpportunityDuration"
                type="number"
                min="1"
                max="365"
                value={(settings.defaultOpportunityDuration as number) || 30}
                onChange={(e) => onSettingChange('defaultOpportunityDuration', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxApplicationsPerOpportunity">
                {t('admin.settings.max_applications')}
              </Label>
              <Input
                id="maxApplicationsPerOpportunity"
                type="number"
                min="1"
                max="1000"
                value={(settings.maxApplicationsPerOpportunity as number) || 100}
                onChange={(e) => onSettingChange('maxApplicationsPerOpportunity', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultBudgetMin">
                {t('admin.settings.default_min_budget')}
              </Label>
              <Input
                id="defaultBudgetMin"
                type="number"
                min="0"
                value={(settings.defaultBudgetMin as number) || 0}
                onChange={(e) => onSettingChange('defaultBudgetMin', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultBudgetMax">
                {t('admin.settings.default_max_budget')}
              </Label>
              <Input
                id="defaultBudgetMax"
                type="number"
                min="0"
                value={(settings.defaultBudgetMax as number) || 1000000}
                onChange={(e) => onSettingChange('defaultBudgetMax', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">
                {t('admin.settings.enable_auto_approval')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('admin.settings.auto_approval_desc')}
              </p>
            </div>
            <Switch
              checked={(settings.enableAutoApproval as boolean) || false}
              onCheckedChange={(checked) => onSettingChange('enableAutoApproval', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">
                {t('admin.settings.require_attachments')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('admin.settings.attachments_desc')}
              </p>
            </div>
            <Switch
              checked={settings.requireMandatoryAttachments !== false}
              onCheckedChange={(checked) => onSettingChange('requireMandatoryAttachments', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">
                {t('admin.settings.application_notifications')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('admin.settings.notifications_desc')}
              </p>
            </div>
            <Switch
              checked={settings.enableApplicationNotifications !== false}
              onCheckedChange={(checked) => onSettingChange('enableApplicationNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}