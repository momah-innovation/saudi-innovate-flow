import { LogOut, User, Settings, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useDirection } from '@/components/ui/direction-provider';
import { getInitials, useSystemSettings } from '@/hooks/useSystemSettings';
import { cn } from '@/lib/utils';

export function UserMenu() {
  const { user, userProfile, signOut } = useAuth();
  const { isRTL, language } = useDirection();
  const { uiInitialsMaxLength } = useSystemSettings();
  const navigate = useNavigate();

  const getUserDisplayName = () => {
    if (!userProfile) return 'User';
    return userProfile.name || userProfile.email || 'User';
  };

  const getUserRoles = () => {
    if (!userProfile?.user_roles) return [];
    return userProfile.user_roles
      .filter((role: any) => role.is_active && (!role.expires_at || new Date(role.expires_at) > new Date()))
      .map((role: any) => role.role);
  };

  const getInitialsWithSettings = (name: string) => {
    return getInitials(name, uiInitialsMaxLength);
  };

  const handleProfileClick = () => {
    if (user?.id) {
      navigate(`/profile/${user.id}`);
    }
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const getText = (en: string, ar: string) => {
    return isRTL && language === 'ar' ? ar : en;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage 
              src={userProfile?.profile_image_url} 
              alt={getUserDisplayName()} 
            />
            <AvatarFallback className="bg-primary text-primary-foreground font-medium text-sm">
              {getInitialsWithSettings(getUserDisplayName())}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={isRTL ? 'start' : 'end'} 
        className="w-64"
      >
        {/* User Info Header */}
        <div className={cn(
          "flex items-center gap-3 p-3 border-b",
          isRTL && "flex-row-reverse"
        )}>
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={userProfile?.profile_image_url} 
              alt={getUserDisplayName()} 
            />
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              {getInitialsWithSettings(getUserDisplayName())}
            </AvatarFallback>
          </Avatar>
          <div className={cn(
            "flex-1 min-w-0",
            isRTL && "text-right"
          )}>
            <p className="font-medium text-sm truncate">{getUserDisplayName()}</p>
            <p className="text-xs text-muted-foreground truncate">{userProfile?.email}</p>
          </div>
        </div>

        {/* Roles */}
        {getUserRoles().length > 0 && (
          <div className="p-3 border-b">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {getText('Active Roles', 'الأدوار النشطة')}
            </p>
            <div className="flex flex-wrap gap-1">
              {getUserRoles().map((role: string) => (
                <Badge key={role} variant="secondary" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  {role.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="py-1">
          <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
            <User className={cn("h-4 w-4", isRTL ? "ml-3" : "mr-3")} />
            <span>{getText('View Profile', 'عرض الملف الشخصي')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer">
            <Settings className={cn("h-4 w-4", isRTL ? "ml-3" : "mr-3")} />
            <span>{getText('Settings', 'الإعدادات')}</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        {/* Sign Out */}
        <div className="py-1">
          <DropdownMenuItem 
            onClick={signOut} 
            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <LogOut className={cn("h-4 w-4", isRTL ? "ml-3" : "mr-3")} />
            <span>{getText('Sign out', 'تسجيل الخروج')}</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}