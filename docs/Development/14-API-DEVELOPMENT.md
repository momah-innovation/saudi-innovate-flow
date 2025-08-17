# 🔌 API Development Guide

## Overview
Comprehensive guide for developing and integrating APIs in the Ruwād Platform, covering REST endpoints, Edge Functions, and external API integrations.

## REST API Patterns

### Query Builder Patterns
```typescript
// src/lib/api/queryBuilder.ts
export class QueryBuilder {
  private query: any;
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.query = supabase.from(tableName);
  }

  select(columns: string = '*') {
    this.query = this.query.select(columns);
    return this;
  }

  where(column: string, operator: string, value: any) {
    switch (operator) {
      case 'eq':
        this.query = this.query.eq(column, value);
        break;
      case 'neq':
        this.query = this.query.neq(column, value);
        break;
      case 'gt':
        this.query = this.query.gt(column, value);
        break;
      case 'gte':
        this.query = this.query.gte(column, value);
        break;
      case 'lt':
        this.query = this.query.lt(column, value);
        break;
      case 'lte':
        this.query = this.query.lte(column, value);
        break;
      case 'like':
        this.query = this.query.ilike(column, `%${value}%`);
        break;
      case 'in':
        this.query = this.query.in(column, value);
        break;
    }
    return this;
  }

  orderBy(column: string, ascending: boolean = true) {
    this.query = this.query.order(column, { ascending });
    return this;
  }

  limit(count: number) {
    this.query = this.query.limit(count);
    return this;
  }

  range(from: number, to: number) {
    this.query = this.query.range(from, to);
    return this;
  }

  async execute<T>(): Promise<T[]> {
    const { data, error } = await this.query;
    if (error) throw error;
    return data;
  }

  async executeSingle<T>(): Promise<T> {
    const { data, error } = await this.query.single();
    if (error) throw error;
    return data;
  }
}

// Usage
const challenges = await new QueryBuilder('challenges')
  .select('*, created_by_profile:profiles!created_by(display_name)')
  .where('status', 'eq', 'active')
  .where('title', 'like', 'ابتكار')
  .orderBy('created_at', false)
  .limit(10)
  .execute();
```

### API Service Layer
```typescript
// src/services/api/challengeService.ts
export class ChallengeService {
  private static instance: ChallengeService;
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new ChallengeService();
    }
    return this.instance;
  }

  async getAll(filters?: ChallengeFilters): Promise<Challenge[]> {
    let query = new QueryBuilder('challenges')
      .select(`
        *,
        created_by_profile:profiles!created_by(display_name, avatar_url),
        department:departments(name_ar, name_en),
        submissions_count:challenge_submissions(count),
        participants_count:challenge_participants(count)
      `);

    if (filters?.status) {
      query = query.where('status', 'eq', filters.status);
    }

    if (filters?.category) {
      query = query.where('category', 'eq', filters.category);
    }

    if (filters?.search) {
      query = query.where('title', 'like', filters.search);
    }

    if (filters?.dateFrom) {
      query = query.where('created_at', 'gte', filters.dateFrom);
    }

    if (filters?.dateTo) {
      query = query.where('created_at', 'lte', filters.dateTo);
    }

    return query
      .orderBy('created_at', false)
      .limit(filters?.limit || 50)
      .execute();
  }

  async getById(id: string): Promise<Challenge> {
    return new QueryBuilder('challenges')
      .select(`
        *,
        created_by_profile:profiles!created_by(*),
        department:departments(*),
        submissions:challenge_submissions(
          *,
          submitted_by_profile:profiles!submitted_by(*)
        )
      `)
      .where('id', 'eq', id)
      .executeSingle();
  }

  async create(data: CreateChallengeData): Promise<Challenge> {
    const { data: challenge, error } = await supabase
      .from('challenges')
      .insert({
        ...data,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        status: 'draft',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return challenge;
  }

  async update(id: string, data: UpdateChallengeData): Promise<Challenge> {
    const { data: challenge, error } = await supabase
      .from('challenges')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return challenge;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('challenges')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async submit(challengeId: string, submissionData: CreateSubmissionData): Promise<Submission> {
    const { data: submission, error } = await supabase
      .from('challenge_submissions')
      .insert({
        challenge_id: challengeId,
        ...submissionData,
        submitted_by: (await supabase.auth.getUser()).data.user?.id,
        status: 'pending',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return submission;
  }
}

export const challengeService = ChallengeService.getInstance();
```

## Edge Functions Development

