import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { UserPresence as UserPresenceType } from '@/types/collaboration';

interface UserPresenceProps {
  users: UserPresenceType[];
  maxVisible?: number;
  showStatus?: boolean;
  showLocation?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusColors = {
  online: 'bg-success',
  away: 'bg-warning', 
  busy: 'bg-destructive',
  offline: 'bg-muted'
};

const statusLabels = {
  online: 'متصل',
  away: 'غائب',
  busy: 'مشغول',
  offline: 'غير متصل'
};

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10'
};

export const UserPresence: React.FC<UserPresenceProps> = ({
  users,
  maxVisible = 5,
  showStatus = true,
  showLocation = false,
  size = 'md'
}) => {
  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = Math.max(0, users.length - maxVisible);

  return (
    <TooltipProvider>
      <div className="flex items-center -space-x-2">
        {visibleUsers.map((user) => (
          <Tooltip key={`${user.user_id}-${user.session_id}`}>
            <TooltipTrigger asChild>
              <div className="relative">
                <Avatar className={`border-2 border-background ${sizeClasses[size]}`}>
                  <AvatarImage src={user.user_info.avatar_url} />
                  <AvatarFallback className="text-xs">
                    {user.user_info.display_name?.charAt(0) || 'م'}
                  </AvatarFallback>
                </Avatar>
                {showStatus && (
                  <div 
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${statusColors[user.status]}`}
                  />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-1">
                <p className="font-medium">{user.user_info.display_name}</p>
                <p className="text-sm text-muted-foreground">{user.user_info.role}</p>
                {showStatus && (
                  <Badge variant="outline" className="text-xs">
                    {statusLabels[user.status]}
                  </Badge>
                )}
                {showLocation && user.current_location.page && (
                  <p className="text-xs text-muted-foreground">
                    في: {user.current_location.page}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  آخر ظهور: {new Date(user.last_seen).toLocaleTimeString('ar')}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
        
        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`flex items-center justify-center ${sizeClasses[size]} rounded-full bg-muted border-2 border-background text-xs font-medium`}>
                +{remainingCount}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{remainingCount} مستخدم إضافي متصل</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};