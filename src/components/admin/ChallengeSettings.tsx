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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, Shield, Bell, Users, Archive, Settings as SettingsIcon } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
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
  const { toast } = useToast();
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
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['ui_default_textarea_rows', 'challenge_max_submissions_per_challenge']);

      if (error) throw error;

      const settingsUpdate = data?.reduce((acc: any, setting) => {
        const value = typeof setting.setting_value === 'string' ? 
          parseInt(setting.setting_value) || 0 : 
          setting.setting_value || 0;
        
        switch (setting.setting_key) {
          case 'ui_default_textarea_rows':
            acc.textareaRows = value;
            break;
          case 'challenge_max_submissions_per_challenge':
            acc.maxSubmissions = value;
            break;
        }
        return acc;
      }, {}) || {};

      setSystemSettings(prev => ({ ...prev, ...settingsUpdate }));
    } catch (error) {
      console.error('Error fetching system settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update challenge with new settings
      const { error } = await supabase
        .from('challenges')
        .update({
          sensitivity_level: settings.visibility,
          // Add other fields as needed
        })
        .eq('id', challenge.id);

      if (error) throw error;

      toast({
        title: "Settings Updated",
        description: "Challenge settings have been successfully updated.",
      });
      
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating challenge settings:', error);
      toast({
        title: "Error",
        description: "Failed to update challenge settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveChallenge = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('challenges')
        .update({
          status: 'archived',
          // Add archive reason if needed
        })
        .eq('id', challenge.id);

      if (error) throw error;

      toast({
        title: "Challenge Archived",
        description: "Challenge has been successfully archived.",
      });
      
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error archiving challenge:', error);
      toast({
        title: "Error",
        description: "Failed to archive challenge. Please try again.",
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
            Challenge Settings: {challenge.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Badge variant="outline">{challenge.status}</Badge>
            <Badge variant="outline">{challenge.priority_level}</Badge>
            <Badge variant="outline">{challenge.sensitivity_level}</Badge>
          </div>

          <Tabs defaultValue="access" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="access" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Access Control
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="workflow" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Workflow
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Archive className="h-4 w-4" />
                Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value="access" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Visibility & Access</CardTitle>
                  <CardDescription>
                    Configure who can view and participate in this challenge
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="visibility">Sensitivity Level</Label>
                    <Select
                      value={settings.visibility}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, visibility: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sensitivity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal - Public access</SelectItem>
                        <SelectItem value="sensitive">Sensitive - Team members only</SelectItem>
                        <SelectItem value="confidential">Confidential - Admins only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="anonymous">Allow Anonymous Submissions</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow users to submit ideas without registration
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
                      <Label htmlFor="approval">Require Submission Approval</Label>
                      <p className="text-sm text-muted-foreground">
                        All submissions must be approved before being visible
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
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Configure email and system notifications for this challenge
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send email updates about challenge activity
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
                      <Label htmlFor="submission-alerts">New Submission Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new ideas are submitted
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
                      <Label htmlFor="deadline-reminders">Deadline Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Send reminders before challenge deadlines
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
                  <CardTitle>Workflow Configuration</CardTitle>
                  <CardDescription>
                    Configure automated workflows and limits for this challenge
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="evaluation-deadline">Evaluation Deadline</Label>
                    <Input
                      id="evaluation-deadline"
                      type="date"
                      value={settings.evaluationDeadline}
                      onChange={(e) => setSettings(prev => ({ ...prev, evaluationDeadline: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-submissions">Max Submissions Per User</Label>
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
                      <Label htmlFor="auto-archive">Auto-archive When Complete</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically archive challenge when end date is reached
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
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Additional configuration options and challenge management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tags">Challenge Tags</Label>
                    <Input
                      id="tags"
                      placeholder="ai, innovation, automation (comma-separated)"
                      value={settings.tags}
                      onChange={(e) => setSettings(prev => ({ ...prev, tags: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-fields">Custom Metadata</Label>
                    <Textarea
                      id="custom-fields"
                      placeholder="Additional custom fields or metadata (JSON format)"
                      value={settings.customFields}
                      onChange={(e) => setSettings(prev => ({ ...prev, customFields: e.target.value }))}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-destructive">Danger Zone</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="archive-reason">Archive Reason (Optional)</Label>
                      <Textarea
                        id="archive-reason"
                        placeholder="Reason for archiving this challenge..."
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
                      Archive Challenge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};