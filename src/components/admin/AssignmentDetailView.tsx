import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DetailModal } from '@/components/ui/detail-modal';
import { DetailView } from '@/components/ui/detail-view';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, DollarSign, Users, Target, AlertTriangle, Clock } from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/error-handler';

interface Assignment {
  id: string;
  assignment_type: string;
  assignment_id: string;
  role: string;
  status: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
}

interface AssignmentDetailData {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  status: string;
  priority_level?: string;
  sensitivity_level?: string;
  start_date?: string;
  end_date?: string;
  estimated_budget?: number;
  created_at: string;
  // Add other common fields as needed
  [key: string]: unknown;
}

interface AssignmentDetailViewProps {
  assignment: Assignment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AssignmentDetailView({ assignment, isOpen, onClose }: AssignmentDetailViewProps) {
  const { t, getDynamicText } = useUnifiedTranslation();
  const { toast } = useToast();
  const [data, setData] = useState<AssignmentDetailData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assignment && isOpen) {
      fetchAssignmentData();
    }
  }, [assignment, isOpen]);

  const fetchAssignmentData = async () => {
    if (!assignment) return;

    setLoading(true);
    try {
      let query;
      
      switch (assignment.assignment_type) {
        case 'challenge':
          query = supabase
            .from('challenges')
            .select('*')
            .eq('id', assignment.assignment_id);
          break;
        case 'campaign':
          query = supabase
            .from('campaigns')
            .select('*')
            .eq('id', assignment.assignment_id);
          break;
        case 'event':
          query = supabase
            .from('events')
            .select('*')
            .eq('id', assignment.assignment_id);
          break;
        default:
          throw new Error(`Unsupported assignment type: ${assignment.assignment_type}`);
      }

      const { data: assignmentData, error } = await query.maybeSingle();

      if (error) throw error;
      setData(assignmentData as AssignmentDetailData);
    } catch (error) {
      logger.error('Error fetching assignment data', error);
      toast({
        title: t('error'),
        description: t('failedToFetchData'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'challenge':
        return <Target className="w-4 h-4" />;
      case 'campaign':
        return <Users className="w-4 h-4" />;
      case 'event':
        return <Calendar className="w-4 h-4" />;
      case 'evaluation':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'published':
      case 'ongoing':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'draft':
      case 'planning':
        return 'outline';
      case 'cancelled':
      case 'suspended':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'urgent':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return t('notSpecified');
    return new Date(dateString).toLocaleDateString();
  };

  const formatBudget = (amount?: number) => {
    if (!amount) return t('notSpecified');
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const navigateToFullPage = () => {
    if (!assignment) return;
    
    const routes: Record<string, string> = {
      challenge: '/challenges',
      campaign: '/campaigns',
      event: '/events',
      evaluation: '/evaluations'
    };

    const basePath = routes[assignment.assignment_type];
    if (basePath) {
      window.open(`${basePath}/${assignment.assignment_id}`, '_blank');
    }
  };

  if (!assignment) return null;

  const title = data ? getDynamicText(data.title_ar) : t('loading');
  const subtitle = `${t(assignment.assignment_type)} - ${t('role')}: ${t(assignment.role)}`;

  const badges = [
    {
      label: t('status'),
      value: t(data?.status || ''),
      variant: getStatusColor(data?.status || '') as 'default' | 'secondary' | 'destructive' | 'outline'
    },
    ...(data?.priority_level ? [{
      label: t('priority'),
      value: t(data.priority_level),
      variant: getPriorityColor(data.priority_level) as 'default' | 'secondary' | 'destructive' | 'outline'
    }] : []),
    ...(data?.sensitivity_level ? [{
      label: t('sensitivity'),
      value: t(data.sensitivity_level),
      variant: 'outline' as const
    }] : [])
  ];

  const sections = [
    {
      title: t('basicInformation'),
      items: [
        {
          label: t('type'),
          value: (
            <div className="flex items-center gap-2">
              {getTypeIcon(assignment.assignment_type)}
              {t(assignment.assignment_type)}
            </div>
          )
        },
        {
          label: t('assignedRole'),
          value: t(assignment.role)
        },
        {
          label: t('assignmentStatus'),
          value: (
            <Badge variant={getStatusColor(assignment.status) as 'default' | 'secondary' | 'destructive' | 'outline'}>
              {t(assignment.status)}
            </Badge>
          )
        },
        ...(data?.description_ar ? [{
          label: t('description'),
          value: getDynamicText(data.description_ar),
          fullWidth: true
        }] : [])
      ]
    },
    {
      title: t('timeline'),
      items: [
        {
          label: t('assignmentStart'),
          value: formatDate(assignment.start_date)
        },
        {
          label: t('assignmentEnd'),
          value: formatDate(assignment.end_date)
        },
        ...(data?.start_date ? [{
          label: t('projectStart'),
          value: formatDate(data.start_date)
        }] : []),
        ...(data?.end_date ? [{
          label: t('projectEnd'),
          value: formatDate(data.end_date)
        }] : [])
      ]
    },
    ...(data?.estimated_budget ? [{
      title: t('budget'),
      items: [
        {
          label: t('estimatedBudget'),
          value: formatBudget(data.estimated_budget)
        },
        ...(data.actual_budget ? [{
          label: t('actualBudget'),
          value: formatBudget(data.actual_budget as number)
        }] : [])
      ]
    }] : []),
    ...(assignment.notes ? [{
      title: t('notes'),
      items: [
        {
          label: t('assignmentNotes'),
          value: assignment.notes,
          fullWidth: true
        }
      ]
    }] : [])
  ];

  const actions = (
    <Button onClick={navigateToFullPage} className="gap-2">
      <ExternalLink className="w-4 h-4" />
      {t('viewFullDetails')}
    </Button>
  );

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      maxWidth="4xl"
      actions={actions}
    >
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">{t('loading')}...</div>
        </div>
      ) : (
        <DetailView
          title=""
          badges={badges}
          sections={sections}
        />
      )}
    </DetailModal>
  );
}