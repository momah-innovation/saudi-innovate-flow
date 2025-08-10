import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useSystemLists } from "@/hooks/useSystemLists";
import { 
  Users, 
  User,
  Settings,
  Trophy,
  CheckCircle,
  AlertCircle,
  Search,
  X
} from "lucide-react";

interface TeamMemberData {
  id?: string;
  user_id: string;
  cic_role: string;
  specialization: string[];
  max_concurrent_projects: number;
  current_workload: number;
  performance_rating: number;
  notes?: string;
  join_date?: string;
}

interface UserProfile {
  id: string;
  name: string;
  name_ar?: string;
  email: string;
  department?: string;
  position?: string;
}

interface TeamMemberWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingMember?: TeamMemberData | null;
  onSuccess: () => void;
}

interface SystemSettings {
  maxConcurrentProjects: number;
  performanceRatingMin: number;
  performanceRatingMax: number;
  performanceRatingStep: number;
}

export function TeamMemberWizard({ 
  open, 
  onOpenChange, 
  editingMember, 
  onSuccess 
}: TeamMemberWizardProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { teamRoleOptions, teamSpecializationOptions } = useSystemLists();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState<TeamMemberData>({
    user_id: "",
    cic_role: "",
    specialization: [],
    max_concurrent_projects: 5,
    current_workload: 0,
    performance_rating: 3.0,
    notes: ""
  });

  // Options and related data
  const [availableUsers, setAvailableUsers] = useState<UserProfile[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    maxConcurrentProjects: 10,
    performanceRatingMin: 1,
    performanceRatingMax: 5,
    performanceRatingStep: 0.5
  });

  // Use system lists for role and specialization options

  // Fetch data when dialog opens
  useEffect(() => {
    if (open) {
      fetchAvailableUsers();
      fetchSystemSettings();
      if (editingMember) {
        loadMemberData();
      } else {
        resetForm();
      }
    }
  }, [open, editingMember]);

  const fetchAvailableUsers = async () => {
    try {
      // First get all team member user IDs
      const { data: teamMembers } = await supabase
        .from('innovation_team_members')
        .select('user_id');
      
      const teamMemberIds = teamMembers?.map(member => member.user_id).filter(Boolean) || [];
      
      // Get users who are not already team members
      const query = supabase
        .from('profiles')
        .select('id, name, email, department, position')
        .order('name');
      
      // Only apply the filter if there are team members
      const { data, error } = teamMemberIds.length > 0 
        ? await query.not('id', 'in', `(${teamMemberIds.join(',')})`)
        : await query;

      if (error) throw error;
      setAvailableUsers(data || []);
    } catch (error) {
      // Failed to fetch team member wizard users
      toast({
        title: "خطأ",
        description: t('errors.failed_to_load_users_list', 'فشل في تحميل قائمة المستخدمين'),
        variant: "destructive"
      });
    }
  };

  const fetchSystemSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_key, setting_value')
        .in('setting_key', [
          'team_max_concurrent_projects',
          'team_performance_rating_min', 
          'team_performance_rating_max',
          'team_performance_rating_step',
          'team_default_concurrent_projects',
          'team_default_performance_rating'
        ]);

      if (error) throw error;

      const settings = data?.reduce((acc, item) => {
        acc[item.setting_key] = parseFloat(String(item.setting_value)) || 0;
        return acc;
      }, {} as Record<string, number>) || {};

      setSystemSettings({
        maxConcurrentProjects: settings.team_max_concurrent_projects || 10,
        performanceRatingMin: settings.team_performance_rating_min || 1,
        performanceRatingMax: settings.team_performance_rating_max || 5,
        performanceRatingStep: settings.team_performance_rating_step || 0.5
      });

      // Update form defaults with system settings
      if (!editingMember) {
        setFormData(prev => ({
          ...prev,
          max_concurrent_projects: settings.team_default_concurrent_projects || 5,
          performance_rating: settings.team_default_performance_rating || 3.0
        }));
      }
    } catch (error) {
      // Failed to fetch system settings - using defaults
    }
  };

  const loadMemberData = () => {
    if (editingMember) {
      setFormData({
        id: editingMember.id,
        user_id: editingMember.user_id,
        cic_role: editingMember.cic_role,
        specialization: editingMember.specialization,
        max_concurrent_projects: editingMember.max_concurrent_projects,
        current_workload: editingMember.current_workload,
        performance_rating: editingMember.performance_rating,
        notes: editingMember.notes || ""
      });
      
      // Set user search term to show selected user
      const selectedUser = availableUsers.find(u => u.id === editingMember.user_id);
      if (selectedUser) {
        setUserSearchTerm(selectedUser.name);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      user_id: "",
      cic_role: "",
      specialization: [],
      max_concurrent_projects: 5,
      current_workload: 0,
      performance_rating: 3.0,
      notes: ""
    });
    setUserSearchTerm("");
    setCurrentStep(0);
  };

  const filteredUsers = availableUsers.filter(user => 
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // User Selection
        if (!editingMember && !formData.user_id) {
          toast({
            title: t('team_member_wizard.validation_error', 'خطأ في التحقق'),
            description: t('team_member_wizard.user_selection_required', 'يرجى اختيار مستخدم'),
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 1: // Role and Specialization
        if (!formData.cic_role) {
          toast({
            title: t('team_member_wizard.validation_error', 'خطأ في التحقق'),
            description: t('team_member_wizard.role_selection_required', 'يرجى اختيار الدور في فريق الابتكار'),
            variant: "destructive"
          });
          return false;
        }
        if (formData.specialization.length === 0) {
          toast({
            title: "خطأ في التحقق",
            description: "يرجى اختيار تخصص واحد على الأقل",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 2: // Capacity and Performance
        if (formData.max_concurrent_projects < 1 || formData.max_concurrent_projects > systemSettings.maxConcurrentProjects) {
          toast({
            title: "خطأ في التحقق",
            description: `الحد الأقصى للمشاريع يجب أن يكون بين 1 و ${systemSettings.maxConcurrentProjects}`,
            variant: "destructive"
          });
          return false;
        }
        if (formData.performance_rating < systemSettings.performanceRatingMin || formData.performance_rating > systemSettings.performanceRatingMax) {
          toast({
            title: "خطأ في التحقق",
            description: `تقييم الأداء يجب أن يكون بين ${systemSettings.performanceRatingMin} و ${systemSettings.performanceRatingMax}`,
            variant: "destructive"
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const memberData = {
        user_id: formData.user_id,
        cic_role: formData.cic_role,
        specialization: formData.specialization,
        max_concurrent_projects: formData.max_concurrent_projects,
        current_workload: formData.current_workload,
        performance_rating: formData.performance_rating,
        notes: formData.notes
      };

      if (editingMember?.id) {
        // Update existing member
        const { error } = await supabase
          .from('innovation_team_members')
          .update(memberData)
          .eq('id', editingMember.id);

        if (error) throw error;

        toast({
          title: t('team_wizard.update_success_title'),
          description: t('team_wizard.update_success_description')
        });
      } else {
        // Add new member
        const { error } = await supabase
          .from('innovation_team_members')
          .insert([memberData]);

        if (error) throw error;

        toast({
          title: t('success.add_successful'),
          description: t('success.member_added')
        });
      }

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      // Failed to save team member
      toast({
        title: "خطأ",
        description: t('errors.failed_to_save_team_member', 'فشل في حفظ بيانات عضو الفريق'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: editingMember ? t('team_member_wizard.member_info', 'معلومات العضو') : t('team_member_wizard.user_selection', 'اختيار المستخدم'),
      description: editingMember ? "مراجعة معلومات العضو الأساسية" : "البحث عن المستخدم وإضافته إلى الفريق",
      icon: <User className="w-5 h-5" />
    },
    {
      title: t('team_member_wizard.role_specialization', 'الدور والتخصص'),
      description: t('team_member_wizard.role_specialization_desc', 'تحديد دور العضو وتخصصاته في فريق الابتكار'),
      icon: <Settings className="w-5 h-5" />
    },
    {
      title: "القدرة والأداء",
      description: "تحديد قدرة العمل وتقييم الأداء",
      icon: <Trophy className="w-5 h-5" />
    }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            {!editingMember ? (
              <div className="space-y-2">
                <Label>البحث عن مستخدم</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                {userSearchTerm && (
                  <div className="max-h-48 overflow-y-auto border rounded-md bg-background">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className={`p-3 cursor-pointer hover:bg-muted ${
                            formData.user_id === user.id ? 'bg-muted' : ''
                          }`}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, user_id: user.id }));
                            setUserSearchTerm(user.name);
                          }}
                        >
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          {user.department && (
                            <div className="text-xs text-muted-foreground">{user.department} - {user.position}</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-muted-foreground">
                        {t('search.no_matching_results', 'لا توجد نتائج مطابقة')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-8 h-8 text-primary" />
                      <div>
                        <h3 className="font-medium">
                          {availableUsers.find(u => u.id === formData.user_id)?.name || t('common.not_specified', 'غير محدد')}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {availableUsers.find(u => u.id === formData.user_id)?.email || t('common.not_specified', 'غير محدد')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>الدور في فريق الابتكار</Label>
              <Select
                value={formData.cic_role}
                onValueChange={(value) => setFormData(prev => ({ ...prev, cic_role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('team_member_wizard.select_role', 'اختر الدور')} />
                </SelectTrigger>
                <SelectContent>
                  {teamRoleOptions.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>التخصصات (يمكن اختيار أكثر من تخصص)</Label>
              <div className="flex flex-wrap gap-2">
                {teamSpecializationOptions.map((spec) => (
                  <Badge
                    key={spec}
                    variant={formData.specialization.includes(spec) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        specialization: prev.specialization.includes(spec)
                          ? prev.specialization.filter(s => s !== spec)
                          : [...prev.specialization, spec]
                      }));
                    }}
                  >
                    {spec}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                التخصصات المختارة: {formData.specialization.length}
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>الحد الأقصى للمشاريع المتزامنة</Label>
                <Input
                  type="number"
                  value={formData.max_concurrent_projects}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    max_concurrent_projects: parseInt(e.target.value) || 5 
                  }))}
                  min="1"
                  max={systemSettings.maxConcurrentProjects}
                />
                <p className="text-xs text-muted-foreground">
                  الحد الأقصى: {systemSettings.maxConcurrentProjects} مشروع
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>عبء العمل الحالي</Label>
                <Input
                  type="number"
                  value={formData.current_workload}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    current_workload: parseInt(e.target.value) || 0 
                  }))}
                  min="0"
                  max={formData.max_concurrent_projects}
                />
                <p className="text-xs text-muted-foreground">
                  {t('team_member_wizard.active_projects_currently', 'المشاريع النشطة حالياً')}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>تقييم الأداء</Label>
              <Input
                type="number"
                value={formData.performance_rating}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  performance_rating: parseFloat(e.target.value) || 0 
                }))}
                min={systemSettings.performanceRatingMin}
                max={systemSettings.performanceRatingMax}
                step={systemSettings.performanceRatingStep.toString()}
              />
              <p className="text-xs text-muted-foreground">
                من {systemSettings.performanceRatingMin} إلى {systemSettings.performanceRatingMax} بخطوات {systemSettings.performanceRatingStep}
              </p>
            </div>

            <div className="space-y-2">
              <Label>ملاحظات إضافية (اختياري)</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="أي ملاحظات أو تفاصيل إضافية حول العضو..."
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {editingMember ? t('team_member_wizard.edit_team_member', 'تعديل عضو الفريق') : t('team_member_wizard.add_team_member', 'إضافة عضو فريق جديد')}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                index <= currentStep 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-muted bg-background'
              }`}>
                {index < currentStep ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  step.icon
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`h-px w-16 mx-2 ${
                  index < currentStep ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold">{steps[currentStep].title}</h3>
            <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
          </div>

          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            السابق
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button 
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? (
                t('team_member_wizard.saving', 'جاري الحفظ...')
              ) : currentStep === steps.length - 1 ? (
                editingMember ? t('team_member_wizard.update_member', 'تحديث العضو') : t('team_member_wizard.add_member', 'إضافة العضو')
              ) : (
                t('team_member_wizard.next', 'التالي')
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}