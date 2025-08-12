/**
 * Organization and Entity Management Types
 */

import { BaseEntity } from './common';

// Organizational Hierarchy Types
export interface Organization extends BaseEntity {
  name_ar: string;
  name_en?: string;
  organization_type: 'government' | 'private' | 'ngo' | 'academic';
  description_ar?: string;
  description_en?: string;
  website_url?: string;
  contact_email?: string;
  contact_phone?: string;
  address_ar?: string;
  address_en?: string;
  is_active: boolean;
}

export interface OrganizationMember extends BaseEntity {
  organization_id: string;
  user_id: string;
  member_role: string;
  department?: string;
  position?: string;
  join_date: string;
  status: 'active' | 'inactive' | 'pending';
  permissions: Record<string, any>;
  organization?: Organization;
}

// Entity Hierarchy Types (Sectors > Entities > Deputies > Departments > Domains > Sub-domains > Services)
export interface Entity extends BaseEntity {
  name_ar: string;
  name_en?: string;
  description_ar?: string;
  description_en?: string;
  sector_id?: string;
  entity_type: string;
  entity_head?: string;
  budget_allocation?: number;
  is_active: boolean;
  sector?: SystemSector;
}

export interface Deputy extends BaseEntity {
  name: string;
  name_ar?: string;
  entity_id?: string;
  sector_id?: string;
  deputy_minister?: string;
  entity?: Entity;
  sector?: SystemSector;
}

export interface Department extends BaseEntity {
  name: string;
  name_ar?: string;
  name_en?: string;
  deputy_id?: string;
  entity_id?: string;
  department_head?: string;
  budget_allocation?: number;
  deputy?: Deputy;
  entity?: Entity;
}

export interface Domain extends BaseEntity {
  name: string;
  name_ar?: string;
  name_en?: string;
  department_id?: string;
  domain_head?: string;
  department?: Department;
}

export interface SubDomain extends BaseEntity {
  name: string;
  name_ar?: string;
  name_en?: string;
  domain_id?: string;
  sub_domain_head?: string;
  domain?: Domain;
}

export interface Service extends BaseEntity {
  name: string;
  name_ar?: string;
  name_en?: string;
  sub_domain_id?: string;
  service_head?: string;
  service_type?: string;
  sub_domain?: SubDomain;
}

// Assignment and Link Types
export interface UserEntityAssignment extends BaseEntity {
  user_id: string;
  entity_type: 'sector' | 'entity' | 'deputy' | 'department' | 'domain' | 'sub_domain' | 'service';
  entity_id: string;
  assignment_role: 'manager' | 'coordinator' | 'member' | 'observer';
  assigned_by?: string;
  assignment_date: string;
  status: 'active' | 'inactive' | 'pending';
  permissions: Record<string, any>;
}

export interface TeamEntityAssignment extends BaseEntity {
  team_id: string;
  entity_type: 'sector' | 'entity' | 'deputy' | 'department' | 'domain' | 'sub_domain' | 'service';
  entity_id: string;
  assignment_type: 'lead' | 'support' | 'consultant';
  assigned_date: string;
  status: 'active' | 'inactive';
}

export interface FocusQuestionEntityLink extends BaseEntity {
  focus_question_id: string;
  entity_type: 'sector' | 'entity' | 'deputy' | 'department' | 'domain' | 'sub_domain' | 'service';
  entity_id: string;
}

export interface FocusQuestionChallengeLink extends BaseEntity {
  focus_question_id: string;
  challenge_id: string;
  relevance_score: number;
}

// Manager Role Types
export type EntityManagerRole = 
  | 'entity_manager'
  | 'deputy_manager' 
  | 'department_head'
  | 'domain_manager'
  | 'sub_domain_manager'
  | 'service_manager';

// Utility Types
export interface OrganizationalHierarchy {
  sectors: SystemSector[];
  entities: Entity[];
  deputies: Deputy[];
  departments: Department[];
  domains: Domain[];
  subDomains: SubDomain[];
  services: Service[];
}

export interface EntityWithChildren {
  entity: Entity | Deputy | Department | Domain | SubDomain | Service;
  children: EntityWithChildren[];
  assignments?: UserEntityAssignment[];
  teamAssignments?: TeamEntityAssignment[];
}

// Import and re-export from common types
import type { SystemSector } from './common';
export type { SystemSector } from './common';