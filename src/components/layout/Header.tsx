import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, User, Settings, Globe, Search, LogOut, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { getInitials, useSystemSettings } from '@/hooks/useSystemSettings';
import { Heading1 } from "@/components/ui";
import { useDirection } from "@/components/ui";

export const Header = () => {
  const { user, userProfile, signOut, hasRole } = useAuth();
  const { uiInitialsMaxLength } = useSystemSettings();
  const { isRTL } = useDirection();
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

  return (
    <header className="border-b bg-gradient-to-r from-primary via-primary-light to-accent p-4 shadow-elegant">
      <div className={`container mx-auto flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Logo and Title */}
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
          <div className="h-10 w-10 rounded-lg bg-background/20 flex items-center justify-center">
            <div className="text-xl font-bold text-primary-foreground">🏗️</div>
          </div>
          <div>
            <Heading1 className="text-xl font-bold text-primary-foreground">
              Ruwād Innovation System
            </Heading1>
            <p className="text-sm text-primary-foreground/80">
              Government Innovation Management Platform
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search challenges, ideas, or stakeholders..."
              className="pl-10 bg-background/10 border-background/20 text-primary-foreground placeholder:text-primary-foreground/60"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
          {/* Language Toggle */}
          <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-background/10">
            <Globe className="h-4 w-4 mr-2" />
            EN | العربية
          </Button>

          {/* Notifications */}
          <NotificationCenter />

          {/* User Avatar Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-background/10">
                <Avatar className="h-10 w-10 border-2 border-background/20">
                  <AvatarImage 
                    src={userProfile?.profile_image_url} 
                    alt={getUserDisplayName()} 
                  />
                  <AvatarFallback className="bg-primary-foreground text-primary font-medium">
                    {getInitialsWithSettings(getUserDisplayName())}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              {/* User Info Header */}
              <div className="flex items-center gap-3 px-3 py-3 border-b">
                <Avatar className="h-12 w-12">
                  <AvatarImage 
                    src={userProfile?.profile_image_url} 
                    alt={getUserDisplayName()} 
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                    {getInitialsWithSettings(getUserDisplayName())}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{getUserDisplayName()}</p>
                  <p className="text-xs text-muted-foreground truncate">{userProfile?.email}</p>
                  {userProfile?.position && (
                    <p className="text-xs text-muted-foreground truncate">{userProfile.position}</p>
                  )}
                </div>
              </div>

              {/* Roles */}
              {getUserRoles().length > 0 && (
                <div className="px-3 py-2 border-b">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Active Roles</p>
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
                  <User className="mr-3 h-4 w-4" />
                  <span>View Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer">
                  <Settings className="mr-3 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator />

              {/* Sign Out */}
              <div className="py-1">
                <DropdownMenuItem 
                  onClick={signOut} 
                  className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};