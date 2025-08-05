import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Download, FileText, Calendar, BarChart3, TrendingUp } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

interface AnalyticsExportDialogProps {
  opportunityId: string;
  opportunityTitle: string;
}

export const AnalyticsExportDialog = ({
  opportunityId,
  opportunityTitle
}: AnalyticsExportDialogProps) => {
  const { toast } = useToast();
  const { isRTL } = useDirection();
  const [isExporting, setIsExporting] = useState(false);
  const [open, setOpen] = useState(false);

  const exportToCsv = async (data: any[], filename: string) => {
    try {
      const headers = Object.keys(data[0] || {});
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => 
          JSON.stringify(row[header] || '')
        ).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      throw error;
    }
  };

  const exportAnalyticsSummary = async () => {
    setIsExporting(true);
    try {
      // Get comprehensive analytics data
      const [analyticsData, viewSessionsData, applicationsData, likesData, sharesData] = await Promise.all([
        supabase
          .from('opportunity_analytics')
          .select('*')
          .eq('opportunity_id', opportunityId)
          .maybeSingle(),
        supabase
          .from('opportunity_view_sessions')
          .select('*')
          .eq('opportunity_id', opportunityId)
          .order('created_at', { ascending: false }),
        supabase
          .from('opportunity_applications')
          .select('created_at, status, application_type')
          .eq('opportunity_id', opportunityId)
          .order('created_at', { ascending: false }),
        supabase
          .from('opportunity_likes')
          .select('created_at')
          .eq('opportunity_id', opportunityId)
          .order('created_at', { ascending: false }),
        supabase
          .from('opportunity_shares')
          .select('created_at, platform')
          .eq('opportunity_id', opportunityId)
          .order('created_at', { ascending: false })
      ]);

      const analytics = analyticsData.data;
      const viewSessions = viewSessionsData.data || [];
      const applications = applicationsData.data || [];
      const likes = likesData.data || [];
      const shares = sharesData.data || [];

      // Create summary report
      const summaryData = [{
        opportunity_title: opportunityTitle,
        total_views: analytics?.view_count || 0,
        unique_sessions: viewSessions.length,
        total_likes: likes.length,
        total_applications: applications.length,
        total_shares: shares.length,
        conversion_rate: analytics?.view_count ? 
          ((applications.length / analytics.view_count) * 100).toFixed(2) : '0',
        export_date: new Date().toISOString(),
        analytics_last_updated: analytics?.last_updated || analytics?.updated_at
      }];

      await exportToCsv(summaryData, `${opportunityTitle.replace(/[^a-zA-Z0-9]/g, '_')}_analytics_summary.csv`);

      toast({
        title: isRTL ? 'تم تصدير التقرير' : 'Report Exported',
        description: isRTL ? 'تم تصدير تقرير الإحصائيات بنجاح' : 'Analytics report exported successfully',
      });
    } catch (error) {
      console.error('Error exporting analytics:', error);
      toast({
        title: isRTL ? 'خطأ في التصدير' : 'Export Error',
        description: isRTL ? 'فشل في تصدير التقرير' : 'Failed to export report',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportDetailedReport = async () => {
    setIsExporting(true);
    try {
      // Get detailed view sessions
      const { data: viewSessions } = await supabase
        .from('opportunity_view_sessions')
        .select('*')
        .eq('opportunity_id', opportunityId)
        .order('created_at', { ascending: false });

      if (viewSessions && viewSessions.length > 0) {
        const detailedData = viewSessions.map(session => ({
          session_id: session.session_id,
          user_id: session.user_id || 'Anonymous',
          first_view: session.first_view_at,
          last_view: session.last_view_at,
          total_views: session.view_count,
          time_spent_seconds: session.time_spent_seconds,
          source: session.source,
          referrer: session.referrer || 'Direct',
          user_agent: session.user_agent || 'Unknown'
        }));

        await exportToCsv(detailedData, `${opportunityTitle.replace(/[^a-zA-Z0-9]/g, '_')}_detailed_analytics.csv`);
      }

      toast({
        title: isRTL ? 'تم تصدير التقرير المفصل' : 'Detailed Report Exported',
        description: isRTL ? 'تم تصدير التقرير المفصل بنجاح' : 'Detailed analytics report exported successfully',
      });
    } catch (error) {
      console.error('Error exporting detailed report:', error);
      toast({
        title: isRTL ? 'خطأ في التصدير' : 'Export Error',
        description: isRTL ? 'فشل في تصدير التقرير المفصل' : 'Failed to export detailed report',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          {isRTL ? 'تصدير' : 'Export'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            {isRTL ? 'تصدير الإحصائيات' : 'Export Analytics'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {isRTL ? 'تقرير موجز' : 'Summary Report'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'تقرير يحتوي على الإحصائيات الأساسية والمقاييس الرئيسية' : 'Basic analytics and key metrics overview'}
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary">CSV</Badge>
                <Badge variant="outline">{isRTL ? 'سريع' : 'Quick'}</Badge>
              </div>
              <Button 
                onClick={exportAnalyticsSummary}
                disabled={isExporting}
                className="w-full"
                size="sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                {isRTL ? 'تصدير الموجز' : 'Export Summary'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {isRTL ? 'تقرير مفصل' : 'Detailed Report'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'تقرير شامل مع تفاصيل الجلسات والسلوك' : 'Comprehensive report with session details and user behavior'}
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary">CSV</Badge>
                <Badge variant="outline">{isRTL ? 'شامل' : 'Comprehensive'}</Badge>
              </div>
              <Button 
                onClick={exportDetailedReport}
                disabled={isExporting}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                {isRTL ? 'تصدير مفصل' : 'Export Detailed'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};