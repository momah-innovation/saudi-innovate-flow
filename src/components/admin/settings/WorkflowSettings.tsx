import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, PieChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useDirection } from "@/components/ui/direction-provider";

interface WorkflowSettingsData {
  workflow_steps: string[];
  approval_levels: string[];
  defaultWorkflowTimeout: number;
  maxConcurrentWorkflows: number;
  escalationTimeHours: number;
  reminderFrequencyHours: number;
  enableMultiLevelApproval: boolean;
  enableAutoEscalation: boolean;
  enableReminders: boolean;
  enableParallelApproval: boolean;
}

interface WorkflowSettingsProps {
  settings: WorkflowSettingsData;
  onSettingChange: (key: string, value: string[] | number | boolean) => void;
}

export function WorkflowSettings({ settings, onSettingChange }: WorkflowSettingsProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const [newWorkflowStep, setNewWorkflowStep] = useState("");
  const [newApprovalLevel, setNewApprovalLevel] = useState("");
  
  const workflowSteps = settings.workflow_steps || ["تقديم", "مراجعة أولية", "تقييم تقني", "موافقة إدارية", "تنفيذ"];
  const approvalLevels = settings.approval_levels || ["مدير المشروع", "مدير القسم", "نائب المدير", "المدير العام"];

  const addWorkflowStep = () => {
    if (newWorkflowStep.trim() && !workflowSteps.includes(newWorkflowStep)) {
      const updatedSteps = [...workflowSteps, newWorkflowStep.trim()];
      onSettingChange('workflow_steps', updatedSteps);
      setNewWorkflowStep("");
      toast({
        title: t('success'),
        description: t('itemAddedSuccessfully')
      });
    }
  };

  const removeWorkflowStep = (stepToRemove: string) => {
    const updatedSteps = workflowSteps.filter((step: string) => step !== stepToRemove);
    onSettingChange('workflow_steps', updatedSteps);
    toast({
      title: t('success'),
      description: t('itemRemovedSuccessfully')
    });
  };

  const addApprovalLevel = () => {
    if (newApprovalLevel.trim() && !approvalLevels.includes(newApprovalLevel)) {
      const updatedLevels = [...approvalLevels, newApprovalLevel.trim()];
      onSettingChange('approval_levels', updatedLevels);
      setNewApprovalLevel("");
      toast({
        title: t('success'),
        description: t('itemAddedSuccessfully')
      });
    }
  };

  const removeApprovalLevel = (levelToRemove: string) => {
    const updatedLevels = approvalLevels.filter((level: string) => level !== levelToRemove);
    onSettingChange('approval_levels', updatedLevels);
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
            <PieChart className="w-5 h-5" />
            {t('admin.settings.workflow_steps')}
          </CardTitle>
          <CardDescription>
            {t('admin.settings.workflow_steps_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newWorkflowStep}
              onChange={(e) => setNewWorkflowStep(e.target.value)}
              placeholder={t('admin.settings.add_workflow_step')}
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addWorkflowStep} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {workflowSteps.map((step: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`workflowSteps.${step}`) || step}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeWorkflowStep(step)}
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
          <CardTitle>{t('admin.settings.approval_levels')}</CardTitle>
          <CardDescription>
            {t('admin.settings.approval_levels_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newApprovalLevel}
              onChange={(e) => setNewApprovalLevel(e.target.value)}
              placeholder={t('admin.settings.add_approval_level')}
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addApprovalLevel} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {approvalLevels.map((level: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`approvalLevels.${level}`) || level}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeApprovalLevel(level)}
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
          <CardTitle>{t('admin.settings.workflow_settings')}</CardTitle>
          <CardDescription>
            {t('admin.settings.workflow_settings_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="defaultWorkflowTimeout">
                {t('admin.settings.workflow_timeout')}
              </Label>
              <Input
                id="defaultWorkflowTimeout"
                type="number"
                min="1"
                max="365"
                value={settings.defaultWorkflowTimeout || 7}
                onChange={(e) => onSettingChange('defaultWorkflowTimeout', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxConcurrentWorkflows">
                {t('admin.settings.max_concurrent')}
              </Label>
              <Input
                id="maxConcurrentWorkflows"
                type="number"
                min="1"
                max="100"
                value={settings.maxConcurrentWorkflows || 10}
                onChange={(e) => onSettingChange('maxConcurrentWorkflows', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="escalationTimeHours">
                {isRTL ? 'وقت التصعيد (بالساعات)' : 'Escalation Time (hours)'}
              </Label>
              <Input
                id="escalationTimeHours"
                type="number"
                min="1"
                max="168"
                value={settings.escalationTimeHours || 24}
                onChange={(e) => onSettingChange('escalationTimeHours', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminderFrequencyHours">
                {isRTL ? 'تكرار التذكير (بالساعات)' : 'Reminder Frequency (hours)'}
              </Label>
              <Input
                id="reminderFrequencyHours"
                type="number"
                min="1"
                max="72"
                value={settings.reminderFrequencyHours || 8}
                onChange={(e) => onSettingChange('reminderFrequencyHours', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">
                {t('admin.settings.multi_level_approval')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'طلب موافقة من عدة مستويات إدارية' : 'Require approval from multiple management levels'}
              </p>
            </div>
            <Switch
              checked={settings.enableMultiLevelApproval !== false}
              onCheckedChange={(checked) => onSettingChange('enableMultiLevelApproval', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">
                {isRTL ? 'تفعيل التصعيد التلقائي' : 'Enable Auto-Escalation'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'تصعيد المهام تلقائياً عند تجاوز المهلة المحددة' : 'Automatically escalate tasks when timeout is exceeded'}
              </p>
            </div>
            <Switch
              checked={settings.enableAutoEscalation || false}
              onCheckedChange={(checked) => onSettingChange('enableAutoEscalation', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">
                {isRTL ? 'تفعيل التذكيرات' : 'Enable Reminders'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'إرسال تذكيرات دورية للمهام المعلقة' : 'Send periodic reminders for pending tasks'}
              </p>
            </div>
            <Switch
              checked={settings.enableReminders !== false}
              onCheckedChange={(checked) => onSettingChange('enableReminders', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">
                {isRTL ? 'تفعيل الموافقة المتوازية' : 'Enable Parallel Approval'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'السماح بالموافقة من عدة أشخاص في نفس الوقت' : 'Allow approval from multiple people simultaneously'}
              </p>
            </div>
            <Switch
              checked={settings.enableParallelApproval || false}
              onCheckedChange={(checked) => onSettingChange('enableParallelApproval', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}