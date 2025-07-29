import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserManagementSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function UserManagementSettings({ settings, onSettingChange }: UserManagementSettingsProps) {
  return (
    <div className="space-y-6 rtl:text-right ltr:text-left">
      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات إدارة المستخدمين</CardTitle>
          <CardDescription>التحكم في إدارة المستخدمين والصلاحيات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rtl:text-right ltr:text-left">
            <div className="space-y-2">
              <Label htmlFor="maxUsers">الحد الأقصى للمستخدمين</Label>
              <Input
                id="maxUsers"
                type="number"
                defaultValue="1000"
                min="1"
                max="100000"
                className="rtl:text-right ltr:text-left"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userInactivityDays">أيام عدم النشاط قبل التعطيل</Label>
              <Input
                id="userInactivityDays"
                type="number"
                defaultValue="90"
                min="7"
                max="365"
                className="rtl:text-right ltr:text-left"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">التسجيل المفتوح</Label>
              <p className="text-sm text-muted-foreground">السماح للمستخدمين الجدد بالتسجيل بدون دعوة</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}