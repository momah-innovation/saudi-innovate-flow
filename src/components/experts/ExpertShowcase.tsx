import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExpertCard } from './ExpertCard';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Star, Users, Award, ArrowRight, Filter, Search,
  BookOpen, Target, TrendingUp, Crown
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useRTLAware } from '@/hooks/useRTLAware';
import { useState } from 'react';

interface Expert {
  id: string;
  name: string;
  name_ar?: string;
  title: string;
  title_ar?: string;
  avatar: string;
  specializations: string[];
  experience_years: number;
  rating: number;
  active_challenges: number;
  mentored_projects: number;
  availability: 'available' | 'busy' | 'unavailable';
  featured?: boolean;
}

interface ExpertShowcaseProps {
  experts: Expert[];
  onViewAll: () => void;
  onExpertSelect: (expert: Expert) => void;
  onFilterByExpert: (expertId: string) => void;
}

export const ExpertShowcase = ({ 
  experts, 
  onViewAll, 
  onExpertSelect, 
  onFilterByExpert 
}: ExpertShowcaseProps) => {
  const { isRTL } = useDirection();
  const { me, ms } = useRTLAware();
  const [showAll, setShowAll] = useState(false);
  
  // Get featured expert (highest rated available expert)
  const featuredExpert = experts.find(e => e.featured) || 
    experts.filter(e => e.availability === 'available').sort((a, b) => b.rating - a.rating)[0];
  
  // Get top experts (excluding featured)
  const topExperts = experts
    .filter(e => e.id !== featuredExpert?.id)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, showAll ? experts.length : 6);

  const availableCount = experts.filter(e => e.availability === 'available').length;
  const totalExperience = experts.reduce((sum, e) => sum + e.experience_years, 0);

  return (
    <div className="space-y-8">
      {/* Expert Statistics */}
      <Card className="bg-gradient-overlay border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-purple-600" />
            {isRTL ? 'شبكة الخبراء' : 'Expert Network'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{experts.length}</div>
              <div className="text-sm text-muted-foreground">
                {isRTL ? 'إجمالي الخبراء' : 'Total Experts'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{availableCount}</div>
              <div className="text-sm text-muted-foreground">
                {isRTL ? 'متاحون الآن' : 'Available Now'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalExperience}+</div>
              <div className="text-sm text-muted-foreground">
                {isRTL ? 'سنوات خبرة' : 'Years Experience'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">4.8</div>
              <div className="text-sm text-muted-foreground">
                {isRTL ? 'تقييم متوسط' : 'Avg Rating'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Expert */}
      {featuredExpert && (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary fill-current" />
                {isRTL ? 'خبير مميز' : 'Featured Expert'}
              </CardTitle>
              <Badge className="bg-primary text-white">
                {isRTL ? 'مميز' : 'Featured'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={featuredExpert.avatar} alt={featuredExpert.name} />
                <AvatarFallback className="text-xl">{featuredExpert.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">
                  {isRTL ? featuredExpert.name_ar || featuredExpert.name : featuredExpert.name}
                </h3>
                <p className="text-muted-foreground mb-3">
                  {isRTL ? featuredExpert.title_ar || featuredExpert.title : featuredExpert.title}
                </p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-yellow-500" />
                    <span className="font-semibold">{featuredExpert.rating}/5</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4 text-primary" />
                    <span>{featuredExpert.active_challenges} {isRTL ? 'تحديات نشطة' : 'active challenges'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>{featuredExpert.mentored_projects} {isRTL ? 'مشروع منتور' : 'mentored projects'}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {featuredExpert.specializations.slice(0, 3).map((spec, index) => (
                    <Badge key={index} variant="secondary">{spec}</Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={() => onExpertSelect(featuredExpert)}>
                    {isRTL ? 'عرض الملف الشخصي' : 'View Profile'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => onFilterByExpert(featuredExpert.id)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                     {isRTL ? 'تحدياته' : 'Their Challenges'}
                   </Button>
                 </div>
               </div>
             </div>
           </CardContent>
         </Card>
       )}

       {/* Expert Grid */}
       <div>
         <div className="flex items-center justify-between mb-6">
           <div>
             <h2 className="text-2xl font-bold">{isRTL ? 'شبكة الخبراء' : 'Expert Network'}</h2>
             <p className="text-muted-foreground">
               {isRTL ? 'تعرف على الخبراء المرشدين في التحديات' : 'Meet the expert mentors guiding our challenges'}
             </p>
           </div>
           
           <div className="flex gap-2">
             <Button variant="outline" onClick={() => setShowAll(!showAll)}>
               {showAll ? (isRTL ? 'عرض أقل' : 'Show Less') : (isRTL ? 'عرض الكل' : 'Show All')}
             </Button>
             <Button onClick={onViewAll}>
               <Search className="w-4 h-4 mr-2" />
               {isRTL ? 'استكشف الخبراء' : 'Browse Experts'}
               <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topExperts.map((expert) => (
            <ExpertCard
              key={expert.id}
              expert={expert}
              onViewProfile={onExpertSelect}
              onContact={onExpertSelect}
            />
          ))}
        </div>
      </div>

      {/* Quick Access to Expert Categories */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'تصفح حسب التخصص' : 'Browse by Specialization'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['AI & Machine Learning', 'Blockchain', 'Mobile Development', 'UX/UI Design', 
              'Data Science', 'Cybersecurity', 'IoT', 'Cloud Computing'].map((category) => (
              <Button 
                key={category} 
                variant="outline" 
                className="h-auto p-3 text-left justify-start"
                onClick={() => onFilterByExpert(category)}
              >
                <div>
                  <div className="font-medium text-sm">{category}</div>
                  <div className="text-xs text-muted-foreground">
                    {experts.length} {isRTL ? 'خبراء' : 'experts'}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};