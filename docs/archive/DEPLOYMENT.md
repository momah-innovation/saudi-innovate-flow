# Production Deployment Guide

## Pre-Deployment Checklist

### Environment Setup
- [ ] Production Supabase project configured
- [ ] Environment variables set
- [ ] SSL certificates installed
- [ ] Domain DNS configured
- [ ] CDN configured (if applicable)

### Security Configuration
- [ ] RLS policies tested and verified
- [ ] Authentication flows tested
- [ ] File upload restrictions configured
- [ ] CORS settings updated for production domains
- [ ] Security headers configured

### Performance Optimization
- [ ] Bundle size < 1MB verified
- [ ] Core Web Vitals benchmarks met
- [ ] Image optimization completed
- [ ] Lazy loading implemented
- [ ] Caching strategies configured

## Deployment Process

### 1. Build Preparation
```bash
# Install dependencies
npm ci

# Run tests
npm run test

# Build for production
npm run build

# Verify build
npm run preview
```

### 2. Environment Configuration
```bash
# Production environment variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_ENV=production
```

### 3. Deployment Steps
```bash
# Deploy to hosting platform
npm run deploy

# Verify deployment
curl -I https://your-domain.com

# Run smoke tests
npm run test:e2e:production
```

## Post-Deployment Verification

### Functional Testing
- [ ] User registration/login works
- [ ] Challenge creation/editing works  
- [ ] File uploads work
- [ ] Real-time updates work
- [ ] Email notifications work

### Performance Testing
- [ ] Page load times < 3 seconds
- [ ] API response times < 500ms
- [ ] Database queries optimized
- [ ] CDN serving static assets

### Security Testing
- [ ] HTTPS enforced
- [ ] Authentication required for protected routes
- [ ] RLS policies blocking unauthorized access
- [ ] File upload restrictions working

## Monitoring Setup

### Error Tracking
```typescript
// Sentry configuration
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
  tracesSampleRate: 0.1,
})
```

### Analytics
```typescript
// Google Analytics 4
gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: document.title,
  page_location: window.location.href
})
```

### Health Checks
```typescript
// Health check endpoint
const healthCheck = async () => {
  const checks = {
    database: await checkDatabase(),
    storage: await checkStorage(),
    auth: await checkAuth()
  }
  return checks
}
```

## Backup & Recovery

### Database Backups
- Daily automated backups via Supabase
- Weekly full exports to external storage
- Test restore procedures monthly

### File Storage Backups
- Continuous replication to backup bucket
- Cross-region backup for disaster recovery

### Code Backups
- Git repository with protected main branch
- Tagged releases for rollback capability

## Maintenance Procedures

### Regular Updates
- Weekly dependency updates
- Monthly security patches
- Quarterly major version updates

### Performance Monitoring
- Daily Core Web Vitals checks
- Weekly bundle size analysis
- Monthly performance optimization review

### Security Monitoring
- Daily security log review
- Weekly vulnerability scans
- Monthly security audit

## Incident Response

### Escalation Matrix
1. **Level 1**: Performance degradation (< 2 hours response)
2. **Level 2**: Service disruption (< 1 hour response)
3. **Level 3**: Security incident (< 30 minutes response)
4. **Level 4**: Data breach (< 15 minutes response)

### Communication Plan
- Status page updates
- Email notifications to stakeholders
- Social media updates if necessary

### Recovery Procedures
1. Identify and isolate issue
2. Implement temporary fix if possible
3. Communicate with users
4. Implement permanent fix
5. Post-incident review

## Rollback Procedures

### Quick Rollback
```bash
# Rollback to previous version
git checkout tags/v1.0.0
npm run build
npm run deploy
```

### Database Rollback
```sql
-- Restore from backup
-- (Coordinate with Supabase support)
```

### Gradual Rollout
- Deploy to 10% of users first
- Monitor for issues
- Gradually increase to 100%

## Support Contacts

### Technical Support
- Development Team: dev-team@yourcompany.com
- Infrastructure: infra@yourcompany.com
- Security: security@yourcompany.com

### Business Contacts
- Product Owner: product@yourcompany.com
- Stakeholders: stakeholders@yourcompany.com

### Emergency Contacts
- On-call Engineer: +1-XXX-XXX-XXXX
- Emergency Escalation: emergency@yourcompany.com