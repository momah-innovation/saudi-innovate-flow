import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MultiStepForm } from "@/components/ui/multi-step-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useSystemLists } from "@/hooks/useSystemLists";
import { useSettingsManager } from "@/hooks/useSettingsManager";
import { logger } from "@/utils/error-handler";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Team } from "@/types";

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
  const { t } = useUnifiedTranslation();
  const { generalStatusOptions } = useSystemLists();
  const { getSettingValue } = useSettingsManager();
  
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

  interface DepartmentData {
    id: string;
    name?: string;
    name_ar?: string;
  }
  
  interface ManagerData {
    id: string;
    name?: string;
    email?: string;
    position?: string;
    display_name?: string;
    first_name?: string;
    last_name?: string;
  }
  
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [managers, setManagers] = useState<ManagerData[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Team type options from settings
  const teamTypeOptionsData = getSettingValue('team_type_options', []) as string[];
  const teamTypeOptions = teamTypeOptionsData.map(type => ({ 
    value: type.toLowerCase(), 
    label: type 
  }));

  // Status options
  const statusOptions = generalStatusOptions.map(status => ({ 
    value: status, 
    label: status === 'active' ? t('team_wizard.status_active') :
           status === 'inactive' ? t('team_wizard.status_inactive') :
           status === 'disbanded' ? t('team_wizard.status_disbanded') : status
  }));

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (team) {
      setFormData(prev => ({
        ...prev,
        name: team.name || "",
        description: team.description || "",
        department_id: team.department_id || "",
        manager_id: team.manager_id || "",
        max_members: team.max_members || 5,
      }));
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
  }, [team]);

  const fetchData = async () => {
    // Mock data for now to avoid TypeScript recursion issues
    setDepartments([
      { id: '1', name_ar: 'قسم التكنولوجيا', name: 'Technology Department' },
      { id: '2', name_ar: 'قسم الابتكار', name: 'Innovation Department' }
    ]);
    setManagers([
      { id: '1', display_name: 'أحمد محمد', first_name: 'أحمد', last_name: 'محمد' },
      { id: '2', display_name: 'فاطمة علي', first_name: 'فاطمة', last_name: 'علي' }
    ]);
  };

  const validateBasicInfo = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('team_wizard.name_required');
    } else if (formData.name.length < 3) {
      newErrors.name = t('team_wizard.name_min_length');
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = t('team_wizard.description_required');
    } else if (formData.description.length < 20) {
      newErrors.description = t('team_wizard.description_min_length');
    }
    
    if (!formData.type) {
      newErrors.type = t('team_wizard.type_required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDetails = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.status) {
      newErrors.status = t('team_wizard.status_required');
    }
    
    if (!formData.manager_id) {
      newErrors.manager_id = t('team_wizard.manager_required');
    }
    
    if (!formData.max_members || formData.max_members < 2) {
      newErrors.max_members = t('team_wizard.max_members_min');
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
        // Update existing team - placeholder until teams table is created
        logger.info('Update team data', teamData);
        
        toast({
          title: t('team.update_success'),
          description: t('team.update_success_description'),
        });
      } else {
        // Create new team - placeholder until teams table is created  
        logger.info('Create team data', teamData);
        
        toast({
          title: t('team_wizard.create_success'),
          description: t('team_wizard.create_success_description'),
        });
      }

      onSave();
      onClose();
    } catch (error: unknown) {
      logger.error('Failed to save team', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('duplicate')) {
        setErrors({ name: t('team_wizard.duplicate_name_error') });
      } else if (errorMessage.includes('constraint')) {
        setErrors({ general: t('team_wizard.constraint_error') });
      } else {
        toast({
          title: t('team_wizard.error'),
          description: errorMessage || t('team_wizard.save_failed'),
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
      title: t('team_wizard.basic_info'),
      description: t('team_wizard.basic_info_description'),
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
            <Label htmlFor="name">{t('team_wizard.team_name')} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) {
                  setErrors({ ...errors, name: "" });
                }
              }}
              placeholder={t('team_wizard.team_name_placeholder')}
              dir="rtl"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name ? (
              <p className="text-sm text-destructive">{errors.name}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t('team_wizard.name_hint')}
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
                setFormData({ ...formData, type: value as 'functional' | 'project' | 'cross_functional' });
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
                  setFormData({ ...formData, status: value as 'active' | 'inactive' | 'forming' | 'disbanded' });
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
      onComplete={handleSave}
    />
  );
}