import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useAnalytics } from '@/hooks/useAnalytics';
// Using existing analytics hook for mock access control data
import { 
  Shield, 
  Users, 
  Lock, 
  Key,
  Eye,
  EyeOff,
  Search,
  Filter,
  UserCheck,
  UserX,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';

interface AdminAccessControlViewProps {
  className?: string;
}

export function AdminAccessControlView({ className }: AdminAccessControlViewProps) {
  const { t, language } = useUnifiedTranslation();
  const analytics = useAnalytics();
  const loading = analytics.isLoading || false;
  const permissions = { data: [] };
  const auditLogs = { data: [] };
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  const isLoading = loading;

  // Mock data for access control
  const accessRules = [
    { id: '1', resource: 'admin_dashboard', role: 'admin', permission: 'full', lastModified: '2024-01-15' },
    { id: '2', resource: 'user_management', role: 'admin', permission: 'full', lastModified: '2024-01-15' },
    { id: '3', resource: 'challenges', role: 'manager', permission: 'read_write', lastModified: '2024-01-14' },
    { id: '4', resource: 'analytics', role: 'manager', permission: 'read_only', lastModified: '2024-01-14' },
    { id: '5', resource: 'profile', role: 'user', permission: 'read_write_own', lastModified: '2024-01-13' }
  ];

  const securityPolicies = [
    { id: '1', name: 'Password Policy', enabled: true, description: 'Enforce strong passwords' },
    { id: '2', name: 'Session Timeout', enabled: true, description: 'Auto logout after inactivity' },
    { id: '3', name: 'IP Whitelisting', enabled: false, description: 'Restrict access by IP address' },
    { id: '4', name: 'Two-Factor Auth', enabled: true, description: 'Require 2FA for admin accounts' },
    { id: '5', name: 'API Rate Limiting', enabled: true, description: 'Limit API request frequency' }
  ];

  const recentAccessEvents = [
    { id: '1', user: 'admin@example.com', action: 'Login', resource: 'Admin Dashboard', timestamp: '2024-01-15 14:30', status: 'success' },
    { id: '2', user: 'manager@example.com', action: 'Update', resource: 'Challenge Settings', timestamp: '2024-01-15 14:25', status: 'success' },
    { id: '3', user: 'user@example.com', action: 'Access Denied', resource: 'User Management', timestamp: '2024-01-15 14:20', status: 'failed' },
    { id: '4', user: 'expert@example.com', action: 'View', resource: 'Analytics Report', timestamp: '2024-01-15 14:15', status: 'success' },
    { id: '5', user: 'admin@example.com', action: 'Delete', resource: 'User Account', timestamp: '2024-01-15 14:10', status: 'success' }
  ];

  const filteredRules = accessRules.filter(rule => {
    const matchesSearch = rule.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || rule.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'full': return 'bg-red-100 text-red-800';
      case 'read_write': return 'bg-orange-100 text-orange-800';
      case 'read_only': return 'bg-blue-100 text-blue-800';
      case 'read_write_own': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-32"></div>
              </CardHeader>
              <CardContent>
                <div className="h-40 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {language === 'ar' ? 'التحكم في الوصول' : 'Access Control'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'إدارة صلاحيات الوصول والأمان' : 'Manage access permissions and security policies'}
          </p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          {language === 'ar' ? 'تحديث' : 'Refresh'}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'المستخدمون النشطون' : 'Active Users'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">98%</p>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'مستوى الأمان' : 'Security Level'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Lock className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'السياسات النشطة' : 'Active Policies'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'محاولات فاشلة' : 'Failed Attempts'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Access Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              {language === 'ar' ? 'قواعد الوصول' : 'Access Rules'}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSensitiveData(!showSensitiveData)}
              >
                {showSensitiveData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showSensitiveData ? 
                  (language === 'ar' ? 'إخفاء البيانات الحساسة' : 'Hide Sensitive') :
                  (language === 'ar' ? 'عرض البيانات الحساسة' : 'Show Sensitive')
                }
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={language === 'ar' ? 'البحث في الموارد أو الأدوار...' : 'Search resources or roles...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'ar' ? 'جميع الأدوار' : 'All Roles'}</SelectItem>
                <SelectItem value="admin">{language === 'ar' ? 'مدير' : 'Admin'}</SelectItem>
                <SelectItem value="manager">{language === 'ar' ? 'مدير قسم' : 'Manager'}</SelectItem>
                <SelectItem value="user">{language === 'ar' ? 'مستخدم' : 'User'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rules Table */}
          <div className="space-y-2">
            {filteredRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{rule.resource.replace('_', ' ')}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'الدور:' : 'Role:'} {rule.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={getPermissionColor(rule.permission)}>
                    {rule.permission.replace('_', ' ')}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'آخر تعديل:' : 'Modified:'} {rule.lastModified}
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {language === 'ar' ? 'سياسات الأمان' : 'Security Policies'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityPolicies.map((policy) => (
              <div key={policy.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${policy.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <div>
                    <p className="font-medium">{policy.name}</p>
                    <p className="text-sm text-muted-foreground">{policy.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Switch checked={policy.enabled} />
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Access Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {language === 'ar' ? 'أحداث الوصول الأخيرة' : 'Recent Access Events'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentAccessEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(event.status)}`} />
                  <div>
                    <p className="font-medium">
                      {showSensitiveData ? event.user : event.user.replace(/(.{3}).*(@.*)/, '$1***$2')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {event.action} • {event.resource}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={event.status === 'success' ? 'default' : 'destructive'}>
                    {event.status}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {event.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}