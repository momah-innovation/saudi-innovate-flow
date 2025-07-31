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
import { useDirection } from '@/components/ui/direction-provider';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AppShell } from '@/components/layout/AppShell';
import { EnhancedPartnerDashboardHero } from '@/components/partners/EnhancedPartnerDashboardHero';

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
  const { t, isRTL } = useTranslation();
  const { direction } = useDirection();
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
        // No partner profile found, show demo data for admin/testing
        console.log('No partner profile found, using demo data');
        
        // Set demo stats for testing
        setStats({
          activeChallenges: 5,
          supportedIdeas: 32,
          totalInvestment: 750000,
          eventsSponsored: 8,
          collaborations: 13,
          successfulProjects: 4
        });
        
        // Demo partnerships
        setPartnerships([
          {
            id: 'demo-1',
            title: 'AI Innovation Challenge Partnership',
            type: 'challenge' as const,
            status: 'active',
            start_date: '2024-01-15',
            end_date: '2024-08-30',
            contribution: 250000,
            description: 'Supporting AI-driven healthcare solutions'
          },
          {
            id: 'demo-2',
            title: 'Smart City Campaign',
            type: 'campaign' as const,
            status: 'active', 
            start_date: '2024-03-01',
            contribution: 500000,
            description: 'Urban innovation and sustainability initiative'
          }
        ]);
        
        setLoading(false);
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
      <EnhancedPartnerDashboardHero
        userProfile={userProfile}
        stats={{
          activePartnerships: partnerships.length,
          supportedProjects: stats.supportedIdeas,
          totalInvestment: stats.totalInvestment,
          partnershipScore: Math.floor(Math.random() * 30) + 70
        }}
        onNavigate={navigate}
        onCreatePartnership={() => {
          navigate('/partner-profile');
        }}
        onShowOpportunities={() => {
          // Switch to opportunities tab
        }}
      />
      
      <PageLayout
        title={t('partnerDashboard')}
        description={t('partnerDashboardDesc')}
        className="space-y-6"
      >
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className={`grid w-full grid-cols-3 ${isRTL ? 'rtl' : 'ltr'}`}>
          <TabsTrigger value="overview" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <TrendingUp className="w-4 h-4" />
            {t('overview')}
          </TabsTrigger>
          <TabsTrigger value="partnerships" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <Briefcase className="w-4 h-4" />
            {t('myPartnerships')}
          </TabsTrigger>
          <TabsTrigger value="opportunities" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <Plus className="w-4 h-4" />
            {t('newOpportunities')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Partner Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <CardTitle className={`text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('activePartnerships')}</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>{stats.collaborations}</div>
                <p className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('ongoingCollaborations')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <CardTitle className={`text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('supportedIdeas')}</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>{stats.supportedIdeas}</div>
                <p className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('innovationProjects')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <CardTitle className={`text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('totalInvestment')}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>{stats.totalInvestment.toLocaleString()} {t('currency')}</div>
                <p className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('committedFunding')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <CardTitle className={`text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('successRate')}</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
                  {stats.activeChallenges > 0 ? Math.round((stats.successfulProjects / stats.activeChallenges) * 100) : 0}%
                </div>
                <p className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('projectSuccess')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Partnership Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className={isRTL ? 'text-right' : 'text-left'}>{t('partnershipImpact')}</CardTitle>
                <CardDescription className={isRTL ? 'text-right' : 'text-left'}>{t('partnershipImpactDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className={isRTL ? 'text-right' : 'text-left'}>{t('challengePartnerships')}</span>
                    <span>{stats.activeChallenges}/10</span>
                  </div>
                  <Progress value={(stats.activeChallenges / 10) * 100} className="mt-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className={isRTL ? 'text-right' : 'text-left'}>{t('eventSponsorships')}</span>
                    <span>{stats.eventsSponsored}/15</span>
                  </div>
                  <Progress value={(stats.eventsSponsored / 15) * 100} className="mt-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className={isRTL ? 'text-right' : 'text-left'}>{t('ideasSupported')}</span>
                    <span>{stats.supportedIdeas}/100</span>
                  </div>
                  <Progress value={(stats.supportedIdeas / 100) * 100} className="mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className={isRTL ? 'text-right' : 'text-left'}>{t('quickActions')}</CardTitle>
                <CardDescription className={isRTL ? 'text-right' : 'text-left'}>{t('quickActionsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={() => navigate('/partner-profile')} className={`w-full ${isRTL ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
                  <Edit className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('updatePartnerProfile')}
                </Button>
                <Button onClick={() => navigate('/challenges')} variant="outline" className={`w-full ${isRTL ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
                  <Target className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('browseChallenges')}
                </Button>
                <Button onClick={() => navigate('/events')} variant="outline" className={`w-full ${isRTL ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
                  <Calendar className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('viewEvents')}
                </Button>
                <Button onClick={() => navigate('/statistics')} variant="outline" className={`w-full ${isRTL ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
                  <TrendingUp className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('viewImpactAnalytics')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="partnerships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className={isRTL ? 'text-right' : 'text-left'}>{t('activePartnerships')}</CardTitle>
              <CardDescription className={isRTL ? 'text-right' : 'text-left'}>{t('currentCollaborationAgreements')}</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className={`text-center py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('loading')}</div>
              ) : partnerships.length > 0 ? (
                <div className="space-y-4">
                  {partnerships.map((partnership) => (
                    <div key={partnership.id} className={`flex items-center justify-between p-4 border rounded-lg ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`flex items-start ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                        {getTypeIcon(partnership.type)}
                        <div>
                          <h4 className={`font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{partnership.title}</h4>
                          <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>{partnership.description}</p>
                          <div className={`flex items-center gap-2 mt-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                            <span className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                              {t('started')}: {new Date(partnership.start_date).toLocaleDateString()}
                            </span>
                            {partnership.contribution > 0 && (
                              <>
                                <span className="text-xs">•</span>
                                <span className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                                  {partnership.contribution.toLocaleString()} {t('currency')}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                        {getPartnershipStatusBadge(partnership.status)}
                        <Button size="sm" variant="outline" className={isRTL ? 'flex-row-reverse' : 'flex-row'}>
                          <Eye className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                          {t('viewDetails')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">{t('noActivePartnerships')}</h3>
                  <p className="text-muted-foreground mb-4">{t('startCollaborating')}</p>
                  <Button onClick={() => navigate('/opportunities')} className={isRTL ? 'flex-row-reverse' : 'flex-row'}>
                    <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('exploreOpportunities')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className={isRTL ? 'text-right' : 'text-left'}>{t('partnershipOpportunities')}</CardTitle>
              <CardDescription className={isRTL ? 'text-right' : 'text-left'}>{t('collaborationOpportunitiesDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {opportunities.map((opportunity) => (
                  <div key={opportunity.id} className="p-4 border rounded-lg">
                    <div className={`flex justify-between items-start mb-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <h4 className="font-medium">{opportunity.title}</h4>
                        <Badge variant="outline" className="mt-1">{opportunity.type}</Badge>
                      </div>
                      <Badge variant="default">{t('open')}</Badge>
                    </div>
                    
                    <p className={`text-sm text-muted-foreground mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>{opportunity.description}</p>
                    
                    <div className={`flex items-center gap-4 text-xs text-muted-foreground mb-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                        <DollarSign className="w-3 h-3" />
                        <span>{opportunity.budget_range}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                        <Calendar className="w-3 h-3" />
                        <span>{t('deadline')}: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Button size="sm">
                        {t('expressInterest')}
                      </Button>
                      <Button size="sm" variant="outline" className={isRTL ? 'flex-row-reverse' : 'flex-row'}>
                        <Eye className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                        {t('viewDetails')}
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