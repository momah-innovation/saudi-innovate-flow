import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MultiStepForm } from '@/components/ui/multi-step-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { SensitivityBadge } from '@/components/ui/SensitivityBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSettingsManager } from "@/hooks/useSettingsManager";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { ChallengeFormSchema } from '@/schemas/validation';
import type { Challenge, Department, Deputy, Sector, Domain, SubDomain, Service, Partner, Expert } from "@/types";

interface ChallengeFormData {
  id?: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
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
  challenge?: ChallengeFormData | null;
}

interface SystemLists {
  departments: Array<{ id: string; name: string; name_ar: string; }>;
  deputies: Array<{ id: string; name: string; name_ar: string; }>;
  sectors: Array<{ id: string; name: string; name_ar: string; }>;
  domains: Array<{ id: string; name: string; name_ar: string; }>;
  subDomains: Array<{ id: string; name: string; name_ar: string; }>;
  services: Array<{ id: string; name: string; name_ar: string; }>;
  partners: Array<{ id: string; name: string; name_ar: string; }>;
  experts: Array<{ id: string; user_id: string; expertise_areas?: string[]; }>;
}

export function ChallengeWizard({ isOpen, onClose, onSuccess, challenge }: ChallengeWizardProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { getSettingValue } = useSettingsManager();
  const challengeStatusOptions = getSettingValue('challenge_statuses', []) as string[];
  const challengePriorityLevels = getSettingValue('priority_levels', []) as string[];
  const challengeSensitivityLevels = getSettingValue('sensitivity_levels', []) as string[];
  
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

  const [formData, setFormData] = useState<ChallengeFormData>({
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: '',
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

  const form = useForm<ChallengeFormData>({
    resolver: zodResolver(ChallengeFormSchema),
    defaultValues: formData
  });

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
      // Failed to load challenge wizard data
    }
  };

  const resetForm = () => {
    setFormData({
      title_ar: '',
      title_en: '',
      description_ar: '',
      description_en: '',
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

  const updateFormData = (field: keyof ChallengeFormData, value: string | number | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = async (stepId: string): Promise<boolean> => {
    switch (stepId) {
      case 'basic':
        if (!formData.title_ar.trim()) {
          toast({
             title: t('admin.challenges.validation_error'),
             description: t('admin.challenges.enter_title'),
            variant: 'destructive'
          });
          return false;
        }
        if (!formData.description_ar.trim()) {
          toast({
             title: t('admin.challenges.validation_error'),
             description: t('admin.challenges.enter_description'),
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
        // Update existing challenge
        const { error } = await supabase
          .from('challenges')
          .update(challengeData)
          .eq('id', challenge.id);

        if (error) throw error;

        toast({
           title: t('admin.challenges.update_success', 'Challenge Updated'),
           description: t('admin.challenges.update_success_desc', 'Challenge has been updated successfully')
        });
      } else {
        // Create new challenge
        const { data, error } = await supabase
          .from('challenges')
          .insert([challengeData])
          .select()
          .single();

        if (error) throw error;

        // Add selected experts
        if (selectedExperts.length > 0 && data) {
          const expertLinks = selectedExperts.map(expertId => ({
            challenge_id: data.id,
            expert_id: expertId,
            role_type: 'evaluator',
            status: 'active'
          }));

          await supabase.from('challenge_experts').insert(expertLinks);
        }

        // Add selected partners
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
           title: t('admin.challenges.create_success', 'Challenge Created'),
           description: t('admin.challenges.create_success_desc', 'Challenge has been created successfully')
         });
      }

      onSuccess();
      onClose();
    } catch (error) {
      // Failed to save challenge
       toast({
         title: t('admin.challenges.save_failed', 'Save Failed'),
         description: t('admin.challenges.try_again', 'Please try again'),
         variant: 'destructive'
       });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      id: 'basic',
      title: t('challenge_wizard.basic_info'),
      description: t('challenge_wizard.basic_info'),
      validation: () => validateStep('basic'),
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title_ar">{t('form.title_ar')} *</Label>
            <Input
              id="title_ar"
              value={formData.title_ar}
              onChange={(e) => updateFormData('title_ar', e.target.value)}
              placeholder={t('placeholder.enter_title')}
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title_en">{t('form.title_en')}</Label>
            <Input
              id="title_en"
              value={formData.title_en || ''}
              onChange={(e) => updateFormData('title_en', e.target.value)}
              placeholder={t('placeholder.enter_title_en')}
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description_ar">{t('form.description_ar')} *</Label>
            <Textarea
              id="description_ar"
              value={formData.description_ar}
              onChange={(e) => updateFormData('description_ar', e.target.value)}
              placeholder={t('placeholder.enter_description')}
              dir="rtl"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description_en">{t('form.description_en')}</Label>
            <Textarea
              id="description_en"
              value={formData.description_en || ''}
              onChange={(e) => updateFormData('description_en', e.target.value)}
              placeholder={t('placeholder.enter_description_en')}
              dir="ltr"
              rows={4}
            />
          </div>

        <div className="space-y-4 px-4 pb-2">
          <div className="space-y-2">
            <Label htmlFor="status">{t('form.status')}</Label>
            <Select value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
              <SelectTrigger dir="rtl">
                <SelectValue placeholder={t('placeholder.select_status')} />
              </SelectTrigger>
              <SelectContent>
                {challengeStatusOptions.map(status => (
                  <SelectItem key={status} value={status}>
                    {t(`status.${status}`) || status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority_level">{t('form.priority_level')}</Label>
            <Select value={formData.priority_level} onValueChange={(value) => updateFormData('priority_level', value)}>
              <SelectTrigger dir="rtl">
                <SelectValue placeholder={t('placeholder.select_priority')} />
              </SelectTrigger>
              <SelectContent>
                {challengePriorityLevels.map(priority => (
                  <SelectItem key={priority} value={priority}>
                    {t(`priority.${priority}`) || priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sensitivity_level">{t('form.sensitivity_level')}</Label>
              <Select value={formData.sensitivity_level} onValueChange={(value) => updateFormData('sensitivity_level', value)}>
                <SelectTrigger dir="rtl">
                  <SelectValue placeholder={t('placeholder.select_sensitivity')} />
                </SelectTrigger>
                <SelectContent>
                  {challengeSensitivityLevels.map(level => (
                    <SelectItem key={level} value={level}>
                      {t(`sensitivity.${level}`) || level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="challenge_type">{t('form.challenge_type')}</Label>
              <Input
                id="challenge_type"
                value={formData.challenge_type}
                onChange={(e) => updateFormData('challenge_type', e.target.value)}
                placeholder={t('form.challenge_type')}
                dir="rtl"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'organizational', 
      title: t('challenge_wizard.organizational'),
      description: t('challenge_wizard.organizational'),
      validation: () => validateStep('organizational'),
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sector_id">{t('form.sector')}</Label>
              <Select value={formData.sector_id} onValueChange={(value) => updateFormData('sector_id', value)}>
                <SelectTrigger dir="rtl">
                  <SelectValue placeholder={t('placeholder.select_sector')} />
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
              <Label htmlFor="deputy_id">{t('form.deputy')}</Label>
              <Select value={formData.deputy_id} onValueChange={(value) => updateFormData('deputy_id', value)}>
                <SelectTrigger dir="rtl">
                  <SelectValue placeholder={t('placeholder.select_deputy')} />
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
              <Label htmlFor="department_id">{t('form.department')}</Label>
              <Select value={formData.department_id} onValueChange={(value) => updateFormData('department_id', value)}>
                <SelectTrigger dir="rtl">
                  <SelectValue placeholder={t('placeholder.select_department')} />
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
              <Label htmlFor="domain_id">{t('form.domain')}</Label>
              <Select value={formData.domain_id} onValueChange={(value) => updateFormData('domain_id', value)}>
                <SelectTrigger dir="rtl">
                  <SelectValue placeholder={t('placeholder.select_domain')} />
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
              <Label htmlFor="sub_domain_id">{t('form.sub_domain')}</Label>
              <Select value={formData.sub_domain_id} onValueChange={(value) => updateFormData('sub_domain_id', value)}>
                <SelectTrigger dir="rtl">
                  <SelectValue placeholder={t('form.sub_domain')} />
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
              <Label htmlFor="service_id">{t('form.service')}</Label>
              <Select value={formData.service_id} onValueChange={(value) => updateFormData('service_id', value)}>
                <SelectTrigger dir="rtl">
                  <SelectValue placeholder={t('form.service')} />
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
      title: t('challenge_wizard.technical'),
      description: t('challenge_wizard.technical'),
      validation: () => validateStep('technical'),
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">{t('form.start_date')}</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => updateFormData('start_date', e.target.value)}
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">{t('form.end_date')}</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => updateFormData('end_date', e.target.value)}
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimated_budget">{t('form.budget')}</Label>
              <Input
                id="estimated_budget"
                type="number"
                min="0"
                value={formData.estimated_budget}
                onChange={(e) => updateFormData('estimated_budget', parseFloat(e.target.value) || 0)}
                placeholder="0"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actual_budget">{t('form.budget')}</Label>
              <Input
                id="actual_budget"
                type="number"
                min="0"
                value={formData.actual_budget}
                onChange={(e) => updateFormData('actual_budget', parseFloat(e.target.value) || 0)}
                placeholder="0"
                dir="rtl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vision_2030_goal">{t('form.vision_2030_goal')}</Label>
            <Textarea
              id="vision_2030_goal"
              value={formData.vision_2030_goal}
              onChange={(e) => updateFormData('vision_2030_goal', e.target.value)}
              placeholder={t('placeholder.vision_2030_goal')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kpi_alignment">{t('form.kpi_alignment')}</Label>
            <Textarea
              id="kpi_alignment"
              value={formData.kpi_alignment}
              onChange={(e) => updateFormData('kpi_alignment', e.target.value)}
              placeholder={t('placeholder.kpi_alignment')}
              rows={3}
            />
          </div>
        </div>
      )
    },
    {
      id: 'relationships',
      title: t('challenge_wizard.relationships'),
      description: t('challenge_wizard.relationships'),
      validation: () => validateStep('relationships'),
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t('form.participating_partners')}</Label>
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
            <Label>{t('form.assigned_experts')}</Label>
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
                    {t('expert.prefix')} - {expert.expertise_areas?.join(', ') || t('expert.diverse_areas')}
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
                      {t('expert.prefix')} - {expert?.expertise_areas?.[0] || t('expert.varied')}
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
            <Label htmlFor="collaboration_details">{t('form.collaboration_details')}</Label>
            <Textarea
              id="collaboration_details"
              value={formData.collaboration_details}
              onChange={(e) => updateFormData('collaboration_details', e.target.value)}
              placeholder={t('placeholder.collaboration_details')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="internal_team_notes">{t('form.internal_team_notes')}</Label>
            <Textarea
              id="internal_team_notes"
              value={formData.internal_team_notes}
              onChange={(e) => updateFormData('internal_team_notes', e.target.value)}
              placeholder={t('placeholder.internal_team_notes')}
              rows={3}
            />
          </div>
        </div>
      )
    },
    {
      id: 'review',
      title: t('challenge_wizard.review'),
      description: t('challenge_wizard.review'),
      validation: () => validateStep('review'),
      content: (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('review.challenge_info')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>{t('review.title_label')}</strong> {formData.title_ar}
              </div>
              <div>
                <strong>{t('review.description_label')}</strong> {formData.description_ar}
              </div>
              <div className="flex gap-2 flex-wrap">
                <StatusBadge status={formData.status} size="sm" />
                <PriorityBadge priority={formData.priority_level} size="sm" />
                <SensitivityBadge sensitivity={formData.sensitivity_level} size="sm" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('review.technical_details')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>{t('review.start_date_label')}</strong> {formData.start_date || t('review.not_specified')}
              </div>
              <div>
                <strong>{t('review.end_date_label')}</strong> {formData.end_date || t('review.not_specified')}
              </div>
              <div>
                <strong>{t('review.estimated_budget_label')}</strong> {formData.estimated_budget.toLocaleString()} {t('review.currency_sar')}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('review.partners_experts')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>{t('review.partners_count_label')}</strong> {selectedPartners.length}
              </div>
              <div>
                <strong>{t('review.experts_count_label')}</strong> {selectedExperts.length}
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
      title={challenge ? t('admin.challenges.edit_challenge', 'Edit Challenge') : t('admin.challenges.create_challenge', 'Create Challenge')}
      steps={steps}
      onComplete={handleComplete}
      showProgress={true}
      allowSkip={false}
    />
  );
}