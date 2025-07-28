import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Calendar, MapPin, Users, Clock, Edit, Trash2, Eye, Download } from "lucide-react";
import { format } from "date-fns";
import { EventWizard } from "@/components/events/EventWizard";
import { AppShell } from "@/components/layout/AppShell";
import { StandardPageLayout } from "@/components/layout/StandardPageLayout";
import { ViewLayouts } from "@/components/ui/view-layouts";
import { ManagementCard } from "@/components/ui/management-card";
import { EmptyState } from "@/components/ui/empty-state";

interface Event {
  id: string;
  title_ar: string;
  description_ar?: string;
  event_type?: string;
  event_date: string;
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
  target_stakeholder_groups?: string[];
  created_at?: string;
  // Relationships for display
  sectors?: any[];
  challenges?: any[];
  partners?: any[];
  stakeholders?: any[];
  focusQuestions?: any[];
}

export function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [selectedSector, setSelectedSector] = useState("all");
  
  // Dialog states
  const [showEventWizard, setShowEventWizard] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
    fetchRelatedData();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, statusFilter, typeFilter, selectedCampaign, selectedSector]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;
      setEvents((data as any) || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الأحداث",
        variant: "destructive",
      });
    }
  };

  const fetchRelatedData = async () => {
    try {
      const [campaignsRes, sectorsRes] = await Promise.all([
        supabase.from('campaigns').select('*').order('title_ar'),
        supabase.from('sectors').select('*').order('name')
      ]);

      setCampaigns(campaignsRes.data || []);
      setSectors(sectorsRes.data || []);
    } catch (error) {
      console.error('Error fetching related data:', error);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title_ar.toLowerCase().includes(searchLower) ||
        (event.description_ar && event.description_ar.toLowerCase().includes(searchLower)) ||
        (event.location && event.location.toLowerCase().includes(searchLower)) ||
        (event.event_type && event.event_type.toLowerCase().includes(searchLower))
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(event => event.event_type === typeFilter);
    }

    if (selectedCampaign !== "all") {
      filtered = filtered.filter(event => event.campaign_id === selectedCampaign);
    }

    if (selectedSector !== "all") {
      filtered = filtered.filter(event => event.sector_id === selectedSector);
    }

    setFilteredEvents(filtered);
  };

  const handleView = async (event: Event) => {
    try {
      const [partnersRes, stakeholdersRes, focusQuestionsRes] = await Promise.all([
        supabase
          .from('event_partner_links')
          .select('partner_id, partners!inner(*)')
          .eq('event_id', event.id),
        supabase
          .from('event_stakeholder_links')
          .select('stakeholder_id, stakeholders!inner(*)')
          .eq('event_id', event.id),
        supabase
          .from('event_focus_question_links')
          .select('focus_question_id, focus_questions!inner(*)')
          .eq('event_id', event.id)
      ]);

      const enhancedEvent = {
        ...event,
        partners: partnersRes.data?.map(item => item.partners) || [],
        stakeholders: stakeholdersRes.data?.map(item => item.stakeholders) || [],
        focusQuestions: focusQuestionsRes.data?.map(item => item.focus_questions) || []
      };

      setViewingEvent(enhancedEvent);
    } catch (error) {
      console.error('Error loading event details:', error);
      setViewingEvent(event);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowEventWizard(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await Promise.all([
        supabase.from('event_partner_links').delete().eq('event_id', id),
        supabase.from('event_stakeholder_links').delete().eq('event_id', id),
        supabase.from('event_focus_question_links').delete().eq('event_id', id),
        supabase.from('event_challenge_links').delete().eq('event_id', id)
      ]);

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "نجح",
        description: "تم حذف الحدث بنجاح",
      });
      
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الحدث",
        variant: "destructive",
      });
    }
  };

  const handleEventSave = () => {
    setShowEventWizard(false);
    setEditingEvent(null);
    fetchEvents();
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setSelectedCampaign("all");
    setSelectedSector("all");
  };

  const hasActiveFilters = () => {
    return statusFilter !== "all" || typeFilter !== "all" || 
           selectedCampaign !== "all" || selectedSector !== "all";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'postponed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'مجدول';
      case 'ongoing': return 'جاري';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      case 'postponed': return 'مؤجل';
      default: return status;
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'in_person': return 'bg-purple-100 text-purple-800';
      case 'virtual': return 'bg-cyan-100 text-cyan-800';
      case 'hybrid': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormatLabel = (format: string) => {
    switch (format) {
      case 'in_person': return 'حضوري';
      case 'virtual': return 'افتراضي';
      case 'hybrid': return 'مختلط';
      default: return format;
    }
  };


  const secondaryActions = (
    <>
      <Select>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="تصدير" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pdf">PDF</SelectItem>
          <SelectItem value="excel">Excel</SelectItem>
          <SelectItem value="csv">CSV</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" className="gap-2">
        <Users className="w-4 h-4" />
        الإجراءات المجمعة
      </Button>
    </>
  );

  const handleLayoutChange = (layout: 'cards' | 'list' | 'grid') => {
    setViewMode(layout);
  };

  const filters = [
    {
      id: 'status',
      label: 'الحالة',
      type: 'select' as const,
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: 'جميع الحالات', value: 'all' },
        { label: 'مجدول', value: 'scheduled' },
        { label: 'جاري', value: 'ongoing' },
        { label: 'مكتمل', value: 'completed' },
        { label: 'ملغي', value: 'cancelled' },
        { label: 'مؤجل', value: 'postponed' }
      ]
    },
    {
      id: 'type',
      label: 'النوع',
      type: 'select' as const,
      value: typeFilter,
      onChange: setTypeFilter,
      options: [
        { label: 'جميع الأنواع', value: 'all' },
        { label: 'ورشة عمل', value: 'workshop' },
        { label: 'ندوة', value: 'seminar' },
        { label: 'مؤتمر', value: 'conference' },
        { label: 'شبكات تواصل', value: 'networking' },
        { label: 'تدريب', value: 'training' }
      ]
    }
  ];

  return (
    <AppShell>
      <StandardPageLayout 
        title="إدارة الأحداث"
        description="إدارة أحداث وأنشطة الابتكار"
        itemCount={filteredEvents.length}
        addButton={{
          label: "إنشاء جديد",
          onClick: () => { setEditingEvent(null); setShowEventWizard(true); },
          icon: <Plus className="w-4 h-4" />
        }}
        headerActions={secondaryActions}
        supportedLayouts={['cards', 'list', 'grid']}
        defaultLayout={viewMode}
        onLayoutChange={handleLayoutChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
      >
        <ViewLayouts viewMode={viewMode}>
          {filteredEvents.map((event) => (
            <ManagementCard
              key={event.id}
              id={event.id}
              title={event.title_ar}
              description={event.description_ar}
              badges={[
                { 
                  label: getStatusLabel(event.status || 'scheduled'),
                  variant: 'outline' as const
                },
                { 
                  label: getFormatLabel(event.format || 'in_person'),
                  variant: 'secondary' as const
                },
                ...(event.event_type ? [{ label: event.event_type, variant: 'outline' as const }] : [])
              ]}
               metadata={[
                 { icon: <Calendar className="h-4 w-4" />, label: "التاريخ", value: format(new Date(event.event_date), 'PPP') },
                 ...(event.start_time ? [{ icon: <Clock className="h-4 w-4" />, label: "الوقت", value: `${event.start_time} - ${event.end_time}` }] : []),
                 ...(event.location ? [{ icon: <MapPin className="h-4 w-4" />, label: "المكان", value: event.location }] : []),
                 ...(event.max_participants ? [{ icon: <Users className="h-4 w-4" />, label: "المشاركين", value: `${event.registered_participants || 0}/${event.max_participants}` }] : [])
               ]}
               actions={[
                 { 
                   type: 'edit', 
                   label: 'تعديل',
                   onClick: () => handleEdit(event)
                 },
                 { 
                   type: 'delete',
                   label: 'حذف',
                   onClick: () => {
                     if (confirm(`هل أنت متأكد من حذف "${event.title_ar}"؟`)) {
                       handleDelete(event.id);
                     }
                   }
                 }
                ]}
                viewMode={viewMode}
                onClick={() => handleView(event)}
            />
          ))}
        </ViewLayouts>

        {filteredEvents.length === 0 && (
          <EmptyState
            title="لا توجد أحداث"
            description={
              searchTerm || hasActiveFilters()
                ? "لا توجد نتائج تطابق معايير البحث والتصفية"
                : "لم يتم إنشاء أي أحداث بعد"
            }
            action={
              !searchTerm && !hasActiveFilters()
                ? { label: "إنشاء حدث جديد", onClick: () => setShowEventWizard(true) }
                : { label: "مسح جميع المرشحات", onClick: clearAllFilters }
            }
            isFiltered={searchTerm !== "" || hasActiveFilters()}
          />
        )}
      </StandardPageLayout>

      {/* Event Wizard */}
      <EventWizard
        isOpen={showEventWizard}
        onClose={() => {
          setShowEventWizard(false);
          setEditingEvent(null);
        }}
        event={editingEvent}
        onSave={handleEventSave}
      />

      {/* Event Detail Dialog */}
      <Dialog open={!!viewingEvent} onOpenChange={(open) => !open && setViewingEvent(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل الحدث</DialogTitle>
          </DialogHeader>
          {viewingEvent && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">تفاصيل الحدث</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>العنوان:</strong> {viewingEvent.title_ar}</p>
                    <p><strong>التاريخ:</strong> {format(new Date(viewingEvent.event_date), 'PPP')}</p>
                    <p><strong>الوقت:</strong> {viewingEvent.start_time} - {viewingEvent.end_time}</p>
                    <p><strong>النوع:</strong> {getFormatLabel(viewingEvent.format || 'in_person')}</p>
                    <p><strong>الحالة:</strong> {getStatusLabel(viewingEvent.status || 'scheduled')}</p>
                    {viewingEvent.location && <p><strong>الموقع:</strong> {viewingEvent.location}</p>}
                    {viewingEvent.virtual_link && <p><strong>الرابط الافتراضي:</strong> {viewingEvent.virtual_link}</p>}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">المشاركون</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>الحد الأقصى:</strong> {viewingEvent.max_participants || 'غير محدد'}</p>
                    <p><strong>المسجلون:</strong> {viewingEvent.registered_participants || 0}</p>
                    <p><strong>الفعلي:</strong> {viewingEvent.actual_participants || 0}</p>
                    {viewingEvent.budget && <p><strong>الميزانية:</strong> {viewingEvent.budget} ريال</p>}
                  </div>
                </div>
              </div>
              
              {viewingEvent.description_ar && (
                <div>
                  <h4 className="font-semibold mb-2">الوصف</h4>
                  <p className="text-sm">{viewingEvent.description_ar}</p>
                </div>
              )}

              {viewingEvent.partners && viewingEvent.partners.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">الشركاء</h4>
                  <div className="flex gap-2 flex-wrap">
                    {viewingEvent.partners.map((partner: any) => (
                      <Badge key={partner.id} variant="outline">
                        {partner.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {viewingEvent.stakeholders && viewingEvent.stakeholders.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">أصحاب المصلحة</h4>
                  <div className="flex gap-2 flex-wrap">
                    {viewingEvent.stakeholders.map((stakeholder: any) => (
                      <Badge key={stakeholder.id} variant="outline">
                        {stakeholder.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {viewingEvent.focusQuestions && viewingEvent.focusQuestions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">أسئلة التركيز</h4>
                  <div className="space-y-2">
                    {viewingEvent.focusQuestions.map((question: any) => (
                      <div key={question.id} className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{question.question_text_ar}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}