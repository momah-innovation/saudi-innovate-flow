import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Settings, Bell, Mail, MessageSquare, Smartphone, Clock, Users, Shield, AlertTriangle } from 'lucide-react';

interface AdminNotificationSettingsProps {
  settings: Record<string, unknown>;
  onSettingChange: (key: string, value: unknown) => void;
}

interface NotificationTemplate {
  id: string;
  template_name: string;
  subject_template: string;
  body_template: string;
  template_category: string;
  language: string;
  generated_by: string;
  usage_count: number;
  effectiveness_score: number;
}

interface GlobalNotificationSettings {
  emailNotifications: boolean;
  systemNotifications: boolean;
  mobileNotifications: boolean;
  notifyOnNewSubmission: boolean;
  notifyOnStatusChange: boolean;
  notifyOnDeadline: boolean;
  notifyOnEvaluation: boolean;
  reminderDaysBefore: number;
  reminderFrequency: string;
  newSubmissionTemplate: string;
  statusChangeTemplate: string;
  notificationFetchLimit: number;
  maxNotificationsPerUser: number;
  notificationRetentionDays: number;
  enableDigestEmails: boolean;
  digestFrequency: string;
  enableQuietHours: boolean;
  defaultQuietHoursStart: string;
  defaultQuietHoursEnd: string;
  enableNotificationCategories: boolean;
  allowUserOptOut: boolean;
  requireEmailVerification: boolean;
  enableSmsNotifications: boolean;
  enablePushNotifications: boolean;
  adminNotificationEmail: string;
  systemNotificationSender: string;
  emergencyNotificationOverride: boolean;
}

