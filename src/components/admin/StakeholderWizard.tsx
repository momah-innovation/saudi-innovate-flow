import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MultiStepForm } from "@/components/ui/multi-step-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useAppTranslation";
import { useSystemLists } from "@/hooks/useSystemLists";
import { Building, User, Mail, Phone, Users, Target } from "lucide-react";

interface Stakeholder {
  id?: string;
  name: string;
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
  
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    position: "",
    email: "",
    phone: "",
    stakeholder_type: "حكومي",
    influence_level: "متوسط",
    interest_level: "متوسط",
    engagement_status: "محايد",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { partnerTypeOptions, generalStatusOptions } = useSystemLists();

  // Predefined options in Arabic
  const stakeholderTypes = partnerTypeOptions.map(type => ({ 
    value: type, 
    label: type === 'government' ? 'حكومي' :
           type === 'private' ? 'قطاع خاص' :
           type === 'academic' ? 'أكاديمي' :
           type === 'non_profit' ? 'منظمة غير ربحية' :
           type === 'international' ? 'دولي' : type
  }));

  const { stakeholderInfluenceLevels, stakeholderInterestLevels } = useSystemLists();
  
  const influenceLevels = stakeholderInfluenceLevels.map(level => ({ 
    value: level, 
    label: level === 'high' ? 'عالي' :
           level === 'medium' ? 'متوسط' :
           level === 'low' ? 'منخفض' : level
  }));

  const interestLevels = stakeholderInterestLevels.map(level => ({ 
    value: level, 
    label: level === 'high' ? 'عالي' :
           level === 'medium' ? 'متوسط' :
           level === 'low' ? 'منخفض' : level
  }));

  const engagementStatuses = generalStatusOptions.map(status => ({ 
    value: status, 
    label: status === 'active' ? 'نشط' :
           status === 'inactive' ? 'غير نشط' :
           status === 'pending' ? 'معلق' : status
  }));

  useEffect(() => {
    if (stakeholder) {
      setFormData({
        name: stakeholder.name || "",
        organization: stakeholder.organization || "",
        position: stakeholder.position || "",
        email: stakeholder.email || "",
        phone: stakeholder.phone || "",
        stakeholder_type: stakeholder.stakeholder_type || "حكومي",
        influence_level: stakeholder.influence_level || "متوسط",
        interest_level: stakeholder.interest_level || "متوسط",
        engagement_status: stakeholder.engagement_status || "محايد",
        notes: stakeholder.notes || "",
      });
    } else {
      setFormData({
        name: "",
        organization: "",
        position: "",
        email: "",
        phone: "",
        stakeholder_type: "حكومي",
        influence_level: "متوسط",
        interest_level: "متوسط",
        engagement_status: "محايد",
        notes: "",
      });
    }
    setErrors({});
  }, [stakeholder, isOpen]);

