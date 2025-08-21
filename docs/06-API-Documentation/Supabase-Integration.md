# 🗄️ Supabase Integration

## 🎯 **OVERVIEW**
Comprehensive documentation for Supabase integration including database operations, authentication, real-time features, and storage.

## 🔧 **CONFIGURATION**

### **Environment Setup**
```bash
# Required environment variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### **Client Configuration**
```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});
```

## 🔐 **AUTHENTICATION**

### **Auth Service Implementation**
```typescript
// src/services/authService.ts
export class AuthService {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw new Error(error.message);
    return data;
  }
  
  async signUp(email: string, password: string, userData: UserMetadata) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) throw new Error(error.message);
    return data;
  }
  
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }
  
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    if (error) throw new Error(error.message);
  }
  
  getCurrentUser() {
    return supabase.auth.getUser();
  }
  
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}
```

### **Auth Hook Implementation**
```typescript
// src/hooks/useAuth.ts
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    
    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  return { user, loading };
};
```

## 🗃️ **DATABASE OPERATIONS**

### **Generic Repository Pattern**
```typescript
// src/services/BaseRepository.ts
export abstract class BaseRepository<T> {
  protected tableName: string;
  
  constructor(tableName: string) {
    this.tableName = tableName;
  }
  
  async findAll(filters?: Record<string, any>): Promise<T[]> {
    let query = supabase.from(this.tableName).select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as T[];
  }
  
  async findById(id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message);
    }
    return data as T | null;
  }
  
  async create(item: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(item)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data as T;
  }
  
  async update(id: string, updates: Partial<T>): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data as T;
  }
  
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);
      
    if (error) throw new Error(error.message);
  }
}
```

### **Specific Repository Examples**
```typescript
// src/services/ChallengeRepository.ts
export class ChallengeRepository extends BaseRepository<Challenge> {
  constructor() {
    super('challenges');
  }
  
  async findByWorkspace(workspaceId: string): Promise<Challenge[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        *,
        workspace:workspaces(name),
        submissions:challenge_submissions(count)
      `)
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });
      
    if (error) throw new Error(error.message);
    return data as Challenge[];
  }
  
  async findPublic(): Promise<Challenge[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('is_public', true)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
      
    if (error) throw new Error(error.message);
    return data as Challenge[];
  }
}
```

## 🔄 **REAL-TIME FEATURES**

### **Real-time Subscription Hook**
```typescript
// src/hooks/useRealtimeSubscription.ts
export const useRealtimeSubscription = <T>(
  table: string,
  filter?: { column: string; value: any },
  callback?: (payload: RealtimePostgresChangesPayload<T>) => void
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let subscription: RealtimeChannel;
    
    // Initial data fetch
    const fetchData = async () => {
      let query = supabase.from(table).select('*');
      
      if (filter) {
        query = query.eq(filter.column, filter.value);
      }
      
      const { data: initialData, error } = await query;
      if (!error && initialData) {
        setData(initialData);
      }
      setLoading(false);
    };
    
    fetchData();
    
    // Set up real-time subscription
    subscription = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table,
        filter: filter ? `${filter.column}=eq.${filter.value}` : undefined
      }, (payload) => {
        handleRealtimeChange(payload as RealtimePostgresChangesPayload<T>);
        callback?.(payload as RealtimePostgresChangesPayload<T>);
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [table, filter?.column, filter?.value]);
  
  const handleRealtimeChange = (payload: RealtimePostgresChangesPayload<T>) => {
    switch (payload.eventType) {
      case 'INSERT':
        setData(current => [...current, payload.new]);
        break;
      case 'UPDATE':
        setData(current => 
          current.map(item => 
            (item as any).id === (payload.new as any).id ? payload.new : item
          )
        );
        break;
      case 'DELETE':
        setData(current => 
          current.filter(item => (item as any).id !== (payload.old as any).id)
        );
        break;
    }
  };
  
  return { data, loading };
};
```

### **Real-time Chat Implementation**
```typescript
// src/hooks/useRealtimeChat.ts
export const useRealtimeChat = (channelId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    const channel = supabase
      .channel(`chat_${channelId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `channel_id=eq.${channelId}`
      }, (payload) => {
        setMessages(current => [...current, payload.new as ChatMessage]);
      })
      .subscribe();
    
    // Load existing messages
    loadMessages();
    
    return () => {
      channel.unsubscribe();
    };
  }, [channelId]);
  
  const sendMessage = async (content: string) => {
    if (!user) throw new Error('User not authenticated');
    
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        channel_id: channelId,
        user_id: user.id,
        content,
        created_at: new Date().toISOString()
      });
    
    if (error) throw new Error(error.message);
  };
  
  return { messages, sendMessage };
};
```

## 📁 **STORAGE MANAGEMENT**

### **File Upload Service**
```typescript
// src/services/StorageService.ts
export class StorageService {
  private bucket: string;
  
  constructor(bucket: string) {
    this.bucket = bucket;
  }
  
  async uploadFile(
    file: File,
    path: string,
    options?: { upsert?: boolean; metadata?: Record<string, string> }
  ): Promise<string> {
    const { data, error } = await supabase.storage
      .from(this.bucket)
      .upload(path, file, {
        upsert: options?.upsert ?? false,
        metadata: options?.metadata
      });
    
    if (error) throw new Error(error.message);
    
    return this.getPublicUrl(data.path);
  }
  
