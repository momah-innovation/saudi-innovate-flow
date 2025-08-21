# 🔧 System Maintenance Guide

## 📋 **MAINTENANCE OVERVIEW**

### **Maintenance Philosophy**
The Ruwād Innovation Platform is designed for **minimal maintenance overhead** while ensuring **maximum reliability and performance**. This guide covers all aspects of ongoing system maintenance, from daily monitoring to major updates.

### **Maintenance Categories**
- **Preventive Maintenance**: Regular tasks to prevent issues
- **Corrective Maintenance**: Fixing identified problems  
- **Adaptive Maintenance**: Updates for changing requirements
- **Perfective Maintenance**: Performance and feature improvements

---

## 📅 **MAINTENANCE SCHEDULE**

### **Daily Tasks (5-10 minutes)**
```bash
# 1. System Health Check
# Check application availability
curl -I https://your-domain.com
# Expected: HTTP 200 status

# Check Supabase status  
curl -I https://your-project.supabase.co/rest/v1/
# Expected: HTTP 200 status

# 2. Error Log Review
# Supabase Dashboard → Logs → Filter by ERROR level
# Look for: New errors, repeated issues, performance problems

# 3. Performance Metrics
# Monitor key metrics:
# - Page load times < 3 seconds
# - API response times < 500ms  
# - Database query performance
# - User session errors
```

### **Weekly Tasks (30-60 minutes)**
```bash
# 1. Dependency Updates
npm outdated
npm audit
npm update

# Critical security updates only
npm audit fix

# 2. Database Maintenance
# Check table sizes and growth
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

# 3. Backup Verification
# Verify Supabase automatic backups
# Test restore procedure monthly

# 4. Performance Review
npm run analyze
# Review bundle sizes and optimization opportunities
```

### **Monthly Tasks (2-4 hours)**
```bash
# 1. Comprehensive Security Review
# Review user access and permissions
# Check for inactive users
# Verify RLS policies are working correctly

# 2. Database Optimization
# Analyze query performance
# Update table statistics
# Consider new indexes for slow queries

# 3. Documentation Updates
# Review and update technical documentation
# Update troubleshooting guides with new issues
# Verify setup instructions are current

# 4. Disaster Recovery Testing
# Test backup restore procedures
# Verify monitoring and alerting systems
# Review incident response procedures
```

### **Quarterly Tasks (1 day)**
```bash
# 1. Major Version Updates
# Plan and test major dependency updates
# Review breaking changes and migration paths
# Schedule maintenance windows for updates

# 2. Architecture Review
# Assess system performance under current load
# Plan for scaling requirements
# Review and optimize database schema

# 3. Security Audit
# Conduct comprehensive security review
# Update security policies and procedures
# Review third-party service integrations

# 4. Business Continuity Testing
# Test complete disaster recovery procedures
# Verify data backup integrity
# Update emergency contact information
```

---

## 🗄️ **DATABASE MAINTENANCE**

### **Regular Database Tasks**

#### **Query Performance Monitoring**
```sql
-- 1. Identify slow queries (run weekly)
SELECT 
  query,
  mean_exec_time,
  calls,
  total_exec_time,
  rows,
  100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements
WHERE mean_exec_time > 100  -- Queries taking >100ms
ORDER BY mean_exec_time DESC
LIMIT 20;

-- 2. Check index usage (run monthly)
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_tup_read,
  idx_tup_fetch,
  idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0  -- Unused indexes
ORDER BY pg_relation_size(indexrelid) DESC;

-- 3. Table maintenance (run monthly)
VACUUM ANALYZE;  -- Supabase handles this automatically, but verify
```

