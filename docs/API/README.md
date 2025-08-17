# 🔌 Ruwād Platform API Documentation

## Overview

Complete API documentation for the Ruwād Innovation Platform, covering REST APIs, Edge Functions, Real-time subscriptions, and integration endpoints.

## API Documentation Structure

### 🚀 **Core APIs**
- [`01-AUTHENTICATION.md`](./01-AUTHENTICATION.md) - Authentication & authorization APIs
- [`02-REST-ENDPOINTS.md`](./02-REST-ENDPOINTS.md) - Database REST API endpoints
- [`03-EDGE-FUNCTIONS.md`](./03-EDGE-FUNCTIONS.md) - Serverless function APIs

### ⚡ **Real-time & Communication**
- [`04-REALTIME-SUBSCRIPTIONS.md`](./04-REALTIME-SUBSCRIPTIONS.md) - WebSocket real-time APIs
- [`05-FILE-UPLOAD.md`](./05-FILE-UPLOAD.md) - File upload & storage APIs
- [`06-NOTIFICATIONS.md`](./06-NOTIFICATIONS.md) - Notification & messaging APIs

### 🤖 **AI & Analytics**
- [`07-AI-SERVICES.md`](./07-AI-SERVICES.md) - AI-powered APIs
- [`08-ANALYTICS.md`](./08-ANALYTICS.md) - Analytics & tracking APIs
- [`09-SEARCH.md`](./09-SEARCH.md) - Search & discovery APIs

### 📚 **Reference**
- [`10-ERROR-CODES.md`](./10-ERROR-CODES.md) - Error handling & status codes
- [`11-RATE-LIMITS.md`](./11-RATE-LIMITS.md) - Rate limiting & quotas
- [`12-WEBHOOKS.md`](./12-WEBHOOKS.md) - Webhook integrations

## Base Configuration

### API Base URL
```
Production: https://jxpbiljkoibvqxzdkgod.supabase.co
Edge Functions: https://jxpbiljkoibvqxzdkgod.supabase.co/functions/v1
```

### Authentication
All API requests require authentication via Bearer token:
```http
Authorization: Bearer <your-jwt-token>
```

### Content Type
```http
Content-Type: application/json
```

### API Key (for public endpoints)
```http
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NzEzMDksImV4cCI6MjA2OTA0NzMwOX0.ls7b6Dh5Go0nQYP6Sjv1c_IxPXEv8MC5RQEpH91Z_V8
```

## Quick Start Examples

### Authentication
```javascript
// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});
```

### REST API Call
```javascript
// Get user profile
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();
```

### Edge Function Call
```javascript
// AI content generation
const { data, error } = await supabase.functions.invoke('ai-content-generator', {
  body: { prompt: 'Generate innovation ideas', type: 'idea' }
});
```

### Real-time Subscription
```javascript
// Subscribe to challenge updates
const channel = supabase
  .channel('challenge-updates')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'challenges'
  }, (payload) => {
    console.log('Challenge updated:', payload);
  })
  .subscribe();
```

## API Status

### Service Health
- **REST API**: ✅ Operational
- **Edge Functions**: ✅ Operational  
- **Real-time**: ✅ Operational
- **File Storage**: ✅ Operational

### Rate Limits
- **REST API**: 1000 requests/minute
- **Edge Functions**: 100 requests/minute
- **File Upload**: 50 uploads/minute

### SLA
- **Uptime**: 99.9%
- **Response Time**: < 200ms (REST), < 3s (AI functions)

---

**Last Updated**: January 17, 2025  
**API Version**: v1.0  
**Status**: Production Ready