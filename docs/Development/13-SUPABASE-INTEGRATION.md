# 🔗 Supabase Integration Guide

## Overview
Comprehensive guide for integrating and leveraging Supabase backend services in the Ruwād Platform, including authentication, database operations, real-time features, and storage.

## Project Configuration

### Environment Setup
```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jxpbiljkoibvqxzdkgod.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});
```

### Type Safety Integration
```typescript
// Generated types are available at src/integrations/supabase/types.ts
import type { Database } from '@/integrations/supabase/types';

// Type-safe client
export type SupabaseClient = typeof supabase;
export type Tables = Database['public']['Tables'];
export type Functions = Database['public']['Functions'];
```

## Authentication Integration

### Auth Hook Pattern
```typescript
// src/hooks/auth/useAuth.ts
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Handle specific auth events
        if (event === 'SIGNED_IN') {
          await initializeUserProfile(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string, metadata?: object) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
    
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user
  };
};
```

### Role-Based Access Control
```typescript
// src/hooks/auth/useRole.ts
export const useRole = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    const fetchUserRoles = async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (!error && data) {
        setRoles(data.map(r => r.role));
      }
      setLoading(false);
    };

    fetchUserRoles();
  }, [user]);

  const hasRole = (role: string) => roles.includes(role);
  const hasAnyRole = (roleList: string[]) => roleList.some(role => roles.includes(role));
  const isAdmin = hasRole('admin') || hasRole('super_admin');

  return {
    roles,
    loading,
    hasRole,
    hasAnyRole,
    isAdmin
  };
};
```

## Database Operations

### Query Hook Patterns
```typescript
// src/hooks/data/useChallenges.ts
export const useChallenges = (filters?: ChallengeFilters) => {
  return useQuery({
    queryKey: ['challenges', filters],
    queryFn: async () => {
      let query = supabase
        .from('challenges')
        .select(`
          *,
          created_by_profile:profiles!created_by(display_name, avatar_url),
          submissions_count:challenge_submissions(count),
          participants_count:challenge_participants(count)
        `);

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### Mutation Patterns
```typescript
// src/hooks/data/useCreateChallenge.ts
export const useCreateChallenge = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (challengeData: CreateChallengeData) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('challenges')
        .insert({
          ...challengeData,
          created_by: user.id,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch challenges
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      
      // Optimistically update cache
      queryClient.setQueryData(['challenge', data.id], data);
      
      toast.success('تم إنشاء التحدي بنجاح');
    },
    onError: (error) => {
      console.error('Error creating challenge:', error);
      toast.error('حدث خطأ أثناء إنشاء التحدي');
    }
  });
};
```

### Database Functions Integration
```typescript
// src/hooks/analytics/useAnalytics.ts
export const useAnalytics = (filters?: AnalyticsFilters) => {
  const { user } = useAuth();
  const { hasRole } = useRole();

  return useQuery({
    queryKey: ['analytics', user?.id, filters],
    queryFn: async () => {
      if (!user || !hasRole('admin')) {
        throw new Error('Insufficient permissions');
      }

      const { data, error } = await supabase.rpc('get_analytics_data', {
        p_user_id: user.id,
        p_user_role: 'admin', // Get from user roles
        p_filters: filters || {}
      });

      if (error) throw error;
      return data;
    },
    enabled: !!user && hasRole('admin'),
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });
};
```

## Real-Time Features

### Real-Time Subscriptions
```typescript
// src/hooks/realtime/useRealtimeSubscription.ts
export const useRealtimeSubscription = <T>(
  table: string,
  filters?: { column: string; value: any }[],
  callback?: (payload: RealtimePostgresChangesPayload<T>) => void
) => {
  useEffect(() => {
    let subscription = supabase
      .channel(`realtime-${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          ...(filters && {
            filter: filters.map(f => `${f.column}=eq.${f.value}`).join(',')
          })
        },
        (payload) => {
          console.log('Real-time update:', payload);
          callback?.(payload);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [table, filters, callback]);
};

// Usage example
export const useChallengeUpdates = (challengeId: string) => {
  const queryClient = useQueryClient();

  useRealtimeSubscription(
    'challenge_submissions',
    [{ column: 'challenge_id', value: challengeId }],
    (payload) => {
      // Update cache when new submissions arrive
      queryClient.invalidateQueries({ 
        queryKey: ['challenge-submissions', challengeId] 
      });
    }
  );
};
```

### Real-Time Chat Implementation
```typescript
// src/hooks/chat/useChat.ts
export const useChat = (roomId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !roomId) return;

    const channel = supabase.channel(`chat-${roomId}`, {
      config: {
        presence: { key: user.id }
      }
    });

    // Handle new messages
    channel
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_id=eq.${roomId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as ChatMessage]);
      })
      
      // Handle presence (online users)
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const users = Object.keys(presenceState);
        setOnlineUsers(users);
      })
      
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track user presence
          await channel.track({ user_id: user.id, online_at: new Date().toISOString() });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [roomId, user]);

  const sendMessage = async (content: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        room_id: roomId,
        user_id: user.id,
        content,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return { messages, onlineUsers, sendMessage };
};
```

## File Storage Integration

### File Upload Hook
```typescript
// src/hooks/storage/useFileUpload.ts
export const useFileUpload = () => {
  const { user } = useAuth();

  const uploadFile = async (
    file: File, 
    bucket: string, 
    path?: string
  ): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = path || `${user.id}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const deleteFile = async (bucket: string, path: string) => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  };

  return {
    uploadFile,
    deleteFile
  };
};
```

### Image Optimization
```typescript
// src/hooks/storage/useImageUpload.ts
export const useImageUpload = () => {
  const { uploadFile } = useFileUpload();

  const uploadImage = async (
    file: File,
    options: {
      bucket: string;
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    }
  ) => {
    // Resize image before upload
    const resizedFile = await resizeImage(file, {
      maxWidth: options.maxWidth || 1200,
      maxHeight: options.maxHeight || 800,
      quality: options.quality || 0.8
    });

    return uploadFile(resizedFile, options.bucket);
  };

  return { uploadImage };
};

// Image resize utility
const resizeImage = (file: File, options: ResizeOptions): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      const { width, height } = calculateDimensions(img, options);
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        const resizedFile = new File([blob!], file.name, {
          type: file.type,
          lastModified: Date.now()
        });
        resolve(resizedFile);
      }, file.type, options.quality);
    };

    img.src = URL.createObjectURL(file);
  });
};
```

## Edge Functions Integration

### API Client Wrapper
```typescript
// src/lib/api/edgeFunctions.ts
export class EdgeFunctionClient {
  private baseUrl = 'https://jxpbiljkoibvqxzdkgod.supabase.co/functions/v1';

