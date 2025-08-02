import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useSystemLists } from "@/hooks/useSystemLists";
import { 
  Check,
  ChevronsUpDown,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Users,
  Clock,
  Target,
  Building,
  UserCheck,
  HelpCircle,
  Settings
} from "lucide-react";
import { updateEventPartners, updateEventStakeholders, updateEventFocusQuestions, updateEventChallenges } from "@/lib/relationshipHelpers";
import { EventFormData, SystemLists } from "@/types";

interface Event {
  id: string;
  title_ar: string;
  description?: string;
  description_ar?: string;
  event_type?: string;
  event_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  virtual_link?: string;
  format?: string;
  max_participants?: number;
  registered_participants?: number;
  actual_participants?: number;
  status?: string;
  budget?: number;
  event_manager_id?: string;
  campaign_id?: string;
  challenge_id?: string;
  sector_id?: string;
  event_visibility?: string;
  event_category?: string;
  inherit_from_campaign?: boolean;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
  target_stakeholder_groups?: string[];
  created_at?: string;
}

interface EventWizardProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onSave: () => void;
}

export function EventWizard({ isOpen, onClose, event, onSave }: EventWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<{[key: number]: string[]}>({});
  const totalSteps = 5;
  const [isLoading, setIsLoading] = useState(false);
  
  // Search states for dropdowns
  const [openCampaign, setOpenCampaign] = useState(false);
  const [openChallenge, setOpenChallenge] = useState(false);
  const [openSector, setOpenSector] = useState(false);
  const [openEventManager, setOpenEventManager] = useState(false);
  const [partnerSearch, setPartnerSearch] = useState("");
  const [stakeholderSearch, setStakeholderSearch] = useState("");
  const [focusQuestionSearch, setFocusQuestionSearch] = useState("");
  const [challengeSearch, setChallengeSearch] = useState("");

  // Form data
  const [formData, setFormData] = useState<EventFormData>({
    title_ar: "",
    description_ar: "",
    event_type: "workshop",
    event_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    location: "",
    virtual_link: "",
    format: "in_person",
    max_participants: "",
    registered_participants: "",
    actual_participants: "",
    status: "scheduled",
    budget: "",
    event_manager_id: "",
    campaign_id: "",
    challenge_id: "",
    sector_id: "",
    event_visibility: "public",
    event_category: "standalone",
    inherit_from_campaign: false,
    is_recurring: false,
    recurrence_pattern: "",
    recurrence_end_date: "",
    target_stakeholder_groups: [] as string[],
  });

  // Related data
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [stakeholders, setStakeholders] = useState<any[]>([]);
  const [focusQuestions, setFocusQuestions] = useState<any[]>([]);
  const [eventManagers, setEventManagers] = useState<any[]>([]);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [selectedStakeholders, setSelectedStakeholders] = useState<string[]>([]);
  const [selectedFocusQuestions, setSelectedFocusQuestions] = useState<string[]>([]);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);

  const { toast } = useToast();
  const { generalStatusOptions, eventTypes, eventFormats, eventCategories, eventVisibilityOptions, recurrencePatternOptions } = useSystemLists();

  // Options from system lists
  const eventTypeOptions = eventTypes.map(type => ({
    value: type,
    label: type === 'workshop' ? 'ورشة عمل' : 
           type === 'seminar' ? 'ندوة' :
           type === 'conference' ? 'مؤتمر' :
           type === 'networking' ? 'شبكات تواصل' :
           type === 'hackathon' ? 'هاكاثون' :
           type === 'pitch_session' ? 'جلسة عرض' : 
           type === 'training' ? 'تدريب' : type
  }));

  const formatOptions = eventFormats.map(format => ({
    value: format,
    label: format === 'in_person' ? 'حضوري' :
           format === 'virtual' ? 'افتراضي' : 'مختلط'
  }));

  // Status options from system lists
  const statusOptions = generalStatusOptions.map(status => ({ 
    value: status, 
    label: status === 'scheduled' ? 'مجدول' :
           status === 'ongoing' ? 'جاري' :
           status === 'completed' ? 'مكتمل' :
           status === 'cancelled' ? 'ملغي' :
           status === 'postponed' ? 'مؤجل' : status
  }));

  const visibilityOptions = eventVisibilityOptions.map(visibility => ({
    value: visibility,
    label: visibility === 'public' ? 'عام' :
           visibility === 'private' ? 'خاص' : 'داخلي'
  }));

  const categoryOptions = eventCategories.map(category => ({
    value: category,
    label: category === 'standalone' ? 'حدث مستقل' :
           category === 'campaign_event' ? 'حدث حملة' :
           category === 'training' ? 'تدريب' : 'ورشة عمل'
  }));

  useEffect(() => {
    if (isOpen) {
      fetchRelatedData();
      if (event) {
        loadEventData(event);
      } else {
        resetForm();
      }
    }
  }, [isOpen, event]);

  const fetchRelatedData = async () => {
    try {
      const [
        campaignsRes, 
        challengesRes, 
        sectorsRes,
        partnersRes, 
        stakeholdersRes, 
        focusQuestionsRes,
        eventManagersRes
      ] = await Promise.all([
        supabase.from('campaigns').select('*').order('title_ar'),
        supabase.from('challenges').select('*').order('title_ar'),
        supabase.from('sectors').select('*').order('name'),
        supabase.from('partners').select('*').order('name'),
        supabase.from('stakeholders').select('*').order('name'),
        supabase.from('focus_questions').select('*').order('question_text_ar'),
        supabase.from('profiles').select('id, name, email, position').order('name')
      ]);

      setCampaigns(campaignsRes.data || []);
      setChallenges(challengesRes.data || []);
      setSectors(sectorsRes.data || []);
      setPartners(partnersRes.data || []);
      setStakeholders(stakeholdersRes.data || []);
      setFocusQuestions(focusQuestionsRes.data || []);
      setEventManagers(eventManagersRes.data || []);
    } catch (error) {
      // Failed to fetch event wizard data - using defaults
    }
  };

  const loadEventData = async (eventData: Event) => {
    // Load basic event data
    setFormData({
      title_ar: eventData.title_ar || "",
      description_ar: eventData.description_ar || "",
      event_type: eventData.event_type || "workshop",
      event_date: eventData.event_date || "",
      end_date: eventData.end_date || "",
      start_time: eventData.start_time || "",
      end_time: eventData.end_time || "",
      location: eventData.location || "",
      virtual_link: eventData.virtual_link || "",
      format: eventData.format || "in_person",
      max_participants: eventData.max_participants?.toString() || "",
      registered_participants: eventData.registered_participants?.toString() || "",
      actual_participants: eventData.actual_participants?.toString() || "",
      status: eventData.status || "scheduled",
      budget: eventData.budget?.toString() || "",
      event_manager_id: eventData.event_manager_id || "",
      campaign_id: eventData.campaign_id || "",
      challenge_id: eventData.challenge_id || "",
      sector_id: eventData.sector_id || "",
      event_visibility: eventData.event_visibility || "public",
      event_category: eventData.event_category || "standalone",
      inherit_from_campaign: eventData.inherit_from_campaign || false,
      is_recurring: eventData.is_recurring || false,
      recurrence_pattern: eventData.recurrence_pattern || "",
      recurrence_end_date: eventData.recurrence_end_date || "",
      target_stakeholder_groups: eventData.target_stakeholder_groups || [],
    });

    // Load relationships
    if (eventData.id) {
      await loadEventRelationships(eventData.id);
    }
  };

  const loadEventRelationships = async (eventId: string) => {
    try {
      const [partnersRes, stakeholdersRes, focusQuestionsRes, challengesRes] = await Promise.all([
        supabase
          .from('event_partner_links')
          .select('partner_id')
          .eq('event_id', eventId),
        supabase
          .from('event_stakeholder_links')
          .select('stakeholder_id')
          .eq('event_id', eventId),
        supabase
          .from('event_focus_question_links')
          .select('focus_question_id')
          .eq('event_id', eventId),
        supabase
          .from('event_challenge_links')
          .select('challenge_id')
          .eq('event_id', eventId)
      ]);

      setSelectedPartners(partnersRes.data?.map(link => link.partner_id) || []);
      setSelectedStakeholders(stakeholdersRes.data?.map(link => link.stakeholder_id) || []);
      setSelectedFocusQuestions(focusQuestionsRes.data?.map(link => link.focus_question_id) || []);
      setSelectedChallenges(challengesRes.data?.map(link => link.challenge_id) || []);
    } catch (error) {
      // Failed to load event relationships
    }
  };

  const resetForm = () => {
    setFormData({
      title_ar: "",
      description_ar: "",
      event_type: "workshop",
      event_date: "",
      end_date: "",
      start_time: "",
      end_time: "",
      location: "",
      virtual_link: "",
      format: "in_person",
      max_participants: "",
      registered_participants: "",
      actual_participants: "",
      status: "scheduled",
      budget: "",
      event_manager_id: "",
      campaign_id: "",
      challenge_id: "",
      sector_id: "",
      event_visibility: "public",
      event_category: "standalone",
      inherit_from_campaign: false,
      is_recurring: false,
      recurrence_pattern: "",
      recurrence_end_date: "",
      target_stakeholder_groups: [],
    });
    setSelectedPartners([]);
    setSelectedStakeholders([]);
    setSelectedFocusQuestions([]);
    setSelectedChallenges([]);
    setCurrentStep(1);
    setStepErrors({});
  };

  const validateStep = (step: number): string[] => {
    const errors: string[] = [];

    switch (step) {
      case 1: // Basic Information
        if (!formData.title_ar.trim()) errors.push("العنوان بالعربية مطلوب");
        if (!formData.event_type) errors.push("نوع الحدث مطلوب");
        if (!formData.description_ar?.trim()) errors.push("الوصف بالعربية مطلوب");
        break;
      case 2: // Event Details
        if (!formData.event_date) errors.push("تاريخ الحدث مطلوب");
        if (!formData.format) errors.push("تنسيق الحدث مطلوب");
        if (formData.format === "in_person" && !formData.location?.trim()) {
          errors.push("الموقع مطلوب للأحداث الحضورية");
        }
        if (formData.format === "virtual" && !formData.virtual_link?.trim()) {
          errors.push("الرابط الافتراضي مطلوب للأحداث الافتراضية");
        }
        if (formData.format === "hybrid" && (!formData.location?.trim() || !formData.virtual_link?.trim())) {
          errors.push("الموقع والرابط الافتراضي مطلوبان للأحداث المختلطة");
        }
        if (formData.max_participants && parseInt(formData.max_participants) <= 0) {
          errors.push("الحد الأقصى للمشاركين يجب أن يكون أكبر من صفر");
        }
        if (formData.budget && parseFloat(formData.budget) < 0) {
          errors.push("الميزانية لا يمكن أن تكون سالبة");
        }
        if (formData.start_time && formData.end_time && formData.start_time >= formData.end_time) {
          errors.push("وقت الانتهاء يجب أن يكون بعد وقت البداية");
        }
        if (formData.end_date && formData.event_date && formData.end_date < formData.event_date) {
          errors.push("تاريخ الانتهاء لا يمكن أن يكون قبل تاريخ البداية");
        }
        break;
      case 3: // Organization & Campaign
        // Optional validation
        break;
      case 4: // Partners & Stakeholders
        // Optional validation
        break;
      case 5: // Additional Settings
        if (formData.is_recurring && !formData.recurrence_pattern) {
          errors.push("نمط التكرار مطلوب للأحداث المتكررة");
        }
        if (formData.is_recurring && formData.recurrence_pattern && !formData.recurrence_end_date) {
          errors.push("تاريخ انتهاء التكرار مطلوب للأحداث المتكررة");
        }
        break;
    }

    return errors;
  };

  const nextStep = () => {
    const errors = validateStep(currentStep);
    if (errors.length > 0) {
      setStepErrors({ ...stepErrors, [currentStep]: errors });
      toast({
        title: "خطأ في التحقق",
        description: errors.join("، "),
        variant: "destructive",
      });
      return;
    }

    setStepErrors({ ...stepErrors, [currentStep]: [] });
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      toast({
        title: "اكتملت الخطوة",
        description: `تم إكمال الخطوة ${currentStep} بنجاح`,
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    const allErrors: string[] = [];
    for (let step = 1; step <= totalSteps; step++) {
      const stepErrors = validateStep(step);
      allErrors.push(...stepErrors);
    }

    if (allErrors.length > 0) {
      toast({
        title: "خطأ في التحقق",
        description: allErrors.join("، "),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const eventData = {
        title_ar: formData.title_ar || null,
        description_ar: formData.description_ar || null,
        event_type: formData.event_type,
        event_date: formData.event_date,
        end_date: formData.end_date || null,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        location: formData.location || null,
        virtual_link: formData.virtual_link || null,
        format: formData.format,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        registered_participants: formData.registered_participants ? parseInt(formData.registered_participants) : null,
        actual_participants: formData.actual_participants ? parseInt(formData.actual_participants) : null,
        status: formData.status,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        event_manager_id: formData.event_manager_id || null,
        campaign_id: formData.campaign_id || null,
        challenge_id: formData.challenge_id || null,
        sector_id: formData.sector_id || null,
        event_visibility: formData.event_visibility,
        event_category: formData.event_category,
        inherit_from_campaign: formData.inherit_from_campaign,
        is_recurring: formData.is_recurring,
        recurrence_pattern: formData.recurrence_pattern || null,
        recurrence_end_date: formData.recurrence_end_date || null,
        target_stakeholder_groups: formData.target_stakeholder_groups,
      };

      let result;
      if (event?.id) {
        // Update existing event
        result = await supabase
          .from('events')
          .update(eventData)
          .eq('id', event.id)
          .select()
          .single();
      } else {
        // Create new event
        result = await supabase
          .from('events')
          .insert(eventData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      const eventId = result.data.id;

      // Update relationships
      await Promise.all([
        updateEventPartners(eventId, selectedPartners),
        updateEventStakeholders(eventId, selectedStakeholders),
        updateEventFocusQuestions(eventId, selectedFocusQuestions),
        updateEventChallenges(eventId, selectedChallenges)
      ]);

      toast({
        title: "نجح",
        description: `تم ${event?.id ? 'تحديث' : 'إنشاء'} الحدث بنجاح`,
      });

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ الحدث",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="title_ar">العنوان (العربية) *</Label>
                <Input
                  id="title_ar"
                  value={formData.title_ar}
                  onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                  placeholder="عنوان الحدث"
                  dir="rtl"
                  className={stepErrors[1]?.some(e => e.includes("العنوان بالعربية")) ? "border-destructive" : ""}
                />
                {stepErrors[1]?.some(e => e.includes("العنوان بالعربية")) && (
                  <p className="text-sm text-destructive mt-1">العنوان بالعربية مطلوب</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="description_ar">الوصف (العربية) *</Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  placeholder="وصف الحدث"
                  dir="rtl"
                  rows={3}
                  className={stepErrors[1]?.some(e => e.includes("الوصف بالعربية")) ? "border-destructive" : ""}
                />
                {stepErrors[1]?.some(e => e.includes("الوصف بالعربية")) && (
                  <p className="text-sm text-destructive mt-1">الوصف بالعربية مطلوب</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>نوع الحدث *</Label>
                <Select
                  value={formData.event_type}
                  onValueChange={(value) => setFormData({ ...formData, event_type: value })}
                >
                  <SelectTrigger className={stepErrors[1]?.some(e => e.includes("نوع الحدث")) ? "border-destructive" : ""}>
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypeOptions.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {stepErrors[1]?.some(e => e.includes("نوع الحدث")) && (
                  <p className="text-sm text-destructive mt-1">نوع الحدث مطلوب</p>
                )}
              </div>

              <div>
                <Label>مستوى الرؤية</Label>
                <Select
                  value={formData.event_visibility}
                  onValueChange={(value) => setFormData({ ...formData, event_visibility: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مستوى الرؤية" />
                  </SelectTrigger>
                  <SelectContent>
                    {visibilityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>الفئة</Label>
                <Select
                  value={formData.event_category}
                  onValueChange={(value) => setFormData({ ...formData, event_category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="event_date">تاريخ الحدث *</Label>
                <Input
                  id="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  className={stepErrors[2]?.some(e => e.includes("تاريخ الحدث")) ? "border-destructive" : ""}
                />
                {stepErrors[2]?.some(e => e.includes("تاريخ الحدث")) && (
                  <p className="text-sm text-destructive mt-1">تاريخ الحدث مطلوب</p>
                )}
              </div>
              <div>
                <Label htmlFor="start_time">وقت البداية</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end_time">وقت النهاية</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>التنسيق *</Label>
                <Select
                  value={formData.format}
                  onValueChange={(value) => setFormData({ ...formData, format: value })}
                >
                  <SelectTrigger className={stepErrors[2]?.some(e => e.includes("تنسيق الحدث")) ? "border-destructive" : ""}>
                    <SelectValue placeholder="اختر التنسيق" />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {stepErrors[2]?.some(e => e.includes("تنسيق الحدث")) && (
                  <p className="text-sm text-destructive mt-1">تنسيق الحدث مطلوب</p>
                )}
              </div>
              <div>
                <Label>الحالة</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
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

            {(formData.format === "in_person" || formData.format === "hybrid") && (
              <div>
                <Label htmlFor="location">الموقع</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="موقع الحدث"
                  className={stepErrors[2]?.some(e => e.includes("الموقع مطلوب")) ? "border-destructive" : ""}
                />
                {stepErrors[2]?.some(e => e.includes("الموقع مطلوب")) && (
                  <p className="text-sm text-destructive mt-1">الموقع مطلوب للأحداث الحضورية</p>
                )}
              </div>
            )}

            {(formData.format === "virtual" || formData.format === "hybrid") && (
              <div>
                <Label htmlFor="virtual_link">الرابط الافتراضي</Label>
                <Input
                  id="virtual_link"
                  value={formData.virtual_link}
                  onChange={(e) => setFormData({ ...formData, virtual_link: e.target.value })}
                  placeholder="https://..."
                  className={stepErrors[2]?.some(e => e.includes("الرابط الافتراضي")) ? "border-destructive" : ""}
                />
                {stepErrors[2]?.some(e => e.includes("الرابط الافتراضي")) && (
                  <p className="text-sm text-destructive mt-1">الرابط الافتراضي مطلوب للأحداث الافتراضية</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max_participants">الحد الأقصى للمشاركين</Label>
                <Input
                  id="max_participants"
                  type="number"
                  min="1"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                  placeholder="الحد الأقصى للمشاركين"
                />
              </div>
              <div>
                <Label htmlFor="budget">الميزانية</Label>
                <Input
                  id="budget"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="ميزانية الحدث"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>الحملة</Label>
                <Popover open={openCampaign} onOpenChange={setOpenCampaign}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCampaign}
                      className="w-full justify-between"
                    >
                      {formData.campaign_id
                        ? campaigns.find((campaign) => campaign.id === formData.campaign_id)?.title_ar
                        : "اختر الحملة..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="البحث في الحملات..." />
                      <CommandList>
                        <CommandEmpty>لا توجد حملة.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value=""
                            onSelect={() => {
                              setFormData({ ...formData, campaign_id: "" });
                              setOpenCampaign(false);
                            }}
                          >
                            <Check className="mr-2 h-4 w-4 opacity-0" />
                            لا شيء
                          </CommandItem>
                          {campaigns.map((campaign) => (
                            <CommandItem
                              key={campaign.id}
                              value={campaign.title_ar}
                              onSelect={() => {
                                setFormData({ ...formData, campaign_id: campaign.id });
                                setOpenCampaign(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  formData.campaign_id === campaign.id ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {campaign.title_ar}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>القطاع</Label>
                <Popover open={openSector} onOpenChange={setOpenSector}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openSector}
                      className="w-full justify-between"
                    >
                      {formData.sector_id
                        ? sectors.find((sector) => sector.id === formData.sector_id)?.name
                        : "اختر القطاع..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="البحث في القطاعات..." />
                      <CommandList>
                        <CommandEmpty>لا يوجد قطاع.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value=""
                            onSelect={() => {
                              setFormData({ ...formData, sector_id: "" });
                              setOpenSector(false);
                            }}
                          >
                            <Check className="mr-2 h-4 w-4 opacity-0" />
                            لا شيء
                          </CommandItem>
                          {sectors.map((sector) => (
                            <CommandItem
                              key={sector.id}
                              value={sector.name}
                              onSelect={() => {
                                setFormData({ ...formData, sector_id: sector.id });
                                setOpenSector(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  formData.sector_id === sector.id ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {sector.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label>مدير الحدث</Label>
              <Popover open={openEventManager} onOpenChange={setOpenEventManager}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openEventManager}
                    className="w-full justify-between"
                  >
                    {formData.event_manager_id
                      ? eventManagers.find((manager) => manager.id === formData.event_manager_id)?.name
                      : "اختر مدير الحدث..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="البحث في المديرين..." />
                    <CommandList>
                      <CommandEmpty>لا يوجد مدير.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value=""
                          onSelect={() => {
                            setFormData({ ...formData, event_manager_id: "" });
                            setOpenEventManager(false);
                          }}
                        >
                          <Check className="mr-2 h-4 w-4 opacity-0" />
                          لا شيء
                        </CommandItem>
                        {eventManagers.map((manager) => (
                          <CommandItem
                            key={manager.id}
                            value={manager.name || manager.email}
                            onSelect={() => {
                              setFormData({ ...formData, event_manager_id: manager.id });
                              setOpenEventManager(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                formData.event_manager_id === manager.id ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {manager.name || manager.email}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Challenges */}
            <div>
              <Label className="text-base font-medium mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                التحديات ذات الصلة
              </Label>
              <div className="space-y-2">
                <Input
                  placeholder="البحث في التحديات..."
                  value={challengeSearch}
                  onChange={(e) => setChallengeSearch(e.target.value)}
                />
                <div className="border rounded-md max-h-40 overflow-y-auto">
                  {challenges
                    .filter(challenge => 
                      challenge.title_ar.toLowerCase().includes(challengeSearch.toLowerCase())
                    )
                    .map((challenge) => (
                      <div key={challenge.id} className="flex items-center space-x-2 p-2 hover:bg-muted">
                        <input
                          type="checkbox"
                          id={`challenge-${challenge.id}`}
                          checked={selectedChallenges.includes(challenge.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedChallenges([...selectedChallenges, challenge.id]);
                            } else {
                              setSelectedChallenges(selectedChallenges.filter(id => id !== challenge.id));
                            }
                          }}
                        />
                        <label htmlFor={`challenge-${challenge.id}`} className="text-sm flex-1 cursor-pointer">
                          {challenge.title_ar}
                        </label>
                      </div>
                    ))}
                </div>
                {selectedChallenges.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedChallenges.map((challengeId) => {
                      const challenge = challenges.find(c => c.id === challengeId);
                      return (
                        <Badge key={challengeId} variant="secondary" className="text-xs">
                          {challenge?.title_ar}
                          <X
                            className="ml-1 h-3 w-3 cursor-pointer"
                            onClick={() => setSelectedChallenges(selectedChallenges.filter(id => id !== challengeId))}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Partners */}
            <div>
              <Label className="text-base font-medium mb-3 flex items-center gap-2">
                <Building className="h-4 w-4" />
                المنظمات الشريكة
              </Label>
              <div className="space-y-2">
                <Input
                  placeholder="البحث في الشركاء..."
                  value={partnerSearch}
                  onChange={(e) => setPartnerSearch(e.target.value)}
                />
                <div className="border rounded-md max-h-40 overflow-y-auto">
                  {partners
                    .filter(partner => 
                      partner.name.toLowerCase().includes(partnerSearch.toLowerCase())
                    )
                    .map((partner) => (
                      <div key={partner.id} className="flex items-center space-x-2 p-2 hover:bg-muted">
                        <input
                          type="checkbox"
                          id={`partner-${partner.id}`}
                          checked={selectedPartners.includes(partner.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPartners([...selectedPartners, partner.id]);
                            } else {
                              setSelectedPartners(selectedPartners.filter(id => id !== partner.id));
                            }
                          }}
                        />
                        <label htmlFor={`partner-${partner.id}`} className="text-sm flex-1 cursor-pointer">
                          {partner.name}
                        </label>
                      </div>
                    ))}
                </div>
                {selectedPartners.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedPartners.map((partnerId) => {
                      const partner = partners.find(p => p.id === partnerId);
                      return (
                        <Badge key={partnerId} variant="secondary" className="text-xs">
                          {partner?.name}
                          <X
                            className="ml-1 h-3 w-3 cursor-pointer"
                            onClick={() => setSelectedPartners(selectedPartners.filter(id => id !== partnerId))}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Stakeholders */}
            <div>
              <Label className="text-base font-medium mb-3 flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                أصحاب المصلحة الرئيسيون
              </Label>
              <div className="space-y-2">
                <Input
                  placeholder="البحث في أصحاب المصلحة..."
                  value={stakeholderSearch}
                  onChange={(e) => setStakeholderSearch(e.target.value)}
                />
                <div className="border rounded-md max-h-40 overflow-y-auto">
                  {stakeholders
                    .filter(stakeholder => 
                      stakeholder.name.toLowerCase().includes(stakeholderSearch.toLowerCase())
                    )
                    .map((stakeholder) => (
                      <div key={stakeholder.id} className="flex items-center space-x-2 p-2 hover:bg-muted">
                        <input
                          type="checkbox"
                          id={`stakeholder-${stakeholder.id}`}
                          checked={selectedStakeholders.includes(stakeholder.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStakeholders([...selectedStakeholders, stakeholder.id]);
                            } else {
                              setSelectedStakeholders(selectedStakeholders.filter(id => id !== stakeholder.id));
                            }
                          }}
                        />
                        <label htmlFor={`stakeholder-${stakeholder.id}`} className="text-sm flex-1 cursor-pointer">
                          {stakeholder.name}
                        </label>
                      </div>
                    ))}
                </div>
                {selectedStakeholders.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedStakeholders.map((stakeholderId) => {
                      const stakeholder = stakeholders.find(s => s.id === stakeholderId);
                      return (
                        <Badge key={stakeholderId} variant="secondary" className="text-xs">
                          {stakeholder?.name}
                          <X
                            className="ml-1 h-3 w-3 cursor-pointer"
                            onClick={() => setSelectedStakeholders(selectedStakeholders.filter(id => id !== stakeholderId))}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {/* Focus Questions */}
            <div>
              <Label className="text-base font-medium mb-3 flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                أسئلة التركيز
              </Label>
              <div className="space-y-2">
                <Input
                  placeholder="البحث في أسئلة التركيز..."
                  value={focusQuestionSearch}
                  onChange={(e) => setFocusQuestionSearch(e.target.value)}
                />
                <div className="border rounded-md max-h-40 overflow-y-auto">
                  {focusQuestions
                    .filter(question => 
                      question.question_text_ar.toLowerCase().includes(focusQuestionSearch.toLowerCase())
                    )
                    .map((question) => (
                      <div key={question.id} className="flex items-center space-x-2 p-2 hover:bg-muted">
                        <input
                          type="checkbox"
                          id={`question-${question.id}`}
                          checked={selectedFocusQuestions.includes(question.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFocusQuestions([...selectedFocusQuestions, question.id]);
                            } else {
                              setSelectedFocusQuestions(selectedFocusQuestions.filter(id => id !== question.id));
                            }
                          }}
                        />
                        <label htmlFor={`question-${question.id}`} className="text-sm flex-1 cursor-pointer">
                          {question.question_text_ar}
                        </label>
                      </div>
                    ))}
                </div>
                {selectedFocusQuestions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedFocusQuestions.map((questionId) => {
                      const question = focusQuestions.find(q => q.id === questionId);
                      return (
                        <Badge key={questionId} variant="secondary" className="text-xs">
                          {question?.question_text_ar.substring(0, 50)}...
                          <X
                            className="ml-1 h-3 w-3 cursor-pointer"
                            onClick={() => setSelectedFocusQuestions(selectedFocusQuestions.filter(id => id !== questionId))}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <Label className="text-base font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                إعدادات إضافية
              </Label>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="inherit_from_campaign" className="font-medium">وراثة الإعدادات من الحملة</Label>
                  <p className="text-sm text-muted-foreground">استخدام إعدادات الحملة الأساسية لهذا الحدث</p>
                </div>
                <Switch
                  id="inherit_from_campaign"
                  checked={formData.inherit_from_campaign}
                  onCheckedChange={(checked) => setFormData({ ...formData, inherit_from_campaign: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="is_recurring" className="font-medium">حدث متكرر</Label>
                  <p className="text-sm text-muted-foreground">تكرار هذا الحدث وفقاً لجدولة محددة</p>
                </div>
                <Switch
                  id="is_recurring"
                  checked={formData.is_recurring}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_recurring: checked })}
                />
              </div>

              {formData.is_recurring && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label htmlFor="recurrence_pattern">نمط التكرار</Label>
                    <Select
                      value={formData.recurrence_pattern}
                      onValueChange={(value) => setFormData({ ...formData, recurrence_pattern: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النمط" />
                      </SelectTrigger>
                      <SelectContent>
                        {recurrencePatternOptions.map(pattern => (
                          <SelectItem key={pattern} value={pattern}>
                            {pattern === 'daily' ? 'يومي' : pattern === 'weekly' ? 'أسبوعي' : pattern === 'monthly' ? 'شهري' : pattern === 'yearly' ? 'سنوي' : pattern}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="recurrence_end_date">تاريخ انتهاء التكرار</Label>
                    <Input
                      id="recurrence_end_date"
                      type="date"
                      value={formData.recurrence_end_date}
                      onChange={(e) => setFormData({ ...formData, recurrence_end_date: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = [
    "المعلومات الأساسية",
    "تفاصيل الحدث", 
    "التنظيم",
    "العلاقات",
    "الأسئلة والإعدادات"
  ];

  const stepIcons = [
    Calendar,
    Clock,
    Building,
    Users,
    Settings
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {event ? "تعديل الحدث" : "إنشاء حدث جديد"}
          </DialogTitle>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex items-center justify-between mb-6">
          {Array.from({ length: totalSteps }, (_, i) => {
            const step = i + 1;
            const Icon = stepIcons[i];
            const isActive = step === currentStep;
            const isCompleted = step < currentStep;
            const hasError = stepErrors[step]?.length > 0;

            return (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    hasError
                      ? "bg-destructive text-destructive-foreground"
                      : isCompleted || isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="ml-2 text-sm font-medium">{stepTitles[i]}</div>
                {step < totalSteps && (
                  <div
                    className={`w-8 h-px mx-2 ${
                      isCompleted ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium">{stepTitles[currentStep - 1]}</h3>
          <p className="text-sm text-muted-foreground">
            الخطوة {currentStep} من {totalSteps}
          </p>
        </div>

        {renderStepContent()}

        {/* Navigation buttons */}
        <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              السابق
            </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            {currentStep === totalSteps ? (
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "جاري الحفظ..." : event ? "تحديث الحدث" : "إنشاء الحدث"}
              </Button>
            ) : (
              <Button onClick={nextStep}>
                التالي
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}