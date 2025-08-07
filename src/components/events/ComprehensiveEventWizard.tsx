import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Upload,
  X,
  Plus,
  Building2,
  Target,
  Settings,
  FileText,
  Image as ImageIcon,
  Video,
  Link,
  Globe,
  Eye,
  EyeOff,
  UserPlus,
  Handshake
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';

interface EventFormData {
  id?: string;
  title_ar: string;
  description_ar: string;
  event_type: string;
  event_category: string;
  event_date: string;
  start_time: string;
  end_time: string;
  end_date?: string;
  location?: string;
  virtual_link?: string;
  format: string;
  status: string;
  max_participants?: number;
  budget?: number;
  event_visibility: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
  target_stakeholder_groups: string[];
  partner_organizations: string[];
  related_focus_questions: string[];
  image_url?: string;
  inherit_from_campaign: boolean;
  campaign_id?: string;
  challenge_id?: string;
  sector_id?: string;
  // New participant fields
  registration_type?: string;
  registration_fee?: number;
  requires_approval?: boolean;
  allow_waitlist?: boolean;
  participant_requirements?: string;
  selection_criteria?: string;
  // New resource fields
  live_stream_url?: string;
  recording_url?: string;
  additional_links?: string;
  // New settings fields
  email_reminders?: boolean;
  sms_notifications?: boolean;
  auto_confirmation?: boolean;
  reminder_schedule?: string;
  enable_feedback?: boolean;
  enable_qr_checkin?: boolean;
  enable_networking?: boolean;
  record_sessions?: boolean;
  event_language?: string;
  timezone?: string;
}

interface ComprehensiveEventWizardProps {
  isOpen: boolean;
  onClose: () => void;
  event?: any;
  onSave: (eventData: EventFormData) => void;
}

const initialFormData: EventFormData = {
  title_ar: '',
  description_ar: '',
  event_type: 'conference',
  event_category: 'standalone',
  event_date: '',
  start_time: '09:00',
  end_time: '17:00',
  format: 'in_person',
  status: 'scheduled',
  event_visibility: 'public',
  is_recurring: false,
  target_stakeholder_groups: [],
  partner_organizations: [],
  related_focus_questions: [],
  inherit_from_campaign: false
};

// Helper function to get Arabic stakeholder type names
const getStakeholderTypeArabic = (type: string) => {
  const types: { [key: string]: string } = {
    'government': 'حكومي',
    'private': 'خاص',
    'academic': 'أكاديمي',
    'civil_society': 'المجتمع المدني',
    'international': 'دولي',
    'media': 'إعلامي'
  };
  return types[type] || type;
};

