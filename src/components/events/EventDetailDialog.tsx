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
import { useRTLAware } from '@/hooks/useRTLAware';
import { useAuth } from '@/contexts/AuthContext';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useEventInteractions } from '@/hooks/useEventInteractions';
import { AttendeesTab } from './tabs/AttendeesTab';
import { PartnersStakeholdersTab } from './tabs/PartnersStakeholdersTab';
import { RelatedItemsTab } from './tabs/RelatedItemsTab';
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
}

interface EventDetailDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: (event: Event) => void;
}

export const EventDetailDialog = ({ event, open, onOpenChange, onRegister }: EventDetailDialogProps) => {
  const { isRTL } = useDirection();
  const { me, start, end } = useRTLAware();
  const { user, hasRole } = useAuth();

  // Use comprehensive hooks for data
  const { 
    partners, 
    stakeholders, 
    relatedChallenges, 
    focusQuestions, 
    participants, 
    campaignInfo 
  } = useEventDetails(event?.id || null);

  const { interactions } = useEventInteractions(event?.id || null);

  if (!event) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'badge-info';
      case 'ongoing': return 'badge-success';
      case 'completed': return 'badge-secondary';
      case 'cancelled': return 'badge-error';
      default: return 'badge-secondary';
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          {/* Event Header */}
          <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg -mx-6 -mt-6 mb-6">
            <div className="w-full h-full flex items-center justify-center">
              <CalendarIcon className="w-24 h-24 text-primary" />
            </div>
            
            {/* Status Badges Overlay */}
            <div className={`absolute top-4 ${end('4')} flex gap-2`}>
              {event.event_category === 'featured' && (
                <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                  <Star className={`w-3 h-3 ${me('1')}`} />
                  {isRTL ? 'مميز' : 'Featured'}
                </Badge>
              )}
              <Badge className={getStatusColor(event.status)}>
                {getStatusText(event.status)}
              </Badge>
            </div>

            {/* Online Badge */}
            {event.format === 'virtual' && (
              <div className={`absolute bottom-4 ${start('4')}`}>
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  <Globe className={`w-3 h-3 ${me('1')}`} />
                  {isRTL ? 'عبر الإنترنت' : 'Online Event'}
                </Badge>
              </div>
            )}

            {/* Action Buttons */}
            <div className={`absolute top-4 ${start('4')} flex gap-2`}>
              <Button variant="secondary" size="sm" className="bg-card/80 hover:bg-card">
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="sm" className="bg-card/80 hover:bg-card">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-2xl mb-2">
                  {event.title_ar}
                </DialogTitle>
                <DialogDescription className="text-base">
                  {event.description_ar}
                </DialogDescription>
              </div>
              <Badge variant="outline">
                {event.event_type || 'Event'}
              </Badge>
            </div>

            {/* Key Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <CalendarIcon className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-sm font-bold">{formatDate(event.event_date)}</div>
                <div className="text-xs text-muted-foreground">{event.start_time || 'TBD'}</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <MapPin className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-sm font-bold truncate">{event.location || 'Location TBD'}</div>
                <div className="text-xs text-muted-foreground">{isRTL ? 'الموقع' : 'Location'}</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-lg font-bold">{event.registered_participants}/{event.max_participants || '∞'}</div>
                <div className="text-xs text-muted-foreground">{isRTL ? 'المسجلين' : 'Registered'}</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Ticket className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-lg font-bold">{event.budget ? `${event.budget} SAR` : (isRTL ? 'مجاني' : 'Free')}</div>
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
                <Progress value={getRegistrationPercentage()} className="h-2" />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {getRegistrationPercentage() < 70 ? (
                    <CheckCircle className="w-3 h-3 text-success" />
                  ) : getRegistrationPercentage() < 90 ? (
                    <AlertCircle className="w-3 h-3 text-warning" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-destructive" />
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
            const canViewResources = interactions?.isRegistered || hasRole('admin') || hasRole('super_admin') || 
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
            <div className="grid gap-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  {isRTL ? 'معلومات الفعالية' : 'Event Information'}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isRTL ? 'النوع:' : 'Type:'}</span>
                    <span>{event.event_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isRTL ? 'الفئة:' : 'Category:'}</span>
                    <span>{event.event_category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isRTL ? 'التنسيق:' : 'Format:'}</span>
                    <span>{event.format}</span>
                  </div>
                  {event.virtual_link && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isRTL ? 'الرابط:' : 'Link:'}</span>
                      <Button variant="link" size="sm" className="h-auto p-0">
                        {isRTL ? 'انضم الآن' : 'Join Now'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="registration" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">{isRTL ? 'معلومات التسجيل' : 'Registration Information'}</h4>
                
                {event.max_participants && (
                  <div className="mb-4">
                    <Progress 
                      value={getRegistrationPercentage()} 
                      className="mb-2" 
                    />
                    <p className="text-sm text-muted-foreground">
                      {event.registered_participants} of {event.max_participants} spots filled
                    </p>
                  </div>
                )}

                <Button 
                  onClick={() => onRegister(event)} 
                  className="w-full"
                  disabled={isEventFull || event.status === 'completed' || event.status === 'cancelled'}
                >
                  {isEventFull ? 
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

          {/* Attendees Tab */}
          {(hasRole('admin') || hasRole('super_admin') || hasRole('event_manager') || (event?.event_manager_id === user?.id)) && (
            <TabsContent value="attendees" className="space-y-4">
              <AttendeesTab 
                participants={participants}
                maxParticipants={event.max_participants}
                loading={false}
                onUpdateStatus={async () => {}}
                onCancelRegistration={async () => {}}
              />
            </TabsContent>
          )}

          {/* Partners & Stakeholders Tab */}
          {(hasRole('admin') || hasRole('super_admin') || hasRole('event_manager') || hasRole('partner') || (event?.event_manager_id === user?.id)) && (
            <TabsContent value="partners" className="space-y-4">
              <PartnersStakeholdersTab 
                partners={partners}
                stakeholders={stakeholders}
              />
            </TabsContent>
          )}

          {/* Related Items Tab */}
          {(hasRole('admin') || hasRole('super_admin') || hasRole('expert') || hasRole('event_manager') || hasRole('innovator')) && (
            <TabsContent value="related" className="space-y-4">
              <RelatedItemsTab 
                relatedChallenges={relatedChallenges}
                focusQuestions={focusQuestions}
                campaignInfo={campaignInfo}
              />
            </TabsContent>
          )}

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                {isRTL ? 'التقييمات والمراجعات' : 'Ratings & Reviews'}
              </h4>
              <div className="text-center py-8 text-muted-foreground">
                {isRTL ? 'لا توجد تقييمات بعد' : 'No reviews yet'}
              </div>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          {(interactions?.isRegistered || hasRole('admin') || hasRole('super_admin') || hasRole('event_manager') || (event?.event_manager_id === user?.id)) && (
            <TabsContent value="resources" className="space-y-4">
              <EventResourcesTab 
                eventId={event.id}
                resources={[]}
              />
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};