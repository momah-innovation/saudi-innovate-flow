# 🗄️ Database Schema Documentation

## 📊 **SCHEMA OVERVIEW**
Complete database structure for the Ruwād Innovation Platform with detailed entity relationships, constraints, and security policies.

## 🏗️ **CORE ENTITIES**

### **User Management Schema**

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
    }
    
    workspace_members {
        uuid id PK
        uuid workspace_id FK
        uuid user_id FK
        text role
        boolean is_active
        timestamp joined_at
    }
    
    auth_users ||--|| profiles : has
    profiles ||--o{ workspace_members : belongs_to
</lov-mermaid>

### **Workspace & Organization Schema**

```sql
-- Workspaces table
CREATE TABLE public.workspaces (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

## 🔐 **ROW LEVEL SECURITY POLICIES**

```sql
-- Enable RLS on all workspace-scoped tables
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- Workspace access policy
CREATE POLICY "Users can view workspaces they belong to" 
ON public.workspaces FOR SELECT 
USING (
    id IN (
        SELECT workspace_id 
        FROM public.workspace_members 
        WHERE user_id = auth.uid() AND is_active = true
    )
);
```

---

*This schema supports multi-tenant innovation management with enterprise-grade security and performance.*