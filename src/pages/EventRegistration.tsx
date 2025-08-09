import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { EventRegistrationHero } from '@/components/events/EventRegistrationHero';
import { EnhancedEventRegistrationHero } from '@/components/events/EnhancedEventRegistrationHero';
import { CollaborationProvider } from '@/contexts/CollaborationContext';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  CalendarIcon, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Search,
  Filter,
  Heart,
  Share2,
  Download,
  Bell,
  Star,
  MapPinIcon,
  VideoIcon,
  UsersIcon,
  ClockIcon,
  TrendingUp,
  Eye,
  MoreHorizontal,
  Settings,
  Grid,
  List
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useToast } from '@/hooks/use-toast';

const mockRegistrations = [
  {
    id: 1,
    eventTitle: 'مؤتمر الابتكار الرقمي 2024',
    eventTitle_en: 'Digital Innovation Conference 2024',
    description: 'مؤتمر متخصص في أحدث التقنيات والابتكارات الرقمية مع خبراء من حول العالم',
    description_en: 'Specialized conference on the latest digital technologies and innovations with global experts',
    fullDescription: 'مؤتمر شامل يجمع رواد التكنولوجيا والابتكار لمناقشة أحدث التطورات في المجال الرقمي',
    fullDescription_en: 'Comprehensive conference bringing together technology leaders and innovators to discuss latest developments in digital space',
    date: '2024-09-15',
    endDate: '2024-09-17',
    time: '09:00 AM',
    endTime: '05:00 PM',
    location: 'مركز الرياض للمؤتمرات',
    location_en: 'Riyadh Convention Center',
    format: 'hybrid',
    virtualLink: 'https://meet.example.com/digital-innovation-2024',
    capacity: 500,
    registered: 347,
    status: 'confirmed',
    registrationDate: '2024-07-25',
    type: 'conference',
    category: 'تكنولوجيا',
    category_en: 'Technology',
    priority: 'high',
    isFavorite: true,
    rating: 4.8,
    speakers: ['د. أحمد المالكي', 'سارة التميمي', 'Dr. John Smith'],
    agenda: [
      { time: '09:00', title: 'الافتتاح والكلمة الترحيبية', title_en: 'Opening & Welcome Speech' },
      { time: '10:30', title: 'الذكاء الاصطناعي في المستقبل', title_en: 'AI in the Future' },
      { time: '14:00', title: 'ورش العمل التفاعلية', title_en: 'Interactive Workshops' }
    ],
    ticketPrice: 250,
    currency: 'SAR',
    tags: ['AI', 'Innovation', 'Technology'],
    socialLinks: {
      twitter: '@DigitalInnovation2024',
      linkedin: 'digital-innovation-conference'
    }
  },
  {
    id: 2,
    eventTitle: 'ورشة عمل ريادة الأعمال',
    eventTitle_en: 'Entrepreneurship Workshop',
    description: 'ورشة تدريبية شاملة حول أساسيات ريادة الأعمال والاستثمار',
    description_en: 'Comprehensive training workshop on entrepreneurship and investment fundamentals',
    fullDescription: 'ورشة تفاعلية تغطي جميع جوانب ريادة الأعمال من التخطيط إلى التنفيذ',
    fullDescription_en: 'Interactive workshop covering all aspects of entrepreneurship from planning to execution',
    date: '2024-08-20',
    time: '02:00 PM',
    endTime: '06:00 PM',
    location: 'مركز الأعمال التجاري',
    location_en: 'Business Center',
    format: 'in-person',
    capacity: 50,
    registered: 45,
    status: 'pending',
    registrationDate: '2024-07-28',
    type: 'workshop',
    category: 'أعمال',
    category_en: 'Business',
    priority: 'medium',
    isFavorite: false,
    rating: 4.5,
    speakers: ['م. فهد العتيبي', 'نورا الحربي'],
    ticketPrice: 150,
    currency: 'SAR',
    tags: ['Business', 'Entrepreneurship', 'Startup']
  },
  {
    id: 3,
    eventTitle: 'معرض التكنولوجيا المالية',
    eventTitle_en: 'FinTech Exhibition',
    description: 'معرض متخصص في عرض أحدث حلول التكنولوجيا المالية',
    description_en: 'Specialized exhibition showcasing the latest FinTech solutions',
    fullDescription: 'معرض شامل يضم أكثر من 100 شركة مالية تقنية رائدة',
    fullDescription_en: 'Comprehensive exhibition featuring over 100 leading FinTech companies',
    date: '2024-10-10',
    endDate: '2024-10-12',
    time: '10:00 AM',
    endTime: '08:00 PM',
    location: 'مركز جدة للمعارض',
    location_en: 'Jeddah Exhibition Center',
    format: 'in-person',
    capacity: 1000,
    registered: 723,
    status: 'waitlist',
    registrationDate: '2024-07-30',
    type: 'exhibition',
    category: 'تكنولوجيا مالية',
    category_en: 'FinTech',
    priority: 'high',
    isFavorite: true,
    rating: 4.9,
    speakers: ['د. محمد الشهري', 'ليلى القحطاني', 'Ahmed Al-Rashid'],
    ticketPrice: 0,
    currency: 'SAR',
    tags: ['FinTech', 'Banking', 'Blockchain', 'Payments']
  }
];

