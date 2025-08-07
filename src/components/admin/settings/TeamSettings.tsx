import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useAppTranslation";
import { useDirection } from "@/components/ui/direction-provider";
import { supabase } from "@/integrations/supabase/client";

interface TeamSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function TeamSettings({ settings, onSettingChange }: TeamSettingsProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const [newOrganizationType, setNewOrganizationType] = useState("");
  
  const organizationTypes = settings.organization_types || ["operational", "strategic", "administrative", "technical", "support"];

  const addOrganizationType = () => {
    if (newOrganizationType.trim() && !organizationTypes.includes(newOrganizationType)) {
      const updatedTypes = [...organizationTypes, newOrganizationType.trim()];
      onSettingChange('organization_types', updatedTypes);
      setNewOrganizationType("");
      toast({
        title: t('success'),
        description: "تم إضافة نوع المنظمة بنجاح"
      });
    }
  };

  const removeOrganizationType = (typeToRemove: string) => {
    const updatedTypes = organizationTypes.filter((type: string) => type !== typeToRemove);
    onSettingChange('organization_types', updatedTypes);
    toast({
      title: t('success'),
      description: "تم حذف نوع المنظمة بنجاح"
    });
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>{t('systemLists.organizationTypes')}</CardTitle>
          <CardDescription>إدارة أنواع المنظمات المتاحة في النظام</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newOrganizationType}
              onChange={(e) => setNewOrganizationType(e.target.value)}
              placeholder="أضف نوع منظمة جديد"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addOrganizationType} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {organizationTypes.map((type: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`organizationTypes.${type}`) || type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeOrganizationType(type)}
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
          <CardTitle>إعدادات فرق الابتكار</CardTitle>
          <CardDescription>التحكم في إدارة فرق الابتكار والتعاون</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="maxTeamSize">الحد الأقصى لحجم الفريق</Label>
              <Input
                id="maxTeamSize"
                type="number"
                value={settings.maxTeamSize || 20}
                onChange={(e) => onSettingChange('maxTeamSize', parseInt(e.target.value))}
                min="2"
                max="100"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minTeamSize">الحد الأدنى لحجم الفريق</Label>
              <Input
                id="minTeamSize"
                type="number"
                value={settings.minTeamSize || 3}
                onChange={(e) => onSettingChange('minTeamSize', parseInt(e.target.value))}
                min="1"
                max="10"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxTeamsPerUser">الحد الأقصى للفرق لكل مستخدم</Label>
              <Input
                id="maxTeamsPerUser"
                type="number"
                value={settings.maxTeamsPerUser || 5}
                onChange={(e) => onSettingChange('maxTeamsPerUser', parseInt(e.target.value))}
                min="1"
                max="20"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxConcurrentProjects">الحد الأقصى للمشاريع المتزامنة لكل فريق</Label>
              <Input
                id="maxConcurrentProjects"
                type="number"
                value={settings.maxConcurrentProjects || 10}
                onChange={(e) => onSettingChange('maxConcurrentProjects', parseInt(e.target.value))}
                min="1"
                max="50"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workloadPercentageLimit">الحد الأقصى لنسبة حمل العمل (%)</Label>
              <Input
                id="workloadPercentageLimit"
                type="number"
                value={settings.workloadPercentageLimit || 100}
                onChange={(e) => onSettingChange('workloadPercentageLimit', parseInt(e.target.value))}
                min="50"
                max="150"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="membershipDuration">مدة العضوية الافتراضية (بالأشهر)</Label>
              <Input
                id="membershipDuration"
                type="number"
                value={settings.membershipDuration || 12}
                onChange={(e) => onSettingChange('membershipDuration', parseInt(e.target.value))}
                min="1"
                max="60"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">الانضمام المفتوح للفرق</Label>
              <p className="text-sm text-muted-foreground">السماح للمستخدمين بالانضمام للفرق بدون دعوة</p>
            </div>
            <Switch 
              checked={settings.allowOpenTeamJoining || false}
              onCheckedChange={(checked) => onSettingChange('allowOpenTeamJoining', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">تتبع أداء الفريق</Label>
              <p className="text-sm text-muted-foreground">تسجيل وتتبع مؤشرات أداء الفرق</p>
            </div>
            <Switch 
              checked={settings.enableTeamPerformanceTracking !== false}
              onCheckedChange={(checked) => onSettingChange('enableTeamPerformanceTracking', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">تتبع السعة الأسبوعية</Label>
              <p className="text-sm text-muted-foreground">تسجيل سعة العمل الأسبوعية للأعضاء</p>
            </div>
            <Switch 
              checked={settings.enableWeeklyCapacityTracking !== false}
              onCheckedChange={(checked) => onSettingChange('enableWeeklyCapacityTracking', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">التعاون بين الفرق</Label>
              <p className="text-sm text-muted-foreground">تفعيل التعاون والمشاركة بين الفرق المختلفة</p>
            </div>
            <Switch 
              checked={settings.enableCrossTeamCollaboration !== false}
              onCheckedChange={(checked) => onSettingChange('enableCrossTeamCollaboration', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}