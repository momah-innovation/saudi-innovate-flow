# Ruwād Platform - Technical Requirements & Specifications

## 🏗️ ARCHITECTURE OVERVIEW

### Core Technology Stack
- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** TailwindCSS + shadcn/ui components
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **State Management:** TanStack Query (React Query)
- **Internationalization:** react-i18next
- **Routing:** React Router v6
- **Security:** Row Level Security (RLS) + Role-Based Access Control (RBAC)

### System Architecture Principles
- **Multitenant:** Organization-scoped data isolation
- **Modular:** Service-oriented component architecture
- **Scalable:** Horizontal scaling support with sectoral filtering
- **Secure:** End-to-end encryption and audit trails
- **Real-time:** Live updates via Supabase Realtime

---

## 🔐 SECURITY REQUIREMENTS

### Authentication & Authorization
```sql
-- Core Auth Tables (Preserved)
auth.users → profiles → user_roles
user_roles → organization_members → permissions
```

### Row Level Security (RLS) Policies
- **Personal Data:** `auth.uid() = user_id`
- **Team Data:** `user_id IN (SELECT member_id FROM team_members WHERE team_id = current_team)`
- **Organization Data:** `org_id IN (SELECT org_id FROM user_organizations WHERE user_id = auth.uid())`
- **Public Data:** `is_public = true AND status = 'published'`

### Role Hierarchy
```
System Admin > Organization Admin > Department Head > Team Lead > Expert > Innovator > User
```

### Required Security Features
- [ ] Multi-factor authentication (MFA) support
- [ ] Session management with timeout
- [ ] API rate limiting
- [ ] Input sanitization and validation
- [ ] Audit trail for all actions
- [ ] Data encryption at rest and in transit
- [ ] GDPR compliance features

---

## 📊 DATABASE SCHEMA REQUIREMENTS

### Core Entity Relationships (Preserved)
```sql
-- Innovation Flow
campaigns → challenges → focus_questions → ideas → evaluations → workflow_states
    ↓            ↓
  events       submissions

-- Organizational Hierarchy
sectors → deputies → departments → domains → sub_domains → services

-- Team Structure
innovation_teams → team_members → team_assignments
```

### New Schema Extensions Required

#### Subscription System
```sql
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type subscription_type NOT NULL, -- 'user' | 'organization'
  tier subscription_tier NOT NULL, -- 'free' | 'pro' | 'premium' | 'enterprise'
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  features JSONB NOT NULL,
  limits JSONB NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  plan_id UUID REFERENCES subscription_plans(id) NOT NULL,
  stripe_subscription_id TEXT,
  status subscription_status NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE organization_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  plan_id UUID REFERENCES subscription_plans(id) NOT NULL,
  stripe_subscription_id TEXT,
  status subscription_status NOT NULL,
  billing_contact_id UUID REFERENCES profiles(id),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### AI Feature Management
```sql
CREATE TABLE ai_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  organization_id UUID REFERENCES organizations(id),
  features_enabled JSONB NOT NULL DEFAULT '{}',
  usage_limits JSONB NOT NULL DEFAULT '{}',
  privacy_settings JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE ai_usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  feature_name TEXT NOT NULL,
  usage_count INTEGER DEFAULT 1,
  usage_date DATE DEFAULT CURRENT_DATE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### Enhanced Media Content
```sql
CREATE TABLE podcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT,
  youtube_url TEXT,
  duration_seconds INTEGER,
  published_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[],
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE webinars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  platform webinar_platform NOT NULL, -- 'zoom' | 'webex' | 'meet' | 'teams'
  meeting_url TEXT,
  embed_code TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  max_participants INTEGER,
  registration_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE knowledge_base_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT,
  tags TEXT[],
  author_id UUID REFERENCES profiles(id),
  status content_status DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

---

## 🛣️ ROUTING ARCHITECTURE

### Public Routes (No Authentication Required)
```typescript
// Core public pages
'/' - Homepage with hero search and featured content
'/about' - Platform information and mission
'/campaigns' - Public campaigns showcase
'/challenges' - Browse public challenges
'/events' - Upcoming events calendar
'/marketplace' - Innovation marketplace
'/pricing' - Subscription plans
'/login' - Authentication page
'/signup' - User registration

// Content pages
'/podcasts' - Podcast library
'/webinars' - Webinar listings
'/knowledge-base' - Help and documentation
'/knowledge-base/:articleId' - Individual articles

// Legal/Policy pages
'/privacy' - Privacy policy
'/terms' - Terms of service
'/security' - Security information
```

### Authenticated Routes (Role-Based Access)
```typescript
// Workspace routes (role-specific dashboards)
'/workspace/user/:userId' - Personal user dashboard
'/workspace/expert/:expertId' - Expert management interface
'/workspace/org/:orgId' - Organization admin panel
'/workspace/admin' - System administration

// Hierarchical organization routes
'/orgs/:orgId/sectors/:sectorId/campaigns/:campaignId/challenges/:challengeId'
'/challenges/:challengeId/questions' - Challenge focus questions
'/challenges/:challengeId/ideas' - Challenge idea submissions
'/events/:eventId/feedback' - Event feedback collection

