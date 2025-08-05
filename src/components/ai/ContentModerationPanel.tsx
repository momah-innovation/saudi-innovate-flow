import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Ban,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { aiService } from '@/services/AIService';

interface ModerationLog {
  id: string;
  content_id: string;
  content_type: string;
  content_text: string;
  moderation_result: any;
  flagged: boolean;
  confidence_score: number;
  categories_detected: string[];
  status: string;
  created_at: string;
  moderated_by?: string;
  reviewer_id?: string;
  updated_at?: string;
}

export const ContentModerationPanel: React.FC = () => {
  const [logs, setLogs] = useState<ModerationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [testContent, setTestContent] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'flagged' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchModerationLogs();
  }, [filter]);

  const fetchModerationLogs = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('content_moderation_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (filter === 'flagged') {
        query = query.eq('flagged', true);
      } else if (filter === 'pending') {
        query = query.eq('status', 'requires_review');
      }

      const { data, error } = await query;
      if (error) throw error;

      setLogs((data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'approved' | 'rejected' | 'requires_review'
      })));
    } catch (error) {
      console.error('Error fetching moderation logs:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل سجلات الإشراف',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const testContentModeration = async () => {
    if (!testContent.trim()) return;

    try {
      setTesting(true);
      const result = await aiService.moderateContent(
        testContent,
        'test_content'
      );
      setTestResult(result);
      
      toast({
        title: 'تم الاختبار',
        description: 'تم فحص المحتوى بنجاح',
      });
    } catch (error) {
      console.error('Error testing content moderation:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في فحص المحتوى',
        variant: 'destructive',
      });
    } finally {
      setTesting(false);
    }
  };

  const updateLogStatus = async (logId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('content_moderation_logs')
        .update({ status: newStatus })
        .eq('id', logId);

      if (error) throw error;

      setLogs(logs.map(log => 
        log.id === logId ? { ...log, status: newStatus as any } : log
      ));

      toast({
        title: 'تم التحديث',
        description: 'تم تحديث حالة المحتوى',
      });
    } catch (error) {
      console.error('Error updating log status:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحديث الحالة',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: string, flagged: boolean) => {
    if (flagged && status === 'requires_review') {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    if (status === 'approved') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (status === 'rejected') {
      return <Ban className="h-4 w-4 text-red-500" />;
    }
    return <Clock className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusColor = (status: string, flagged: boolean) => {
    if (flagged && status === 'requires_review') return 'destructive';
    if (status === 'approved') return 'default';
    if (status === 'rejected') return 'destructive';
    return 'secondary';
  };

  const filteredLogs = logs.filter(log =>
    searchTerm === '' ||
    log.content_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.content_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: logs.length,
    flagged: logs.filter(log => log.flagged).length,
    pending: logs.filter(log => log.status === 'requires_review').length,
    approved: logs.filter(log => log.status === 'approved').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">إشراف المحتوى</h1>
          <p className="text-muted-foreground">
            فحص المحتوى التلقائي وضمان الجودة بالذكاء الاصطناعي
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">إجمالي المحتوى</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">محتوى مُبلغ عنه</p>
                <p className="text-2xl font-bold">{stats.flagged}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">في انتظار المراجعة</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">محتوى موافق عليه</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="logs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="logs">سجلات الإشراف</TabsTrigger>
          <TabsTrigger value="test">اختبار الإشراف</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث في المحتوى..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ps-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                الكل
              </Button>
              <Button
                variant={filter === 'flagged' ? 'default' : 'outline'}
                onClick={() => setFilter('flagged')}
                size="sm"
              >
                مُبلغ عنه
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilter('pending')}
                size="sm"
              >
                في الانتظار
              </Button>
              <Button
                variant="outline"
                onClick={fetchModerationLogs}
                size="sm"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Logs List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>جاري تحميل السجلات...</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">لا توجد سجلات للعرض</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <Card key={log.id} className={log.flagged ? 'border-red-200' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status, log.flagged)}
                        <Badge variant="outline" className="text-xs">
                          {log.content_type}
                        </Badge>
                        <Badge 
                          variant={getStatusColor(log.status, log.flagged)}
                          className="text-xs"
                        >
                          {log.status === 'approved' && 'موافق عليه'}
                          {log.status === 'rejected' && 'مرفوض'}
                          {log.status === 'requires_review' && 'يتطلب مراجعة'}
                          {log.status === 'pending' && 'في الانتظار'}
                        </Badge>
                        {log.confidence_score && (
                          <Badge variant="secondary" className="text-xs">
                            ثقة: {Math.round(log.confidence_score * 100)}%
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleDateString('ar')}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {log.content_text}
                        </p>
                      </div>
                      
                      {log.categories_detected && log.categories_detected.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {log.categories_detected.map((category, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {log.status === 'requires_review' && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateLogStatus(log.id, 'approved')}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            موافقة
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateLogStatus(log.id, 'rejected')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            رفض
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>اختبار فحص المحتوى</CardTitle>
              <CardDescription>
                قم بإدخال محتوى لاختبار نظام الإشراف التلقائي
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="أدخل المحتوى المراد فحصه..."
                value={testContent}
                onChange={(e) => setTestContent(e.target.value)}
                rows={4}
              />
              
              <Button 
                onClick={testContentModeration}
                disabled={testing || !testContent.trim()}
                className="w-full"
              >
                {testing ? (
                  <>
                    <RefreshCw className="h-4 w-4 me-2 animate-spin" />
                    جاري الفحص...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 me-2" />
                    فحص المحتوى
                  </>
                )}
              </Button>

              {testResult && (
                <Alert className={testResult.flagged ? 'border-red-200' : 'border-green-200'}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <strong>النتيجة:</strong>
                        <Badge variant={testResult.flagged ? 'destructive' : 'default'}>
                          {testResult.flagged ? 'مُبلغ عنه' : 'آمن'}
                        </Badge>
                        <Badge variant="secondary">
                          ثقة: {Math.round(testResult.confidence * 100)}%
                        </Badge>
                      </div>
                      
                      {testResult.categories && testResult.categories.length > 0 && (
                        <div>
                          <strong>الفئات المكتشفة:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {testResult.categories.map((category: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {testResult.reason && (
                        <div>
                          <strong>السبب:</strong> {testResult.reason}
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};