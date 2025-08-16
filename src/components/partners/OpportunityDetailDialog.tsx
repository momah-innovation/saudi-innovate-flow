import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar, DollarSign, Users, FileText, 
  Target, Clock, Send, Building
} from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { errorHandler } from '@/utils/error-handler';

interface OpportunityItem {
  id: string;
  title_ar?: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  opportunity_type?: string;
  deadline: string;
  status: string;
}

interface OpportunityDetailDialogProps {
  opportunity: OpportunityItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OpportunityDetailDialog({
  opportunity,
  open,
  onOpenChange
}: OpportunityDetailDialogProps) {
  const { t, isRTL } = useUnifiedTranslation();
  const [showApplication, setShowApplication] = useState(false);
  const [applicationData, setApplicationData] = useState({
    contribution_amount: '',
    proposal_summary: '',
    company_background: '',
    contact_person: '',
    contact_email: ''
  });

  if (!opportunity) return null;

  const handleSubmitApplication = () => {
    // Here you would submit the application to the backend
    errorHandler.handleError(new Error(t('applicationSubmitted')), 'OpportunityDetailDialog-submit');
    setShowApplication(false);
    onOpenChange(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${isRTL ? 'text-right' : 'text-left'}`}>
        <DialogHeader>
        <DialogTitle className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <Target className="w-5 h-5" />
          {opportunity.title_ar || opportunity.title_en || 'Partnership Opportunity'}
        </DialogTitle>
          <DialogDescription className={isRTL ? 'text-right' : 'text-left'}>
            {t('partnershipOpportunityDetails')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Type */}
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <Badge className={getStatusColor(opportunity.status)}>
              {t(`status${opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}`)}
            </Badge>
            <Badge variant="outline">{opportunity.opportunity_type || 'Partnership'}</Badge>
          </div>

          {/* Key Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{t('timeline')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{t('deadline')}: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{t('budgetRange')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t('contactForDetails')}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h4 className={`font-medium mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('opportunityDescription')}</h4>
            <p className={`text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
              {opportunity.description_ar || opportunity.description_en || t('noDescription')}
            </p>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{t('expectedParticipants')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-lg font-semibold">
                    0
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{t('duration')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-lg font-semibold">
                    0 {t('months')}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{t('organizer')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t('innovationMinistry')}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {!showApplication ? (
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <Button
                onClick={() => setShowApplication(true)}
                className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
                disabled={opportunity.status !== 'open'}
              >
                <Send className="w-4 h-4" />
                {t('applyForPartnership')}
              </Button>
              <Button
                variant="outline"
                className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <FileText className="w-4 h-4" />
                {t('downloadDetails')}
              </Button>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className={isRTL ? 'text-right' : 'text-left'}>{t('partnershipApplication')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contribution_amount" className={isRTL ? 'text-right' : 'text-left'}>
                      {t('proposedContribution')} ({t('currency')})
                    </Label>
                    <Input
                      id="contribution_amount"
                      type="number"
                      value={applicationData.contribution_amount}
                      onChange={(e) => setApplicationData({...applicationData, contribution_amount: e.target.value})}
                      className={isRTL ? 'text-right' : 'text-left'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_person" className={isRTL ? 'text-right' : 'text-left'}>
                      {t('contactPerson')}
                    </Label>
                    <Input
                      id="contact_person"
                      value={applicationData.contact_person}
                      onChange={(e) => setApplicationData({...applicationData, contact_person: e.target.value})}
                      className={isRTL ? 'text-right' : 'text-left'}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="contact_email" className={isRTL ? 'text-right' : 'text-left'}>
                    {t('contactEmail')}
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={applicationData.contact_email}
                    onChange={(e) => setApplicationData({...applicationData, contact_email: e.target.value})}
                    className={isRTL ? 'text-right' : 'text-left'}
                  />
                </div>

                <div>
                  <Label htmlFor="company_background" className={isRTL ? 'text-right' : 'text-left'}>
                    {t('companyBackground')}
                  </Label>
                  <Textarea
                    id="company_background"
                    value={applicationData.company_background}
                    onChange={(e) => setApplicationData({...applicationData, company_background: e.target.value})}
                    rows={3}
                    className={isRTL ? 'text-right' : 'text-left'}
                  />
                </div>

                <div>
                  <Label htmlFor="proposal_summary" className={isRTL ? 'text-right' : 'text-left'}>
                    {t('proposalSummary')}
                  </Label>
                  <Textarea
                    id="proposal_summary"
                    value={applicationData.proposal_summary}
                    onChange={(e) => setApplicationData({...applicationData, proposal_summary: e.target.value})}
                    rows={4}
                    className={isRTL ? 'text-right' : 'text-left'}
                  />
                </div>

                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Button onClick={handleSubmitApplication}>
                    {t('submitApplication')}
                  </Button>
                  <Button variant="outline" onClick={() => setShowApplication(false)}>
                    {t('cancel')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}