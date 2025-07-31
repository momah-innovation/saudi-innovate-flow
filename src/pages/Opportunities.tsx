import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, Filter, Calendar, DollarSign, Building, 
  Target, Clock, Users, Eye, Plus, MapPin
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AppShell } from '@/components/layout/AppShell';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { OpportunityDetailDialog } from '@/components/partners/OpportunityDetailDialog';

interface OpportunityItem {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  opportunity_type: string;
  budget_min?: number;
  budget_max?: number;
  deadline: string;
  status: string;
  contact_person?: string;
  contact_email?: string;
  sector?: { name_ar: string; name: string };
  department?: { name_ar: string; name: string };
}

export default function Opportunities() {
  const { t, isRTL, getDynamicText } = useTranslation();
  const { userProfile } = useAuth();
  
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<OpportunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityItem | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  useEffect(() => {
    loadOpportunities();
  }, []);

  useEffect(() => {
    filterOpportunities();
  }, [opportunities, searchTerm, statusFilter, typeFilter]);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('partnership_opportunities')
        .select(`
          *,
          sectors(name_ar, name),
          departments(name_ar, name)
        `)
        .order('deadline', { ascending: true });

      if (error) throw error;

      setOpportunities(data || []);
    } catch (error) {
      console.error('Error loading opportunities:', error);
      toast.error(t('errorLoadingData'));
    } finally {
      setLoading(false);
    }
  };

  const filterOpportunities = () => {
    let filtered = opportunities;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(opp => 
        opp.title_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opp.title_en && opp.title_en.toLowerCase().includes(searchTerm.toLowerCase())) ||
        opp.description_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opp.description_en && opp.description_en.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(opp => opp.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(opp => opp.opportunity_type === typeFilter);
    }

    setFilteredOpportunities(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sponsorship': return <DollarSign className="w-4 h-4" />;
      case 'collaboration': return <Users className="w-4 h-4" />;
      case 'research': return <Target className="w-4 h-4" />;
      default: return <Building className="w-4 h-4" />;
    }
  };

  const formatBudgetRange = (min?: number, max?: number) => {
    if (!min && !max) return t('contactForDetails');
    if (!max) return `${min?.toLocaleString()} ${t('currency')}+`;
    if (!min) return `${t('upTo')} ${max?.toLocaleString()} ${t('currency')}`;
    return `${min?.toLocaleString()} - ${max?.toLocaleString()} ${t('currency')}`;
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return t('expired');
    if (diffDays === 0) return t('today');
    if (diffDays === 1) return t('tomorrow');
    if (diffDays <= 7) return `${diffDays} ${t('daysLeft')}`;
    return date.toLocaleDateString();
  };

  const opportunityTypes = [
    { value: 'sponsorship', label: t('sponsorship') },
    { value: 'collaboration', label: t('collaboration') },
    { value: 'research', label: t('research') },
    { value: 'innovation', label: t('innovation') }
  ];

  return (
    <AppShell>
      <PageLayout
        title={t('partnershipOpportunities')}
        description={t('collaborationOpportunitiesDesc')}
        itemCount={filteredOpportunities.length}
        className="space-y-6"
      >
        {/* Filters Section */}
        <Card>
          <CardHeader>
            <CardTitle className={isRTL ? 'text-right' : 'text-left'}>{t('searchAndFilter')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${isRTL ? 'rtl' : 'ltr'}`}>
              {/* Search */}
              <div className="relative">
                <Search className={`absolute top-3 w-4 h-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input
                  placeholder={t('searchOpportunities')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={isRTL ? 'pr-10 text-right' : 'pl-10 text-left'}
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-3 py-2 border rounded-md ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <option value="all">{t('allStatuses')}</option>
                <option value="open">{t('open')}</option>
                <option value="closed">{t('closed')}</option>
                <option value="review">{t('underReview')}</option>
              </select>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`px-3 py-2 border rounded-md ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <option value="all">{t('allTypes')}</option>
                {opportunityTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                }}
                className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <Filter className="w-4 h-4" />
                {t('clearFilters')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Opportunities Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="flex-1">
                      <CardTitle className={`text-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                        {getDynamicText(opportunity.title_ar, opportunity.title_en)}
                      </CardTitle>
                      <div className={`flex items-center gap-2 mt-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                        {getTypeIcon(opportunity.opportunity_type)}
                        <Badge variant="outline" className="text-xs">
                          {t(opportunity.opportunity_type)}
                        </Badge>
                      </div>
                    </div>
                    <Badge className={getStatusColor(opportunity.status)}>
                      {t(opportunity.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className={`text-sm text-muted-foreground line-clamp-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {getDynamicText(opportunity.description_ar, opportunity.description_en)}
                  </p>

                  {/* Budget */}
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {formatBudgetRange(opportunity.budget_min, opportunity.budget_max)}
                    </span>
                  </div>

                  {/* Deadline */}
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {t('deadline')}: {formatDeadline(opportunity.deadline)}
                    </span>
                  </div>

                  {/* Organization */}
                  {(opportunity.sector || opportunity.department) && (
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {opportunity.sector && getDynamicText(opportunity.sector.name_ar, opportunity.sector.name)}
                        {opportunity.sector && opportunity.department && ' - '}
                        {opportunity.department && getDynamicText(opportunity.department.name_ar, opportunity.department.name)}
                      </span>
                    </div>
                  )}

                  {/* Contact */}
                  {opportunity.contact_person && (
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{opportunity.contact_person}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className={`flex gap-2 pt-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Button
                      onClick={() => {
                        setSelectedOpportunity({
                          id: opportunity.id,
                          title_ar: opportunity.title_ar,
                          title_en: opportunity.title_en,
                          description_ar: opportunity.description_ar,
                          description_en: opportunity.description_en,
                          opportunity_type: opportunity.opportunity_type,
                          deadline: opportunity.deadline,
                          status: opportunity.status
                        });
                        setShowDetailDialog(true);
                      }}
                      variant="outline"
                      size="sm"
                      className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <Eye className="w-4 h-4" />
                      {t('viewDetails')}
                    </Button>
                    
                    {opportunity.status === 'open' && (
                      <Button
                        size="sm"
                        className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <Plus className="w-4 h-4" />
                        {t('applyNow')}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className={`text-lg font-medium mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('noOpportunitiesFound')}
              </h3>
              <p className={`text-muted-foreground text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('adjustFiltersOrCheckLater')}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Detail Dialog */}
        <OpportunityDetailDialog
          opportunity={selectedOpportunity}
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
        />
      </PageLayout>
    </AppShell>
  );
}