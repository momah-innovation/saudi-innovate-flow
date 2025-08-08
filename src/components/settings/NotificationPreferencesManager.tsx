import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useDirection } from '@/components/ui/direction-provider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Clock, 
  Moon,
  Calendar,
  Users,
  Lightbulb,
  Target,
  Briefcase,
  Shield
} from 'lucide-react';

interface NotificationPreferences {
  // Channel preferences
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  
  // Event-specific preferences
  event_registration_notifications: boolean;
  event_cancellation_notifications: boolean;
  event_reminders: boolean;
  event_updates: boolean;
  new_event_announcements: boolean;
  
  // Challenge preferences
  challenge_notifications: boolean;
  challenge_status_updates: boolean;
  new_challenge_announcements: boolean;
  
  // Idea preferences
  idea_status_updates: boolean;
  idea_feedback_notifications: boolean;
  new_idea_notifications: boolean;
  
  // Campaign preferences
  campaign_notifications: boolean;
  campaign_updates: boolean;
  
  // Opportunity preferences
  opportunity_notifications: boolean;
  new_opportunity_announcements: boolean;
  
  // Admin/team notifications
  admin_notifications: boolean;
  team_assignment_notifications: boolean;
  
  // Frequency settings
  digest_frequency: string;
  reminder_advance_days: number;
  
  // Quiet hours
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  quiet_hours_timezone: string;
}

const defaultPreferences: NotificationPreferences = {
  email_enabled: true,
  sms_enabled: false,
  push_enabled: true,
  in_app_enabled: true,
  event_registration_notifications: true,
  event_cancellation_notifications: true,
  event_reminders: true,
  event_updates: true,
  new_event_announcements: true,
  challenge_notifications: true,
  challenge_status_updates: true,
  new_challenge_announcements: true,
  idea_status_updates: true,
  idea_feedback_notifications: true,
  new_idea_notifications: false,
  campaign_notifications: true,
  campaign_updates: true,
  opportunity_notifications: true,
  new_opportunity_announcements: true,
  admin_notifications: true,
  team_assignment_notifications: true,
  digest_frequency: 'daily',
  reminder_advance_days: 1,
  quiet_hours_enabled: false,
  quiet_hours_start: '22:00',
  quiet_hours_end: '08:00',
  quiet_hours_timezone: 'Asia/Riyadh'
};

