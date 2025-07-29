import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PartnerSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function PartnerSettings({ settings, onSettingChange }: PartnerSettingsProps) {
  return (
    <div className="space-y-6 rtl:text-right ltr:text-left">
      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات الشركاء</CardTitle>
          <CardDescription>التحكم في إدارة الشركاء والتعاون معهم</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rtl:text-right ltr:text-left">
            <div className="space-y-2">
              <Label htmlFor="maxPartners">الحد الأقصى للشركاء لكل مشروع</Label>
              <Input
                id="maxPartners"
                type="number"
                defaultValue="5"
                min="1"
                max="20"
                className="rtl:text-right ltr:text-left"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="partnershipDuration">مدة الشراكة الافتراضية (بالأشهر)</Label>
              <Input
                id="partnershipDuration"
                type="number"
                defaultValue="12"
                min="1"
                max="60"
                className="rtl:text-right ltr:text-left"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">الموافقة على الشراكات</Label>
              <p className="text-sm text-muted-foreground">مطالبة موافقة إدارية على الشراكات الجديدة</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}