// User management routes
'/profile' - User profile management
'/profile/setup' - Initial profile setup
'/settings' - User preferences
'/settings/subscription' - Subscription management
'/settings/privacy' - Privacy controls

// Organization management
'/orgs/:orgId/billing' - Organization billing
'/orgs/:orgId/members' - Team member management
'/orgs/:orgId/analytics' - Organization analytics
'/orgs/:orgId/settings' - Organization settings

// Content management
'/content/ideas' - User's idea submissions
'/content/evaluations' - Evaluation assignments
'/content/bookmarks' - Saved content
'/content/analytics' - Personal analytics

// Team collaboration
'/teams/:teamId' - Team workspace
'/teams/:teamId/assignments' - Team assignments
'/teams/:teamId/projects' - Team projects
```

### Route Guard Requirements
```typescript
interface RouteGuardConfig {
  requireAuth: boolean;
  requiredRole?: UserRole;
  requiredPermission?: Permission;
  subscriptionTier?: SubscriptionTier;
  organizationContext?: boolean;
  fallbackRoute: string;
}
```

---

## 🎨 COMPONENT ARCHITECTURE

### Design System Requirements
- **Color System:** HSL-based semantic tokens in index.css
- **Typography:** Responsive font scales with Arabic/English support
- **Spacing:** Consistent spacing system (4px base unit)
- **Components:** Extensible shadcn/ui component variants
- **Animations:** Smooth transitions with reduced motion support
- **Accessibility:** WCAG 2.1 AA compliance

### Required Component Library

#### Layout Components
```typescript
<AppShell> - Main application wrapper
<SystemHeader> - Global navigation header
<NavigationSidebar> - Role-based sidebar navigation
<MainContent> - Content area wrapper
<PageHeader> - Page-specific headers
<PageContent> - Main content container
<ContentGrid> - Responsive content grid system
```

#### Feature Components
```typescript
<FeaturedChallengesList> - Homepage challenge showcase
<FeaturedCampaignsCarousel> - Campaign highlights
<TopInnovatorsLeaderboard> - User rankings
<EventsCalendarGrid> - Event listings
<SubmitIdeaCTA> - Call-to-action buttons
<SmartMatchBadge> - AI-powered matching indicators
<SubscriptionTier> - Plan comparison and selection
<AnalyticsDashboard> - Data visualization
<SearchInterface> - Global search functionality
<NotificationCenter> - Real-time notifications
```

#### AI-Enhanced Components
```typescript
<AISuggestModal> - AI-powered suggestions
<IdeaQualityScore> - Automated idea scoring
<SimilarContentDetector> - Duplicate detection
<SmartCategorySelector> - AI-assisted categorization
<AutoGeneratedDescription> - AI content generation
<IntelligentTagging> - Automatic tag suggestions
```

---

## 🚀 PERFORMANCE REQUIREMENTS

### Core Web Vitals Targets
- **Largest Contentful Paint (LCP):** < 2.5s
- **First Input Delay (FID):** < 100ms
- **Cumulative Layout Shift (CLS):** < 0.1
- **First Contentful Paint (FCP):** < 1.8s
- **Time to Interactive (TTI):** < 3.8s

### Bundle Size Limits
- **Initial Bundle:** < 250KB gzipped
- **Route Chunks:** < 150KB gzipped each
- **Vendor Bundle:** < 500KB gzipped
- **Total JS:** < 1MB gzipped

### Database Performance
- **Query Response Time:** < 200ms for 95th percentile
- **Real-time Updates:** < 1s latency
- **File Upload Speed:** > 10MB/s for local files
- **Search Query Time:** < 500ms for complex searches

### Optimization Strategies
```typescript
// Code splitting by route and feature
const ChallengesPage = lazy(() => import('@/pages/ChallengesPage'));
const AIFeatures = lazy(() => import('@/features/ai'));

// Image optimization
const optimizedImageSizes = [400, 800, 1200, 1600];
const imageFormats = ['webp', 'avif', 'jpg'];

