import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

interface Department {
  id: string;
  name: string;
  name_ar?: string;
  department_head?: string;
}

interface Deputy {
  id: string;
  name: string;
  name_ar?: string;
  deputy_minister?: string;
}

interface Sector {
  id: string;
  name: string;
  name_ar?: string;
}

interface Campaign {
  id: string;
  title_ar: string;
  status: string;
}

interface Challenge {
  id: string;
  title_ar: string;
  status: string;
}

interface TeamMember {
  id: string;
  user_id: string;
  status: string;
  [key: string]: unknown; // Allow additional fields from the table
}

export function useOrganizationalData() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [deputies, setDeputies] = useState<Deputy[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name, name_ar, department_head')
        .order('name');
      
      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      logger.error('Failed to fetch departments', { component: 'useOrganizationalData', action: 'fetchDepartments' }, error as Error);
    }
  };

  const fetchDeputies = async () => {
    try {
      const { data, error } = await supabase
        .from('deputies')
        .select('id, name, name_ar, deputy_minister')
        .order('name');
      
      if (error) throw error;
      setDeputies(data || []);
    } catch (error) {
      logger.error('Failed to fetch deputies', { component: 'useOrganizationalData', action: 'fetchDeputies' }, error as Error);
    }
  };

  const fetchSectors = async () => {
    try {
      const { data, error } = await supabase
        .from('sectors')
        .select('id, name, name_ar')
        .order('name');
      
      if (error) throw error;
      setSectors(data || []);
    } catch (error) {
      logger.error('Failed to fetch sectors', { component: 'useOrganizationalData', action: 'fetchSectors' }, error as Error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, title_ar, status')
        .in('status', ['active', 'planning', 'ongoing'])
        .order('title_ar');
      
      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      logger.error('Failed to fetch campaigns', { component: 'useOrganizationalData', action: 'fetchCampaigns' }, error as Error);
    }
  };

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('id, title_ar, status')
        .in('status', ['active', 'draft', 'published'])
        .order('title_ar');
      
      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      logger.error('Failed to fetch challenges', { component: 'useOrganizationalData', action: 'fetchChallenges' }, error as Error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('innovation_team_members')
        .select('*')
        .eq('status', 'active')
        .limit(50);
      
      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      logger.error('Failed to fetch team members', { component: 'useOrganizationalData', action: 'fetchTeamMembers' }, error as Error);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDepartments(),
        fetchDeputies(),
        fetchSectors(),
        fetchCampaigns(),
        fetchChallenges(),
        fetchTeamMembers()
      ]);
    } catch (error) {
      logger.error('Failed to fetch organizational data', { component: 'useOrganizationalData', action: 'fetchOrganizationalData' }, error as Error);
      toast({
        title: 'Error loading data',
        description: 'Failed to load organizational data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    departments,
    deputies,
    sectors,
    campaigns,
    challenges,
    teamMembers,
    loading,
    refetch: fetchAllData,
    fetchDepartments,
    fetchDeputies,
    fetchSectors,
    fetchCampaigns,
    fetchChallenges,
    fetchTeamMembers
  };
}