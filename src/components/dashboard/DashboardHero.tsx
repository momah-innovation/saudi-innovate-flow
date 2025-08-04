import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Lightbulb, Target, Award, Trophy, Star, Sparkles, Users, Settings, 
  Shield, BarChart3, Brain, FileText, Clock, Handshake, Briefcase, TrendingUp,
  Server, Activity, CheckCircle, Wifi, AlertCircle
} from 'lucide-react';
import { useTranslation } from '@/hooks/useAppTranslation';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface DashboardHeroProps {
  userProfile?: any;
  stats: {
    totalIdeas: number;
    activeChallenges: number;
    totalPoints: number;
    innovationScore: number;
  };
  onNavigate: (path: string) => void;
  userRole?: string;
  rolePermissions?: any;
}

export const DashboardHero = ({ 
  userProfile,
  stats,
  onNavigate,
  userRole = 'innovator',
  rolePermissions 
}: DashboardHeroProps) => {
  const { t, language } = useTranslation();
  const { isRTL } = useDirection();
  const [currentStat, setCurrentStat] = useState(0);

  // Role-based configurations
  const getRoleConfig = () => {
    switch (userRole) {
      case 'admin':
      case 'super_admin':
        return {
          gradient: 'from-red-500 to-pink-600',
          title: language === 'ar' ? 'لوحة الإدارة' : 'Admin Dashboard',
          subtitle: language === 'ar' ? 'إدارة شاملة للنظام والمستخدمين' : 'Complete system and user management',
          icon: Shield,
          stats: [
            { icon: Users, value: '156', label: language === 'ar' ? 'المستخدمين' : 'Users', color: 'text-white' },
            { icon: Settings, value: '12', label: language === 'ar' ? 'المهام النشطة' : 'Active Tasks', color: 'text-white' },
            { icon: BarChart3, value: '98%', label: language === 'ar' ? 'أداء النظام' : 'System Performance', color: 'text-white' },
          ],
          actions: [
            { title: language === 'ar' ? 'إدارة المستخدمين' : 'Manage Users', path: '/admin/users', icon: Users },
            { title: language === 'ar' ? 'التحليلات' : 'Analytics', path: '/admin/analytics', icon: BarChart3 },
            { title: language === 'ar' ? 'الإعدادات' : 'Settings', path: '/admin/settings', icon: Settings },
          ]
        };
      case 'expert':
        return {
          gradient: 'from-purple-500 to-indigo-600',
          title: language === 'ar' ? 'مركز الخبرة' : 'Expert Center',
          subtitle: language === 'ar' ? 'تقييم ومراجعة الأفكار الابتكارية' : 'Evaluate and review innovative ideas',
          icon: Brain,
          stats: [
            { icon: FileText, value: stats.totalIdeas.toString(), label: language === 'ar' ? 'أفكار للمراجعة' : 'Ideas to Review', color: 'text-white' },
            { icon: Star, value: '4.8', label: language === 'ar' ? 'تقييم الخبرة' : 'Expert Rating', color: 'text-white' },
            { icon: Trophy, value: '24', label: language === 'ar' ? 'تم التقييم' : 'Evaluated', color: 'text-white' },
          ],
          actions: [
            { title: language === 'ar' ? 'تقييم الأفكار' : 'Evaluate Ideas', path: '/expert/evaluate', icon: FileText },
            { title: language === 'ar' ? 'أدوات الخبير' : 'Expert Tools', path: '/expert/tools', icon: Brain },
          ]
        };
      case 'partner':
        return {
          gradient: 'from-green-500 to-teal-600',
          title: language === 'ar' ? 'منصة الشريك' : 'Partner Platform',
          subtitle: language === 'ar' ? 'إدارة الشراكات والفرص الاستثمارية' : 'Manage partnerships and investment opportunities',
          icon: Handshake,
          stats: [
            { icon: Briefcase, value: '8', label: language === 'ar' ? 'فرص نشطة' : 'Active Opportunities', color: 'text-white' },
            { icon: TrendingUp, value: '85%', label: language === 'ar' ? 'معدل النجاح' : 'Success Rate', color: 'text-white' },
            { icon: Award, value: '2.5M', label: language === 'ar' ? 'SAR مستثمر' : 'SAR Invested', color: 'text-white' },
          ],
          actions: [
            { title: language === 'ar' ? 'إدارة الفرص' : 'Manage Opportunities', path: '/partner/opportunities', icon: Briefcase },
            { title: language === 'ar' ? 'لوحة الشريك' : 'Partner Dashboard', path: '/partner/dashboard', icon: TrendingUp },
          ]
        };
      default: // innovator and others
        return {
          gradient: 'from-innovation to-innovation-foreground',
          title: language === 'ar' ? 'رحلة الابتكار' : 'Innovation Journey',
          subtitle: language === 'ar' ? 'اكتشف، ابتكر، وشارك أفكارك مع العالم' : 'Discover, innovate, and share your ideas with the world',
          icon: Lightbulb,
          stats: [
            { icon: Lightbulb, value: stats.totalIdeas.toString(), label: language === 'ar' ? 'أفكاري' : 'My Ideas', color: 'text-white' },
            { icon: Target, value: stats.activeChallenges.toString(), label: language === 'ar' ? 'التحديات' : 'Challenges', color: 'text-white' },
            { icon: Award, value: stats.totalPoints.toString(), label: language === 'ar' ? 'النقاط' : 'Points', color: 'text-white' },
            { icon: Trophy, value: `${stats.innovationScore}%`, label: language === 'ar' ? 'نتيجة الابتكار' : 'Innovation Score', color: 'text-white' },
          ],
          actions: [
            { title: language === 'ar' ? 'تصفح التحديات' : 'Browse Challenges', path: '/challenges', icon: Target },
            { title: language === 'ar' ? 'اقترح فكرة' : 'Submit Idea', path: '/ideas/submit', icon: Lightbulb },
            { title: language === 'ar' ? 'الفعاليات' : 'Events', path: '/events', icon: Trophy },
          ]
        };
    }
  };

  const roleConfig = getRoleConfig();
  const dashboardStats = roleConfig.stats;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % dashboardStats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [dashboardStats.length]);

  return (
    <div className="relative overflow-hidden">
      {/* Role-specific background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${roleConfig.gradient}`}>
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div className="space-y-8">
            {/* Header with role-specific styling */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <roleConfig.icon className="w-6 h-6 text-white" />
                </div>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                  <Star className="w-3 h-3 mr-1" />
                  {roleConfig.title}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {language === 'ar' ? (
                    <>
                      مرحباً <span className="text-yellow-300">{userProfile?.display_name || 'المستخدم'}</span>
                    </>
                  ) : (
                    <>
                      Welcome <span className="text-yellow-300">{userProfile?.display_name || 'User'}</span>
                    </>
                  )}
                </h1>
                
                <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
                  {roleConfig.subtitle}
                </p>
              </div>
            </div>

            {/* Animated Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {dashboardStats.map((stat, index) => {
                const Icon = stat.icon;
                const isActive = currentStat === index;
                
                return (
                  <Card 
                    key={index}
                    className={cn(
                      "bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-500",
                      isActive && "bg-white/10 border-white/20 scale-105"
                    )}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className="w-6 h-6 mx-auto mb-2 text-white" />
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-white/70">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Role-specific Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roleConfig.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate(action.path)}
                  className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-sm text-white">{action.title}</h3>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Admin System Monitoring Section */}
          {(userRole === 'admin' || userRole === 'super_admin') && (
            <div className="space-y-6">
              {/* System Health Card */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Server className="w-5 h-5 text-white" />
                    <h3 className="text-lg font-bold text-white">
                      {language === 'ar' ? 'حالة النظام' : 'System Health'}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-xs font-medium text-white">{language === 'ar' ? 'API' : 'API'}</p>
                      <p className="text-xs text-emerald-300">{language === 'ar' ? 'متاح' : 'Online'}</p>
                    </div>
                    
                    <div className="text-center p-3 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Wifi className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-xs font-medium text-white">{language === 'ar' ? 'الشبكة' : 'Network'}</p>
                      <p className="text-xs text-emerald-300">{language === 'ar' ? 'مستقر' : 'Stable'}</p>
                    </div>
                    
                    <div className="text-center p-3 bg-amber-500/20 rounded-lg border border-amber-400/30">
                      <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <AlertCircle className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-xs font-medium text-white">{language === 'ar' ? 'التخزين' : 'Storage'}</p>
                      <p className="text-xs text-amber-300">68%</p>
                    </div>
                    
                    <div className="text-center p-3 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-xs font-medium text-white">{language === 'ar' ? 'الأمان' : 'Security'}</p>
                      <p className="text-xs text-emerald-300">{language === 'ar' ? 'محمي' : 'Secure'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resource Usage Card */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-white" />
                    <h3 className="text-lg font-bold text-white">
                      {language === 'ar' ? 'استخدام الموارد' : 'Resource Usage'}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-white/80">{language === 'ar' ? 'ملفات النظام' : 'System Files'}</span>
                        <span className="text-sm font-medium text-white">2,847</span>
                      </div>
                      <Progress value={65} className="h-2 bg-white/20" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-white/80">{language === 'ar' ? 'أحداث الأمان' : 'Security Events'}</span>
                        <span className="text-sm font-medium text-white">12</span>
                      </div>
                      <Progress value={20} className="h-2 bg-white/20" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-white/80">{language === 'ar' ? 'مساحة التخزين' : 'Storage Space'}</span>
                        <span className="text-sm font-medium text-white">1.2 GB</span>
                      </div>
                      <Progress value={68} className="h-2 bg-white/20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Progress Section - Only for innovators */}
          {userRole === 'innovator' && (
            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {language === 'ar' ? 'مستوى الابتكار' : 'Innovation Level'}
                    </h3>
                    <div className="text-3xl font-bold text-yellow-300 mb-4">
                      {stats.innovationScore}%
                    </div>
                    <Progress 
                      value={stats.innovationScore} 
                      className="h-3 bg-white/20"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">{language === 'ar' ? 'أفكار مقدمة' : 'Ideas Submitted'}</span>
                      <span className="text-white font-semibold">{stats.totalIdeas}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">{language === 'ar' ? 'نقاط مكتسبة' : 'Points Earned'}</span>
                      <span className="text-white font-semibold">{stats.totalPoints}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">{language === 'ar' ? 'تحديات نشطة' : 'Active Challenges'}</span>
                      <span className="text-white font-semibold">{stats.activeChallenges}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};