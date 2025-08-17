# Supabase Integration Services

Comprehensive documentation for all Supabase-based backend services and integrations.

## 🎯 Core Supabase Services

### 🗄️ Database Services

#### **Supabase Client Configuration**
**Location**: `src/integrations/supabase/client.ts`

```typescript
import { supabase } from "@/integrations/supabase/client";

// Pre-configured with:
// - Authentication storage
// - Auto token refresh
// - Instrumented fetch for logging
// - Performance monitoring
```

**Features**:
- **Instrumented Requests**: Automatic logging of all Supabase requests
- **Performance Tracking**: Response time monitoring
- **Error Handling**: Centralized error logging
- **Auto-reconnection**: Automatic connection management

#### **Database Schema Management**
**Location**: `src/integrations/supabase/types.ts` (Read-only)

Auto-generated TypeScript types from Supabase schema:
- **Tables**: Complete type definitions for all database tables
- **Views**: Materialized and regular view types
- **Functions**: Database function signatures
- **Enums**: Database enum types

### 🔐 Authentication Services

#### **User Authentication**
```typescript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Logout
const { error } = await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

#### **Role-Based Access Control**
- **RLS Policies**: Row-level security enforcement
- **User Roles**: Granular permission system
- **Session Management**: Secure session handling
- **Multi-factor Authentication**: Enhanced security

### 📁 Storage Services

#### **File Upload & Management**
**Location**: `src/components/ui/FileUploadField.tsx`

```typescript
// Upload file
const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload('file-path', file);

// Get public URL
const { data } = supabase.storage
  .from('bucket-name')
  .getPublicUrl('file-path');

// Delete file
const { error } = await supabase.storage
  .from('bucket-name')
  .remove(['file-path']);