const upcomingEvents = [
  {
    id: 4,
    eventTitle: 'ملتقى الذكاء الاصطناعي',
    eventTitle_en: 'AI Summit',
    description: 'ملتقى متخصص في تطبيقات الذكاء الاصطناعي في المنطقة',
    description_en: 'Specialized summit on AI applications in the region',
    fullDescription: 'ملتقى تقني متقدم يناقش أحدث تطورات الذكاء الاصطناعي وتطبيقاته',
    fullDescription_en: 'Advanced technical summit discussing latest AI developments and applications',
    date: '2024-11-05',
    endDate: '2024-11-06',
    time: '09:00 AM',
    endTime: '05:00 PM',
    location: 'فندق الفيصلية',
    location_en: 'Al Faisaliah Hotel',
    format: 'hybrid',
    virtualLink: 'https://meet.example.com/ai-summit-2024',
    capacity: 300,
    registered: 156,
    status: 'available',
    type: 'summit',
    category: 'ذكاء اصطناعي',
    category_en: 'Artificial Intelligence',
    priority: 'high',
    isFavorite: false,
    rating: 4.7,
    speakers: ['د. عبدالله النعيم', 'فاطمة الزهراني', 'Dr. Sarah Johnson'],
    ticketPrice: 300,
    currency: 'SAR',
    tags: ['AI', 'Machine Learning', 'Deep Learning', 'NLP'],
    socialLinks: {
      twitter: '@AISummit2024',
      linkedin: 'ai-summit-saudi'
    }
  },
  {
    id: 5,
    eventTitle: 'ورشة تطوير التطبيقات المحمولة',
    eventTitle_en: 'Mobile App Development Workshop',
    description: 'ورشة عملية لتعلم تطوير التطبيقات للهواتف الذكية',
    description_en: 'Hands-on workshop for learning mobile application development',
    fullDescription: 'ورشة تطبيقية شاملة تغطي تطوير التطبيقات لنظامي iOS و Android',
    fullDescription_en: 'Comprehensive hands-on workshop covering app development for iOS and Android',
    date: '2024-08-15',
    time: '10:00 AM',
    endTime: '04:00 PM',
    location: 'معهد التقنية المتقدمة',
    location_en: 'Advanced Technology Institute',
    format: 'in-person',
    capacity: 30,
    registered: 18,
    status: 'available',
    type: 'workshop',
    category: 'تطوير',
    category_en: 'Development',
    priority: 'medium',
    isFavorite: false,
    rating: 4.3,
    speakers: ['أحمد سالم', 'مها العمري'],
    ticketPrice: 200,
    currency: 'SAR',
    tags: ['Mobile', 'iOS', 'Android', 'Flutter', 'React Native']
  }
];

