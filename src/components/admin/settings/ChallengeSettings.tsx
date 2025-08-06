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

interface ChallengeSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function ChallengeSettings({ settings, onSettingChange }: ChallengeSettingsProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [newChallengeType, setNewChallengeType] = useState("");
  
  const challengeTypes = settings.challenge_types || ["تقنية", "استدامة", "صحة", "تعليم", "حوكمة"];

  const addChallengeType = () => {
    if (newChallengeType.trim() && !challengeTypes.includes(newChallengeType)) {
      const updatedTypes = [...challengeTypes, newChallengeType.trim()];
      onSettingChange('challenge_types', updatedTypes);
      setNewChallengeType("");
      toast({
        title: t('success'),
        description: "تم إضافة نوع التحدي بنجاح"
      });
    }
  };

  const removeChallengeType = (typeToRemove: string) => {
    const updatedTypes = challengeTypes.filter((type: string) => type !== typeToRemove);
    onSettingChange('challenge_types', updatedTypes);
    toast({
      title: t('success'),
      description: "تم حذف نوع التحدي بنجاح"
    });
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>{t('systemLists.challengeTypes')}</CardTitle>
          <CardDescription>إدارة أنواع التحديات المتاحة في النظام</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newChallengeType}
              onChange={(e) => setNewChallengeType(e.target.value)}
              placeholder="أضف نوع تحدي جديد"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addChallengeType} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {challengeTypes.map((type: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`challengeTypes.${type}`) || type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeChallengeType(type)}
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
          <CardTitle>الإعدادات الافتراضية للتحديات</CardTitle>
          <CardDescription>القيم الافتراضية عند إنشاء تحديات جديدة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="maxChallengesPerUser">الحد الأقصى للتحديات لكل مستخدم</Label>
              <Input
                id="maxChallengesPerUser"
                type="number"
                min="1"
                max="100"
                value={settings.maxChallengesPerUser || 10}
                onChange={(e) => onSettingChange('maxChallengesPerUser', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemsPerPage">عدد العناصر في الصفحة</Label>
              <Input
                id="itemsPerPage"
                type="number"
                min="6"
                max="48"
                value={settings.itemsPerPage || 12}
                onChange={(e) => onSettingChange('itemsPerPage', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>إعدادات سير العمل</CardTitle>
          <CardDescription>تحكم في آلية عمل التحديات والتعاون</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">مطالبة الموافقة للنشر</Label>
              <p className="text-sm text-muted-foreground">مطالبة موافقة إدارية قبل نشر التحديات</p>
            </div>
            <Switch
              checked={settings.requireApprovalForPublish !== false}
              onCheckedChange={(checked) => onSettingChange('requireApprovalForPublish', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">السماح بالمشاركات المجهولة</Label>
              <p className="text-sm text-muted-foreground">السماح بتقديم أفكار بدون الكشف عن الهوية</p>
            </div>
            <Switch
              checked={settings.allowAnonymousSubmissions || false}
              onCheckedChange={(checked) => onSettingChange('allowAnonymousSubmissions', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">تفعيل التعاون</Label>
              <p className="text-sm text-muted-foreground">السماح بالعمل التعاوني على التحديات</p>
            </div>
            <Switch
              checked={settings.enableCollaboration !== false}
              onCheckedChange={(checked) => onSettingChange('enableCollaboration', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}