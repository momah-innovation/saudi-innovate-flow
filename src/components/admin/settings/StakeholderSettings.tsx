import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StakeholderSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function StakeholderSettings({ settings, onSettingChange }: StakeholderSettingsProps) {
  return (
    <div className="space-y-6 rtl:text-right ltr:text-left">
      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات المعنيين</CardTitle>
          <CardDescription>التحكم في إدارة المعنيين والجهات ذات العلاقة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rtl:text-right ltr:text-left">
            <div className="space-y-2">
              <Label htmlFor="maxStakeholders">الحد الأقصى للمعنيين لكل مشروع</Label>
              <Input
                id="maxStakeholders"
                type="number"
                defaultValue="20"
                min="1"
                max="100"
                className="rtl:text-right ltr:text-left"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stakeholderTier">مستوى الأهمية الافتراضي</Label>
              <Select defaultValue="medium">
                <SelectTrigger className="rtl:text-right ltr:text-left">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">عالي</SelectItem>
                  <SelectItem value="medium">متوسط</SelectItem>
                  <SelectItem value="low">منخفض</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">تتبع تفاعل المعنيين</Label>
              <p className="text-sm text-muted-foreground">تسجيل وتتبع تفاعل المعنيين مع المشاريع</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}