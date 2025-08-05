import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useDirection } from '@/components/ui/direction-provider';
import { useRTLAware } from '@/hooks/useRTLAware';
import { 
  Share2, 
  Copy, 
  Mail,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Check
} from 'lucide-react';

interface Event {
  id: string;
  title_ar: string;
  description_ar: string;
  event_date: string;
  location?: string;
}

interface EventSocialShareProps {
  event: Event;
  trigger?: React.ReactNode;
  className?: string;
}

export const EventSocialShare = ({ 
  event, 
  trigger,
  className = "" 
}: EventSocialShareProps) => {
  const { isRTL } = useDirection();
  const { me } = useRTLAware();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const eventUrl = `${window.location.origin}/events/${event.id}`;
  const shareText = isRTL 
    ? `أدعوك لحضور فعالية "${event.title_ar}" في ${new Date(event.event_date).toLocaleDateString()}`
    : `I invite you to attend "${event.title_ar}" on ${new Date(event.event_date).toLocaleDateString()}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: isRTL ? 'تم النسخ!' : 'Copied!',
        description: isRTL ? 'تم نسخ رابط الفعالية' : 'Event link copied to clipboard'
      });
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في نسخ الرابط' : 'Failed to copy link',
        variant: 'destructive'
      });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title_ar,
          text: shareText,
          url: eventUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        // Share cancelled or failed - fallback to copy
      }
    } else {
      // Fallback to copy link
      handleCopyLink();
    }
  };

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(eventUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${eventUrl}`)}`,
    email: `mailto:?subject=${encodeURIComponent(event.title_ar)}&body=${encodeURIComponent(`${shareText}\n\n${eventUrl}`)}`
  };

  const socialPlatforms = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: shareUrls.whatsapp,
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-white'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: shareUrls.facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: shareUrls.twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      textColor: 'text-white'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: shareUrls.linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      textColor: 'text-white'
    },
    {
      name: 'Email',
      icon: Mail,
      url: shareUrls.email,
      color: 'bg-gray-600 hover:bg-gray-700',
      textColor: 'text-white'
    }
  ];

  const handleSocialShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className={className}>
            <Share2 className={`w-4 h-4 ${me('2')}`} />
            {isRTL ? 'مشاركة' : 'Share'}
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            {isRTL ? 'مشاركة الفعالية' : 'Share Event'}
          </DialogTitle>
          <DialogDescription>
            {isRTL ? 'شارك هذه الفعالية مع الآخرين' : 'Share this event with others'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Event Preview */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <h3 className="font-medium text-sm line-clamp-2">{event.title_ar}</h3>
            <div className="text-xs text-muted-foreground mt-1">
              {new Date(event.event_date).toLocaleDateString()}
              {event.location && ` • ${event.location}`}
            </div>
          </div>

          {/* Native Share (mobile) */}
          {navigator.share && (
            <Button onClick={handleNativeShare} className="w-full" variant="outline">
              <Share2 className={`w-4 h-4 ${me('2')}`} />
              {isRTL ? 'مشاركة' : 'Share'}
            </Button>
          )}

          {/* Copy Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {isRTL ? 'رابط الفعالية' : 'Event Link'}
            </label>
            <div className="flex gap-2">
              <Input
                value={eventUrl}
                readOnly
                className="flex-1"
              />
              <Button 
                onClick={handleCopyLink} 
                variant="outline"
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Social Platforms */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              {isRTL ? 'المشاركة عبر' : 'Share via'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {socialPlatforms.map((platform) => {
                const IconComponent = platform.icon;
                return (
                  <Button
                    key={platform.name}
                    variant="outline"
                    className={`${platform.color} ${platform.textColor} border-0 justify-start`}
                    onClick={() => handleSocialShare(platform.url)}
                  >
                    <IconComponent className={`w-4 h-4 ${me('2')}`} />
                    {platform.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Share Tips */}
          <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
            <p className="font-medium mb-1">
              {isRTL ? 'نصائح للمشاركة:' : 'Sharing Tips:'}
            </p>
            <ul className="space-y-1">
              <li>• {isRTL ? 'أضف تعليقاً شخصياً عند المشاركة' : 'Add a personal note when sharing'}</li>
              <li>• {isRTL ? 'اذكر سبب اهتمامك بالفعالية' : 'Mention why you\'re interested in the event'}</li>
              <li>• {isRTL ? 'ادع الأصدقاء ذوي الاهتمامات المشتركة' : 'Invite friends with similar interests'}</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};