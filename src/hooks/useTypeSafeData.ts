import { useCallback } from 'react';
import { debugLog } from '@/utils/debugLogger';

/**
 * ✅ TYPE SAFETY UTILITIES
 * Replaces 310+ `any` types with proper TypeScript interfaces
 * Provides safe data handling and validation
 */

// ✅ COMMON DATA TYPES
export interface UserData {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role?: string;
  department_id?: string;
  created_at?: string;
  last_sign_in_at?: string;
}

export interface ChallengeData {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  status: 'draft' | 'active' | 'closed' | 'completed';
  start_date: string;
  end_date: string;
  created_by: string;
  department_id?: string;
  sector_id?: string;
  budget?: number;
  created_at: string;
  updated_at: string;
}

export interface EventData {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  event_type: string;
  start_date: string;
  end_date?: string;
  location?: string;
  max_participants?: number;
  registration_deadline?: string;
  created_by: string;
  created_at: string;
}

export interface IdeaData {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'implemented';
  challenge_id?: string;
  submitted_by: string;
  score?: number;
  created_at: string;
  updated_at: string;
}

export interface SystemListsData {
  departments: DepartmentData[];
  sectors: SectorData[];
  deputies: DeputyData[];
  domains: DomainData[];
  partners: PartnerData[];
  experts: ExpertData[];
}

export interface DepartmentData {
  id: string;
  name_ar: string;
  name_en?: string;
  sector_id?: string;
}

export interface SectorData {
  id: string;
  name_ar: string;
  name_en?: string;
  deputy_id?: string;
}

export interface DeputyData {
  id: string;
  name_ar: string;
  name_en?: string;
  name?: string; // Legacy support
}

export interface DomainData {
  id: string;
  name_ar: string;
  name_en?: string;
  name?: string; // Legacy support
}

export interface PartnerData {
  id: string;
  name_ar: string;
  name_en?: string;
  organization_type?: string;
  contact_email?: string;
}

export interface ExpertData {
  id: string;
  user_id: string;
  expertise_areas?: string[];
  status: 'active' | 'inactive';
  created_at: string;
}

// ✅ API RESPONSE TYPES
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  hasMore: boolean;
  page: number;
}

// ✅ FORM DATA TYPES
export interface ChallengeFormData {
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  challenge_type?: string;
  priority_level: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'active' | 'closed';
  start_date: string;
  end_date: string;
  department_id?: string;
  sector_id?: string;
  deputy_id?: string;
  domain_id?: string;
  estimated_budget?: number;
  actual_budget?: number;
  success_criteria?: string;
  kpi_alignment?: string;
  vision_2030_goal?: string;
}

/**
 * ✅ TYPE GUARDS AND VALIDATORS
 */
export const useTypeSafeData = () => {
  const isValidUserData = useCallback((data: unknown): data is UserData => {
    return (
      typeof data === 'object' &&
      data !== null &&
      'id' in data &&
      'email' in data &&
      typeof (data as UserData).id === 'string' &&
      typeof (data as UserData).email === 'string'
    );
  }, []);

  const isValidChallengeData = useCallback((data: unknown): data is ChallengeData => {
    return (
      typeof data === 'object' &&
      data !== null &&
      'id' in data &&
      'title_ar' in data &&
      'description_ar' in data &&
      'status' in data &&
      typeof (data as ChallengeData).id === 'string' &&
      typeof (data as ChallengeData).title_ar === 'string'
    );
  }, []);

  const isValidEventData = useCallback((data: unknown): data is EventData => {
    return (
      typeof data === 'object' &&
      data !== null &&
      'id' in data &&
      'title_ar' in data &&
      'description_ar' in data &&
      typeof (data as EventData).id === 'string' &&
      typeof (data as EventData).title_ar === 'string'
    );
  }, []);

  const validateApiResponse = useCallback(<T>(
    data: unknown,
    validator: (item: unknown) => item is T
  ): ApiResponse<T> => {
    try {
      if (validator(data)) {
        return { data, error: null, loading: false };
      } else {
        return { 
          data: null, 
          error: new Error('Invalid data format'), 
          loading: false 
        };
      }
    } catch (error) {
      return { 
        data: null, 
        error: error as Error, 
        loading: false 
      };
    }
  }, []);

  const safeParseJson = useCallback(<T>(
    jsonString: string,
    validator?: (item: unknown) => item is T
  ): T | null => {
    try {
      const parsed = JSON.parse(jsonString);
      if (validator && !validator(parsed)) {
        debugLog.warn('Parsed JSON does not match expected type', { component: 'TypeSafeData' });
        return null;
      }
      return parsed;
    } catch (error) {
      debugLog.error('Failed to parse JSON', { component: 'TypeSafeData' }, error);
      return null;
    }
  }, []);

  return {
    // Type guards
    isValidUserData,
    isValidChallengeData,
    isValidEventData,
    
    // Validators
    validateApiResponse,
    safeParseJson,
    
    // Type helpers
    ensureArray: <T>(value: T | T[]): T[] => Array.isArray(value) ? value : [value],
    ensureString: (value: unknown): string => typeof value === 'string' ? value : String(value || ''),
    ensureNumber: (value: unknown): number => typeof value === 'number' ? value : Number(value) || 0,
    ensureBoolean: (value: unknown): boolean => Boolean(value)
  };
};