### Function Structure
```typescript
// supabase/functions/ai-content-generator/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import "https://deno.land/x/xhr@0.1.0/mod.ts";

interface RequestBody {
  prompt: string;
  type: 'idea' | 'challenge' | 'solution';
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

interface AIResponse {
  generatedText: string;
  tokensUsed: number;
  model: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    const { prompt, type, model = 'gpt-4o-mini', maxTokens = 500, temperature = 0.7 }: RequestBody = await req.json();

    // Validate input
    if (!prompt || !type) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Prepare context-specific system message
    const systemMessages = {
      idea: 'أنت مساعد ذكي متخصص في توليد الأفكار الابتكارية. قم بتوليد فكرة مبتكرة وعملية.',
      challenge: 'أنت مساعد ذكي متخصص في صياغة التحديات. قم بصياغة تحدي واضح ومحدد.',
      solution: 'أنت مساعد ذكي متخصص في إيجاد الحلول. قم بتقديم حل عملي ومبتكر.'
    };

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemMessages[type] },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.statusText}`);
    }

    const aiData = await openAIResponse.json();
    
    const response: AIResponse = {
      generatedText: aiData.choices[0].message.content,
      tokensUsed: aiData.usage.total_tokens,
      model: aiData.model
    };

    // Log usage for analytics
    console.log(`AI generation completed: ${response.tokensUsed} tokens used`);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI content generator:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

### Notification Service Function
```typescript
// supabase/functions/send-notification/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface NotificationPayload {
  userId: string;
  type: 'challenge_update' | 'submission_received' | 'event_reminder';
  title: string;
  message: string;
  data?: Record<string, any>;
  channels: ('email' | 'push' | 'in_app')[];
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload: NotificationPayload = await req.json();

    // Validate payload
    if (!payload.userId || !payload.type || !payload.title || !payload.message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const results = {
      in_app: false,
      email: false,
      push: false
    };

    // Send in-app notification
    if (payload.channels.includes('in_app')) {
      const { error: inAppError } = await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: payload.userId,
          type: payload.type,
          title: payload.title,
          message: payload.message,
          data: payload.data || {},
          created_at: new Date().toISOString()
        });

      results.in_app = !inAppError;
    }

    // Send email notification
    if (payload.channels.includes('email')) {
      // Get user email from profiles
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('email, notification_preferences')
        .eq('user_id', payload.userId)
        .single();

      if (profile?.email && profile.notification_preferences?.email !== false) {
        // Send email using external service (e.g., SendGrid, Resend)
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'noreply@ruwad.sa',
            to: profile.email,
            subject: payload.title,
            html: generateEmailTemplate(payload)
          })
        });

        results.email = emailResponse.ok;
      }
    }

    // Send push notification
    if (payload.channels.includes('push')) {
      // Get user's push tokens
      const { data: pushTokens } = await supabaseAdmin
        .from('push_tokens')
        .select('token')
        .eq('user_id', payload.userId)
        .eq('active', true);

      if (pushTokens && pushTokens.length > 0) {
        // Send push notifications using FCM or similar service
        const pushPromises = pushTokens.map(({ token }) =>
          sendPushNotification(token, payload)
        );

        const pushResults = await Promise.allSettled(pushPromises);
        results.push = pushResults.some(result => result.status === 'fulfilled');
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      results 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error sending notification:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to send notification',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function generateEmailTemplate(payload: NotificationPayload): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${payload.title}</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 30px;">
            <h1 style="color: #2D3748; text-align: center;">${payload.title}</h1>
            <p style="color: #4A5568; line-height: 1.6; font-size: 16px;">${payload.message}</p>
            <div style="text-align: center; margin-top: 30px;">
                <a href="https://ruwad.sa" style="background-color: #3182CE; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">زيارة المنصة</a>
            </div>
        </div>
    </body>
    </html>
  `;
}