    const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      // Basic Information validation
      if (!formData.name.trim()) {
        newErrors.name = t('stakeholder_wizard.name_required');
      }
      if (!formData.organization.trim()) {
        newErrors.organization = t('stakeholder_wizard.organization_required');
      }
      if (!formData.position.trim()) {
        newErrors.position = t('stakeholder_wizard.position_required');
      }
    }

    if (step === 1) {
      // Contact Information validation
      if (!formData.email.trim()) {
        newErrors.email = t('stakeholder_wizard.email_required');
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = t('stakeholder_wizard.email_invalid');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<boolean> => {
    if (!validateStep(0) || !validateStep(1)) {
      return false;
    }

    setIsSubmitting(true);

    try {
      const stakeholderData = {
        name: formData.name.trim(),
        organization: formData.organization.trim(),
        position: formData.position.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        stakeholder_type: formData.stakeholder_type,
        influence_level: formData.influence_level,
        interest_level: formData.interest_level,
        engagement_status: formData.engagement_status,
        notes: formData.notes.trim() || null,
      };

      if (stakeholder?.id) {
        // Update existing stakeholder
        const { error } = await supabase
          .from("stakeholders")
          .update(stakeholderData)
          .eq("id", stakeholder.id);

        if (error) throw error;

        toast({
          title: t('stakeholder_wizard.success'),
          description: t('stakeholder_wizard.stakeholder_updated'),
        });
      } else {
        // Create new stakeholder
        const { error } = await supabase
          .from("stakeholders")
          .insert([stakeholderData]);

        if (error) throw error;

        toast({
          title: t('stakeholder_wizard.success'),
          description: t('stakeholder_wizard.stakeholder_created'),
        });
      }

      onSave();
      onClose();
      return true;
    } catch (error) {
      console.error("Error saving stakeholder:", error);
      toast({
        title: t('stakeholder_wizard.error'),
        description: t('stakeholder_wizard.save_failed'),
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    return await handleSubmit();
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const { t } = useTranslation();

  const steps = [
    {
      id: "basic-info",
      title: t('stakeholder_wizard.basic_info'),
      description: t('stakeholder_wizard.basic_info_desc'),
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('stakeholder_wizard.name')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                placeholder={t('stakeholder_wizard.name')}
                className={errors.name ? "border-destructive" : ""}
                dir="rtl"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{t('stakeholder_wizard.name_required')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">{t('stakeholder_wizard.organization')} *</Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => updateFormData("organization", e.target.value)}
                placeholder={t('stakeholder_wizard.organization')}
                className={errors.organization ? "border-destructive" : ""}
                dir="rtl"
              />
              {errors.organization && (
                <p className="text-sm text-destructive">{t('stakeholder_wizard.organization_required')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">{t('stakeholder_wizard.position')} *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => updateFormData("position", e.target.value)}
                placeholder={t('stakeholder_wizard.position')}
                className={errors.position ? "border-destructive" : ""}
                dir="rtl"
              />
              {errors.position && (
                <p className="text-sm text-destructive">{t('stakeholder_wizard.position_required')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stakeholder_type">{t('stakeholder_wizard.stakeholder_type')}</Label>
              <Select
                value={formData.stakeholder_type}
                onValueChange={(value) => updateFormData("stakeholder_type", value)}
              >
                <SelectTrigger id="stakeholder_type">
                  <SelectValue placeholder={t('stakeholder_wizard.select_stakeholder_type')} />
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
          </div>
        </div>
      ),
      validation: () => validateStep(0),
    },
    {
      id: "contact-info",
      title: "معلومات الاتصال",
      description: "أضف تفاصيل الاتصال",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                placeholder="أدخل البريد الإلكتروني"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
                placeholder="أدخل رقم الهاتف (اختياري)"
                dir="rtl"
              />
            </div>
          </div>
        </div>
      ),
      validation: () => validateStep(1),
    },
    {
      id: "engagement-details",
      title: "تفاصيل المشاركة",
      description: "حدد مستويات التأثير والمشاركة",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="influence_level">مستوى التأثير</Label>
              <Select
                value={formData.influence_level}
                onValueChange={(value) => updateFormData("influence_level", value)}
              >
                <SelectTrigger id="influence_level">
                  <SelectValue placeholder="اختر مستوى التأثير" />
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
                onValueChange={(value) => updateFormData("interest_level", value)}
              >
                <SelectTrigger id="interest_level">
                  <SelectValue placeholder="اختر مستوى الاهتمام" />
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

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="engagement_status">حالة المشاركة</Label>
              <Select
                value={formData.engagement_status}
                onValueChange={(value) => updateFormData("engagement_status", value)}
              >
                <SelectTrigger id="engagement_status">
                  <SelectValue placeholder="اختر حالة المشاركة" />
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
      id: "additional-notes",
      title: "ملاحظات إضافية",
      description: "أضف أي معلومات أو ملاحظات إضافية",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateFormData("notes", e.target.value)}
              placeholder="أدخل أي ملاحظات إضافية حول صاحب المصلحة هذا..."
              rows={4}
              className="resize-none"
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
      title={stakeholder ? t('stakeholder_wizard.edit_stakeholder') : t('stakeholder_wizard.add_new_stakeholder')}
      steps={steps}
      onComplete={handleComplete}
    />
  );
}