import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Globe,
  Video,
  Star,
  Download,
  Share2,
  Bookmark,
  Heart,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Eye,
  UserCheck,
  Building2,
  Target,
  DollarSign
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useSettingsManager } from '@/hooks/useSettingsManager';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useEventInteractions } from '@/hooks/useEventInteractions';
import { useParticipants } from '@/hooks/useParticipants';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AttendeesTab } from './tabs/AttendeesTab';
import { PartnersStakeholdersTab } from './tabs/PartnersStakeholdersTab';
import { RelatedItemsTab } from './tabs/RelatedItemsTab';
import { EventResourcesTab } from './tabs/EventResourcesTab';
import { InteractionButtons } from '@/components/ui/interaction-buttons';
import { EventSocialShare } from './EventSocialShare';

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
  image_url?: string;
  event_manager_id?: string;
  event_visibility?: string;
}

interface ComprehensiveEventDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister?: (event: Event) => void;
  isAdmin?: boolean;
}

export const ComprehensiveEventDialog = ({
  event,
  open,
  onOpenChange,
  onRegister,
  isAdmin = false
}: ComprehensiveEventDialogProps) => {
  const { isRTL } = useDirection();
  const { user, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState('details');
  
  const { 
    partners, 
    stakeholders, 
    relatedChallenges, 
    focusQuestions, 
    participants, 
    campaignInfo,
    loading: detailsLoading,
    refetch
  } = useEventDetails(event?.id || null);

  const {
    interactions,
    loading: interactionsLoading,
    toggleBookmark,
    toggleLike,
    registerForEvent
  } = useEventInteractions(event?.id || null);

  const {
    participants: allParticipants,
    loading: participantsLoading,
    updateParticipantStatus,
    cancelRegistration
  } = useParticipants(event?.id || null);

  if (!event) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مجدول':
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
      case 'جاري':
      case 'ongoing': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      case 'مكتمل':
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
      case 'ملغي':
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    if (status === 'مجدول') return isRTL ? 'مجدول' : 'Scheduled';
    if (status === 'جاري') return isRTL ? 'جاري' : 'Ongoing';
    if (status === 'مكتمل') return isRTL ? 'مكتمل' : 'Completed';
    if (status === 'ملغي') return isRTL ? 'ملغي' : 'Cancelled';
    return status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isRTL ? 
      date.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 
      date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getRegistrationPercentage = () => {
    if (!event.max_participants) return 0;
    return Math.min((event.registered_participants / event.max_participants) * 100, 100);
  };

  const isEventFull = event.max_participants && event.registered_participants >= event.max_participants;
  const canShowParticipants = isAdmin || hasRole('admin') || hasRole('super_admin') || 
    hasRole('event_manager') || event.event_manager_id === user?.id;
  const canShowPartners = isAdmin || hasRole('admin') || hasRole('super_admin') || 
    hasRole('event_manager') || hasRole('partner') || event.event_manager_id === user?.id;
  const canShowRelated = isAdmin || hasRole('admin') || hasRole('super_admin') || 
    hasRole('expert') || hasRole('event_manager') || hasRole('innovator');
  const canShowResources = interactions?.isRegistered || isAdmin || hasRole('admin') || 
    hasRole('super_admin') || hasRole('event_manager') || event.event_manager_id === user?.id;

  // Calculate visible tabs count for grid styling
  const { getSettingValue } = useSettingsManager();
  const visibleTabs = getSettingValue('event_dialog_visible_tabs', ['details', 'registration', 'feedback']) as string[];
  if (canShowParticipants) visibleTabs.push('attendees');
  if (canShowPartners) visibleTabs.push('partners');
  if (canShowRelated) visibleTabs.push('related');
  if (canShowResources) visibleTabs.push('resources');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            {/* Event Image */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-lg overflow-hidden">
                {event.image_url ? (
                  <img 
                    src={event.image_url} 
                    alt={event.title_ar}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-primary/40" />
                  </div>
                )}
              </div>
            </div>

            {/* Event Header Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-2xl font-bold mb-2 line-clamp-2">
                    {event.title_ar}
                  </DialogTitle>
                  <p className="text-muted-foreground mb-3 line-clamp-2">
                    {event.description_ar}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusColor(event.status)}>
                      {getStatusText(event.status)}
                    </Badge>
                    <Badge variant="outline">
                      {event.event_type}
                    </Badge>
                    {event.format === 'virtual' && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {isRTL ? 'عبر الإنترنت' : 'Online'}
                      </Badge>
                    )}
                    {event.format === 'hybrid' && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <Video className="w-3 h-3" />
                        {isRTL ? 'مختلط' : 'Hybrid'}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleBookmark()}
                    disabled={interactionsLoading}
                  >
                    <Bookmark className={`w-4 h-4 ${interactions?.isBookmarked ? 'fill-current text-primary' : ''}`} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleLike()}
                    disabled={interactionsLoading}
                  >
                    <Heart className={`w-4 h-4 ${interactions?.isLiked ? 'fill-current text-red-500' : ''}`} />
                    <span className="ml-1">{interactions?.likes_count || 0}</span>
                  </Button>
                  <EventSocialShare 
                    event={event}
                    trigger={
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    }
                  />
                </div>
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{formatDate(event.event_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{event.start_time} - {event.end_time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate">{event.location || (event.format === 'virtual' ? (isRTL ? 'عبر الإنترنت' : 'Online') : 'TBD')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{event.registered_participants}/{event.max_participants || '∞'}</span>
                </div>
              </div>

              {/* Registration Progress */}
              {event.max_participants && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>{isRTL ? 'حالة التسجيل' : 'Registration Status'}</span>
                    <span>{Math.round(getRegistrationPercentage())}% {isRTL ? 'ممتلئ' : 'full'}</span>
                  </div>
                  <Progress value={getRegistrationPercentage()} className="h-2" />
                  {getRegistrationPercentage() > 80 && (
                    <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {isRTL ? 'أماكن محدودة متبقية' : 'Limited spots remaining'}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full grid-cols-${visibleTabs.length}`}>
            <TabsTrigger value="details">
              {isRTL ? 'التفاصيل' : 'Details'}
            </TabsTrigger>
            <TabsTrigger value="registration">
              {isRTL ? 'التسجيل' : 'Registration'}
            </TabsTrigger>
            <TabsTrigger value="feedback">
              {isRTL ? 'التقييمات' : 'Feedback'}
            </TabsTrigger>
            {canShowParticipants && (
              <TabsTrigger value="attendees">
                {isRTL ? 'الحضور' : 'Attendees'}
              </TabsTrigger>
            )}
            {canShowPartners && (
              <TabsTrigger value="partners">
                {isRTL ? 'الشركاء' : 'Partners'}
              </TabsTrigger>
            )}
            {canShowRelated && (
              <TabsTrigger value="related">
                {isRTL ? 'ذات صلة' : 'Related'}
              </TabsTrigger>
            )}
            {canShowResources && (
              <TabsTrigger value="resources">
                {isRTL ? 'الموارد' : 'Resources'}
              </TabsTrigger>
            )}
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {isRTL ? 'معلومات الفعالية' : 'Event Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">{isRTL ? 'الوصف' : 'Description'}</h4>
                    <p className="text-sm text-muted-foreground">{event.description_ar}</p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">{isRTL ? 'النوع:' : 'Type:'}</span>
                      <span className="ml-2">{event.event_type}</span>
                    </div>
                    <div>
                      <span className="font-medium">{isRTL ? 'الصيغة:' : 'Format:'}</span>
                      <span className="ml-2">{event.format}</span>
                    </div>
                    <div>
                      <span className="font-medium">{isRTL ? 'الفئة:' : 'Category:'}</span>
                      <span className="ml-2">{event.event_category}</span>
                    </div>
                    <div>
                      <span className="font-medium">{isRTL ? 'الرؤية:' : 'Visibility:'}</span>
                      <span className="ml-2">{event.event_visibility}</span>
                    </div>
                  </div>
                  {event.virtual_link && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2">{isRTL ? 'رابط الحضور الافتراضي' : 'Virtual Meeting Link'}</h4>
                        <Button variant="outline" size="sm" asChild>
                          <a href={event.virtual_link} target="_blank" rel="noopener noreferrer">
                            <Video className="w-4 h-4 mr-2" />
                            {isRTL ? 'انضم للاجتماع' : 'Join Meeting'}
                          </a>
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {isRTL ? 'الإحصائيات' : 'Statistics'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-foreground">{interactions?.participants_count || event.registered_participants}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'مسجل' : 'Registered'}</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-foreground">{event.actual_participants}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'حضر' : 'Attended'}</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-foreground">{interactions?.likes_count || 0}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'إعجاب' : 'Likes'}</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-foreground">{interactions?.feedback_count || 0}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'تقييم' : 'Reviews'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Registration Tab */}
          <TabsContent value="registration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  {isRTL ? 'معلومات التسجيل' : 'Registration Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.max_participants && (
                  <div>
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>{isRTL ? 'المقاعد المحجوزة' : 'Seats Reserved'}</span>
                      <span>{event.registered_participants} / {event.max_participants}</span>
                    </div>
                    <Progress value={getRegistrationPercentage()} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{Math.round(getRegistrationPercentage())}% {isRTL ? 'ممتلئ' : 'full'}</span>
                      <span>{(event.max_participants - event.registered_participants)} {isRTL ? 'مقعد متبقي' : 'spots left'}</span>
                    </div>
                  </div>
                )}

                {interactions?.isRegistered ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800 dark:text-green-400 mb-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium">{isRTL ? 'مسجل بنجاح!' : 'Successfully Registered!'}</span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {isRTL ? 'أنت مسجل في هذه الفعالية. سيتم إرسال تفاصيل إضافية قريباً.' : 'You are registered for this event. Additional details will be sent soon.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {event.budget && event.budget > 0 && (
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium">{isRTL ? 'رسوم التسجيل' : 'Registration Fee'}</span>
                        </div>
                        <span className="text-lg font-bold">{event.budget.toLocaleString()} {isRTL ? 'ر.س' : 'SAR'}</span>
                      </div>
                    )}
                    
                    <Button 
                      onClick={() => registerForEvent()}
                      disabled={isEventFull || event.status === 'completed' || event.status === 'مكتمل' || interactionsLoading}
                      className="w-full"
                      size="lg"
                    >
                      {isEventFull ? 
                        (isRTL ? 'الفعالية ممتلئة' : 'Event Full') :
                        event.status === 'completed' || event.status === 'مكتمل' ?
                        (isRTL ? 'انتهت الفعالية' : 'Event Ended') :
                        (isRTL ? 'سجل الآن' : 'Register Now')
                      }
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  {isRTL ? 'التقييمات والمراجعات' : 'Ratings & Reviews'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{isRTL ? 'لا توجد تقييمات بعد' : 'No reviews yet'}</p>
                  <p className="text-sm">{isRTL ? 'كن أول من يترك تقييماً لهذه الفعالية' : 'Be the first to review this event'}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendees Tab */}
          {canShowParticipants && (
            <TabsContent value="attendees">
              <AttendeesTab 
                participants={allParticipants}
                loading={participantsLoading}
                onUpdateStatus={updateParticipantStatus}
                onCancelRegistration={cancelRegistration}
              />
            </TabsContent>
          )}

          {/* Partners & Stakeholders Tab */}
          {canShowPartners && (
            <TabsContent value="partners">
              <PartnersStakeholdersTab 
                partners={partners}
                stakeholders={stakeholders}
              />
            </TabsContent>
          )}

          {/* Related Items Tab */}
          {canShowRelated && (
            <TabsContent value="related">
              <RelatedItemsTab 
                relatedChallenges={relatedChallenges}
                focusQuestions={focusQuestions}
                campaignInfo={campaignInfo}
              />
            </TabsContent>
          )}

          {/* Resources Tab */}
          {canShowResources && (
            <TabsContent value="resources">
              <EventResourcesTab eventId={event.id} resources={[]} />
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
