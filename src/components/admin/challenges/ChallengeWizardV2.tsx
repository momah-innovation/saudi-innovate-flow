import { useState, useEffect } from 'react';
import { MultiStepForm } from '@/components/ui/multi-step-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X, Plus, Users, Target, Building, Zap, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSystemLists } from "@/hooks/useSystemLists";
import type { Challenge, Department, Deputy, Sector, Domain, SubDomain, Service, Partner, Expert, FocusQuestion } from "@/types";
import { useRTLAware } from '@/hooks/useRTLAware';

interface ChallengeFormData {
  id?: string;
  title_ar: string;
  description_ar: string;
  status: string;
  priority_level: string;
  sensitivity_level: string;
  challenge_type: string;
  start_date: string;
  end_date: string;
  estimated_budget: number;
  actual_budget: number;
  vision_2030_goal: string;
  kpi_alignment: string;
  collaboration_details: string;
  internal_team_notes: string;
  challenge_owner_id: string;
  assigned_expert_id: string;
  partner_organization_id: string;
  department_id: string;
  deputy_id: string;
  sector_id: string;
  domain_id: string;
  sub_domain_id: string;
  service_id: string;
}

interface ChallengeWizardV2Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  challenge?: ChallengeFormData | null;
}

interface SystemLists {
  departments: any[];
  deputies: any[];
  sectors: any[];
  domains: any[];
  subDomains: any[];
  services: any[];
  partners: any[];
  experts: any[];
  focusQuestions: any[];
}