export const ComprehensiveEventWizard = ({
  isOpen,
  onClose,
  event,
  onSave
}: ComprehensiveEventWizardProps) => {
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [resources, setResources] = useState<any[]>([]);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [selectedStakeholders, setSelectedStakeholders] = useState<string[]>([]);
  const [availablePartners, setAvailablePartners] = useState<any[]>([]);
  const [availableStakeholders, setAvailableStakeholders] = useState<any[]>([]);
  const [availableCampaigns, setAvailableCampaigns] = useState<any[]>([]);
  const [availableChallenges, setAvailableChallenges] = useState<any[]>([]);
  const [availableSectors, setAvailableSectors] = useState<any[]>([]);

  // Load initial data
  useEffect(() => {
    if (isOpen) {
      loadInitialData();
      if (event) {
        setFormData(event);
        setImagePreview(event.image_url || '');
      } else {
        setFormData(initialFormData);
        setImagePreview('');
      }
    }
  }, [isOpen, event]);

  const loadInitialData = async () => {
    try {
      // Load partners
      const { data: partners } = await supabase
        .from('partners')
        .select('*')
        .order('name_ar');
      setAvailablePartners(partners || []);

      // Load stakeholders  
      const { data: stakeholders } = await supabase
        .from('stakeholders')
        .select('*')
        .order('name_ar');
      setAvailableStakeholders(stakeholders || []);

      // Load campaigns
      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('*')
        .order('title_ar');
      setAvailableCampaigns(campaigns || []);

      // Load challenges
      const { data: challenges } = await supabase
        .from('challenges')
        .select('*')
        .order('title_ar');
      setAvailableChallenges(challenges || []);

      // Load sectors
      const { data: sectors } = await supabase
        .from('sectors')
        .select('*')
        .order('name_ar');
      setAvailableSectors(sectors || []);

    } catch (error) {
      logger.error('Error loading initial data', { 
        component: 'ComprehensiveEventWizard', 
        action: 'loadInitialData'
      }, error as Error);
    }
  };

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `event-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-resources')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('event-resources')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      setImagePreview(publicUrl);
      
      toast({
        title: isRTL ? 'تم رفع الصورة بنجاح' : 'Image uploaded successfully',
      });
    } catch (error) {
      logger.error('Error uploading image', { 
        component: 'ComprehensiveEventWizard', 
        action: 'handleImageUpload',
        data: { fileName: file?.name }
      }, error as Error);
      toast({
        title: isRTL ? 'خطأ في رفع الصورة' : 'Error uploading image',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.title_ar || !formData.description_ar || !formData.event_date) {
        toast({
          title: isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields',
          variant: 'destructive'
        });
        return;
      }

      // Save event
      const eventData = {
        ...formData,
        // Convert "none" values back to null for database
        challenge_id: formData.challenge_id === 'none' ? null : formData.challenge_id,
        sector_id: formData.sector_id === 'none' ? null : formData.sector_id,
        event_manager_id: user?.id,
        registered_participants: event?.registered_participants || 0,
        actual_participants: event?.actual_participants || 0
      };

      let savedEventId = formData.id;

      if (formData.id) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', formData.id);
        
        if (error) throw error;
      } else {
        // Create new event
        const { data, error } = await supabase
          .from('events')
          .insert([eventData])
          .select()
          .single();
        
        if (error) throw error;
        savedEventId = data.id;
      }

      // Save partner links
      if (selectedPartners.length > 0) {
        await supabase
          .from('event_partner_links')
          .delete()
          .eq('event_id', savedEventId);

        const partnerLinks = selectedPartners.map(partnerId => ({
          event_id: savedEventId,
          partner_id: partnerId
        }));

        await supabase
          .from('event_partner_links')
          .insert(partnerLinks);
      }

      // Save stakeholder links
      if (selectedStakeholders.length > 0) {
        await supabase
          .from('event_stakeholder_links')
          .delete()
          .eq('event_id', savedEventId);

        const stakeholderLinks = selectedStakeholders.map(stakeholderId => ({
          event_id: savedEventId,
          stakeholder_id: stakeholderId
        }));

        await supabase
          .from('event_stakeholder_links')
          .insert(stakeholderLinks);
      }

      toast({
        title: isRTL ? 'تم حفظ الفعالية بنجاح' : 'Event saved successfully',
      });

      onSave(eventData);
      onClose();
    } catch (error) {
      logger.error('Error saving event', { 
        component: 'ComprehensiveEventWizard', 
        action: 'handleSave',
        data: { eventId: formData.id, isEditing: !!formData.id }
      }, error as Error);
      toast({
        title: isRTL ? 'خطأ في حفظ الفعالية' : 'Error saving event',
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {event ? 
              (isRTL ? 'تعديل الفعالية' : 'Edit Event') : 
              (isRTL ? 'إنشاء فعالية جديدة' : 'Create New Event')
            }
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="basic">{isRTL ? 'أساسي' : 'Basic'}</TabsTrigger>
            <TabsTrigger value="details">{isRTL ? 'التفاصيل' : 'Details'}</TabsTrigger>
            <TabsTrigger value="scheduling">{isRTL ? 'الجدولة' : 'Scheduling'}</TabsTrigger>
            <TabsTrigger value="participants">{isRTL ? 'المشاركون' : 'Participants'}</TabsTrigger>
            <TabsTrigger value="resources">{isRTL ? 'الموارد' : 'Resources'}</TabsTrigger>
            <TabsTrigger value="settings">{isRTL ? 'الإعدادات' : 'Settings'}</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">{isRTL ? 'عنوان الفعالية *' : 'Event Title *'}</Label>
                  <Input
                    id="title"
                    value={formData.title_ar}
                    onChange={(e) => handleInputChange('title_ar', e.target.value)}
                    placeholder={isRTL ? 'أدخل عنوان الفعالية' : 'Enter event title'}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">{isRTL ? 'وصف الفعالية *' : 'Event Description *'}</Label>
                  <Textarea
                    id="description"
                    value={formData.description_ar}
                    onChange={(e) => handleInputChange('description_ar', e.target.value)}
                    placeholder={isRTL ? 'أدخل وصف الفعالية' : 'Enter event description'}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{isRTL ? 'نوع الفعالية' : 'Event Type'}</Label>
                    <Select value={formData.event_type} onValueChange={(value) => handleInputChange('event_type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conference">{isRTL ? 'مؤتمر' : 'Conference'}</SelectItem>
                        <SelectItem value="workshop">{isRTL ? 'ورشة عمل' : 'Workshop'}</SelectItem>
                        <SelectItem value="seminar">{isRTL ? 'ندوة' : 'Seminar'}</SelectItem>
                        <SelectItem value="training">{isRTL ? 'تدريب' : 'Training'}</SelectItem>
                        <SelectItem value="expo">{isRTL ? 'معرض' : 'Exhibition'}</SelectItem>
                        <SelectItem value="hackathon">{isRTL ? 'هاكاثون' : 'Hackathon'}</SelectItem>
                        <SelectItem value="summit">{isRTL ? 'قمة' : 'Summit'}</SelectItem>
                        <SelectItem value="forum">{isRTL ? 'منتدى' : 'Forum'}</SelectItem>
                        <SelectItem value="networking">{isRTL ? 'شبكات تواصل' : 'Networking'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{isRTL ? 'تصنيف الفعالية' : 'Event Category'}</Label>
                    <Select value={formData.event_category} onValueChange={(value) => handleInputChange('event_category', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standalone">{isRTL ? 'مستقلة' : 'Standalone'}</SelectItem>
                        <SelectItem value="campaign">{isRTL ? 'جزء من حملة' : 'Campaign Event'}</SelectItem>
                        <SelectItem value="challenge">{isRTL ? 'مرتبطة بتحدي' : 'Challenge Event'}</SelectItem>
                        <SelectItem value="series">{isRTL ? 'سلسلة فعاليات' : 'Event Series'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>{isRTL ? 'صيغة الفعالية' : 'Event Format'}</Label>
                  <Select value={formData.format} onValueChange={(value) => handleInputChange('format', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_person">{isRTL ? 'حضوري' : 'In-Person'}</SelectItem>
                      <SelectItem value="virtual">{isRTL ? 'افتراضي' : 'Virtual'}</SelectItem>
                      <SelectItem value="hybrid">{isRTL ? 'مختلط' : 'Hybrid'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <div>
                  <Label>{isRTL ? 'صورة الفعالية' : 'Event Image'}</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Event preview"
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setImagePreview('');
                            setFormData(prev => ({ ...prev, image_url: '' }));
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground" />
                        <div>
                          <Button variant="outline" asChild>
                            <label htmlFor="image-upload" className="cursor-pointer">
                              <Upload className="w-4 h-4 mr-2" />
                              {isRTL ? 'رفع صورة' : 'Upload Image'}
                            </label>
                          </Button>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setImageFile(file);
                                handleImageUpload(file);
                              }
                            }}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? 'اسحب وأفلت أو انقر لرفع صورة' : 'Drag & drop or click to upload image'}
                        </p>
                      </div>
                    )}
                    {uploading && (
                      <div className="mt-4">
                        <Progress value={50} className="w-full" />
                        <p className="text-sm text-muted-foreground mt-2">
                          {isRTL ? 'جاري رفع الصورة...' : 'Uploading image...'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status and Visibility */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{isRTL ? 'حالة الفعالية' : 'Event Status'}</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="مجدول">{isRTL ? 'مجدول' : 'Scheduled'}</SelectItem>
                        <SelectItem value="جاري">{isRTL ? 'جاري' : 'Ongoing'}</SelectItem>
                        <SelectItem value="مكتمل">{isRTL ? 'مكتمل' : 'Completed'}</SelectItem>
                        <SelectItem value="ملغي">{isRTL ? 'ملغي' : 'Cancelled'}</SelectItem>
                        <SelectItem value="مؤجل">{isRTL ? 'مؤجل' : 'Postponed'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{isRTL ? 'مستوى الرؤية' : 'Visibility Level'}</Label>
                    <Select value={formData.event_visibility} onValueChange={(value) => handleInputChange('event_visibility', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            {isRTL ? 'عامة' : 'Public'}
                          </div>
                        </SelectItem>
                        <SelectItem value="internal">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            {isRTL ? 'داخلية' : 'Internal'}
                          </div>
                        </SelectItem>
                        <SelectItem value="restricted">
                          <div className="flex items-center gap-2">
                            <EyeOff className="w-4 h-4" />
                            {isRTL ? 'مقيدة' : 'Restricted'}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="location">{isRTL ? 'المكان' : 'Location'}</Label>
                  <Input
                    id="location"
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder={isRTL ? 'أدخل مكان الفعالية' : 'Enter event location'}
                  />
                </div>

                {(formData.format === 'virtual' || formData.format === 'hybrid') && (
                  <div>
                    <Label htmlFor="virtual_link">{isRTL ? 'رابط الاجتماع الافتراضي' : 'Virtual Meeting Link'}</Label>
                    <Input
                      id="virtual_link"
                      type="url"
                      value={formData.virtual_link || ''}
                      onChange={(e) => handleInputChange('virtual_link', e.target.value)}
                      placeholder={isRTL ? 'أدخل رابط الاجتماع' : 'Enter meeting link'}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="max_participants">{isRTL ? 'الحد الأقصى للمشاركين' : 'Max Participants'}</Label>
                    <Input
                      id="max_participants"
                      type="number"
                      value={formData.max_participants || ''}
                      onChange={(e) => handleInputChange('max_participants', parseInt(e.target.value) || undefined)}
                      placeholder={isRTL ? 'غير محدود' : 'Unlimited'}
                    />
                  </div>

                  <div>
                    <Label htmlFor="budget">{isRTL ? 'الميزانية (ر.س)' : 'Budget (SAR)'}</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget || ''}
                      onChange={(e) => handleInputChange('budget', parseInt(e.target.value) || undefined)}
                      placeholder={isRTL ? 'مجاني' : 'Free'}
                    />
                  </div>
                </div>

                {/* Campaign/Challenge Links */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={formData.inherit_from_campaign}
                      onCheckedChange={(checked) => handleInputChange('inherit_from_campaign', checked)}
                    />
                    <Label>{isRTL ? 'ربط بحملة' : 'Link to Campaign'}</Label>
                  </div>

                  {formData.inherit_from_campaign && (
                    <Select value={formData.campaign_id || ''} onValueChange={(value) => handleInputChange('campaign_id', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? 'اختر حملة' : 'Select Campaign'} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCampaigns.map((campaign) => (
                          <SelectItem key={campaign.id} value={campaign.id}>
                            {campaign.title_ar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  <div>
                    <Label>{isRTL ? 'ربط بتحدي' : 'Link to Challenge'}</Label>
                    <Select value={formData.challenge_id || ''} onValueChange={(value) => handleInputChange('challenge_id', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? 'اختر تحدي (اختياري)' : 'Select Challenge (Optional)'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{isRTL ? 'لا يوجد' : 'None'}</SelectItem>
                        {availableChallenges.map((challenge) => (
                          <SelectItem key={challenge.id} value={challenge.id}>
                            {challenge.title_ar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{isRTL ? 'القطاع' : 'Sector'}</Label>
                    <Select value={formData.sector_id || ''} onValueChange={(value) => handleInputChange('sector_id', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? 'اختر قطاع (اختياري)' : 'Select Sector (Optional)'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{isRTL ? 'لا يوجد' : 'None'}</SelectItem>
                        {availableSectors.map((sector) => (
                          <SelectItem key={sector.id} value={sector.id}>
                            {sector.name_ar || sector.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Partners Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Handshake className="w-5 h-5" />
                      {isRTL ? 'الشركاء' : 'Partners'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {availablePartners.map((partner) => (
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
                          <Label htmlFor={`partner-${partner.id}`} className="flex-1">
                            {partner.name_ar || partner.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Stakeholders Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <UserPlus className="w-5 h-5" />
                      {isRTL ? 'أصحاب المصلحة' : 'Stakeholders'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {availableStakeholders.map((stakeholder) => (
                        <div key={stakeholder.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`stakeholder-${stakeholder.id}`}
                            checked={selectedStakeholders.includes(stakeholder.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedStakeholders(prev => [...prev, stakeholder.id]);
                              } else {
                                setSelectedStakeholders(prev => prev.filter(id => id !== stakeholder.id));
                              }
                            }}
                          />
                          <Label htmlFor={`stakeholder-${stakeholder.id}`} className="flex-1">
                            {stakeholder.name_ar || stakeholder.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Scheduling Tab */}
          <TabsContent value="scheduling" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="event_date">{isRTL ? 'تاريخ الفعالية *' : 'Event Date *'}</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => handleInputChange('event_date', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_time">{isRTL ? 'وقت البداية' : 'Start Time'}</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => handleInputChange('start_time', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="end_time">{isRTL ? 'وقت النهاية' : 'End Time'}</Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => handleInputChange('end_time', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="end_date">{isRTL ? 'تاريخ الانتهاء (للفعاليات متعددة الأيام)' : 'End Date (For Multi-day Events)'}</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date || ''}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {isRTL ? 'الفعاليات المتكررة' : 'Recurring Events'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.is_recurring}
                        onCheckedChange={(checked) => handleInputChange('is_recurring', checked)}
                      />
                      <Label>{isRTL ? 'فعالية متكررة' : 'Recurring Event'}</Label>
                    </div>

                    {formData.is_recurring && (
                      <>
                        <div>
                          <Label>{isRTL ? 'نمط التكرار' : 'Recurrence Pattern'}</Label>
                          <Select
                            value={formData.recurrence_pattern || ''}
                            onValueChange={(value) => handleInputChange('recurrence_pattern', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={isRTL ? 'اختر نمط التكرار' : 'Select recurrence pattern'} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">{isRTL ? 'يومي' : 'Daily'}</SelectItem>
                              <SelectItem value="weekly">{isRTL ? 'أسبوعي' : 'Weekly'}</SelectItem>
                              <SelectItem value="monthly">{isRTL ? 'شهري' : 'Monthly'}</SelectItem>
                              <SelectItem value="yearly">{isRTL ? 'سنوي' : 'Yearly'}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="recurrence_end_date">{isRTL ? 'تاريخ انتهاء التكرار' : 'Recurrence End Date'}</Label>
                          <Input
                            id="recurrence_end_date"
                            type="date"
                            value={formData.recurrence_end_date || ''}
                            onChange={(e) => handleInputChange('recurrence_end_date', e.target.value)}
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Continue with other tabs... */}
          {/* For now, showing placeholders for the remaining tabs */}
          <TabsContent value="participants" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Participant Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {isRTL ? 'إعدادات المشاركين' : 'Participant Settings'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>{isRTL ? 'الحد الأقصى للمشاركين' : 'Maximum Participants'}</Label>
                    <Input
                      type="number"
                      value={formData.max_participants || ''}
                      onChange={(e) => handleInputChange('max_participants', parseInt(e.target.value) || null)}
                      placeholder={isRTL ? 'غير محدود' : 'Unlimited'}
                    />
                  </div>

                  <div>
                    <Label>{isRTL ? 'نوع التسجيل' : 'Registration Type'}</Label>
                    <Select value={formData.registration_type || 'open'} onValueChange={(value) => handleInputChange('registration_type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">{isRTL ? 'مفتوح للجميع' : 'Open to All'}</SelectItem>
                        <SelectItem value="invite_only">{isRTL ? 'بدعوة فقط' : 'Invite Only'}</SelectItem>
                        <SelectItem value="approval_required">{isRTL ? 'يتطلب موافقة' : 'Approval Required'}</SelectItem>
                        <SelectItem value="paid">{isRTL ? 'مدفوع' : 'Paid'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{isRTL ? 'رسوم التسجيل (ر.س)' : 'Registration Fee (SAR)'}</Label>
                    <Input
                      type="number"
                      value={formData.registration_fee || ''}
                      onChange={(e) => handleInputChange('registration_fee', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="requires_approval"
                      checked={formData.requires_approval || false}
                      onCheckedChange={(checked) => handleInputChange('requires_approval', checked)}
                    />
                    <Label htmlFor="requires_approval">
                      {isRTL ? 'يتطلب موافقة المنظم' : 'Requires Organizer Approval'}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allow_waitlist"
                      checked={formData.allow_waitlist || false}
                      onCheckedChange={(checked) => handleInputChange('allow_waitlist', checked)}
                    />
                    <Label htmlFor="allow_waitlist">
                      {isRTL ? 'السماح بقائمة الانتظار' : 'Allow Waitlist'}
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Target Stakeholder Groups */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    {isRTL ? 'المجموعات المستهدفة' : 'Target Groups'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>{isRTL ? 'أصحاب المصلحة المستهدفون' : 'Target Stakeholders'}</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {['government', 'private', 'academic', 'civil_society', 'international', 'media'].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`stakeholder_${type}`}
                            checked={formData.target_stakeholder_groups?.includes(type) || false}
                            onCheckedChange={(checked) => {
                              const current = formData.target_stakeholder_groups || [];
                              const updated = checked 
                                ? [...current, type]
                                : current.filter(t => t !== type);
                              handleInputChange('target_stakeholder_groups', updated);
                            }}
                          />
                          <Label htmlFor={`stakeholder_${type}`} className="text-sm">
                            {isRTL ? getStakeholderTypeArabic(type) : type.replace('_', ' ').toUpperCase()}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>{isRTL ? 'متطلبات خاصة للمشاركين' : 'Special Requirements'}</Label>
                    <Textarea
                      value={formData.participant_requirements || ''}
                      onChange={(e) => handleInputChange('participant_requirements', e.target.value)}
                      placeholder={isRTL ? 'أي متطلبات خاصة للمشاركة...' : 'Any special requirements for participation...'}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>{isRTL ? 'معايير الاختيار' : 'Selection Criteria'}</Label>
                    <Textarea
                      value={formData.selection_criteria || ''}
                      onChange={(e) => handleInputChange('selection_criteria', e.target.value)}
                      placeholder={isRTL ? 'معايير اختيار المشاركين...' : 'Criteria for selecting participants...'}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="space-y-6">
              {/* Resource Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {isRTL ? 'موارد الفعالية' : 'Event Resources'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>{isRTL ? 'رفع الملفات' : 'Upload Files'}</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <div className="text-center">
                          <p className="text-sm font-medium">
                            {isRTL ? 'اسحب الملفات هنا أو انقر للاختيار' : 'Drag files here or click to select'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {isRTL ? 'PDF, DOC, PPT, صور، فيديوهات (حتى 50MB)' : 'PDF, DOC, PPT, Images, Videos (up to 50MB)'}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          {isRTL ? 'اختر الملفات' : 'Choose Files'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>{isRTL ? 'مواد تحضيرية' : 'Pre-event Materials'}</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">{isRTL ? 'دليل المشارك' : 'Participant Guide'}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">{isRTL ? 'جدول الأعمال' : 'Agenda'}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>{isRTL ? 'مواد الفعالية' : 'Event Materials'}</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            <span className="text-sm">{isRTL ? 'تسجيلات الفعالية' : 'Event Recordings'}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">{isRTL ? 'العروض التقديمية' : 'Presentations'}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{isRTL ? 'روابط مفيدة' : 'Useful Links'}</Label>
                    <div className="space-y-2">
                      <Input
                        placeholder={isRTL ? 'رابط البث المباشر' : 'Live stream link'}
                        value={formData.live_stream_url || ''}
                        onChange={(e) => handleInputChange('live_stream_url', e.target.value)}
                      />
                      <Input
                        placeholder={isRTL ? 'رابط التسجيل' : 'Recording link'}
                        value={formData.recording_url || ''}
                        onChange={(e) => handleInputChange('recording_url', e.target.value)}
                      />
                      <Input
                        placeholder={isRTL ? 'روابط إضافية' : 'Additional links'}
                        value={formData.additional_links || ''}
                        onChange={(e) => handleInputChange('additional_links', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    {isRTL ? 'إعدادات الإشعارات' : 'Notification Settings'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email_reminders"
                      checked={formData.email_reminders || false}
                      onCheckedChange={(checked) => handleInputChange('email_reminders', checked)}
                    />
                    <Label htmlFor="email_reminders">
                      {isRTL ? 'إرسال تذكيرات بالبريد الإلكتروني' : 'Send email reminders'}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sms_notifications"
                      checked={formData.sms_notifications || false}
                      onCheckedChange={(checked) => handleInputChange('sms_notifications', checked)}
                    />
                    <Label htmlFor="sms_notifications">
                      {isRTL ? 'إرسال إشعارات SMS' : 'Send SMS notifications'}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="auto_confirmation"
                      checked={formData.auto_confirmation || false}
                      onCheckedChange={(checked) => handleInputChange('auto_confirmation', checked)}
                    />
                    <Label htmlFor="auto_confirmation">
                      {isRTL ? 'تأكيد تلقائي للتسجيل' : 'Auto-confirm registrations'}
                    </Label>
                  </div>

                  <div>
                    <Label>{isRTL ? 'تذكير قبل الفعالية بـ' : 'Remind before event'}</Label>
                    <Select value={formData.reminder_schedule || '24h'} onValueChange={(value) => handleInputChange('reminder_schedule', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">{isRTL ? 'ساعة واحدة' : '1 hour'}</SelectItem>
                        <SelectItem value="24h">{isRTL ? 'يوم واحد' : '1 day'}</SelectItem>
                        <SelectItem value="48h">{isRTL ? 'يومين' : '2 days'}</SelectItem>
                        <SelectItem value="1w">{isRTL ? 'أسبوع' : '1 week'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    {isRTL ? 'إعدادات متقدمة' : 'Advanced Settings'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enable_feedback"
                      checked={formData.enable_feedback || false}
                      onCheckedChange={(checked) => handleInputChange('enable_feedback', checked)}
                    />
                    <Label htmlFor="enable_feedback">
                      {isRTL ? 'تفعيل نظام التقييم' : 'Enable feedback system'}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enable_qr_checkin"
                      checked={formData.enable_qr_checkin || false}
                      onCheckedChange={(checked) => handleInputChange('enable_qr_checkin', checked)}
                    />
                    <Label htmlFor="enable_qr_checkin">
                      {isRTL ? 'تفعيل تسجيل الدخول بـ QR' : 'Enable QR check-in'}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enable_networking"
                      checked={formData.enable_networking || false}
                      onCheckedChange={(checked) => handleInputChange('enable_networking', checked)}
                    />
                    <Label htmlFor="enable_networking">
                      {isRTL ? 'تفعيل منصة التواصل' : 'Enable networking platform'}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="record_sessions"
                      checked={formData.record_sessions || false}
                      onCheckedChange={(checked) => handleInputChange('record_sessions', checked)}
                    />
                    <Label htmlFor="record_sessions">
                      {isRTL ? 'تسجيل الجلسات' : 'Record sessions'}
                    </Label>
                  </div>

                  <div>
                    <Label>{isRTL ? 'لغة الفعالية' : 'Event Language'}</Label>
                    <Select value={formData.event_language || 'ar'} onValueChange={(value) => handleInputChange('event_language', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">{isRTL ? 'العربية' : 'Arabic'}</SelectItem>
                        <SelectItem value="en">{isRTL ? 'الإنجليزية' : 'English'}</SelectItem>
                        <SelectItem value="both">{isRTL ? 'ثنائية اللغة' : 'Bilingual'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{isRTL ? 'منطقة زمنية' : 'Timezone'}</Label>
                    <Select value={formData.timezone || 'Asia/Riyadh'} onValueChange={(value) => handleInputChange('timezone', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Riyadh">{isRTL ? 'الرياض' : 'Riyadh'}</SelectItem>
                        <SelectItem value="UTC">{isRTL ? 'التوقيت العالمي' : 'UTC'}</SelectItem>
                        <SelectItem value="America/New_York">{isRTL ? 'نيويورك' : 'New York'}</SelectItem>
                        <SelectItem value="Europe/London">{isRTL ? 'لندن' : 'London'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            {isRTL ? 'إلغاء' : 'Cancel'}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleSave()}>
              {isRTL ? 'حفظ كمسودة' : 'Save as Draft'}
            </Button>
            <Button onClick={handleSave} disabled={uploading}>
              {event ? 
                (isRTL ? 'تحديث الفعالية' : 'Update Event') : 
                (isRTL ? 'إنشاء الفعالية' : 'Create Event')
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};