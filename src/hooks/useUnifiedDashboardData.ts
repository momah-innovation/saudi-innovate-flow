
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from './useCurrentUser';

interface UnifiedDashboardData {
  userStats: {
    totalIdeas: number;
    totalChallenges: number;
    totalEvents: number;
    innovationScore: number;
    totalPoints: number;
  };
  expertStats: {
    completedEvaluations: number;
    pendingEvaluations: number;
    averageRating: number;
    expertiseAreas: string[];
    assignedChallenges: number;
  };
  partnerStats: {
    activePartnerships: number;
    totalInvestment: number;
    collaborationScore: number;
    partnershipOpportunities: number;
  };
  managerStats: {
    totalUsers: number;
    activeUsers: number;
    totalChallenges: number;
    totalSubmissions: number;
    systemHealth: number;
    pendingApprovals: number;
    systemUptime: number;
    securityScore: number;
    recentActivity: any[];
  };
  recentActivities: any[];
  quickActions: any[];
}

export const useUnifiedDashboardData = (userType?: string) => {
  const { user } = useCurrentUser();

  return useQuery({
    queryKey: ['unified-dashboard-data', user?.id, userType],
    queryFn: async (): Promise<UnifiedDashboardData> => {
      // Return mock data with correct property names
      return {
        userStats: {
          totalIdeas: 5,
          totalChallenges: 3,
          totalEvents: 2,
          innovationScore: 85,
          totalPoints: 1250
        },
        expertStats: {
          completedEvaluations: 12,
          pendingEvaluations: 4,
          averageRating: 4.5,
          expertiseAreas: ['Technology', 'Innovation', 'Digital Transformation'],
          assignedChallenges: 8
        },
        partnerStats: {
          activePartnerships: 6,
          totalInvestment: 250000,
          collaborationScore: 92,
          partnershipOpportunities: 3
        },
        managerStats: {
          totalUsers: 1250,
          activeUsers: 980,
          totalChallenges: 45,
          totalSubmissions: 234,
          systemHealth: 95,
          pendingApprovals: 12,
          systemUptime: 99.8,
          securityScore: 88,
          recentActivity: [
            {
              id: '1',
              type: 'user_registration',
              description: 'New user registered',
              timestamp: new Date().toISOString()
            },
            {
              id: '2', 
              type: 'challenge_created',
              description: 'New challenge created',
              timestamp: new Date().toISOString()
            }
          ]
        },
        recentActivities: [
          {
            id: '1',
            type: 'idea_submitted',
            title: 'New Idea Submitted',
            description: 'AI-powered customer service enhancement',
            date: new Date().toISOString()
          },
          {
            id: '2',
            type: 'challenge_joined',
            title: 'Challenge Participation',
            description: 'Joined Digital Innovation Challenge',
            date: new Date().toISOString()
          }
        ],
        quickActions: [
          {
            id: '1',
            title: 'Submit New Idea',
            description: 'Share your innovative ideas',
            icon: 'lightbulb',
            href: '/ideas/create'
          },
          {
            id: '2',
            title: 'Join Challenge',
            description: 'Participate in active challenges',
            icon: 'trophy',
            href: '/challenges'
          }
        ]
      };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 1
  });
};
