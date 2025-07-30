import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  Info,
  ExternalLink,
  Download,
  Heart,
  BookmarkIcon,
  MapPinIcon
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEventInteractions } from '@/hooks/useEventInteractions';
import { useEventDetails } from '@/hooks/useEventDetails';
import { PartnersStakeholdersTab } from './tabs/PartnersStakeholdersTab';
import { RelatedItemsTab } from './tabs/RelatedItemsTab';
import { AttendeesTab } from './tabs/AttendeesTab';
import { EventResourcesTab } from './tabs/EventResourcesTab';

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
  image_url?: string;
}

interface EventFeedback {
  id: string;
  rating: number;
  feedback_text: string;
  would_recommend: boolean;
  created_at: string;
  user_id: string;
}

interface EnhancedEventDetailDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: (event: Event) => void;
}

export const EnhancedEventDetailDialog = ({ 
  event, 
  open, 
  onOpenChange, 
  onRegister 
}: EnhancedEventDetailDialogProps) => {
  const { isRTL } = useDirection();
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  
  const [feedback, setFeedback] = useState<EventFeedback[]>([]);
  const [userFeedback, setUserFeedback] = useState<EventFeedback | null>(null);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [resources, setResources] = useState<any[]>([]);

  // Use the new event interactions hook
  const { interactions, toggleBookmark, toggleLike } = useEventInteractions(event?.id || null);
  
  // Use the new event details hook
  const { 
    partners, 
    stakeholders, 
    relatedChallenges, 
    focusQuestions, 
    participants, 
    campaignInfo 
  } = useEventDetails(event?.id || null);

  // Load event data and user interactions
  useEffect(() => {
    if (event && user) {
      loadEventFeedback();
      loadEventResources();
    } else if (event) {
      loadEventResources();
    }
  }, [event, user]);

  // Early return after all hooks are called
  if (!event) return null;

  const loadEventResources = async () => {
    if (!event?.id) return;

    try {
      const { data, error } = await supabase
        .from('event_resources')
        .select('*')
        .eq('event_id', event.id)
        .eq('is_public', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error loading event resources:', error);
    }
  };

  const loadEventFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('event_feedback')
        .select('*')
        .eq('event_id', event.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFeedback(data || []);

      // Find user's feedback
      const usersFeedback = data?.find(f => f.user_id === user?.id);
      if (usersFeedback) {
        setUserFeedback(usersFeedback);
        setRating(usersFeedback.rating);
        setFeedbackText(usersFeedback.feedback_text || '');
      }
    } catch (error) {
      console.error('Error loading feedback:', error);
    }
  };

  const submitFeedback = async () => {
    if (!user || rating === 0) return;

    try {
      const feedbackData = {
        event_id: event.id,
        user_id: user.id,
        rating,
        feedback_text: feedbackText,
        would_recommend: rating >= 4
      };

      if (userFeedback) {
        await supabase
          .from('event_feedback')
          .update(feedbackData)
          .eq('id', userFeedback.id);
      } else {
        await supabase
          .from('event_feedback')
          .insert(feedbackData);
      }

      toast({
        title: isRTL ? 'تم إرسال التقييم' : 'Feedback Submitted',
        description: isRTL ? 'شكراً لك على تقييمك' : 'Thank you for your feedback'
      });

      loadEventFeedback();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ أثناء إرسال التقييم' : 'Failed to submit feedback',
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
      case 'ongoing': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
      case 'scheduled': return isRTL ? 'قادم' : 'Upcoming';
      case 'ongoing': return isRTL ? 'جاري' : 'Ongoing';
      case 'completed': return isRTL ? 'مكتمل' : 'Completed';
      case 'cancelled': return isRTL ? 'ملغي' : 'Cancelled';
      default: return status;
    }
  };

  const getRegistrationPercentage = () => {
    if (!event.max_participants) return 0;
    return Math.min((event.registered_participants / event.max_participants) * 100, 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isRTL ? 
      date.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 
      date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const isEventFull = event.max_participants && event.registered_participants >= event.max_participants;
  const averageRating = feedback.length > 0 ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          {/* Event Header with Image */}
          <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg -mx-6 -mt-6 mb-6 overflow-hidden">
            {event.image_url ? (
              <img 
                src={event.image_url} 
                alt={event.title_ar}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <CalendarIcon className="w-24 h-24 text-primary/40" />
              </div>
            )}
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Status Badges Overlay */}
            <div className="absolute top-4 right-4 flex gap-2">
              {event.event_category === 'featured' && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  <Star className="w-3 h-3 mr-1" />
                  {isRTL ? 'مميز' : 'Featured'}
                </Badge>
              )}
              <Badge className={getStatusColor(event.status)}>
                {getStatusText(event.status)}
              </Badge>
            </div>

            {/* Format Badge */}
            {event.format === 'virtual' && (
              <div className="absolute bottom-4 left-4">
                <Badge variant="secondary" className="bg-white/90 text-gray-700">
                  <Globe className="w-3 h-3 mr-1" />
                  {isRTL ? 'عبر الإنترنت' : 'Online Event'}
                </Badge>
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/80 hover:bg-white"
                onClick={toggleBookmark}
              >
                <BookmarkIcon className={`w-4 h-4 ${interactions.isBookmarked ? 'fill-current text-primary' : ''}`} />
              </Button>
              <Button variant="secondary" size="sm" className="bg-white/80 hover:bg-white">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Event Title Overlay */}
            <div className="absolute bottom-4 right-4 text-right">
              <h1 className="text-2xl font-bold text-white mb-2">
                {event.title_ar}
              </h1>
              <div className="flex items-center gap-2 text-white/90">
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  {event.event_type}
                </Badge>
                {averageRating > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span>{averageRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <DialogDescription className="text-base text-foreground">
              {event.description_ar}
            </DialogDescription>

            {/* Key Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <CalendarIcon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-sm font-bold">{formatDate(event.event_date)}</div>
                <div className="text-xs text-muted-foreground">{event.start_time || 'TBD'}</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <MapPinIcon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-sm font-bold truncate">
                  {event.location || (event.format === 'virtual' ? (isRTL ? 'عبر الإنترنت' : 'Online') : 'TBD')}
                </div>
                <div className="text-xs text-muted-foreground">{isRTL ? 'الموقع' : 'Location'}</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-lg font-bold">{event.registered_participants}/{event.max_participants || '∞'}</div>
                <div className="text-xs text-muted-foreground">{isRTL ? 'المسجلين' : 'Registered'}</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Ticket className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-lg font-bold">
                  {event.budget ? `${event.budget.toLocaleString()} ${isRTL ? 'ر.س' : 'SAR'}` : (isRTL ? 'مجاني' : 'Free')}
                </div>
                <div className="text-xs text-muted-foreground">{isRTL ? 'السعر' : 'Price'}</div>
              </div>
            </div>

            {/* Registration Progress */}
            {event.max_participants && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{isRTL ? 'حالة التسجيل' : 'Registration Status'}</span>
                  <span>{Math.round(getRegistrationPercentage())}% {isRTL ? 'ممتلئ' : 'full'}</span>
                </div>
                <Progress value={getRegistrationPercentage()} className="h-3" />
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
            )}
          </div>
        </DialogHeader>

        <Separator />

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="details" className="space-y-4">
          {(() => {
            // Define tab visibility based on roles and permissions
            const canViewAttendees = hasRole('admin') || hasRole('super_admin') || hasRole('event_manager') || 
              (event?.event_manager_id === user?.id);
            const canViewPartners = hasRole('admin') || hasRole('super_admin') || hasRole('event_manager') || 
              hasRole('partner') || (event?.event_manager_id === user?.id);
            const canViewRelated = hasRole('admin') || hasRole('super_admin') || hasRole('expert') || 
              hasRole('event_manager') || hasRole('innovator');
            const canViewResources = interactions.isRegistered || hasRole('admin') || hasRole('super_admin') || 
              hasRole('event_manager') || (event?.event_manager_id === user?.id);

            // Calculate grid columns based on visible tabs
            const baseTabs = 2; // details + registration
            const optionalTabs = [canViewAttendees, canViewPartners, canViewRelated, true, canViewResources].filter(Boolean).length;
            const totalTabs = baseTabs + optionalTabs;
            
            const gridClass = totalTabs <= 3 ? 'grid-cols-3' : 
                             totalTabs <= 4 ? 'grid-cols-4' : 
                             totalTabs <= 5 ? 'grid-cols-5' : 
                             totalTabs <= 6 ? 'grid-cols-6' : 'grid-cols-7';
            
            return (
              <TabsList className={`grid w-full ${gridClass}`}>
                <TabsTrigger value="details">{isRTL ? 'التفاصيل' : 'Details'}</TabsTrigger>
                <TabsTrigger value="registration">{isRTL ? 'التسجيل' : 'Registration'}</TabsTrigger>
                {canViewAttendees && (
                  <TabsTrigger value="attendees">{isRTL ? 'الحضور' : 'Attendees'}</TabsTrigger>
                )}
                {canViewPartners && (
                  <TabsTrigger value="partners">{isRTL ? 'الشركاء' : 'Partners'}</TabsTrigger>
                )}
                {canViewRelated && (
                  <TabsTrigger value="related">{isRTL ? 'مرتبط' : 'Related'}</TabsTrigger>
                )}
                <TabsTrigger value="feedback">{isRTL ? 'التقييمات' : 'Feedback'}</TabsTrigger>
                {canViewResources && (
                  <TabsTrigger value="resources">{isRTL ? 'الموارد' : 'Resources'}</TabsTrigger>
                )}
              </TabsList>
            );
          })()}

          <TabsContent value="details" className="space-y-4">
            <div className="grid gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  {isRTL ? 'معلومات الفعالية' : 'Event Information'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isRTL ? 'النوع:' : 'Type:'}</span>
                      <span className="font-medium">{event.event_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isRTL ? 'الفئة:' : 'Category:'}</span>
                      <span className="font-medium">{event.event_category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isRTL ? 'التنسيق:' : 'Format:'}</span>
                      <span className="font-medium">{event.format}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isRTL ? 'المدة:' : 'Duration:'}</span>
                      <span className="font-medium">
                        {event.start_time && event.end_time 
                          ? `${event.start_time} - ${event.end_time}`
                          : 'TBD'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isRTL ? 'المنظم:' : 'Organizer:'}</span>
                      <span className="font-medium">{isRTL ? 'منصة الابتكار' : 'Innovation Platform'}</span>
                    </div>
                    {event.virtual_link && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isRTL ? 'الرابط:' : 'Link:'}</span>
                        <Button variant="link" size="sm" className="h-auto p-0" asChild>
                          <a href={event.virtual_link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            {isRTL ? 'انضم الآن' : 'Join Now'}
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Event Schedule */}
              <div>
                <h4 className="font-semibold mb-3">{isRTL ? 'الجدول الزمني' : 'Schedule'}</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">{isRTL ? 'بداية الفعالية' : 'Event Start'}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(event.event_date)} - {event.start_time || 'TBD'}
                      </div>
                    </div>
                  </div>
                  
                  {event.end_time && (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">{isRTL ? 'نهاية الفعالية' : 'Event End'}</div>
                        <div className="text-sm text-muted-foreground">
                          {event.end_date ? formatDate(event.end_date) : formatDate(event.event_date)} - {event.end_time}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="registration" className="space-y-4">
            <div className="space-y-6">
              <div className="bg-muted/50 p-6 rounded-lg">
                <h4 className="font-semibold mb-4">{isRTL ? 'معلومات التسجيل' : 'Registration Information'}</h4>
                
                {event.max_participants && (
                  <div className="mb-6">
                    <Progress 
                      value={getRegistrationPercentage()} 
                      className="mb-3 h-3" 
                    />
                    <p className="text-sm text-muted-foreground">
                      {event.registered_participants} {isRTL ? 'من' : 'of'} {event.max_participants} {isRTL ? 'مقعد محجوز' : 'spots filled'}
                    </p>
                  </div>
                )}

                {interactions.isRegistered && (
                  <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">
                        {isRTL ? 'أنت مسجل في هذه الفعالية' : 'You are registered for this event'}
                      </span>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={() => onRegister(event)} 
                  className="w-full"
                  disabled={isEventFull || event.status === 'completed' || event.status === 'cancelled' || interactions.isRegistered}
                >
                  {interactions.isRegistered ?
                    (isRTL ? 'مسجل بالفعل' : 'Already Registered') :
                    isEventFull ? 
                    (isRTL ? 'الفعالية ممتلئة' : 'Event Full') :
                    event.status === 'completed' ?
                    (isRTL ? 'انتهت الفعالية' : 'Event Completed') :
                    event.status === 'cancelled' ?
                    (isRTL ? 'الفعالية ملغية' : 'Event Cancelled') :
                    (isRTL ? 'سجل الآن' : 'Register Now')
                  }
                </Button>
              </div>
            </div>
          </TabsContent>

          {(hasRole('admin') || hasRole('super_admin') || hasRole('event_manager') || (event?.event_manager_id === user?.id)) && (
            <TabsContent value="attendees" className="space-y-4">
              <AttendeesTab 
                participants={participants}
                maxParticipants={event.max_participants}
              />
            </TabsContent>
          )}

          {(hasRole('admin') || hasRole('super_admin') || hasRole('event_manager') || hasRole('partner') || (event?.event_manager_id === user?.id)) && (
            <TabsContent value="partners" className="space-y-4">
              <PartnersStakeholdersTab 
                partners={partners}
                stakeholders={stakeholders}
              />
            </TabsContent>
          )}

          {(hasRole('admin') || hasRole('super_admin') || hasRole('expert') || hasRole('event_manager') || hasRole('innovator')) && (
            <TabsContent value="related" className="space-y-4">
              <RelatedItemsTab 
                relatedChallenges={relatedChallenges}
                focusQuestions={focusQuestions}
                campaignInfo={campaignInfo}
              />
            </TabsContent>
          )}

          <TabsContent value="feedback" className="space-y-4">
            <div className="space-y-6">
              {/* Overall Rating */}
              {feedback.length > 0 && (
                <div className="text-center p-6 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="w-6 h-6 fill-current text-yellow-500" />
                    <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
                  </div>
                  <p className="text-muted-foreground">
                    {isRTL ? `${feedback.length} تقييم` : `${feedback.length} reviews`}
                  </p>
                </div>
              )}

              {/* User Feedback Form */}
              {event.status === 'completed' && user && (
                <div className="p-6 border rounded-lg">
                  <h4 className="font-semibold mb-4">
                    {isRTL ? 'قيم هذه الفعالية' : 'Rate this event'}
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>{isRTL ? 'التقييم' : 'Rating'}</Label>
                      <div className="flex gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="p-1"
                          >
                            <Star 
                              className={`w-6 h-6 ${
                                star <= rating 
                                  ? 'fill-current text-yellow-500' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="feedback">{isRTL ? 'التعليق' : 'Feedback'}</Label>
                      <Textarea
                        id="feedback"
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder={isRTL ? 'شاركنا رأيك في الفعالية...' : 'Share your thoughts about this event...'}
                        className="mt-2"
                      />
                    </div>
                    
                    <Button onClick={submitFeedback} disabled={rating === 0}>
                      {userFeedback ? 
                        (isRTL ? 'تحديث التقييم' : 'Update Rating') :
                        (isRTL ? 'إرسال التقييم' : 'Submit Rating')
                      }
                    </Button>
                  </div>
                </div>
              )}

              {/* Feedback List */}
              <div className="space-y-4">
                {feedback.slice(0, 5).map((review) => (
                  <div key={review.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating 
                                  ? 'fill-current text-yellow-500' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {review.feedback_text && (
                      <p className="text-sm">{review.feedback_text}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {(interactions.isRegistered || hasRole('admin') || hasRole('super_admin') || hasRole('event_manager') || (event?.event_manager_id === user?.id)) && (
            <TabsContent value="resources" className="space-y-4">
              <EventResourcesTab 
                eventId={event.id}
                resources={resources}
              />
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};