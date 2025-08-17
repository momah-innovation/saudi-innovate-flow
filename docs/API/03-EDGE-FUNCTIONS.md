# ⚡ Edge Functions API

## Overview

Serverless edge functions for AI processing, external integrations, and complex business logic.

## Base URL
```
https://jxpbiljkoibvqxzdkgod.supabase.co/functions/v1
```

## Authentication
```http
Authorization: Bearer <jwt_token>
apikey: <anon_key>
```

## AI Services

### AI Content Generator
Generate content using OpenAI models.

```http
POST /ai-content-generator
Content-Type: application/json

{
  "prompt": "Generate innovation ideas for smart cities",
  "type": "idea",
  "language": "ar",
  "max_length": 500
}
```

**Response:**
```json
{
  "generated_content": "أفكار مبتكرة للمدن الذكية...",
  "metadata": {
    "model_used": "gpt-4o-mini",
    "tokens_used": 245,
    "language": "ar"
  }
}
```

### Semantic Search
Intelligent search using vector embeddings.

```http
POST /semantic-search
Content-Type: application/json

{
  "query": "sustainable energy solutions",
  "filters": {
    "category": "technology",
    "language": "en"
  },
  "limit": 10
}
```

**Response:**
```json
{
  "results": [
    {
      "id": "uuid",
      "title": "Solar Panel Innovation",
      "content": "...",
      "similarity_score": 0.95
    }
  ],
  "total_count": 156,
  "processing_time_ms": 245
}
```

### Content Moderation
Automated content screening and analysis.

```http
POST /content-moderation
Content-Type: application/json

{
  "content": "Content to be moderated",
  "language": "ar",
  "check_type": "comprehensive"
}
```

**Response:**
```json
{
  "is_appropriate": true,
  "confidence_score": 0.98,
  "flags": [],
  "sentiment": "neutral",
  "language_detected": "ar"
}
```

### Keyword Extraction
Extract keywords and tags from content.

```http
POST /keyword-extraction
Content-Type: application/json

{
  "text": "نص باللغة العربية يحتوي على كلمات مفتاحية",
  "language": "ar",
  "max_keywords": 10
}
```

**Response:**
```json
{
  "keywords": [
    {
      "keyword": "ابتكار",
      "confidence": 0.92,
      "category": "innovation"
    }
  ],
  "tags": ["technology", "innovation", "development"]
}
```

## Communication Services

### Send Notification
Multi-channel notification delivery.

```http
POST /send-notification
Content-Type: application/json

{
  "recipient_id": "user_uuid",
  "channels": ["email", "push"],
  "title": "Notification Title",
  "message": "Notification message",
  "data": {
    "action_url": "/challenges/123",
    "priority": "high"
  }
}
```

**Response:**
```json
{
  "notification_id": "uuid",
  "delivery_status": {
    "email": "sent",
    "push": "delivered"
  },
  "timestamp": "2025-01-17T18:45:49Z"
}
```

### Email Templates
Generate dynamic emails using templates.

```http
POST /email-templates
Content-Type: application/json

{
  "template_id": "challenge_invitation",
  "recipient": "user@example.com",
  "data": {
    "user_name": "Ahmed",
    "challenge_title": "Innovation Challenge",
    "deadline": "2025-02-15"
  },
  "language": "ar"
}
```

### SMS Sender
Send SMS notifications and alerts.

```http
POST /sms-sender
Content-Type: application/json

{
  "phone_number": "+966501234567",
  "message": "Your verification code is: 123456",
  "type": "verification"
}
```

## Analytics & Reporting

### Analytics Processor
Process and aggregate analytics data.

```http
POST /analytics-processor
Content-Type: application/json

{
  "event_type": "challenge_view",
  "user_id": "user_uuid",
  "challenge_id": "challenge_uuid",
  "metadata": {
    "source": "web",
    "device": "desktop"
  }
}
```

### Real-time Stats
Get live system statistics.

