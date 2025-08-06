import { useSettings } from '@/contexts/SettingsContext';

export const useChallengeDefaults = () => {
  const {
    challenge_default_status: defaultStatus,
    challenge_default_priority: defaultPriority,
    challenge_default_sensitivity: defaultSensitivity,
    max_challenges_per_user: maxChallengesPerUser,
    items_per_page: itemsPerPage,
    challenge_default_view_mode: defaultViewMode,
    challenge_enable_advanced_filters: enableAdvancedFilters,
    challenge_show_preview_on_hover: showPreviewOnHover,
    require_approval_for_publish: requireApprovalForPublish,
    allow_anonymous_submissions: allowAnonymousSubmissions,
    enable_collaboration: enableCollaboration,
    challenge_enable_comments: enableComments,
    challenge_enable_ratings: enableRatings,
    challengeTypes,
    themes
  } = useSettings();
  
  return {
    defaults: {
      status: defaultStatus,
      priority: defaultPriority,
      sensitivity: defaultSensitivity,
    },
    limits: {
      maxChallengesPerUser,
      itemsPerPage,
    },
    ui: {
      defaultViewMode,
      enableAdvancedFilters,
      showPreviewOnHover,
    },
    workflow: {
      requireApprovalForPublish,
      allowAnonymousSubmissions,
      enableCollaboration,
      enableComments,
      enableRatings,
    },
    lists: {
      challengeTypes,
      themes,
    }
  };
};