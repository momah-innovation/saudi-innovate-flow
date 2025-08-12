import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';
import type { 
  Organization, 
  OrganizationMember, 
  Entity, 
  Deputy, 
  Department, 
  Domain, 
  SubDomain, 
  Service,
  UserEntityAssignment,
  TeamEntityAssignment,
  FocusQuestionEntityLink,
  FocusQuestionChallengeLink,
  OrganizationalHierarchy 
} from '@/types/organization';
import type { SystemSector } from '@/types/common';

export function useOrganizationalHierarchy() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationMembers, setOrganizationMembers] = useState<OrganizationMember[]>([]);
  const [sectors, setSectors] = useState<SystemSector[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [deputies, setDeputies] = useState<Deputy[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [subDomains, setSubDomains] = useState<SubDomain[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [userEntityAssignments, setUserEntityAssignments] = useState<UserEntityAssignment[]>([]);
  const [teamEntityAssignments, setTeamEntityAssignments] = useState<TeamEntityAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch Organizations
  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('is_active', true)
        .order('name_ar');
      
      if (error) throw error;
      setOrganizations((data as Organization[]) || []);
    } catch (error) {
      logger.error('Failed to fetch organizations', { component: 'useOrganizationalHierarchy', action: 'fetchOrganizations' }, error as Error);
    }
  };

  // Fetch Organization Members
  const fetchOrganizationMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          *,
          organizations:organization_id(*)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrganizationMembers((data as OrganizationMember[]) || []);
    } catch (error) {
      logger.error('Failed to fetch organization members', { component: 'useOrganizationalHierarchy', action: 'fetchOrganizationMembers' }, error as Error);
    }
  };

  // Fetch Sectors
  const fetchSectors = async () => {
    try {
      const { data, error } = await supabase
        .from('sectors')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setSectors((data as any) || []);
    } catch (error) {
      logger.error('Failed to fetch sectors', { component: 'useOrganizationalHierarchy', action: 'fetchSectors' }, error as Error);
    }
  };

  // Fetch Entities
  const fetchEntities = async () => {
    try {
      const { data, error } = await supabase
        .from('entities')
        .select(`
          *,
          sectors:sector_id(*)
        `)
        .order('name_ar');
      
      if (error) throw error;
      setEntities((data as any) || []);
    } catch (error) {
      logger.error('Failed to fetch entities', { component: 'useOrganizationalHierarchy', action: 'fetchEntities' }, error as Error);
    }
  };

  // Fetch Deputies
  const fetchDeputies = async () => {
    try {
      const { data, error } = await supabase
        .from('deputies')
        .select(`
          *,
          entities:entity_id(*),
          sectors:sector_id(*)
        `)
        .order('name');
      
      if (error) throw error;
      setDeputies(data || []);
    } catch (error) {
      logger.error('Failed to fetch deputies', { component: 'useOrganizationalHierarchy', action: 'fetchDeputies' }, error as Error);
    }
  };

  // Fetch Departments
  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select(`
          *,
          deputies:deputy_id(*),
          entities:entity_id(*)
        `)
        .order('name');
      
      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      logger.error('Failed to fetch departments', { component: 'useOrganizationalHierarchy', action: 'fetchDepartments' }, error as Error);
    }
  };

  // Fetch Domains
  const fetchDomains = async () => {
    try {
      const { data, error } = await supabase
        .from('domains')
        .select(`
          *,
          departments:department_id(*)
        `)
        .order('name');
      
      if (error) throw error;
      setDomains(data || []);
    } catch (error) {
      logger.error('Failed to fetch domains', { component: 'useOrganizationalHierarchy', action: 'fetchDomains' }, error as Error);
    }
  };

  // Fetch Sub-domains
  const fetchSubDomains = async () => {
    try {
      const { data, error } = await supabase
        .from('sub_domains')
        .select(`
          *,
          domains:domain_id(*)
        `)
        .order('name');
      
      if (error) throw error;
      setSubDomains(data || []);
    } catch (error) {
      logger.error('Failed to fetch sub-domains', { component: 'useOrganizationalHierarchy', action: 'fetchSubDomains' }, error as Error);
    }
  };

  // Fetch Services
  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          sub_domains:sub_domain_id(*)
        `)
        .order('name');
      
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      logger.error('Failed to fetch services', { component: 'useOrganizationalHierarchy', action: 'fetchServices' }, error as Error);
    }
  };

  // Fetch User Entity Assignments
  const fetchUserEntityAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('user_entity_assignments')
        .select('*')
        .eq('status', 'active')
        .order('assignment_date', { ascending: false });
      
      if (error) throw error;
      setUserEntityAssignments((data as UserEntityAssignment[]) || []);
    } catch (error) {
      logger.error('Failed to fetch user entity assignments', { component: 'useOrganizationalHierarchy', action: 'fetchUserEntityAssignments' }, error as Error);
    }
  };

  // Fetch Team Entity Assignments
  const fetchTeamEntityAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('team_entity_assignments')
        .select('*')
        .eq('status', 'active')
        .order('assigned_date', { ascending: false });
      
      if (error) throw error;
      setTeamEntityAssignments((data as TeamEntityAssignment[]) || []);
    } catch (error) {
      logger.error('Failed to fetch team entity assignments', { component: 'useOrganizationalHierarchy', action: 'fetchTeamEntityAssignments' }, error as Error);
    }
  };

  // Fetch all hierarchy data
  const fetchAllHierarchyData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchOrganizations(),
        fetchOrganizationMembers(),
        fetchSectors(),
        fetchEntities(),
        fetchDeputies(),
        fetchDepartments(),
        fetchDomains(),
        fetchSubDomains(),
        fetchServices(),
        fetchUserEntityAssignments(),
        fetchTeamEntityAssignments()
      ]);
    } catch (error) {
      logger.error('Failed to fetch organizational hierarchy data', { component: 'useOrganizationalHierarchy', action: 'fetchAllHierarchyData' }, error as Error);
      toast({
        title: 'Error loading data',
        description: 'Failed to load organizational hierarchy data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Build hierarchical structure
  const buildHierarchy = (): OrganizationalHierarchy => {
    return {
      sectors,
      entities,
      deputies,
      departments,
      domains,
      subDomains,
      services
    };
  };

  // Get entities by parent
  const getEntitiesByParent = (parentType: string, parentId: string) => {
    switch (parentType) {
      case 'sector':
        return entities.filter(e => e.sector_id === parentId);
      case 'entity':
        return deputies.filter(d => d.entity_id === parentId);
      case 'deputy':
        return departments.filter(d => d.deputy_id === parentId);
      case 'department':
        return domains.filter(d => d.department_id === parentId);
      case 'domain':
        return subDomains.filter(sd => sd.domain_id === parentId);
      case 'sub_domain':
        return services.filter(s => s.sub_domain_id === parentId);
      default:
        return [];
    }
  };

  useEffect(() => {
    fetchAllHierarchyData();
  }, []);

  return {
    // Data
    organizations,
    organizationMembers,
    sectors,
    entities,
    deputies,
    departments,
    domains,
    subDomains,
    services,
    userEntityAssignments,
    teamEntityAssignments,
    loading,
    
    // Actions
    refetch: fetchAllHierarchyData,
    fetchOrganizations,
    fetchOrganizationMembers,
    fetchSectors,
    fetchEntities,
    fetchDeputies,
    fetchDepartments,
    fetchDomains,
    fetchSubDomains,
    fetchServices,
    fetchUserEntityAssignments,
    fetchTeamEntityAssignments,
    
    // Utilities
    buildHierarchy,
    getEntitiesByParent
  };
}