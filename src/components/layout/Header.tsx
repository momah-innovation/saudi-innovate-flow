import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, User, Settings, Globe, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export const Header = () => {
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
              Innovation Management System
            </h1>
            <p className="text-sm text-primary-foreground/80">
              Ministry of Municipal and Housing - CIC
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
                Ahmed Al-Rashid
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};