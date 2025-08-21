# ⚡ Edge Functions Documentation

## 🎯 **OVERVIEW**
Comprehensive guide to Supabase Edge Functions implementation for serverless backend logic and API integrations.

## 🏗️ **ARCHITECTURE**

### **Edge Function Structure**
```
supabase/functions/
├── _shared/           # Shared utilities and types
│   ├── cors.ts       # CORS configuration
│   ├── auth.ts       # Authentication helpers
│   └── types.ts      # Shared TypeScript types
├── ai-analysis/      # AI-powered content analysis
├── notification/     # Push notification service
├── email-service/    # Email automation
├── analytics/        # Custom analytics processing
└── file-processor/   # File processing and optimization
```

### **Shared Utilities**
```typescript
// supabase/functions/_shared/cors.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

export const handleCors = (req: Request): Response | null => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  return null;
};
```

```typescript
// supabase/functions/_shared/auth.ts
import { createClient } from '@supabase/supabase-js';

export const createAuthenticatedClient = (authHeader: string | null) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    }
  );
  
  return supabase;
};

export const validateUser = async (supabase: any) => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('Unauthorized');
  }
  
  return user;
};
```

## 🤖 **AI ANALYSIS FUNCTION**

### **Implementation**
```typescript
// supabase/functions/ai-analysis/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { createAuthenticatedClient, validateUser } from '../_shared/auth.ts';

interface AnalysisRequest {
  content: string;
  type: 'challenge' | 'submission' | 'feedback';
  language: 'en' | 'ar';
}

interface AnalysisResponse {
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
  summary: string;
  suggestions: string[];
  confidence: number;
}

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const authHeader = req.headers.get('Authorization');
    const supabase = createAuthenticatedClient(authHeader);
    const user = await validateUser(supabase);
    
    const { content, type, language }: AnalysisRequest = await req.json();
    
    // Validate input
    if (!content || !type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Call AI service (OpenAI, Claude, etc.)
    const analysis = await analyzeContent(content, type, language);
    
    // Store analysis results
    await supabase
      .from('ai_analyses')
      .insert({
        user_id: user.id,
        content_type: type,
        content_hash: await hashContent(content),
        analysis_results: analysis,
        created_at: new Date().toISOString()
      });
    
    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function analyzeContent(
  content: string, 
  type: string, 
  language: string
): Promise<AnalysisResponse> {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  
  const systemPrompts = {
    en: `Analyze the following ${type} content and provide:
1. Sentiment analysis (positive/neutral/negative)
2. Key topics and keywords
3. Brief summary
4. Improvement suggestions
5. Confidence score (0-1)`,
    ar: `قم بتحليل المحتوى التالي من نوع ${type} وقدم:
1. تحليل المشاعر (إيجابي/محايد/سلبي)
2. الموضوعات والكلمات المفتاحية
3. ملخص مختصر
4. اقتراحات للتحسين
5. درجة الثقة (0-1)`
  };
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompts[language] },
        { role: 'user', content }
      ],
      temperature: 0.3,
    }),
  });
  
  const result = await response.json();
  
  // Parse AI response into structured format
  return parseAIResponse(result.choices[0].message.content);
}

function parseAIResponse(aiResponse: string): AnalysisResponse {
  // Implementation to parse AI response into structured data
  // This would include regex patterns or JSON parsing
  // depending on how you prompt the AI to respond
  
  return {
    sentiment: 'positive', // Extracted from AI response
    keywords: [], // Extracted keywords
    summary: '', // Generated summary
    suggestions: [], // Improvement suggestions
    confidence: 0.85 // Confidence score
  };
}

async function hashContent(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

## 📧 **EMAIL SERVICE FUNCTION**

### **Implementation**
```typescript
// supabase/functions/email-service/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';

interface EmailRequest {
  to: string[];
  subject: string;
  template: string;
  data: Record<string, any>;
  language?: 'en' | 'ar';
}

