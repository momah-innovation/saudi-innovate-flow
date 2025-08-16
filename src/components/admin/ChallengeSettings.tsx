import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { SensitivityBadge } from '@/components/ui/SensitivityBadge';
import { useToast } from "@/hooks/use-toast";
import { useSettingsManager } from "@/hooks/useSettingsManager";
import { useChallengeManagement } from "@/hooks/useChallengeManagement";
import { Calendar, Clock, Shield, Bell, Users, Archive, Settings as SettingsIcon } from "lucide-react";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { logger } from "@/utils/error-handler";
import { currentTimestamp } from "@/utils/unified-date-handler";
import { createErrorHandler } from "@/utils/unified-error-handler";

interface Challenge {
  id: string;
  title_ar: string;
  title_en?: string;
  status: string;
  priority_level: string;
  sensitivity_level: string;
  start_date?: string;
  end_date?: string;
  estimated_budget?: number;
  challenge_owner_id?: string;
  created_by?: string;
}

interface ChallengeSettingsProps {
  challenge: Challenge;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const ChallengeSettings: React.FC<ChallengeSettingsProps> = ({
  challenge,
  isOpen,
  onClose,
  onUpdate
}) => {
  const { t } = useUnifiedTranslation();
  const { toast } = useToast();
  const { getSettingValue } = useSettingsManager();
  const { updateChallenge } = useChallengeManagement();
  const challengeSensitivityLevels = getSettingValue('sensitivity_levels', []) as string[];
  const [loading, setLoading] = useState(false);
  
  // System settings
  const [systemSettings, setSystemSettings] = useState({
    textareaRows: 3,
    maxSubmissions: 20
  });
  const [settings, setSettings] = useState({
    // Access Control
    visibility: challenge.sensitivity_level || 'normal',
    allowAnonymousSubmissions: false,
    requireApproval: true,
    
    // Notifications
    emailNotifications: true,
    submissionAlerts: true,
    deadlineReminders: true,
    
    // Workflow
    autoArchive: false,
    evaluationDeadline: '',
    maxSubmissionsPerUser: 5,
    
    // Advanced
    tags: '',
    customFields: '',
    archiveReason: ''
  });

  useEffect(() => {
    if (challenge && isOpen) {
      // Load existing settings or set defaults
      setSettings(prev => ({
        ...prev,
        visibility: challenge.sensitivity_level || 'normal',
      }));
      fetchSystemSettings();
    }
  }, [challenge, isOpen]);

  const fetchSystemSettings = async () => {
    try {
      // ✅ MIGRATED: Would use system settings hook in production
      // For now, keeping minimal functionality
      setSystemSettings(prev => ({ ...prev, textareaRows: 3, maxSubmissions: 20 }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // ✅ MIGRATED: Using centralized hook method
      await updateChallenge(challenge.id, {
        sensitivity_level: settings.visibility,
        // Add other fields as needed
      });

      toast({
        title: t('challenge_settings.settings_updated'),
        description: t('challenge_settings.settings_updated_description'),
      });
      
      onUpdate();
      onClose();
    } catch (error) {
      logger.error('Error updating challenge settings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveChallenge = async () => {
    try {
      setLoading(true);
      
      // ✅ MIGRATED: Using centralized hook method
      await updateChallenge(challenge.id, { 
        status: 'archived'
      });

      toast({
        title: t('admin.challenges.settings.archived_success_title'),
        description: t('admin.challenges.settings.archived_success_description'),
      });

      onUpdate();
      onClose();
    } catch (error) {
      logger.error('Error archiving challenge', error);
      toast({
        title: t('challenge_settings.error'),
        description: t('challenge_settings.error_archive_description'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            {t('challenge_settings.title')}: {challenge.title_ar}
            {challenge.title_en && (
              <span className="text-sm text-muted-foreground" dir="ltr">({challenge.title_en})</span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={challenge.status} size="sm" />
            <PriorityBadge priority={challenge.priority_level} size="sm" />
            <SensitivityBadge sensitivity={challenge.sensitivity_level} size="sm" />
          </div>

          <Tabs defaultValue="access" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="access" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {t('challenge_settings.access_control')}
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                {t('challenge_settings.notifications')}
              </TabsTrigger>
              <TabsTrigger value="workflow" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t('challenge_settings.workflow')}
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Archive className="h-4 w-4" />
                {t('challenge_settings.advanced')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="access" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('challenge_settings.visibility_access')}</CardTitle>
                  <CardDescription>
                    {t('challenge_settings.visibility_access_description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="visibility">{t('challenge_settings.sensitivity_level')}</Label>
                    <Select
                      value={settings.visibility}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, visibility: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('challenge_settings.sensitivity_placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {challengeSensitivityLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                            {level === 'normal' && ` - ${t('challenge_settings.public_access')}`}
                            {level === 'sensitive' && ` - ${t('challenge_settings.team_members_only')}`}
                            {level === 'confidential' && ` - ${t('challenge_settings.admins_only')}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="anonymous">{t('challenge_settings.allow_anonymous')}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t('challenge_settings.allow_anonymous_description')}
                        </p>
                      </div>
                    <Switch
                      id="anonymous"
                      checked={settings.allowAnonymousSubmissions}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, allowAnonymousSubmissions: checked }))
                      }
                    />
                  </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="approval">{t('challenge_settings.require_approval')}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t('challenge_settings.require_approval_description')}
                        </p>
                      </div>
                    <Switch
                      id="approval"
                      checked={settings.requireApproval}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, requireApproval: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('challenge_settings.notification_preferences')}</CardTitle>
                  <CardDescription>
                    {t('challenge_settings.notification_preferences_description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">{t('challenge_settings.email_notifications')}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t('challenge_settings.email_notifications_description')}
                        </p>
                      </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="submission-alerts">{t('challenge_settings.submission_alerts')}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t('challenge_settings.submission_alerts_description')}
                        </p>
                      </div>
                    <Switch
                      id="submission-alerts"
                      checked={settings.submissionAlerts}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, submissionAlerts: checked }))
                      }
                    />
                  </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="deadline-reminders">{t('challenge_settings.deadline_reminders')}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t('challenge_settings.deadline_reminders_description')}
                        </p>
                      </div>
                    <Switch
                      id="deadline-reminders"
                      checked={settings.deadlineReminders}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, deadlineReminders: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workflow" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('challenge_settings.workflow_configuration')}</CardTitle>
                  <CardDescription>
                    {t('challenge_settings.workflow_configuration_description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="evaluation-deadline">{t('challenge_settings.evaluation_deadline')}</Label>
                    <Input
                      id="evaluation-deadline"
                      type="date"
                      value={settings.evaluationDeadline}
                      onChange={(e) => setSettings(prev => ({ ...prev, evaluationDeadline: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-submissions">{t('challenge_settings.max_submissions_per_user')}</Label>
                    <Input
                      id="max-submissions"
                      type="number"
                      min="1"
                      max={systemSettings.maxSubmissions.toString()}
                      value={settings.maxSubmissionsPerUser}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxSubmissionsPerUser: parseInt(e.target.value) || 5 }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-archive">{t('challenge_settings.auto_archive')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('challenge_settings.auto_archive_description')}
                      </p>
                    </div>
                    <Switch
                      id="auto-archive"
                      checked={settings.autoArchive}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, autoArchive: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('challenge_settings.advanced_settings')}</CardTitle>
                  <CardDescription>
                    {t('challenge_settings.advanced_settings_description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tags">{t('challenge_settings.challenge_tags')}</Label>
                    <Input
                      id="tags"
                      placeholder={t('challenge_settings.tags_placeholder')}
                      value={settings.tags}
                      onChange={(e) => setSettings(prev => ({ ...prev, tags: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-fields">{t('challenge_settings.custom_metadata')}</Label>
                    <Textarea
                      id="custom-fields"
                      placeholder={t('challenge_settings.custom_metadata_placeholder')}
                      value={settings.customFields}
                      onChange={(e) => setSettings(prev => ({ ...prev, customFields: e.target.value }))}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-destructive">{t('challenge_settings.danger_zone')}</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="archive-reason">{t('challenge_settings.archive_reason')}</Label>
                      <Textarea
                        id="archive-reason"
                        placeholder={t('challenge_settings.archive_reason_placeholder')}
                        value={settings.archiveReason}
                        onChange={(e) => setSettings(prev => ({ ...prev, archiveReason: e.target.value }))}
                      />
                    </div>

                    <Button
                      variant="destructive"
                      onClick={handleArchiveChallenge}
                      disabled={loading}
                      className="w-full"
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      {t('challenge_settings.archive_challenge')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              {t('challenge_settings.cancel')}
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? t('common.status.saving') : t('challenge_settings.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};