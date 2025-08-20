import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  FileText,
  Download,
  User,
  Building2,
  Phone,
  Mail,
  DollarSign,
  Calendar
} from 'lucide-react';

interface ApplicationsManagementDialogProps {
  opportunityId: string;
  opportunityTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Application {
  id: string;
  applicant_id: string;
  application_type: string;
  organization_name?: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  proposal_summary: string;
  expected_budget?: number;
  timeline_months?: number;
  team_size?: number;
  relevant_experience: string;
  attachment_urls?: string[];
  status: string;
  created_at: string;
  reviewed_at?: string;
  reviewer_notes?: string;
  applicant_profile?: {
    display_name?: string;
    email?: string;
  };
}

export const ApplicationsManagementDialog = ({
  opportunityId,
  opportunityTitle,
  open,
  onOpenChange
}: ApplicationsManagementDialogProps) => {
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (open && opportunityId) {
      loadApplications();
    }
  }, [open, opportunityId]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('opportunity_applications')
        .select('*')
        .eq('opportunity_id', opportunityId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const processedData = data?.map(app => ({
        ...app,
        applicant_profile: {
          display_name: app.contact_person,
          email: app.contact_email
        }
      })) || [];

      setApplications(processedData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: t('opportunities:applications.error'),
        description: t('opportunities:applications.load_error'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('opportunity_applications')
        .update({
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewer_notes: notes
        })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: t('opportunities:applications.updated'),
        description: t('opportunities:applications.status_updated'),
      });

      loadApplications();
      setSelectedApplication(null);
      setReviewNotes('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: t('opportunities:applications.error'),
        description: t('opportunities:applications.update_error'),
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'under_review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: t('opportunities:applications.status.pending'),
      under_review: t('opportunities:applications.status.under_review'),
      approved: t('opportunities:applications.status.approved'),
      rejected: t('opportunities:applications.status.rejected')
    };
    return labels[status] || status;
  };

