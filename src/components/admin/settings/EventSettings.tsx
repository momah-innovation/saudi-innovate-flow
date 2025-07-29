import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function EventSettings({ settings, onSettingChange }: EventSettingsProps) {
  return (
    <div className="space-y-6 rtl:text-right ltr:text-left">
      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات الفعاليات</CardTitle>
          <CardDescription>التحكم في إنشاء وإدارة الفعاليات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rtl:text-right ltr:text-left">
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">الحد الأقصى للمشاركين</Label>
              <Input
                id="maxParticipants"
                type="number"
                defaultValue="100"
                min="1"
                max="10000"
                className="rtl:text-right ltr:text-left"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="registrationDeadline">مهلة التسجيل (بالأيام قبل الفعالية)</Label>
              <Input
                id="registrationDeadline"
                type="number"
                defaultValue="3"
                min="0"
                max="30"
                className="rtl:text-right ltr:text-left"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">التسجيل المفتوح</Label>
              <p className="text-sm text-muted-foreground">السماح بالتسجيل المفتوح للفعاليات</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}