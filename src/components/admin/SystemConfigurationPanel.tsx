import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
// Using existing error handling patterns
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Shield, 
  Database,
  Zap,
  Globe,
  Bell,
  Users,
  Lock,
  AlertTriangle,
  CheckCircle,
  Server
} from 'lucide-react';

interface SystemConfigurationPanelProps {
  className?: string;
}

export function SystemConfigurationPanel({ className }: SystemConfigurationPanelProps) {
  const { t, language } = useUnifiedTranslation();
  const { data: config, loading } = useAdminDashboard();
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Mock update and refresh functions
  const updateConfig = async (changes: any) => {
    console.log('Updating config:', changes);
  };
  const refresh = async () => {
    window.location.reload();
  };

  const handleConfigChange = (key: string, value: any) => {
    setPendingChanges(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = async () => {
    if (Object.keys(pendingChanges).length === 0) return;
    try {
      await updateConfig(pendingChanges);
      setPendingChanges({});
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving config:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      await refresh();
    } catch (error) {
      console.error('Error refreshing config:', error);
    }
  };

  const getCurrentValue = (key: string) => {
    return pendingChanges.hasOwnProperty(key) ? pendingChanges[key] : config?.[key];
  };

  if (loading) {
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
            {language === 'ar' ? 'إعدادات النظام' : 'System Configuration'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'إدارة إعدادات وتكوين النظام' : 'Manage system settings and configuration'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {language === 'ar' ? 'تحديث' : 'Refresh'}
          </Button>
          <Button 
            size="sm"
            onClick={handleSaveChanges}
            disabled={!hasUnsavedChanges || loading}
          >
            <Save className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Unsaved Changes Alert */}
      {hasUnsavedChanges && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              {language === 'ar' ? 'لديك تغييرات غير محفوظة' : 'You have unsaved changes'}
            </p>
          </div>
        </div>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            {language === 'ar' ? 'عام' : 'General'}
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            {language === 'ar' ? 'الأمان' : 'Security'}
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            {language === 'ar' ? 'قاعدة البيانات' : 'Database'}
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            {language === 'ar' ? 'المميزات' : 'Features'}
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {language === 'ar' ? 'التكامل' : 'Integration'}
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {language === 'ar' ? 'الإعدادات العامة' : 'General Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="app-name">
                    {language === 'ar' ? 'اسم التطبيق' : 'Application Name'}
                  </Label>
                  <Input
                    id="app-name"
                    value={getCurrentValue('app_name') || 'Innovation Platform'}
                    onChange={(e) => handleConfigChange('app_name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="app-version">
                    {language === 'ar' ? 'إصدار التطبيق' : 'Application Version'}
                  </Label>
                  <Input
                    id="app-version"
                    value={getCurrentValue('app_version') || '1.0.0'}
                    onChange={(e) => handleConfigChange('app_version', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-language">
                    {language === 'ar' ? 'اللغة الافتراضية' : 'Default Language'}
                  </Label>
                  <Select 
                    value={getCurrentValue('default_language') || 'en'}
                    onValueChange={(value) => handleConfigChange('default_language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">
                    {language === 'ar' ? 'المنطقة الزمنية' : 'Timezone'}
                  </Label>
                  <Select 
                    value={getCurrentValue('timezone') || 'UTC'}
                    onValueChange={(value) => handleConfigChange('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Asia/Riyadh">Asia/Riyadh</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="app-description">
                  {language === 'ar' ? 'وصف التطبيق' : 'Application Description'}
                </Label>
                <Textarea
                  id="app-description"
                  value={getCurrentValue('app_description') || 'Innovation and Challenge Management Platform'}
                  onChange={(e) => handleConfigChange('app_description', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {language === 'ar' ? 'إعدادات المستخدمين' : 'User Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    {language === 'ar' ? 'السماح بالتسجيل' : 'Allow Registration'}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'السماح للمستخدمين الجدد بالتسجيل' : 'Allow new users to register'}
                  </p>
                </div>
                <Switch
                  checked={getCurrentValue('allow_registration') !== false}
                  onCheckedChange={(checked) => handleConfigChange('allow_registration', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    {language === 'ar' ? 'تتطلب تفعيل البريد' : 'Require Email Verification'}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'يتطلب تفعيل البريد الإلكتروني عند التسجيل' : 'Require email verification on registration'}
                  </p>
                </div>
                <Switch
                  checked={getCurrentValue('require_email_verification') !== false}
                  onCheckedChange={(checked) => handleConfigChange('require_email_verification', checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    {language === 'ar' ? 'الحد الأقصى للمستخدمين' : 'Max Users'}
                  </Label>
                  <Input
                    type="number"
                    value={getCurrentValue('max_users') || 10000}
                    onChange={(e) => handleConfigChange('max_users', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    {language === 'ar' ? 'مدة الجلسة (دقائق)' : 'Session Duration (minutes)'}
                  </Label>
                  <Input
                    type="number"
                    value={getCurrentValue('session_duration') || 480}
                    onChange={(e) => handleConfigChange('session_duration', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {language === 'ar' ? 'إعدادات الأمان' : 'Security Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    {language === 'ar' ? 'تفعيل المصادقة الثنائية' : 'Enable Two-Factor Authentication'}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'يتطلب المصادقة الثنائية لجميع المستخدمين' : 'Require 2FA for all users'}
                  </p>
                </div>
                <Switch
                  checked={getCurrentValue('enable_2fa') === true}
                  onCheckedChange={(checked) => handleConfigChange('enable_2fa', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    {language === 'ar' ? 'فرض كلمات مرور قوية' : 'Enforce Strong Passwords'}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'يتطلب كلمات مرور معقدة' : 'Require complex passwords'}
                  </p>
                </div>
                <Switch
                  checked={getCurrentValue('enforce_strong_passwords') !== false}
                  onCheckedChange={(checked) => handleConfigChange('enforce_strong_passwords', checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    {language === 'ar' ? 'محاولات تسجيل الدخول' : 'Max Login Attempts'}
                  </Label>
                  <Input
                    type="number"
                    value={getCurrentValue('max_login_attempts') || 5}
                    onChange={(e) => handleConfigChange('max_login_attempts', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    {language === 'ar' ? 'فترة الحظر (دقائق)' : 'Lockout Duration (minutes)'}
                  </Label>
                  <Input
                    type="number"
                    value={getCurrentValue('lockout_duration') || 30}
                    onChange={(e) => handleConfigChange('lockout_duration', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                {language === 'ar' ? 'إعدادات قاعدة البيانات' : 'Database Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    {language === 'ar' ? 'تفعيل النسخ الاحتياطي التلقائي' : 'Enable Auto Backup'}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'نسخ احتياطية يومية تلقائية' : 'Automatic daily backups'}
                  </p>
                </div>
                <Switch
                  checked={getCurrentValue('enable_auto_backup') !== false}
                  onCheckedChange={(checked) => handleConfigChange('enable_auto_backup', checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    {language === 'ar' ? 'الاحتفاظ بالنسخ (أيام)' : 'Backup Retention (days)'}
                  </Label>
                  <Input
                    type="number"
                    value={getCurrentValue('backup_retention_days') || 30}
                    onChange={(e) => handleConfigChange('backup_retention_days', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    {language === 'ar' ? 'حد استعلامات قاعدة البيانات' : 'Database Query Limit'}
                  </Label>
                  <Input
                    type="number"
                    value={getCurrentValue('db_query_limit') || 1000}
                    onChange={(e) => handleConfigChange('db_query_limit', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Settings */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                {language === 'ar' ? 'إعدادات المميزات' : 'Feature Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    {language === 'ar' ? 'تفعيل التحديثات المباشرة' : 'Enable Real-time Updates'}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'التحديثات المباشرة للبيانات' : 'Real-time data updates'}
                  </p>
                </div>
                <Switch
                  checked={getCurrentValue('enable_realtime') !== false}
                  onCheckedChange={(checked) => handleConfigChange('enable_realtime', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    {language === 'ar' ? 'تفعيل الإشعارات' : 'Enable Notifications'}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'نظام الإشعارات' : 'Notification system'}
                  </p>
                </div>
                <Switch
                  checked={getCurrentValue('enable_notifications') !== false}
                  onCheckedChange={(checked) => handleConfigChange('enable_notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    {language === 'ar' ? 'تفعيل التحليلات' : 'Enable Analytics'}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'جمع البيانات التحليلية' : 'Analytics data collection'}
                  </p>
                </div>
                <Switch
                  checked={getCurrentValue('enable_analytics') !== false}
                  onCheckedChange={(checked) => handleConfigChange('enable_analytics', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Settings */}
        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {language === 'ar' ? 'إعدادات التكامل' : 'Integration Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  {language === 'ar' ? 'رابط API الخارجي' : 'External API URL'}
                </Label>
                <Input
                  value={getCurrentValue('external_api_url') || ''}
                  onChange={(e) => handleConfigChange('external_api_url', e.target.value)}
                  placeholder="https://api.example.com"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  {language === 'ar' ? 'مفتاح API' : 'API Key'}
                </Label>
                <Input
                  type="password"
                  value={getCurrentValue('api_key') || ''}
                  onChange={(e) => handleConfigChange('api_key', e.target.value)}
                  placeholder="••••••••••••••••"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    {language === 'ar' ? 'تفعيل التكامل الخارجي' : 'Enable External Integration'}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'السماح بالتكامل مع الخدمات الخارجية' : 'Allow integration with external services'}
                  </p>
                </div>
                <Switch
                  checked={getCurrentValue('enable_external_integration') === true}
                  onCheckedChange={(checked) => handleConfigChange('enable_external_integration', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Footer */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              <span>
                {language === 'ar' ? 'آخر تحديث:' : 'Last updated:'} {
                  config?.last_updated ? new Date(config.last_updated).toLocaleString() : '--'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              {hasUnsavedChanges ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-yellow-600">
                    {language === 'ar' ? 'تغييرات غير محفوظة' : 'Unsaved changes'}
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">
                    {language === 'ar' ? 'محفوظ' : 'Saved'}
                  </span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}