#### **Data Cleanup Procedures**
```sql
-- 1. Clean expired sessions (run weekly)
DELETE FROM auth.sessions 
WHERE expires_at < NOW() - INTERVAL '7 days';

-- 2. Archive old audit logs (run monthly)
-- Move logs older than 1 year to archive table
WITH archived_logs AS (
  DELETE FROM audit_logs 
  WHERE created_at < NOW() - INTERVAL '1 year'
  AND severity_level NOT IN ('ERROR', 'CRITICAL')
  RETURNING *
)
INSERT INTO audit_logs_archive 
SELECT * FROM archived_logs;

-- 3. Clean up temporary files (run daily)
DELETE FROM temporary_uploads 
WHERE created_at < NOW() - INTERVAL '24 hours';

-- 4. Update analytics aggregations (run daily)
REFRESH MATERIALIZED VIEW challenge_performance_summary;
REFRESH MATERIALIZED VIEW user_engagement_summary;
```

### **Backup Management**
```bash
# Supabase automatically handles backups, but verify:

# 1. Check backup status
# Supabase Dashboard → Settings → Database → Backups
# Verify: Daily backups are successful
# Verify: Point-in-time recovery is available

# 2. Test restore procedure (monthly)
# Create test project
# Restore from backup
# Verify data integrity
# Document any issues

# 3. Download critical data backups (weekly)
# Export critical configuration data
# Store securely offline
# Verify backup completeness
```

---

## 🔐 **SECURITY MAINTENANCE**

### **Access Control Review**

#### **User Account Audit (Monthly)**
```sql
-- 1. Review user accounts and roles
SELECT 
  up.email,
  up.role,
  up.is_active,
  up.last_login_at,
  o.name as organization
FROM user_profiles up
JOIN organizations o ON up.organization_id = o.id
WHERE up.last_login_at < NOW() - INTERVAL '90 days'
OR up.is_active = false
ORDER BY up.last_login_at ASC;

-- 2. Review admin accounts
SELECT 
  email,
  role,
  created_at,
  last_login_at
FROM user_profiles 
WHERE role IN ('admin', 'super_admin')
ORDER BY last_login_at DESC;

-- 3. Review expert assignments
SELECT 
  ea.expert_id,
  up.email,
  COUNT(*) as active_assignments,
  MAX(ea.assignment_date) as latest_assignment
FROM expert_assignments ea
JOIN expert_profiles ep ON ea.expert_id = ep.id
JOIN user_profiles up ON ep.user_profile_id = up.id
WHERE ea.status IN ('pending', 'active')
GROUP BY ea.expert_id, up.email
HAVING COUNT(*) > 10  -- Flag experts with many assignments
ORDER BY COUNT(*) DESC;
```

#### **RLS Policy Validation (Quarterly)**
```sql
-- Test RLS policies with different user contexts
-- 1. Test organization isolation
SET ROLE authenticated;
SET request.jwt.claims TO '{"sub": "test-user-1", "org_id": "org-1"}';

-- Should only return data for org-1
SELECT COUNT(*) FROM challenges;
SELECT COUNT(*) FROM ideas;
SELECT COUNT(*) FROM user_profiles;

-- 2. Test role-based access
SET request.jwt.claims TO '{"sub": "test-admin", "role": "admin"}';
-- Should have admin access
SELECT COUNT(*) FROM audit_logs;

SET request.jwt.claims TO '{"sub": "test-user", "role": "user"}';  
-- Should not have admin access
SELECT COUNT(*) FROM audit_logs;  -- Should return 0 or error
```

### **Security Updates**
```bash
# 1. Dependency security updates (weekly)
npm audit
npm audit fix --force  # Only for critical vulnerabilities

# 2. Monitor security advisories
# Subscribe to:
# - Node.js security announcements
# - React security updates  
# - Supabase security bulletins
# - npm security advisories

# 3. Review third-party integrations (monthly)
# Check for:
# - Updated API keys and tokens
# - Deprecated API endpoints
# - New security requirements
# - Certificate expirations
```

---

## ⚡ **PERFORMANCE MAINTENANCE**

### **Performance Monitoring**

#### **Frontend Performance (Weekly)**
```bash
# 1. Bundle analysis
npm run build
npm run analyze

# Check for:
# - Bundle size increases >10%
# - New large dependencies
# - Code splitting effectiveness
# - Unused code elimination

# 2. Core Web Vitals monitoring
# Use Lighthouse CI or similar tool
# Target metrics:
# - First Contentful Paint: <1.8s
# - Largest Contentful Paint: <2.5s  
# - First Input Delay: <100ms
# - Cumulative Layout Shift: <0.1

# 3. Runtime performance
# Use React DevTools Profiler
# Identify components with:
# - Long render times
# - Unnecessary re-renders
# - Memory leaks
```

