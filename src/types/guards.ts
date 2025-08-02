// Type guards for runtime type checking
import type {
  Challenge,
  Idea,
  Profile,
  Expert,
  Partner,
  Team,
  Assignment,
  Campaign,
  Event,
  Evaluation,
  Opportunity,
  FocusQuestion,
  Department,
  Deputy,
  Sector,
  Domain,
  SubDomain,
  Service
} from './index';

// Base type guard helpers
export const isString = (value: unknown): value is string => 
  typeof value === 'string';

export const isNumber = (value: unknown): value is number => 
  typeof value === 'number' && !isNaN(value);

export const isBoolean = (value: unknown): value is boolean => 
  typeof value === 'boolean';

export const isObject = (value: unknown): value is Record<string, unknown> => 
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const isArray = (value: unknown): value is unknown[] => 
  Array.isArray(value);

// Entity type guards
export const isChallenge = (value: unknown): value is Challenge => {
  if (!isObject(value)) return false;
  
  return isString(value.id) &&
         isString(value.title) &&
         isString(value.description) &&
         isString(value.status) &&
         isString(value.priority) &&
         isString(value.sensitivity) &&
         isString(value.start_date) &&
         isString(value.end_date) &&
         isString(value.creator_id) &&
         isBoolean(value.is_active);
};

export const isIdea = (value: unknown): value is Idea => {
  if (!isObject(value)) return false;
  
  return isString(value.id) &&
         isString(value.title) &&
         isString(value.description) &&
         isString(value.status) &&
         isString(value.priority) &&
         isString(value.sensitivity) &&
         isString(value.innovator_id) &&
         isBoolean(value.is_featured) &&
         isBoolean(value.is_active);
};

export const isProfile = (value: unknown): value is Profile => {
  if (!isObject(value)) return false;
  
  return isString(value.id) &&
         isString(value.user_id) &&
         isString(value.first_name) &&
         isString(value.last_name) &&
         isString(value.role) &&
         isBoolean(value.is_active) &&
         isBoolean(value.email_verified);
};

export const isExpert = (value: unknown): value is Expert => {
  if (!isObject(value)) return false;
  
  return isString(value.id) &&
         isString(value.profile_id) &&
         isArray(value.expertise_areas) &&
         isArray(value.specializations) &&
         isNumber(value.years_of_experience) &&
         isString(value.bio) &&
         isString(value.availability_status) &&
         isBoolean(value.is_verified) &&
         isBoolean(value.is_active);
};

export const isPartner = (value: unknown): value is Partner => {
  if (!isObject(value)) return false;
  
  return isString(value.id) &&
         isString(value.name) &&
         isString(value.name_en) &&
         isString(value.type) &&
         isString(value.partnership_status) &&
         isString(value.partnership_type) &&
         isBoolean(value.is_featured) &&
         isBoolean(value.is_active);
};

export const isTeam = (value: unknown): value is Team => {
  if (!isObject(value)) return false;
  
  return isString(value.id) &&
         isString(value.name) &&
         isString(value.type) &&
         isString(value.status) &&
         isString(value.manager_id) &&
         isNumber(value.current_member_count) &&
         isBoolean(value.is_active);
};

export const isAssignment = (value: unknown): value is Assignment => {
  if (!isObject(value)) return false;
  
  return isString(value.id) &&
         isString(value.title) &&
         isString(value.description) &&
         isString(value.type) &&
         isString(value.status) &&
         isString(value.priority) &&
         isString(value.assignee_id) &&
         isString(value.assigner_id) &&
         isString(value.due_date) &&
         isNumber(value.progress_percentage) &&
         isBoolean(value.is_active);
};

export const isCampaign = (value: unknown): value is Campaign => {
  if (!isObject(value)) return false;
  
  return isString(value.id) &&
         isString(value.title) &&
         isString(value.description) &&
         isString(value.status) &&
         isString(value.type) &&
         isString(value.start_date) &&
         isString(value.end_date) &&
         isString(value.manager_id) &&
         isBoolean(value.is_featured) &&
         isBoolean(value.is_active);
};

export const isEvent = (value: unknown): value is Event => {
  if (!isObject(value)) return false;
  
  return isString(value.id) &&
         isString(value.title) &&
         isString(value.description) &&
         isString(value.type) &&
         isString(value.format) &&
         isString(value.status) &&
         isString(value.start_date) &&
         isString(value.end_date) &&
         isString(value.organizer_id) &&
         isBoolean(value.registration_required) &&
         isBoolean(value.is_featured) &&
         isBoolean(value.is_active);
};

