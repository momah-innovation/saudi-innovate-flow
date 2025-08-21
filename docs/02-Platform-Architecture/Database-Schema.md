# 🗄️ Database Schema Documentation

## 📊 **SCHEMA OVERVIEW**
Complete database structure for the Ruwād Innovation Platform with **80+ tables**, detailed entity relationships, constraints, and comprehensive security policies. This is a **fully implemented production database** supporting enterprise-grade innovation management.

## ⚠️ **CURRENT SECURITY STATUS**
**9 Security Issues Detected** by Supabase Linter:
- 6 **ERRORS**: Security Definer Views requiring review
- 2 **WARNINGS**: Function search path issues 
- 1 **WARNING**: Leaked password protection disabled

**Recommendation**: Address security definer views and enable password protection.

## 🏗️ **CORE DATABASE ARCHITECTURE**

### **User Management & Authentication Schema**

<lov-mermaid>
erDiagram
    auth_users {
        uuid id PK
        text email
        timestamp created_at
        timestamp updated_at
        jsonb raw_user_meta_data
    }
    
    profiles {
        uuid id PK
        uuid user_id FK
        text display_name
        text avatar_url
        text bio
        timestamp created_at
        timestamp updated_at
        timestamp last_sign_in_at
    }
    
    user_roles {
        uuid id PK
        uuid user_id FK
        app_role role
        boolean is_active
        timestamp expires_at
        timestamp granted_at
    }
    
    auth_users ||--|| profiles : has
    profiles ||--o{ user_roles : assigned
</lov-mermaid>

### **Role-Based Access Control**

```sql
-- App roles enum with comprehensive permissions
CREATE TYPE public.app_role AS ENUM (
    'super_admin',
    'admin', 
    'organization_admin',
    'challenge_manager',
    'team_lead',
    'team_member',
    'expert',
    'innovator',
    'partner',
    'evaluator',
    'stakeholder',
    'mentor',
    'role_manager'
);

-- User roles table with temporal access
CREATE TABLE public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    role app_role NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, role)
);
```

## 🏢 **WORKSPACE & ORGANIZATION SCHEMA**

### **Multi-Tenant Architecture**

```sql
-- Workspaces table
CREATE TABLE public.workspaces (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    owner_id UUID NOT NULL,
    privacy_level TEXT DEFAULT 'private',
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Workspace membership
CREATE TABLE public.workspace_members (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    status TEXT NOT NULL DEFAULT 'active',
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(workspace_id, user_id)
);
```

## 📊 **DATABASE COMPREHENSIVE OVERVIEW**

### **Complete Table Categories (80+ Tables)**

<lov-mermaid>
graph TB
    subgraph "User Management (8 tables)"
        A[profiles]
        B[user_roles] 
        C[user_activity_summary]
        D[innovation_team_members]
    end
    
    subgraph "Workspace System (6 tables)"
        E[workspaces]
        F[workspace_members]
        G[workspace_analytics]
        H[workspace_activity_feed]
    end
    
    subgraph "Challenge System (12 tables)"
        I[challenges]
        J[challenge_submissions]
        K[challenge_participants]
        L[challenge_analytics]
        M[challenge_comments]
        N[challenge_likes]
        O[challenge_bookmarks]
    end
    
    subgraph "Campaign System (8 tables)"
        P[campaigns]
        Q[campaign_partners]
        R[campaign_department_links]
        S[campaign_challenge_links]
    end
    
    subgraph "AI & Analytics (10+ tables)"
        T[ai_preferences]
        U[ai_usage_tracking]
        V[analytics_events]
        W[ai_tag_suggestions]
    end
    
    subgraph "Security & Audit (8+ tables)"
        X[security_audit_log]
        Y[rate_limits]
        Z[suspicious_activities]
        AA[access_control_audit_log]
    end
    
    subgraph "File Management (6+ tables)"
        BB[file_records]
        CC[file_versions]
        DD[file_lifecycle_events]
        EE[bookmark_collections]
    end
</lov-mermaid>

### **Key Database Categories**
- **User Management**: 8+ tables for profiles, roles, activity tracking
- **Workspace System**: 6+ tables for multi-tenant architecture
- **Challenge System**: 12+ tables for innovation challenges and submissions
- **Campaign System**: 8+ tables for campaign management and partnerships
- **Event System**: 6+ tables for event management and participation
- **AI Integration**: 10+ tables for AI features, usage, and preferences
- **Analytics System**: 8+ tables for comprehensive usage analytics
- **Security & Audit**: 8+ tables for security monitoring and audit trails
- **File Management**: 6+ tables for advanced file versioning and storage
- **Organizational Structure**: 15+ tables for departments, sectors, partners
- **Notification System**: 4+ tables for real-time notifications

### **Advanced Database Features Implemented**
```sql
-- Role-based access with comprehensive permissions
CREATE TYPE public.app_role AS ENUM (
    'super_admin', 'admin', 'organization_admin',
    'challenge_manager', 'team_lead', 'team_member',
    'expert', 'innovator', 'partner', 'evaluator',
    'stakeholder', 'mentor', 'role_manager'
);

-- Workspace-scoped data access
CREATE POLICY "workspace_scoped_access" ON table_name FOR SELECT 
USING (has_workspace_access(workspace_id, auth.uid()));

-- Challenge sensitivity-based access
CREATE POLICY "sensitivity_based_access" ON challenges FOR SELECT 
USING (user_has_access_to_challenge(id));
```

## 📊 **ANALYTICS & AI SCHEMA**

### **Comprehensive Analytics Tables**

```sql
-- Analytics events for usage tracking
CREATE TABLE public.analytics_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    event_type TEXT NOT NULL,
    event_category TEXT,
    entity_type TEXT,
    entity_id UUID,
    properties JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
    processed BOOLEAN DEFAULT false
);

-- AI usage tracking
CREATE TABLE public.ai_usage_tracking (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    feature_name TEXT NOT NULL,
    usage_type TEXT NOT NULL,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    cost_estimate NUMERIC DEFAULT 0.0,
    success BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI preferences per user
CREATE TABLE public.ai_preferences (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    ai_enabled BOOLEAN DEFAULT true,
    language_preference TEXT DEFAULT 'ar',
    creativity_level TEXT DEFAULT 'balanced',
    notification_preferences JSONB DEFAULT '{}',
    custom_prompts JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## 🔐 **ROW LEVEL SECURITY POLICIES**

### **Comprehensive Security Implementation**

```sql
-- Enable RLS on all sensitive tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Example: Challenge access policy with sensitivity levels
CREATE POLICY "Users can view challenges based on sensitivity" 
ON public.challenges FOR SELECT 
USING (
    CASE 
        WHEN sensitivity_level IN ('normal', 'public') THEN true
        WHEN sensitivity_level IN ('restricted', 'confidential') THEN 
            user_has_access_to_challenge(id)
        ELSE false
    END
);

-- Example: Workspace-scoped data access
CREATE POLICY "Users can view workspace data they belong to" 
ON public.workspace_members FOR SELECT 
USING (
    workspace_id IN (
        SELECT workspace_id 
        FROM public.workspace_members 
        WHERE user_id = auth.uid() AND status = 'active'
    )
);
```

## 🗃️ **STORAGE & FILE MANAGEMENT**

### **Advanced File System**

```sql
-- File records with versioning
CREATE TABLE public.file_records (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    original_filename TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    uploader_id UUID NOT NULL,
    workspace_id UUID,
    is_public BOOLEAN DEFAULT false,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- File versions for version control
CREATE TABLE public.file_versions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    file_record_id UUID NOT NULL,
    version_number INTEGER NOT NULL,
    storage_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    is_current BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID NOT NULL
);
```

## 📈 **DATABASE FUNCTIONS & TRIGGERS**

### **30+ Implemented Functions**

**Security & Access Control:**
- `has_role(user_id, role)` - Role validation
- `user_has_access_to_challenge(challenge_id)` - Challenge access control
- `has_workspace_access(workspace_id, user_id)` - Workspace permissions

**Analytics & Reporting:**
- `get_analytics_data(user_id, role, filters)` - Comprehensive analytics
- `get_security_analytics(user_id)` - Security metrics
- `get_role_specific_analytics(user_id, role, filters)` - Role-based analytics

**Data Management:**
- `update_user_activity_summary(user_id)` - User activity aggregation
- `update_workspace_analytics()` - Workspace metrics calculation
- `log_security_event()` - Security audit logging

**File Operations:**
- `get_storage_analytics_with_trends()` - Storage usage analytics
- `bulk_cleanup_files()` - File maintenance operations
- `restore_file_version(version_id)` - Version control management

## 🔍 **MONITORING & AUDIT**

### **Security Audit System**

```sql
-- Comprehensive security audit logging
CREATE TABLE public.security_audit_log (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    action_type TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    details JSONB DEFAULT '{}',
    risk_level TEXT DEFAULT 'low',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Rate limiting and suspicious activity tracking
CREATE TABLE public.rate_limits (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    request_type TEXT NOT NULL,
    request_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## 📊 **DATABASE STATISTICS**

### **Current Implementation Scale**
- **Total Tables**: 80+ tables
- **RLS Policies**: 100+ comprehensive policies
- **Database Functions**: 30+ functions for business logic
- **Audit Tables**: Complete audit trail system
- **Analytics Tables**: Built-in analytics and reporting
- **AI Integration**: AI preferences and usage tracking
- **File Management**: Advanced file versioning system
- **Security**: Multi-layer security with role-based access

### **Performance Optimizations**
- **Indexes**: Strategic indexing for query performance
- **Materialized Views**: Pre-computed analytics data
- **Triggers**: Automated data maintenance
- **Caching**: Database-level caching strategies

## 🎯 **RECOMMENDATIONS**

### **Immediate Actions Required**
1. **🔴 Critical**: Fix 6 Security Definer Views 
2. **🟡 Medium**: Address function search path warnings
3. **🟡 Medium**: Enable leaked password protection
4. **🟢 Low**: Review and optimize slow queries

### **Future Enhancements**
- Implement database monitoring dashboard
- Add more granular audit logging
- Enhance AI analytics capabilities  
- Optimize storage analytics performance

---

*This database schema supports enterprise-scale innovation management with comprehensive security, analytics, and scalability features.*