#### **Backend Performance (Weekly)**
```sql
-- 1. Database query performance
SELECT 
  calls,
  total_exec_time / calls as avg_time_ms,
  query
FROM pg_stat_statements
WHERE calls > 100  -- Frequently called queries
ORDER BY total_exec_time / calls DESC
LIMIT 10;

-- 2. Connection monitoring
SELECT 
  count(*) as active_connections,
  max(now() - backend_start) as longest_connection
FROM pg_stat_activity
WHERE state = 'active';

-- 3. Table bloat analysis
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
  pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as index_size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### **Performance Optimization Tasks**

#### **Database Optimization (Monthly)**
```sql
-- 1. Update table statistics
ANALYZE;  -- Updates optimizer statistics

-- 2. Reindex heavily used tables (quarterly)
REINDEX TABLE challenges;
REINDEX TABLE ideas;
REINDEX TABLE user_profiles;

-- 3. Check for missing indexes
-- Look for high-cost sequential scans in pg_stat_statements
SELECT 
  schemaname,
  tablename,
  seq_scan,
  seq_tup_read,
  seq_tup_read / seq_scan as avg_seq_tup_read
FROM pg_stat_user_tables
WHERE seq_scan > 0
ORDER BY seq_tup_read DESC;
```

#### **Frontend Optimization (Monthly)**
```javascript
// 1. Code splitting audit
// Ensure lazy loading for:
// - Route components
// - Large libraries
// - Infrequently used components

const AdminPanel = lazy(() => import('./AdminPanel'));
const ReportsPage = lazy(() => import('./ReportsPage'));

// 2. Memory leak prevention
// Review for:
// - Uncleared intervals/timeouts
// - Unremoved event listeners  
// - Unclosed subscriptions
// - Circular references

// 3. Cache optimization
// Review TanStack Query cache settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
    },
  },
});
```

---

## 📊 **MONITORING & ALERTING**

### **Application Monitoring**

#### **Health Check Endpoints**
```typescript
// Implement health check endpoints for monitoring
// /api/health - Basic availability
export const healthCheck = async () => {
  try {
    // Test database connection
    const { error } = await supabase
      .from('health_check')
      .select('id')
      .limit(1);
      
    if (error) throw error;
    
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return { 
      status: 'unhealthy', 
      error: error.message, 
      timestamp: new Date().toISOString() 
    };
  }
};

// /api/health/detailed - Comprehensive system check
export const detailedHealthCheck = async () => {
  const checks = {
    database: await checkDatabase(),
    auth: await checkAuth(),
    storage: await checkStorage(),
    realtime: await checkRealtime()
  };
  
  const allHealthy = Object.values(checks).every(check => check.status === 'healthy');
  
  return {
    status: allHealthy ? 'healthy' : 'degraded',
    checks,
    timestamp: new Date().toISOString()
  };
};
```

#### **Performance Metrics Collection**
```typescript
// Custom metrics collection
interface MetricsData {
  pageLoadTime: number;
  apiResponseTime: number;
  errorRate: number;
  userSessions: number;
  databaseConnections: number;
}

const collectMetrics = async (): Promise<MetricsData> => {
  // Collect and return metrics
  // Send to monitoring service
};

// Error tracking
window.addEventListener('error', (event) => {
  // Log errors to monitoring service
  console.error('Application error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack
  });
});
```

### **Alerting Configuration**

#### **Critical Alerts (Immediate Response)**
```bash
# Set up alerts for:
# - Application downtime (>1 minute)
# - Database connection failures
# - High error rates (>5% of requests)
# - Critical security events
# - Backup failures

# Alert channels:
# - Email: technical team
# - SMS: on-call engineer  
# - Slack: team channel
# - Phone: escalation contact
```

#### **Warning Alerts (Review Within 4 Hours)**
```bash
# Set up warnings for:
# - Slow response times (>3 seconds)
# - High memory usage (>80%)
# - Database query performance degradation
# - Unusual user activity patterns
# - Certificate expiration (30 days)

