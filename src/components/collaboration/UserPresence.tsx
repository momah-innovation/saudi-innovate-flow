import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// import type { UserPresence as UserPresenceType } from '@/types/collaboration';

interface UserPresenceProps {
  users: Array<{
    user_id: string;
    user_info: {
      display_name?: string;
      avatar_url?: string;
      role?: string;
    };
    last_seen: string;
    status?: 'online' | 'away' | 'busy' | 'offline';
    current_location?: {
      page?: string;
    };
  }>;
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
  // Deduplicate users by user_id to prevent duplicate keys
  const uniqueUsers = users.reduce((acc, user) => {
    const existing = acc.find(u => u.user_id === user.user_id);
    if (!existing) {
      return [...acc, user];
    } else {
      // Keep the most recent presence
      if (new Date(user.last_seen) > new Date(existing.last_seen)) {
        const index = acc.indexOf(existing);
        const newAcc = [...acc];
        newAcc[index] = user;
        return newAcc;
      }
    }
    return acc;
  }, [] as typeof users);

  const visibleUsers = uniqueUsers.slice(0, maxVisible);
  const remainingCount = Math.max(0, uniqueUsers.length - maxVisible);

  return (
    <TooltipProvider>
      <div className="flex items-center -space-x-2">
        {visibleUsers.map((user, index) => (
          <Tooltip key={`user-presence-${user.user_id}-${index}`}>
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
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${statusColors[user.status || 'offline']}`}
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
                    {statusLabels[user.status || 'offline']}
                  </Badge>
                )}
                {showLocation && user.current_location?.page && (
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