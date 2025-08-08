import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  X,
  Calendar,
  Target,
  Users,
  Building2,
  MapPin,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Search,
  ChevronsUpDown,
  Check
} from "lucide-react";
import { useSettingsManager } from "@/hooks/useSettingsManager";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { CampaignFormData, SystemLists } from "@/types";

// Use the centralized CampaignFormData type

interface CampaignWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCampaign?: CampaignFormData | null;
  onSuccess: () => void;
}

export function CampaignWizard({ 
  open, 
  onOpenChange, 
  editingCampaign, 
  onSuccess 
}: CampaignWizardProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { getSettingValue } = useSettingsManager();
  const generalStatusOptions = getSettingValue('workflow_statuses', []) as string[];
  const campaignThemeOptions = getSettingValue('campaign_theme_options', []) as string[];
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState<CampaignFormData>({
    title_ar: "",
    description_ar: "",
    status: "planning",
    theme: "",
    start_date: "",
    end_date: "",
    registration_deadline: "",
    target_participants: null,
    target_ideas: null,
    budget: null,
    success_metrics: "",
    campaign_manager_id: "",
    sector_id: "",
    deputy_id: "",
    department_id: "",
    challenge_id: "",
    sector_ids: [],
    deputy_ids: [],
    department_ids: [],
    challenge_ids: [],
    partner_ids: [],
    stakeholder_ids: []
  });

  // Related data
  interface RelatedEntity {
    id: string;
    name?: string;
    name_ar?: string;
    title?: string;
    title_ar?: string;
    email?: string;
    position?: string;
  }
  
  const [sectors, setSectors] = useState<RelatedEntity[]>([]);
  const [deputies, setDeputies] = useState<RelatedEntity[]>([]);
  const [departments, setDepartments] = useState<RelatedEntity[]>([]);
  const [challenges, setChallenges] = useState<RelatedEntity[]>([]);
  const [partners, setPartners] = useState<RelatedEntity[]>([]);
  const [stakeholders, setStakeholders] = useState<RelatedEntity[]>([]);
  const [managers, setManagers] = useState<RelatedEntity[]>([]);

  // Search states
  const [managerSearch, setManagerSearch] = useState("");
  const [partnerSearch, setPartnerSearch] = useState("");
  const [stakeholderSearch, setStakeholderSearch] = useState("");

  // Dropdown states
  const [openManager, setOpenManager] = useState(false);
  const [openSector, setOpenSector] = useState(false);
  const [openDeputy, setOpenDeputy] = useState(false);
  const [openDepartment, setOpenDepartment] = useState(false);
  const [openChallenge, setOpenChallenge] = useState(false);

  const steps = [
    { id: 0, title: t('campaign_wizard.basic_info'), icon: <AlertCircle className="w-4 h-4" /> },
    { id: 1, title: t('campaign_wizard.details_targets'), icon: <Target className="w-4 h-4" /> },
    { id: 2, title: t('campaign_wizard.dates_budget'), icon: <Calendar className="w-4 h-4" /> },
    { id: 3, title: t('campaign_wizard.organizational_structure'), icon: <Building2 className="w-4 h-4" /> },
    { id: 4, title: t('campaign_wizard.links_partnerships'), icon: <Users className="w-4 h-4" /> }
  ];

  useEffect(() => {
    if (open) {
      fetchRelatedData();
      if (editingCampaign) {
        loadCampaignData();
      } else {
        resetForm();
      }
    }
  }, [open, editingCampaign]);

  const fetchRelatedData = async () => {
    try {
      const [
        sectorsRes, 
        deputiesRes, 
        departmentsRes, 
        challengesRes, 
        partnersRes, 
        stakeholdersRes, 
        managersRes
      ] = await Promise.all([
        supabase.from('sectors').select('*').order('name_ar'),
        supabase.from('deputies').select('*').order('name_ar'),
        supabase.from('departments').select('*').order('name_ar'),
        supabase.from('challenges').select('*').order('title_ar'),
        supabase.from('partners').select('*').order('name_ar'),
        supabase.from('stakeholders').select('*').order('name_ar'),
        supabase.from('profiles').select('id, name, name_ar, email, position').eq('status', 'active').order('name_ar')
      ]);

      setSectors(sectorsRes.data || []);
      setDeputies(deputiesRes.data || []);
      setDepartments(departmentsRes.data || []);
      setChallenges(challengesRes.data || []);
      setPartners(partnersRes.data || []);
      setStakeholders(stakeholdersRes.data || []);
      setManagers(managersRes.data || []);
    } catch (error) {
      // Failed to fetch campaign wizard data - using defaults
    }
  };

  const loadCampaignData = async () => {
    if (!editingCampaign?.id) return;

    try {
      // Load linked data
      const [
        sectorLinksRes,
        deputyLinksRes,
        departmentLinksRes,
        challengeLinksRes,
        partnerLinksRes,
        stakeholderLinksRes
      ] = await Promise.all([
        supabase.from('campaign_sector_links').select('sector_id').eq('campaign_id', editingCampaign.id),
        supabase.from('campaign_deputy_links').select('deputy_id').eq('campaign_id', editingCampaign.id),
        supabase.from('campaign_department_links').select('department_id').eq('campaign_id', editingCampaign.id),
        supabase.from('campaign_challenge_links').select('challenge_id').eq('campaign_id', editingCampaign.id),
        supabase.from('campaign_partner_links').select('partner_id').eq('campaign_id', editingCampaign.id),
        supabase.from('campaign_stakeholder_links').select('stakeholder_id').eq('campaign_id', editingCampaign.id)
      ]);

      setFormData({
        ...editingCampaign,
        sector_ids: sectorLinksRes.data?.map(link => link.sector_id) || [],
        deputy_ids: deputyLinksRes.data?.map(link => link.deputy_id) || [],
        department_ids: departmentLinksRes.data?.map(link => link.department_id) || [],
        challenge_ids: challengeLinksRes.data?.map(link => link.challenge_id) || [],
        partner_ids: partnerLinksRes.data?.map(link => link.partner_id) || [],
        stakeholder_ids: stakeholderLinksRes.data?.map(link => link.stakeholder_id) || []
      });
    } catch (error) {
      // Failed to load campaign data
    }
  };

  const resetForm = () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    setFormData({
      title_ar: "",
      description_ar: "",
      status: "planning",
      theme: "",
      start_date: nextWeek.toISOString().split('T')[0],
      end_date: nextMonth.toISOString().split('T')[0],
      registration_deadline: today.toISOString().split('T')[0],
      target_participants: null,
      target_ideas: null,
      budget: null,
      success_metrics: "",
      campaign_manager_id: "",
      sector_id: "",
      deputy_id: "",
      department_id: "",
      challenge_id: "",
      sector_ids: [],
      deputy_ids: [],
      department_ids: [],
      challenge_ids: [],
      partner_ids: [],
      stakeholder_ids: []
    });
    setCurrentStep(0);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(formData.title_ar && formData.description_ar && formData.status && formData.theme);
      case 1:
        return !!(formData.success_metrics);
      case 2:
        return !!(formData.start_date && formData.end_date && formData.registration_deadline);
      case 3:
        return true; // Optional fields
      case 4:
        return true; // Optional fields
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    } else {
      toast({
        title: t('dialog.validation_error'),
        description: t('dialog.fill_required_fields'),
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast({
        title: t('dialog.validation_error'),
        description: t('dialog.fill_required_fields'),
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Prepare campaign data
      const campaignData = {
        title_ar: formData.title_ar,
        description_ar: formData.description_ar,
        status: formData.status,
        theme: formData.theme,
        start_date: formData.start_date,
        end_date: formData.end_date,
        registration_deadline: formData.registration_deadline,
        target_participants: formData.target_participants,
        target_ideas: formData.target_ideas,
        budget: formData.budget,
        success_metrics: formData.success_metrics,
        campaign_manager_id: formData.campaign_manager_id || null,
        sector_id: formData.sector_id || null,
        deputy_id: formData.deputy_id || null,
        department_id: formData.department_id || null,
        challenge_id: formData.challenge_id || null
      };

      let campaignId: string;

      if (editingCampaign?.id) {
        // Update existing campaign
        const { error } = await supabase
          .from('campaigns')
          .update(campaignData)
          .eq('id', editingCampaign.id);

        if (error) throw error;
        campaignId = editingCampaign.id;

        // Delete existing links
        await Promise.all([
          supabase.from('campaign_sector_links').delete().eq('campaign_id', campaignId),
          supabase.from('campaign_deputy_links').delete().eq('campaign_id', campaignId),
          supabase.from('campaign_department_links').delete().eq('campaign_id', campaignId),
          supabase.from('campaign_challenge_links').delete().eq('campaign_id', campaignId),
          supabase.from('campaign_partner_links').delete().eq('campaign_id', campaignId),
          supabase.from('campaign_stakeholder_links').delete().eq('campaign_id', campaignId)
        ]);
      } else {
        // Create new campaign
        const { data, error } = await supabase
          .from('campaigns')
          .insert(campaignData)
          .select()
          .single();

        if (error) throw error;
        campaignId = data.id;
      }

      // Create new links
      const linkPromises = [];

      if (formData.sector_ids.length > 0) {
        linkPromises.push(
          supabase.from('campaign_sector_links').insert(
            formData.sector_ids.map(sectorId => ({
              campaign_id: campaignId,
              sector_id: sectorId
            }))
          )
        );
      }

      if (formData.deputy_ids.length > 0) {
        linkPromises.push(
          supabase.from('campaign_deputy_links').insert(
            formData.deputy_ids.map(deputyId => ({
              campaign_id: campaignId,
              deputy_id: deputyId
            }))
          )
        );
      }

      if (formData.department_ids.length > 0) {
        linkPromises.push(
          supabase.from('campaign_department_links').insert(
            formData.department_ids.map(departmentId => ({
              campaign_id: campaignId,
              department_id: departmentId
            }))
          )
        );
      }

      if (formData.challenge_ids.length > 0) {
        linkPromises.push(
          supabase.from('campaign_challenge_links').insert(
            formData.challenge_ids.map(challengeId => ({
              campaign_id: campaignId,
              challenge_id: challengeId
            }))
          )
        );
      }

      if (formData.partner_ids.length > 0) {
        linkPromises.push(
          supabase.from('campaign_partner_links').insert(
            formData.partner_ids.map(partnerId => ({
              campaign_id: campaignId,
              partner_id: partnerId
            }))
          )
        );
      }

      if (formData.stakeholder_ids.length > 0) {
        linkPromises.push(
          supabase.from('campaign_stakeholder_links').insert(
            formData.stakeholder_ids.map(stakeholderId => ({
              campaign_id: campaignId,
              stakeholder_id: stakeholderId
            }))
          )
        );
      }

      await Promise.all(linkPromises);

      toast({
        title: t('dialog.save_success'),
        description: editingCampaign ? t('dialog.update_success') : t('dialog.create_success')
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      // Failed to save campaign
      toast({
        title: t('dialog.save_failed'),
        description: t('dialog.try_again'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title_ar">{t('form.campaign_title')} *</Label>
              <Input
                id="title_ar"
                value={formData.title_ar}
                onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
                placeholder={t('placeholder.enter_campaign_title')}
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description_ar">{t('form.campaign_description')} *</Label>
              <Textarea
                id="description_ar"
                value={formData.description_ar}
                onChange={(e) => setFormData(prev => ({ ...prev, description_ar: e.target.value }))}
                placeholder={t('placeholder.enter_campaign_description')}
                dir="rtl"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">{t('form.campaign_status')} *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger dir="rtl">
                    <SelectValue placeholder={t('placeholder.select_campaign_status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">{t('status.planning')}</SelectItem>
                    {generalStatusOptions.filter(status => ['active', 'completed', 'cancelled'].includes(status)).map(status => (
                      <SelectItem key={status} value={status}>
                        {status === 'active' ? t('status.female_active') : status === 'completed' ? t('status.female_completed') : t('status.female_cancelled')}
                      </SelectItem>
                    ))}
                    <SelectItem value="archived">{t('status.female_archived')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">{t('form.theme')} *</Label>
                <Select value={formData.theme} onValueChange={(value) => setFormData(prev => ({ ...prev, theme: value }))}>
                  <SelectTrigger dir="rtl">
                    <SelectValue placeholder={t('form.theme')} />
                  </SelectTrigger>
                  <SelectContent>
                    {campaignThemeOptions.map(theme => (
                      <SelectItem key={theme} value={theme}>
                        {t(`theme.${theme}`) || theme}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target_participants">عدد المشاركين المستهدف</Label>
                <Input
                  id="target_participants"
                  type="number"
                  value={formData.target_participants || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_participants: e.target.value ? Number(e.target.value) : null }))}
                  placeholder="أدخل عدد المشاركين"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_ideas">عدد الأفكار المستهدف</Label>
                <Input
                  id="target_ideas"
                  type="number"
                  value={formData.target_ideas || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_ideas: e.target.value ? Number(e.target.value) : null }))}
                  placeholder="أدخل عدد الأفكار"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="success_metrics">مقاييس النجاح *</Label>
              <Textarea
                id="success_metrics"
                value={formData.success_metrics}
                onChange={(e) => setFormData(prev => ({ ...prev, success_metrics: e.target.value }))}
                placeholder="أدخل مقاييس النجاح والمؤشرات المطلوب تحقيقها"
                dir="rtl"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>مدير الحملة</Label>
              <Popover open={openManager} onOpenChange={setOpenManager}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openManager}
                    className="w-full justify-between"
                  >
                    {formData.campaign_manager_id
                      ? managers.find(manager => manager.id === formData.campaign_manager_id)?.name_ar || 
                        managers.find(manager => manager.id === formData.campaign_manager_id)?.name
                      : "اختر مدير الحملة"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput 
                      placeholder="ابحث عن مدير..."
                      value={managerSearch}
                      onValueChange={setManagerSearch}
                    />
                    <CommandEmpty>لا توجد نتائج</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {managers
                          .filter(manager => 
                            !managerSearch || 
                            (manager.name_ar?.toLowerCase().includes(managerSearch.toLowerCase())) ||
                            (manager.name?.toLowerCase().includes(managerSearch.toLowerCase())) ||
                            (manager.email?.toLowerCase().includes(managerSearch.toLowerCase()))
                          )
                          .map((manager) => (
                            <CommandItem
                              key={manager.id}
                              value={manager.id}
                              onSelect={() => {
                                setFormData(prev => ({ ...prev, campaign_manager_id: manager.id }));
                                setOpenManager(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  formData.campaign_manager_id === manager.id ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              <div>
                                <div>{manager.name_ar || manager.name}</div>
                                <div className="text-sm text-muted-foreground">{manager.email}</div>
                              </div>
                            </CommandItem>
                          ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">تاريخ البداية *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">تاريخ النهاية *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registration_deadline">آخر موعد للتسجيل *</Label>
                <Input
                  id="registration_deadline"
                  type="date"
                  value={formData.registration_deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, registration_deadline: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">الميزانية (ريال سعودي)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value ? Number(e.target.value) : null }))}
                placeholder="أدخل ميزانية الحملة"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>القطاع الرئيسي</Label>
                <Select value={formData.sector_id} onValueChange={(value) => setFormData(prev => ({ ...prev, sector_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر القطاع الرئيسي" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name_ar || sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>الوكالة الرئيسية</Label>
                <Select value={formData.deputy_id} onValueChange={(value) => setFormData(prev => ({ ...prev, deputy_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الوكالة الرئيسية" />
                  </SelectTrigger>
                  <SelectContent>
                    {deputies.map((deputy) => (
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
                <Label>الإدارة الرئيسية</Label>
                <Select value={formData.department_id} onValueChange={(value) => setFormData(prev => ({ ...prev, department_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الإدارة الرئيسية" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name_ar || department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>التحدي الرئيسي</Label>
                <Select value={formData.challenge_id} onValueChange={(value) => setFormData(prev => ({ ...prev, challenge_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر التحدي الرئيسي" />
                  </SelectTrigger>
                  <SelectContent>
                    {challenges.map((challenge) => (
                      <SelectItem key={challenge.id} value={challenge.id}>
                        {challenge.title_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">القطاعات المشاركة</h4>
              <div className="grid grid-cols-2 gap-2">
                {sectors.map((sector) => (
                  <div key={sector.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`sector-${sector.id}`}
                      checked={formData.sector_ids.includes(sector.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({ ...prev, sector_ids: [...prev.sector_ids, sector.id] }));
                        } else {
                          setFormData(prev => ({ ...prev, sector_ids: prev.sector_ids.filter(id => id !== sector.id) }));
                        }
                      }}
                    />
                    <Label htmlFor={`sector-${sector.id}`} className="text-sm">
                      {sector.name_ar || sector.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">الوكالات المشاركة</h4>
              <div className="grid grid-cols-2 gap-2">
                {deputies.map((deputy) => (
                  <div key={deputy.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`deputy-${deputy.id}`}
                      checked={formData.deputy_ids.includes(deputy.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({ ...prev, deputy_ids: [...prev.deputy_ids, deputy.id] }));
                        } else {
                          setFormData(prev => ({ ...prev, deputy_ids: prev.deputy_ids.filter(id => id !== deputy.id) }));
                        }
                      }}
                    />
                    <Label htmlFor={`deputy-${deputy.id}`} className="text-sm">
                      {deputy.name_ar || deputy.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">الإدارات المشاركة</h4>
              <div className="grid grid-cols-2 gap-2">
                {departments.map((department) => (
                  <div key={department.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`department-${department.id}`}
                      checked={formData.department_ids.includes(department.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({ ...prev, department_ids: [...prev.department_ids, department.id] }));
                        } else {
                          setFormData(prev => ({ ...prev, department_ids: prev.department_ids.filter(id => id !== department.id) }));
                        }
                      }}
                    />
                    <Label htmlFor={`department-${department.id}`} className="text-sm">
                      {department.name_ar || department.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">التحديات المشاركة</h4>
              <div className="grid grid-cols-1 gap-2">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`challenge-${challenge.id}`}
                      checked={formData.challenge_ids.includes(challenge.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({ ...prev, challenge_ids: [...prev.challenge_ids, challenge.id] }));
                        } else {
                          setFormData(prev => ({ ...prev, challenge_ids: prev.challenge_ids.filter(id => id !== challenge.id) }));
                        }
                      }}
                    />
                    <Label htmlFor={`challenge-${challenge.id}`} className="text-sm">
                      {challenge.title_ar}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">الشركاء</h4>
              <div className="space-y-2">
                <Input
                  placeholder="ابحث عن شريك..."
                  value={partnerSearch}
                  onChange={(e) => setPartnerSearch(e.target.value)}
                />
                <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-1">
                  {partners
                    .filter(partner => 
                      !partnerSearch || 
                      (partner.name_ar?.toLowerCase().includes(partnerSearch.toLowerCase())) ||
                      (partner.name?.toLowerCase().includes(partnerSearch.toLowerCase()))
                    )
                    .map((partner) => (
                      <div key={partner.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`partner-${partner.id}`}
                          checked={formData.partner_ids.includes(partner.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData(prev => ({ ...prev, partner_ids: [...prev.partner_ids, partner.id] }));
                            } else {
                              setFormData(prev => ({ ...prev, partner_ids: prev.partner_ids.filter(id => id !== partner.id) }));
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
              
              {formData.partner_ids.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.partner_ids.map(partnerId => {
                    const partner = partners.find(p => p.id === partnerId);
                    return (
                      <Badge key={partnerId} variant="secondary" className="gap-1">
                        {partner?.name_ar || partner?.name}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            partner_ids: prev.partner_ids.filter(id => id !== partnerId) 
                          }))}
                        />
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">أصحاب المصلحة</h4>
              <div className="space-y-2">
                <Input
                  placeholder="ابحث عن صاحب مصلحة..."
                  value={stakeholderSearch}
                  onChange={(e) => setStakeholderSearch(e.target.value)}
                />
                <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-1">
                  {stakeholders
                    .filter(stakeholder => 
                      !stakeholderSearch || 
                      (stakeholder.name_ar?.toLowerCase().includes(stakeholderSearch.toLowerCase())) ||
                      (stakeholder.name?.toLowerCase().includes(stakeholderSearch.toLowerCase()))
                    )
                    .map((stakeholder) => (
                      <div key={stakeholder.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`stakeholder-${stakeholder.id}`}
                          checked={formData.stakeholder_ids.includes(stakeholder.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData(prev => ({ ...prev, stakeholder_ids: [...prev.stakeholder_ids, stakeholder.id] }));
                            } else {
                              setFormData(prev => ({ ...prev, stakeholder_ids: prev.stakeholder_ids.filter(id => id !== stakeholder.id) }));
                            }
                          }}
                        />
                        <Label htmlFor={`stakeholder-${stakeholder.id}`} className="text-sm">
                          {stakeholder.name_ar || stakeholder.name}
                        </Label>
                      </div>
                    ))}
                </div>
              </div>
              
              {formData.stakeholder_ids.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.stakeholder_ids.map(stakeholderId => {
                    const stakeholder = stakeholders.find(s => s.id === stakeholderId);
                    return (
                      <Badge key={stakeholderId} variant="secondary" className="gap-1">
                        {stakeholder?.name_ar || stakeholder?.name}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            stakeholder_ids: prev.stakeholder_ids.filter(id => id !== stakeholderId) 
                          }))}
                        />
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {editingCampaign ? "تعديل الحملة" : "إضافة حملة جديدة"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step indicator */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {step.icon}
                </div>
                <div className="ml-2 text-sm font-medium">{step.title}</div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-px mx-2 ${
                    index < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{steps[currentStep].title}</CardTitle>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation buttons */}
          <div className="flex justify-between">
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
              
              {currentStep === steps.length - 1 ? (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "جاري الحفظ..." : (editingCampaign ? "تحديث الحملة" : "إنشاء الحملة")}
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  التالي
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}