async function sendPushNotification(token: string, payload: NotificationPayload): Promise<boolean> {
  try {
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': `key=${Deno.env.get('FCM_SERVER_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: token,
        notification: {
          title: payload.title,
          body: payload.message,
          icon: '/icon-192x192.png'
        },
        data: payload.data || {}
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Push notification error:', error);
    return false;
  }
}
```

## API Integration Patterns

### External API Integration
```typescript
// src/services/external/externalApiService.ts
export class ExternalAPIService {
  private baseURL: string;
  private apiKey: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'User-Agent': 'Ruwad-Platform/1.0'
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text() as unknown as T;
    } catch (error) {
      console.error(`API request failed for ${url}:`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const searchParams = params ? `?${new URLSearchParams(params)}` : '';
    return this.request<T>(`${endpoint}${searchParams}`, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Government API Integration Example
export class GovernmentAPIService extends ExternalAPIService {
  constructor() {
    super(
      'https://api.gov.sa/v1',
      process.env.GOVERNMENT_API_KEY || ''
    );
  }

  async getGovernmentDepartments(): Promise<Department[]> {
    return this.get<Department[]>('/departments');
  }

  async validateNationalId(nationalId: string): Promise<ValidationResult> {
    return this.post<ValidationResult>('/validate/national-id', { nationalId });
  }

  async getPublicSectors(): Promise<Sector[]> {
    return this.get<Sector[]>('/sectors');
  }
}

export const governmentAPI = new GovernmentAPIService();
```

### API Caching Strategy
```typescript
// src/lib/api/cache.ts
export class APICache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private static instance: APICache;

  static getInstance() {
    if (!this.instance) {
      this.instance = new APICache();
    }
    return this.instance;
  }

  set(key: string, data: any, ttlSeconds: number = 300) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  clear() {
    this.cache.clear();
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  // Cache decorator for API methods
  static cached(ttlSeconds: number = 300) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
      const method = descriptor.value;
      
      descriptor.value = async function (...args: any[]) {
        const cache = APICache.getInstance();
        const cacheKey = `${target.constructor.name}.${propertyName}.${JSON.stringify(args)}`;
        
        const cached = cache.get(cacheKey);
        if (cached) {
          console.log(`Cache hit for ${cacheKey}`);
          return cached;
        }
        
        const result = await method.apply(this, args);
        cache.set(cacheKey, result, ttlSeconds);
        
        console.log(`Cache set for ${cacheKey}`);
        return result;
      };
    };
  }
}

// Usage with caching
export class CachedChallengeService extends ChallengeService {
  @APICache.cached(300) // Cache for 5 minutes
  async getAll(filters?: ChallengeFilters): Promise<Challenge[]> {
    return super.getAll(filters);
  }

  @APICache.cached(600) // Cache for 10 minutes
  async getById(id: string): Promise<Challenge> {
    return super.getById(id);
  }
}
```

## API Documentation & OpenAPI

### OpenAPI Schema Generation
```typescript
// src/lib/api/openapi.ts
export const generateOpenAPISchema = () => {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Ruwad Platform API',
      version: '1.0.0',
      description: 'API documentation for the Ruwad Innovation Platform',
      contact: {
        name: 'API Support',
        email: 'api-support@ruwad.sa'
      }
    },
    servers: [
      {
        url: 'https://jxpbiljkoibvqxzdkgod.supabase.co/rest/v1',
        description: 'Production server'
      }
    ],
    paths: {
      '/challenges': {
        get: {
          summary: 'Get all challenges',
          tags: ['Challenges'],
          parameters: [
            {
              name: 'status',
              in: 'query',
              schema: { type: 'string', enum: ['active', 'draft', 'completed'] }
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 50 }
            }
          ],
          responses: {
            '200': {
              description: 'List of challenges',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Challenge' }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: 'Create a new challenge',
          tags: ['Challenges'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateChallengeRequest' }
              }
            }
          },
          responses: {
            '201': {
              description: 'Challenge created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Challenge' }
                }
              }
            }
          }
        }
      }
    },
    components: {
      schemas: {
        Challenge: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['active', 'draft', 'completed'] },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        CreateChallengeRequest: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            title: { type: 'string', minLength: 5, maxLength: 200 },
            description: { type: 'string', minLength: 20 },
            category: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } }
          }
        }
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ BearerAuth: [] }]
  };
};
```

## Rate Limiting & Throttling

### Client-Side Rate Limiting
```typescript
// src/lib/api/rateLimiter.ts
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private limits: Map<string, { requests: number; window: number }> = new Map();

  constructor() {
    // Default limits
    this.setLimit('default', 100, 60000); // 100 requests per minute
    this.setLimit('ai-generation', 10, 60000); // 10 AI requests per minute
    this.setLimit('file-upload', 20, 60000); // 20 uploads per minute
  }

  setLimit(key: string, requests: number, windowMs: number) {
    this.limits.set(key, { requests, window: windowMs });
  }

  async checkLimit(key: string = 'default'): Promise<boolean> {
    const limit = this.limits.get(key);
    if (!limit) return true;

    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove expired requests
    const validRequests = requests.filter(time => now - time < limit.window);
    
    if (validRequests.length >= limit.requests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }

  async throttledRequest<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    const canProceed = await this.checkLimit(key);
    
    if (!canProceed) {
      throw new Error(`Rate limit exceeded for ${key}`);
    }
    
    return requestFn();
  }

  getRemainingRequests(key: string = 'default'): number {
    const limit = this.limits.get(key);
    if (!limit) return Infinity;

    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter(time => now - time < limit.window);
    
    return Math.max(0, limit.requests - validRequests.length);
  }
}

export const rateLimiter = new RateLimiter();

// Usage in API services
export const throttledChallengeService = {
  async getAll(filters?: ChallengeFilters) {
    return rateLimiter.throttledRequest('challenges', () =>
      challengeService.getAll(filters)
    );
  },

  async generateWithAI(prompt: string) {
    return rateLimiter.throttledRequest('ai-generation', () =>
      edgeFunctions.generateContent(prompt)
    );
  }
};
```

## API Testing Patterns

### API Test Utilities
```typescript
// src/test/api/testUtils.ts
export class APITestHelper {
  private mockUser: User | null = null;

