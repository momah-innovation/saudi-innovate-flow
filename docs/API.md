# API Documentation

## Supabase Integration Guide

### Authentication Patterns

#### Basic Authentication Setup
```typescript
import { supabase } from '@/integrations/supabase/client'

// Sign in with email/password
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Sign out
await supabase.auth.signOut()

// Get current session
const { data: { session } } = await supabase.auth.getSession()
```

#### Role-Based Access Control
```typescript
// Check user role
const getUserRole = async (userId: string) => {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', userId)
    .single()
  
  return data?.role
}

// Protect routes based on role
const requireRole = (allowedRoles: string[]) => {
  const userRole = getUserRole(user.id)
  return allowedRoles.includes(userRole)
}
```

### Database Queries

#### Basic CRUD Operations
```typescript
// Create
const { data, error } = await supabase
  .from('challenges')
  .insert([{ title: 'New Challenge', description: 'Description' }])

// Read with filters
const { data } = await supabase
  .from('challenges')
  .select('*')
  .eq('status', 'active')
  .order('created_at', { ascending: false })

// Update
const { data, error } = await supabase
  .from('challenges')
  .update({ status: 'completed' })
  .eq('id', challengeId)

// Delete
const { error } = await supabase
  .from('challenges')
  .delete()
  .eq('id', challengeId)
```

#### Advanced Queries with Joins
```typescript
const { data } = await supabase
  .from('challenges')
  .select(`
    *,
    profiles:user_id (
      full_name,
      avatar_url
    ),
    ideas (
      id,
      title,
      status
    )
  `)
  .eq('status', 'active')
```

### Real-Time Subscriptions

#### Challenge Updates
```typescript
const challengeSubscription = supabase
  .channel('challenges')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'challenges' },
    (payload) => {
      console.log('Challenge updated:', payload)
      // Update UI state
    }
  )
  .subscribe()

// Cleanup
challengeSubscription.unsubscribe()
```

#### User-Specific Notifications
```typescript
const userNotifications = supabase
  .channel(`user-${userId}`)
  .on('postgres_changes',
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'notifications',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      // Show notification
      toast({
        title: payload.new.title,
        description: payload.new.message
      })
    }
  )
  .subscribe()
```

### File Storage

#### Upload Files
```typescript
const uploadFile = async (file: File, bucket: string, path: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) throw error
  return data
}

// Get public URL
const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}
```

#### Download Files
```typescript
const downloadFile = async (bucket: string, path: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(path)
  
  if (error) throw error
  return data
}
```

### Error Handling

#### Standard Error Patterns
```typescript
const handleSupabaseError = (error: any) => {
  if (error?.code === 'PGRST301') {
    // Row Level Security violation
    toast({
      title: "Access Denied",
      description: "You don't have permission to perform this action",
      variant: "destructive"
    })
  } else if (error?.code === '23505') {
    // Unique constraint violation
    toast({
      title: "Duplicate Entry",
      description: "This record already exists",
      variant: "destructive"
    })
  } else {
    // Generic error
    toast({
      title: "Error",
      description: error?.message || "Something went wrong",
      variant: "destructive"
    })
  }
}
```

### Performance Optimization

#### Query Optimization
```typescript
// Use select to limit columns
const { data } = await supabase
  .from('challenges')
  .select('id, title, status') // Only fetch needed columns
  .limit(10)

// Use single() for unique records
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', userId)
  .single()

// Use pagination
const { data } = await supabase
  .from('challenges')
  .select('*')
  .range(0, 9) // First 10 records
```

#### Connection Pooling
```typescript
// Configure client options
const supabase = createClient(url, key, {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-application-name': 'ruwad-innovation' },
  },
})
```

### Security Best Practices

#### Row Level Security Policies
```sql
-- Enable RLS on all tables
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own challenges" ON challenges
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own data
CREATE POLICY "Users can insert own challenges" ON challenges
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

#### Input Validation
```typescript
// Use Zod for validation
import { z } from 'zod'

const challengeSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(1000),
  deadline: z.date().min(new Date())
})

const validateChallenge = (data: unknown) => {
  return challengeSchema.parse(data)
}
```