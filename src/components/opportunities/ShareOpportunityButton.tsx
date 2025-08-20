import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Share2, Copy, Mail, MessageCircle, Linkedin, Twitter } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface ShareOpportunityButtonProps {
  opportunityId: string;
  opportunityTitle: string;
  opportunityDescription?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export const ShareOpportunityButton = ({
  opportunityId,
  opportunityTitle,
  opportunityDescription,
  variant = 'outline',
  size = 'default'
}: ShareOpportunityButtonProps) => {
  const { toast } = useToast();
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const [isSharing, setIsSharing] = useState(false);
  const { user } = useCurrentUser();

  // Use proper URL building for opportunity sharing
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${baseUrl}/opportunities/${opportunityId}`;
  const shareText = `${opportunityTitle} - ${opportunityDescription?.substring(0, 100)}...`;

  const trackShare = async (platform: string) => {
    try {
      await supabase.functions.invoke('track-opportunity-analytics', {
        body: {
          opportunityId,
          action: 'share',
          userId: user?.id,
          metadata: { platform }
        }
      });
    } catch (error) {
      logger.error('Failed to track opportunity share', { 
        component: 'ShareOpportunityButton', 
        action: 'trackShare',
        opportunityId,
        platform 
      }, error as Error);
    }
  };

  const handleCopyLink = async () => {
    try {
      setIsSharing(true);
      await navigator.clipboard.writeText(shareUrl);
      await trackShare('clipboard');
      toast({
        title: t('opportunities:share.link_copied_title'),
        description: t('opportunities:share.link_copied_desc'),
      });
    } catch (error) {
      toast({
        title: t('opportunities:share.error'),
        description: t('opportunities:share.copy_failed'),
        variant: 'destructive',
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleEmailShare = async () => {
    const subject = encodeURIComponent(`${t('opportunities:share.email_subject')} ${opportunityTitle}`);
    const body = encodeURIComponent(`${shareText}\n\n${t('opportunities:share.for_more_details')} ${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
    await trackShare('email');
  };

  const handleWhatsAppShare = async () => {
    const text = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    await trackShare('whatsapp');
  };

  const handleLinkedInShare = async () => {
    const url = encodeURIComponent(shareUrl);
    const title = encodeURIComponent(opportunityTitle);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`, '_blank');
    await trackShare('linkedin');
  };

  const handleTwitterShare = async () => {
    const text = encodeURIComponent(`${shareText} ${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    await trackShare('twitter');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isSharing}>
          <Share2 className="w-4 h-4 mr-2" />
          {t('opportunities:share.share')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-48">
        <DropdownMenuItem onClick={handleCopyLink}>
          <Copy className="w-4 h-4 mr-2" />
          {t('opportunities:share.copy_link')}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleEmailShare}>
          <Mail className="w-4 h-4 mr-2" />
          {t('opportunities:share.share_via_email')}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleWhatsAppShare}>
          <MessageCircle className="w-4 h-4 mr-2" />
          {t('opportunities:share.share_on_whatsapp')}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleLinkedInShare}>
          <Linkedin className="w-4 h-4 mr-2" />
          {t('opportunities:share.share_on_linkedin')}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleTwitterShare}>
          <Twitter className="w-4 h-4 mr-2" />
          {t('opportunities:share.share_on_twitter')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
