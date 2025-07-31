import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  MapPin, 
  Calendar, 
  Award, 
  Edit3, 
  Shield,
  Star,
  Sparkles,
  Users,
  Trophy,
  Camera,
  Settings
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';
import { getInitials } from '@/hooks/useSystemSettings';

interface ProfileHeroProps {
  userProfile?: any;
  isEditing: boolean;
  onToggleEdit: () => void;
  onNavigate: (path: string) => void;
}

export const EnhancedProfileHero = ({ 
  userProfile,
  isEditing,
  onToggleEdit,
  onNavigate
}: ProfileHeroProps) => {
  const { isRTL } = useDirection();
  const [currentBadge, setCurrentBadge] = useState(0);

  const profileBadges = [
    { icon: Award, label: isRTL ? 'مبتكر نشط' : 'Active Innovator', color: 'text-blue-400' },
    { icon: Star, label: isRTL ? 'عضو مميز' : 'Featured Member', color: 'text-yellow-400' },
    { icon: Shield, label: isRTL ? 'ملف موثق' : 'Verified Profile', color: 'text-green-400' },
    { icon: Trophy, label: isRTL ? 'فائز بجوائز' : 'Award Winner', color: 'text-purple-400' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBadge((prev) => (prev + 1) % profileBadges.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [profileBadges.length]);

  return (
    <div className="relative overflow-hidden">
      {/* Background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/600')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-20 left-1/3 w-64 h-64 bg-cyan-400/5 rounded-full blur-2xl animate-bounce" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="text-center space-y-6 mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </div>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                <User className="w-3 h-3 mr-1" />
                {isRTL ? 'الملف الشخصي' : 'Personal Profile'}
              </Badge>
            </div>

            {/* Avatar and Basic Info */}
            <div className="relative">
              <Avatar className="h-32 w-32 mx-auto border-4 border-white/20 shadow-2xl">
                <AvatarImage src={userProfile?.avatar_url} />
                <AvatarFallback className="text-2xl bg-white/10 text-white">
                  {userProfile?.name_ar ? getInitials(userProfile.name_ar) : <User className="h-12 w-12" />}
                </AvatarFallback>
              </Avatar>
              
              <Button
                size="sm"
                variant="outline"
                className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {userProfile?.name_ar || (isRTL ? 'اسم المستخدم' : 'User Name')}
              </h1>
              
              {userProfile?.job_title && (
                <p className="text-xl text-white/80">
                  {userProfile.job_title}
                </p>
              )}
              
              {userProfile?.organization && (
                <div className="flex items-center justify-center gap-2 text-white/70">
                  <MapPin className="w-4 h-4" />
                  <span>{userProfile.organization}</span>
                </div>
              )}
            </div>

            {/* Animated Profile Badges */}
            <div className="flex justify-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {profileBadges.map((badge, index) => {
                  const Icon = badge.icon;
                  const isActive = currentBadge === index;
                  
                  return (
                    <Card 
                      key={index}
                      className={cn(
                        "bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-500",
                        isActive && "bg-white/10 border-white/20 scale-105"
                      )}
                    >
                      <CardContent className="p-3 text-center">
                        <Icon className={cn("w-5 h-5 mx-auto mb-1 transition-colors", badge.color)} />
                        <div className="text-xs text-white/80">{badge.label}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button
              onClick={onToggleEdit}
              size="lg"
              className={cn(
                "shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105",
                isEditing 
                  ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600"
                  : "bg-gradient-to-r from-blue-400 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-600"
              )}
            >
              {isEditing ? (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
                </>
              ) : (
                <>
                  <Edit3 className="w-5 h-5 mr-2" />
                  {isRTL ? 'تحرير الملف' : 'Edit Profile'}
                </>
              )}
            </Button>
            
            <Button
              onClick={() => onNavigate('/settings')}
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
            >
              <Settings className="w-5 h-5 mr-2" />
              {isRTL ? 'الإعدادات' : 'Settings'}
            </Button>

            <Button
              onClick={() => onNavigate('/dashboard')}
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10"
            >
              <Users className="w-5 h-5 mr-2" />
              {isRTL ? 'لوحة التحكم' : 'Dashboard'}
            </Button>
          </div>

          {/* Profile Stats */}
          {userProfile && (
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {userProfile.created_at ? 
                        new Date().getFullYear() - new Date(userProfile.created_at).getFullYear() : 0}
                    </div>
                    <div className="text-sm text-white/70">
                      {isRTL ? 'سنوات العضوية' : 'Years Member'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">
                      0
                    </div>
                    <div className="text-sm text-white/70">
                      {isRTL ? 'أفكار مقدمة' : 'Ideas Submitted'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">
                      0
                    </div>
                    <div className="text-sm text-white/70">
                      {isRTL ? 'نقاط الابتكار' : 'Innovation Points'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};