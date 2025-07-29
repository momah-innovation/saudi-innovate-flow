import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, Users, Target, Calendar, TrendingUp, 
  DollarSign, Award, Eye, Edit, Plus, Building
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AppShell } from '@/components/layout/AppShell';

interface PartnerStats {
  activeChallenges: number;
  supportedIdeas: number;
  totalInvestment: number;
  eventsSponsored: number;
  collaborations: number;
  successfulProjects: number;
}

interface Partnership {
  id: string;
  title: string;
  type: 'challenge' | 'event' | 'campaign';
  status: string;
  start_date: string;
  end_date?: string;
  contribution: number;
  description: string;
}

interface OpportunityItem {
  id: string;
  title: string;
  type: string;
  description: string;
  budget_range: string;
  deadline: string;
  status: string;
}

export default function PartnerDashboard() {
  const { userProfile } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<PartnerStats>({
    activeChallenges: 0,
    supportedIdeas: 0,
    totalInvestment: 0,
    eventsSponsored: 0,
    collaborations: 0,
    successfulProjects: 0
  });
  
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.id) {
      loadPartnerData();
    }
  }, [userProfile]);

  const loadPartnerData = async () => {
    try {
      setLoading(true);
      
      // Load partner-specific data
      const { data: partnerProfile } = await supabase
        .from('partners')
        .select('*')
        .eq('email', userProfile?.email)
        .single();

      if (!partnerProfile) {
        // No partner profile found, redirect to profile setup
        navigate('/partner-profile');
        return;
      }

      // Load partnership data
      const [
        challengePartnerships,
        eventPartnerships,
        campaignPartnerships
      ] = await Promise.all([
        supabase.from('challenge_partners').select('*').eq('partner_id', partnerProfile.id),
        supabase.from('event_partner_links').select('*').eq('partner_id', partnerProfile.id),
        supabase.from('campaign_partners').select('*').eq('partner_id', partnerProfile.id)
      ]);

      // Calculate stats
      const activeChallenges = challengePartnerships.data?.filter(p => p.status === 'active')?.length || 0;
      const eventsSponsored = eventPartnerships.data?.length || 0;
      const totalInvestment = campaignPartnerships.data?.reduce((sum, p) => sum + (p.contribution_amount || 0), 0) || 0;

      setStats({
        activeChallenges,
        supportedIdeas: Math.floor(Math.random() * 50) + 20, // Placeholder
        totalInvestment,
        eventsSponsored,
        collaborations: activeChallenges + eventsSponsored,
        successfulProjects: Math.floor(activeChallenges * 0.7) // Placeholder success rate
      });

      // Create partnerships list
      const partnershipsList: Partnership[] = [
        ...(challengePartnerships.data || []).map(p => ({
          id: p.id,
          title: 'Innovation Challenge Partnership',
          type: 'challenge' as const,
          status: p.status,
          start_date: p.partnership_start_date || p.created_at,
          end_date: p.partnership_end_date,
          contribution: p.funding_amount || 0,
          description: p.contribution_details || 'Challenge partnership'
        })),
        ...(campaignPartnerships.data || []).map(p => ({
          id: p.id,
          title: 'Campaign Partnership',
          type: 'campaign' as const,
          status: p.partnership_status,
          start_date: p.created_at,
          end_date: undefined,
          contribution: p.contribution_amount || 0,
          description: 'Campaign collaboration'
        }))
      ];

      setPartnerships(partnershipsList);

      // Mock opportunities data
      setOpportunities([
        {
          id: '1',
          title: 'Healthcare Innovation Challenge',
          type: 'Challenge Sponsorship',
          description: 'Lead sponsor for healthcare digitalization initiative',
          budget_range: '500,000 - 1,000,000 SAR',
          deadline: '2024-09-30',
          status: 'open'
        },
        {
          id: '2',
          title: 'EdTech Summit 2024',
          type: 'Event Partnership',
          description: 'Co-host annual education technology summit',
          budget_range: '200,000 - 400,000 SAR',
          deadline: '2024-08-15',
          status: 'open'
        },
        {
          id: '3',
          title: 'Green Innovation Campaign',
          type: 'Campaign Partnership',
          description: 'Support sustainable innovation initiatives',
          budget_range: '1,000,000 - 2,000,000 SAR',
          deadline: '2024-10-31',
          status: 'open'
        }
      ]);
      
    } catch (error) {
      console.error('Error loading partner data:', error);
      toast.error('Error loading partner dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getPartnershipStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default', text: 'Active' },
      completed: { variant: 'secondary', text: 'Completed' },
      pending: { variant: 'outline', text: 'Pending' },
      suspended: { variant: 'destructive', text: 'Suspended' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant as any}>{config.text}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'challenge': return <Target className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'campaign': return <Award className="w-4 h-4" />;
      default: return <Briefcase className="w-4 h-4" />;
    }
  };

  return (
    <AppShell>
      <PageLayout
        title="لوحة قيادة الشريك"
        description="أهلاً بك في نظام إدارة الشراكات والتعاون"
        className="space-y-6"
      >
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="partnerships" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            My Partnerships
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Opportunities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Partner Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Partnerships</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.collaborations}</div>
                <p className="text-xs text-muted-foreground">
                  ongoing collaborations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Supported Ideas</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.supportedIdeas}</div>
                <p className="text-xs text-muted-foreground">
                  innovation projects
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalInvestment.toLocaleString()} SAR</div>
                <p className="text-xs text-muted-foreground">
                  committed funding
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.activeChallenges > 0 ? Math.round((stats.successfulProjects / stats.activeChallenges) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  project success
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Partnership Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Partnership Impact</CardTitle>
                <CardDescription>Your contribution to innovation success</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Challenge Partnerships</span>
                    <span>{stats.activeChallenges}/10</span>
                  </div>
                  <Progress value={(stats.activeChallenges / 10) * 100} className="mt-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Event Sponsorships</span>
                    <span>{stats.eventsSponsored}/15</span>
                  </div>
                  <Progress value={(stats.eventsSponsored / 15) * 100} className="mt-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Ideas Supported</span>
                    <span>{stats.supportedIdeas}/100</span>
                  </div>
                  <Progress value={(stats.supportedIdeas / 100) * 100} className="mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>What would you like to do next?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={() => navigate('/partner-profile')} className="w-full justify-start">
                  <Edit className="w-4 h-4 mr-2" />
                  Update Partner Profile
                </Button>
                <Button onClick={() => navigate('/challenges')} variant="outline" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Browse Challenges
                </Button>
                <Button onClick={() => navigate('/events')} variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Events
                </Button>
                <Button onClick={() => navigate('/statistics')} variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Impact Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="partnerships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Partnerships</CardTitle>
              <CardDescription>Your current collaboration agreements</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : partnerships.length > 0 ? (
                <div className="space-y-4">
                  {partnerships.map((partnership) => (
                    <div key={partnership.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start space-x-3">
                        {getTypeIcon(partnership.type)}
                        <div>
                          <h4 className="font-medium">{partnership.title}</h4>
                          <p className="text-sm text-muted-foreground">{partnership.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              Started: {new Date(partnership.start_date).toLocaleDateString()}
                            </span>
                            {partnership.contribution > 0 && (
                              <>
                                <span className="text-xs">•</span>
                                <span className="text-xs text-muted-foreground">
                                  {partnership.contribution.toLocaleString()} SAR
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getPartnershipStatusBadge(partnership.status)}
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No active partnerships</h3>
                  <p className="text-muted-foreground mb-4">Start collaborating on innovation initiatives</p>
                  <Button onClick={() => navigate('/opportunities')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Explore Opportunities
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Partnership Opportunities</CardTitle>
              <CardDescription>New collaboration opportunities matching your interests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {opportunities.map((opportunity) => (
                  <div key={opportunity.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{opportunity.title}</h4>
                        <Badge variant="outline" className="mt-1">{opportunity.type}</Badge>
                      </div>
                      <Badge variant="default">Open</Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{opportunity.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        <span>{opportunity.budget_range}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm">
                        Express Interest
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </PageLayout>
    </AppShell>
  );
}