const emailTemplates = {
  welcome: {
    en: {
      subject: 'Welcome to Ruwād Innovation Platform',
      html: `
        <h1>Welcome {{name}}!</h1>
        <p>Thank you for joining the Ruwād Innovation Platform.</p>
        <p>Get started by exploring our innovation challenges.</p>
      `
    },
    ar: {
      subject: 'مرحباً بك في منصة رُواد للابتكار',
      html: `
        <h1>مرحباً {{name}}!</h1>
        <p>شكراً لانضمامك إلى منصة رُواد للابتكار.</p>
        <p>ابدأ باستكشاف تحديات الابتكار.</p>
      `
    }
  },
  challengeInvitation: {
    en: {
      subject: 'New Challenge: {{challengeTitle}}',
      html: `
        <h1>You're invited to participate!</h1>
        <h2>{{challengeTitle}}</h2>
        <p>{{challengeDescription}}</p>
        <p>Deadline: {{deadline}}</p>
        <a href="{{challengeUrl}}">View Challenge</a>
      `
    },
    ar: {
      subject: 'تحدي جديد: {{challengeTitle}}',
      html: `
        <h1>أنت مدعو للمشاركة!</h1>
        <h2>{{challengeTitle}}</h2>
        <p>{{challengeDescription}}</p>
        <p>الموعد النهائي: {{deadline}}</p>
        <a href="{{challengeUrl}}">عرض التحدي</a>
      `
    }
  }
};

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { to, template, data, language = 'en' }: EmailRequest = await req.json();
    
    if (!to || !template) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    const emailTemplate = emailTemplates[template]?.[language];
    if (!emailTemplate) {
      return new Response(
        JSON.stringify({ error: 'Template not found' }),
        { status: 404, headers: corsHeaders }
      );
    }
    
    // Process template with data
    const processedSubject = processTemplate(emailTemplate.subject, data);
    const processedHtml = processTemplate(emailTemplate.html, data);
    
    // Send email using your email service (SendGrid, Resend, etc.)
    const emailResult = await sendEmail({
      to,
      subject: processedSubject,
      html: processedHtml
    });
    
    return new Response(
      JSON.stringify({ success: true, messageId: emailResult.messageId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Email Service Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});

function processTemplate(template: string, data: Record<string, any>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || match;
  });
}

async function sendEmail({ to, subject, html }: {
  to: string[];
  subject: string;
  html: string;
}) {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'noreply@ruwad.gov.sa',
      to,
      subject,
      html,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Email service error: ${response.statusText}`);
  }
  
  return await response.json();
}
```

## 📊 **ANALYTICS FUNCTION**

### **Custom Analytics Processing**
```typescript
// supabase/functions/analytics/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { createAuthenticatedClient } from '../_shared/auth.ts';

interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  userId?: string;
  sessionId: string;
  timestamp: string;
}

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const events: AnalyticsEvent[] = await req.json();
    
    const supabase = createAuthenticatedClient(
      req.headers.get('Authorization')
    );
    
    // Process and store analytics events
    const processedEvents = await Promise.all(
      events.map(event => processAnalyticsEvent(event, supabase))
    );
    
    // Aggregate data for real-time insights
    await updateAnalyticsAggregates(processedEvents, supabase);
    
    return new Response(
      JSON.stringify({ processed: processedEvents.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Analytics Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});

async function processAnalyticsEvent(event: AnalyticsEvent, supabase: any) {
  // Enrich event data
  const enrichedEvent = {
    ...event,
    processed_at: new Date().toISOString(),
    user_agent: event.properties?.userAgent,
    ip_country: await getCountryFromIP(event.properties?.ip),
    device_type: getDeviceType(event.properties?.userAgent)
  };
  
  // Store raw event
  await supabase
    .from('analytics_events')
    .insert(enrichedEvent);
  
  return enrichedEvent;
}

async function updateAnalyticsAggregates(events: any[], supabase: any) {
  const today = new Date().toISOString().split('T')[0];
  
  // Group events by type
  const eventGroups = events.reduce((acc, event) => {
    if (!acc[event.event]) acc[event.event] = 0;
    acc[event.event]++;
    return acc;
  }, {});
  
  // Update daily aggregates
  for (const [eventType, count] of Object.entries(eventGroups)) {
    await supabase
      .from('analytics_daily_aggregates')
      .upsert({
        date: today,
        event_type: eventType,
        count,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'date,event_type',
        ignoreDuplicates: false
      });
  }
}

async function getCountryFromIP(ip: string): Promise<string> {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/country/`);
    return await response.text();
  } catch {
    return 'unknown';
  }
}

function getDeviceType(userAgent: string): string {
  if (!userAgent) return 'unknown';
  
  if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
    return 'mobile';
  } else if (/Tablet/.test(userAgent)) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}
```

## 📁 **FILE PROCESSOR FUNCTION**

### **Image Optimization & Processing**
```typescript
// supabase/functions/file-processor/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';

