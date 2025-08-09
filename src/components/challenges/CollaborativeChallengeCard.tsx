import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { IconActionButton } from '@/components/ui/icon-action-button';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { 
  CalendarIcon, Target, Users, Award, Star, Eye, BookmarkIcon, 
  TrendingUp, Clock, Zap, CheckCircle, AlertCircle, Heart,
  Share2, MessageSquare, Trophy, Wifi, WifiOff
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';
import { getStatusMapping, getPriorityMapping, getDifficultyMapping, challengesPageConfig } from '@/config/challengesPageConfig';

interface Challenge {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  status: string;
  end_date?: string;
  start_date?: string;
  participants?: number;
  submissions?: number;
  challenge_type?: string;
  estimated_budget?: number;
  priority_level?: string;
  image_url?: string;
  trending?: boolean;
  featured?: boolean;
  experts?: Array<{ name: string; profile_image_url: string; }>;
  difficulty?: string;
  success_rate?: number;
  tags?: string[];
}

interface CollaborativeChallengeCardProps {
  challenge: Challenge;
  onViewDetails: (challenge: Challenge) => void;
  onParticipate: (challenge: Challenge) => void;
  onBookmark?: (challenge: Challenge) => void;
  onLike?: (challenge: Challenge) => void;
  onShare?: (challenge: Challenge) => void;
  onStartCollaboration?: (challenge: Challenge) => void;
  viewMode?: 'cards' | 'list' | 'grid';
  variant?: 'basic' | 'enhanced' | 'compact';
  showCollaboration?: boolean;
}

export const CollaborativeChallengeCard = ({ 
  challenge, 
  onViewDetails, 
  onParticipate,
  onBookmark,
  onLike,
  onShare,
  onStartCollaboration,
  viewMode = 'cards',
  variant = 'enhanced',
  showCollaboration = true
}: CollaborativeChallengeCardProps) => {
  const { isRTL } = useDirection();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [liveParticipants, setLiveParticipants] = useState(challenge.participants || 0);
  
  // Collaboration integration
  const { 
    onlineUsers, 
    isConnected, 
    activities,
    startCollaboration,
    endCollaboration 
  } = useCollaboration();

  // Get users currently viewing this challenge
  const challengeViewers = onlineUsers.filter(user => 
    user.page?.includes('challenge') || user.entity_type === 'challenge'
  );

  const recentActivity = activities
    .filter(activity => 
      activity.entity_type === 'challenge' && 
      activity.entity_id === challenge.id
    )
    .slice(0, 3);

  useEffect(() => {
    // Simulate real-time participant updates
    const interval = setInterval(() => {
      const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      setLiveParticipants(prev => Math.max(0, prev + variation));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Get mappings from config
  const statusMapping = getStatusMapping(challenge.status);
  const priorityMapping = getPriorityMapping(challenge.priority_level || 'متوسط');
  const difficultyMapping = getDifficultyMapping(challenge.difficulty || 'متوسط');

  // Helper functions using centralized config
  const getStatusColor = (status: string) => getStatusMapping(status).color;
  const getPriorityColor = (priority: string) => getPriorityMapping(priority).color;
  const getDifficultyColor = (difficulty: string) => getDifficultyMapping(difficulty).color;
  const getStatusText = (status: string) => isRTL ? getStatusMapping(status).labelAr : getStatusMapping(status).label;
  const getStatusIcon = (status: string) => getStatusMapping(status).icon;

  const calculateDaysLeft = () => {
    if (!challenge.end_date) return null;
    const endDate = new Date(challenge.end_date);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const calculateProgress = () => {
    if (!challenge.start_date || !challenge.end_date) return 0;
    const startDate = new Date(challenge.start_date);
    const endDate = new Date(challenge.end_date);
    const now = new Date();
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isRTL ? 
      date.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' }) : 
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(challenge);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(challenge);
  };

  const handleShare = () => {
    onShare?.(challenge);
  };

  const handleStartCollaboration = async () => {
    try {
      await startCollaboration('challenge', challenge.id);
      onStartCollaboration?.(challenge);
    } catch (error) {
      console.error('Failed to start collaboration:', error);
    }
  };

  // Calculations
  const daysLeft = calculateDaysLeft();
  const progress = calculateProgress();
  const StatusIcon = statusMapping.icon;
  const isUrgent = daysLeft !== null && daysLeft <= 7 && daysLeft > 0;
  const isNew = new Date(challenge.start_date || Date.now()) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const title = isRTL ? challenge.title_ar : challenge.title_en || challenge.title_ar;
  const description = isRTL ? challenge.description_ar : challenge.description_en || challenge.description_ar;

  // LIST VIEW with Collaboration
  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-all duration-300 hover-scale animate-fade-in">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Challenge Image */}
            <div className="relative flex-shrink-0">
              <div className={`w-20 h-20 rounded-lg overflow-hidden ${challengesPageConfig.ui.gradients.featured}`}>
                {challenge.image_url ? (
                  <img 
                    src={challenge.image_url} 
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Target className="w-8 h-8 text-primary/40" />
                  </div>
                )}
              </div>
              
              {/* Collaboration Status */}
              {showCollaboration && (
                <div className="absolute -top-1 -right-1">
                  <Badge variant="secondary" className="text-xs px-1 py-0.5">
                    {isConnected ? (
                      <Wifi className="w-3 h-3 text-green-500" />
                    ) : (
                      <WifiOff className="w-3 h-3 text-gray-500" />
                    )}
                  </Badge>
                </div>
              )}
            </div>

            {/* Challenge Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg truncate">{title}</h3>
                    {isNew && (
                      <Badge variant="secondary" className={challengesPageConfig.badges.new}>
                        {isRTL ? 'جديد' : 'New'}
                      </Badge>
                    )}
                    {isUrgent && (
                      <Badge variant="secondary" className={challengesPageConfig.badges.urgent}>
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {isRTL ? 'عاجل' : 'Urgent'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {description}
                  </p>

                  {/* Metrics with Live Data */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className={liveParticipants !== challenge.participants ? 'text-primary font-medium' : ''}>
                        {liveParticipants}
                      </span>
                      {showCollaboration && challengeViewers.length > 0 && (
                        <Badge variant="outline" className="ml-1 px-1 text-xs">
                          +{challengeViewers.length} نشط
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-muted-foreground" />
                      <span>{challenge.estimated_budget ? `${(challenge.estimated_budget / 1000).toFixed(0)}k` : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span>{daysLeft || 0} {isRTL ? 'يوم' : 'days'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-muted-foreground" />
                      <span>{challenge.success_rate || 85}%</span>
                    </div>
                  </div>

                  {/* Live Activity Indicator */}
                  {showCollaboration && recentActivity.length > 0 && (
                    <div className="mt-2 p-2 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MessageSquare className="w-3 h-3" />
                        <span>{isRTL ? 'نشاط حديث:' : 'Recent activity:'}</span>
                        <span className="text-primary">
                          {recentActivity[0].event_type} {isRTL ? 'منذ' : ''} {
                            Math.floor((Date.now() - new Date(recentActivity[0].created_at).getTime()) / (1000 * 60))
                          } {isRTL ? 'دقيقة' : 'min ago'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions with Collaboration */}
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(challenge.status)}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {getStatusText(challenge.status)}
                    </Badge>
                    <Badge className={getPriorityColor(challenge.priority_level || 'متوسط')}>
                      {challenge.priority_level || 'متوسط'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1">
                    <IconActionButton
                      icon={<Heart className={cn("w-4 h-4", isLiked && `fill-current ${challengesPageConfig.ui.colors.stats.red}`)} />}
                      tooltip={isRTL ? 'أعجبني' : 'Like'}
                      onClick={handleLike}
                    />
                    <IconActionButton
                      icon={<BookmarkIcon className={cn("w-4 h-4", isBookmarked && "fill-current")} />}
                      tooltip={isRTL ? 'حفظ' : 'Bookmark'}
                      onClick={handleBookmark}
                    />
                    {showCollaboration && (
                      <IconActionButton
                        icon={<MessageSquare className="w-4 h-4" />}
                        tooltip={isRTL ? 'تعاون مباشر' : 'Start Collaboration'}
                        onClick={handleStartCollaboration}
                      />
                    )}
                    <IconActionButton
                      icon={<Share2 className="w-4 h-4" />}
                      tooltip={isRTL ? 'مشاركة' : 'Share'}
                      onClick={handleShare}
                    />
                    <IconActionButton
                      icon={<Eye className="w-4 h-4" />}
                      tooltip={isRTL ? 'التفاصيل' : 'View Details'}
                      onClick={() => onViewDetails(challenge)}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => onParticipate(challenge)}
                      disabled={challenge.status !== 'active' && challenge.status !== 'published'}
                      className={`ml-2 ${challengesPageConfig.ui.gradients.button} ${challengesPageConfig.ui.gradients.buttonHover} ${challengesPageConfig.ui.colors.text.accent} border-0 shadow-md ${challengesPageConfig.ui.effects.hoverScale}`}
                    >
                      {isRTL ? 'شارك' : 'Join'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {variant === 'enhanced' && challenge.start_date && challenge.end_date && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{isRTL ? 'التقدم' : 'Progress'}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // CARD/GRID VIEW with Enhanced Collaboration
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover-scale animate-fade-in overflow-hidden">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {challenge.image_url ? (
          <img 
            src={challenge.image_url} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full ${challengesPageConfig.ui.gradients.featured} flex items-center justify-center`}>
            <Target className="w-16 h-16 text-primary/40" />
          </div>
        )}
        
        {/* Overlay */}
        <div className={`absolute inset-0 ${challengesPageConfig.ui.colors.background.overlay} bg-gradient-to-t from-black/60 via-transparent to-transparent`} />
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className={getStatusColor(challenge.status)}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {getStatusText(challenge.status)}
          </Badge>
          {challenge.trending && (
            <Badge className={challengesPageConfig.badges.trending}>
              <TrendingUp className="w-3 h-3 mr-1" />
              {isRTL ? 'رائج' : 'Trending'}
            </Badge>
          )}
          {isNew && (
            <Badge className={challengesPageConfig.badges.new}>
              <Star className="w-3 h-3 mr-1" />
              {isRTL ? 'جديد' : 'New'}
            </Badge>
          )}
        </div>

        {/* Collaboration Status & Viewers */}
        {showCollaboration && (
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {/* Connection Status */}
            <div className={`${challengesPageConfig.ui.glassMorphism.medium} rounded-lg p-2 flex items-center gap-1`}>
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-xs text-white">{challengeViewers.length}</span>
            </div>
            
            {/* Active Viewers */}
            {challengeViewers.length > 0 && (
              <div className={`${challengesPageConfig.ui.glassMorphism.medium} rounded-lg p-2`}>
                <div className="flex -space-x-1">
                  {challengeViewers.slice(0, 3).map((user, index) => (
                    <Avatar key={index} className="w-6 h-6 border-2 border-white">
                      <AvatarImage src={user.profile_image_url} />
                      <AvatarFallback className="text-xs bg-primary text-white">
                        {user.user_id?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {challengeViewers.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-white/90 border-2 border-white flex items-center justify-center">
                      <span className="text-xs text-gray-700 font-bold">+{challengeViewers.length - 3}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions with Collaboration */}
        <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconActionButton
            icon={<Heart className={cn("w-4 h-4", isLiked && `fill-current ${challengesPageConfig.ui.colors.stats.red}`)} />}
            tooltip={isRTL ? 'أعجبني' : 'Like'}
            onClick={handleLike}
            className={`${challengesPageConfig.ui.glassMorphism.medium} ${challengesPageConfig.ui.glassMorphism.cardHover}`}
          />
          <IconActionButton
            icon={<BookmarkIcon className={cn("w-4 h-4", isBookmarked && "fill-current")} />}
            tooltip={isRTL ? 'حفظ' : 'Bookmark'}
            onClick={handleBookmark}
            className={`${challengesPageConfig.ui.glassMorphism.medium} ${challengesPageConfig.ui.glassMorphism.cardHover}`}
          />
          {showCollaboration && (
            <IconActionButton
              icon={<MessageSquare className="w-4 h-4" />}
              tooltip={isRTL ? 'تعاون مباشر' : 'Start Collaboration'}
              onClick={handleStartCollaboration}
              className={`${challengesPageConfig.ui.glassMorphism.medium} ${challengesPageConfig.ui.glassMorphism.cardHover}`}
            />
          )}
          <IconActionButton
            icon={<Share2 className="w-4 h-4" />}
            tooltip={isRTL ? 'مشاركة' : 'Share'}
            onClick={handleShare}
            className={`${challengesPageConfig.ui.glassMorphism.medium} ${challengesPageConfig.ui.glassMorphism.cardHover}`}
          />
        </div>

        {/* Live Participant Count */}
        <div className="absolute bottom-3 left-3">
          <div className={`${challengesPageConfig.ui.glassMorphism.heavy} rounded-lg p-2 text-center min-w-[4rem]`}>
            <div className="text-xs font-medium text-muted-foreground">
              {isRTL ? 'المشاركين' : 'Participants'}
            </div>
            <div className={cn("text-sm font-bold", liveParticipants !== challenge.participants && "text-primary")}>
              {liveParticipants}
              {liveParticipants !== challenge.participants && (
                <span className="text-xs ml-1">📈</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <CardDescription className="line-clamp-3">
              {description}
            </CardDescription>
          </div>
          <Badge className={getPriorityColor(challenge.priority_level || 'متوسط')}>
            {challenge.priority_level || 'متوسط'}
          </Badge>
        </div>

        {/* Real-time Activity Feed */}
        {showCollaboration && recentActivity.length > 0 && (
          <div className="mt-3 p-2 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{isRTL ? 'نشاط حديث' : 'Recent Activity'}</span>
            </div>
            <div className="space-y-1">
              {recentActivity.slice(0, 2).map((activity, index) => (
                <div key={index} className="text-xs text-muted-foreground">
                  {activity.event_type} • {
                    Math.floor((Date.now() - new Date(activity.created_at).getTime()) / (1000 * 60))
                  } {isRTL ? 'دقيقة مضت' : 'min ago'}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Challenge Type & Difficulty */}
        <div className="flex items-center gap-2 mt-3">
          {challenge.challenge_type && (
            <Badge variant="outline" className="text-xs">
              {challenge.challenge_type}
            </Badge>
          )}
          {challenge.difficulty && (
            <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
          )}
        </div>

        {/* Experts */}
        {variant === 'enhanced' && challenge.experts && challenge.experts.length > 0 && (
          <div className="flex items-center gap-2 mt-3 p-2 bg-muted/30 rounded-lg">
            <span className="text-sm font-medium">{isRTL ? 'الخبراء:' : 'Experts:'}</span>
            <div className="flex -space-x-1">
              {challenge.experts.slice(0, 3).map((expert, index) => (
                <Avatar key={index} className="w-6 h-6 border-2 border-background">
                  <AvatarImage src={expert.profile_image_url} />
                  <AvatarFallback className="text-xs">{expert.name?.[0] || 'X'}</AvatarFallback>
                </Avatar>
              ))}
              {challenge.experts.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs">+{challenge.experts.length - 3}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress */}
        {variant === 'enhanced' && challenge.start_date && challenge.end_date && (
          <div className="mt-3">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{isRTL ? 'التقدم' : 'Progress'}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{formatDate(challenge.start_date)}</span>
              <span>{formatDate(challenge.end_date)}</span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Stats with Live Updates */}
        {variant !== 'compact' && (
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <div className={cn("font-medium", liveParticipants !== challenge.participants && "text-primary")}>
                  {liveParticipants}
                </div>
                <div className="text-xs text-muted-foreground">{isRTL ? 'مشارك' : 'participants'}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
              <Trophy className="h-4 w-4 text-primary" />
              <div>
                <div className="font-medium">
                  {challenge.estimated_budget ? `${(challenge.estimated_budget / 1000).toFixed(0)}k` : 'TBD'}
                </div>
                <div className="text-xs text-muted-foreground">{isRTL ? 'جائزة' : 'prize'}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <div className="font-medium">{daysLeft || 0}</div>
                <div className="text-xs text-muted-foreground">{isRTL ? 'أيام' : 'days left'}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
              <Star className="h-4 w-4 text-primary" />
              <div>
                <div className="font-medium">{challenge.success_rate || 85}%</div>
                <div className="text-xs text-muted-foreground">{isRTL ? 'نجاح' : 'success'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(challenge)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            {isRTL ? 'التفاصيل' : 'Details'}
          </Button>
          <Button 
            size="sm" 
            onClick={() => onParticipate(challenge)}
            disabled={challenge.status !== 'active' && challenge.status !== 'published'}
            className="flex-1"
          >
            <Target className="h-4 w-4 mr-2" />
            {isRTL ? 'شارك الآن' : 'Join Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};