export const isEvaluation = (value: unknown): value is Evaluation => {
  if (!isObject(value)) return false;
  
  return isString(value.id) &&
         isString(value.idea_id) &&
         isString(value.evaluator_id) &&
         isObject(value.criteria_scores) &&
         isNumber(value.overall_score) &&
         isString(value.feedback) &&
         isString(value.status) &&
         isString(value.evaluation_date) &&
         isBoolean(value.is_final) &&
         isBoolean(value.is_active);
};

export const isOpportunity = (value: unknown): value is Opportunity => {
  if (!isObject(value)) return false;
  
  return isString(value.id) &&
         isString(value.title) &&
         isString(value.description) &&
         isString(value.type) &&
         isString(value.status) &&
         isString(value.application_deadline) &&
         isBoolean(value.is_remote) &&
         isBoolean(value.is_featured) &&
         isBoolean(value.is_active);
};

export const isFocusQuestion = (value: unknown): value is FocusQuestion => {
  if (!isObject(value)) return false;
  
  return isString(value.id) &&
         isString(value.question_text) &&
         isString(value.question_type) &&
         isString(value.sensitivity) &&
         isNumber(value.display_order) &&
         isBoolean(value.is_required) &&
         isBoolean(value.is_active);
};

// System Lists type guards
export const isDepartment = (value: unknown): value is Department => {
  if (!isObject(value)) return false;
  
  return isString(value.id) &&
         isString(value.name) &&
         isString(value.name_en) &&
         isString(value.code) &&
         isBoolean(value.is_active);
};

export const isDeputy = (value: unknown): value is Deputy => {
  if (!isObject(value)) return false;
  
  return isString(value.id) &&
         isString(value.name) &&
         isString(value.name_en) &&
         isString(value.code) &&
         isBoolean(value.is_active);
};

export const isSector = (value: unknown): value is Sector => {
  if (!isObject(value)) return false;
  
  return isString(value.id) &&
         isString(value.name) &&
         isString(value.name_en) &&
         isString(value.code) &&
         isBoolean(value.is_active);
};

export const isDomain = (value: unknown): value is Domain => {
  if (!isObject(value)) return false;
  
  return isString(value.id) &&
         isString(value.name) &&
         isString(value.name_en) &&
         isString(value.code) &&
         isBoolean(value.is_active);
};

export const isSubDomain = (value: unknown): value is SubDomain => {
  if (!isObject(value)) return false;
  
  return isString(value.id) &&
         isString(value.name) &&
         isString(value.name_en) &&
         isString(value.code) &&
         isString(value.domain_id) &&
         isBoolean(value.is_active);
};

export const isService = (value: unknown): value is Service => {
  if (!isObject(value)) return false;
  
  return isString(value.id) &&
         isString(value.name) &&
         isString(value.name_en) &&
         isString(value.code) &&
         isBoolean(value.is_active);
};

// Array type guards
export const isChallengeArray = (value: unknown): value is Challenge[] => 
  isArray(value) && value.every(isChallenge);

export const isIdeaArray = (value: unknown): value is Idea[] => 
  isArray(value) && value.every(isIdea);

export const isProfileArray = (value: unknown): value is Profile[] => 
  isArray(value) && value.every(isProfile);

export const isExpertArray = (value: unknown): value is Expert[] => 
  isArray(value) && value.every(isExpert);

export const isPartnerArray = (value: unknown): value is Partner[] => 
  isArray(value) && value.every(isPartner);

export const isTeamArray = (value: unknown): value is Team[] => 
  isArray(value) && value.every(isTeam);

export const isAssignmentArray = (value: unknown): value is Assignment[] => 
  isArray(value) && value.every(isAssignment);

export const isCampaignArray = (value: unknown): value is Campaign[] => 
  isArray(value) && value.every(isCampaign);

export const isEventArray = (value: unknown): value is Event[] => 
  isArray(value) && value.every(isEvent);

export const isEvaluationArray = (value: unknown): value is Evaluation[] => 
  isArray(value) && value.every(isEvaluation);

export const isOpportunityArray = (value: unknown): value is Opportunity[] => 
  isArray(value) && value.every(isOpportunity);

export const isFocusQuestionArray = (value: unknown): value is FocusQuestion[] => 
  isArray(value) && value.every(isFocusQuestion);

// System Lists array type guards
export const isDepartmentArray = (value: unknown): value is Department[] => 
  isArray(value) && value.every(isDepartment);

export const isDeputyArray = (value: unknown): value is Deputy[] => 
  isArray(value) && value.every(isDeputy);

export const isSectorArray = (value: unknown): value is Sector[] => 
  isArray(value) && value.every(isSector);

export const isDomainArray = (value: unknown): value is Domain[] => 
  isArray(value) && value.every(isDomain);

export const isSubDomainArray = (value: unknown): value is SubDomain[] => 
  isArray(value) && value.every(isSubDomain);

export const isServiceArray = (value: unknown): value is Service[] => 
  isArray(value) && value.every(isService);