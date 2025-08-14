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
  const [isSharing, setIsSharing] = useState(false);
  const { user } = useCurrentUser();

  const shareUrl = `${window.location.origin}/opportunities/${opportunityId}`;
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
        title: isRTL ? 'تم نسخ الرابط' : 'Link Copied',
        description: isRTL ? 'تم نسخ رابط الفرصة إلى الحافظة' : 'Opportunity link copied to clipboard',
      });
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في نسخ الرابط' : 'Failed to copy link',
        variant: 'destructive',
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleEmailShare = async () => {
    const subject = encodeURIComponent(`${isRTL ? 'فرصة شراكة:' : 'Partnership Opportunity:'} ${opportunityTitle}`);
    const body = encodeURIComponent(`${shareText}\n\n${isRTL ? 'للمزيد من التفاصيل:' : 'For more details:'} ${shareUrl}`);
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
          {isRTL ? 'مشاركة' : 'Share'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-48">
        <DropdownMenuItem onClick={handleCopyLink}>
          <Copy className="w-4 h-4 mr-2" />
          {isRTL ? 'نسخ الرابط' : 'Copy Link'}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleEmailShare}>
          <Mail className="w-4 h-4 mr-2" />
          {isRTL ? 'مشاركة بالبريد' : 'Share via Email'}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleWhatsAppShare}>
          <MessageCircle className="w-4 h-4 mr-2" />
          {isRTL ? 'مشاركة في واتساب' : 'Share on WhatsApp'}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleLinkedInShare}>
          <Linkedin className="w-4 h-4 mr-2" />
          {isRTL ? 'مشاركة في لينكدإن' : 'Share on LinkedIn'}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleTwitterShare}>
          <Twitter className="w-4 h-4 mr-2" />
          {isRTL ? 'مشاركة في تويتر' : 'Share on Twitter'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};