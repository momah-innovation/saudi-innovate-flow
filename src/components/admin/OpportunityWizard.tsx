import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MultiStepForm } from "@/components/ui/multi-step-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useSettingsManager } from "@/hooks/useSettingsManager";
import { logger } from "@/utils/error-handler";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Opportunity } from "@/types";

export interface OpportunityFormData {
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  type: 'job' | 'internship' | 'volunteer' | 'partnership' | 'grant' | 'competition';
  status: 'open' | 'closed' | 'on_hold' | 'cancelled';
  department_id?: string;
  contact_person?: string;
  contact_email?: string;
  application_deadline: string;
  start_date?: string;
  end_date?: string;
  required_skills: string[];
  preferred_qualifications: string[];
  location?: string;
  is_remote: boolean;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
}

interface OpportunityWizardProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity?: Opportunity | null;
  onSave: () => void;
}

export function OpportunityWizard({
  isOpen,
  onClose,
  opportunity,
  onSave,
}: OpportunityWizardProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { getSettingValue } = useSettingsManager();
  const generalStatusOptions = getSettingValue('workflow_statuses', []) as string[];
  
  const [formData, setFormData] = useState<OpportunityFormData>({
    title: "",
    description: "",
    requirements: "",
    benefits: "",
    type: "job",
    status: "open",
    department_id: "",
    contact_person: "",
    contact_email: "",
    application_deadline: "",
    start_date: "",
    end_date: "",
    required_skills: [],
    preferred_qualifications: [],
    location: "",
    is_remote: false,
    salary_min: undefined,
    salary_max: undefined,
    currency: "SAR",
  });

  interface DepartmentData {
    id: string;
    name?: string;
    name_ar?: string;
  }
  
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Opportunity type options from settings
  const opportunityTypeOptionsData = getSettingValue('opportunity_type_options', []) as string[];
  const typeOptions = opportunityTypeOptionsData.map(type => ({ 
    value: type.toLowerCase().replace(/[^a-z]/g, ''), 
    label: type 
  }));

  // Status options from settings
  const opportunityStatusOptionsData = getSettingValue('opportunity_status_options', []) as string[];
  const statusOptions = opportunityStatusOptionsData.map(status => ({ 
    value: status.toLowerCase().replace(/[^a-z]/g, ''), 
    label: status 
  }));

  // Currency options from settings
  const currencyOptionsData = getSettingValue('currency_options', []) as string[];
  const currencyOptions = currencyOptionsData.map((currency, index) => {
    const codes = ['SAR', 'USD', 'EUR'];
    return { value: codes[index] || 'SAR', label: currency };
  });

  useEffect(() => {
    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  useEffect(() => {
    if (opportunity) {
      setFormData({
        title: opportunity.title || "",
        description: opportunity.description || "",
        requirements: opportunity.requirements || "",
        benefits: opportunity.benefits || "",
        type: opportunity.type || "job",
        status: opportunity.status || "open",
        department_id: opportunity.department_id || "",
        contact_person: opportunity.contact_person || "",
        contact_email: opportunity.contact_email || "",
        application_deadline: opportunity.application_deadline || "",
        start_date: opportunity.start_date || "",
        end_date: opportunity.end_date || "",
        required_skills: opportunity.required_skills || [],
        preferred_qualifications: opportunity.preferred_qualifications || [],
        location: opportunity.location || "",
        is_remote: opportunity.is_remote || false,
        salary_min: opportunity.salary_min || undefined,
        salary_max: opportunity.salary_max || undefined,
        currency: opportunity.currency || "SAR",
      });
    }
  }, [opportunity, isOpen]);

  const fetchDepartments = async () => {
    // Mock departments for now
    setDepartments([
      { id: '1', name_ar: 'قسم التكنولوجيا', name: 'Technology Department' },
      { id: '2', name_ar: 'قسم الموارد البشرية', name: 'Human Resources Department' },
      { id: '3', name_ar: 'قسم الابتكار', name: 'Innovation Department' }
    ]);
  };

  const validateBasicInfo = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "عنوان الفرصة مطلوب";
    } else if (formData.title.length < 5) {
      newErrors.title = "يجب أن يكون عنوان الفرصة أكثر من 5 أحرف";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "وصف الفرصة مطلوب";
    } else if (formData.description.length < 30) {
      newErrors.description = "يجب أن يكون وصف الفرصة أكثر من 30 حرف";
    }
    
    if (!formData.type) {
      newErrors.type = "نوع الفرصة مطلوب";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateContactInfo = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.application_deadline) {
      newErrors.application_deadline = "موعد انتهاء التقديم مطلوب";
    }
    
    if (formData.contact_email && !/\S+@\S+\.\S+/.test(formData.contact_email)) {
      newErrors.contact_email = "البريد الإلكتروني غير صحيح";
    }
    
    if (formData.salary_min && formData.salary_max && formData.salary_min > formData.salary_max) {
      newErrors.salary_max = "الحد الأقصى للراتب يجب أن يكون أكبر من الحد الأدنى";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setIsLoading(true);
    setErrors({});
    
    try {
      // Mock save operation for now
      logger.info('Saving opportunity', formData);

      // For now, show success since the opportunity table doesn't exist yet
      toast({
        title: t('opportunity.save_success'),
        description: t('opportunity.save_success_description'),
      });

      onSave();
    } catch (error) {
      logger.error('Failed to save opportunity', error);
      
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل في حفظ الفرصة",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    {
      id: "basic-info",
      title: "المعلومات الأساسية",
      description: "أدخل المعلومات الأساسية للفرصة",
      validation: validateBasicInfo,
      content: (
        <div className="space-y-6">
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">عنوان الفرصة *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) {
                  setErrors({ ...errors, title: "" });
                }
              }}
              placeholder="أدخل عنوان الفرصة"
              dir="rtl"
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title ? (
              <p className="text-sm text-destructive">{errors.title}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                عنوان واضح وجذاب للفرصة
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف الفرصة *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) {
                  setErrors({ ...errors, description: "" });
                }
              }}
              placeholder="اكتب وصفاً مفصلاً للفرصة"
              rows={4}
              dir="rtl"
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description ? (
              <p className="text-sm text-destructive">{errors.description}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                وصف شامل يوضح تفاصيل الفرصة
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">نوع الفرصة *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => {
                  setFormData({ ...formData, type: value as OpportunityFormData['type'] });
                  if (errors.type) {
                    setErrors({ ...errors, type: "" });
                  }
                }}
              >
                <SelectTrigger className={errors.type ? "border-destructive" : ""}>
                  <SelectValue placeholder="اختر نوع الفرصة" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive">{errors.type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">حالة الفرصة</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => {
                  setFormData({ ...formData, status: value as OpportunityFormData['status'] });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
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
      id: "details",
      title: "التفاصيل والمتطلبات",
      description: "حدد متطلبات وتفاصيل الفرصة",
      validation: validateContactInfo,
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="requirements">المتطلبات</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              placeholder="أدخل متطلبات الفرصة"
              rows={3}
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="benefits">المزايا</Label>
            <Textarea
              id="benefits"
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              placeholder="أدخل مزايا الفرصة"
              rows={3}
              dir="rtl"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="application_deadline">موعد انتهاء التقديم *</Label>
              <Input
                id="application_deadline"
                type="date"
                value={formData.application_deadline}
                onChange={(e) => {
                  setFormData({ ...formData, application_deadline: e.target.value });
                  if (errors.application_deadline) {
                    setErrors({ ...errors, application_deadline: "" });
                  }
                }}
                className={errors.application_deadline ? "border-destructive" : ""}
              />
              {errors.application_deadline && (
                <p className="text-sm text-destructive">{errors.application_deadline}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department_id">القسم</Label>
              <Select 
                value={formData.department_id} 
                onValueChange={(value) => {
                  setFormData({ ...formData, department_id: value });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر القسم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">بدون قسم محدد</SelectItem>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name_ar || department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_person">الشخص المسؤول</Label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                placeholder="اسم الشخص المسؤول"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email">البريد الإلكتروني للتواصل</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => {
                  setFormData({ ...formData, contact_email: e.target.value });
                  if (errors.contact_email) {
                    setErrors({ ...errors, contact_email: "" });
                  }
                }}
                placeholder="example@domain.com"
                className={errors.contact_email ? "border-destructive" : ""}
              />
              {errors.contact_email && (
                <p className="text-sm text-destructive">{errors.contact_email}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Switch
                id="is_remote"
                checked={formData.is_remote}
                onCheckedChange={(checked) => setFormData({ ...formData, is_remote: checked })}
              />
              <Label htmlFor="is_remote">عمل عن بُعد</Label>
            </div>

            {!formData.is_remote && (
              <div className="space-y-2">
                <Label htmlFor="location">الموقع</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="أدخل موقع العمل"
                  dir="rtl"
                />
              </div>
            )}
          </div>

          {formData.type === 'job' && (
            <div className="space-y-4">
              <Label className="text-base font-medium">نطاق الراتب</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary_min">الحد الأدنى</Label>
                  <Input
                    id="salary_min"
                    type="number"
                    value={formData.salary_min || ''}
                    onChange={(e) => setFormData({ ...formData, salary_min: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary_max">الحد الأقصى</Label>
                  <Input
                    id="salary_max"
                    type="number"
                    value={formData.salary_max || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, salary_max: e.target.value ? Number(e.target.value) : undefined });
                      if (errors.salary_max) {
                        setErrors({ ...errors, salary_max: "" });
                      }
                    }}
                    placeholder="0"
                    min="0"
                    className={errors.salary_max ? "border-destructive" : ""}
                  />
                  {errors.salary_max && (
                    <p className="text-sm text-destructive">{errors.salary_max}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">العملة</Label>
                  <Select 
                    value={formData.currency || 'SAR'} 
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyOptions.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <MultiStepForm
      isOpen={isOpen}
      onClose={onClose}
      title={opportunity ? "تعديل الفرصة" : "فرصة جديدة"}
      steps={steps}
      onComplete={handleSave}
    />
  );
}