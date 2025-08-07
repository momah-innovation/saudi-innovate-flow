import { useState } from "react";
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

interface EventSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function EventSettings({ settings, onSettingChange }: EventSettingsProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const [newEventType, setNewEventType] = useState("");
  const [newEventCategory, setNewEventCategory] = useState("");
  
  const eventTypes = settings.event_types || ["workshop", "seminar", "conference", "networking", "hackathon", "pitch_session", "training"];
  const eventCategories = settings.event_categories || ["standalone", "campaign_event", "training", "workshop"];

  const addEventType = () => {
    if (newEventType.trim() && !eventTypes.includes(newEventType)) {
      const updatedTypes = [...eventTypes, newEventType.trim()];
      onSettingChange('event_types', updatedTypes);
      setNewEventType("");
      toast({
        title: t('success'),
        description: t('itemAddedSuccessfully')
      });
    }
  };

  const removeEventType = (typeToRemove: string) => {
    const updatedTypes = eventTypes.filter((type: string) => type !== typeToRemove);
    onSettingChange('event_types', updatedTypes);
    toast({
      title: t('success'),
      description: t('itemRemovedSuccessfully')
    });
  };

  const addEventCategory = () => {
    if (newEventCategory.trim() && !eventCategories.includes(newEventCategory)) {
      const updatedCategories = [...eventCategories, newEventCategory.trim()];
      onSettingChange('event_categories', updatedCategories);
      setNewEventCategory("");
      toast({
        title: t('success'),
        description: t('itemAddedSuccessfully')
      });
    }
  };

  const removeEventCategory = (categoryToRemove: string) => {
    const updatedCategories = eventCategories.filter((category: string) => category !== categoryToRemove);
    onSettingChange('event_categories', updatedCategories);
    toast({
      title: t('success'),
      description: t('itemRemovedSuccessfully')
    });
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>{t('systemLists.eventTypes')}</CardTitle>
          <CardDescription>إدارة أنواع الفعاليات المتاحة في النظام</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newEventType}
              onChange={(e) => setNewEventType(e.target.value)}
              placeholder="أضف نوع فعالية جديد"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addEventType} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((type: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`eventTypes.${type}`) || type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeEventType(type)}
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
          <CardTitle>{t('systemLists.eventCategories')}</CardTitle>
          <CardDescription>إدارة فئات الفعاليات المتاحة في النظام</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newEventCategory}
              onChange={(e) => setNewEventCategory(e.target.value)}
              placeholder="أضف فئة فعالية جديدة"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addEventCategory} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {eventCategories.map((category: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`eventCategories.${category}`) || category}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeEventCategory(category)}
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
          <CardTitle>الإعدادات الافتراضية للفعاليات</CardTitle>
          <CardDescription>التحكم في إنشاء وإدارة الفعاليات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">الحد الأقصى للمشاركين</Label>
              <Input
                id="maxParticipants"
                type="number"
                value={settings.maxParticipants || 100}
                onChange={(e) => onSettingChange('maxParticipants', parseInt(e.target.value))}
                min="1"
                max="10000"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="registrationDeadlineDays">مهلة التسجيل (بالأيام قبل الفعالية)</Label>
              <Input
                id="registrationDeadlineDays"
                type="number"
                value={settings.registrationDeadlineDays || 3}
                onChange={(e) => onSettingChange('registrationDeadlineDays', parseInt(e.target.value))}
                min="0"
                max="30"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">التسجيل المفتوح</Label>
              <p className="text-sm text-muted-foreground">السماح بالتسجيل المفتوح للفعاليات</p>
            </div>
            <Switch 
              checked={settings.allowOpenRegistration !== false}
              onCheckedChange={(checked) => onSettingChange('allowOpenRegistration', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">تسجيل الحضور</Label>
              <p className="text-sm text-muted-foreground">تفعيل تسجيل الحضور للفعاليات</p>
            </div>
            <Switch 
              checked={settings.enableAttendanceTracking !== false}
              onCheckedChange={(checked) => onSettingChange('enableAttendanceTracking', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}