  async authenticateTestUser(): Promise<User> {
    const testUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      email_confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as User;

    this.mockUser = testUser;
    return testUser;
  }

  createMockResponse<T>(data: T, status = 200): Response {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  expectValidationError(response: any, field: string) {
    expect(response.error).toBeDefined();
    expect(response.error.message).toContain(field);
  }

  expectSuccessfulResponse<T>(response: any): T {
    expect(response.error).toBeNull();
    expect(response.data).toBeDefined();
    return response.data;
  }
}

// API Integration Tests
describe('Challenge API', () => {
  let apiHelper: APITestHelper;

  beforeEach(() => {
    apiHelper = new APITestHelper();
  });

  test('should create challenge with valid data', async () => {
    await apiHelper.authenticateTestUser();

    const challengeData = {
      title: 'تحدي اختبار',
      description: 'وصف تفصيلي للتحدي',
      category: 'innovation',
      tags: ['ابتكار', 'تقنية']
    };

    const response = await challengeService.create(challengeData);
    const challenge = apiHelper.expectSuccessfulResponse(response);

    expect(challenge.title).toBe(challengeData.title);
    expect(challenge.status).toBe('draft');
  });

  test('should validate required fields', async () => {
    await apiHelper.authenticateTestUser();

    const invalidData = { title: '' }; // Missing required fields

    await expect(challengeService.create(invalidData))
      .rejects
      .toThrow();
  });

  test('should handle pagination correctly', async () => {
    const filters = { limit: 10, offset: 0 };
    const challenges = await challengeService.getAll(filters);

    expect(Array.isArray(challenges)).toBe(true);
    expect(challenges.length).toBeLessThanOrEqual(10);
  });
});
```

## Performance Monitoring

### API Performance Tracking
```typescript
// src/lib/api/performance.ts
export class APIPerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();

  async trackRequest<T>(
    operation: string,
    request: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await request();
      const endTime = performance.now();
      const duration = endTime - startTime;

      this.recordMetric(operation, {
        duration,
        success: true,
        timestamp: Date.now()
      });

      console.log(`API ${operation} completed in ${duration.toFixed(2)}ms`);
      return result;

    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      this.recordMetric(operation, {
        duration,
        success: false,
        error: error.message,
        timestamp: Date.now()
      });

      console.error(`API ${operation} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  private recordMetric(operation: string, metric: PerformanceMetric) {
    const metrics = this.metrics.get(operation) || [];
    metrics.push(metric);
    
    // Keep only last 100 metrics per operation
    if (metrics.length > 100) {
      metrics.shift();
    }
    
    this.metrics.set(operation, metrics);
  }

  getMetrics(operation: string): PerformanceStats {
    const metrics = this.metrics.get(operation) || [];
    
    if (metrics.length === 0) {
      return { count: 0, avgDuration: 0, successRate: 0 };
    }

    const successfulMetrics = metrics.filter(m => m.success);
    const durations = metrics.map(m => m.duration);

    return {
      count: metrics.length,
      avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      successRate: (successfulMetrics.length / metrics.length) * 100,
      errorRate: ((metrics.length - successfulMetrics.length) / metrics.length) * 100
    };
  }

  getAllMetrics(): Record<string, PerformanceStats> {
    const result: Record<string, PerformanceStats> = {};
    
    for (const [operation, _] of this.metrics) {
      result[operation] = this.getMetrics(operation);
    }
    
    return result;
  }
}

export const performanceMonitor = new APIPerformanceMonitor();

// Usage in services
export const monitoredChallengeService = {
  async getAll(filters?: ChallengeFilters) {
    return performanceMonitor.trackRequest('challenges.getAll', () =>
      challengeService.getAll(filters)
    );
  },

  async create(data: CreateChallengeData) {
    return performanceMonitor.trackRequest('challenges.create', () =>
      challengeService.create(data)
    );
  }
};
```

## Best Practices

### 1. **API Design**
- Use consistent naming conventions
- Implement proper HTTP status codes
- Design for idempotency where appropriate
- Use meaningful error messages

### 2. **Security**
- Validate all inputs on both client and server
- Implement proper authentication and authorization
- Use HTTPS for all API communications
- Implement rate limiting and request validation

### 3. **Performance**
- Implement caching strategies
- Use pagination for large datasets
- Monitor API performance metrics
- Optimize database queries

### 4. **Error Handling**
- Provide consistent error response format
- Log errors for debugging
- Implement graceful degradation
- Use appropriate retry strategies

---

**Last Updated**: January 17, 2025  
**Guide Version**: 1.0  
**API Version**: REST v1 + Edge Functions
