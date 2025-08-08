import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Users, 
  Globe, 
  Award, 
  Edit3, 
  Shield,
  Star,
  Sparkles,
  Building,
  Target,
  TrendingUp,
  Handshake
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface PartnerProfileHeroProps {
  partnerProfile?: any;
  isEditing: boolean;
  onToggleEdit: () => void;
  onNavigate: (path: string) => void;
}

export const EnhancedPartnerProfileHero = ({ 
  partnerProfile,
  isEditing,
  onToggleEdit,
  onNavigate
}: PartnerProfileHeroProps) => {
  const { isRTL } = useDirection();
  const [currentMetric, setCurrentMetric] = useState(0);

  const partnerMetrics = [
    { icon: Handshake, value: '15+', label: isRTL ? 'شراكة نشطة' : 'active partnerships', color: 'text-blue-400' },
    { icon: Target, value: '50K+', label: isRTL ? 'ر.س استثمار' : 'SAR invested', color: 'text-green-400' },
    { icon: Award, value: '25+', label: isRTL ? 'مشروع مدعوم' : 'projects supported', color: 'text-purple-400' },
    { icon: Star, value: '4.8', label: isRTL ? 'تقييم الشراكة' : 'partnership rating', color: 'text-yellow-400' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetric((prev) => (prev + 1) % partnerMetrics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [partnerMetrics.length]);

  return (
    <div className="relative overflow-hidden">
      {/* Background with animated gradients */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, hsl(262, 83%, 58%), hsl(262, 83%, 52%))' }}>
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/600')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-20 left-1/3 w-64 h-64 bg-amber-400/5 rounded-full blur-2xl animate-bounce" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Partner Header */}
          <div className="text-center space-y-6 mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </div>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                <Briefcase className="w-3 h-3 mr-1" />
                {isRTL ? 'ملف الشريك' : 'Partner Profile'}
              </Badge>
            </div>

            {/* Organization Info */}
            <div className="space-y-4">
              <div className="w-24 h-24 mx-auto bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center">
                <Building className="w-12 h-12 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {partnerProfile?.organization_name_ar || (isRTL ? 'اسم المؤسسة' : 'Organization Name')}
              </h1>
              
              {partnerProfile?.organization_type && (
                <p className="text-xl text-white/80">
                  {partnerProfile.organization_type}
                </p>
              )}
              
              {partnerProfile?.industry_sector && (
                <div className="flex items-center justify-center gap-2 text-white/70">
                  <Globe className="w-4 h-4" />
                  <span>{partnerProfile.industry_sector}</span>
                </div>
              )}
            </div>

            {/* Animated Partner Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {partnerMetrics.map((metric, index) => {
                const Icon = metric.icon;
                const isActive = currentMetric === index;
                
                return (
                  <Card 
                    key={index}
                    className={cn(
                      "bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-500",
                      isActive && "bg-white/10 border-white/20 scale-105"
                    )}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className={cn("w-6 h-6 mx-auto mb-2 transition-colors", metric.color)} />
                      <div className="text-2xl font-bold text-white">{metric.value}</div>
                      <div className="text-sm text-white/70">{metric.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
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
                  ? "bg-gradient-primary text-white hover:opacity-90"
                  : "bg-gradient-primary text-white hover:opacity-90"
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
              onClick={() => onNavigate('/partner-dashboard')}
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              {isRTL ? 'لوحة التحكم' : 'Dashboard'}
            </Button>

            <Button
              onClick={() => onNavigate('/challenges')}
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10"
            >
              <Target className="w-5 h-5 mr-2" />
              {isRTL ? 'تصفح التحديات' : 'Browse Challenges'}
            </Button>
          </div>

          {/* Partner Info Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {isRTL ? 'معلومات الشراكة' : 'Partnership Information'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">{isRTL ? 'سنة التأسيس' : 'Founded'}</span>
                    <span className="text-white">2010</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">{isRTL ? 'حجم الفريق' : 'Team Size'}</span>
                    <span className="text-white">500-1000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">{isRTL ? 'الاستثمار المتاح' : 'Investment Capacity'}</span>
                    <span className="text-white">5-50M SAR</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {isRTL ? 'مجالات الاهتمام' : 'Areas of Interest'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['AI & Technology', 'Healthcare', 'Smart Cities', 'Environment'].map((interest, index) => (
                    <Badge key={index} variant="secondary" className="bg-white/10 text-white border-white/20">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};