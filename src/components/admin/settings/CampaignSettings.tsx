import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useAppTranslation";
import { useDirection } from "@/components/ui/direction-provider";

interface CampaignSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function CampaignSettings({ settings, onSettingChange }: CampaignSettingsProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [newAssignmentType, setNewAssignmentType] = useState("");
  
  const assignmentTypes = settings.assignment_types || ["campaign", "event", "project", "content", "analysis"];

  const addAssignmentType = () => {
    if (newAssignmentType.trim() && !assignmentTypes.includes(newAssignmentType)) {
      const updatedTypes = [...assignmentTypes, newAssignmentType.trim()];
      onSettingChange('assignment_types', updatedTypes);
      setNewAssignmentType("");
      toast({
        title: t('success'),
        description: "تم إضافة نوع المهمة بنجاح"
      });
    }
  };

  const removeAssignmentType = (typeToRemove: string) => {
    const updatedTypes = assignmentTypes.filter((type: string) => type !== typeToRemove);
    onSettingChange('assignment_types', updatedTypes);
    toast({
      title: t('success'),
      description: "تم حذف نوع المهمة بنجاح"
    });
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>{t('systemLists.assignmentTypes')}</CardTitle>
          <CardDescription>إدارة أنواع المهام المتاحة للحملات</CardDescription>
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
                <span>{t(`assignmentTypes.${type}`) || type}</span>
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
          <CardTitle>إعدادات الحملات</CardTitle>
          <CardDescription>التحكم في إنشاء وإدارة الحملات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="maxCampaignsPerUser">الحد الأقصى للحملات لكل مستخدم</Label>
              <Input
                id="maxCampaignsPerUser"
                type="number"
                value={settings.maxCampaignsPerUser || 5}
                onChange={(e) => onSettingChange('maxCampaignsPerUser', parseInt(e.target.value))}
                min="1"
                max="50"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="campaignMinDuration">الحد الأدنى لمدة الحملة (بالأيام)</Label>
              <Input
                id="campaignMinDuration"
                type="number"
                value={settings.campaignMinDuration || 7}
                onChange={(e) => onSettingChange('campaignMinDuration', parseInt(e.target.value))}
                min="1"
                max="30"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaignMaxDuration">الحد الأقصى لمدة الحملة (بالأيام)</Label>
              <Input
                id="campaignMaxDuration"
                type="number"
                value={settings.campaignMaxDuration || 365}
                onChange={(e) => onSettingChange('campaignMaxDuration', parseInt(e.target.value))}
                min="1"
                max="1095"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxParticipantsPerCampaign">الحد الأقصى للمشاركين لكل حملة</Label>
              <Input
                id="maxParticipantsPerCampaign"
                type="number"
                value={settings.maxParticipantsPerCampaign || 1000}
                onChange={(e) => onSettingChange('maxParticipantsPerCampaign', parseInt(e.target.value))}
                min="1"
                max="10000"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaignBudgetLimit">الحد الأقصى لميزانية الحملة</Label>
              <Input
                id="campaignBudgetLimit"
                type="number"
                value={settings.campaignBudgetLimit || 1000000}
                onChange={(e) => onSettingChange('campaignBudgetLimit', parseInt(e.target.value))}
                min="0"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationDeadlineBuffer">مهلة إغلاق التسجيل قبل البداية (بالأيام)</Label>
              <Input
                id="registrationDeadlineBuffer"
                type="number"
                value={settings.registrationDeadlineBuffer || 3}
                onChange={(e) => onSettingChange('registrationDeadlineBuffer', parseInt(e.target.value))}
                min="0"
                max="30"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">التسجيل المفتوح للحملات</Label>
              <p className="text-sm text-muted-foreground">السماح بالتسجيل المفتوح في الحملات</p>
            </div>
            <Switch 
              checked={settings.allowOpenCampaignRegistration !== false}
              onCheckedChange={(checked) => onSettingChange('allowOpenCampaignRegistration', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">مراجعة الحملات قبل النشر</Label>
              <p className="text-sm text-muted-foreground">مطالبة مراجعة إدارية قبل نشر الحملات</p>
            </div>
            <Switch 
              checked={settings.requireCampaignReview !== false}
              onCheckedChange={(checked) => onSettingChange('requireCampaignReview', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">تتبع أداء الحملات</Label>
              <p className="text-sm text-muted-foreground">تسجيل وتتبع مؤشرات أداء الحملات</p>
            </div>
            <Switch 
              checked={settings.enableCampaignAnalytics !== false}
              onCheckedChange={(checked) => onSettingChange('enableCampaignAnalytics', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">الإشعارات التلقائية</Label>
              <p className="text-sm text-muted-foreground">إرسال إشعارات تلقائية للمشاركين</p>
            </div>
            <Switch 
              checked={settings.enableAutomaticNotifications !== false}
              onCheckedChange={(checked) => onSettingChange('enableAutomaticNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}