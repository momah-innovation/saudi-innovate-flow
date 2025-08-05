import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSystemLists } from "@/hooks/useSystemLists";
import { useTranslation } from "@/hooks/useAppTranslation";
import { useRTLAware } from "@/hooks/useRTLAware";

interface ChallengeSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function ChallengeSettings({ settings, onSettingChange }: ChallengeSettingsProps) {
  const { challengeStatusOptions, challengePriorityLevels, challengeSensitivityLevels } = useSystemLists();
  const { t } = useTranslation();
  const { textStart, flexRowReverse } = useRTLAware();
  
  return (
    <div className={`space-y-6 ${textStart}`}>
      <Card>
        <CardHeader className={textStart}>
          <CardTitle>{t('challenge_default_settings')}</CardTitle>
          <CardDescription>{t('default_values_new_challenges')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${textStart}`}>
            <div className="space-y-2">
              <Label htmlFor="defaultStatus">{t('default_status')}</Label>
              <Select 
                value={settings.defaultStatus || 'draft'} 
                onValueChange={(value) => onSettingChange('defaultStatus', value)}
              >
                <SelectTrigger className={textStart}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {challengeStatusOptions.map(status => (
                    <SelectItem key={status} value={status}>
                      {status === 'draft' ? t('draft') : status === 'published' ? t('published') : status === 'active' ? t('active') : 
                       status === 'closed' ? t('closed') : status === 'archived' ? t('archived') : status === 'completed' ? t('completed') : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultPriority">{t('default_priority')}</Label>
              <Select 
                value={settings.defaultPriority || 'medium'} 
                onValueChange={(value) => onSettingChange('defaultPriority', value)}
              >
                <SelectTrigger className={textStart}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {challengePriorityLevels.map(priority => (
                    <SelectItem key={priority} value={priority}>
                      {priority === 'low' ? t('low') : priority === 'medium' ? t('medium') : t('high')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultSensitivity">{t('default_sensitivity_level')}</Label>
              <Select 
                value={settings.defaultSensitivity || 'normal'} 
                onValueChange={(value) => onSettingChange('defaultSensitivity', value)}
              >
                <SelectTrigger className={textStart}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {challengeSensitivityLevels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level === 'normal' ? t('normal') : level === 'sensitive' ? t('sensitive') : t('confidential')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={textStart}>
          <CardTitle>{t('challenge_limits_constraints')}</CardTitle>
          <CardDescription>{t('challenge_limits_description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${textStart}`}>
            <div className="space-y-2">
              <Label htmlFor="maxChallengesPerUser">{t('max_challenges_per_user')}</Label>
              <Input
                id="maxChallengesPerUser"
                type="number"
                min="1"
                max="100"
                value={settings.maxChallengesPerUser || 10}
                onChange={(e) => onSettingChange('maxChallengesPerUser', parseInt(e.target.value))}
                className={textStart}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemsPerPage">{t('items_per_page')}</Label>
              <Select 
                value={(settings.itemsPerPage || 12).toString()} 
                onValueChange={(value) => onSettingChange('itemsPerPage', parseInt(value))}
              >
                <SelectTrigger className={textStart}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={textStart}>
          <CardTitle>{t('user_interface_settings')}</CardTitle>
          <CardDescription>{t('customize_user_experience_challenges')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="defaultViewMode">{t('default_view_mode')}</Label>
            <Select 
              value={settings.defaultViewMode || 'cards'} 
              onValueChange={(value) => onSettingChange('defaultViewMode', value)}
            >
              <SelectTrigger className={textStart}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cards">{t('cards')}</SelectItem>
                <SelectItem value="list">{t('list')}</SelectItem>
                <SelectItem value="grid">{t('grid')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`flex items-center justify-between ${flexRowReverse}`}>
            <div className={`space-y-0.5 ${textStart}`}>
              <Label className="text-base">{t('enable_advanced_filters')}</Label>
              <p className="text-sm text-muted-foreground">{t('show_additional_filter_options')}</p>
            </div>
            <Switch
              checked={settings.enableAdvancedFilters !== false}
              onCheckedChange={(checked) => onSettingChange('enableAdvancedFilters', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${flexRowReverse}`}>
            <div className={`space-y-0.5 ${textStart}`}>
              <Label className="text-base">{t('preview_on_hover')}</Label>
              <p className="text-sm text-muted-foreground">{t('show_quick_preview_on_hover')}</p>
            </div>
            <Switch
              checked={settings.showPreviewOnHover !== false}
              onCheckedChange={(checked) => onSettingChange('showPreviewOnHover', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={textStart}>
          <CardTitle>{t('workflow_settings')}</CardTitle>
          <CardDescription>{t('control_challenge_workflow_collaboration')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center justify-between ${flexRowReverse}`}>
            <div className={`space-y-0.5 ${textStart}`}>
              <Label className="text-base">{t('require_approval_for_publish')}</Label>
              <p className="text-sm text-muted-foreground">{t('require_admin_approval_before_publish')}</p>
            </div>
            <Switch
              checked={settings.requireApprovalForPublish !== false}
              onCheckedChange={(checked) => onSettingChange('requireApprovalForPublish', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${flexRowReverse}`}>
            <div className={`space-y-0.5 ${textStart}`}>
              <Label className="text-base">{t('allow_anonymous_submissions')}</Label>
              <p className="text-sm text-muted-foreground">{t('allow_anonymous_idea_submissions')}</p>
            </div>
            <Switch
              checked={settings.allowAnonymousSubmissions || false}
              onCheckedChange={(checked) => onSettingChange('allowAnonymousSubmissions', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${flexRowReverse}`}>
            <div className={`space-y-0.5 ${textStart}`}>
              <Label className="text-base">{t('enable_collaboration')}</Label>
              <p className="text-sm text-muted-foreground">{t('allow_collaborative_work_challenges')}</p>
            </div>
            <Switch
              checked={settings.enableCollaboration !== false}
              onCheckedChange={(checked) => onSettingChange('enableCollaboration', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${flexRowReverse}`}>
            <div className={`space-y-0.5 ${textStart}`}>
              <Label className="text-base">{t('enable_comments')}</Label>
              <p className="text-sm text-muted-foreground">{t('allow_commenting_challenges_ideas')}</p>
            </div>
            <Switch
              checked={settings.enableComments !== false}
              onCheckedChange={(checked) => onSettingChange('enableComments', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${flexRowReverse}`}>
            <div className={`space-y-0.5 ${textStart}`}>
              <Label className="text-base">{t('enable_ratings')}</Label>
              <p className="text-sm text-muted-foreground">{t('allow_rating_challenges_ideas')}</p>
            </div>
            <Switch
              checked={settings.enableRatings !== false}
              onCheckedChange={(checked) => onSettingChange('enableRatings', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}