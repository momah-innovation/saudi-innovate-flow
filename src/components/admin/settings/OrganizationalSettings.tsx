import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useDirection } from "@/components/ui/direction-provider";
import { OrganizationalSettingsProps } from "@/types/admin-settings";

export function OrganizationalSettings({ settings, onSettingChange }: OrganizationalSettingsProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const [newDepartment, setNewDepartment] = useState("");
  const [newPosition, setNewPosition] = useState("");
  
  const departments = settings.organizational_departments || ["hr", "finance", "it", "operations", "marketing", "sales", "legal", "research"];
  const positions = settings.organizational_positions || ["manager", "supervisor", "specialist", "coordinator", "director", "analyst", "consultant"];

  const addDepartment = () => {
    if (newDepartment.trim() && !departments.includes(newDepartment)) {
      const updatedDepartments = [...departments, newDepartment.trim()];
      onSettingChange('organizational_departments', updatedDepartments);
      setNewDepartment("");
      toast({
        title: t('success'),
        description: "تم إضافة القسم بنجاح"
      });
    }
  };

  const removeDepartment = (deptToRemove: string) => {
    const updatedDepartments = departments.filter((dept: string) => dept !== deptToRemove);
    onSettingChange('organizational_departments', updatedDepartments);
    toast({
      title: t('success'),
      description: "تم حذف القسم بنجاح"
    });
  };

  const addPosition = () => {
    if (newPosition.trim() && !positions.includes(newPosition)) {
      const updatedPositions = [...positions, newPosition.trim()];
      onSettingChange('organizational_positions', updatedPositions);
      setNewPosition("");
      toast({
        title: t('success'),
        description: "تم إضافة المنصب بنجاح"
      });
    }
  };

  const removePosition = (posToRemove: string) => {
    const updatedPositions = positions.filter((pos: string) => pos !== posToRemove);
    onSettingChange('organizational_positions', updatedPositions);
    toast({
      title: t('success'),
      description: "تم حذف المنصب بنجاح"
    });
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>{t('systemLists.organizationalDepartments')}</CardTitle>
          <CardDescription>إدارة الأقسام التنظيمية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              placeholder="أضف قسم جديد"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addDepartment} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {departments.map((dept: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`departments.${dept}`) || dept}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeDepartment(dept)}
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
          <CardTitle>{t('systemLists.organizationalPositions')}</CardTitle>
          <CardDescription>إدارة المناصب التنظيمية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newPosition}
              onChange={(e) => setNewPosition(e.target.value)}
              placeholder="أضف منصب جديد"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addPosition} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {positions.map((pos: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`positions.${pos}`) || pos}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removePosition(pos)}
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
          <CardTitle>إعدادات الهيكل التنظيمي</CardTitle>
          <CardDescription>التحكم في إدارة الهيكل التنظيمي والقطاعات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="maxHierarchyLevels">الحد الأقصى لمستويات التسلسل الهرمي</Label>
              <Input
                id="maxHierarchyLevels"
                type="number"
                value={settings.orgMaxHierarchyLevels || 5}
                onChange={(e) => onSettingChange('orgMaxHierarchyLevels', parseInt(e.target.value))}
                min="2"
                max="10"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxDepartments">الحد الأقصى للأقسام</Label>
              <Input
                id="maxDepartments"
                type="number"
                value={settings.orgMaxDepartments || 50}
                onChange={(e) => onSettingChange('orgMaxDepartments', parseInt(e.target.value))}
                min="1"
                max="200"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPositions">الحد الأقصى للمناصب</Label>
              <Input
                id="maxPositions"
                type="number"
                value={settings.orgMaxPositions || 100}
                onChange={(e) => onSettingChange('orgMaxPositions', parseInt(e.target.value))}
                min="1"
                max="500"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="approvalLevels">مستويات الموافقة المطلوبة</Label>
              <Input
                id="approvalLevels"
                type="number"
                value={settings.orgApprovalLevels || 3}
                onChange={(e) => onSettingChange('orgApprovalLevels', parseInt(e.target.value))}
                min="1"
                max="5"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">تحديث تلقائي للهيكل</Label>
              <p className="text-sm text-muted-foreground">تحديث الهيكل التنظيمي تلقائياً عند تغيير البيانات</p>
            </div>
            <Switch 
              checked={settings.orgAutoUpdateStructure !== false}
              onCheckedChange={(checked) => onSettingChange('orgAutoUpdateStructure', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">الموافقة الهرمية</Label>
              <p className="text-sm text-muted-foreground">اتباع التسلسل الهرمي في الموافقات</p>
            </div>
            <Switch 
              checked={settings.orgHierarchicalApproval !== false}
              onCheckedChange={(checked) => onSettingChange('orgHierarchicalApproval', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">تقارير دورية للهيكل</Label>
              <p className="text-sm text-muted-foreground">إنتاج تقارير دورية حول الهيكل التنظيمي</p>
            </div>
            <Switch 
              checked={settings.orgPeriodicReports !== false}
              onCheckedChange={(checked) => onSettingChange('orgPeriodicReports', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}