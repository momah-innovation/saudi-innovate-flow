import { useState } from 'react';
import { ManagementCard } from '@/components/ui/management-card';
import { ViewLayouts } from '@/components/ui/view-layouts';
import { useTranslation } from '@/hooks/useTranslation';
import { EventWizard } from '@/components/events/EventWizard';
import { 
  Calendar, 
  Clock,
  MapPin,
  Users,
  Monitor
} from 'lucide-react';

// Mock data - will be replaced with real data
const mockEvents = [
  {
    id: '1',
    title_ar: 'ورشة الابتكار الرقمي',
    description_ar: 'ورشة عمل لتطوير الحلول الرقمية المبتكرة',
    event_type: 'workshop',
    event_date: '2024-03-15',
    start_time: '09:00',
    end_time: '17:00',
    location: 'مركز الابتكار - الرياض',
    format: 'in_person',
    status: 'scheduled',
    max_participants: 50,
    registered_participants: 32,
    actual_participants: 0,
    budget: 15000,
    manager: 'أحمد محمد'
  },
  {
    id: '2',
    title_ar: 'مؤتمر التكنولوجيا المالية',
    description_ar: 'مؤتمر متخصص في تقنيات التكنولوجيا المالية والدفع الرقمي',
    event_type: 'conference',
    event_date: '2024-03-20',
    start_time: '08:30',
    end_time: '18:00',
    location: 'فندق الريتز كارلتون',
    virtual_link: 'https://zoom.us/j/123456789',
    format: 'hybrid',
    status: 'ongoing',
    max_participants: 200,
    registered_participants: 156,
    actual_participants: 145,
    budget: 75000,
    manager: 'فاطمة علي'
  },
  {
    id: '3',
    title_ar: 'دورة تدريبية في الذكاء الاصطناعي',
    description_ar: 'دورة تدريبية شاملة في أساسيات الذكاء الاصطناعي وتطبيقاته',
    event_type: 'training',
    event_date: '2024-02-28',
    start_time: '10:00',
    end_time: '16:00',
    virtual_link: 'https://teams.microsoft.com/meet/123',
    format: 'virtual',
    status: 'completed',
    max_participants: 100,
    registered_participants: 98,
    actual_participants: 89,
    budget: 25000,
    manager: 'محمد الأحمد'
  }
];

const statusConfig = {
  scheduled: { label: 'مجدول', variant: 'default' as const },
  ongoing: { label: 'جاري', variant: 'secondary' as const },
  completed: { label: 'مكتمل', variant: 'outline' as const },
  cancelled: { label: 'ملغي', variant: 'destructive' as const },
  postponed: { label: 'مؤجل', variant: 'secondary' as const }
};

const formatConfig = {
  in_person: { label: 'حضوري', variant: 'default' as const, icon: MapPin },
  virtual: { label: 'افتراضي', variant: 'secondary' as const, icon: Monitor },
  hybrid: { label: 'مختلط', variant: 'outline' as const, icon: Users }
};

const typeConfig = {
  workshop: { label: 'ورشة عمل', variant: 'default' as const },
  conference: { label: 'مؤتمر', variant: 'secondary' as const },
  seminar: { label: 'ندوة', variant: 'outline' as const },
  training: { label: 'تدريب', variant: 'default' as const },
  networking: { label: 'شبكات تواصل', variant: 'secondary' as const }
};

interface EventsManagementProps {
  viewMode: 'cards' | 'list' | 'grid';
  searchTerm: string;
  showAddDialog: boolean;
  onAddDialogChange: (open: boolean) => void;
}

export function EventsManagement({ viewMode, searchTerm, showAddDialog, onAddDialogChange }: EventsManagementProps) {
  const { language } = useTranslation();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    onAddDialogChange(true);
  };

  const handleView = (event: any) => {
    console.log('View event:', event);
  };

  const handleDelete = (event: any) => {
    console.log('Delete event:', event);
  };

  return (
    <>
      <ViewLayouts viewMode={viewMode}>
        {mockEvents.map((event) => (
          <ManagementCard
            key={event.id}
            id={event.id}
            title={event.title_ar}
            description={event.description_ar}
            viewMode={viewMode}
            badges={[
              {
                label: statusConfig[event.status as keyof typeof statusConfig]?.label,
                variant: statusConfig[event.status as keyof typeof statusConfig]?.variant
              },
              {
                label: typeConfig[event.event_type as keyof typeof typeConfig]?.label || event.event_type,
                variant: typeConfig[event.event_type as keyof typeof typeConfig]?.variant || 'default'
              },
              {
                label: formatConfig[event.format as keyof typeof formatConfig]?.label,
                variant: formatConfig[event.format as keyof typeof formatConfig]?.variant
              }
            ]}
            metadata={[
              {
                icon: <Calendar className="w-4 h-4" />,
                label: 'التاريخ',
                value: new Date(event.event_date).toLocaleDateString('ar-SA')
              },
              {
                icon: <Clock className="w-4 h-4" />,
                label: 'الوقت',
                value: `${event.start_time} - ${event.end_time}`
              },
              {
                icon: <MapPin className="w-4 h-4" />,
                label: 'المكان',
                value: event.format === 'virtual' ? 'افتراضي' : event.location
              },
              {
                icon: <Users className="w-4 h-4" />,
                label: 'المشاركون',
                value: `${event.registered_participants}/${event.max_participants}`
              }
            ]}
            actions={[
              {
                type: 'view',
                label: 'عرض',
                onClick: () => handleView(event)
              },
              {
                type: 'edit',
                label: 'تعديل',
                onClick: () => handleEdit(event)
              },
              {
                type: 'delete',
                label: 'حذف',
                onClick: () => handleDelete(event)
              }
            ]}
            onClick={() => handleView(event)}
          />
        ))}
      </ViewLayouts>

      <EventWizard
        isOpen={showAddDialog}
        onClose={() => {
          onAddDialogChange(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onSave={() => onAddDialogChange(false)}
      />
    </>
  );
}