import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TeamSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function TeamSettings({ settings, onSettingChange }: TeamSettingsProps) {
  return (
    <div className="space-y-6 rtl:text-right ltr:text-left">
      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات فرق الابتكار</CardTitle>
          <CardDescription>التحكم في إدارة فرق الابتكار وتكليفاتهم</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rtl:text-right ltr:text-left">
            <div className="space-y-2">
              <Label htmlFor="maxTeamSize">الحد الأقصى لحجم الفريق</Label>
              <Input
                id="maxTeamSize"
                type="number"
                defaultValue="10"
                min="2"
                max="50"
                className="rtl:text-right ltr:text-left"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxWorkload">الحد الأقصى للعبء الوظيفي (%)</Label>
              <Input
                id="maxWorkload"
                type="number"
                defaultValue="100"
                min="10"
                max="200"
                className="rtl:text-right ltr:text-left"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">تتبع الأداء</Label>
              <p className="text-sm text-muted-foreground">تتبع أداء أعضاء فرق الابتكار</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}