// Database query optimization
const useOptimizedQuery = (key: string, query: any) => {
  return useQuery({
    queryKey: [key],
    queryFn: query,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

---

## 🌐 INTERNATIONALIZATION (i18n)

### Language Support
- **Primary:** Arabic (ar) - RTL support
- **Secondary:** English (en) - LTR support
- **Future:** French (fr), Spanish (es)

### Translation Requirements
```typescript
// Translation namespace structure
export const namespaces = {
  common: 'common', // Shared UI elements
  auth: 'auth', // Authentication flows
  challenges: 'challenges', // Challenge management
  ideas: 'ideas', // Idea submission and evaluation
  campaigns: 'campaigns', // Campaign management
  events: 'events', // Event management
  analytics: 'analytics', // Analytics and reporting
  billing: 'billing', // Subscription and payments
  ai: 'ai', // AI features
} as const;

// RTL/LTR layout considerations
const layoutDirection = {
  ar: 'rtl',
  en: 'ltr',
} as const;
```

### Cultural Adaptations
- **Date Formats:** Hijri calendar support for Arabic
- **Number Formats:** Arabic-Indic numerals option
- **Currency:** SAR (Saudi Riyal) primary, USD secondary
- **Time Zones:** Saudi Arabia (UTC+3) default

---

## 🔌 INTEGRATION REQUIREMENTS

### Stripe Payment Integration
```typescript
interface StripeConfig {
  publishableKey: string;
  webhookSecret: string;
  supportedPaymentMethods: ['card', 'sepa_debit', 'ideal'];
  currencies: ['usd', 'sar'];
  features: {
    subscriptions: true;
    invoicing: true;
    customerPortal: true;
    webhooks: true;
  };
}
```

### Supabase Configuration
```typescript
interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey: string; // Server-side only
  storage: {
    buckets: [
      'challenges-attachments-private',
      'ideas-images-public',
      'user-avatars-public',
      'organization-logos-public',
      'podcast-audio-public',
      'webinar-recordings-private'
    ];
  };
  realtime: {
    enabledTables: [
      'challenges',
      'ideas',
      'challenge_submissions',
      'notifications',
      'team_assignments'
    ];
  };
}
```

### External API Integrations
```typescript
// Unsplash for stock images
interface UnsplashConfig {
  accessKey: string;
  collections: ['innovation', 'technology', 'business', 'collaboration'];
  imageQuality: 'raw' | 'full' | 'regular' | 'small' | 'thumb';
}

// AI Services (Future)
interface AIServiceConfig {
  provider: 'openai' | 'anthropic' | 'custom';
  models: {
    textGeneration: string;
    summarization: string;
    classification: string;
    embedding: string;
  };
  rateLimit: {
    requestsPerMinute: number;
    tokensPerDay: number;
  };
}
```

---

## 📱 RESPONSIVE DESIGN REQUIREMENTS

### Breakpoint System
```css
/* Mobile First Approach */
:root {
  --breakpoint-xs: 320px;  /* Small phones */
  --breakpoint-sm: 640px;  /* Large phones */
  --breakpoint-md: 768px;  /* Tablets */
  --breakpoint-lg: 1024px; /* Small laptops */
  --breakpoint-xl: 1280px; /* Desktops */
  --breakpoint-2xl: 1536px; /* Large screens */
}
```

### Mobile Optimization
- **Touch Targets:** Minimum 44px × 44px
- **Navigation:** Collapsible mobile menu
- **Forms:** Single-column layout on mobile
- **Tables:** Horizontal scroll or card transformation
- **Images:** Responsive with WebP/AVIF support

### Tablet Considerations
- **Hybrid Navigation:** Both sidebar and mobile menu
- **Grid Layouts:** 2-3 column responsive grids
- **Modal Behavior:** Full-screen on mobile, overlay on tablet+

---

## 🔍 SEO & ACCESSIBILITY

### SEO Requirements
```typescript
interface SEOConfig {
  sitemap: {
    generateDynamic: true;
    includePrivateRoutes: false;
    updateFrequency: 'daily';
  };
  meta: {
    defaultTitle: 'Ruwād Innovation Platform';
    titleTemplate: '%s | Ruwād';
    description: 'Government Innovation Management Platform for Saudi Arabia';
    keywords: ['innovation', 'government', 'saudi', 'challenges', 'ideas'];
  };
  openGraph: {
    type: 'website';
    locale: 'ar_SA';
    siteName: 'Ruwād Innovation Platform';
  };
  jsonLd: {
    organizationType: 'GovernmentOrganization';
    contactPoint: true;
    socialProfile: true;
  };
}
```

### Accessibility (WCAG 2.1 AA)
- **Keyboard Navigation:** Full keyboard support
- **Screen Readers:** Semantic HTML and ARIA labels
- **Color Contrast:** 4.5:1 minimum ratio
- **Focus Indicators:** Visible focus outlines
- **Alternative Text:** All images with descriptive alt text
- **Language Declaration:** Proper lang attributes for content

---

## 📊 MONITORING & ANALYTICS

### Performance Monitoring
```typescript
interface MonitoringConfig {
  webVitals: {
    lcp: { target: 2500, budget: 2000 };
    fid: { target: 100, budget: 50 };
    cls: { target: 0.1, budget: 0.05 };
  };
  errorTracking: {
    captureConsoleErrors: true;
    captureUnhandledRejections: true;
    captureResourceErrors: true;
  };
  userAnalytics: {
    pageViews: true;
    userJourneys: true;
    conversionFunnels: true;
    heatmaps: false; // Privacy compliant
  };
}
```

### Business Metrics
- **User Engagement:** Session duration, page views, return visits
- **Innovation Metrics:** Ideas submitted, challenges completed, evaluation quality
- **Subscription Metrics:** Conversion rates, churn, upgrade patterns
- **Platform Health:** Uptime, error rates, performance trends

---

**Document Version:** 1.0  
**Last Updated:** $(date)  
**Status:** APPROVED  
**Next Review:** Start of each phase