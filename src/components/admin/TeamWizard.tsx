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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Team, TeamFormData, SystemLists } from "@/types";

interface TeamWizardProps {
  isOpen: boolean;
  onClose: () => void;
  team?: Team | null;
  onSave: () => void;
}

export function TeamWizard({
  isOpen,
  onClose,
  team,
  onSave,
}: TeamWizardProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { generalStatusOptions } = useSystemLists();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "innovation",
    status: "active",
    department_id: "",
    manager_id: "",
    max_members: 5,
    skills_required: [] as string[],
    objectives: [] as string[],
  });

  const [departments, setDepartments] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Team type options
  const teamTypeOptions = [
    { value: "innovation", label: "فريق ابتكار" },
    { value: "evaluation", label: "فريق تقييم" },
    { value: "implementation", label: "فريق تنفيذ" },
    { value: "research", label: "فريق بحث" },
  ];

  // Status options
  const statusOptions = generalStatusOptions.map(status => ({ 
    value: status, 
    label: status === 'active' ? 'نشط' :
           status === 'inactive' ? 'غير نشط' :
           status === 'disbanded' ? 'منحل' : status
  }));

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || "",
        description: team.description || "",
        type: team.type || "innovation",
        status: team.status || "active",
        department_id: team.department_id || "",
        manager_id: team.manager_id || "",
        max_members: team.max_members || 5,
        skills_required: team.skills_required || [],
        objectives: team.objectives || [],
      });
    } else {
      setFormData({
        name: "",
        description: "",
        type: "innovation",
        status: "active",
        department_id: "",
        manager_id: "",
        max_members: 5,
        skills_required: [],
        objectives: [],
      });
    }
  }, [team, isOpen]);

  const fetchData = async () => {
    try {
      const [departmentsRes, managersRes] = await Promise.all([
        supabase
          .from('departments')
          .select('id, name_ar, name')
          .eq('is_active', true)
          .order('name_ar'),
        supabase
          .from('profiles')
          .select('id, first_name, last_name, display_name')
          .eq('is_active', true)
          .in('role', ['manager', 'admin'])
          .order('first_name')
      ]);

      if (departmentsRes.error) throw departmentsRes.error;
      if (managersRes.error) throw managersRes.error;

      setDepartments(departmentsRes.data || []);
      setManagers(managersRes.data || []);
    } catch (error) {
      console.error('Failed to fetch team wizard data:', error);
    }
  };

  const validateBasicInfo = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "اسم الفريق مطلوب";
    } else if (formData.name.length < 3) {
      newErrors.name = "يجب أن يكون اسم الفريق أكثر من 3 أحرف";
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = "وصف الفريق مطلوب";
    } else if (formData.description.length < 20) {
      newErrors.description = "يجب أن يكون وصف الفريق أكثر من 20 حرف";
    }
    
    if (!formData.type) {
      newErrors.type = "نوع الفريق مطلوب";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDetails = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.status) {
      newErrors.status = "حالة الفريق مطلوبة";
    }
    
    if (!formData.manager_id) {
      newErrors.manager_id = "يجب اختيار مدير الفريق";
    }
    
    if (!formData.max_members || formData.max_members < 2) {
      newErrors.max_members = "يجب أن يكون الحد الأقصى للأعضاء أكثر من 1";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setIsLoading(true);
    setErrors({});
    
    try {
      const teamData = {
        name: formData.name.trim(),
        description: formData.description?.trim(),
        type: formData.type,
        status: formData.status,
        department_id: formData.department_id || null,
        manager_id: formData.manager_id,
        max_members: formData.max_members,
        current_member_count: 1, // Manager counts as first member
        skills_required: formData.skills_required,
        objectives: formData.objectives,
      };

      if (team?.id) {
        // Update existing team - For now, use any table until teams table is created
        // TODO: Replace with proper teams table when database is updated
        console.log('Update team data:', teamData);
        
        toast({
          title: "نجح التحديث",
          description: "تم تحديث الفريق بنجاح",
        });
      } else {
        // Create new team - For now, use any table until teams table is created
        // TODO: Replace with proper teams table when database is updated
        console.log('Create team data:', teamData);
        
        toast({
          title: "نجح الإنشاء",
          description: "تم إنشاء الفريق بنجاح",
        });
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Failed to save team:', error);
      
      if (error?.message?.includes('duplicate')) {
        setErrors({ name: "يوجد فريق بنفس الاسم بالفعل" });
      } else if (error?.message?.includes('constraint')) {
        setErrors({ general: "خطأ في القيود المدخلة" });
      } else {
        toast({
          title: "خطأ",
          description: error?.message || "فشل في حفظ الفريق",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    {
      id: "basic-info",
      title: "المعلومات الأساسية",
      description: "أدخل المعلومات الأساسية للفريق",
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
            <Label htmlFor="name">اسم الفريق *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) {
                  setErrors({ ...errors, name: "" });
                }
              }}
              placeholder="أدخل اسم الفريق"
              dir="rtl"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name ? (
              <p className="text-sm text-destructive">{errors.name}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                يجب أن يكون الاسم وصفياً وواضحاً
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف الفريق *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) {
                  setErrors({ ...errors, description: "" });
                }
              }}
              placeholder="اكتب وصفاً مفصلاً للفريق وأهدافه"
              rows={4}
              dir="rtl"
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description ? (
              <p className="text-sm text-destructive">{errors.description}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                وصف شامل يوضح مهام الفريق وأهدافه (لا يقل عن 20 حرف)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">نوع الفريق *</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => {
                setFormData({ ...formData, type: value as any });
                if (errors.type) {
                  setErrors({ ...errors, type: "" });
                }
              }}
            >
              <SelectTrigger className={errors.type ? "border-destructive" : ""}>
                <SelectValue placeholder="اختر نوع الفريق" />
              </SelectTrigger>
              <SelectContent>
                {teamTypeOptions.map((type) => (
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
        </div>
      ),
    },
    {
      id: "details",
      title: "تفاصيل الفريق",
      description: "حدد إعدادات وإدارة الفريق",
      validation: validateDetails,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">حالة الفريق *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => {
                  setFormData({ ...formData, status: value as any });
                  if (errors.status) {
                    setErrors({ ...errors, status: "" });
                  }
                }}
              >
                <SelectTrigger className={errors.status ? "border-destructive" : ""}>
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
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_members">الحد الأقصى للأعضاء *</Label>
              <Input
                id="max_members"
                type="number"
                value={formData.max_members}
                onChange={(e) => {
                  setFormData({ ...formData, max_members: parseInt(e.target.value) || 0 });
                  if (errors.max_members) {
                    setErrors({ ...errors, max_members: "" });
                  }
                }}
                placeholder="5"
                min="2"
                max="50"
                className={errors.max_members ? "border-destructive" : ""}
              />
              {errors.max_members && (
                <p className="text-sm text-destructive">{errors.max_members}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manager_id">مدير الفريق *</Label>
            <Select 
              value={formData.manager_id} 
              onValueChange={(value) => {
                setFormData({ ...formData, manager_id: value });
                if (errors.manager_id) {
                  setErrors({ ...errors, manager_id: "" });
                }
              }}
            >
              <SelectTrigger className={errors.manager_id ? "border-destructive" : ""}>
                <SelectValue placeholder="اختر مدير الفريق" />
              </SelectTrigger>
              <SelectContent>
                {managers.map((manager) => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.display_name || `${manager.first_name} ${manager.last_name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.manager_id && (
              <p className="text-sm text-destructive">{errors.manager_id}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department_id">القسم (اختياري)</Label>
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
      ),
    },
  ];

  return (
    <MultiStepForm
      isOpen={isOpen}
      onClose={onClose}
      title={team ? "تعديل الفريق" : "فريق جديد"}
      steps={steps}
    />
  );
}