interface ProcessingRequest {
  fileUrl: string;
  operations: {
    resize?: { width: number; height: number };
    compress?: { quality: number };
    format?: 'webp' | 'jpg' | 'png';
    watermark?: { text: string; position: string };
  };
}

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { fileUrl, operations }: ProcessingRequest = await req.json();
    
    // Download original file
    const originalFile = await fetch(fileUrl);
    if (!originalFile.ok) {
      throw new Error('Failed to download original file');
    }
    
    const fileBuffer = await originalFile.arrayBuffer();
    
    // Process image based on operations
    let processedBuffer = fileBuffer;
    
    if (operations.resize) {
      processedBuffer = await resizeImage(processedBuffer, operations.resize);
    }
    
    if (operations.compress) {
      processedBuffer = await compressImage(processedBuffer, operations.compress);
    }
    
    if (operations.format) {
      processedBuffer = await convertFormat(processedBuffer, operations.format);
    }
    
    if (operations.watermark) {
      processedBuffer = await addWatermark(processedBuffer, operations.watermark);
    }
    
    // Upload processed file to storage
    const processedUrl = await uploadProcessedFile(processedBuffer);
    
    return new Response(
      JSON.stringify({ 
        originalUrl: fileUrl,
        processedUrl,
        operations: Object.keys(operations)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('File Processing Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});

// Image processing implementations would use libraries like:
// - Sharp (for Node.js environments)
// - ImageMagick
// - Canvas API for basic operations

async function resizeImage(buffer: ArrayBuffer, { width, height }: any) {
  // Implementation depends on your image processing library
  // This is a placeholder for the actual implementation
  return buffer;
}

async function compressImage(buffer: ArrayBuffer, { quality }: any) {
  // Implementation for image compression
  return buffer;
}

async function convertFormat(buffer: ArrayBuffer, format: string) {
  // Implementation for format conversion
  return buffer;
}

async function addWatermark(buffer: ArrayBuffer, watermark: any) {
  // Implementation for watermarking
  return buffer;
}

async function uploadProcessedFile(buffer: ArrayBuffer): Promise<string> {
  // Upload to Supabase Storage or other storage service
  const fileName = `processed_${Date.now()}.jpg`;
  
  // Implementation for file upload
  return `https://storage.example.com/${fileName}`;
}
```

## 🔔 **NOTIFICATION FUNCTION**

### **Push Notifications**
```typescript
// supabase/functions/notification/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';

interface NotificationRequest {
  userId?: string;
  userIds?: string[];
  title: string;
  body: string;
  data?: Record<string, any>;
  type: 'challenge' | 'submission' | 'comment' | 'general';
  language?: 'en' | 'ar';
}

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const notification: NotificationRequest = await req.json();
    
    // Get user device tokens
    const deviceTokens = await getUserDeviceTokens(
      notification.userId ? [notification.userId] : notification.userIds || []
    );
    
    if (deviceTokens.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No devices to notify' }),
        { headers: corsHeaders }
      );
    }
    
    // Send push notifications
    const results = await sendPushNotifications(deviceTokens, notification);
    
    // Store notification in database
    await storeNotification(notification, results);
    
    return new Response(
      JSON.stringify({ 
        sent: results.successful.length,
        failed: results.failed.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Notification Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});

async function getUserDeviceTokens(userIds: string[]): Promise<string[]> {
  // Fetch device tokens from database
  // This would query your user_devices table
  return [];
}

async function sendPushNotifications(tokens: string[], notification: NotificationRequest) {
  const fcmServerKey = Deno.env.get('FCM_SERVER_KEY');
  
  const payload = {
    registration_ids: tokens,
    notification: {
      title: notification.title,
      body: notification.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png'
    },
    data: notification.data || {}
  };
  
  const response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Authorization': `key=${fcmServerKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  const result = await response.json();
  
  return {
    successful: result.results?.filter((r: any) => r.message_id) || [],
    failed: result.results?.filter((r: any) => r.error) || []
  };
}

async function storeNotification(notification: NotificationRequest, results: any) {
  // Store notification record in database for tracking
  console.log('Storing notification:', notification, results);
}
```

## 🚀 **DEPLOYMENT & MANAGEMENT**

### **Deployment Commands**
```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy ai-analysis

# Set environment variables
supabase secrets set OPENAI_API_KEY=your_key
supabase secrets set RESEND_API_KEY=your_key
supabase secrets set FCM_SERVER_KEY=your_key

# View function logs
supabase functions logs ai-analysis
```

### **Environment Variables Management**
```bash
# Required environment variables for each function
# AI Analysis Function
OPENAI_API_KEY=your_openai_api_key

# Email Service Function  
RESEND_API_KEY=your_resend_api_key

# Notification Function
FCM_SERVER_KEY=your_fcm_server_key

# File Processor Function
CLOUDINARY_URL=your_cloudinary_url
```

### **Monitoring & Observability**
```typescript
// Add to each function for monitoring
const logPerformance = (functionName: string, startTime: number) => {
  const duration = Date.now() - startTime;
  console.log(`${functionName} executed in ${duration}ms`);
  
  // Send metrics to monitoring service
  if (duration > 5000) {
    console.warn(`Slow function execution: ${functionName} took ${duration}ms`);
  }
};

// Usage in functions
const startTime = Date.now();
// ... function logic ...
logPerformance('ai-analysis', startTime);
```

---

*Edge Functions provide serverless backend capabilities for enhanced platform functionality.*