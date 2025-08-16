import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { navigationHandler } from '@/utils/unified-navigation';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Clock, Target, AlertTriangle, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSystemLists } from "@/hooks/useSystemLists";
import { logger } from "@/utils/logger";
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface Challenge {
  id: string;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  status: string;
  priority_level: string;
  sensitivity_level: string;
  challenge_type?: string;
  start_date?: string;
  end_date?: string;
  estimated_budget?: number;
  created_at: string;
}

export const InnovatorDashboard = () => {
  const { t } = useUnifiedTranslation();
  const navigate = useNavigate();
  
  // Initialize navigation handler
  React.useEffect(() => {
    navigationHandler.setNavigate(navigate);
  }, [navigate]);
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const { challengePriorityLevels, challengeTypes, challengeStatusOptions } = useSystemLists();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const { data: challengesData, error } = await supabase
        .from('challenges')
        .select(`
          id,
          title_ar,
          description_ar,
          status,
          priority_level,
          sensitivity_level,
          challenge_type,
          created_at
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching challenges', { component: 'InnovatorDashboard', action: 'fetchChallenges' }, error as Error);
        toast({
          title: t('innovator_dashboard.error_loading_challenges'),
          description: t('innovator_dashboard.error_loading_description'),
          variant: "destructive",
        });
        return;
      }

      // Transform data to match Challenge interface
      const transformedChallenges: Challenge[] = (challengesData || []).map(challenge => ({
        id: challenge.id,
        title: challenge.title_ar || t('innovator_dashboard.untitled_challenge'),
        title_ar: challenge.title_ar,
        description: challenge.description_ar || t('innovator_dashboard.no_description'),
        description_ar: challenge.description_ar,
        status: challenge.status,
        priority_level: challenge.priority_level,
        sensitivity_level: challenge.sensitivity_level,
        challenge_type: challenge.challenge_type,
        start_date: undefined,
        end_date: undefined,
        estimated_budget: undefined,
        created_at: challenge.created_at
      }));

      setChallenges(transformedChallenges);
    } catch (error) {
      logger.error('Error in fetchChallenges', { component: 'InnovatorDashboard', action: 'fetchChallenges' }, error as Error);
      // No challenges available - show empty state
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || challenge.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || challenge.priority_level === priorityFilter;
    const matchesType = typeFilter === "all" || challenge.challenge_type === typeFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getSensitivityIcon = (sensitivity: string) => {
    switch (sensitivity) {
      case 'confidential': return <AlertTriangle className="h-4 w-4 icon-confidential" />;
      case 'sensitive': return <AlertTriangle className="h-4 w-4 icon-sensitive" />;
      default: return null;
    }
  };

  const formatBudget = (budget?: number) => {
    if (!budget) return t('innovator_dashboard.not_specified');
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      notation: 'compact'
    }).format(budget);
  };

  const handleViewChallenge = (challengeId: string) => {
    navigationHandler.navigateTo(`/challenges/${challengeId}`);
  };

  const handleSubmitIdea = (challengeId: string) => {
    navigationHandler.navigateTo(`/challenges/${challengeId}/submit-idea`);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t('innovator_dashboard.title')}</h1>
        <p className="text-muted-foreground">
          {t('innovator_dashboard.description')}
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t('innovator_dashboard.filter_challenges')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('innovator_dashboard.search')}</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('innovator_dashboard.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('innovator_dashboard.status')}</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('innovator_dashboard.all_status')}</SelectItem>
                  {challengeStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('innovator_dashboard.priority')}</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('innovator_dashboard.all_priorities')}</SelectItem>
                  {challengePriorityLevels.map((level) => (
                    <SelectItem key={level} value={level}>{t(`priority.${level}`, `${level.charAt(0).toUpperCase() + level.slice(1)} Priority`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('innovator_dashboard.type')}</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('innovator_dashboard.all_types')}</SelectItem>
                  {challengeTypes.map((type) => (
                    <SelectItem key={type} value={type}>{t(`challenge_type.${type}`, type.charAt(0).toUpperCase() + type.slice(1))}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenge Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('innovator_dashboard.available_challenges')}</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredChallenges.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('innovator_dashboard.active_opportunities')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('innovator_dashboard.high_priority')}</CardTitle>
            <AlertTriangle className="h-4 w-4 icon-confidential" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredChallenges.filter(c => c.priority_level === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('innovator_dashboard.urgent_challenges')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('innovator_dashboard.total_budget')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBudget(filteredChallenges.reduce((sum, c) => sum + (c.estimated_budget || 0), 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('innovator_dashboard.available_funding')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Challenges Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredChallenges.map((challenge) => (
          <Card key={challenge.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg leading-tight">{challenge.title}</CardTitle>
                  {challenge.title_ar && (
                    <CardDescription className="text-right" dir="rtl">
                      {challenge.title_ar}
                    </CardDescription>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-2">
                  {getSensitivityIcon(challenge.sensitivity_level)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {challenge.description}
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge variant={getPriorityColor(challenge.priority_level)}>
                  {t(`priority.${challenge.priority_level}`, `${challenge.priority_level} priority`)}
                </Badge>
                {challenge.challenge_type && (
                  <Badge variant="outline">
                    {t(`challenge_type.${challenge.challenge_type}`, challenge.challenge_type)}
                  </Badge>
                )}
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                {challenge.end_date && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t('innovator_dashboard.deadline')}: {new Date(challenge.end_date).toLocaleDateString()}
                  </div>
                )}
                {challenge.estimated_budget && (
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    {t('innovator_dashboard.budget')}: {formatBudget(challenge.estimated_budget)}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleViewChallenge(challenge.id)}
                  className="flex-1"
                >
                  {t('innovator_dashboard.view_details')}
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleSubmitIdea(challenge.id)}
                  className="flex-1"
                >
                  {t('innovator_dashboard.submit_idea')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('innovator_dashboard.no_challenges_found')}</h3>
          <p className="text-muted-foreground">
            {t('innovator_dashboard.no_challenges_description')}
          </p>
        </div>
      )}
    </div>
  );
};