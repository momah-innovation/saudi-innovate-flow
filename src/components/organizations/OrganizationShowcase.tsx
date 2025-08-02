import React, { useState, useEffect } from 'react';
import { Users, Building, Globe, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamProfileCard } from '@/components/teams/TeamProfileCard';
import { PartnerProfileCard } from '@/components/partners/PartnerProfileCard';
import { SectorProfileCard } from '@/components/sectors/SectorProfileCard';
import { toast } from 'sonner';

interface Team {
  id: string;
  name: string;
  name_ar?: string;
  description?: string;
  logo_url?: string;
  focus_area?: string;
  department?: string;
  status?: string;
  max_members?: number;
}

interface Partner {
  id: string;
  name: string;
  name_ar?: string;
  partner_type?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  logo_url?: string;
  capabilities?: string[];
  funding_capacity?: number;
  status?: string;
}

interface Sector {
  id: string;
  name: string;
  name_ar?: string;
  description?: string;
  vision_2030_alignment?: string;
  image_url?: string;
}

export function OrganizationShowcase() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('teams');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('innovation_teams')
        .select('*')
        .order('name');

      if (teamsError) throw teamsError;

      // Load partners
      const { data: partnersData, error: partnersError } = await supabase
        .from('partners')
        .select('*')
        .order('name');

      if (partnersError) throw partnersError;

      // Load sectors
      const { data: sectorsData, error: sectorsError } = await supabase
        .from('sectors')
        .select('*')
        .order('name');

      if (sectorsError) throw sectorsError;

      setTeams(teamsData || []);
      setPartners(partnersData || []);
      setSectors(sectorsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error loading organization data');
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.name_ar?.includes(searchTerm) ||
                         team.focus_area?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || team.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.name_ar?.includes(searchTerm) ||
                         partner.partner_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || partner.partner_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredSectors = sectors.filter(sector => {
    const matchesSearch = sector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sector.name_ar?.includes(searchTerm);
    return matchesSearch;
  });

  const handleViewDetails = (type: string, id: string) => {
    // This would navigate to detailed profile pages
    // Navigate to detailed profile pages
    toast.info(`Opening ${type} profile page - Feature coming soon!`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getFilterOptions = () => {
    switch (activeTab) {
      case 'teams':
        return [
          { value: 'all', label: 'All Status' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'forming', label: 'Forming' }
        ];
      case 'partners':
        return [
          { value: 'all', label: 'All Types' },
          { value: 'corporate', label: 'Corporate' },
          { value: 'academic', label: 'Academic' },
          { value: 'government', label: 'Government' },
          { value: 'technology', label: 'Technology' },
          { value: 'media', label: 'Media' }
        ];
      default:
        return [{ value: 'all', label: 'All' }];
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Organization Directory</h1>
        <p className="text-muted-foreground">
          Explore our innovation ecosystem - teams, partners, and sectors
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by..." />
          </SelectTrigger>
          <SelectContent>
            {getFilterOptions().map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Innovation Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
            <p className="text-xs text-muted-foreground">
              {teams.filter(t => t.status === 'active').length} active teams
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Strategic Partners</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partners.length}</div>
            <p className="text-xs text-muted-foreground">
              {partners.filter(p => p.status === 'active').length} active partnerships
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Focus Sectors</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sectors.length}</div>
            <p className="text-xs text-muted-foreground">
              Vision 2030 aligned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Organization Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="teams">Innovation Teams</TabsTrigger>
          <TabsTrigger value="partners">Strategic Partners</TabsTrigger>
          <TabsTrigger value="sectors">Focus Sectors</TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <TeamProfileCard
                key={team.id}
                team={team}
                onViewDetails={(id) => handleViewDetails('team', id)}
              />
            ))}
          </div>
          {filteredTeams.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No teams found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="partners" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((partner) => (
              <PartnerProfileCard
                key={partner.id}
                partner={partner}
                onViewDetails={(id) => handleViewDetails('partner', id)}
              />
            ))}
          </div>
          {filteredPartners.length === 0 && (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No partners found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sectors" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSectors.map((sector) => (
              <SectorProfileCard
                key={sector.id}
                sector={sector}
                onViewDetails={(id) => handleViewDetails('sector', id)}
              />
            ))}
          </div>
          {filteredSectors.length === 0 && (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No sectors found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}