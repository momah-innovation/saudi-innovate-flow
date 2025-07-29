import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MultiStepForm } from '@/components/ui/multi-step-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSystemLists } from "@/hooks/useSystemLists";

interface Challenge {
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

interface ChallengeWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  challenge?: Challenge | null;
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
}

export function ChallengeWizard({ isOpen, onClose, onSuccess, challenge }: ChallengeWizardProps) {
  const { toast } = useToast();
  const { challengeStatusOptions, challengePriorityLevels, challengeSensitivityLevels } = useSystemLists();
  const form = useForm<Challenge>();
  const [loading, setLoading] = useState(false);
  const [systemLists, setSystemLists] = useState<SystemLists>({
    departments: [],
    deputies: [],
    sectors: [],
    domains: [],
    subDomains: [],
    services: [],
    partners: [],
    experts: []
  });

  const [formData, setFormData] = useState<Challenge>({
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

  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [selectedExperts, setSelectedExperts] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadSystemLists();
      if (challenge) {
        setFormData({
          ...challenge,
          start_date: challenge.start_date || '',
          end_date: challenge.end_date || ''
        });
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
        expertsRes
      ] = await Promise.all([
        supabase.from('departments').select('*').order('name_ar'),
        supabase.from('deputies').select('*').order('name_ar'),
        supabase.from('sectors').select('*').order('name_ar'),
        supabase.from('domains').select('*').order('name_ar'),
        supabase.from('sub_domains').select('*').order('name_ar'),
        supabase.from('services').select('*').order('name_ar'),
        supabase.from('partners').select('*').order('name_ar'),
        supabase.from('experts').select('id, user_id, expertise_areas').order('created_at')
      ]);

      setSystemLists({
        departments: departmentsRes.data || [],
        deputies: deputiesRes.data || [],
        sectors: sectorsRes.data || [],
        domains: domainsRes.data || [],
        subDomains: subDomainsRes.data || [],
        services: servicesRes.data || [],
        partners: partnersRes.data || [],
        experts: expertsRes.data || []
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
    setSelectedRequirements([]);
    setSelectedPartners([]);
    setSelectedExperts([]);
  };

  const updateFormData = (field: keyof Challenge, value: any) => {
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
      case 'technical':
        return true;
      case 'relationships':
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
        estimated_budget: Number(formData.estimated_budget) || 0,
        actual_budget: Number(formData.actual_budget) || 0
      };

      if (challenge?.id) {
        // تحديث التحدي الموجود
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
        // إنشاء تحدي جديد
        const { data, error } = await supabase
          .from('challenges')
          .insert([challengeData])
          .select()
          .single();

        if (error) throw error;

        // إضافة الخبراء المختارين
        if (selectedExperts.length > 0 && data) {
          const expertLinks = selectedExperts.map(expertId => ({
            challenge_id: data.id,
            expert_id: expertId,
            role_type: 'evaluator',
            status: 'active'
          }));

          await supabase.from('challenge_experts').insert(expertLinks);
        }

        // إضافة الشركاء المختارين
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
        <div className="space-y-4">
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

          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="challenge_type">نوع التحدي</Label>
              <Input
                id="challenge_type"
                value={formData.challenge_type}
                onChange={(e) => updateFormData('challenge_type', e.target.value)}
                placeholder="مثل: تقني، إداري، إبداعي"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'organizational',
      title: 'الهيكل التنظيمي',
      description: 'ربط التحدي بالجهات والإدارات',
      validation: () => validateStep('organizational'),
      content: (
        <div className="space-y-4">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sub_domain_id">المجال الفرعي</Label>
              <Select value={formData.sub_domain_id} onValueChange={(value) => updateFormData('sub_domain_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المجال الفرعي" />
                </SelectTrigger>
                <SelectContent>
                  {systemLists.subDomains.map((subDomain) => (
                    <SelectItem key={subDomain.id} value={subDomain.id}>
                      {subDomain.name_ar || subDomain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service_id">الخدمة</Label>
              <Select value={formData.service_id} onValueChange={(value) => updateFormData('service_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الخدمة" />
                </SelectTrigger>
                <SelectContent>
                  {systemLists.services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name_ar || service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'technical',
      title: 'التفاصيل التقنية',
      description: 'المواعيد والميزانية والمواصفات',
      validation: () => validateStep('technical'),
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">تاريخ البداية</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => updateFormData('start_date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">تاريخ النهاية</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => updateFormData('end_date', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimated_budget">الميزانية المقدرة (ريال)</Label>
              <Input
                id="estimated_budget"
                type="number"
                min="0"
                value={formData.estimated_budget}
                onChange={(e) => updateFormData('estimated_budget', parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actual_budget">الميزانية الفعلية (ريال)</Label>
              <Input
                id="actual_budget"
                type="number"
                min="0"
                value={formData.actual_budget}
                onChange={(e) => updateFormData('actual_budget', parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

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
            <Label htmlFor="kpi_alignment">مؤشرات الأداء المرتبطة</Label>
            <Textarea
              id="kpi_alignment"
              value={formData.kpi_alignment}
              onChange={(e) => updateFormData('kpi_alignment', e.target.value)}
              placeholder="مؤشرات الأداء الرئيسية المتأثرة بهذا التحدي"
              rows={3}
            />
          </div>
        </div>
      )
    },
    {
      id: 'relationships',
      title: 'العلاقات والتعاون',
      description: 'الشركاء والخبراء والتعاون',
      validation: () => validateStep('relationships'),
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>الشركاء المشاركون</Label>
            <div className="border rounded-lg p-4 max-h-32 overflow-y-auto">
              {systemLists.partners.map((partner) => (
                <div key={partner.id} className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={`partner-${partner.id}`}
                    checked={selectedPartners.includes(partner.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPartners([...selectedPartners, partner.id]);
                      } else {
                        setSelectedPartners(selectedPartners.filter(id => id !== partner.id));
                      }
                    }}
                  />
                  <Label htmlFor={`partner-${partner.id}`} className="text-sm">
                    {partner.name_ar || partner.name}
                  </Label>
                </div>
              ))}
            </div>
            {selectedPartners.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedPartners.map((partnerId) => {
                  const partner = systemLists.partners.find(p => p.id === partnerId);
                  return (
                    <Badge key={partnerId} variant="secondary" className="flex items-center gap-1">
                      {partner?.name_ar || partner?.name}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setSelectedPartners(selectedPartners.filter(id => id !== partnerId))}
                      />
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>الخبراء المعينون</Label>
            <div className="border rounded-lg p-4 max-h-32 overflow-y-auto">
              {systemLists.experts.map((expert) => (
                <div key={expert.id} className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={`expert-${expert.id}`}
                    checked={selectedExperts.includes(expert.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedExperts([...selectedExperts, expert.id]);
                      } else {
                        setSelectedExperts(selectedExperts.filter(id => id !== expert.id));
                      }
                    }}
                  />
                  <Label htmlFor={`expert-${expert.id}`} className="text-sm">
                    خبير - {expert.expertise_areas?.join(', ') || 'مجالات متنوعة'}
                  </Label>
                </div>
              ))}
            </div>
            {selectedExperts.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedExperts.map((expertId) => {
                  const expert = systemLists.experts.find(e => e.id === expertId);
                  return (
                    <Badge key={expertId} variant="secondary" className="flex items-center gap-1">
                      خبير - {expert?.expertise_areas?.[0] || 'متنوع'}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setSelectedExperts(selectedExperts.filter(id => id !== expertId))}
                      />
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="collaboration_details">تفاصيل التعاون</Label>
            <Textarea
              id="collaboration_details"
              value={formData.collaboration_details}
              onChange={(e) => updateFormData('collaboration_details', e.target.value)}
              placeholder="تفاصيل كيفية التعاون مع الشركاء والخبراء"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="internal_team_notes">ملاحظات الفريق الداخلي</Label>
            <Textarea
              id="internal_team_notes"
              value={formData.internal_team_notes}
              onChange={(e) => updateFormData('internal_team_notes', e.target.value)}
              placeholder="ملاحظات داخلية للفريق (لن تظهر للمشاركين)"
              rows={3}
            />
          </div>
        </div>
      )
    },
    {
      id: 'review',
      title: 'مراجعة وتأكيد',
      description: 'مراجعة جميع المعلومات قبل الحفظ',
      validation: () => validateStep('review'),
      content: (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>معلومات التحدي</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>العنوان:</strong> {formData.title_ar}
              </div>
              <div>
                <strong>الوصف:</strong> {formData.description_ar}
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">{formData.status}</Badge>
                <Badge variant="outline">{formData.priority_level}</Badge>
                <Badge variant="outline">{formData.sensitivity_level}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>التفاصيل التقنية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>تاريخ البداية:</strong> {formData.start_date || 'غير محدد'}
              </div>
              <div>
                <strong>تاريخ النهاية:</strong> {formData.end_date || 'غير محدد'}
              </div>
              <div>
                <strong>الميزانية المقدرة:</strong> {formData.estimated_budget.toLocaleString()} ريال
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>الشركاء والخبراء</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>عدد الشركاء:</strong> {selectedPartners.length}
              </div>
              <div>
                <strong>عدد الخبراء:</strong> {selectedExperts.length}
              </div>
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