export function ChallengeWizardV2({ isOpen, onClose, onSuccess, challenge }: ChallengeWizardV2Props) {
  const { toast } = useToast();
  const { challengeStatusOptions, challengePriorityLevels, challengeSensitivityLevels, challengeTypes } = useSystemLists();
  const [loading, setLoading] = useState(false);
  const [systemLists, setSystemLists] = useState<SystemLists>({
    departments: [],
    deputies: [],
    sectors: [],
    domains: [],
    subDomains: [],
    services: [],
    partners: [],
    experts: [],
    focusQuestions: []
  });

  const [formData, setFormData] = useState<ChallengeFormData>({
    title_ar: '',
    description_ar: '',
    status: 'draft',
    priority_level: 'medium',
    sensitivity_level: 'normal',
    challenge_type: '',
    start_date: '',
    end_date: '',
    estimated_budget: 0,
    actual_budget: 0,
    vision_2030_goal: '',
    kpi_alignment: '',
    collaboration_details: '',
    internal_team_notes: '',
    challenge_owner_id: '',
    assigned_expert_id: '',
    partner_organization_id: '',
    department_id: '',
    deputy_id: '',
    sector_id: '',
    domain_id: '',
    sub_domain_id: '',
    service_id: ''
  });

  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [selectedExperts, setSelectedExperts] = useState<string[]>([]);
  const [selectedFocusQuestions, setSelectedFocusQuestions] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  useEffect(() => {
    if (isOpen) {
      loadSystemLists();
      if (challenge) {
        setFormData({
          ...challenge,
          start_date: challenge.start_date || '',
          end_date: challenge.end_date || ''
        });
        if (challenge.start_date) setStartDate(new Date(challenge.start_date));
        if (challenge.end_date) setEndDate(new Date(challenge.end_date));
      } else {
        resetForm();
      }
    }
  }, [isOpen, challenge]);

  const loadSystemLists = async () => {
    try {
      const [
        departmentsRes,
        deputiesRes,
        sectorsRes,
        domainsRes,
        subDomainsRes,
        servicesRes,
        partnersRes,
        expertsRes,
        focusQuestionsRes
      ] = await Promise.all([
        supabase.from('departments').select('*').order('name_ar'),
        supabase.from('deputies').select('*').order('name_ar'),
        supabase.from('sectors').select('*').order('name_ar'),
        supabase.from('domains').select('*').order('name_ar'),
        supabase.from('sub_domains').select('*').order('name_ar'),
        supabase.from('services').select('*').order('name_ar'),
        supabase.from('partners').select('*').order('name_ar'),
        supabase.from('experts').select('id, user_id, expertise_areas').order('created_at'),
        supabase.from('focus_questions').select('*').order('order_sequence')
      ]);

      setSystemLists({
        departments: departmentsRes.data || [],
        deputies: deputiesRes.data || [],
        sectors: sectorsRes.data || [],
        domains: domainsRes.data || [],
        subDomains: subDomainsRes.data || [],
        services: servicesRes.data || [],
        partners: partnersRes.data || [],
        experts: expertsRes.data || [],
        focusQuestions: focusQuestionsRes.data || []
      });
    } catch (error) {
      console.error('خطأ في تحميل القوائم:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title_ar: '',
      description_ar: '',
      status: 'draft',
      priority_level: 'medium',
      sensitivity_level: 'normal',
      challenge_type: '',
      start_date: '',
      end_date: '',
      estimated_budget: 0,
      actual_budget: 0,
      vision_2030_goal: '',
      kpi_alignment: '',
      collaboration_details: '',
      internal_team_notes: '',
      challenge_owner_id: '',
      assigned_expert_id: '',
      partner_organization_id: '',
      department_id: '',
      deputy_id: '',
      sector_id: '',
      domain_id: '',
      sub_domain_id: '',
      service_id: ''
    });
    setSelectedPartners([]);
    setSelectedExperts([]);
    setSelectedFocusQuestions([]);
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const updateFormData = (field: keyof ChallengeFormData, value: string | number | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = async (stepId: string): Promise<boolean> => {
    switch (stepId) {
      case 'basic':
        if (!formData.title_ar.trim()) {
          toast({
            title: 'خطأ في التحقق',
            description: 'يرجى إدخال عنوان التحدي',
            variant: 'destructive'
          });
          return false;
        }
        if (!formData.description_ar.trim()) {
          toast({
            title: 'خطأ في التحقق',
            description: 'يرجى إدخال وصف التحدي',
            variant: 'destructive'
          });
          return false;
        }
        return true;
      case 'organizational':
        return true;
      case 'timeline':
        if (startDate && endDate && startDate >= endDate) {
          toast({
            title: 'خطأ في التحقق',
            description: 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية',
            variant: 'destructive'
          });
          return false;
        }
        return true;
      case 'collaboration':
        return true;
      case 'review':
        return true;
      default:
        return true;
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const challengeData = {
        ...formData,
        start_date: startDate ? startDate.toISOString().split('T')[0] : null,
        end_date: endDate ? endDate.toISOString().split('T')[0] : null,
        estimated_budget: Number(formData.estimated_budget) || 0,
        actual_budget: Number(formData.actual_budget) || 0
      };

      if (challenge?.id) {
        const { error } = await supabase
          .from('challenges')
          .update(challengeData)
          .eq('id', challenge.id);

        if (error) throw error;

        toast({
          title: 'تم التحديث بنجاح',
          description: 'تم تحديث التحدي بنجاح'
        });
      } else {
        const { data, error } = await supabase
          .from('challenges')
          .insert([challengeData])
          .select()
          .single();

        if (error) throw error;

        // Add related entities
        if (selectedExperts.length > 0 && data) {
          const expertLinks = selectedExperts.map(expertId => ({
            challenge_id: data.id,
            expert_id: expertId,
            role_type: 'evaluator',
            status: 'active'
          }));
          await supabase.from('challenge_experts').insert(expertLinks);
        }

        if (selectedPartners.length > 0 && data) {
          const partnerLinks = selectedPartners.map(partnerId => ({
            challenge_id: data.id,
            partner_id: partnerId,
            partnership_type: 'collaborator',
            status: 'active'
          }));
          await supabase.from('challenge_partners').insert(partnerLinks);
        }

        toast({
          title: 'تم الإنشاء بنجاح',
          description: 'تم إنشاء التحدي بنجاح'
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('خطأ في حفظ التحدي:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في حفظ التحدي. يرجى المحاولة مرة أخرى.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      id: 'basic',
      title: 'المعلومات الأساسية',
      description: 'عنوان ووصف التحدي',
      validation: () => validateStep('basic'),
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                تفاصيل التحدي
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title_ar">عنوان التحدي *</Label>
                <Input
                  id="title_ar"
                  value={formData.title_ar}
                  onChange={(e) => updateFormData('title_ar', e.target.value)}
                  placeholder="أدخل عنوان التحدي باللغة العربية"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description_ar">وصف التحدي *</Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) => updateFormData('description_ar', e.target.value)}
                  placeholder="أدخل وصف مفصل للتحدي باللغة العربية"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenge_type">نوع التحدي</Label>
                <Select value={formData.challenge_type} onValueChange={(value) => updateFormData('challenge_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع التحدي" />
                  </SelectTrigger>
                  <SelectContent>
                    {challengeTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type === 'technology' ? 'تقني' : type === 'sustainability' ? 'استدامة' : type === 'healthcare' ? 'رعاية صحية' : 
                         type === 'education' ? 'تعليم' : type === 'governance' ? 'حوكمة' : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                الأولوية والحساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">حالة التحدي</Label>
                  <Select value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر حالة التحدي" />
                    </SelectTrigger>
                    <SelectContent>
                      {challengeStatusOptions.map(status => (
                        <SelectItem key={status} value={status}>
                          {status === 'draft' ? 'مسودة' : status === 'published' ? 'منشور' : status === 'active' ? 'نشط' : 
                           status === 'closed' ? 'مغلق' : status === 'archived' ? 'مؤرشف' : status === 'completed' ? 'مكتمل' : status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority_level">مستوى الأولوية</Label>
                  <Select value={formData.priority_level} onValueChange={(value) => updateFormData('priority_level', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر مستوى الأولوية" />
                    </SelectTrigger>
                    <SelectContent>
                      {challengePriorityLevels.map(priority => (
                        <SelectItem key={priority} value={priority}>
                          {priority === 'low' ? 'منخفض' : priority === 'medium' ? 'متوسط' : 'عالي'}
                        </SelectItem>
                      ))}
                      {/* No hardcoded urgent option - using priorityLevels from system lists */}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sensitivity_level">مستوى السرية</Label>
                <Select value={formData.sensitivity_level} onValueChange={(value) => updateFormData('sensitivity_level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مستوى السرية" />
                  </SelectTrigger>
                  <SelectContent>
                    {challengeSensitivityLevels.map(level => (
                      <SelectItem key={level} value={level}>
                        {level === 'normal' ? 'عادي - وصول عام' : level === 'sensitive' ? 'حساس - أعضاء الفريق فقط' : 'سري - المدراء فقط'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'organizational',
      title: 'الهيكل التنظيمي',
      description: 'ربط التحدي بالجهات والإدارات',
      validation: () => validateStep('organizational'),
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                التصنيف التنظيمي
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sector_id">القطاع</Label>
                  <Select value={formData.sector_id} onValueChange={(value) => updateFormData('sector_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القطاع" />
                    </SelectTrigger>
                    <SelectContent>
                      {systemLists.sectors.map((sector) => (
                        <SelectItem key={sector.id} value={sector.id}>
                          {sector.name_ar || sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deputy_id">الوكالة</Label>
                  <Select value={formData.deputy_id} onValueChange={(value) => updateFormData('deputy_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الوكالة" />
                    </SelectTrigger>
                    <SelectContent>
                      {systemLists.deputies.map((deputy) => (
                        <SelectItem key={deputy.id} value={deputy.id}>
                          {deputy.name_ar || deputy.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department_id">الإدارة</Label>
                  <Select value={formData.department_id} onValueChange={(value) => updateFormData('department_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الإدارة" />
                    </SelectTrigger>
                    <SelectContent>
                      {systemLists.departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name_ar || dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain_id">المجال</Label>
                  <Select value={formData.domain_id} onValueChange={(value) => updateFormData('domain_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المجال" />
                    </SelectTrigger>
                    <SelectContent>
                      {systemLists.domains.map((domain) => (
                        <SelectItem key={domain.id} value={domain.id}>
                          {domain.name_ar || domain.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'timeline',
      title: 'الجدولة والميزانية',
      description: 'التواريخ والموارد المالية',
      validation: () => validateStep('timeline'),
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الجدولة الزمنية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>تاريخ البداية</Label>
                   <Popover>
                     <PopoverTrigger asChild>
                       <Button
                         variant="outline"
                         className="w-full justify-start font-normal text-right"
                       >
                          <CalendarIcon className={`${me('2')} h-4 w-4`} />
                         {startDate ? format(startDate, "PPP", { locale: ar }) : <span>اختر التاريخ</span>}
                       </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>تاريخ النهاية</Label>
                   <Popover>
                     <PopoverTrigger asChild>
                       <Button
                         variant="outline"
                         className="w-full justify-start font-normal text-right"
                       >
                         <CalendarIcon className={`${me('2')} h-4 w-4`} />
                         {endDate ? format(endDate, "PPP", { locale: ar }) : <span>اختر التاريخ</span>}
                       </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>الميزانية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimated_budget">الميزانية المقدرة (ريال)</Label>
                  <Input
                    id="estimated_budget"
                    type="number"
                    value={formData.estimated_budget}
                    onChange={(e) => updateFormData('estimated_budget', Number(e.target.value))}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actual_budget">الميزانية الفعلية (ريال)</Label>
                  <Input
                    id="actual_budget"
                    type="number"
                    value={formData.actual_budget}
                    onChange={(e) => updateFormData('actual_budget', Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>رؤية 2030</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vision_2030_goal">هدف رؤية 2030</Label>
                <Textarea
                  id="vision_2030_goal"
                  value={formData.vision_2030_goal}
                  onChange={(e) => updateFormData('vision_2030_goal', e.target.value)}
                  placeholder="كيف يساهم هذا التحدي في تحقيق أهداف رؤية 2030؟"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kpi_alignment">مؤشرات الأداء</Label>
                <Textarea
                  id="kpi_alignment"
                  value={formData.kpi_alignment}
                  onChange={(e) => updateFormData('kpi_alignment', e.target.value)}
                  placeholder="مؤشرات الأداء المرتبطة بهذا التحدي"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'collaboration',
      title: 'التعاون والشراكات',
      description: 'الخبراء والشركاء والأسئلة المحورية',
      validation: () => validateStep('collaboration'),
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                الخبراء والشركاء
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>الخبراء المعينون</Label>
                <div className="space-y-2">
                  {systemLists.experts.map((expert) => (
                    <div key={expert.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`expert-${expert.id}`}
                        checked={selectedExperts.includes(expert.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedExperts(prev => [...prev, expert.id]);
                          } else {
                            setSelectedExperts(prev => prev.filter(id => id !== expert.id));
                          }
                        }}
                      />
                      <Label htmlFor={`expert-${expert.id}`} className="text-sm">
                        {expert.expertise_areas?.join(', ') || 'خبير'}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>الشركاء</Label>
                <div className="space-y-2">
                  {systemLists.partners.map((partner) => (
                    <div key={partner.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`partner-${partner.id}`}
                        checked={selectedPartners.includes(partner.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPartners(prev => [...prev, partner.id]);
                          } else {
                            setSelectedPartners(prev => prev.filter(id => id !== partner.id));
                          }
                        }}
                      />
                      <Label htmlFor={`partner-${partner.id}`} className="text-sm">
                        {partner.name_ar || partner.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="collaboration_details">تفاصيل التعاون</Label>
                <Textarea
                  id="collaboration_details"
                  value={formData.collaboration_details}
                  onChange={(e) => updateFormData('collaboration_details', e.target.value)}
                  placeholder="تفاصيل إضافية حول التعاون والشراكات"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="internal_team_notes">ملاحظات الفريق الداخلي</Label>
                <Textarea
                  id="internal_team_notes"
                  value={formData.internal_team_notes}
                  onChange={(e) => updateFormData('internal_team_notes', e.target.value)}
                  placeholder="ملاحظات خاصة بالفريق الداخلي"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'review',
      title: 'مراجعة وتأكيد',
      description: 'مراجعة جميع المعلومات قبل الحفظ',
      validation: () => validateStep('review'),
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                ملخص التحدي
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">العنوان</Label>
                  <p className="font-medium">{formData.title_ar}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">النوع</Label>
                  <p className="font-medium">{formData.challenge_type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">الحالة</Label>
                  <Badge variant="outline">{formData.status}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">الأولوية</Label>
                  <Badge variant="outline">{formData.priority_level}</Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">الوصف</Label>
                <p className="text-sm">{formData.description_ar}</p>
              </div>

              {(startDate || endDate) && (
                <div className="grid grid-cols-2 gap-4">
                  {startDate && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">تاريخ البداية</Label>
                      <p className="font-medium">{format(startDate, "PPP")}</p>
                    </div>
                  )}
                  {endDate && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">تاريخ النهاية</Label>
                      <p className="font-medium">{format(endDate, "PPP")}</p>
                    </div>
                  )}
                </div>
              )}

              {(formData.estimated_budget > 0 || formData.actual_budget > 0) && (
                <div className="grid grid-cols-2 gap-4">
                  {formData.estimated_budget > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">الميزانية المقدرة</Label>
                      <p className="font-medium">{formData.estimated_budget.toLocaleString()} ريال</p>
                    </div>
                  )}
                  {formData.actual_budget > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">الميزانية الفعلية</Label>
                      <p className="font-medium">{formData.actual_budget.toLocaleString()} ريال</p>
                    </div>
                  )}
                </div>
              )}

              {selectedExperts.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">الخبراء المعينون</Label>
                  <p className="text-sm">{selectedExperts.length} خبير</p>
                </div>
              )}

              {selectedPartners.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">الشركاء</Label>
                  <p className="text-sm">{selectedPartners.length} شريك</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <MultiStepForm
      isOpen={isOpen}
      onClose={onClose}
      title={challenge ? 'تعديل التحدي' : 'إنشاء تحدي جديد'}
      steps={steps}
      onComplete={handleComplete}
      showProgress={true}
      allowSkip={false}
    />
  );
}