```http
POST /real-time-stats
Content-Type: application/json

{
  "metrics": ["active_users", "challenge_submissions", "event_registrations"],
  "time_range": "last_hour"
}
```

**Response:**
```json
{
  "stats": {
    "active_users": 142,
    "challenge_submissions": 23,
    "event_registrations": 45
  },
  "timestamp": "2025-01-17T18:45:49Z",
  "cache_ttl": 300
}
```

### Report Generator
Generate comprehensive reports.

```http
POST /report-generator
Content-Type: application/json

{
  "report_type": "challenge_performance",
  "challenge_id": "challenge_uuid",
  "date_range": {
    "start": "2025-01-01",
    "end": "2025-01-31"
  },
  "format": "pdf"
}
```

## Integration Services

### External API Proxy
Secure proxy for third-party API calls.

```http
POST /external-api-proxy
Content-Type: application/json

{
  "service": "government_api",
  "endpoint": "/citizen-data",
  "method": "GET",
  "params": {
    "national_id": "1234567890"
  }
}
```

### Data Sync
Synchronize data with external systems.

```http
POST /data-sync
Content-Type: application/json

{
  "sync_type": "user_profiles",
  "external_system": "hr_system",
  "batch_size": 100,
  "dry_run": false
}
```

## Function Configuration

### Public Functions (No Auth Required)
- `content-moderation` - Content screening
- `semantic-search` - Public search (limited)

### Protected Functions (Auth Required)
- `ai-content-generator`
- `send-notification` 
- `analytics-processor`
- `report-generator`
- `external-api-proxy`
- `data-sync`

### Admin Only Functions
- `data-sync`
- `external-api-proxy`
- Advanced analytics functions

## JavaScript Examples

### Using Supabase Client
```javascript
// AI Content Generation
const { data, error } = await supabase.functions.invoke('ai-content-generator', {
  body: {
    prompt: 'Generate innovation ideas',
    type: 'idea',
    language: 'ar'
  }
});

// Send Notification
const { data, error } = await supabase.functions.invoke('send-notification', {
  body: {
    recipient_id: userId,
    channels: ['email'],
    title: 'New Challenge Available',
    message: 'Check out the latest innovation challenge'
  }
});

// Analytics Processing
const { data, error } = await supabase.functions.invoke('analytics-processor', {
  body: {
    event_type: 'page_view',
    user_id: userId,
    page: '/challenges'
  }
});
```

### Error Handling
```javascript
const processWithAI = async (content) => {
  try {
    const { data, error } = await supabase.functions.invoke('ai-content-generator', {
      body: { prompt: content, type: 'summary' }
    });
    
    if (error) {
      console.error('Function error:', error);
      return null;
    }
    
    return data.generated_content;
  } catch (err) {
    console.error('Network error:', err);
    return null;
  }
};
```

## Rate Limits

### Per Function Limits
- `ai-content-generator`: 50 requests/hour per user
- `semantic-search`: 200 requests/hour per user  
- `send-notification`: 100 requests/hour per user
- `analytics-processor`: 1000 requests/hour per user

### Global Limits
- **Authenticated users**: 500 function calls/hour
- **Anonymous users**: 50 function calls/hour

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Invalid request body |
| 401 | Authentication required |
| 403 | Insufficient permissions |
| 429 | Rate limit exceeded |
| 500 | Function execution error |
| 503 | Service temporarily unavailable |

## Best Practices

1. **Handle timeouts** - Functions have 60s timeout
2. **Implement retries** for transient errors
3. **Validate input** before calling functions
4. **Cache results** when appropriate
5. **Monitor usage** to avoid rate limits
6. **Use appropriate error handling**

### Example with Retry Logic
```javascript
const callFunctionWithRetry = async (functionName, body, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, { body });
      
      if (!error) return data;
      
      if (error.status === 429) {
        // Rate limited, wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        continue;
      }
      
      throw error;
    } catch (err) {
      if (attempt === maxRetries) throw err;
      await new Promise(resolve => setTimeout(resolve, 500 * attempt));
    }
  }
};
```