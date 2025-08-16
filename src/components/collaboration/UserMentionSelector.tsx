import React, { useState, useEffect } from 'react';
import { useTimerManager } from '@/utils/timerManager';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  AtSign, 
  User, 
  Search,
  Users
} from 'lucide-react';
import { useUserDiscovery } from '@/hooks/useUserDiscovery';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface User {
  id: string;
  display_name?: string;
  avatar_url?: string;
  email?: string;
  role?: string;
  department?: string;
  is_online?: boolean;
}

interface UserMentionSelectorProps {
  onUserSelect: (user: any) => void;
  contextType?: string;
  contextId?: string;
  placeholder?: string;
  showSuggestions?: boolean;
}

export const UserMentionSelector: React.FC<UserMentionSelectorProps> = ({
  onUserSelect,
  contextType = 'global',
  contextId,
  placeholder,
  showSuggestions = true
}) => {
  const { t } = useUnifiedTranslation();
  const { setTimeout: scheduleTimeout } = useTimerManager();
  const {
    searchResults,
    loading,
    searchUsers,
    getOnlineUsers,
    getUserSuggestions
  } = useUserDiscovery();

  const [searchQuery, setSearchQuery] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load online users
  useEffect(() => {
    const loadOnlineUsers = async () => {
      const users = await getOnlineUsers();
      setOnlineUsers(users.slice(0, 10));
    };
    loadOnlineUsers();
  }, []);

  // Load suggested users based on context
  useEffect(() => {
    const loadSuggestions = async () => {
      if (showSuggestions) {
        const suggestions = await getUserSuggestions();
        setSuggestedUsers(suggestions);
      }
    };
    loadSuggestions();
  }, [contextType, contextId, showSuggestions]);

  // Handle search
  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim()) {
        await searchUsers(searchQuery);
      }
    };

    const cleanup = scheduleTimeout(handleSearch, 300);
    return cleanup;
  }, [searchQuery]);

  const handleUserSelect = (user: any) => {
    onUserSelect(user);
    setSearchQuery('');
    setIsOpen(false);
  };

  const getUserDisplayName = (user: any): string => {
    return user.display_name || user.name || user.email || 'مستخدم';
  };

  const getUserInitials = (user: any): string => {
    const name = getUserDisplayName(user);
    return name.charAt(0).toUpperCase();
  };

  const getDisplayUsers = (): User[] => {
    if (searchQuery.trim()) {
      return searchResults;
    }
    return showSuggestions ? suggestedUsers : onlineUsers;
  };

  return (
    <div className="relative">
      <div className="relative">
        <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={placeholder || t('collaboration.search_users')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => scheduleTimeout(() => setIsOpen(false), 200)}
          className="pl-10"
        />
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4" />
              {searchQuery.trim() ? 
                t('collaboration.search_users') : 
                showSuggestions ? 'مستخدمون مقترحون' : t('collaboration.users_online')
              }
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="max-h-48">
              <div className="p-2 space-y-1">
                {loading ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    جاري البحث...
                  </div>
                ) : getDisplayUsers().length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    {searchQuery.trim() ? 
                      t('collaboration.user_not_found') : 
                      t('collaboration.no_users_online')
                    }
                  </div>
                ) : (
                  getDisplayUsers().map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-2 hover:bg-muted rounded cursor-pointer"
                      onClick={() => handleUserSelect(user)}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>
                          {getUserInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {getUserDisplayName(user)}
                          </span>
                          {user.role && user.role !== 'user' && (
                            <Badge variant="outline" className="text-xs">
                              {user.role}
                            </Badge>
                          )}
                        </div>
                        
                        {user.email && user.email !== user.display_name && (
                          <span className="text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        )}
                        
                        {user.department && (
                          <span className="text-xs text-muted-foreground">
                            {user.department}
                          </span>
                        )}
                      </div>

                      <AtSign className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};