```

**Storage Buckets**:
- **avatars**: User profile pictures (public)
- **documents**: Private document storage
- **attachments**: File attachments for challenges/ideas
- **assets**: Public static assets

### 🔄 Real-time Services

#### **Live Data Synchronization**
```typescript
// Subscribe to table changes
const subscription = supabase
  .channel('table-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'challenges' },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

#### **Presence Tracking**
```typescript
// Track user presence
const channel = supabase.channel('collaboration')
  .on('presence', { event: 'sync' }, () => {
    const newState = channel.presenceState();
    console.log('sync', newState);
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({
        user_id: 'user-123',
        online_at: new Date().toISOString(),
      });
    }
  });
```

## 📊 Data Management Hooks

### 🎯 Challenge Management
**Location**: `src/hooks/useChallengeManagement.ts`

```typescript
const {
  challenges,
  sectors,
  departments,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  loading,
  error
} = useChallengeManagement();
```

**Database Operations**:
- Multi-table queries with joins
- Relationship management (sectors, departments, deputies)
- Bulk operations for efficiency
- Real-time data synchronization

### 📅 Campaign Management
**Location**: `src/hooks/useCampaignManagement.ts`

```typescript
const {
  campaigns,
  availableData,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaignFormData
} = useCampaignManagement();
```

**Features**:
- Complex relationship management
- Link tables for many-to-many relationships
- Batch operations for performance
- Data validation and integrity

### 📈 Analytics Integration
**Location**: `src/hooks/useAnalyticsTracking.ts`

```typescript
const { trackEvent, getAnalytics } = useAnalyticsTracking();

// Track user events
await trackEvent('challenge_viewed', {
  challenge_id: 'uuid',
  user_id: 'uuid',
  timestamp: new Date().toISOString()
});
```

**Analytics Tables**:
- **analytics_events**: User interaction tracking
- **user_behavior_predictions**: AI-driven insights
- **competitive_intelligence**: Market analysis
- **performance_metrics**: System performance data

## 🔍 Advanced Query Patterns

### **Complex Joins**
```typescript
// Multi-table join with filtering
const { data } = await supabase
  .from('challenges')
  .select(`
    *,
    sectors:challenge_sector_links(sector:sectors(*)),
    departments:challenge_department_links(department:departments(*)),
    submissions:challenge_submissions(count)
  `)
  .eq('status', 'active')
  .order('created_at', { ascending: false });
```

### **Aggregation Queries**
```typescript
// Count and statistics
const { data } = await supabase
  .from('challenges')
  .select('status, count(*)')
  .group('status');
```

### **Full-text Search**
```typescript
// Search with text matching
const { data } = await supabase
  .from('challenges')
  .select('*')
  .textSearch('title_ar', searchQuery)
  .limit(20);
```

## 🛡️ Security Implementation

### **Row Level Security (RLS)**

#### **User Data Protection**
```sql
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Admin access to all data
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role_name = 'admin'
    )
  );
```

#### **Content Access Control**
```sql
-- Public content visibility
CREATE POLICY "Public challenges visible to all" ON challenges
  FOR SELECT USING (visibility = 'public');

-- Private content access
CREATE POLICY "Private challenges for authorized users" ON challenges
  FOR SELECT USING (
    visibility = 'private' AND (
      created_by = auth.uid() OR
      EXISTS (SELECT 1 FROM challenge_participants WHERE challenge_id = id AND user_id = auth.uid())
    )
  );
```

### **Data Validation**

#### **Trigger-based Validation**
```sql
-- Validate date ranges
CREATE OR REPLACE FUNCTION validate_challenge_dates()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.end_date < NEW.start_date THEN
    RAISE EXCEPTION 'End date must be after start date';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_challenge_dates_trigger
  BEFORE INSERT OR UPDATE ON challenges
  FOR EACH ROW EXECUTE FUNCTION validate_challenge_dates();
```

## 📊 Performance Optimization

### **Query Optimization**
- **Indexes**: Strategic index placement for common queries
- **Materialized Views**: Pre-computed aggregations
- **Connection Pooling**: Efficient connection management
- **Query Caching**: Reduced database load

### **Real-time Optimization**
- **Channel Management**: Efficient subscription handling
- **Payload Filtering**: Minimized data transfer
- **Presence Batching**: Optimized presence updates
- **Connection Limits**: Resource management

## 🔧 Development Patterns

### **Hook-based Data Access**
```typescript
// Standard hook pattern
export function useEntityData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from('entity')
        .select('*');
      
      if (error) throw error;
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, refetch: fetchData };
}
```

### **Error Handling**
```typescript
// Centralized error handling
const handleSupabaseError = (error: any, context: string) => {
  console.error(`Supabase error in ${context}:`, error);
  
  // Log to monitoring service
  logger.error('Supabase operation failed', {
    component: context,
    error: error.message,
    code: error.code
  });
  
  // User-friendly error message
  return {
    message: error.message || 'An unexpected error occurred',
    code: error.code,
    context
  };
};
```

## 📈 Monitoring & Analytics

### **Request Logging**
- **Automatic Instrumentation**: All requests logged automatically
- **Performance Metrics**: Response time tracking
- **Error Tracking**: Failed request monitoring
- **Usage Patterns**: Query frequency analysis

### **Health Monitoring**
- **Connection Status**: Database connectivity checks
- **Query Performance**: Slow query detection
- **Resource Usage**: Connection pool monitoring
- **Service Availability**: Uptime tracking

## 🚀 Best Practices

### **Data Access Patterns**
1. **Use Hooks**: Consistent data access patterns
2. **Handle Loading States**: Proper UX during data fetch
3. **Error Boundaries**: Graceful error handling
4. **Optimistic Updates**: Immediate UI feedback
5. **Cache Management**: Efficient data caching

### **Security Guidelines**
1. **RLS Enforcement**: Always enable RLS on tables
2. **Input Validation**: Server-side validation
3. **SQL Injection Prevention**: Parameterized queries
4. **Audit Logging**: Track all data changes
5. **Access Control**: Principle of least privilege

### **Performance Guidelines**
1. **Query Optimization**: Efficient query patterns
2. **Index Strategy**: Proper index usage
3. **Connection Management**: Efficient connection usage
4. **Caching Strategy**: Appropriate cache implementation
5. **Real-time Efficiency**: Minimal subscription overhead

---

*Supabase Services: 15+ integration points documented*
*Security: RLS policies implemented across all tables*
*Performance: Optimized for enterprise scale*
*Status: ✅ Production ready with comprehensive monitoring*