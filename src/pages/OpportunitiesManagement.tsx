import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Search, Edit, Trash2, Eye, Calendar, Target, Users, Building, DollarSign, MessageSquare, BarChart3, Clock, Filter } from 'lucide-react';
import { CreateOpportunityDialog } from '@/components/opportunities/CreateOpportunityDialog';
import { ApplicationsManagementDialog } from '@/components/opportunities/ApplicationsManagementDialog';

interface Opportunity {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  opportunity_type: string;
  status: string;
  deadline: string;
  budget_min?: number;
  budget_max?: number;
  contact_person?: string;
  contact_email?: string;
  created_at: string;
  applications_count?: number;
  views_count?: number;
  likes_count?: number;
}

export default function OpportunitiesManagement() {
  const { t, isRTL, getDynamicText } = useTranslation();
  const { toast } = useToast();
  
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState('opportunities');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showApplicationsDialog, setShowApplicationsDialog] = useState(false);
  const [selectedOpportunityForApplications, setSelectedOpportunityForApplications] = useState<Opportunity | null>(null);

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('partnership_opportunities')
        .select(`
          *,
          opportunity_applications!left(count),
          opportunity_analytics!left(view_count, like_count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process the data to include aggregated counts
      const processedData = data?.map(opp => ({
        ...opp,
        applications_count: Array.isArray(opp.opportunity_applications) ? opp.opportunity_applications.length : 0,
        views_count: 0, // Will be implemented with proper analytics
        likes_count: 0  // Will be implemented with proper analytics
      })) || [];

      setOpportunities(processedData);
    } catch (error) {
      console.error('Error loading opportunities:', error);
      toast({
        title: t('error'),
        description: t('errorLoadingData'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'closed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
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

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = !searchTerm || 
      opp.title_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (opp.title_en && opp.title_en.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || opp.status === statusFilter;
    const matchesType = typeFilter === 'all' || opp.opportunity_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: t('expired'), urgent: true };
    if (diffDays <= 7) return { text: `${diffDays} ${t('daysLeft')}`, urgent: true };
    return { text: date.toLocaleDateString(), urgent: false };
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div>
            <h1 className={`text-3xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('opportunitiesManagement')}
            </h1>
            <p className={`text-muted-foreground mt-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('managePartnershipOpportunities')}
            </p>
          </div>
          <Button 
            className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="w-4 h-4" />
            {t('createOpportunity')}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('totalOpportunities')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{opportunities.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('openOpportunities')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {opportunities.filter(o => o.status === 'open').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('totalApplications')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {opportunities.reduce((sum, o) => sum + (o.applications_count || 0), 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('expiringThisWeek')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {opportunities.filter(o => {
                  const deadline = formatDeadline(o.deadline);
                  return deadline.urgent;
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>{t('filtersAndSearch')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${isRTL ? 'rtl' : 'ltr'}`}>
              <div className="relative">
                <Search className={`absolute top-3 w-4 h-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input
                  placeholder={t('searchOpportunities')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={isRTL ? 'pr-10 text-right' : 'pl-10 text-left'}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-3 py-2 border rounded-md ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <option value="all">{t('allStatuses')}</option>
                <option value="draft">{t('draft')}</option>
                <option value="open">{t('open')}</option>
                <option value="review">{t('underReview')}</option>
                <option value="closed">{t('closed')}</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`px-3 py-2 border rounded-md ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <option value="all">{t('allTypes')}</option>
                <option value="sponsorship">{t('sponsorship')}</option>
                <option value="collaboration">{t('collaboration')}</option>
                <option value="research">{t('research')}</option>
                <option value="innovation">{t('innovation')}</option>
              </select>

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

        {/* Opportunities List */}
        <Card>
          <CardHeader>
            <CardTitle>{t('opportunities')} ({filteredOpportunities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse border rounded-lg p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredOpportunities.length > 0 ? (
              <div className="space-y-4">
                {filteredOpportunities.map((opportunity) => {
                  const deadline = formatDeadline(opportunity.deadline);
                  
                  return (
                    <div key={opportunity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="flex-1">
                          <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                            {getTypeIcon(opportunity.opportunity_type)}
                            <h3 className={`font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
                              {getDynamicText(opportunity.title_ar, opportunity.title_en)}
                            </h3>
                            <Badge className={getStatusColor(opportunity.status)}>
                              {t(opportunity.status)}
                            </Badge>
                            {deadline.urgent && (
                              <Badge variant="destructive" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {deadline.text}
                              </Badge>
                            )}
                          </div>
                          
                          <p className={`text-sm text-muted-foreground mb-3 line-clamp-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {getDynamicText(opportunity.description_ar, opportunity.description_en)}
                          </p>
                          
                          <div className={`flex items-center gap-4 text-sm ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {opportunity.applications_count || 0} {t('applications')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {opportunity.views_count || 0} {t('views')}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {opportunity.likes_count || 0} {t('likes')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {deadline.text}
                            </span>
                          </div>
                        </div>
                        
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedOpportunityForApplications(opportunity);
                              setShowApplicationsDialog(true);
                            }}
                            title={isRTL ? 'إدارة الطلبات' : 'Manage Applications'}
                          >
                            <Users className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" title={isRTL ? 'عرض' : 'View'}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" title={isRTL ? 'تعديل' : 'Edit'}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" title={isRTL ? 'الإحصائيات' : 'Analytics'}>
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="sm" title={isRTL ? 'حذف' : 'Delete'}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('noOpportunitiesFound')}</h3>
                <p className="text-muted-foreground">{t('adjustFiltersOrCreateNew')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Opportunity Dialog */}
        <CreateOpportunityDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={() => {
            loadOpportunities();
            setShowCreateDialog(false);
          }}
        />

        {/* Applications Management Dialog */}
        {selectedOpportunityForApplications && (
          <ApplicationsManagementDialog
            opportunityId={selectedOpportunityForApplications.id}
            opportunityTitle={getDynamicText(selectedOpportunityForApplications.title_ar, selectedOpportunityForApplications.title_en)}
            open={showApplicationsDialog}
            onOpenChange={setShowApplicationsDialog}
          />
        )}
      </div>
    </AdminLayout>
  );
}