export function NotificationPreferencesManager() {
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load user preferences
  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_user_notification_preferences');
      
      if (error) throw error;
      
      if (data) {
        setPreferences({
          email_enabled: data.email_enabled ?? true,
          sms_enabled: data.sms_enabled ?? false,
          push_enabled: data.push_enabled ?? true,
          in_app_enabled: data.in_app_enabled ?? true,
          event_registration_notifications: data.event_registration_notifications ?? true,
          event_cancellation_notifications: data.event_cancellation_notifications ?? true,
          event_reminders: data.event_reminders ?? true,
          event_updates: data.event_updates ?? true,
          new_event_announcements: data.new_event_announcements ?? true,
          challenge_notifications: data.challenge_notifications ?? true,
          challenge_status_updates: data.challenge_status_updates ?? true,
          new_challenge_announcements: data.new_challenge_announcements ?? true,
          idea_status_updates: data.idea_status_updates ?? true,
          idea_feedback_notifications: data.idea_feedback_notifications ?? true,
          new_idea_notifications: data.new_idea_notifications ?? false,
          campaign_notifications: data.campaign_notifications ?? true,
          campaign_updates: data.campaign_updates ?? true,
          opportunity_notifications: data.opportunity_notifications ?? true,
          new_opportunity_announcements: data.new_opportunity_announcements ?? true,
          admin_notifications: data.admin_notifications ?? true,
          team_assignment_notifications: data.team_assignment_notifications ?? true,
          digest_frequency: data.digest_frequency ?? 'daily',
          reminder_advance_days: data.reminder_advance_days ?? 1,
          quiet_hours_enabled: data.quiet_hours_enabled ?? false,
          quiet_hours_start: data.quiet_hours_start ?? '22:00',
          quiet_hours_end: data.quiet_hours_end ?? '08:00',
          quiet_hours_timezone: data.quiet_hours_timezone ?? 'Asia/Riyadh'
        });
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تحميل تفضيلات الإشعارات' : 'Failed to load notification preferences',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      const { error } = await supabase.rpc('update_user_notification_preferences', {
        p_preferences: preferences as any
      });
      
      if (error) throw error;
      
      toast({
        title: isRTL ? 'تم الحفظ' : 'Saved',
        description: isRTL ? 'تم حفظ تفضيلات الإشعارات بنجاح' : 'Notification preferences saved successfully'
      });
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في حفظ تفضيلات الإشعارات' : 'Failed to save notification preferences',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">
          {isRTL ? 'جاري التحميل...' : 'Loading...'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6" />
            {isRTL ? 'تفضيلات الإشعارات' : 'Notification Preferences'}
          </h2>
          <p className="text-muted-foreground mt-1">
            {isRTL ? 'تحكم في الإشعارات التي تريد استلامها' : 'Control which notifications you want to receive'}
          </p>
        </div>
        <Button onClick={savePreferences} disabled={saving}>
          {saving ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ التغييرات' : 'Save Changes')}
        </Button>
      </div>

      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {isRTL ? 'قنوات الإشعارات' : 'Notification Channels'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-enabled" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {isRTL ? 'البريد الإلكتروني' : 'Email'}
              </Label>
              <Switch
                id="email-enabled"
                checked={preferences.email_enabled}
                onCheckedChange={(checked) => updatePreference('email_enabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-enabled" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                {isRTL ? 'الرسائل النصية' : 'SMS'}
              </Label>
              <Switch
                id="sms-enabled"
                checked={preferences.sms_enabled}
                onCheckedChange={(checked) => updatePreference('sms_enabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="push-enabled" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                {isRTL ? 'الإشعارات الفورية' : 'Push Notifications'}
              </Label>
              <Switch
                id="push-enabled"
                checked={preferences.push_enabled}
                onCheckedChange={(checked) => updatePreference('push_enabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="in-app-enabled" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                {isRTL ? 'داخل التطبيق' : 'In-App'}
              </Label>
              <Switch
                id="in-app-enabled"
                checked={preferences.in_app_enabled}
                onCheckedChange={(checked) => updatePreference('in_app_enabled', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {isRTL ? 'إشعارات الفعاليات' : 'Event Notifications'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="event-registration">
                {isRTL ? 'تسجيلات الفعاليات' : 'Event Registrations'}
              </Label>
              <Switch
                id="event-registration"
                checked={preferences.event_registration_notifications}
                onCheckedChange={(checked) => updatePreference('event_registration_notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="event-cancellation">
                {isRTL ? 'إلغاء تسجيلات الفعاليات' : 'Event Cancellations'}
              </Label>
              <Switch
                id="event-cancellation"
                checked={preferences.event_cancellation_notifications}
                onCheckedChange={(checked) => updatePreference('event_cancellation_notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="event-reminders">
                {isRTL ? 'تذكير بالفعاليات' : 'Event Reminders'}
              </Label>
              <Switch
                id="event-reminders"
                checked={preferences.event_reminders}
                onCheckedChange={(checked) => updatePreference('event_reminders', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="event-updates">
                {isRTL ? 'تحديثات الفعاليات' : 'Event Updates'}
              </Label>
              <Switch
                id="event-updates"
                checked={preferences.event_updates}
                onCheckedChange={(checked) => updatePreference('event_updates', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="new-events">
                {isRTL ? 'إعلان فعاليات جديدة' : 'New Event Announcements'}
              </Label>
              <Switch
                id="new-events"
                checked={preferences.new_event_announcements}
                onCheckedChange={(checked) => updatePreference('new_event_announcements', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenge Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            {isRTL ? 'إشعارات التحديات' : 'Challenge Notifications'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="challenge-notifications">
                {isRTL ? 'إشعارات التحديات' : 'Challenge Notifications'}
              </Label>
              <Switch
                id="challenge-notifications"
                checked={preferences.challenge_notifications}
                onCheckedChange={(checked) => updatePreference('challenge_notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="challenge-status">
                {isRTL ? 'تحديثات حالة التحديات' : 'Challenge Status Updates'}
              </Label>
              <Switch
                id="challenge-status"
                checked={preferences.challenge_status_updates}
                onCheckedChange={(checked) => updatePreference('challenge_status_updates', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="new-challenges">
                {isRTL ? 'إعلان تحديات جديدة' : 'New Challenge Announcements'}
              </Label>
              <Switch
                id="new-challenges"
                checked={preferences.new_challenge_announcements}
                onCheckedChange={(checked) => updatePreference('new_challenge_announcements', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ideas & Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              {isRTL ? 'إشعارات الأفكار' : 'Idea Notifications'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="idea-status">
                {isRTL ? 'تحديثات حالة الأفكار' : 'Idea Status Updates'}
              </Label>
              <Switch
                id="idea-status"
                checked={preferences.idea_status_updates}
                onCheckedChange={(checked) => updatePreference('idea_status_updates', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="idea-feedback">
                {isRTL ? 'تعليقات على الأفكار' : 'Idea Feedback'}
              </Label>
              <Switch
                id="idea-feedback"
                checked={preferences.idea_feedback_notifications}
                onCheckedChange={(checked) => updatePreference('idea_feedback_notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="new-ideas">
                {isRTL ? 'أفكار جديدة' : 'New Ideas'}
              </Label>
              <Switch
                id="new-ideas"
                checked={preferences.new_idea_notifications}
                onCheckedChange={(checked) => updatePreference('new_idea_notifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              {isRTL ? 'إشعارات الفرص' : 'Opportunity Notifications'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="opportunity-notifications">
                {isRTL ? 'إشعارات الفرص' : 'Opportunity Notifications'}
              </Label>
              <Switch
                id="opportunity-notifications"
                checked={preferences.opportunity_notifications}
                onCheckedChange={(checked) => updatePreference('opportunity_notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="new-opportunities">
                {isRTL ? 'إعلان فرص جديدة' : 'New Opportunities'}
              </Label>
              <Switch
                id="new-opportunities"
                checked={preferences.new_opportunity_announcements}
                onCheckedChange={(checked) => updatePreference('new_opportunity_announcements', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin & Team */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {isRTL ? 'إشعارات الإدارة والفريق' : 'Admin & Team Notifications'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="admin-notifications">
                {isRTL ? 'إشعارات الإدارة' : 'Admin Notifications'}
              </Label>
              <Switch
                id="admin-notifications"
                checked={preferences.admin_notifications}
                onCheckedChange={(checked) => updatePreference('admin_notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="team-assignments">
                {isRTL ? 'مهام الفريق' : 'Team Assignments'}
              </Label>
              <Switch
                id="team-assignments"
                checked={preferences.team_assignment_notifications}
                onCheckedChange={(checked) => updatePreference('team_assignment_notifications', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timing & Frequency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {isRTL ? 'التوقيت والتكرار' : 'Timing & Frequency'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="digest-frequency">
                {isRTL ? 'تكرار ملخص الإشعارات' : 'Digest Frequency'}
              </Label>
              <Select
                value={preferences.digest_frequency}
                onValueChange={(value) => updatePreference('digest_frequency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">{isRTL ? 'يومياً' : 'Daily'}</SelectItem>
                  <SelectItem value="weekly">{isRTL ? 'أسبوعياً' : 'Weekly'}</SelectItem>
                  <SelectItem value="monthly">{isRTL ? 'شهرياً' : 'Monthly'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="reminder-days">
                {isRTL ? 'أيام التذكير المسبق' : 'Reminder Advance Days'}
              </Label>
              <Input
                id="reminder-days"
                type="number"
                min="0"
                max="30"
                value={preferences.reminder_advance_days}
                onChange={(e) => updatePreference('reminder_advance_days', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5" />
            {isRTL ? 'ساعات الصمت' : 'Quiet Hours'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="quiet-hours-enabled">
              {isRTL ? 'تفعيل ساعات الصمت' : 'Enable Quiet Hours'}
            </Label>
            <Switch
              id="quiet-hours-enabled"
              checked={preferences.quiet_hours_enabled}
              onCheckedChange={(checked) => updatePreference('quiet_hours_enabled', checked)}
            />
          </div>
          
          {preferences.quiet_hours_enabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="quiet-start">
                  {isRTL ? 'بداية ساعات الصمت' : 'Quiet Hours Start'}
                </Label>
                <Input
                  id="quiet-start"
                  type="time"
                  value={preferences.quiet_hours_start}
                  onChange={(e) => updatePreference('quiet_hours_start', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="quiet-end">
                  {isRTL ? 'نهاية ساعات الصمت' : 'Quiet Hours End'}
                </Label>
                <Input
                  id="quiet-end"
                  type="time"
                  value={preferences.quiet_hours_end}
                  onChange={(e) => updatePreference('quiet_hours_end', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="timezone">
                  {isRTL ? 'المنطقة الزمنية' : 'Timezone'}
                </Label>
                <Select
                  value={preferences.quiet_hours_timezone}
                  onValueChange={(value) => updatePreference('quiet_hours_timezone', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Riyadh">{isRTL ? 'الرياض' : 'Riyadh'}</SelectItem>
                    <SelectItem value="Asia/Dubai">{isRTL ? 'دبي' : 'Dubai'}</SelectItem>
                    <SelectItem value="Asia/Kuwait">{isRTL ? 'الكويت' : 'Kuwait'}</SelectItem>
                    <SelectItem value="Asia/Qatar">{isRTL ? 'قطر' : 'Qatar'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Settings Summary */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isRTL ? 'ملخص الإعدادات النشطة' : 'Active Settings Summary'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {preferences.email_enabled && (
              <Badge variant="secondary">
                <Mail className="w-3 h-3 mr-1" />
                {isRTL ? 'البريد الإلكتروني' : 'Email'}
              </Badge>
            )}
            {preferences.push_enabled && (
              <Badge variant="secondary">
                <Bell className="w-3 h-3 mr-1" />
                {isRTL ? 'الإشعارات الفورية' : 'Push'}
              </Badge>
            )}
            {preferences.event_registration_notifications && (
              <Badge variant="outline">
                <Calendar className="w-3 h-3 mr-1" />
                {isRTL ? 'تسجيلات الفعاليات' : 'Event Registrations'}
              </Badge>
            )}
            {preferences.challenge_notifications && (
              <Badge variant="outline">
                <Target className="w-3 h-3 mr-1" />
                {isRTL ? 'التحديات' : 'Challenges'}
              </Badge>
            )}
            {preferences.quiet_hours_enabled && (
              <Badge variant="outline">
                <Moon className="w-3 h-3 mr-1" />
                {isRTL ? `ساعات الصمت ${preferences.quiet_hours_start} - ${preferences.quiet_hours_end}` : `Quiet Hours ${preferences.quiet_hours_start} - ${preferences.quiet_hours_end}`}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}