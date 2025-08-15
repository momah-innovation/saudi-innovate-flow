import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useDirection } from '@/components/ui/direction-provider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';
import { 
  Clock, 
  Users, 
  CheckCircle,
  AlertCircle,
  Bell
} from 'lucide-react';

interface Event {
  id: string;
  title_ar: string;
  description_ar: string;
  event_date: string;
  max_participants?: number;
  registered_participants: number;
}

interface EventWaitlistDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const EventWaitlistDialog = ({ 
  event, 
  open, 
  onOpenChange, 
  onSuccess 
}: EventWaitlistDialogProps) => {
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');

  const handleJoinWaitlist = async () => {
    if (!user || !event) return;

    try {
      setLoading(true);

      // Check if user is already on waitlist
      const { data: existingEntry } = await supabase
        .from('event_waitlist')
        .select('id')
        .eq('event_id', event.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingEntry) {
        toast({
          title: isRTL ? 'مسجل مسبقاً' : 'Already on Waitlist',
          description: isRTL ? 'أنت مسجل في قائمة الانتظار بالفعل' : 'You are already on the waitlist for this event',
          variant: 'destructive'
        });
        return;
      }

      // Use event stats hook for waitlist count
      const { data: eventStats } = await supabase
        .from('events')
        .select('id')
        .eq('id', event.id)
        .maybeSingle();
      
      // Get waitlist count through cached query  
      const position = (event.max_participants && event.registered_participants >= event.max_participants) 
        ? await getWaitlistPosition(event.id) 
        : 1;
        
      async function getWaitlistPosition(eventId: string): Promise<number> {
        const { count } = await supabase
          .from('event_waitlist')
          .select('*', { count: 'exact' })
          .eq('event_id', eventId);
        return (count || 0) + 1;
      }

      // Add to waitlist
      const { error } = await supabase
        .from('event_waitlist')
        .insert({
          event_id: event.id,
          user_id: user.id,
          position_in_queue: position
        });

      if (error) throw error;

      toast({
        title: isRTL ? 'تم الانضمام لقائمة الانتظار!' : 'Joined Waitlist!',
        description: isRTL 
          ? `تم إضافتك لقائمة الانتظار في المركز ${position}. سنبلغك عند توفر مكان.`
          : `You've been added to the waitlist at position ${position}. We'll notify you when a spot opens up.`,
      });

      onSuccess?.();
      onOpenChange(false);
      setNotes('');

    } catch (error) {
      logger.error('Error joining waitlist', { 
        component: 'EventWaitlistDialog', 
        action: 'handleJoinWaitlist',
        data: { eventId: event.id, userId: user?.id }
      }, error as Error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في الانضمام لقائمة الانتظار' : 'Failed to join waitlist',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!event) return null;

  const spotsRemaining = event.max_participants ? event.max_participants - event.registered_participants : 0;
  const isFull = event.max_participants ? event.registered_participants >= event.max_participants : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            {isRTL ? 'الانضمام لقائمة الانتظار' : 'Join Waitlist'}
          </DialogTitle>
          <DialogDescription>
            {isRTL 
              ? 'انضم لقائمة الانتظار وسنبلغك فور توفر مكان في هذه الفعالية'
              : 'Join the waitlist and we\'ll notify you as soon as a spot becomes available for this event'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Event Info */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium text-sm mb-2">{event.title_ar}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>
                  {event.registered_participants}
                  {event.max_participants && ` / ${event.max_participants}`}
                  {isRTL ? ' مسجل' : ' registered'}
                </span>
              </div>
              
              {isFull ? (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{isRTL ? 'الفعالية ممتلئة حالياً' : 'Event is currently full'}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-orange-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {spotsRemaining} {isRTL ? 'أماكن متبقية' : 'spots remaining'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Waitlist Benefits */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {isRTL ? 'فوائد قائمة الانتظار:' : 'Waitlist Benefits:'}
            </Label>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Bell className="w-4 h-4 mt-0.5 text-blue-500" />
                <span>
                  {isRTL 
                    ? 'إشعار فوري عند توفر مكان'
                    : 'Instant notification when a spot opens up'
                  }
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                <span>
                  {isRTL 
                    ? 'أولوية في التسجيل'
                    : 'Priority registration access'
                  }
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 mt-0.5 text-purple-500" />
                <span>
                  {isRTL 
                    ? 'معرفة موقعك في قائمة الانتظار'
                    : 'Know your position in the waitlist'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Optional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm">
              {isRTL ? 'ملاحظات (اختياري)' : 'Notes (Optional)'}
            </Label>
            <Textarea
              id="notes"
              placeholder={isRTL 
                ? 'أخبرنا لماذا تريد حضور هذه الفعالية...'
                : 'Tell us why you want to attend this event...'
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {isRTL ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button onClick={handleJoinWaitlist} disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {isRTL ? 'جاري الانضمام...' : 'Joining...'}
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 mr-2" />
                {isRTL ? 'انضم لقائمة الانتظار' : 'Join Waitlist'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};