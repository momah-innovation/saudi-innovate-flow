import { useMemo } from 'react';
import { useSettingsManager } from './useSettingsManager';
import { useUnifiedTranslation } from './useUnifiedTranslation';

interface OptionItem {
  value: string;
  label: string;
  labelAr: string;
}

export const useArraySettings = () => {
  const { getSettingValue } = useSettingsManager();
  const { getTranslation } = useUnifiedTranslation();

  // Helper function to create options from array setting
  const createOptionsFromArray = (settingKey: string, translationPrefix: string): OptionItem[] => {
    const values = getSettingValue(settingKey, []);
    return values.map((value: string) => ({
      value,
      label: getTranslation(`${translationPrefix}.${value}`) || value,
      labelAr: getTranslation(`${translationPrefix}.${value}`) || value
    }));
  };

  // Challenge types
  const challengeTypes = useMemo(() => 
    createOptionsFromArray('challenge_types', 'challenge_types'),
    [getSettingValue, getTranslation]
  );

  // Idea categories
  const ideaCategories = useMemo(() => 
    createOptionsFromArray('idea_categories', 'idea_categories'),
    [getSettingValue, getTranslation]
  );

  // Priority levels
  const priorityLevels = useMemo(() => 
    createOptionsFromArray('priority_levels', 'priority_levels'),
    [getSettingValue, getTranslation]
  );

  // Evaluation criteria
  const evaluationCriteria = useMemo(() => 
    createOptionsFromArray('evaluation_criteria', 'evaluation_criteria'),
    [getSettingValue, getTranslation]
  );

  // Partner types
  const partnerTypes = useMemo(() => 
    createOptionsFromArray('partner_types', 'partner_types'),
    [getSettingValue, getTranslation]
  );

  // Event types and formats
  const eventTypes = useMemo(() => 
    createOptionsFromArray('event_types', 'event_types'),
    [getSettingValue, getTranslation]
  );

  const eventFormats = useMemo(() => 
    createOptionsFromArray('event_formats', 'event_formats'),
    [getSettingValue, getTranslation]
  );

  // Available themes
  const availableThemes = useMemo(() => 
    createOptionsFromArray('available_themes', 'themes'),
    [getSettingValue, getTranslation]
  );

  // Campaign themes
  const campaignThemes = useMemo(() => 
    createOptionsFromArray('campaign_themes', 'campaign_themes'),
    [getSettingValue, getTranslation]
  );

  // Opportunity types
  const opportunityTypes = useMemo(() => 
    createOptionsFromArray('opportunity_types', 'opportunity_types'),
    [getSettingValue, getTranslation]
  );

  // Stakeholder categories
  const stakeholderCategories = useMemo(() => 
    createOptionsFromArray('stakeholder_categories', 'stakeholder_categories'),
    [getSettingValue, getTranslation]
  );

  // User role types
  const userRoleTypes = useMemo(() => 
    createOptionsFromArray('user_role_types', 'user_roles'),
    [getSettingValue, getTranslation]
  );

  // Sector types
  const sectorTypes = useMemo(() => 
    createOptionsFromArray('sector_types', 'sector_types'),
    [getSettingValue, getTranslation]
  );

  return {
    challengeTypes,
    ideaCategories,
    priorityLevels,
    evaluationCriteria,
    partnerTypes,
    eventTypes,
    eventFormats,
    availableThemes,
    campaignThemes,
    opportunityTypes,
    stakeholderCategories,
    userRoleTypes,
    sectorTypes
  };
};