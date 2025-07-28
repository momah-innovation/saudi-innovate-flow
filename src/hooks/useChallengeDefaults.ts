import { useSettings } from '@/contexts/SettingsContext';

export const useChallengeDefaults = () => {
  const { 
    defaultStatus,
    defaultPriority,
    defaultSensitivity,
    maxChallengesPerUser,
    itemsPerPage,
    defaultViewMode,
    enableAdvancedFilters,
    showPreviewOnHover,
    requireApprovalForPublish,
    allowAnonymousSubmissions,
    enableCollaboration,
    enableComments,
    enableRatings,
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