import { useState } from 'react';
import { useTimerManager } from '@/utils/timerManager';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useDirection } from '@/components/ui/direction-provider';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';
import { 
  Share2, 
  Copy, 
  Mail, 
  MessageCircle,
  Twitter,
  Linkedin,
  Facebook,
  Link,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareOpportunityDialogProps {
  opportunityId: string;
  opportunityTitle: string;
  children?: React.ReactNode;
  className?: string;
}

interface SharePlatform {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  url: (url: string, title: string) => string;
}

export const ShareOpportunityDialog = ({
  opportunityId,
  opportunityTitle,
  children,
  className
}: ShareOpportunityDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { setTimeout: scheduleTimeout } = useTimerManager();

  // Use proper URL building for opportunity sharing
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const opportunityUrl = `${baseUrl}/opportunities/${opportunityId}`;

  const platforms: SharePlatform[] = [
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'text-blue-400 hover:bg-blue-50',
      url: (url, title) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-600 hover:bg-blue-50',
      url: (url, title) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-500 hover:bg-blue-50',
      url: (url, title) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'text-green-500 hover:bg-green-50',
      url: (url, title) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      color: 'text-gray-600 hover:bg-gray-50',
      url: (url, title) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this opportunity: ${url}`)}`
    }
  ];

  const trackShare = async (platform: string) => {
    try {
      // Insert share record
      await supabase
        .from('opportunity_shares')
        .insert({
          opportunity_id: opportunityId,
          user_id: user?.id,
          platform,
          shared_at: new Date().toISOString()
        });

      // Track analytics
      await supabase.functions.invoke('track-opportunity-analytics', {
        body: {
          opportunityId,
          action: 'share',
          userId: user?.id,
          sessionId: sessionStorage.getItem('opportunity-session'),
          metadata: { 
            platform,
            timestamp: new Date().toISOString() 
          }
        }
      });

      // Refresh opportunity analytics
      await supabase.rpc('refresh_opportunity_analytics', {
        p_opportunity_id: opportunityId
      });

    } catch (error) {
      logger.error('Failed to track opportunity share', { 
        component: 'ShareOpportunityDialog', 
        action: 'trackShare',
        opportunityId,
        platform 
      }, error as Error);
    }
  };

  const handlePlatformShare = async (platform: SharePlatform) => {
    const shareUrl = platform.url(opportunityUrl, opportunityTitle);
    window.open(shareUrl, '_blank', 'width=600,height=400');
    
    await trackShare(platform.id);
    
    toast({
      title: t('opportunities:share.shared'),
      description: t('opportunities:share.shared_via', { platform: platform.name })
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(opportunityUrl);
      setCopied(true);
      scheduleTimeout(() => setCopied(false), 2000);
      
      await trackShare('copy_link');
      
      toast({
        title: t('opportunities:share.copied'),
        description: t('opportunities:share.link_copied')
      });
    } catch (error) {
      logger.error('Failed to copy opportunity link', { 
        component: 'ShareOpportunityDialog', 
        action: 'handleCopyLink',
        opportunityId 
      }, error as Error);
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className={cn("gap-2", className)}>
            <Share2 className="w-4 h-4" />
            {t('opportunities:share.share')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className={isRTL ? 'text-right' : 'text-left'}>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            {t('opportunities:share.share_opportunity')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Share Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('opportunities:share.opportunity_link')}
            </label>
            <div className="flex gap-2">
              <Input
                value={opportunityUrl}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Social Platforms */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('opportunities:share.share_via')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <Button
                    key={platform.id}
                    variant="outline"
                    className={cn(
                      "flex flex-col gap-1 h-16 transition-colors",
                      platform.color
                    )}
                    onClick={() => handlePlatformShare(platform)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{platform.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={handleCopyLink}
            >
              <Link className="w-4 h-4" />
              {t('opportunities:share.copy_link')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
