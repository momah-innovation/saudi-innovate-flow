# 🚀 Production Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Ruwād Innovation Management System to production. The project is built with React, TypeScript, and Supabase, and can be deployed to various hosting platforms.

## ⚠️ Important: Environment Variables in Lovable

**Lovable does NOT use .env files.** Instead, environment variables are configured directly in your deployment platform (Vercel, Netlify, etc.). This is a key difference from traditional React applications.

### Required Configuration Variables

```bash
# Supabase Configuration (Public - Safe to expose)
VITE_SUPABASE_URL=https://jxpbiljkoibvqxzdkgod.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NzEzMDksImV4cCI6MjA2OTA0NzMwOX0.ls7b6Dh5Go0nQYP6Sjv1c_IxPXEv8MC5RQEpH91Z_V8

# Application Configuration
VITE_APP_ENV=production
VITE_APP_URL=https://your-domain.com
```

**Note:** These are public keys and are safe to expose in client-side code. The anon key has Row Level Security (RLS) policies that protect your data.

## 🌐 Deployment Platforms

### 1. Vercel Deployment (Recommended)

#### Step 1: Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Select the project folder

#### Step 2: Configure Build Settings
```bash
# Build Command
npm run build

# Output Directory
dist

# Install Command
npm install
```

#### Step 3: Set Environment Variables
In Vercel dashboard → Project Settings → Environment Variables:

```bash
VITE_SUPABASE_URL = https://jxpbiljkoibvqxzdkgod.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NzEzMDksImV4cCI6MjA2OTA0NzMwOX0.ls7b6Dh5Go0nQYP6Sjv1c_IxPXEv8MC5RQEpH91Z_V8
VITE_APP_ENV = production
VITE_APP_URL = https://your-domain.vercel.app
```

#### Step 4: Configure Headers (vercel.json)
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-ancestors 'none'; base-uri 'self'"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Netlify Deployment

#### Step 1: Connect Repository
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "New site from Git"
3. Connect your repository

#### Step 2: Configure Build Settings
```bash
# Build Command
npm run build

# Publish Directory
dist
```

#### Step 3: Set Environment Variables
In Netlify dashboard → Site Settings → Environment Variables:
```bash
VITE_SUPABASE_URL = https://jxpbiljkoibvqxzdkgod.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NzEzMDksImV4cCI6MjA2OTA0NzMwOX0.ls7b6Dh5Go0nQYP6Sjv1c_IxPXEv8MC5RQEpH91Z_V8
VITE_APP_ENV = production
VITE_APP_URL = https://your-site.netlify.app
```

#### Step 4: Configure Headers (_headers)
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-ancestors 'none'; base-uri 'self'
```

### 3. GitHub Pages Deployment

#### Step 1: Configure GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build project
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        VITE_APP_ENV: production
        VITE_APP_URL: https://your-username.github.io/your-repo
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🔒 Security Configuration

### 1. Supabase Security Settings

#### Row Level Security (RLS)
Ensure all tables have RLS enabled:
```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = false;
```

#### Storage Security
Configure bucket policies for file uploads:
```sql
-- Public buckets for images
INSERT INTO storage.buckets (id, name, public) VALUES 
('system-assets-public', 'system-assets-public', true);

-- Private buckets for documents
INSERT INTO storage.buckets (id, name, public) VALUES 
('challenges-attachments-private', 'challenges-attachments-private', false);
```

### 2. Content Security Policy (CSP)

The CSP header is configured to:
- Allow scripts only from same origin and Google Analytics
- Allow styles from same origin and Google Fonts
- Allow images from any HTTPS source
- Allow connections to Supabase endpoints only
- Prevent framing and clickjacking attacks

### 3. Authentication Configuration

Ensure Supabase auth is properly configured:
1. Go to Supabase Dashboard → Authentication → Settings
2. Set Site URL to your production domain
3. Configure redirect URLs for OAuth providers
4. Enable email confirmations for production

## 📊 Monitoring & Analytics

### 1. Error Tracking
The application includes built-in error boundaries and logging. Monitor errors through:
- Browser console logs
- Supabase dashboard analytics
- Application-level error reporting

### 2. Performance Monitoring
Key metrics to monitor:
- Core Web Vitals (LCP, FID, CLS)
- Bundle size and loading times
- API response times
- User engagement metrics

### 3. Security Monitoring
- Failed authentication attempts
- Unusual data access patterns
- File upload anomalies
- Rate limit violations

## 🚀 Pre-Deployment Checklist

### Security
- [ ] RLS policies enabled on all tables
- [ ] File upload restrictions configured
- [ ] Security headers implemented
- [ ] CSP policies tested
- [ ] Authentication flows verified

### Performance
- [ ] Bundle size optimized
- [ ] Images compressed and optimized
- [ ] Lazy loading implemented
- [ ] Core Web Vitals tested
- [ ] API response times verified

### Functionality
- [ ] All features tested in production-like environment
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness confirmed
- [ ] Arabic/English languages working
- [ ] File uploads functioning
- [ ] Authentication working
- [ ] Database queries optimized

### Infrastructure
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Environment variables set
- [ ] Backup procedures in place
- [ ] Monitoring tools configured

## 🔧 Post-Deployment Steps

### 1. Domain Configuration
1. Configure custom domain in your hosting platform
2. Set up SSL certificate (usually automatic)
3. Update VITE_APP_URL to your custom domain
4. Update Supabase auth settings with new domain

### 2. Performance Verification
```bash
# Test Core Web Vitals
npm run lighthouse

# Test bundle size
npm run analyze

# Test loading times
npm run performance-test
```

### 3. Security Verification
- Run security headers test
- Verify CSP is working correctly
- Test authentication flows
- Validate file upload restrictions

### 4. Backup Configuration
- Database backups (handled by Supabase)
- File storage backups
- Application configuration backups
- Environment variables backup

## 🆘 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check

# Verify environment variables
npm run build:test
```

#### Authentication Issues
1. Check Supabase auth settings
2. Verify site URL configuration
3. Check redirect URLs
4. Validate environment variables

#### Performance Issues
1. Analyze bundle size
2. Check for memory leaks
3. Optimize images and assets
4. Review database queries

## 📞 Support

For deployment support:
1. Check the troubleshooting section above
2. Review Supabase documentation
3. Check hosting platform documentation
4. Contact system administrators

---

**Estimated Deployment Time:** 30-60 minutes for first deployment
**Estimated Configuration Time:** 15-30 minutes for environment setup

The application is production-ready with enterprise-grade security, performance optimization, and comprehensive monitoring capabilities.