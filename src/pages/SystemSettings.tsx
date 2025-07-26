import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Globe, RotateCcw } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { AppSidebar } from "@/components/layout/Sidebar";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function SystemSettings() {
  const navigate = useNavigate();
  
  // Default values for system settings
  const defaultValues = {
    // Team Management Defaults
    maxConcurrentProjects: 5,
    defaultPerformanceRating: 0,
    maxExpertWorkload: 5,
    performanceRatingMin: 0,
    performanceRatingMax: 5,
    capacityWarningThreshold: 90,
    
    // Challenge Management
    challengeDuration: 30,
    submissionLimit: 5,
    autoApproveIdeas: false,
    digitalMaturityScoreMin: 0,
    digitalMaturityScoreMax: 10,
    challengeMaxBudget: 1000000,
    challengeTextareaRows: 4,
    challengeNotesRows: 2,
    challengeMaxSubmissionsPerChallenge: 20,
    
    // Expert Management
    expertWorkloadWarningThreshold: 60,
    expertProfileTextareaRows: 3,
    
    // Role Request Limits
    roleRejectionWaitDays: 30,
    maxRoleRequestsPerWeek: 3,
    roleJustificationMaxPreviewLength: 50,
    
    // User Profile Settings
    minExperienceYears: 0,
    maxExperienceYears: 50,
    passwordMinLength: 6,
    
    // Notification Settings
    emailNotifications: true,
    roleRequestNotifications: true,
    challengeDeadlineReminders: true,
    notificationFetchLimit: 50,
    toastTimeoutMs: 1000000,
    toastLimit: 1,
    
    // UI Settings
    sidebarCookieMaxAgeDays: 7,
    navigationDelayMs: 100,
    cssTransitionDurationMs: 300,
    avatarSizePx: 20,
    uiDefaultTextareaRows: 4,
    uiDescriptionMaxPreviewLength: 100,
    uiTablePageSize: 10,
    uiAnimationDurationMs: 200,
    
    // Form Validation
    formMinBudget: 1000,
    formMaxIdeaTitleLength: 200,
    formMaxDescriptionLength: 5000,
    
    // Profile Management
    profileBioTextareaRows: 3,
    profileInnovationBackgroundRows: 2,
    profileMaxExperienceYears: 50,
    profileMinExperienceYears: 0,
    
    // Team Management
    teamMaxConcurrentProjectsPerMember: 5,
    teamMaxPerformanceRating: 5,
    teamMinPerformanceRating: 0,
    teamInsightsDisplayLimit: 10,
    teamInsightTitlePreviewLength: 50,
    
    // Challenge Details
    challengeDetailsDescriptionRows: 4,
    challengeDetailsVisionRows: 3,
    
    // Focus Questions
    focusQuestionTextareaRows: 3,
    
    // Expert Assignment
    expertAssignmentNotesRows: 3,
    expertAssignmentBulkNotesRows: 2,
    expertExpertisePreviewLimit: 2,
    
    // UI Display
    uiInitialsMaxLength: 2,
    
    // API Settings
    apiRateLimit: 1000,
  };

  // State for form values
  const [values, setValues] = useState(defaultValues);
  const [loading, setLoading] = useState(true);

  // Load settings from database on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_key, setting_value');

      if (error) throw error;

      if (data) {
        const settingsMap: Record<string, any> = {};
        data.forEach((setting) => {
          const value = typeof setting.setting_value === 'string' 
            ? JSON.parse(setting.setting_value) 
            : setting.setting_value;
          
          switch (setting.setting_key) {
            case 'team_max_concurrent_projects':
              settingsMap.maxConcurrentProjects = parseInt(value);
              break;
            case 'team_default_performance_rating':
              settingsMap.defaultPerformanceRating = parseFloat(value);
              break;
            case 'team_max_expert_workload':
              settingsMap.maxExpertWorkload = parseInt(value);
              break;
            case 'challenge_default_duration_days':
              settingsMap.challengeDuration = parseInt(value);
              break;
            case 'challenge_default_submission_limit':
              settingsMap.submissionLimit = parseInt(value);
              break;
            case 'challenge_auto_approve_ideas':
              settingsMap.autoApproveIdeas = value === 'true' || value === true;
              break;
            case 'challenge_max_budget':
              settingsMap.challengeMaxBudget = parseInt(value);
              break;
            case 'challenge_textarea_rows':
              settingsMap.challengeTextareaRows = parseInt(value);
              break;
            case 'challenge_notes_rows':
              settingsMap.challengeNotesRows = parseInt(value);
              break;
            case 'challenge_max_submissions_per_challenge':
              settingsMap.challengeMaxSubmissionsPerChallenge = parseInt(value);
              break;
            case 'expert_workload_warning_threshold':
              settingsMap.expertWorkloadWarningThreshold = parseInt(value);
              break;
            case 'expert_profile_textarea_rows':
              settingsMap.expertProfileTextareaRows = parseInt(value);
              break;
            case 'notification_email_enabled':
              settingsMap.emailNotifications = value === 'true' || value === true;
              break;
            case 'notification_role_requests_enabled':
              settingsMap.roleRequestNotifications = value === 'true' || value === true;
              break;
            case 'notification_challenge_deadlines_enabled':
              settingsMap.challengeDeadlineReminders = value === 'true' || value === true;
              break;
            case 'role_rejection_wait_days':
              settingsMap.roleRejectionWaitDays = parseInt(value);
              break;
            case 'role_max_requests_per_week':
              settingsMap.maxRoleRequestsPerWeek = parseInt(value);
              break;
            case 'role_justification_max_preview_length':
              settingsMap.roleJustificationMaxPreviewLength = parseInt(value);
              break;
            case 'notification_fetch_limit':
              settingsMap.notificationFetchLimit = parseInt(value);
              break;
            case 'notification_toast_timeout_ms':
              settingsMap.toastTimeoutMs = parseInt(value);
              break;
            case 'ui_sidebar_cookie_max_age_days':
              settingsMap.sidebarCookieMaxAgeDays = parseInt(value);
              break;
            case 'team_performance_rating_min':
              settingsMap.performanceRatingMin = parseInt(value);
              break;
            case 'team_performance_rating_max':
              settingsMap.performanceRatingMax = parseInt(value);
              break;
            case 'team_capacity_warning_threshold':
              settingsMap.capacityWarningThreshold = parseInt(value);
              break;
            case 'challenge_digital_maturity_score_min':
              settingsMap.digitalMaturityScoreMin = parseInt(value);
              break;
            case 'challenge_digital_maturity_score_max':
              settingsMap.digitalMaturityScoreMax = parseInt(value);
              break;
            case 'user_min_experience_years':
              settingsMap.minExperienceYears = parseInt(value);
              break;
            case 'user_max_experience_years':
              settingsMap.maxExperienceYears = parseInt(value);
              break;
            case 'auth_password_min_length':
              settingsMap.passwordMinLength = parseInt(value);
              break;
            case 'notification_toast_limit':
              settingsMap.toastLimit = parseInt(value);
              break;
            case 'ui_navigation_delay_ms':
              settingsMap.navigationDelayMs = parseInt(value);
              break;
            case 'ui_css_transition_duration_ms':
              settingsMap.cssTransitionDurationMs = parseInt(value);
              break;
            case 'ui_avatar_size_px':
              settingsMap.avatarSizePx = parseInt(value);
              break;
            case 'ui_default_textarea_rows':
              settingsMap.uiDefaultTextareaRows = parseInt(value);
              break;
            case 'ui_description_max_preview_length':
              settingsMap.uiDescriptionMaxPreviewLength = parseInt(value);
              break;
            case 'ui_table_page_size':
              settingsMap.uiTablePageSize = parseInt(value);
              break;
            case 'ui_animation_duration_ms':
              settingsMap.uiAnimationDurationMs = parseInt(value);
              break;
            case 'form_min_budget':
              settingsMap.formMinBudget = parseInt(value);
              break;
            case 'form_max_idea_title_length':
              settingsMap.formMaxIdeaTitleLength = parseInt(value);
              break;
            case 'form_max_description_length':
              settingsMap.formMaxDescriptionLength = parseInt(value);
              break;
            case 'api_rate_limit_per_hour':
              settingsMap.apiRateLimit = parseInt(value);
              break;
          }
        });

        setValues(prev => ({ ...prev, ...settingsMap }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load system settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (settingsToSave: Array<{key: string, value: any}>) => {
    try {
      for (const setting of settingsToSave) {
        const { error } = await supabase
          .from('system_settings')
          .update({ 
            setting_value: JSON.stringify(setting.value),
            updated_by: (await supabase.auth.getUser()).data.user?.id 
          })
          .eq('setting_key', setting.key);

        if (error) throw error;
      }
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
      return false;
    }
  };

  const handleReset = async (field: keyof typeof defaultValues) => {
    const originalValue = defaultValues[field];
    setValues(prev => ({
      ...prev,
      [field]: originalValue
    }));

    // Also reset in database
    const settingKey = getSettingKey(field);
    if (settingKey) {
      await saveSettings([{ key: settingKey, value: originalValue }]);
      toast.success('Setting reset to default value');
    }
  };

  const getSettingKey = (field: keyof typeof defaultValues): string | null => {
    const keyMap = {
      maxConcurrentProjects: 'team_max_concurrent_projects',
      defaultPerformanceRating: 'team_default_performance_rating',
      maxExpertWorkload: 'team_max_expert_workload',
      performanceRatingMin: 'team_performance_rating_min',
      performanceRatingMax: 'team_performance_rating_max',
      capacityWarningThreshold: 'team_capacity_warning_threshold',
      challengeDuration: 'challenge_default_duration_days',
      submissionLimit: 'challenge_default_submission_limit',
      autoApproveIdeas: 'challenge_auto_approve_ideas',
      challengeMaxBudget: 'challenge_max_budget',
      challengeTextareaRows: 'challenge_textarea_rows',
      challengeNotesRows: 'challenge_notes_rows',
      challengeMaxSubmissionsPerChallenge: 'challenge_max_submissions_per_challenge',
      digitalMaturityScoreMin: 'challenge_digital_maturity_score_min',
      digitalMaturityScoreMax: 'challenge_digital_maturity_score_max',
      expertWorkloadWarningThreshold: 'expert_workload_warning_threshold',
      expertProfileTextareaRows: 'expert_profile_textarea_rows',
      roleRejectionWaitDays: 'role_rejection_wait_days',
      maxRoleRequestsPerWeek: 'role_max_requests_per_week',
      roleJustificationMaxPreviewLength: 'role_justification_max_preview_length',
      minExperienceYears: 'user_min_experience_years',
      maxExperienceYears: 'user_max_experience_years',
      passwordMinLength: 'auth_password_min_length',
      emailNotifications: 'notification_email_enabled',
      roleRequestNotifications: 'notification_role_requests_enabled',
      challengeDeadlineReminders: 'notification_challenge_deadlines_enabled',
      notificationFetchLimit: 'notification_fetch_limit',
      toastTimeoutMs: 'notification_toast_timeout_ms',
      toastLimit: 'notification_toast_limit',
      sidebarCookieMaxAgeDays: 'ui_sidebar_cookie_max_age_days',
      navigationDelayMs: 'ui_navigation_delay_ms',
      cssTransitionDurationMs: 'ui_css_transition_duration_ms',
      avatarSizePx: 'ui_avatar_size_px',
      uiDefaultTextareaRows: 'ui_default_textarea_rows',
      uiDescriptionMaxPreviewLength: 'ui_description_max_preview_length',
      uiTablePageSize: 'ui_table_page_size',
      uiAnimationDurationMs: 'ui_animation_duration_ms',
      formMinBudget: 'form_min_budget',
      formMaxIdeaTitleLength: 'form_max_idea_title_length',
      formMaxDescriptionLength: 'form_max_description_length',
      apiRateLimit: 'api_rate_limit_per_hour',
    };
    return keyMap[field] || null;
  };

  const handleSaveTeamDefaults = async () => {
    const settingsToSave = [
      { key: 'team_max_concurrent_projects', value: values.maxConcurrentProjects },
      { key: 'team_default_performance_rating', value: values.defaultPerformanceRating },
      { key: 'team_max_expert_workload', value: values.maxExpertWorkload },
      { key: 'team_performance_rating_min', value: values.performanceRatingMin },
      { key: 'team_performance_rating_max', value: values.performanceRatingMax },
      { key: 'team_capacity_warning_threshold', value: values.capacityWarningThreshold },
      { key: 'expert_workload_warning_threshold', value: values.expertWorkloadWarningThreshold }
    ];

    const success = await saveSettings(settingsToSave);
    if (success) {
      toast.success("Team management defaults have been updated successfully.");
    }
  };

  const handleSaveChallengeSettings = async () => {
    const settingsToSave = [
      { key: 'challenge_default_duration_days', value: values.challengeDuration },
      { key: 'challenge_default_submission_limit', value: values.submissionLimit },
      { key: 'challenge_auto_approve_ideas', value: values.autoApproveIdeas },
      { key: 'challenge_max_budget', value: values.challengeMaxBudget },
      { key: 'challenge_textarea_rows', value: values.challengeTextareaRows },
      { key: 'challenge_notes_rows', value: values.challengeNotesRows },
      { key: 'challenge_max_submissions_per_challenge', value: values.challengeMaxSubmissionsPerChallenge },
      { key: 'challenge_digital_maturity_score_min', value: values.digitalMaturityScoreMin },
      { key: 'challenge_digital_maturity_score_max', value: values.digitalMaturityScoreMax }
    ];

    const success = await saveSettings(settingsToSave);
    if (success) {
      toast.success("Challenge management settings have been updated successfully.");
    }
  };

  const handleSaveRoleRequestSettings = async () => {
    const settingsToSave = [
      { key: 'role_rejection_wait_days', value: values.roleRejectionWaitDays },
      { key: 'role_max_requests_per_week', value: values.maxRoleRequestsPerWeek },
      { key: 'role_justification_max_preview_length', value: values.roleJustificationMaxPreviewLength },
      { key: 'expert_profile_textarea_rows', value: values.expertProfileTextareaRows }
    ];

    const success = await saveSettings(settingsToSave);
    if (success) {
      toast.success("Role request settings have been updated successfully.");
    }
  };

  const handleSaveNotificationSettings = async () => {
    const settingsToSave = [
      { key: 'notification_email_enabled', value: values.emailNotifications },
      { key: 'notification_role_requests_enabled', value: values.roleRequestNotifications },
      { key: 'notification_challenge_deadlines_enabled', value: values.challengeDeadlineReminders },
      { key: 'notification_fetch_limit', value: values.notificationFetchLimit },
      { key: 'notification_toast_timeout_ms', value: values.toastTimeoutMs },
      { key: 'notification_toast_limit', value: values.toastLimit }
    ];

    const success = await saveSettings(settingsToSave);
    if (success) {
      toast.success("Notification settings have been updated successfully.");
    }
  };

  const handleSaveUISettings = async () => {
    const settingsToSave = [
      { key: 'ui_sidebar_cookie_max_age_days', value: values.sidebarCookieMaxAgeDays },
      { key: 'ui_navigation_delay_ms', value: values.navigationDelayMs },
      { key: 'ui_css_transition_duration_ms', value: values.cssTransitionDurationMs },
      { key: 'ui_avatar_size_px', value: values.avatarSizePx },
      { key: 'ui_default_textarea_rows', value: values.uiDefaultTextareaRows },
      { key: 'ui_description_max_preview_length', value: values.uiDescriptionMaxPreviewLength },
      { key: 'ui_table_page_size', value: values.uiTablePageSize },
      { key: 'ui_animation_duration_ms', value: values.uiAnimationDurationMs },
      { key: 'formMinBudget', value: values.formMinBudget },
      { key: 'formMaxIdeaTitleLength', value: values.formMaxIdeaTitleLength },
      { key: 'formMaxDescriptionLength', value: values.formMaxDescriptionLength }
    ];

    const success = await saveSettings(settingsToSave);
    if (success) {
      toast.success("UI and Form settings have been updated successfully.");
    }
  };

  const handleSaveProfileSettings = async () => {
    const settingsToSave = [
      { key: 'profile_bio_textarea_rows', value: values.profileBioTextareaRows },
      { key: 'profile_innovation_background_rows', value: values.profileInnovationBackgroundRows },
      { key: 'profile_max_experience_years', value: values.profileMaxExperienceYears },
      { key: 'profile_min_experience_years', value: values.profileMinExperienceYears }
    ];

    const success = await saveSettings(settingsToSave);
    if (success) {
      toast.success("Profile settings have been updated successfully.");
    }
  };

  const handleSaveTeamManagementSettings = async () => {
    const settingsToSave = [
      { key: 'team_max_concurrent_projects_per_member', value: values.teamMaxConcurrentProjectsPerMember },
      { key: 'team_max_performance_rating', value: values.teamMaxPerformanceRating },
      { key: 'team_min_performance_rating', value: values.teamMinPerformanceRating },
      { key: 'team_insights_display_limit', value: values.teamInsightsDisplayLimit },
      { key: 'team_insight_title_preview_length', value: values.teamInsightTitlePreviewLength }
    ];

    const success = await saveSettings(settingsToSave);
    if (success) {
      toast.success("Team management settings have been updated successfully.");
    }
  };

  const handleSaveChallengeDetailsSettings = async () => {
    const settingsToSave = [
      { key: 'challenge_details_description_rows', value: values.challengeDetailsDescriptionRows },
      { key: 'challenge_details_vision_rows', value: values.challengeDetailsVisionRows }
    ];

    const success = await saveSettings(settingsToSave);
    if (success) {
      toast.success("Challenge details settings have been updated successfully.");
    }
  };

  const handleSaveFocusQuestionSettings = async () => {
    const settingsToSave = [
      { key: 'focus_question_textarea_rows', value: values.focusQuestionTextareaRows }
    ];

    const success = await saveSettings(settingsToSave);
    if (success) {
      toast.success("Focus question settings have been updated successfully.");
    }
  };

  const handleSaveExpertAssignmentSettings = async () => {
    const settingsToSave = [
      { key: 'expert_assignment_notes_rows', value: values.expertAssignmentNotesRows },
      { key: 'expert_assignment_bulk_notes_rows', value: values.expertAssignmentBulkNotesRows },
      { key: 'expert_expertise_preview_limit', value: values.expertExpertisePreviewLimit }
    ];

    const success = await saveSettings(settingsToSave);
    if (success) {
      toast.success("Expert assignment settings have been updated successfully.");
    }
  };

  const handleSaveUIDisplaySettings = async () => {
    const settingsToSave = [
      { key: 'ui_initials_max_length', value: values.uiInitialsMaxLength }
    ];

    const success = await saveSettings(settingsToSave);
    if (success) {
      toast.success("UI display settings have been updated successfully.");
      toast.success("UI and form settings have been updated successfully.");
    }
  };

  const handleSaveUserProfileSettings = async () => {
    const settingsToSave = [
      { key: 'user_min_experience_years', value: values.minExperienceYears },
      { key: 'user_max_experience_years', value: values.maxExperienceYears },
      { key: 'auth_password_min_length', value: values.passwordMinLength }
    ];

    const success = await saveSettings(settingsToSave);
    if (success) {
      toast.success("User profile settings have been updated successfully.");
    }
  };

  const handleSaveAPISettings = async () => {
    const settingsToSave = [
      { key: 'api_rate_limit', value: values.apiRateLimit }
    ];

    const success = await saveSettings(settingsToSave);
    if (success) {
      toast.success("API settings saved successfully.");
    }
  };

  const handleSaveComponentSettings = async () => {
    const settingsToSave = [
      { key: 'focus_question_textarea_rows', value: values.focusQuestionTextareaRows },
      { key: 'expert_assignment_notes_rows', value: values.expertAssignmentNotesRows },
      { key: 'expert_assignment_bulk_notes_rows', value: values.expertAssignmentBulkNotesRows },
      { key: 'expert_expertise_preview_limit', value: values.expertExpertisePreviewLimit },
      { key: 'ui_initials_max_length', value: values.uiInitialsMaxLength }
    ];

    const success = await saveSettings(settingsToSave);
    if (success) {
      toast.success("Component settings saved successfully.");
    }
  };


  const handleTabChange = (tab: string) => {
    if (tab === "focus-questions") {
      navigate("/admin/focus-questions");
    } else if (tab === "partners") {
      navigate("/admin/partners");
    } else if (tab === "sectors") {
      navigate("/admin/sectors");
    } else if (tab === "organizational-structure") {
      navigate("/admin/organizational-structure");
    } else if (tab === "expert-assignments") {
      navigate("/admin/expert-assignments");
    } else if (tab === "user-management") {
      navigate("/admin/users");
    } else if (tab === "system-settings") {
      navigate("/admin/system-settings");
    } else if (tab === "settings") {
      navigate("/settings");
    } else {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar activeTab="system-settings" onTabChange={handleTabChange} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto p-6 space-y-6">
                <BreadcrumbNav activeTab="system-settings" />
                <div className="flex items-center justify-center h-64">
                  <div className="text-muted-foreground">Loading system settings...</div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeTab="system-settings" onTabChange={handleTabChange} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-6 space-y-6">
              <BreadcrumbNav activeTab="system-settings" />
              
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Globe className="h-8 w-8" />
                  System Settings
                </h1>
                <p className="text-muted-foreground">
                  Configure system-wide settings and defaults for the entire platform
                </p>
              </div>

              {/* Team Management Defaults */}
              <Card>
                <CardHeader>
                  <CardTitle>Team Management Defaults</CardTitle>
                  <CardDescription>
                    Configure default settings for team management and expert workloads
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Default Max Concurrent Projects</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleReset('maxConcurrentProjects')}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        type="number"
                        value={values.maxConcurrentProjects}
                        onChange={(e) => setValues(prev => ({ ...prev, maxConcurrentProjects: parseInt(e.target.value) || 0 }))}
                        min="1"
                        max="20"
                        placeholder="5"
                      />
                      <p className="text-xs text-muted-foreground">
                        Default capacity for new team members
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Expert Workload Warning Threshold (%)</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleReset('expertWorkloadWarningThreshold')}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        type="number"
                        value={values.expertWorkloadWarningThreshold}
                        onChange={(e) => setValues(prev => ({ ...prev, expertWorkloadWarningThreshold: parseInt(e.target.value) || 0 }))}
                        min="50"
                        max="100"
                        placeholder="60"
                      />
                      <p className="text-xs text-muted-foreground">
                        Show expert workload warning when exceeds this percentage
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Performance Rating Min</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleReset('performanceRatingMin')}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        type="number"
                        value={values.performanceRatingMin}
                        onChange={(e) => setValues(prev => ({ ...prev, performanceRatingMin: parseInt(e.target.value) || 0 }))}
                        min="0"
                        max="5"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Performance Rating Max</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleReset('performanceRatingMax')}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        type="number"
                        value={values.performanceRatingMax}
                        onChange={(e) => setValues(prev => ({ ...prev, performanceRatingMax: parseInt(e.target.value) || 0 }))}
                        min="1"
                        max="10"
                        placeholder="5"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t">
                    <Button size="sm" onClick={handleSaveTeamDefaults}>
                      Save Team Defaults
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Challenge Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Challenge Management</CardTitle>
                  <CardDescription>
                    System-wide challenge settings, limits, and UI defaults
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Max Challenge Budget</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleReset('challengeMaxBudget')}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        type="number"
                        value={values.challengeMaxBudget}
                        onChange={(e) => setValues(prev => ({ ...prev, challengeMaxBudget: parseInt(e.target.value) || 0 }))}
                        min="1000"
                        max="10000000"
                        placeholder="1000000"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Max Submissions Per Challenge</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleReset('challengeMaxSubmissionsPerChallenge')}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        type="number"
                        value={values.challengeMaxSubmissionsPerChallenge}
                        onChange={(e) => setValues(prev => ({ ...prev, challengeMaxSubmissionsPerChallenge: parseInt(e.target.value) || 0 }))}
                        min="1"
                        max="100"
                        placeholder="20"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Challenge Description Textarea Rows</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleReset('challengeTextareaRows')}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        type="number"
                        value={values.challengeTextareaRows}
                        onChange={(e) => setValues(prev => ({ ...prev, challengeTextareaRows: parseInt(e.target.value) || 0 }))}
                        min="2"
                        max="10"
                        placeholder="4"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Challenge Notes Textarea Rows</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleReset('challengeNotesRows')}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        type="number"
                        value={values.challengeNotesRows}
                        onChange={(e) => setValues(prev => ({ ...prev, challengeNotesRows: parseInt(e.target.value) || 0 }))}
                        min="1"
                        max="5"
                        placeholder="2"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t">
                    <Button size="sm" onClick={handleSaveChallengeSettings}>
                      Save Challenge Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Role Management Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Role Management Settings</CardTitle>
                  <CardDescription>
                    Configure role request limits and expert profile settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Role Justification Preview Length</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleReset('roleJustificationMaxPreviewLength')}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        type="number"
                        value={values.roleJustificationMaxPreviewLength}
                        onChange={(e) => setValues(prev => ({ ...prev, roleJustificationMaxPreviewLength: parseInt(e.target.value) || 0 }))}
                        min="20"
                        max="200"
                        placeholder="50"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Expert Profile Textarea Rows</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleReset('expertProfileTextareaRows')}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        type="number"
                        value={values.expertProfileTextareaRows}
                        onChange={(e) => setValues(prev => ({ ...prev, expertProfileTextareaRows: parseInt(e.target.value) || 0 }))}
                        min="2"
                        max="8"
                        placeholder="3"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t">
                    <Button size="sm" onClick={handleSaveRoleRequestSettings}>
                      Save Role Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Configure system-wide notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Send email notifications for important events
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={values.emailNotifications}
                        onCheckedChange={(checked) => setValues(prev => ({ ...prev, emailNotifications: checked }))}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleReset('emailNotifications')}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Role Request Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Notify admins of new role requests
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={values.roleRequestNotifications}
                        onCheckedChange={(checked) => setValues(prev => ({ ...prev, roleRequestNotifications: checked }))}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleReset('roleRequestNotifications')}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Challenge Deadline Reminders</p>
                      <p className="text-sm text-muted-foreground">
                        Send reminders before challenge deadlines
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={values.challengeDeadlineReminders}
                        onCheckedChange={(checked) => setValues(prev => ({ ...prev, challengeDeadlineReminders: checked }))}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleReset('challengeDeadlineReminders')}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                     </div>
                   </div>
                   <div className="grid gap-4 md:grid-cols-2">
                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label>Notification Fetch Limit</Label>
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="h-8 w-8 p-0"
                           onClick={() => handleReset('notificationFetchLimit')}
                         >
                           <RotateCcw className="h-4 w-4" />
                         </Button>
                       </div>
                       <Input
                         type="number"
                         value={values.notificationFetchLimit}
                         onChange={(e) => setValues(prev => ({ ...prev, notificationFetchLimit: parseInt(e.target.value) || 0 }))}
                         min="10"
                         max="200"
                         placeholder="50"
                       />
                       <p className="text-xs text-muted-foreground">
                         Maximum notifications to fetch per request
                       </p>
                     </div>
                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label>Toast Timeout (ms)</Label>
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="h-8 w-8 p-0"
                           onClick={() => handleReset('toastTimeoutMs')}
                         >
                           <RotateCcw className="h-4 w-4" />
                         </Button>
                       </div>
                       <Input
                         type="number"
                         value={values.toastTimeoutMs}
                         onChange={(e) => setValues(prev => ({ ...prev, toastTimeoutMs: parseInt(e.target.value) || 0 }))}
                         min="1000"
                         max="10000000"
                         placeholder="1000000"
                       />
                       <p className="text-xs text-muted-foreground">
                         How long toast notifications stay visible
                       </p>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-1">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Toast Limit</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleReset('toastLimit')}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          type="number"
                          value={values.toastLimit}
                          onChange={(e) => setValues(prev => ({ ...prev, toastLimit: parseInt(e.target.value) || 0 }))}
                          min="1"
                          max="10"
                          placeholder="1"
                        />
                        <p className="text-xs text-muted-foreground">
                          Maximum number of toast notifications shown at once
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t">
                      <Button size="sm" onClick={handleSaveNotificationSettings}>
                        Save Notification Settings
                      </Button>
                    </div>
                 </CardContent>
               </Card>

               {/* UI & Form Defaults */}
               <Card>
                 <CardHeader>
                   <CardTitle>UI & Form Defaults</CardTitle>
                   <CardDescription>
                     Configure default UI settings and form validation limits
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Default Textarea Rows</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleReset('uiDefaultTextareaRows')}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          type="number"
                          value={values.uiDefaultTextareaRows}
                          onChange={(e) => setValues(prev => ({ ...prev, uiDefaultTextareaRows: parseInt(e.target.value) || 0 }))}
                          min="2"
                          max="10"
                          placeholder="4"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Description Preview Length</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleReset('uiDescriptionMaxPreviewLength')}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          type="number"
                          value={values.uiDescriptionMaxPreviewLength}
                          onChange={(e) => setValues(prev => ({ ...prev, uiDescriptionMaxPreviewLength: parseInt(e.target.value) || 0 }))}
                          min="50"
                          max="500"
                          placeholder="100"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Table Page Size</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleReset('uiTablePageSize')}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          type="number"
                          value={values.uiTablePageSize}
                          onChange={(e) => setValues(prev => ({ ...prev, uiTablePageSize: parseInt(e.target.value) || 0 }))}
                          min="5"
                          max="100"
                          placeholder="10"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Min Budget (Form Validation)</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleReset('formMinBudget')}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          type="number"
                          value={values.formMinBudget}
                          onChange={(e) => setValues(prev => ({ ...prev, formMinBudget: parseInt(e.target.value) || 0 }))}
                          min="100"
                          max="100000"
                          placeholder="1000"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Max Idea Title Length</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleReset('formMaxIdeaTitleLength')}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          type="number"
                          value={values.formMaxIdeaTitleLength}
                          onChange={(e) => setValues(prev => ({ ...prev, formMaxIdeaTitleLength: parseInt(e.target.value) || 0 }))}
                          min="50"
                          max="500"
                          placeholder="200"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Max Description Length</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleReset('formMaxDescriptionLength')}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          type="number"
                          value={values.formMaxDescriptionLength}
                          onChange={(e) => setValues(prev => ({ ...prev, formMaxDescriptionLength: parseInt(e.target.value) || 0 }))}
                          min="500"
                          max="20000"
                          placeholder="5000"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t">
                      <Button size="sm" onClick={handleSaveUISettings}>
                        Save UI & Form Settings
                      </Button>
                    </div>
                 </CardContent>
               </Card>

               {/* User Profile Settings */}
               <Card>
                 <CardHeader>
                   <CardTitle>User Profile Settings</CardTitle>
                   <CardDescription>
                     Configure user profile validation and limits
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="grid gap-4 md:grid-cols-2">
                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label>Min Experience Years</Label>
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="h-8 w-8 p-0"
                           onClick={() => handleReset('minExperienceYears')}
                         >
                           <RotateCcw className="h-4 w-4" />
                         </Button>
                       </div>
                       <Input
                         type="number"
                         value={values.minExperienceYears}
                         onChange={(e) => setValues(prev => ({ ...prev, minExperienceYears: parseInt(e.target.value) || 0 }))}
                         min="0"
                         max="100"
                         placeholder="0"
                       />
                       <p className="text-xs text-muted-foreground">
                         Minimum experience years for profiles
                       </p>
                     </div>
                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label>Max Experience Years</Label>
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="h-8 w-8 p-0"
                           onClick={() => handleReset('maxExperienceYears')}
                         >
                           <RotateCcw className="h-4 w-4" />
                         </Button>
                       </div>
                       <Input
                         type="number"
                         value={values.maxExperienceYears}
                         onChange={(e) => setValues(prev => ({ ...prev, maxExperienceYears: parseInt(e.target.value) || 0 }))}
                         min="1"
                         max="100"
                         placeholder="50"
                       />
                       <p className="text-xs text-muted-foreground">
                         Maximum experience years for profiles
                       </p>
                     </div>
                   </div>
                   <div className="grid gap-4 md:grid-cols-1">
                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label>Password Minimum Length</Label>
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="h-8 w-8 p-0"
                           onClick={() => handleReset('passwordMinLength')}
                         >
                           <RotateCcw className="h-4 w-4" />
                         </Button>
                       </div>
                       <Input
                         type="number"
                         value={values.passwordMinLength}
                         onChange={(e) => setValues(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) || 0 }))}
                         min="4"
                         max="50"
                         placeholder="6"
                       />
                       <p className="text-xs text-muted-foreground">
                         Minimum password length for authentication
                       </p>
                     </div>
                   </div>
                   <div className="flex justify-end pt-4 border-t">
                     <Button size="sm" onClick={handleSaveUserProfileSettings}>
                       Save User Profile Settings
                     </Button>
                   </div>
                 </CardContent>
               </Card>

               {/* API Settings */}
               <Card>
                 <CardHeader>
                   <CardTitle>API Settings</CardTitle>
                   <CardDescription>
                     Configure API limits and performance settings
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="grid gap-4 md:grid-cols-1">
                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label>API Rate Limit (per hour)</Label>
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="h-8 w-8 p-0"
                           onClick={() => handleReset('apiRateLimit')}
                         >
                           <RotateCcw className="h-4 w-4" />
                         </Button>
                       </div>
                       <Input
                         type="number"
                         value={values.apiRateLimit}
                         onChange={(e) => setValues(prev => ({ ...prev, apiRateLimit: parseInt(e.target.value) || 0 }))}
                         min="100"
                         max="10000"
                         placeholder="1000"
                       />
                       <p className="text-xs text-muted-foreground">
                         Maximum API requests per hour per user
                       </p>
                     </div>
                   </div>
                   <div className="flex justify-end pt-4 border-t">
                     <Button size="sm" onClick={handleSaveAPISettings}>
                       Save API Settings
                     </Button>
                   </div>
                 </CardContent>
                </Card>

                {/* Profile Management Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Management</CardTitle>
                    <CardDescription>
                      Configure profile setup and user experience settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Bio Textarea Rows</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleReset('profileBioTextareaRows')}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          type="number"
                          value={values.profileBioTextareaRows}
                          onChange={(e) => setValues(prev => ({ ...prev, profileBioTextareaRows: parseInt(e.target.value) || 0 }))}
                          min="2"
                          max="10"
                          placeholder="3"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Innovation Background Rows</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleReset('profileInnovationBackgroundRows')}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          type="number"
                          value={values.profileInnovationBackgroundRows}
                          onChange={(e) => setValues(prev => ({ ...prev, profileInnovationBackgroundRows: parseInt(e.target.value) || 0 }))}
                          min="1"
                          max="5"
                          placeholder="2"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Max Experience Years</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleReset('profileMaxExperienceYears')}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          type="number"
                          value={values.profileMaxExperienceYears}
                          onChange={(e) => setValues(prev => ({ ...prev, profileMaxExperienceYears: parseInt(e.target.value) || 0 }))}
                          min="20"
                          max="100"
                          placeholder="50"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t">
                      <Button size="sm" onClick={handleSaveProfileSettings}>
                        Save Profile Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Component Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Component Configuration</CardTitle>
                    <CardDescription>
                      Configure specific component behaviors and limits
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Focus Question Rows</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleReset('focusQuestionTextareaRows')}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          type="number"
                          value={values.focusQuestionTextareaRows}
                          onChange={(e) => setValues(prev => ({ ...prev, focusQuestionTextareaRows: parseInt(e.target.value) || 0 }))}
                          min="2"
                          max="8"
                          placeholder="3"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Expert Assignment Notes Rows</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleReset('expertAssignmentNotesRows')}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          type="number"
                          value={values.expertAssignmentNotesRows}
                          onChange={(e) => setValues(prev => ({ ...prev, expertAssignmentNotesRows: parseInt(e.target.value) || 0 }))}
                          min="2"
                          max="8"
                          placeholder="3"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Expertise Preview Limit</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleReset('expertExpertisePreviewLimit')}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          type="number"
                          value={values.expertExpertisePreviewLimit}
                          onChange={(e) => setValues(prev => ({ ...prev, expertExpertisePreviewLimit: parseInt(e.target.value) || 0 }))}
                          min="1"
                          max="5"
                          placeholder="2"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t">
                      <Button size="sm" onClick={handleSaveComponentSettings}>
                        Save Component Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* System Information */}
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>
                    Current system configuration and limits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Max File Upload Size</Label>
                      <p className="text-2xl font-bold">5MB</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Session Timeout</Label>
                      <p className="text-2xl font-bold">24h</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">API Rate Limit</Label>
                      <p className="text-2xl font-bold">1000/hr</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
