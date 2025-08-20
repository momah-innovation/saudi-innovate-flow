
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { 
  Crown, 
  Shield, 
  Users, 
  Star, 
  TrendingUp,
  Bell,
  Settings
} from 'lucide-react';
import type { DashboardHeroProps } from '@/types/dashboard';

export const DashboardHero: React.FC<DashboardHeroProps> = ({
  userProfile,
  stats,
  onNavigate,
  userRole,
  rolePermissions
}) => {
  const { t } = useUnifiedTranslation();

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'super_admin': return Crown;
      case 'admin': return Shield;
      case 'team_member': return Users;
      case 'expert': return Star;
      default: return Users;
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'super_admin': return 'bg-gradient-to-r from-purple-600 to-indigo-600';
      case 'admin': return 'bg-gradient-to-r from-red-500 to-pink-600';
      case 'team_member': return 'bg-gradient-to-r from-blue-500 to-cyan-600';
      case 'expert': return 'bg-gradient-to-r from-emerald-500 to-teal-600';
      default: return 'bg-gradient-to-r from-slate-500 to-gray-600';
    }
  };

  const RoleIcon = getRoleIcon(userRole);
  const displayName = userProfile?.display_name || userProfile?.full_name || 'User';

  return (
    <div className={`${getRoleColor(userRole)} text-white rounded-lg p-6 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <RoleIcon className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">
                {t('dashboard.welcome', { name: displayName })}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {userRole?.replace('_', ' ').toUpperCase() || 'USER'}
                </Badge>
                {userProfile?.metadata?.profile_completion && (
                  <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                    {userProfile.metadata.profile_completion}% Complete
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <p className="text-white/80 max-w-2xl">
            Welcome to your personalized innovation dashboard. Track your progress, 
            manage challenges, and drive innovation forward.
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            onClick={() => onNavigate('/notifications')}
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            onClick={() => onNavigate('/settings')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-2xl font-bold">{stats.totalIdeas || 0}</div>
          <div className="text-sm text-white/80">Total Ideas</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-2xl font-bold">{stats.activeChallenges || 0}</div>
          <div className="text-sm text-white/80">Active Challenges</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-2xl font-bold">{stats.totalPoints || 0}</div>
          <div className="text-sm text-white/80">Points Earned</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-300" />
          <div>
            <div className="text-2xl font-bold">{stats.innovationScore || 0}</div>
            <div className="text-sm text-white/80">Innovation Score</div>
          </div>
        </div>
      </div>
    </div>
  );
};