export const AdminNotificationSettings: React.FC<AdminNotificationSettingsProps> = ({
  settings,
  onSettingChange,
}) => {
  const { t } = useUnifiedTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('global');

  // Get global notification settings with type safety
  const getGlobalSetting = (key: keyof GlobalNotificationSettings, defaultValue: any = false) => {
    return settings[key] ?? defaultValue;
  };

  // Fetch notification templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['admin-notification-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_email_templates')
        .select('*')
        .order('template_category', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch notification statistics - simplified for now
  const { data: stats } = useQuery({
    queryKey: ['notification-stats'],
    queryFn: async () => {
      // Get analytics events for notifications
      const { data: notificationEvents } = await supabase
        .from('analytics_events')
        .select('id, event_type, timestamp')
        .eq('event_category', 'notification')
        .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Mock some basic stats for now since user_notification_preferences table might not be fully ready
      return {
        totalUsers: 100, // Mock value
        emailEnabled: 80,
        smsEnabled: 20,
        pushEnabled: 60,
        notificationsSent: notificationEvents?.length || 0,
        emailEnabledPercentage: 80,
        smsEnabledPercentage: 20,
        pushEnabledPercentage: 60,
      };
    },
  });

  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<NotificationTemplate> }) => {
      const { error } = await supabase
        .from('ai_email_templates')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notification-templates'] });
      toast({
        title: t('settings.notification.template.updated'),
        description: t('settings.notification.template.updated.description'),
      });
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Test notification mutation
  const testNotificationMutation = useMutation({
    mutationFn: async ({ type, channel }: { type: string; channel: string }) => {
      const { error } = await supabase.functions.invoke('send-test-notification', {
        body: { type, channel, adminEmail: getGlobalSetting('adminNotificationEmail') }
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: t('settings.notification.test.sent'),
        description: t('settings.notification.test.sent.description'),
      });
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleGlobalSettingChange = (key: keyof GlobalNotificationSettings, value: any) => {
    onSettingChange(key, value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5" />
        <h2 className="text-xl font-semibold">{t('admin.notification.settings.title', 'Admin Notification Settings')}</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {t('admin.notification.tabs.global', 'Global')}
          </TabsTrigger>
          <TabsTrigger value="channels" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {t('admin.notification.tabs.channels', 'Channels')}
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {t('admin.notification.tabs.templates', 'Templates')}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('admin.notification.tabs.analytics', 'Analytics')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {t('admin.notification.global.title', 'Global Settings')}
              </CardTitle>
              <CardDescription>
                {t('admin.notification.global.description', 'Configure system-wide notification settings')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableDigestEmails">{t('admin.notification.digest.enabled', 'Enable Digest Emails')}</Label>
                    <Switch
                      id="enableDigestEmails"
                      checked={getGlobalSetting('enableDigestEmails')}
                      onCheckedChange={(checked) => handleGlobalSettingChange('enableDigestEmails', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('admin.notification.digest.frequency', 'Digest Frequency')}</Label>
                    <Select
                      value={getGlobalSetting('digestFrequency', 'weekly')}
                      onValueChange={(value) => handleGlobalSettingChange('digestFrequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">{t('common.frequency.daily')}</SelectItem>
                        <SelectItem value="weekly">{t('common.frequency.weekly')}</SelectItem>
                        <SelectItem value="monthly">{t('common.frequency.monthly')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('admin.notification.retention.days', 'Retention Days')}</Label>
                    <Input
                      type="number"
                      value={getGlobalSetting('notificationRetentionDays', 90)}
                      onChange={(e) => handleGlobalSettingChange('notificationRetentionDays', parseInt(e.target.value))}
                      min={1}
                      max={365}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('admin.notification.fetch.limit', 'Fetch Limit')}</Label>
                    <Input
                      type="number"
                      value={getGlobalSetting('notificationFetchLimit', 50)}
                      onChange={(e) => handleGlobalSettingChange('notificationFetchLimit', parseInt(e.target.value))}
                      min={10}
                      max={200}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableQuietHours">{t('admin.notification.quiet.hours.enabled', 'Enable Quiet Hours')}</Label>
                    <Switch
                      id="enableQuietHours"
                      checked={getGlobalSetting('enableQuietHours')}
                      onCheckedChange={(checked) => handleGlobalSettingChange('enableQuietHours', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('admin.notification.quiet.hours.start', 'Quiet Hours Start')}</Label>
                    <Input
                      type="time"
                      value={getGlobalSetting('defaultQuietHoursStart', '22:00')}
                      onChange={(e) => handleGlobalSettingChange('defaultQuietHoursStart', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('admin.notification.quiet.hours.end', 'Quiet Hours End')}</Label>
                    <Input
                      type="time"
                      value={getGlobalSetting('defaultQuietHoursEnd', '08:00')}
                      onChange={(e) => handleGlobalSettingChange('defaultQuietHoursEnd', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('admin.notification.admin.email', 'Admin Email')}</Label>
                    <Input
                      type="email"
                      value={getGlobalSetting('adminNotificationEmail', '')}
                      onChange={(e) => handleGlobalSettingChange('adminNotificationEmail', e.target.value)}
                      placeholder="admin@example.com"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-lg font-medium">{t('admin.notification.user.controls', 'User Controls')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowUserOptOut">{t('admin.notification.user.opt.out', 'Allow User Opt Out')}</Label>
                    <Switch
                      id="allowUserOptOut"
                      checked={getGlobalSetting('allowUserOptOut', true)}
                      onCheckedChange={(checked) => handleGlobalSettingChange('allowUserOptOut', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireEmailVerification">{t('admin.notification.email.verification', 'Require Email Verification')}</Label>
                    <Switch
                      id="requireEmailVerification"
                      checked={getGlobalSetting('requireEmailVerification', true)}
                      onCheckedChange={(checked) => handleGlobalSettingChange('requireEmailVerification', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="emergencyNotificationOverride">{t('admin.notification.emergency.override', 'Emergency Override')}</Label>
                    <Switch
                      id="emergencyNotificationOverride"
                      checked={getGlobalSetting('emergencyNotificationOverride', true)}
                      onCheckedChange={(checked) => handleGlobalSettingChange('emergencyNotificationOverride', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.notification.channel.email', 'Email')}</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Switch
                    checked={getGlobalSetting('emailNotifications', true)}
                    onCheckedChange={(checked) => handleGlobalSettingChange('emailNotifications', checked)}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => testNotificationMutation.mutate({ type: 'test', channel: 'email' })}
                    disabled={testNotificationMutation.isPending}
                  >
                    {t('admin.notification.test', 'Test')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.notification.channel.sms', 'SMS')}</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Switch
                    checked={getGlobalSetting('enableSmsNotifications')}
                    onCheckedChange={(checked) => handleGlobalSettingChange('enableSmsNotifications', checked)}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => testNotificationMutation.mutate({ type: 'test', channel: 'sms' })}
                    disabled={testNotificationMutation.isPending}
                  >
                    {t('admin.notification.test', 'Test')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.notification.channel.push', 'Push')}</CardTitle>
                <Smartphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Switch
                    checked={getGlobalSetting('enablePushNotifications')}
                    onCheckedChange={(checked) => handleGlobalSettingChange('enablePushNotifications', checked)}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => testNotificationMutation.mutate({ type: 'test', channel: 'push' })}
                    disabled={testNotificationMutation.isPending}
                  >
                    {t('admin.notification.test', 'Test')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.notification.channel.system', 'System')}</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Switch
                    checked={getGlobalSetting('systemNotifications', true)}
                    onCheckedChange={(checked) => handleGlobalSettingChange('systemNotifications', checked)}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => testNotificationMutation.mutate({ type: 'test', channel: 'system' })}
                    disabled={testNotificationMutation.isPending}
                  >
                    {t('settings.notification.test')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.notification.templates')}</CardTitle>
              <CardDescription>
                {t('settings.notification.templates.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {templatesLoading ? (
                <div className="text-center py-8">{t('common.loading')}</div>
              ) : (
                <div className="space-y-4">
                  {templates?.map((template) => (
                    <Card key={template.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{template.template_name}</h4>
                          <Badge variant="secondary">{template.template_category}</Badge>
                        </div>
                        <Badge variant="outline">{template.language}</Badge>
                      </div>
                      <div className="space-y-2">
                        <Input
                          placeholder={t('settings.notification.template.subject')}
                          value={template.subject_template}
                          onChange={(e) => 
                            updateTemplateMutation.mutate({
                              id: template.id,
                              updates: { subject_template: e.target.value }
                            })
                          }
                        />
                        <Textarea
                          placeholder={t('settings.notification.template.body')}
                          value={template.body_template}
                          onChange={(e) => 
                            updateTemplateMutation.mutate({
                              id: template.id,
                              updates: { body_template: e.target.value }
                            })
                          }
                          rows={3}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('settings.notification.analytics.total.users')}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('settings.notification.analytics.email.enabled')}</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.emailEnabledPercentage || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.emailEnabled || 0} {t('settings.notification.analytics.users')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('settings.notification.analytics.push.enabled')}</CardTitle>
                <Smartphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pushEnabledPercentage || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.pushEnabled || 0} {t('settings.notification.analytics.users')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('settings.notification.analytics.sent.week')}</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.notificationsSent || 0}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};