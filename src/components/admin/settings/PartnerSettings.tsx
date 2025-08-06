import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

interface PartnerSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function PartnerSettings({ settings, onSettingChange }: PartnerSettingsProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [newPartnerType, setNewPartnerType] = useState("");
  
  const partnerTypes = settings.partner_type_options || ["حكومي", "خاص", "أكاديمي", "غير ربحي", "دولي"];

  const addPartnerType = () => {
    if (newPartnerType.trim() && !partnerTypes.includes(newPartnerType)) {
      const updatedTypes = [...partnerTypes, newPartnerType.trim()];
      onSettingChange('partner_type_options', updatedTypes);
      setNewPartnerType("");
      toast({
        title: t('success'),
        description: "تم إضافة نوع الشريك بنجاح"
      });
    }
  };

  const removePartnerType = (typeToRemove: string) => {
    const updatedTypes = partnerTypes.filter((type: string) => type !== typeToRemove);
    onSettingChange('partner_type_options', updatedTypes);
    toast({
      title: t('success'),
      description: "تم حذف نوع الشريك بنجاح"
    });
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>{t('systemLists.partnerTypes')}</CardTitle>
          <CardDescription>إدارة أنواع الشركاء المتاحة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newPartnerType}
              onChange={(e) => setNewPartnerType(e.target.value)}
              placeholder="أضف نوع شريك جديد"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addPartnerType} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {partnerTypes.map((type: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removePartnerType(type)}
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
          <CardTitle>إعدادات الشركاء</CardTitle>
          <CardDescription>التحكم في إدارة الشركاء والتعاون معهم</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="maxPartnersPerProject">الحد الأقصى للشركاء لكل مشروع</Label>
              <Input
                id="maxPartnersPerProject"
                type="number"
                value={settings.maxPartnersPerProject || 5}
                onChange={(e) => onSettingChange('maxPartnersPerProject', parseInt(e.target.value))}
                min="1"
                max="20"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="partnershipDefaultDuration">مدة الشراكة الافتراضية (بالأشهر)</Label>
              <Input
                id="partnershipDefaultDuration"
                type="number"
                value={settings.partnershipDefaultDuration || 12}
                onChange={(e) => onSettingChange('partnershipDefaultDuration', parseInt(e.target.value))}
                min="1"
                max="60"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minPartnershipValue">الحد الأدنى لقيمة الشراكة</Label>
              <Input
                id="minPartnershipValue"
                type="number"
                value={settings.minPartnershipValue || 10000}
                onChange={(e) => onSettingChange('minPartnershipValue', parseInt(e.target.value))}
                min="0"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partnershipRenewalPeriod">فترة تجديد الشراكة (بالأيام)</Label>
              <Input
                id="partnershipRenewalPeriod"
                type="number"
                value={settings.partnershipRenewalPeriod || 30}
                onChange={(e) => onSettingChange('partnershipRenewalPeriod', parseInt(e.target.value))}
                min="7"
                max="90"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">الموافقة على الشراكات</Label>
              <p className="text-sm text-muted-foreground">مطالبة موافقة إدارية على الشراكات الجديدة</p>
            </div>
            <Switch 
              checked={settings.requirePartnershipApproval !== false}
              onCheckedChange={(checked) => onSettingChange('requirePartnershipApproval', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">تقييم دوري للشركاء</Label>
              <p className="text-sm text-muted-foreground">إجراء تقييم دوري لأداء الشركاء</p>
            </div>
            <Switch 
              checked={settings.enablePeriodicPartnerEvaluation !== false}
              onCheckedChange={(checked) => onSettingChange('enablePeriodicPartnerEvaluation', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">إشعارات انتهاء الشراكة</Label>
              <p className="text-sm text-muted-foreground">إرسال إشعارات قبل انتهاء مدة الشراكة</p>
            </div>
            <Switch 
              checked={settings.enablePartnershipExpiryNotifications !== false}
              onCheckedChange={(checked) => onSettingChange('enablePartnershipExpiryNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}