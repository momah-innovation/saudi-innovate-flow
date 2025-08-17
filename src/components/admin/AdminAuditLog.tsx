import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { createErrorHandler } from '@/utils/unified-error-handler';
// Using existing analytics hook for mock audit log data
import { 
  Search, 
  Filter, 
  Download, 
  Eye,
  Calendar,
  Clock,
  User,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  FileText
} from 'lucide-react';

interface AdminAuditLogProps {
  className?: string;
}

export function AdminAuditLog({ className }: AdminAuditLogProps) {
  const { t, language } = useUnifiedTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [dateRange, setDateRange] = useState<any>(null);

  // ✅ MIGRATED: Using unified loading and error handling
  const { isLoading, withLoading } = useUnifiedLoading({
    component: 'AdminAuditLog',
    showToast: true,
    logErrors: true
  });
  const errorHandler = createErrorHandler({ component: 'AdminAuditLog' });

  // Mock audit log data
  const mockAuditLogs = [
    {
      id: '1',
      timestamp: '2024-01-15T14:30:00Z',
      user: 'admin@example.com',
      action: 'user_created',
      resource: 'User Management',
      details: 'Created new user account for john.doe@example.com',
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'info',
      status: 'success'
    },
    {
      id: '2',
      timestamp: '2024-01-15T14:25:00Z',
      user: 'manager@example.com',
      action: 'challenge_updated',
      resource: 'Challenge Management',
      details: 'Updated challenge settings for Innovation Challenge 2024',
      ip_address: '192.168.1.101',
      user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
      severity: 'info',
      status: 'success'
    },
    {
      id: '3',
      timestamp: '2024-01-15T14:20:00Z',
      user: 'user@example.com',
      action: 'login_failed',
      resource: 'Authentication',
      details: 'Failed login attempt - invalid credentials',
      ip_address: '203.0.113.42',
      user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      severity: 'warning',
      status: 'failed'
    },
    {
      id: '4',
      timestamp: '2024-01-15T14:15:00Z',
      user: 'expert@example.com',
      action: 'data_export',
      resource: 'Analytics',
      details: 'Exported analytics report for Q4 2023',
      ip_address: '192.168.1.102',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'info',
      status: 'success'
    },
    {
      id: '5',
      timestamp: '2024-01-15T14:10:00Z',
      user: 'admin@example.com',
      action: 'user_deleted',
      resource: 'User Management',
      details: 'Deleted user account for inactive.user@example.com',
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'critical',
      status: 'success'
    },
    {
      id: '6',
      timestamp: '2024-01-15T14:05:00Z',
      user: 'system',
      action: 'system_backup',
      resource: 'System',
      details: 'Automated system backup completed successfully',
      ip_address: 'localhost',
      user_agent: 'System Process',
      severity: 'info',
      status: 'success'
    }
  ];

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = selectedAction === 'all' || log.action.includes(selectedAction);
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
    
    return matchesSearch && matchesAction && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('user')) return <User className="w-4 h-4" />;
    if (action.includes('login') || action.includes('auth')) return <Shield className="w-4 h-4" />;
    if (action.includes('export') || action.includes('download')) return <Download className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const handleExport = async () => {
    return withLoading('export', async () => {
      const csvContent = filteredLogs.map(log => 
        `${log.timestamp},${log.user},${log.action},${log.resource},${log.severity},${log.status},"${log.details}"`
      ).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'audit_logs.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      return true;
    }, {
      successMessage: t('success.export_completed'),
      errorMessage: t('error.export_failed'),
      logContext: { operation: 'audit_export', logCount: filteredLogs.length }
    });
  };

  if (isLoading('refresh')) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-32"></div>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {language === 'ar' ? 'سجل التدقيق' : 'Audit Log'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'عرض وتتبع جميع أنشطة النظام' : 'View and track all system activities'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            disabled={isLoading('export')}
          >
            <Download className={`w-4 h-4 mr-2 ${isLoading('export') ? 'animate-spin' : ''}`} />
            {language === 'ar' ? 'تصدير' : 'Export'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => withLoading('refresh', async () => window.location.reload())}
            disabled={isLoading('refresh')}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading('refresh') ? 'animate-spin' : ''}`} />
            {language === 'ar' ? 'تحديث' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Activity className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{mockAuditLogs.length}</p>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'إجمالي الأحداث' : 'Total Events'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {mockAuditLogs.filter(log => log.status === 'success').length}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'نجح' : 'Successful'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">
                  {mockAuditLogs.filter(log => log.severity === 'warning').length}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'تحذيرات' : 'Warnings'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <XCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">
                  {mockAuditLogs.filter(log => log.severity === 'critical').length}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'حرج' : 'Critical'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            {language === 'ar' ? 'تصفية السجلات' : 'Filter Logs'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={language === 'ar' ? 'البحث في السجلات...' : 'Search logs...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'نوع العملية' : 'Action Type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'ar' ? 'جميع العمليات' : 'All Actions'}</SelectItem>
                <SelectItem value="user">{language === 'ar' ? 'إدارة المستخدمين' : 'User Management'}</SelectItem>
                <SelectItem value="login">{language === 'ar' ? 'تسجيل الدخول' : 'Authentication'}</SelectItem>
                <SelectItem value="export">{language === 'ar' ? 'تصدير البيانات' : 'Data Export'}</SelectItem>
                <SelectItem value="system">{language === 'ar' ? 'النظام' : 'System'}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'مستوى الخطورة' : 'Severity'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'ar' ? 'جميع المستويات' : 'All Severities'}</SelectItem>
                <SelectItem value="info">{language === 'ar' ? 'معلومات' : 'Info'}</SelectItem>
                <SelectItem value="warning">{language === 'ar' ? 'تحذير' : 'Warning'}</SelectItem>
                <SelectItem value="critical">{language === 'ar' ? 'حرج' : 'Critical'}</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder={language === 'ar' ? 'نطاق التاريخ' : 'Date Range'}
              value={dateRange || ''}
              onChange={(e) => setDateRange(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {language === 'ar' ? 'سجل الأحداث' : 'Event Log'}
            <Badge variant="secondary">{filteredLogs.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(log.status)}
                      {getActionIcon(log.action)}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">
                          {log.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h4>
                        <Badge className={getSeverityColor(log.severity)}>
                          {log.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {log.details}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {log.user}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                        <span>{log.resource}</span>
                        <span>{log.ip_address}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {language === 'ar' ? 'لا توجد سجلات تطابق المعايير المحددة' : 'No logs match the selected criteria'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}