# Alert channels:
# - Email: technical team
# - Slack: team channel
```

---

## 🔄 **UPDATE PROCEDURES**

### **Dependency Updates**

#### **Regular Updates (Weekly)**
```bash
# 1. Check for updates
npm outdated

# 2. Update patch versions (safe)
npm update

# 3. Review and test
npm run type-check
npm run lint  
npm run test
npm run build

# 4. Commit updates
git add package*.json
git commit -m "chore: update dependencies to latest patch versions"
```

#### **Major Updates (Monthly/Quarterly)**
```bash
# 1. Plan major updates
npm outdated --depth=0

# 2. Update one major dependency at a time
npm install react@latest react-dom@latest
npm run test  # Verify no breaking changes

# 3. Update related packages
npm install @types/react@latest @types/react-dom@latest

# 4. Test thoroughly
npm run type-check
npm run test
npm run build
npm run test:e2e  # If available

# 5. Document breaking changes
# Update CHANGELOG.md with any breaking changes
# Update team documentation
```

### **System Updates**

#### **Supabase Updates**
```bash
# Monitor Supabase changelog
# https://supabase.com/changelog

# Before major Supabase updates:
# 1. Review breaking changes
# 2. Test in staging environment
# 3. Plan migration if needed
# 4. Schedule maintenance window
# 5. Prepare rollback plan
```

#### **Node.js Updates**
```bash
# Update Node.js (quarterly)
# 1. Check current LTS version
node --version

# 2. Update using nvm
nvm install --lts
nvm use --lts
nvm alias default node

# 3. Verify application compatibility
npm install
npm run dev
npm run build
npm run test

# 4. Update CI/CD pipelines
# Update GitHub Actions, Docker files, etc.
```

---

## 📋 **MAINTENANCE CHECKLISTS**

### **Daily Checklist (5 minutes)**
```bash
☐ Check application availability (curl test)
☐ Review error logs (past 24 hours)  
☐ Monitor system performance metrics
☐ Verify backup completion
☐ Check security alerts
```

### **Weekly Checklist (30 minutes)**
```bash
☐ Update patch-level dependencies
☐ Review database performance metrics
☐ Analyze bundle size and performance
☐ Check for security advisories
☐ Clean up temporary files and data
☐ Review user activity and access
☐ Update documentation as needed
```

### **Monthly Checklist (2-4 hours)**
```bash
☐ Conduct security access review
☐ Optimize database queries and indexes
☐ Test backup restore procedures  
☐ Review and update monitoring/alerts
☐ Plan and test major dependency updates
☐ Analyze performance trends
☐ Update system documentation
☐ Review incident reports and lessons learned
```

### **Quarterly Checklist (1 day)**
```bash
☐ Comprehensive security audit
☐ Architecture and scalability review
☐ Disaster recovery testing
☐ Major system updates and migrations
☐ Performance benchmarking
☐ Documentation comprehensive review
☐ Team training and knowledge sharing
☐ Business continuity planning update
```

---

## 📞 **MAINTENANCE CONTACTS**

### **Primary Responsibilities**
- **System Administrator**: Daily monitoring, basic maintenance
- **Database Administrator**: Database optimization, backup management
- **Security Officer**: Access review, security updates
- **DevOps Engineer**: Infrastructure, deployment, monitoring
- **Technical Lead**: Architecture decisions, major updates

### **Escalation Procedures**
1. **Level 1**: System Administrator (daily issues)
2. **Level 2**: Technical Lead (complex problems)  
3. **Level 3**: External vendors (Supabase, hosting provider)
4. **Emergency**: On-call engineer (24/7 critical issues)

---

This comprehensive maintenance guide ensures the Ruwād Innovation Platform remains secure, performant, and reliable with minimal manual intervention. Regular adherence to these procedures prevents most issues and ensures rapid resolution when problems occur.

*For emergency procedures and incident response, see [Emergency Procedures](./Emergency-Procedures.md).*