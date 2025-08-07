import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, DollarSign, Users, FileText, 
  Target, TrendingUp, MessageSquare, Edit
} from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface Partnership {
  id: string;
  title: string;
  type: 'challenge' | 'event' | 'campaign';
  status: string;
  start_date: string;
  end_date?: string;
  contribution: number;
  description: string;
}

interface PartnershipDetailDialogProps {
  partnership: Partnership | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (partnership: Partnership) => void;
}

export function PartnershipDetailDialog({
  partnership,
  open,
  onOpenChange,
  onEdit
}: PartnershipDetailDialogProps) {
  const { t, isRTL } = useUnifiedTranslation();

  if (!partnership) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${isRTL ? 'text-right' : 'text-left'}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            {partnership.type === 'challenge' && <Target className="w-5 h-5" />}
            {partnership.type === 'event' && <Calendar className="w-5 h-5" />}
            {partnership.type === 'campaign' && <TrendingUp className="w-5 h-5" />}
            {partnership.title}
          </DialogTitle>
          <DialogDescription className={isRTL ? 'text-right' : 'text-left'}>
            {t('partnershipDetails')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Overview */}
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <Badge className={getStatusColor(partnership.status)}>
              {t(`status${partnership.status.charAt(0).toUpperCase() + partnership.status.slice(1)}`)}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(partnership)}
              className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <Edit className="w-4 h-4" />
              {t('edit')}
            </Button>
          </div>

          {/* Key Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{t('timeline')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{t('startDate')}: {new Date(partnership.start_date).toLocaleDateString()}</span>
                </div>
                {partnership.end_date && (
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{t('endDate')}: {new Date(partnership.end_date).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{t('contribution')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-lg font-semibold">
                    {partnership.contribution.toLocaleString()} {t('currency')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h4 className={`font-medium mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('description')}</h4>
            <p className={`text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
              {partnership.description}
            </p>
          </div>

          {/* Partnership Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{t('ideasGenerated')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
                  0
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{t('participants')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">
                    0
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{t('impactScore')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold text-green-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                  0%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <Button
              variant="outline"
              className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <FileText className="w-4 h-4" />
              {t('viewContract')}
            </Button>
            <Button
              variant="outline"
              className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <MessageSquare className="w-4 h-4" />
              {t('sendMessage')}
            </Button>
            <Button
              variant="outline"
              className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <TrendingUp className="w-4 h-4" />
              {t('viewAnalytics')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}