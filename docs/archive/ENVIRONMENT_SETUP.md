# 🌍 Environment Configuration Guide

## ⚠️ Important: No .env Files in Lovable

**Lovable projects do NOT use .env files.** Instead, environment variables are configured directly in your deployment platform. This is a fundamental difference from traditional React applications.

## 📋 Required Environment Variables

### Production Environment Variables

```bash
# Supabase Configuration (Public - Safe to expose)
VITE_SUPABASE_URL=https://jxpbiljkoibvqxzdkgod.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NzEzMDksImV4cCI6MjA2OTA0NzMwOX0.ls7b6Dh5Go0nQYP6Sjv1c_IxPXEv8MC5RQEpH91Z_V8

# Application Configuration
VITE_APP_ENV=production
VITE_APP_URL=https://your-domain.com
```

### Variable Descriptions

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | ✅ Yes | `https://jxpbiljkoibvqxzdkgod.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key (public) | ✅ Yes | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_APP_ENV` | Application environment | ✅ Yes | `production` |
| `VITE_APP_URL` | Production application URL | ✅ Yes | `https://your-domain.com` |

## 🔒 Security Notes

### Public vs Private Keys

**All variables starting with `VITE_` are PUBLIC** and will be exposed in the client-side bundle. Only use public/publishable keys:

✅ **Safe to use:**
- Supabase anon key (protected by RLS)
- Public API endpoints
- Application configuration
- Feature flags

❌ **Never use:**
- Private API keys
- Database passwords
- Server secrets
- Service role keys

### Supabase Keys Explanation

- **Anon Key**: Public key safe for client-side use
- **Service Role Key**: Private key (never expose to client)
- **Project URL**: Public endpoint safe to expose

## 🚀 Platform-Specific Setup

### Vercel
1. Go to Project Settings → Environment Variables
2. Add each variable with its value
3. Set environment to "Production"
4. Deploy your project

### Netlify
1. Go to Site Settings → Environment Variables
2. Add each variable with its value
3. Save changes
4. Trigger a new deployment

### GitHub Pages
Environment variables are set in GitHub Secrets:
1. Go to repository Settings → Secrets and variables → Actions
2. Add each variable as a repository secret
3. Variables are used in the GitHub Actions workflow

## 🛠️ Local Development

For local development in Lovable:
- Variables are automatically configured
- No setup required
- Uses the same Supabase instance

## 🔧 Configuration Validation

The application includes runtime validation for required environment variables:

```typescript
// Production configuration validation
export const validateEnvironment = () => {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};
```

## 🌍 Multi-Environment Setup

### Development
- Uses Lovable's built-in configuration
- No additional setup required

### Staging
```bash
VITE_SUPABASE_URL=https://jxpbiljkoibvqxzdkgod.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_ENV=staging
VITE_APP_URL=https://staging.your-domain.com
```

### Production
```bash
VITE_SUPABASE_URL=https://jxpbiljkoibvqxzdkgod.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_ENV=production
VITE_APP_URL=https://your-domain.com
```

## 🚨 Troubleshooting

### Common Issues

#### 1. "Environment variable not found"
- Verify variable name spelling (case sensitive)
- Ensure variable is set in deployment platform
- Check deployment logs for variable loading

#### 2. "Invalid Supabase configuration"
- Verify URL format includes `https://`
- Check anon key is complete and unmodified
- Ensure no extra spaces or characters

#### 3. "Authentication not working"
- Verify Supabase auth settings match domain
- Check redirect URLs configuration
- Validate anon key permissions

### Debugging Commands

```bash
# Check if variables are loaded (in browser console)
console.log('Environment:', import.meta.env.VITE_APP_ENV);
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

# Validate configuration
npm run validate-env
```

## 📞 Support

If you encounter issues with environment configuration:
1. Check the troubleshooting section above
2. Verify variables in deployment platform
3. Check deployment logs for errors
4. Contact your deployment platform support

---

**Note:** This configuration approach ensures security best practices while maintaining simplicity for Lovable projects.