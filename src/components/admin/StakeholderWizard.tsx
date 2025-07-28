import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MultiStepForm } from "@/components/ui/multi-step-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

interface Stakeholder {
  id?: string;
  name: string;
  name_ar?: string;
  organization: string;
  position: string;
  email: string;
  phone?: string;
  stakeholder_type: string;
  influence_level: string;
  interest_level: string;
  engagement_status: string;
  notes?: string;
}

interface StakeholderWizardProps {
  isOpen: boolean;
  onClose: () => void;
  stakeholder?: Stakeholder | null;
  onSave: () => void;
}

export function StakeholderWizard({
  isOpen,
  onClose,
  stakeholder,
  onSave,
}: StakeholderWizardProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: "",
    name_ar: "",
    organization: "",
    position: "",
    email: "",
    phone: "",
    stakeholder_type: "government",
    influence_level: "medium",
    interest_level: "medium",
    engagement_status: "neutral",
    notes: "",
  });

  // Options
  const stakeholderTypes = [
    { value: "government", label: "حكومي" },
    { value: "private_sector", label: "قطاع خاص" },
    { value: "academic", label: "أكاديمي" },
    { value: "ngo", label: "منظمة غير ربحية" },
    { value: "community", label: "مجتمعي" },
    { value: "international", label: "دولي" }
  ];

  const influenceLevels = [
    { value: "high", label: "عالي" },
    { value: "medium", label: "متوسط" },
    { value: "low", label: "منخفض" }
  ];

  const interestLevels = [
    { value: "high", label: "عالي" },
    { value: "medium", label: "متوسط" },
    { value: "low", label: "منخفض" }
  ];

  const engagementStatuses = [
    { value: "supporter", label: "مؤيد" },
    { value: "active", label: "نشط" },
    { value: "neutral", label: "محايد" },
    { value: "passive", label: "سلبي" },
    { value: "resistant", label: "مقاوم" }
  ];

  useEffect(() => {
    if (stakeholder) {
      setFormData({
        name: stakeholder.name || "",
        name_ar: stakeholder.name_ar || "",
        organization: stakeholder.organization || "",
        position: stakeholder.position || "",
        email: stakeholder.email || "",
        phone: stakeholder.phone || "",
        stakeholder_type: stakeholder.stakeholder_type || "government",
        influence_level: stakeholder.influence_level || "medium",
        interest_level: stakeholder.interest_level || "medium",
        engagement_status: stakeholder.engagement_status || "neutral",
        notes: stakeholder.notes || "",
      });
    } else {
      setFormData({
        name: "",
        name_ar: "",
        organization: "",
        position: "",
        email: "",
        phone: "",
        stakeholder_type: "government",
        influence_level: "medium",
        interest_level: "medium",
        engagement_status: "neutral",
        notes: "",
      });
    }
  }, [stakeholder, isOpen]);

  const validateBasicInfo = () => {
    if (!formData.name.trim()) return false;
    if (!formData.organization.trim()) return false;
    if (!formData.position.trim()) return false;
    return true;
  };

  const validateContactInfo = () => {
    if (!formData.email.trim()) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return false;
    return true;
  };

  const handleSave = async () => {
    try {
      if (stakeholder?.id) {
        // Update existing stakeholder
        const { error } = await supabase
          .from("stakeholders")
          .update(formData)
          .eq("id", stakeholder.id);

        if (error) throw error;
        
        toast({
          title: "نجح التحديث",
          description: "تم تحديث بيانات صاحب المصلحة بنجاح",
        });
      } else {
        // Create new stakeholder
        const { error } = await supabase
          .from("stakeholders")
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "نجح الإنشاء",
          description: "تم إنشاء صاحب المصلحة بنجاح",
        });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving stakeholder:", error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ بيانات صاحب المصلحة",
        variant: "destructive",
      });
    }
  };

  const steps = [
    {
      id: "basic-info",
      title: "المعلومات الأساسية",
      description: "أدخل الاسم والمنظمة والمنصب",
      validation: validateBasicInfo,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم (بالإنجليزية) *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="أدخل الاسم بالإنجليزية"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_ar">الاسم (بالعربية)</Label>
              <Input
                id="name_ar"
                value={formData.name_ar}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                placeholder="أدخل الاسم بالعربية"
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="organization">المنظمة *</Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="أدخل اسم المنظمة"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">المنصب *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="أدخل المنصب"
                dir="rtl"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "contact-info",
      title: "معلومات الاتصال",
      description: "أدخل البريد الإلكتروني ورقم الهاتف",
      validation: validateContactInfo,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@domain.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+966 XX XXX XXXX"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "classification",
      title: "التصنيف والنوع",
      description: "حدد نوع صاحب المصلحة وحالة المشاركة",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stakeholder_type">نوع صاحب المصلحة</Label>
              <Select 
                value={formData.stakeholder_type} 
                onValueChange={(value) => setFormData({ ...formData, stakeholder_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stakeholderTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="engagement_status">حالة المشاركة</Label>
              <Select 
                value={formData.engagement_status} 
                onValueChange={(value) => setFormData({ ...formData, engagement_status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {engagementStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "influence-interest",
      title: "التأثير والاهتمام",
      description: "حدد مستوى التأثير والاهتمام",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="influence_level">مستوى التأثير</Label>
              <Select 
                value={formData.influence_level} 
                onValueChange={(value) => setFormData({ ...formData, influence_level: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {influenceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest_level">مستوى الاهتمام</Label>
              <Select 
                value={formData.interest_level} 
                onValueChange={(value) => setFormData({ ...formData, interest_level: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {interestLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "notes",
      title: "ملاحظات إضافية",
      description: "أضف أي ملاحظات أو تفاصيل إضافية",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="notes">الملاحظات</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="أضف أي ملاحظات أو تفاصيل إضافية حول صاحب المصلحة"
              rows={4}
              dir="rtl"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <MultiStepForm
      isOpen={isOpen}
      onClose={onClose}
      title={stakeholder ? "تعديل صاحب المصلحة" : "إضافة صاحب مصلحة جديد"}
      steps={steps}
      onComplete={handleSave}
      showProgress={true}
      allowSkip={false}
    />
  );
}