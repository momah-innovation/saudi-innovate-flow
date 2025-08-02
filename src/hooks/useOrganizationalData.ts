import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  [key: string]: any; // Allow any additional fields from the table
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
      console.error('Error fetching departments:', error);
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
      console.error('Error fetching deputies:', error);
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
      console.error('Error fetching sectors:', error);
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
      console.error('Error fetching campaigns:', error);
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
      console.error('Error fetching challenges:', error);
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
      console.error('Error fetching team members:', error);
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
      console.error('Error fetching organizational data:', error);
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