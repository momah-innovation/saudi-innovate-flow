import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trash2, Plus, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SystemListSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function SystemListSettings({ settings, onSettingChange }: SystemListSettingsProps) {
  const { toast } = useToast();
  const [editingList, setEditingList] = useState<string | null>(null);
  const [newItem, setNewItem] = useState("");

  const systemLists = {
    challengeTypes: settings.challengeTypes || ['تحدي تقني', 'تحدي إبداعي', 'تحدي تشغيلي', 'تحدي استراتيجي'],
    ideaCategories: settings.ideaCategories || ['تطوير منتج', 'تحسين عملية', 'حل مشكلة', 'ابتكار تقني'],
    evaluationCriteria: settings.evaluationCriteria || ['الجدوى التقنية', 'الأثر المتوقع', 'التكلفة', 'سهولة التنفيذ', 'الابتكار'],
    themes: settings.themes || ['التكنولوجيا المالية', 'الصحة', 'التعليم', 'البيئة'],
    roles: settings.roles || ['مبتكر', 'خبير', 'منسق فريق', 'مدير', 'مدير عام'],
    statusOptions: settings.statusOptions || ['مسودة', 'منشور', 'نشط', 'مكتمل', 'ملغي'],
    priorityLevels: settings.priorityLevels || ['منخفض', 'متوسط', 'عالي', 'عاجل'],
    sensitivityLevels: settings.sensitivityLevels || ['عادي', 'حساس', 'سري', 'سري للغاية']
  };

  const listLabels = {
    challengeTypes: 'أنواع التحديات',
    ideaCategories: 'فئات الأفكار',
    evaluationCriteria: 'معايير التقييم',
    themes: 'المواضيع',
    roles: 'الأدوار',
    statusOptions: 'خيارات الحالة',
    priorityLevels: 'مستويات الأولوية',
    sensitivityLevels: 'مستويات الحساسية'
  };

  const addItem = (listKey: string) => {
    if (!newItem.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال عنصر صحيح",
        variant: "destructive"
      });
      return;
    }

    const currentList = systemLists[listKey as keyof typeof systemLists] || [];
    if (currentList.includes(newItem.trim())) {
      toast({
        title: "خطأ",
        description: "هذا العنصر موجود بالفعل",
        variant: "destructive"
      });
      return;
    }

    const updatedList = [...currentList, newItem.trim()];
    onSettingChange(listKey, updatedList);
    setNewItem("");
    setEditingList(null);
    
    toast({
      title: "تم بنجاح",
      description: "تم إضافة العنصر بنجاح"
    });
  };

  const removeItem = (listKey: string, itemIndex: number) => {
    const currentList = systemLists[listKey as keyof typeof systemLists] || [];
    const updatedList = currentList.filter((_, index) => index !== itemIndex);
    onSettingChange(listKey, updatedList);
    
    toast({
      title: "تم بنجاح",
      description: "تم حذف العنصر بنجاح"
    });
  };

  const renderList = (listKey: string, items: string[]) => (
    <Card key={listKey}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{listLabels[listKey as keyof typeof listLabels]}</CardTitle>
            <CardDescription>إدارة قائمة {listLabels[listKey as keyof typeof listLabels]}</CardDescription>
          </div>
          <Badge variant="outline">{items.length} عنصر</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
              <span className="flex-1">{item}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(listKey, index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {editingList === listKey ? (
          <div className="flex gap-2">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="أدخل عنصر جديد..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addItem(listKey);
                } else if (e.key === 'Escape') {
                  setEditingList(null);
                  setNewItem("");
                }
              }}
              autoFocus
            />
            <Button onClick={() => addItem(listKey)} size="sm">
              إضافة
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setEditingList(null);
                setNewItem("");
              }}
            >
              إلغاء
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingList(listKey)}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            إضافة عنصر جديد
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 rtl:text-right ltr:text-left">
      {/* Collapsible Lists Section */}
      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>قوائم النظام</CardTitle>
          <CardDescription>إدارة القوائم المستخدمة في النظام - اضغط على أي قائمة لتوسيعها</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {Object.entries(systemLists).map(([listKey, items]) => (
              <AccordionItem key={listKey} value={listKey} className="border-b">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full rtl:flex-row-reverse">
                    <div className="flex items-center gap-3 rtl:flex-row-reverse">
                      <span className="font-medium rtl:text-right ltr:text-left">
                        {listLabels[listKey as keyof typeof listLabels]}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {items.length} عنصر
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="space-y-4">
                    {/* Items List */}
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md rtl:flex-row-reverse">
                          <span className="flex-1 text-sm rtl:text-right ltr:text-left">{item}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(listKey, index)}
                            className="text-destructive hover:text-destructive h-8 w-8 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Add New Item */}
                    {editingList === listKey ? (
                      <div className="flex gap-2 rtl:flex-row-reverse">
                        <Input
                          value={newItem}
                          onChange={(e) => setNewItem(e.target.value)}
                          placeholder="أدخل عنصر جديد..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              addItem(listKey);
                            } else if (e.key === 'Escape') {
                              setEditingList(null);
                              setNewItem("");
                            }
                          }}
                          autoFocus
                          className="rtl:text-right ltr:text-left text-sm"
                          size={undefined}
                        />
                        <Button onClick={() => addItem(listKey)} size="sm">
                          إضافة
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setEditingList(null);
                            setNewItem("");
                          }}
                        >
                          إلغاء
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingList(listKey)}
                        className="w-full h-8"
                      >
                        <Plus className="w-3 h-3 rtl:ml-2 ltr:mr-2" />
                        إضافة عنصر جديد
                      </Button>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات القوائم المتقدمة</CardTitle>
          <CardDescription>خيارات متقدمة لإدارة القوائم</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">السماح بالقيم المخصصة</Label>
              <p className="text-sm text-muted-foreground">السماح للمستخدمين بإدخال قيم جديدة غير موجودة في القوائم</p>
            </div>
            <input 
              type="checkbox" 
              className="h-4 w-4"
              checked={settings.allowCustomValues !== false}
              onChange={(e) => onSettingChange('allowCustomValues', e.target.checked)}
            />
          </div>

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">ترتيب القوائم أبجدياً</Label>
              <p className="text-sm text-muted-foreground">ترتيب عناصر القوائم حسب الترتيب الأبجدي</p>
            </div>
            <input 
              type="checkbox" 
              className="h-4 w-4"
              checked={settings.sortListsAlphabetically || false}
              onChange={(e) => onSettingChange('sortListsAlphabetically', e.target.checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}