const pastEvents = [
  {
    id: 6,
    eventTitle: 'مؤتمر الأمن السيبراني 2024',
    eventTitle_en: 'Cybersecurity Conference 2024',
    description: 'مؤتمر متخصص في أحدث تهديدات وحلول الأمن السيبراني',
    description_en: 'Specialized conference on latest cybersecurity threats and solutions',
    date: '2024-06-20',
    time: '09:00 AM',
    location: 'مركز الملك فهد الثقافي',
    location_en: 'King Fahd Cultural Center',
    capacity: 400,
    registered: 380,
    attended: 360,
    status: 'completed',
    registrationDate: '2024-05-15',
    type: 'conference',
    category: 'أمن سيبراني',
    category_en: 'Cybersecurity',
    rating: 4.6,
    feedback: 'ممتاز',
    certificate: true
  }
];

const EventRegistration = () => {
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('my-registrations');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([1, 3]);

  // Enhanced filtering logic
  const filterEvents = (events: any[]) => {
    return events.filter(event => {
      const matchesSearch = searchQuery === '' || 
        (isRTL ? event.eventTitle : event.eventTitle_en).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (isRTL ? event.description : event.description_en).toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || event.category_en.toLowerCase() === selectedCategory;
      const matchesType = selectedType === 'all' || event.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesType && matchesStatus;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'waitlist': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'available': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'waitlist': return <Users className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'available': return <Calendar className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
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
      case 'completed': return isRTL ? 'مكتمل' : 'Completed';
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-l-red-500';
      case 'medium': return 'border-l-4 border-l-yellow-500';
      case 'low': return 'border-l-4 border-l-green-500';
      default: return '';
    }
  };

  const getCapacityPercentage = (registered: number, capacity: number) => {
    return Math.round((registered / capacity) * 100);
  };

  const formatEventDuration = (event: any) => {
    if (event.endDate && event.endDate !== event.date) {
      return `${event.date} - ${event.endDate}`;
    }
    return event.date;
  };

  const toggleFavorite = (eventId: number) => {
    setFavorites(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
    toast({
      title: favorites.includes(eventId) 
        ? (isRTL ? 'تم إزالة من المفضلة' : 'Removed from favorites')
        : (isRTL ? 'تم إضافة للمفضلة' : 'Added to favorites'),
      duration: 2000,
    });
  };

  const handleRegistration = (event: any) => {
    setSelectedEvent(event);
    setShowRegistrationDialog(true);
  };

  const confirmRegistration = () => {
    toast({
      title: isRTL ? 'تم التسجيل بنجاح!' : 'Registration Successful!',
      description: isRTL ? 'سيتم إرسال تفاصيل الفعالية عبر البريد الإلكتروني' : 'Event details will be sent to your email',
    });
    setShowRegistrationDialog(false);
  };

  const handleShare = (event: any) => {
    if (navigator.share) {
      navigator.share({
        title: isRTL ? event.eventTitle : event.eventTitle_en,
        text: isRTL ? event.description : event.description_en,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: isRTL ? 'تم نسخ الرابط' : 'Link copied',
        duration: 2000,
      });
    }
  };

  const downloadTicket = (event: any) => {
    toast({
      title: isRTL ? 'جاري تحميل التذكرة...' : 'Downloading ticket...',
      duration: 2000,
    });
  };

  // Enhanced Event Card Component
  const EnhancedEventCard = ({ event, showActions = true }: { event: any; showActions?: boolean }) => {
    const capacityPercentage = getCapacityPercentage(event.registered, event.capacity);
    const isNearFull = capacityPercentage >= 90;
    const isFavorite = favorites.includes(event.id);

    return (
      <Card className={`hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in ${getPriorityColor(event.priority)}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-lg line-clamp-2">
                  {isRTL ? event.eventTitle : event.eventTitle_en}
                </CardTitle>
                {event.priority === 'high' && (
                  <TrendingUp className="h-4 w-4 text-red-500 flex-shrink-0" />
                )}
              </div>
              
              <CardDescription className="text-sm mb-3 line-clamp-2">
                {isRTL ? event.description : event.description_en}
              </CardDescription>
              
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge className={getTypeColor(event.type)}>
                  {getTypeText(event.type)}
                </Badge>
                <Badge variant="outline">
                  {isRTL ? event.category : event.category_en}
                </Badge>
                {event.format && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {event.format === 'virtual' ? (
                      <VideoIcon className="h-3 w-3" />
                    ) : event.format === 'hybrid' ? (
                      <>
                        <MapPinIcon className="h-3 w-3" />
                        <VideoIcon className="h-3 w-3" />
                      </>
                    ) : (
                      <MapPinIcon className="h-3 w-3" />
                    )}
                    {isRTL ? 
                      (event.format === 'virtual' ? 'افتراضي' : event.format === 'hybrid' ? 'مختلط' : 'حضوري') :
                      event.format
                    }
                  </Badge>
                )}
              </div>

              {event.rating && (
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{event.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({event.registered || 0} {isRTL ? 'تقييم' : 'reviews'})
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <Badge className={getStatusColor(event.status)}>
                {getStatusIcon(event.status)}
                <span className="ml-1">{getStatusText(event.status)}</span>
              </Badge>
              
              {showActions && (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(event.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(event)}
                    className="h-8 w-8 p-0"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Event Details */}
          <div className="grid grid-cols-1 gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 flex-shrink-0" />
              <span>{formatEventDuration(event)}</span>
              {event.time && (
                <>
                  <span className="text-xs">•</span>
                  <ClockIcon className="h-3 w-3" />
                  <span>
                    {event.time}
                    {event.endTime && ` - ${event.endTime}`}
                  </span>
                </>
              )}
            </div>
            
            {event.location && event.format !== 'virtual' && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="line-clamp-1">{isRTL ? event.location : event.location_en}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4 flex-shrink-0" />
              <span>{event.registered}/{event.capacity} {isRTL ? 'مشارك' : 'participants'}</span>
              {isNearFull && (
                <Badge variant="destructive" className="text-xs">
                  {isRTL ? 'أوشك على الامتلاء' : 'Nearly Full'}
                </Badge>
              )}
            </div>
            
            {event.ticketPrice !== undefined && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary">
                  {event.ticketPrice === 0 
                    ? (isRTL ? 'مجاني' : 'Free')
                    : `${event.ticketPrice} ${event.currency}`
                  }
                </span>
              </div>
            )}
          </div>

          {/* Capacity Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span>{isRTL ? 'معدل التسجيل' : 'Registration'}</span>
              <span>{capacityPercentage}%</span>
            </div>
            <Progress 
              value={capacityPercentage} 
              className={`h-2 ${isNearFull ? 'text-red-500' : 'text-green-500'}`}
            />
          </div>

          {/* Tags */}
          {event.tags && (
            <div className="flex flex-wrap gap-1">
              {event.tags.slice(0, 3).map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {event.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{event.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedEvent(event);
                  setShowEventDetail(true);
                }}
                className="flex items-center gap-1"
              >
                <Eye className="h-3 w-3" />
                {isRTL ? 'التفاصيل' : 'Details'}
              </Button>
              
              {event.status === 'confirmed' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadTicket(event)}
                  className="flex items-center gap-1"
                >
                  <Download className="h-3 w-3" />
                  {isRTL ? 'التذكرة' : 'Ticket'}
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              {event.status === 'pending' && (
                <Button variant="outline" size="sm">
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Button>
              )}
              
              {event.status === 'available' && (
                <Button 
                  size="sm" 
                  onClick={() => handleRegistration(event)}
                  disabled={capacityPercentage >= 100}
                >
                  {capacityPercentage >= 100 
                    ? (isRTL ? 'مكتمل' : 'Full')
                    : (isRTL ? 'التسجيل' : 'Register')
                  }
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Event Detail Dialog Component
  const EventDetailDialog = () => (
    <Dialog open={showEventDetail} onOpenChange={setShowEventDetail}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {selectedEvent && (isRTL ? selectedEvent.eventTitle : selectedEvent.eventTitle_en)}
          </DialogTitle>
          <DialogDescription>
            {selectedEvent && (isRTL ? selectedEvent.fullDescription : selectedEvent.fullDescription_en)}
          </DialogDescription>
        </DialogHeader>
        
        {selectedEvent && (
          <div className="space-y-6">
            {/* Event Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{isRTL ? 'التاريخ' : 'Date'}</p>
                    <p className="text-sm text-muted-foreground">{formatEventDuration(selectedEvent)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{isRTL ? 'الوقت' : 'Time'}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedEvent.time}
                      {selectedEvent.endTime && ` - ${selectedEvent.endTime}`}
                    </p>
                  </div>
                </div>
                
                {selectedEvent.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{isRTL ? 'المكان' : 'Location'}</p>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? selectedEvent.location : selectedEvent.location_en}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{isRTL ? 'المشاركون' : 'Participants'}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedEvent.registered}/{selectedEvent.capacity}
                    </p>
                    <Progress 
                      value={getCapacityPercentage(selectedEvent.registered, selectedEvent.capacity)} 
                      className="h-2 mt-1"
                    />
                  </div>
                </div>
                
                {selectedEvent.ticketPrice !== undefined && (
                  <div>
                    <p className="font-medium">{isRTL ? 'السعر' : 'Price'}</p>
                    <p className="text-lg font-bold text-primary">
                      {selectedEvent.ticketPrice === 0 
                        ? (isRTL ? 'مجاني' : 'Free')
                        : `${selectedEvent.ticketPrice} ${selectedEvent.currency}`
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Speakers */}
            {selectedEvent.speakers && (
              <div>
                <h3 className="font-semibold mb-3">{isRTL ? 'المتحدثون' : 'Speakers'}</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.speakers.map((speaker: string, index: number) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {speaker}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Agenda */}
            {selectedEvent.agenda && (
              <div>
                <h3 className="font-semibold mb-3">{isRTL ? 'جدول الأعمال' : 'Agenda'}</h3>
                <div className="space-y-2">
                  {selectedEvent.agenda.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted">
                      <Badge variant="outline">{item.time}</Badge>
                      <span className="text-sm">
                        {isRTL ? item.title : item.title_en}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {selectedEvent.tags && (
              <div>
                <h3 className="font-semibold mb-3">{isRTL ? 'المواضيع' : 'Topics'}</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center pt-4">
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => handleShare(selectedEvent)}
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  {isRTL ? 'مشاركة' : 'Share'}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => toggleFavorite(selectedEvent.id)}
                  className="flex items-center gap-2"
                >
                  <Heart className={`h-4 w-4 ${favorites.includes(selectedEvent.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  {favorites.includes(selectedEvent.id) 
                    ? (isRTL ? 'إزالة من المفضلة' : 'Remove from Favorites')
                    : (isRTL ? 'إضافة للمفضلة' : 'Add to Favorites')
                  }
                </Button>
              </div>
              
              {selectedEvent.status === 'available' && (
                <Button onClick={() => handleRegistration(selectedEvent)}>
                  {isRTL ? 'التسجيل الآن' : 'Register Now'}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  // Registration Confirmation Dialog
  const RegistrationDialog = () => (
    <Dialog open={showRegistrationDialog} onOpenChange={setShowRegistrationDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isRTL ? 'تأكيد التسجيل' : 'Confirm Registration'}</DialogTitle>
          <DialogDescription>
            {selectedEvent && (
              <>
                {isRTL ? 'هل تريد التسجيل في:' : 'Are you sure you want to register for:'}
                <br />
                <strong>{isRTL ? selectedEvent.eventTitle : selectedEvent.eventTitle_en}</strong>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        
        {selectedEvent && (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>{isRTL ? 'التاريخ:' : 'Date:'}</span>
                <span>{formatEventDuration(selectedEvent)}</span>
              </div>
              <div className="flex justify-between">
                <span>{isRTL ? 'الوقت:' : 'Time:'}</span>
                <span>{selectedEvent.time}</span>
              </div>
              {selectedEvent.ticketPrice !== undefined && (
                <div className="flex justify-between">
                  <span>{isRTL ? 'السعر:' : 'Price:'}</span>
                  <span className="font-semibold">
                    {selectedEvent.ticketPrice === 0 
                      ? (isRTL ? 'مجاني' : 'Free')
                      : `${selectedEvent.ticketPrice} ${selectedEvent.currency}`
                    }
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRegistrationDialog(false)}>
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button onClick={confirmRegistration}>
                {isRTL ? 'تأكيد التسجيل' : 'Confirm Registration'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  // Filter Panel Component
  const FilterPanel = () => (
    <Sheet open={showFilters} onOpenChange={setShowFilters}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isRTL ? 'تصفية الفعاليات' : 'Filter Events'}</SheetTitle>
          <SheetDescription>
            {isRTL ? 'استخدم الفلاتر لتضييق نتائج البحث' : 'Use filters to narrow down your search results'}
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {isRTL ? 'الفئة' : 'Category'}
            </label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? 'اختر الفئة' : 'Select category'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع الفئات' : 'All Categories'}</SelectItem>
                <SelectItem value="technology">{isRTL ? 'تكنولوجيا' : 'Technology'}</SelectItem>
                <SelectItem value="business">{isRTL ? 'أعمال' : 'Business'}</SelectItem>
                <SelectItem value="fintech">{isRTL ? 'تكنولوجيا مالية' : 'FinTech'}</SelectItem>
                <SelectItem value="artificial intelligence">{isRTL ? 'ذكاء اصطناعي' : 'Artificial Intelligence'}</SelectItem>
                <SelectItem value="development">{isRTL ? 'تطوير' : 'Development'}</SelectItem>
                <SelectItem value="cybersecurity">{isRTL ? 'أمن سيبراني' : 'Cybersecurity'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              {isRTL ? 'نوع الفعالية' : 'Event Type'}
            </label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? 'اختر النوع' : 'Select type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع الأنواع' : 'All Types'}</SelectItem>
                <SelectItem value="conference">{isRTL ? 'مؤتمر' : 'Conference'}</SelectItem>
                <SelectItem value="workshop">{isRTL ? 'ورشة عمل' : 'Workshop'}</SelectItem>
                <SelectItem value="exhibition">{isRTL ? 'معرض' : 'Exhibition'}</SelectItem>
                <SelectItem value="summit">{isRTL ? 'ملتقى' : 'Summit'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              {isRTL ? 'الحالة' : 'Status'}
            </label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? 'اختر الحالة' : 'Select status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع الحالات' : 'All Statuses'}</SelectItem>
                <SelectItem value="available">{isRTL ? 'متاح' : 'Available'}</SelectItem>
                <SelectItem value="confirmed">{isRTL ? 'مؤكد' : 'Confirmed'}</SelectItem>
                <SelectItem value="pending">{isRTL ? 'في الانتظار' : 'Pending'}</SelectItem>
                <SelectItem value="waitlist">{isRTL ? 'قائمة انتظار' : 'Waitlist'}</SelectItem>
                <SelectItem value="completed">{isRTL ? 'مكتمل' : 'Completed'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedType('all');
                setSelectedStatus('all');
                setSearchQuery('');
              }}
              className="flex-1"
            >
              {isRTL ? 'إعادة تعيين' : 'Reset'}
            </Button>
            <Button onClick={() => setShowFilters(false)} className="flex-1">
              {isRTL ? 'تطبيق' : 'Apply'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  // Get filtered events for current tab
  const getCurrentEvents = () => {
    switch (selectedTab) {
      case 'my-registrations':
        return filterEvents(mockRegistrations);
      case 'upcoming-events':
        return filterEvents(upcomingEvents);
      case 'past-events':
        return filterEvents(pastEvents);
      default:
        return [];
    }
  };

  const currentEvents = getCurrentEvents();

  return (
    <CollaborationProvider>
      <AppShell>
        <EnhancedEventRegistrationHero
        totalRegistrations={mockRegistrations.length}
        upcomingEvents={upcomingEvents.length}
        totalParticipants={mockRegistrations.reduce((sum, reg) => sum + reg.registered, 0)}
        completedEvents={pastEvents.length}
        onShowFilters={() => setShowFilters(!showFilters)}
        canRegister={true}
        featuredEvent={mockRegistrations.length > 0 ? {
          id: mockRegistrations[0].id.toString(),
          title: isRTL ? mockRegistrations[0].eventTitle : mockRegistrations[0].eventTitle_en,
          date: mockRegistrations[0].date,
          participants: mockRegistrations[0].registered,
          capacity: mockRegistrations[0].capacity,
          location: isRTL ? mockRegistrations[0].location : mockRegistrations[0].location_en
        } : undefined}
      />
      <PageLayout
        title={isRTL ? 'تسجيل الفعاليات' : 'Event Registration'}
        description={isRTL ? 'إدارة تسجيلاتك في الفعاليات والمؤتمرات' : 'Manage your event and conference registrations'}
      >
        <div className="space-y-6">
          {/* Enhanced Header with Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isRTL ? 'البحث في الفعاليات...' : 'Search events...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {isRTL ? 'تصفية' : 'Filter'}
              </Button>
              
              <div className="flex items-center gap-1 border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          {(searchQuery || selectedCategory !== 'all' || selectedType !== 'all' || selectedStatus !== 'all') && (
            <div className="bg-muted p-3 rounded-lg flex items-center justify-between">
              <span className="text-sm">
                {isRTL ? `تم العثور على ${currentEvents.length} فعالية` : `Found ${currentEvents.length} events`}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedType('all');
                  setSelectedStatus('all');
                }}
              >
                {isRTL ? 'إزالة الفلاتر' : 'Clear filters'}
              </Button>
            </div>
          )}

          {/* Enhanced Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="my-registrations" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {isRTL ? 'تسجيلاتي' : 'My Registrations'}
                <Badge variant="secondary" className="ml-1">
                  {mockRegistrations.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="upcoming-events" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {isRTL ? 'فعاليات قادمة' : 'Upcoming Events'}
                <Badge variant="secondary" className="ml-1">
                  {upcomingEvents.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="past-events" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {isRTL ? 'فعاليات سابقة' : 'Past Events'}
                <Badge variant="secondary" className="ml-1">
                  {pastEvents.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-registrations" className="space-y-4">
              {currentEvents.length > 0 ? (
                <div className={viewMode === 'grid' ? 
                  'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 
                  'space-y-4'
                }>
                  {currentEvents.map((registration) => (
                    <EnhancedEventCard key={registration.id} event={registration} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">
                      {isRTL ? 'لا توجد تسجيلات' : 'No registrations'}
                    </h3>
                    <p className="text-sm">
                      {isRTL ? 'لم تقم بالتسجيل في أي فعالية بعد' : 'You haven\'t registered for any events yet'}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="upcoming-events" className="space-y-4">
              {currentEvents.length > 0 ? (
                <div className={viewMode === 'grid' ? 
                  'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 
                  'space-y-4'
                }>
                  {currentEvents.map((event) => (
                    <EnhancedEventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">
                      {isRTL ? 'لا توجد فعاليات قادمة' : 'No upcoming events'}
                    </h3>
                    <p className="text-sm">
                      {isRTL ? 'لا توجد فعاليات متاحة للتسجيل حالياً' : 'No events available for registration at the moment'}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past-events" className="space-y-4">
              {currentEvents.length > 0 ? (
                <div className={viewMode === 'grid' ? 
                  'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 
                  'space-y-4'
                }>
                  {currentEvents.map((event) => (
                    <EnhancedEventCard key={event.id} event={event} showActions={false} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">
                      {isRTL ? 'لا توجد فعاليات سابقة' : 'No past events'}
                    </h3>
                    <p className="text-sm">
                      {isRTL ? 'لم تحضر أي فعالية بعد' : 'You haven\'t attended any events yet'}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Dialogs and Overlays */}
        <EventDetailDialog />
        <RegistrationDialog />
        <FilterPanel />

        {/* Event Collaboration */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{isRTL ? 'تعاون الفعاليات' : 'Event Collaboration'}</CardTitle>
            <CardDescription>
              {isRTL ? 'تفاعل مع المشاركين الآخرين' : 'Engage with other participants'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WorkspaceCollaboration
              workspaceType="user"
              entityId="events"
              showWidget={true}
              showPresence={true}
              showActivity={true}
            />
          </CardContent>
        </Card>
      </PageLayout>
    </AppShell>
    </CollaborationProvider>
  );
};

export default EventRegistration;