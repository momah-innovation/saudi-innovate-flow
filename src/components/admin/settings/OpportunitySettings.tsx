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
import { useUnifiedTranslation } from "@/hooks/useAppTranslation";
import { useDirection } from "@/components/ui/direction-provider";

interface OpportunitySettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function OpportunitySettings({ settings, onSettingChange }: OpportunitySettingsProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const [newOpportunityType, setNewOpportunityType] = useState("");
  const [newApplicationStatus, setNewApplicationStatus] = useState("");
  
  const opportunityTypes = settings.opportunity_types || ["تطوير حلول", "شراكة تقنية", "تنفيذ مشروع", "استشارة", "تدريب"];
  const applicationStatusOptions = settings.application_status_options || ["مقدم", "قيد المراجعة", "مقبول", "مرفوض", "معلق"];

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
            {isRTL ? 'أنواع الفرص' : 'Opportunity Types'}
          </CardTitle>
          <CardDescription>
            {isRTL ? 'إدارة أنواع الفرص المتاحة في النظام' : 'Manage opportunity types available in the system'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newOpportunityType}
              onChange={(e) => setNewOpportunityType(e.target.value)}
              placeholder={isRTL ? "أضف نوع فرصة جديد" : "Add new opportunity type"}
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
          <CardTitle>{isRTL ? 'حالات طلبات التقديم' : 'Application Status Options'}</CardTitle>
          <CardDescription>
            {isRTL ? 'إدارة حالات طلبات التقديم للفرص' : 'Manage application status options for opportunities'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newApplicationStatus}
              onChange={(e) => setNewApplicationStatus(e.target.value)}
              placeholder={isRTL ? "أضف حالة تطبيق جديدة" : "Add new application status"}
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
          <CardTitle>{isRTL ? 'إعدادات الفرص الافتراضية' : 'Default Opportunity Settings'}</CardTitle>
          <CardDescription>
            {isRTL ? 'التحكم في الإعدادات الافتراضية للفرص' : 'Control default settings for opportunities'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="defaultOpportunityDuration">
                {isRTL ? 'المدة الافتراضية (بالأيام)' : 'Default Duration (days)'}
              </Label>
              <Input
                id="defaultOpportunityDuration"
                type="number"
                min="1"
                max="365"
                value={settings.defaultOpportunityDuration || 30}
                onChange={(e) => onSettingChange('defaultOpportunityDuration', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxApplicationsPerOpportunity">
                {isRTL ? 'الحد الأقصى للطلبات لكل فرصة' : 'Max Applications per Opportunity'}
              </Label>
              <Input
                id="maxApplicationsPerOpportunity"
                type="number"
                min="1"
                max="1000"
                value={settings.maxApplicationsPerOpportunity || 100}
                onChange={(e) => onSettingChange('maxApplicationsPerOpportunity', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultBudgetMin">
                {isRTL ? 'الحد الأدنى للميزانية الافتراضية' : 'Default Minimum Budget'}
              </Label>
              <Input
                id="defaultBudgetMin"
                type="number"
                min="0"
                value={settings.defaultBudgetMin || 0}
                onChange={(e) => onSettingChange('defaultBudgetMin', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultBudgetMax">
                {isRTL ? 'الحد الأقصى للميزانية الافتراضية' : 'Default Maximum Budget'}
              </Label>
              <Input
                id="defaultBudgetMax"
                type="number"
                min="0"
                value={settings.defaultBudgetMax || 1000000}
                onChange={(e) => onSettingChange('defaultBudgetMax', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">
                {isRTL ? 'تفعيل الموافقة التلقائية' : 'Enable Auto-Approval'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'الموافقة التلقائية على طلبات التقديم المؤهلة' : 'Automatically approve qualified applications'}
              </p>
            </div>
            <Switch
              checked={settings.enableAutoApproval || false}
              onCheckedChange={(checked) => onSettingChange('enableAutoApproval', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">
                {isRTL ? 'طلب مرفقات إلزامية' : 'Require Mandatory Attachments'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'إجبار تقديم مرفقات مع طلبات التقديم' : 'Force applicants to provide required attachments'}
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
                {isRTL ? 'إشعارات التقديم' : 'Application Notifications'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'إرسال إشعارات عند تقديم طلبات جديدة' : 'Send notifications when new applications are submitted'}
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