import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CalendarIcon, 
  MapPin, 
  Users, 
  Clock, 
  Bookmark,
  Share2,
  Star,
  Ticket,
  Globe,
  Video,
  FileText,
  MessageSquare,
  User,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

interface Event {
  id: string;
  title_ar: string;
  description_ar: string;
  event_date: string;
  start_time: string;
  end_time: string;
  end_date?: string;
  location?: string;
  virtual_link?: string;
  format: string;
  event_type: string;
  event_category: string;
  status: string;
  max_participants?: number;
  registered_participants: number;
  actual_participants: number;
  budget?: number;
  campaign_id?: string;
  challenge_id?: string;
  sector_id?: string;
  event_manager_id?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  target_stakeholder_groups?: string[];
  partner_organizations?: string[];
  related_focus_questions?: string[];
  event_visibility?: string;
  created_at?: string;
  updated_at?: string;
}

interface EventDetailDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: (event: Event) => void;
}

export const EventDetailDialog = ({ event, open, onOpenChange, onRegister }: EventDetailDialogProps) => {
  const { isRTL } = useDirection();

  if (!event) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'ongoing': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'conference': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400';
      case 'seminar': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'networking': return 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return isRTL ? 'قادم' : 'Upcoming';
      case 'ongoing': return isRTL ? 'جاري' : 'Ongoing';
      case 'completed': return isRTL ? 'مكتمل' : 'Completed';
      case 'cancelled': return isRTL ? 'ملغي' : 'Cancelled';
      default: return status;
    }
  };

  const getRegistrationPercentage = () => {
    return Math.min((event.registered / event.capacity) * 100, 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isRTL ? 
      date.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 
      date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: !isRTL 
    });
  };

  const mockSpeakers = [
    { name: 'د. أحمد محمد', avatar: '/placeholder.svg', role: 'خبير التكنولوجيا', bio: 'خبير في مجال التكنولوجيا المالية' },
    { name: 'م. فاطمة علي', avatar: '/placeholder.svg', role: 'مديرة المنتجات', bio: 'خبيرة في تطوير المنتجات الرقمية' }
  ];

  const mockAgenda = [
    { time: '09:00', title: isRTL ? 'التسجيل والاستقبال' : 'Registration & Welcome', speaker: 'فريق التنظيم' },
    { time: '09:30', title: isRTL ? 'الجلسة الافتتاحية' : 'Opening Session', speaker: 'د. أحمد محمد' },
    { time: '10:30', title: isRTL ? 'استراحة' : 'Coffee Break' },
    { time: '11:00', title: isRTL ? 'ورشة عمل تطبيقية' : 'Hands-on Workshop', speaker: 'م. فاطمة علي' },
    { time: '12:30', title: isRTL ? 'جلسة نقاش مفتوحة' : 'Open Discussion' }
  ];

  const mockRequirements = [
    isRTL ? 'خبرة أساسية في المجال' : 'Basic field experience',
    isRTL ? 'جهاز محمول للورش التطبيقية' : 'Laptop for hands-on workshops',
    isRTL ? 'الحضور في الوقت المحدد' : 'Punctual attendance'
  ];

  const mockBenefits = [
    isRTL ? 'شهادة حضور معتمدة' : 'Certified attendance certificate',
    isRTL ? 'مواد تدريبية حصرية' : 'Exclusive training materials',
    isRTL ? 'شبكة تواصل مهنية' : 'Professional networking',
    isRTL ? 'فرصة للتفاعل مع الخبراء' : 'Expert interaction opportunities'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <DialogHeader className="space-y-4">
          {/* Event Image */}
          <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg -mx-6 -mt-6 mb-6">
            {event.image ? (
              <img src={event.image} alt={event.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <CalendarIcon className="w-24 h-24 text-primary" />
              </div>
            )}
            
            {/* Status Badges Overlay */}
            <div className="absolute top-4 right-4 flex gap-2">
              {event.featured && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  <Star className="w-3 h-3 mr-1" />
                  {isRTL ? 'مميز' : 'Featured'}
                </Badge>
              )}
              <Badge className={getStatusColor(event.status)}>
                {getStatusText(event.status)}
              </Badge>
            </div>

            {/* Online Badge */}
            {event.online && (
              <div className="absolute bottom-4 left-4">
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  <Globe className="w-3 h-3 mr-1" />
                  {isRTL ? 'عبر الإنترنت' : 'Online Event'}
                </Badge>
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Button variant="secondary" size="sm" className="bg-white/80 hover:bg-white">
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="sm" className="bg-white/80 hover:bg-white">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-2xl mb-2">
                  {isRTL ? event.title : event.title_en}
                </DialogTitle>
                <DialogDescription className="text-base">
                  {isRTL ? event.description : event.description_en}
                </DialogDescription>
              </div>
              <Badge className={getTypeColor(event.type)} variant="outline">
                {event.type}
              </Badge>
            </div>

            {/* Key Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <CalendarIcon className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-sm font-bold">{formatDate(event.startDate)}</div>
                <div className="text-xs text-muted-foreground">{formatTime(event.startDate)}</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <MapPin className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-sm font-bold truncate">{isRTL ? event.location : event.location_en}</div>
                <div className="text-xs text-muted-foreground">{isRTL ? 'الموقع' : 'Location'}</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-lg font-bold">{event.registered}/{event.capacity}</div>
                <div className="text-xs text-muted-foreground">{isRTL ? 'المسجلين' : 'Registered'}</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Ticket className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-lg font-bold">{event.price || (isRTL ? 'مجاني' : 'Free')}</div>
                <div className="text-xs text-muted-foreground">{isRTL ? 'السعر' : 'Price'}</div>
              </div>
            </div>

            {/* Registration Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{isRTL ? 'حالة التسجيل' : 'Registration Status'}</span>
                <span>{Math.round(getRegistrationPercentage())}% {isRTL ? 'ممتلئ' : 'full'}</span>
              </div>
              <Progress value={getRegistrationPercentage()} className="h-2" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {getRegistrationPercentage() < 70 ? (
                  <CheckCircle className="w-3 h-3 text-green-600" />
                ) : getRegistrationPercentage() < 90 ? (
                  <AlertCircle className="w-3 h-3 text-yellow-600" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-red-600" />
                )}
                <span>
                  {getRegistrationPercentage() < 70 ? 
                    (isRTL ? 'أماكن متاحة' : 'Spots available') :
                    getRegistrationPercentage() < 90 ?
                    (isRTL ? 'أماكن محدودة' : 'Limited spots') :
                    (isRTL ? 'شبه ممتلئ' : 'Nearly full')
                  }
                </span>
              </div>
            </div>

            {/* Organizer & Speakers */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                {isRTL ? 'المنظم والمتحدثون' : 'Organizer & Speakers'}
              </h4>
              <div className="flex flex-wrap gap-3">
                {event.organizer && (
                  <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={event.organizer.avatar} alt={event.organizer.name} />
                      <AvatarFallback>{event.organizer.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{event.organizer.name}</div>
                      <div className="text-xs text-muted-foreground">{event.organizer.role}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {isRTL ? 'المنظم' : 'Organizer'}
                      </Badge>
                    </div>
                  </div>
                )}
                {mockSpeakers.map((speaker, index) => (
                  <div key={index} className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={speaker.avatar} alt={speaker.name} />
                      <AvatarFallback>{speaker.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{speaker.name}</div>
                      <div className="text-xs text-muted-foreground">{speaker.role}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {isRTL ? 'متحدث' : 'Speaker'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="agenda" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="agenda">{isRTL ? 'جدول الأعمال' : 'Agenda'}</TabsTrigger>
            <TabsTrigger value="details">{isRTL ? 'التفاصيل' : 'Details'}</TabsTrigger>
            <TabsTrigger value="requirements">{isRTL ? 'المتطلبات' : 'Requirements'}</TabsTrigger>
            <TabsTrigger value="resources">{isRTL ? 'الموارد' : 'Resources'}</TabsTrigger>
          </TabsList>

          <TabsContent value="agenda" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {isRTL ? 'جدول الفعاليات' : 'Event Schedule'}
              </h4>
              <div className="space-y-3">
                {mockAgenda.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-16 text-sm font-bold text-primary flex-shrink-0">
                      {item.time}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      {item.speaker && (
                        <div className="text-sm text-muted-foreground">{item.speaker}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  {isRTL ? 'ما ستحصل عليه' : 'What You\'ll Get'}
                </h4>
                <div className="grid gap-2">
                  {mockBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {isRTL ? 'الفئة والعلامات' : 'Category & Tags'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {isRTL ? event.category : event.category_en}
                  </Badge>
                  {event.tags?.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {isRTL ? 'متطلبات المشاركة' : 'Participation Requirements'}
              </h4>
              <div className="grid gap-3">
                {mockRequirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                    <span className="text-sm">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {isRTL ? 'الموارد والمراجع' : 'Resources & Materials'}
              </h4>
              <div className="grid gap-3">
                <div className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-sm">
                        {isRTL ? 'دليل المشارك' : 'Participant Guide'}
                      </div>
                      <div className="text-xs text-muted-foreground">PDF • 1.2 MB</div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Video className="w-4 h-4 text-red-600" />
                    <div>
                      <div className="font-medium text-sm">
                        {isRTL ? 'رابط البث المباشر' : 'Live Stream Link'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {isRTL ? 'سيتم إرساله قبل الفعالية' : 'Will be sent before the event'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">
                        {isRTL ? 'مجموعة النقاش' : 'Discussion Group'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {isRTL ? 'للتواصل مع المشاركين الآخرين' : 'Connect with other participants'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Bookmark className="w-4 h-4 mr-2" />
              {isRTL ? 'حفظ' : 'Save'}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              {isRTL ? 'مشاركة' : 'Share'}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {isRTL ? 'إغلاق' : 'Close'}
            </Button>
            <Button 
              onClick={() => onRegister(event)} 
              className="animate-pulse"
              disabled={event.status === 'completed' || event.registered >= event.capacity}
            >
              <Ticket className="w-4 h-4 mr-2" />
              {event.registered >= event.capacity ? 
                (isRTL ? 'مكتمل' : 'Full') : 
                (isRTL ? 'التسجيل الآن' : 'Register Now')
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};