  async uploadMultiple(
    files: Array<{ file: File; path: string }>,
    options?: { onProgress?: (progress: number) => void }
  ): Promise<string[]> {
    const uploadPromises = files.map(({ file, path }) =>
      this.uploadFile(file, path)
    );
    
    const results = await Promise.allSettled(uploadPromises);
    const urls: string[] = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        urls.push(result.value);
      } else {
        console.error(`Failed to upload ${files[index].path}:`, result.reason);
      }
    });
    
    return urls;
  }
  
  getPublicUrl(path: string): string {
    const { data } = supabase.storage
      .from(this.bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
  
  async deleteFile(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from(this.bucket)
      .remove([path]);
    
    if (error) throw new Error(error.message);
  }
  
  async createSignedUrl(
    path: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const { data, error } = await supabase.storage
      .from(this.bucket)
      .createSignedUrl(path, expiresIn);
    
    if (error) throw new Error(error.message);
    return data.signedUrl;
  }
}
```

## 🔍 **QUERY OPTIMIZATION**

### **Efficient Data Fetching**
```typescript
// Optimized queries with proper indexing
export const optimizedQueries = {
  // Use select() to fetch only needed columns
  getChallengesSummary: () => 
    supabase
      .from('challenges')
      .select('id, title, status, created_at, workspace:workspaces(name)')
      .order('created_at', { ascending: false })
      .limit(50),
  
  // Use filters to reduce data transfer
  getActiveUserChallenges: (userId: string) =>
    supabase
      .from('challenge_participants')
      .select(`
        challenge:challenges(
          id, title, description, deadline,
          workspace:workspaces(name)
        )
      `)
      .eq('user_id', userId)
      .eq('challenges.status', 'active'),
  
  // Use aggregation functions
  getChallengeStats: (challengeId: string) =>
    supabase
      .from('challenge_submissions')
      .select('id', { count: 'exact' })
      .eq('challenge_id', challengeId),
  
  // Use text search for better performance
  searchChallenges: (query: string) =>
    supabase
      .from('challenges')
      .select('id, title, description')
      .textSearch('title', query)
      .limit(20)
};
```

### **Caching Strategies**
```typescript
// React Query integration for caching
export const challengeQueries = {
  all: ['challenges'] as const,
  lists: () => [...challengeQueries.all, 'list'] as const,
  list: (filters: string) => [...challengeQueries.lists(), { filters }] as const,
  details: () => [...challengeQueries.all, 'detail'] as const,
  detail: (id: string) => [...challengeQueries.details(), id] as const,
};

export const useChallenges = (workspaceId?: string) => {
  return useQuery({
    queryKey: challengeQueries.list(workspaceId || 'all'),
    queryFn: () => 
      workspaceId 
        ? challengeRepository.findByWorkspace(workspaceId)
        : challengeRepository.findAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  });
};
```

## 🛡️ **ROW LEVEL SECURITY (RLS)**

### **Policy Examples**
```sql
-- Enable RLS on all tables
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Users can only see challenges in their workspaces
CREATE POLICY "Users can view workspace challenges" ON challenges
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Users can create challenges in workspaces they manage
CREATE POLICY "Managers can create challenges" ON challenges
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );
```

### **Security Best Practices**
```typescript
// Always validate user permissions in application code too
export const validateWorkspaceAccess = async (
  userId: string,
  workspaceId: string,
  requiredRole?: WorkspaceRole
) => {
  const { data, error } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('user_id', userId)
    .eq('workspace_id', workspaceId)
    .single();
  
  if (error || !data) {
    throw new Error('Access denied: Not a workspace member');
  }
  
  if (requiredRole && !hasRequiredRole(data.role, requiredRole)) {
    throw new Error('Access denied: Insufficient permissions');
  }
  
  return data.role;
};
```

## 📊 **ERROR HANDLING & LOGGING**

### **Centralized Error Handler**
```typescript
// src/utils/supabaseErrorHandler.ts
export class SupabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'SupabaseError';
  }
}

export const handleSupabaseError = (error: any): never => {
  console.error('Supabase Error:', error);
  
  // Map common Supabase errors to user-friendly messages
  const errorMessages: Record<string, string> = {
    'PGRST116': 'Resource not found',
    '23505': 'A record with this information already exists',
    '23503': 'Cannot delete: Referenced by other records',
    'auth/invalid-email': 'Invalid email address',
    'auth/user-not-found': 'User not found',
    'auth/wrong-password': 'Incorrect password'
  };
  
  const userMessage = errorMessages[error.code] || 
                     error.message || 
                     'An unexpected error occurred';
  
  throw new SupabaseError(userMessage, error.code, error.details);
};
```

## 📈 **PERFORMANCE MONITORING**

### **Query Performance Tracking**
```typescript
// src/utils/performanceMonitor.ts
export const monitorQuery = async <T>(
  queryName: string,
  queryFn: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await queryFn();
    const duration = performance.now() - startTime;
    
    // Log slow queries (> 1 second)
    if (duration > 1000) {
      console.warn(`Slow query detected: ${queryName} took ${duration}ms`);
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(`Query failed: ${queryName} (${duration}ms)`, error);
    throw error;
  }
};
```

---

*Supabase integration provides a robust, scalable backend for the innovation platform.*