  private async request<T>(
    functionName: string, 
    payload?: any, 
    options?: RequestInit
  ): Promise<T> {
    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await fetch(`${this.baseUrl}/${functionName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
        ...options?.headers
      },
      body: payload ? JSON.stringify(payload) : undefined,
      ...options
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Edge function error: ${error}`);
    }

    return response.json();
  }

  // AI Integration
  async generateContent(prompt: string, options?: AIOptions) {
    return this.request<{ generatedText: string }>('ai-content-generator', {
      prompt,
      ...options
    });
  }

  // Notification Service
  async sendNotification(payload: NotificationPayload) {
    return this.request<{ success: boolean }>('send-notification', payload);
  }

  // Analytics Processing
  async processAnalytics(data: AnalyticsData) {
    return this.request<AnalyticsResult>('process-analytics', data);
  }
}

export const edgeFunctions = new EdgeFunctionClient();
```

### AI Integration Example
```typescript
// src/hooks/ai/useAIGeneration.ts
export const useAIGeneration = () => {
  return useMutation({
    mutationFn: async ({ prompt, type }: { prompt: string; type: 'idea' | 'challenge' | 'solution' }) => {
      const response = await edgeFunctions.generateContent(prompt, {
        model: 'gpt-4o-mini',
        maxTokens: 500,
        temperature: 0.7,
        context: type
      });

      return response.generatedText;
    },
    onError: (error) => {
      console.error('AI generation error:', error);
      toast.error('حدث خطأ في توليد المحتوى');
    }
  });
};
```

## Error Handling Patterns

### Unified Error Handler
```typescript
// src/lib/supabase/errorHandler.ts
export const handleSupabaseError = (error: any, context?: string) => {
  console.error(`Supabase error ${context ? `in ${context}` : ''}:`, error);

  if (error.code === 'PGRST301') {
    return 'صفحة غير موجودة';
  }

  if (error.code === 'PGRST116') {
    return 'لا توجد بيانات متاحة';
  }

  if (error.message?.includes('JWT')) {
    return 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى';
  }

  return error.message || 'حدث خطأ غير متوقع';
};

// Error boundary for Supabase operations
export const withErrorHandling = <T>(
  operation: () => Promise<T>,
  context?: string
) => {
  return operation().catch((error) => {
    const userMessage = handleSupabaseError(error, context);
    toast.error(userMessage);
    throw error;
  });
};
```

## Performance Optimization

### Query Optimization
```typescript
// src/hooks/data/useOptimizedQuery.ts
export const useOptimizedQuery = <T>(
  queryKey: QueryKey,
  queryFn: QueryFunction<T>,
  options?: {
    staleTime?: number;
    cacheTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes
    cacheTime: options?.cacheTime || 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus || false,
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error.message?.includes('JWT') || error.message?.includes('auth')) {
        return false;
      }
      return failureCount < 3;
    }
  });
};
```

### Connection Pooling
```typescript
// src/lib/supabase/connectionPool.ts
class SupabaseConnectionPool {
  private static instance: SupabaseConnectionPool;
  private connections: Map<string, typeof supabase> = new Map();
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new SupabaseConnectionPool();
    }
    return this.instance;
  }

  getConnection(key: string = 'default') {
    if (!this.connections.has(key)) {
      this.connections.set(key, supabase);
    }
    return this.connections.get(key)!;
  }
}

export const connectionPool = SupabaseConnectionPool.getInstance();
```

## Testing Patterns

### Supabase Testing Setup
```typescript
// src/test/supabase-mock.ts
export const createMockSupabaseClient = () => ({
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
  })),
  auth: {
    getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
    onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
  },
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn().mockResolvedValue({ data: { path: 'test-path' }, error: null }),
      getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'test-url' } }),
    })),
  },
});
```

## Best Practices

### 1. **Type Safety**
- Always use generated types
- Create specific interfaces for complex queries
- Validate data at boundaries

### 2. **Error Handling**
- Implement consistent error handling
- Use error boundaries for critical operations
- Log errors for debugging

### 3. **Performance**
- Use query optimization techniques
- Implement proper caching strategies
- Monitor real-time subscription usage

### 4. **Security**
- Implement Row Level Security (RLS)
- Validate permissions on client-side
- Use secure patterns for sensitive operations

---

**Last Updated**: January 17, 2025  
**Guide Version**: 1.0  
**Supabase Version**: 2.52.1