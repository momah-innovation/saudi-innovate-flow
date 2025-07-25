import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export const Header = () => {
  const { userProfile, signOut, hasRole } = useAuth();

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

  return (
    <header className="border-b bg-gradient-to-r from-primary via-primary-light to-accent p-4 shadow-elegant">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
            <div className="text-xl font-bold text-primary-foreground">🏗️</div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary-foreground">
              Ruwād Innovation System
            </h1>
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
              className="pl-10 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Language Toggle */}
          <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/10">
            <Globe className="h-4 w-4 mr-2" />
            EN | العربية
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative text-primary-foreground hover:bg-white/10">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-warning text-warning-foreground">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/10">
                <User className="h-4 w-4 mr-2" />
                {getUserDisplayName()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="px-3 py-2 border-b">
                <p className="font-medium">{getUserDisplayName()}</p>
                <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
                {getUserRoles().length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {getUserRoles().map((role: string) => (
                      <Badge key={role} variant="secondary" className="text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        {role}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};