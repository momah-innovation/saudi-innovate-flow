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
      console.error('Error loading applications:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تحميل الطلبات' : 'Failed to load applications',
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
        title: isRTL ? 'تم التحديث' : 'Updated',
        description: isRTL ? 'تم تحديث حالة الطلب' : 'Application status updated',
      });

      loadApplications();
      setSelectedApplication(null);
      setReviewNotes('');
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تحديث الطلب' : 'Failed to update application',
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
      pending: isRTL ? 'في الانتظار' : 'Pending',
      under_review: isRTL ? 'قيد المراجعة' : 'Under Review',
      approved: isRTL ? 'مقبول' : 'Approved',
      rejected: isRTL ? 'مرفوض' : 'Rejected'
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
            {isRTL ? 'إدارة الطلبات' : 'Manage Applications'}
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
                    <p className="text-sm text-muted-foreground">{isRTL ? 'المجموع' : 'Total'}</p>
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
                    <p className="text-sm text-muted-foreground">{isRTL ? 'في الانتظار' : 'Pending'}</p>
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
                    <p className="text-sm text-muted-foreground">{isRTL ? 'مقبول' : 'Approved'}</p>
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
                    <p className="text-sm text-muted-foreground">{isRTL ? 'مرفوض' : 'Rejected'}</p>
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
                <SelectValue placeholder={isRTL ? 'تصفية حسب الحالة' : 'Filter by status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع الطلبات' : 'All Applications'}</SelectItem>
                <SelectItem value="pending">{isRTL ? 'في الانتظار' : 'Pending'}</SelectItem>
                <SelectItem value="under_review">{isRTL ? 'قيد المراجعة' : 'Under Review'}</SelectItem>
                <SelectItem value="approved">{isRTL ? 'مقبول' : 'Approved'}</SelectItem>
                <SelectItem value="rejected">{isRTL ? 'مرفوض' : 'Rejected'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{isRTL ? 'لا توجد طلبات' : 'No Applications'}</h3>
                <p className="text-muted-foreground">
                  {isRTL ? 'لم يتم تقديم أي طلبات لهذه الفرصة بعد' : 'No applications have been submitted for this opportunity yet'}
                </p>
              </div>
            ) : (
              filteredApplications.map((application) => (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
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
                          <Eye className="w-4 h-4 mr-2" />
                          {isRTL ? 'عرض' : 'View'}
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
                          <span>{application.expected_budget.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}</span>
                        </div>
                      )}
                      {application.timeline_months && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{application.timeline_months} {isRTL ? 'شهر' : 'months'}</span>
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
                          {isRTL ? 'مراجعة' : 'Review'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => updateApplicationStatus(application.id, 'approved')}
                        >
                          {isRTL ? 'قبول' : 'Approve'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => updateApplicationStatus(application.id, 'rejected')}
                        >
                          {isRTL ? 'رفض' : 'Reject'}
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
                  {isRTL ? 'تفاصيل الطلب' : 'Application Details'}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Application Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {isRTL ? 'نوع التقديم' : 'Application Type'}
                      </Label>
                      <p className="font-medium">
                        {selectedApplication.application_type === 'organization' ? 
                          (isRTL ? 'مؤسسي' : 'Organization') : 
                          (isRTL ? 'فردي' : 'Individual')
                        }
                      </p>
                    </div>
                    
                    {selectedApplication.organization_name && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          {isRTL ? 'اسم المؤسسة' : 'Organization Name'}
                        </Label>
                        <p className="font-medium">{selectedApplication.organization_name}</p>
                      </div>
                    )}
                    
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {isRTL ? 'الشخص المسؤول' : 'Contact Person'}
                      </Label>
                      <p className="font-medium">{selectedApplication.contact_person}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {isRTL ? 'البريد الإلكتروني' : 'Email'}
                      </Label>
                      <p className="font-medium">{selectedApplication.contact_email}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {isRTL ? 'رقم الهاتف' : 'Phone'}
                      </Label>
                      <p className="font-medium">{selectedApplication.contact_phone}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {isRTL ? 'الحالة' : 'Status'}
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
                    <h3 className="text-lg font-semibold mb-3">{isRTL ? 'تفاصيل المشروع' : 'Project Details'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedApplication.expected_budget && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            {isRTL ? 'الميزانية المتوقعة' : 'Expected Budget'}
                          </Label>
                          <p className="font-medium">
                            {selectedApplication.expected_budget.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}
                          </p>
                        </div>
                      )}
                      
                      {selectedApplication.timeline_months && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            {isRTL ? 'المدة الزمنية' : 'Timeline'}
                          </Label>
                          <p className="font-medium">
                            {selectedApplication.timeline_months} {isRTL ? 'شهر' : 'months'}
                          </p>
                        </div>
                      )}
                      
                      {selectedApplication.team_size && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            {isRTL ? 'حجم الفريق' : 'Team Size'}
                          </Label>
                          <p className="font-medium">{selectedApplication.team_size}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Proposal Summary */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">{isRTL ? 'ملخص المقترح' : 'Proposal Summary'}</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedApplication.proposal_summary}</p>
                  </div>
                </div>

                {/* Relevant Experience */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">{isRTL ? 'الخبرة ذات الصلة' : 'Relevant Experience'}</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedApplication.relevant_experience}</p>
                  </div>
                </div>

                {/* Attachments */}
                {selectedApplication.attachment_urls && selectedApplication.attachment_urls.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{isRTL ? 'المرفقات' : 'Attachments'}</h3>
                    <div className="space-y-2">
                      {selectedApplication.attachment_urls.map((url, index) => (
                        <Button key={index} variant="outline" size="sm" asChild>
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4 mr-2" />
                            {isRTL ? 'مرفق' : 'Attachment'} {index + 1}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Section */}
                {selectedApplication.status === 'pending' && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">{isRTL ? 'مراجعة الطلب' : 'Review Application'}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>{isRTL ? 'ملاحظات المراجعة' : 'Review Notes'}</Label>
                        <Textarea
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          placeholder={isRTL ? 'أضف ملاحظاتك حول هذا الطلب...' : 'Add your notes about this application...'}
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex gap-3">
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => updateApplicationStatus(selectedApplication.id, 'approved', reviewNotes)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {isRTL ? 'قبول الطلب' : 'Approve Application'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          onClick={() => updateApplicationStatus(selectedApplication.id, 'under_review', reviewNotes)}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          {isRTL ? 'وضع قيد المراجعة' : 'Mark Under Review'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected', reviewNotes)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          {isRTL ? 'رفض الطلب' : 'Reject Application'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Existing Review Notes */}
                {selectedApplication.reviewer_notes && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-3">{isRTL ? 'ملاحظات المراجع' : 'Reviewer Notes'}</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{selectedApplication.reviewer_notes}</p>
                      {selectedApplication.reviewed_at && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {isRTL ? 'تاريخ المراجعة:' : 'Reviewed on:'} {' '}
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
