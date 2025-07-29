import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, MapPin, Users, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

const mockRegistrations = [
  {
    id: 1,
    eventTitle: 'مؤتمر الابتكار الرقمي 2024',
    eventTitle_en: 'Digital Innovation Conference 2024',
    description: 'مؤتمر متخصص في أحدث التقنيات والابتكارات الرقمية',
    description_en: 'Specialized conference on the latest digital technologies and innovations',
    date: '2024-09-15',
    time: '09:00 AM',
    location: 'مركز الرياض للمؤتمرات',
    location_en: 'Riyadh Convention Center',
    capacity: 500,
    registered: 347,
    status: 'confirmed',
    registrationDate: '2024-07-25',
    type: 'conference',
    category: 'تكنولوجيا',
    category_en: 'Technology'
  },
  {
    id: 2,
    eventTitle: 'ورشة عمل ريادة الأعمال',
    eventTitle_en: 'Entrepreneurship Workshop',
    description: 'ورشة تدريبية شاملة حول أساسيات ريادة الأعمال والاستثمار',
    description_en: 'Comprehensive training workshop on entrepreneurship and investment fundamentals',
    date: '2024-08-20',
    time: '02:00 PM',
    location: 'مركز الأعمال التجاري',
    location_en: 'Business Center',
    capacity: 50,
    registered: 45,
    status: 'pending',
    registrationDate: '2024-07-28',
    type: 'workshop',
    category: 'أعمال',
    category_en: 'Business'
  },
  {
    id: 3,
    eventTitle: 'معرض التكنولوجيا المالية',
    eventTitle_en: 'FinTech Exhibition',
    description: 'معرض متخصص في عرض أحدث حلول التكنولوجيا المالية',
    description_en: 'Specialized exhibition showcasing the latest FinTech solutions',
    date: '2024-10-10',
    time: '10:00 AM',
    location: 'مركز جدة للمعارض',
    location_en: 'Jeddah Exhibition Center',
    capacity: 1000,
    registered: 723,
    status: 'waitlist',
    registrationDate: '2024-07-30',
    type: 'exhibition',
    category: 'تكنولوجيا مالية',
    category_en: 'FinTech'
  }
];

const upcomingEvents = [
  {
    id: 4,
    eventTitle: 'ملتقى الذكاء الاصطناعي',
    eventTitle_en: 'AI Summit',
    description: 'ملتقى متخصص في تطبيقات الذكاء الاصطناعي في المنطقة',
    description_en: 'Specialized summit on AI applications in the region',
    date: '2024-11-05',
    time: '09:00 AM',
    location: 'فندق الفيصلية',
    location_en: 'Al Faisaliah Hotel',
    capacity: 300,
    registered: 0,
    status: 'available',
    type: 'summit',
    category: 'ذكاء اصطناعي',
    category_en: 'Artificial Intelligence'
  }
];

const EventRegistration = () => {
  const { isRTL } = useDirection();
  const [selectedTab, setSelectedTab] = useState('my-registrations');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'waitlist': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'waitlist': return <Users className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return isRTL ? 'مؤكد' : 'Confirmed';
      case 'pending': return isRTL ? 'في الانتظار' : 'Pending';
      case 'waitlist': return isRTL ? 'قائمة انتظار' : 'Waitlist';
      case 'cancelled': return isRTL ? 'ملغي' : 'Cancelled';
      case 'available': return isRTL ? 'متاح' : 'Available';
      default: return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'conference': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'workshop': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'exhibition': return 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400';
      case 'summit': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'conference': return isRTL ? 'مؤتمر' : 'Conference';
      case 'workshop': return isRTL ? 'ورشة عمل' : 'Workshop';
      case 'exhibition': return isRTL ? 'معرض' : 'Exhibition';
      case 'summit': return isRTL ? 'ملتقى' : 'Summit';
      default: return type;
    }
  };

  const RegistrationCard = ({ registration }: { registration: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">
              {isRTL ? registration.eventTitle : registration.eventTitle_en}
            </CardTitle>
            <CardDescription className="text-sm mb-3">
              {isRTL ? registration.description : registration.description_en}
            </CardDescription>
            <div className="flex flex-wrap gap-2">
              <Badge className={getTypeColor(registration.type)}>
                {getTypeText(registration.type)}
              </Badge>
              <Badge variant="outline">
                {isRTL ? registration.category : registration.category_en}
              </Badge>
            </div>
          </div>
          <Badge className={getStatusColor(registration.status)}>
            {getStatusIcon(registration.status)}
            <span className="ml-1">{getStatusText(registration.status)}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{registration.date} {isRTL ? 'في' : 'at'} {registration.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{isRTL ? registration.location : registration.location_en}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{registration.registered}/{registration.capacity} {isRTL ? 'مشارك' : 'attendees'}</span>
            </div>
            {registration.registrationDate && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{isRTL ? 'تاريخ التسجيل:' : 'Registered:'} {registration.registrationDate}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                {isRTL ? 'عرض التفاصيل' : 'View Details'}
              </Button>
              {registration.status === 'confirmed' && (
                <Button variant="outline" size="sm">
                  {isRTL ? 'تحميل التذكرة' : 'Download Ticket'}
                </Button>
              )}
            </div>
            {registration.status === 'pending' && (
              <Button variant="outline" size="sm">
                {isRTL ? 'إلغاء التسجيل' : 'Cancel Registration'}
              </Button>
            )}
            {registration.status === 'available' && (
              <Button size="sm">
                {isRTL ? 'التسجيل الآن' : 'Register Now'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppShell>
      <PageLayout
        title={isRTL ? 'تسجيل الفعاليات' : 'Event Registration'}
        description={isRTL ? 'إدارة تسجيلاتك في الفعاليات والمؤتمرات' : 'Manage your event and conference registrations'}
      >
        <div className="space-y-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="my-registrations">{isRTL ? 'تسجيلاتي' : 'My Registrations'}</TabsTrigger>
              <TabsTrigger value="upcoming-events">{isRTL ? 'فعاليات قادمة' : 'Upcoming Events'}</TabsTrigger>
              <TabsTrigger value="past-events">{isRTL ? 'فعاليات سابقة' : 'Past Events'}</TabsTrigger>
            </TabsList>

            <TabsContent value="my-registrations" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockRegistrations.map((registration) => (
                  <RegistrationCard key={registration.id} registration={registration} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upcoming-events" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <RegistrationCard key={event.id} registration={event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="past-events" className="space-y-4">
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>{isRTL ? 'لا توجد فعاليات سابقة' : 'No past events found'}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </AppShell>
  );
};

export default EventRegistration;