  const filteredApplications = applications.filter(app => 
    statusFilter === 'all' || app.status === statusFilter
  );

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {t('opportunities:applications.manage_applications')}
          </DialogTitle>
          <p className="text-muted-foreground">{opportunityTitle}</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('opportunities:applications.total')}</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('opportunities:applications.status.pending')}</p>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('opportunities:applications.status.approved')}</p>
                    <p className="text-2xl font-bold">{stats.approved}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('opportunities:applications.status.rejected')}</p>
                    <p className="text-2xl font-bold">{stats.rejected}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('opportunities:applications.filter_by_status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('opportunities:applications.all_applications')}</SelectItem>
                <SelectItem value="pending">{t('opportunities:applications.status.pending')}</SelectItem>
                <SelectItem value="under_review">{t('opportunities:applications.status.under_review')}</SelectItem>
                <SelectItem value="approved">{t('opportunities:applications.status.approved')}</SelectItem>
                <SelectItem value="rejected">{t('opportunities:applications.status.rejected')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">{t('opportunities:applications.loading')}</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('opportunities:applications.no_applications')}</h3>
                <p className="text-muted-foreground">
                  {t('opportunities:applications.no_applications_desc')}
                </p>
              </div>
            ) : (
              filteredApplications.map((application) => (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                          {application.application_type === 'organization' ? 
                            <Building2 className="w-6 h-6" /> : 
                            <User className="w-6 h-6" />
                          }
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {application.organization_name || application.contact_person}
                          </h3>
                          <p className="text-muted-foreground">
                            {application.applicant_profile?.display_name || application.contact_person}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(application.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(application.status)}>
                          {getStatusLabel(application.status)}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                        >
                          <Eye className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {t('opportunities:applications.view')}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{application.contact_email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{application.contact_phone}</span>
                      </div>
                      {application.expected_budget && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span>{application.expected_budget.toLocaleString()} {t('opportunities:applications.currency')}</span>
                        </div>
                      )}
                      {application.timeline_months && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{application.timeline_months} {t('opportunities:applications.months')}</span>
                        </div>
                      )}
                    </div>

                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                      {application.proposal_summary}
                    </p>

                    {application.status === 'pending' && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          onClick={() => updateApplicationStatus(application.id, 'under_review')}
                        >
                          {t('opportunities:applications.review')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => updateApplicationStatus(application.id, 'approved')}
                        >
                          {t('opportunities:applications.approve')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => updateApplicationStatus(application.id, 'rejected')}
                        >
                          {t('opportunities:applications.reject')}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Application Detail Dialog */}
        {selectedApplication && (
          <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t('opportunities:applications.application_details')}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Application Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {t('opportunities:applications.application_type')}
                      </Label>
                      <p className="font-medium">
                        {selectedApplication.application_type === 'organization' ? 
                          t('opportunities:applications.organization') : 
                          t('opportunities:applications.individual')
                        }
                      </p>
                    </div>
                    
                    {selectedApplication.organization_name && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          {t('opportunities:applications.organization_name')}
                        </Label>
                        <p className="font-medium">{selectedApplication.organization_name}</p>
                      </div>
                    )}
                    
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {t('opportunities:applications.contact_person')}
                      </Label>
                      <p className="font-medium">{selectedApplication.contact_person}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {t('opportunities:applications.email')}
                      </Label>
                      <p className="font-medium">{selectedApplication.contact_email}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {t('opportunities:applications.phone')}
                      </Label>
                      <p className="font-medium">{selectedApplication.contact_phone}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {t('opportunities:applications.status')}
                      </Label>
                      <Badge className={getStatusColor(selectedApplication.status)}>
                        {getStatusLabel(selectedApplication.status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                {(selectedApplication.expected_budget || selectedApplication.timeline_months || selectedApplication.team_size) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{t('opportunities:applications.project_details')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedApplication.expected_budget && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            {t('opportunities:applications.expected_budget')}
                          </Label>
                          <p className="font-medium">
                            {selectedApplication.expected_budget.toLocaleString()} {t('opportunities:applications.currency')}
                          </p>
                        </div>
                      )}
                      
                      {selectedApplication.timeline_months && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            {t('opportunities:applications.timeline')}
                          </Label>
                          <p className="font-medium">
                            {selectedApplication.timeline_months} {t('opportunities:applications.months')}
                          </p>
                        </div>
                      )}
                      
                      {selectedApplication.team_size && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            {t('opportunities:applications.team_size')}
                          </Label>
                          <p className="font-medium">{selectedApplication.team_size}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Proposal Summary */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t('opportunities:applications.proposal_summary')}</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedApplication.proposal_summary}</p>
                  </div>
                </div>

                {/* Relevant Experience */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t('opportunities:applications.relevant_experience')}</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedApplication.relevant_experience}</p>
                  </div>
                </div>

                {/* Attachments */}
                {selectedApplication.attachment_urls && selectedApplication.attachment_urls.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{t('opportunities:applications.attachments')}</h3>
                    <div className="space-y-2">
                      {selectedApplication.attachment_urls.map((url, index) => (
                        <Button key={index} variant="outline" size="sm" asChild>
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            <Download className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {t('opportunities:applications.attachment')} {index + 1}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Section */}
                {selectedApplication.status === 'pending' && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">{t('opportunities:applications.review_application')}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>{t('opportunities:applications.review_notes')}</Label>
                        <Textarea
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          placeholder={t('opportunities:applications.review_notes_placeholder')}
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex gap-3">
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => updateApplicationStatus(selectedApplication.id, 'approved', reviewNotes)}
                        >
                          <CheckCircle className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {t('opportunities:applications.approve_application')}
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          onClick={() => updateApplicationStatus(selectedApplication.id, 'under_review', reviewNotes)}
                        >
                          <Clock className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {t('opportunities:applications.mark_under_review')}
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected', reviewNotes)}
                        >
                          <XCircle className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {t('opportunities:applications.reject_application')}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Existing Review Notes */}
                {selectedApplication.reviewer_notes && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-3">{t('opportunities:applications.reviewer_notes')}</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{selectedApplication.reviewer_notes}</p>
                      {selectedApplication.reviewed_at && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {t('opportunities:applications.reviewed_on')} {' '}
                          {new Date(selectedApplication.reviewed_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};
