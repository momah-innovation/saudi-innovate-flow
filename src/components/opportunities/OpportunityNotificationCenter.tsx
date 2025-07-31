import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

export const OpportunityNotificationCenter = () => {
  const { isRTL } = useDirection();

  return (
    <Button variant="outline" size="sm" className="relative">
      <Bell className="w-4 h-4 mr-2" />
      {isRTL ? 'الإشعارات' : 'Notifications'}
      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
        3
      </Badge>
    </Button>
  );
};