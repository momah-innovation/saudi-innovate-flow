import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, Users, Target, Calendar, TrendingUp, 
  DollarSign, Award, Eye, Edit, Plus, Building, FileText
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
import { PartnershipDetailDialog } from '@/components/partners/PartnershipDetailDialog';
import { OpportunityDetailDialog } from '@/components/partners/OpportunityDetailDialog';
import { PartnershipApplicationsTable } from '@/components/partners/PartnershipApplicationsTable';

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

interface ApplicationItem {
  id: string;
  company_name: string;
  contact_person: string;
  contact_email?: string;
  proposed_contribution: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submitted_at: string;
  reviewer_notes?: string;
  partnership_opportunities?: {
    title_ar: string;
    opportunity_type: string;
  };
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
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartnership, setSelectedPartnership] = useState<Partnership | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [showPartnershipDialog, setShowPartnershipDialog] = useState(false);
  const [showOpportunityDialog, setShowOpportunityDialog] = useState(false);

  useEffect(() => {
    if (userProfile?.id) {
      loadPartnerData();
    }
  }, [userProfile]);

  const loadPartnerData = async () => {
    try {
      setLoading(true);
      
      // Load partnership opportunities
      const { data: opportunities } = await supabase
        .from('partnership_opportunities')
        .select('*')
        .eq('status', 'open')
        .order('deadline', { ascending: true });

      if (opportunities) {
        const formattedOpportunities = opportunities.map(opp => ({
          id: opp.id,
          title: opp.title_ar,
          type: opp.opportunity_type,
          description: opp.description_ar,
          budget_range: opp.budget_min && opp.budget_max ? 
            `${opp.budget_min.toLocaleString()} - ${opp.budget_max.toLocaleString()} ${t('currency')}` : 
            t('contactForDetails'),
          deadline: opp.deadline,
          status: opp.status
        }));
        setOpportunities(formattedOpportunities);
      }

      // Load user's applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('partnership_applications')
        .select(`
          *,
          opportunities(title_ar, opportunity_type)
        `)
        .eq('applicant_user_id', userProfile?.id)
        .order('submitted_at', { ascending: false });

      console.log('Applications loaded:', applicationsData);
      console.log('Applications error:', applicationsError);
      
      // Transform the applications data to match our interface
      const transformedApplications: ApplicationItem[] = (applicationsData || []).map((app: any) => ({
        id: app.id,
        company_name: app.company_name,
        contact_person: app.contact_person,
        contact_email: app.contact_email,
        proposed_contribution: app.proposed_contribution,
        status: app.status as 'pending' | 'under_review' | 'approved' | 'rejected',
        submitted_at: app.submitted_at,
        reviewer_notes: app.reviewer_notes,
        partnership_opportunities: (app.opportunities && !applicationsError && typeof app.opportunities === 'object' && app.opportunities.title_ar) ? app.opportunities : undefined
      }));
      
      setApplications(transformedApplications);

      // For partnerships tab - get existing challenge/campaign partnerships
      const [
        challengePartnerships,
        campaignPartnerships
      ] = await Promise.all([
        supabase.from('challenge_partners').select(`
          *,
          challenges(title_ar, status)
        `).eq('partner_id', userProfile?.id || ''),
        supabase.from('campaign_partners').select(`
          *,
          campaigns(title_ar, status)
        `).eq('partner_id', userProfile?.id || '')
      ]);

      // Create partnerships list from existing data
      const partnershipsList: Partnership[] = [
        ...(challengePartnerships.data || []).map(p => ({
          id: p.id,
          title: p.challenges?.title_ar || 'Challenge Partnership',
          type: 'challenge' as const,
          status: p.status,
          start_date: p.partnership_start_date || p.created_at,
          end_date: p.partnership_end_date,
          contribution: p.funding_amount || 0,
          description: p.contribution_details || 'Challenge partnership'
        })),
        ...(campaignPartnerships.data || []).map(p => ({
          id: p.id,
          title: p.campaigns?.title_ar || 'Campaign Partnership',
          type: 'campaign' as const,
          status: p.partnership_status,
          start_date: p.created_at,
          end_date: undefined,
          contribution: p.contribution_amount || 0,
          description: 'Campaign collaboration'
        }))
      ];

      setPartnerships(partnershipsList);

      // Calculate stats from real data
      const activeChallenges = challengePartnerships.data?.filter(p => p.status === 'active')?.length || 0;
      const activeCampaigns = campaignPartnerships.data?.filter(p => p.partnership_status === 'active')?.length || 0;
      const totalInvestment = [
        ...(challengePartnerships.data || []),
        ...(campaignPartnerships.data || [])
      ].reduce((sum, p) => {
        const amount = 'funding_amount' in p ? p.funding_amount : ('contribution_amount' in p ? p.contribution_amount : 0);
        return sum + (amount || 0);
      }, 0);

      setStats({
        activeChallenges,
        supportedIdeas: transformedApplications?.length || 0,
        totalInvestment,
        eventsSponsored: 0, // TODO: Add event partnerships when available
        collaborations: activeChallenges + activeCampaigns,
        successfulProjects: Math.floor((activeChallenges + activeCampaigns) * 0.7)
      });
      
    } catch (error) {
      console.error('Error loading partner data:', error);
      
      // Fallback to demo data on error
      setStats({
        activeChallenges: 5,
        supportedIdeas: 32,
        totalInvestment: 750000,
        eventsSponsored: 8,
        collaborations: 13,
        successfulProjects: 4
      });
      
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
        }
      ]);

      toast.error('Error loading partner data, showing demo content');
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
        <TabsList className={`grid w-full grid-cols-4 ${isRTL ? 'rtl' : 'ltr'}`}>
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
          <TabsTrigger value="applications" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <FileText className="w-4 h-4" />
            {t('myApplications')}
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
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className={isRTL ? 'flex-row-reverse' : 'flex-row'}
                          onClick={() => {
                            setSelectedPartnership(partnership);
                            setShowPartnershipDialog(true);
                          }}
                        >
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
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className={isRTL ? 'flex-row-reverse' : 'flex-row'}
                        onClick={() => {
                          setSelectedOpportunity({
                            ...opportunity,
                            title_ar: opportunity.title,
                            description_ar: opportunity.description,
                            opportunity_type: opportunity.type
                          });
                          setShowOpportunityDialog(true);
                        }}
                      >
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

        <TabsContent value="applications" className="space-y-4">
          <PartnershipApplicationsTable 
            applications={applications}
            loading={loading}
            onViewApplication={(application) => {
              // Handle view application - could open a detail dialog
              toast.info(`Viewing application for: ${application.partnership_opportunities?.title_ar || application.company_name}`);
            }}
          />
        </TabsContent>
      </Tabs>
      </PageLayout>

      {/* Partnership Detail Dialog */}
      <PartnershipDetailDialog
        partnership={selectedPartnership}
        open={showPartnershipDialog}
        onOpenChange={setShowPartnershipDialog}
      />

      {/* Opportunity Detail Dialog */}
      <OpportunityDetailDialog
        opportunity={selectedOpportunity}
        open={showOpportunityDialog}
        onOpenChange={setShowOpportunityDialog}
      />
    </AppShell>
  );
}