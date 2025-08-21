# 🔌 Third-Party Services Integration

## 🎯 **OVERVIEW**
Comprehensive documentation for external service integrations including AI services, communication tools, analytics, and media management.

## 🤖 **AI & ML SERVICES**

### **OpenAI Integration**
```typescript
// src/services/OpenAIService.ts
export class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async generateText(prompt: string, options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    language?: 'en' | 'ar';
  }): Promise<string> {
    const { model = 'gpt-4', maxTokens = 1000, temperature = 0.7, language = 'en' } = options || {};
    
    const systemPrompt = language === 'ar' 
      ? 'أجب باللغة العربية. كن مفيداً ومهذباً.'
      : 'Respond in English. Be helpful and polite.';
    
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens,
        temperature,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  }
  
  async analyzeImage(imageUrl: string, prompt: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageUrl } }
            ],
          },
        ],
        max_tokens: 500,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI Vision API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  }
  
  async generateEmbeddings(text: string): Promise<number[]> {
    const response = await fetch(`${this.baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: text,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI Embeddings API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data[0].embedding;
  }
}
```

### **Google Translate Integration**
```typescript
// src/services/TranslationService.ts
export class GoogleTranslateService {
  private apiKey: string;
  private baseUrl = 'https://translation.googleapis.com/language/translate/v2';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async translateText(
    text: string, 
    targetLanguage: 'ar' | 'en',
    sourceLanguage?: string
  ): Promise<{
    translatedText: string;
    detectedSourceLanguage: string;
  }> {
    const params = new URLSearchParams({
      key: this.apiKey,
      q: text,
      target: targetLanguage,
      format: 'text'
    });
    
    if (sourceLanguage) {
      params.append('source', sourceLanguage);
    }
    
    const response = await fetch(`${this.baseUrl}?${params}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Translation API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    const translation = data.data.translations[0];
    
    return {
      translatedText: translation.translatedText,
      detectedSourceLanguage: translation.detectedSourceLanguage || sourceLanguage || 'auto'
    };
  }
  
  async detectLanguage(text: string): Promise<{
    language: string;
    confidence: number;
  }> {
    const params = new URLSearchParams({
      key: this.apiKey,
      q: text,
    });
    
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2/detect?${params}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Language Detection API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    const detection = data.data.detections[0][0];
    
    return {
      language: detection.language,
      confidence: detection.confidence
    };
  }
}
```

## 📧 **COMMUNICATION SERVICES**

### **Resend Email Service**
```typescript
// src/services/EmailService.ts
export class ResendEmailService {
  private apiKey: string;
  private baseUrl = 'https://api.resend.com';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async sendEmail(options: {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
    replyTo?: string;
    attachments?: Array<{
      filename: string;
      content: string;
      contentType: string;
    }>;
  }): Promise<{ id: string }> {
    const response = await fetch(`${this.baseUrl}/emails`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: options.from || 'Ruwād Platform <noreply@ruwad.gov.sa>',
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        reply_to: options.replyTo,
        attachments: options.attachments,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Email API error: ${response.statusText}`);
    }
    
    return await response.json();
  }
  
  async sendBulkEmail(emails: Array<{
    to: string;
    subject: string;
    html: string;
    from?: string;
  }>): Promise<Array<{ id: string; to: string }>> {
    const response = await fetch(`${this.baseUrl}/emails/batch`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        emails.map(email => ({
          from: email.from || 'Ruwād Platform <noreply@ruwad.gov.sa>',
          to: [email.to],
          subject: email.subject,
          html: email.html,
        }))
      ),
    });
    
    if (!response.ok) {
      throw new Error(`Bulk Email API error: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  }
}
```

### **Twilio SMS Service**
```typescript
// src/services/SMSService.ts
export class TwilioSMSService {
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;
  
  constructor(accountSid: string, authToken: string, fromNumber: string) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.fromNumber = fromNumber;
  }
  
  async sendSMS(to: string, message: string): Promise<{ sid: string }> {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
    
    const body = new URLSearchParams({
      From: this.fromNumber,
      To: to,
      Body: message,
    });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${this.accountSid}:${this.authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
    
    if (!response.ok) {
      throw new Error(`SMS API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return { sid: data.sid };
  }
  
  async sendWhatsApp(to: string, message: string): Promise<{ sid: string }> {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
    
    const body = new URLSearchParams({
      From: `whatsapp:${this.fromNumber}`,
      To: `whatsapp:${to}`,
      Body: message,
    });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${this.accountSid}:${this.authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
    
    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return { sid: data.sid };
  }
}
```

## 📊 **ANALYTICS SERVICES**

### **Google Analytics 4 Integration**
```typescript
// src/services/AnalyticsService.ts
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export class GoogleAnalyticsService {
  private measurementId: string;
  
  constructor(measurementId: string) {
    this.measurementId = measurementId;
    this.initializeGA();
  }
  
  private initializeGA(): void {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    script.async = true;
    document.head.appendChild(script);
    
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    
    window.gtag('js', new Date());
    window.gtag('config', this.measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
  
  trackPageView(pagePath: string, pageTitle?: string): void {
    window.gtag('config', this.measurementId, {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
  
  trackEvent(eventName: string, parameters?: {
    category?: string;
    label?: string;
    value?: number;
    [key: string]: any;
  }): void {
    window.gtag('event', eventName, {
      event_category: parameters?.category,
      event_label: parameters?.label,
      value: parameters?.value,
      ...parameters,
    });
  }
  
  trackCustomEvent(eventName: string, customParameters: Record<string, any>): void {
    window.gtag('event', eventName, customParameters);
  }
  
  setUserProperties(properties: Record<string, any>): void {
    window.gtag('config', this.measurementId, {
      custom_map: properties,
    });
  }
}
```

### **Mixpanel Integration**
```typescript
// src/services/MixpanelService.ts
export class MixpanelService {
  private projectToken: string;
  private baseUrl = 'https://api.mixpanel.com';
  
  constructor(projectToken: string) {
    this.projectToken = projectToken;
  }
  
  async trackEvent(event: string, properties: Record<string, any> = {}): Promise<void> {
    const data = {
      event,
      properties: {
        token: this.projectToken,
        time: Date.now(),
        ...properties,
      },
    };
    
    const encodedData = btoa(JSON.stringify(data));
    
    await fetch(`${this.baseUrl}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodedData}`,
    });
  }
  
  async identify(userId: string, properties: Record<string, any> = {}): Promise<void> {
    const data = {
      $token: this.projectToken,
      $distinct_id: userId,
      $set: properties,
    };
    
    const encodedData = btoa(JSON.stringify(data));
    
    await fetch(`${this.baseUrl}/engage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodedData}`,
    });
  }
}
```

## 🖼️ **MEDIA & STORAGE SERVICES**

### **Unsplash Integration**
```typescript
// src/services/UnsplashService.ts
export class UnsplashService {
  private accessKey: string;
  private baseUrl = 'https://api.unsplash.com';
  
  constructor(accessKey: string) {
    this.accessKey = accessKey;
  }
  
  async searchPhotos(query: string, options?: {
    page?: number;
    perPage?: number;
    orientation?: 'landscape' | 'portrait' | 'squarish';
    color?: string;
  }): Promise<{
    results: UnsplashPhoto[];
    total: number;
    totalPages: number;
  }> {
    const { page = 1, perPage = 20, orientation, color } = options || {};
    
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      per_page: perPage.toString(),
    });
    
    if (orientation) params.append('orientation', orientation);
    if (color) params.append('color', color);
    
    const response = await fetch(`${this.baseUrl}/search/photos?${params}`, {
      headers: {
        'Authorization': `Client-ID ${this.accessKey}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      results: data.results,
      total: data.total,
      totalPages: data.total_pages,
    };
  }
  
  async getRandomPhoto(options?: {
    collections?: string;
    topics?: string;
    username?: string;
    query?: string;
    orientation?: 'landscape' | 'portrait' | 'squarish';
    count?: number;
  }): Promise<UnsplashPhoto | UnsplashPhoto[]> {
    const params = new URLSearchParams();
    
    if (options?.collections) params.append('collections', options.collections);
    if (options?.topics) params.append('topics', options.topics);
    if (options?.username) params.append('username', options.username);
    if (options?.query) params.append('query', options.query);
    if (options?.orientation) params.append('orientation', options.orientation);
    if (options?.count) params.append('count', options.count.toString());
    
    const response = await fetch(`${this.baseUrl}/photos/random?${params}`, {
      headers: {
        'Authorization': `Client-ID ${this.accessKey}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }
    
    return await response.json();
  }
  
  async downloadPhoto(photoId: string): Promise<{ url: string }> {
    const response = await fetch(`${this.baseUrl}/photos/${photoId}/download`, {
      headers: {
        'Authorization': `Client-ID ${this.accessKey}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }
    
    return await response.json();
  }
}

interface UnsplashPhoto {
  id: string;
  created_at: string;
  updated_at: string;
  width: number;
  height: number;
  color: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    id: string;
    username: string;
    name: string;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
  };
}
```

### **Cloudinary Integration**
```typescript
// src/services/CloudinaryService.ts
export class CloudinaryService {
  private cloudName: string;
  private apiKey: string;
  private apiSecret: string;
  
  constructor(cloudName: string, apiKey: string, apiSecret: string) {
    this.cloudName = cloudName;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }
  
  async uploadImage(file: File, options?: {
    folder?: string;
    publicId?: string;
    transformation?: string[];
    tags?: string[];
  }): Promise<{
    publicId: string;
    url: string;
    secureUrl: string;
    format: string;
    width: number;
    height: number;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ruwad_preset'); // Configure in Cloudinary
    
    if (options?.folder) formData.append('folder', options.folder);
    if (options?.publicId) formData.append('public_id', options.publicId);
    if (options?.tags) formData.append('tags', options.tags.join(','));
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      throw new Error(`Cloudinary upload error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      publicId: data.public_id,
      url: data.url,
      secureUrl: data.secure_url,
      format: data.format,
      width: data.width,
      height: data.height,
    };
  }
  
  generateImageUrl(publicId: string, transformations?: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'crop';
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  }): string {
    let url = `https://res.cloudinary.com/${this.cloudName}/image/upload/`;
    
    if (transformations) {
      const transforms: string[] = [];
      
      if (transformations.width) transforms.push(`w_${transformations.width}`);
      if (transformations.height) transforms.push(`h_${transformations.height}`);
      if (transformations.crop) transforms.push(`c_${transformations.crop}`);
      if (transformations.quality) transforms.push(`q_${transformations.quality}`);
      if (transformations.format) transforms.push(`f_${transformations.format}`);
      
      if (transforms.length > 0) {
        url += transforms.join(',') + '/';
      }
    }
    
    return url + publicId;
  }
}
```

## 🔐 **AUTHENTICATION SERVICES**

### **OAuth Integration (Google, Microsoft)**
```typescript
// src/services/OAuthService.ts
export class OAuthService {
  async initiateGoogleAuth(): Promise<void> {
    const googleAuthUrl = new URL('https://accounts.google.com/oauth/authorize');
    googleAuthUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID!);
    googleAuthUrl.searchParams.set('redirect_uri', `${window.location.origin}/auth/callback/google`);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('access_type', 'offline');
    
    window.location.href = googleAuthUrl.toString();
  }
  
  async initiateMicrosoftAuth(): Promise<void> {
    const msAuthUrl = new URL('https://login.microsoftonline.com/common/oauth2/v2.0/authorize');
    msAuthUrl.searchParams.set('client_id', process.env.MICROSOFT_CLIENT_ID!);
    msAuthUrl.searchParams.set('redirect_uri', `${window.location.origin}/auth/callback/microsoft`);
    msAuthUrl.searchParams.set('response_type', 'code');
    msAuthUrl.searchParams.set('scope', 'openid email profile');
    msAuthUrl.searchParams.set('response_mode', 'query');
    
    window.location.href = msAuthUrl.toString();
  }
  
  async handleCallback(provider: 'google' | 'microsoft', code: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    userInfo: any;
  }> {
    // This would typically be handled by your backend
    const response = await fetch(`/api/auth/${provider}/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    
    if (!response.ok) {
      throw new Error(`OAuth callback error: ${response.statusText}`);
    }
    
    return await response.json();
  }
}
```

## 🔍 **MONITORING SERVICES**

### **Sentry Error Tracking**
```typescript
// src/services/ErrorTrackingService.ts
import * as Sentry from '@sentry/react';

export class SentryService {
  static initialize(dsn: string, environment: string): void {
    Sentry.init({
      dsn,
      environment,
      integrations: [
        new Sentry.BrowserTracing(),
      ],
      tracesSampleRate: 1.0,
      beforeSend(event, hint) {
        // Filter out non-critical errors
        if (event.exception) {
          const error = hint.originalException;
          if (error instanceof Error && error.message.includes('Non-critical')) {
            return null;
          }
        }
        return event;
      },
    });
  }
  
  static captureError(error: Error, context?: Record<string, any>): void {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext('additional_info', context);
      }
      Sentry.captureException(error);
    });
  }
  
  static captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    Sentry.captureMessage(message, level);
  }
  
  static setUser(user: { id: string; email?: string; username?: string }): void {
    Sentry.setUser(user);
  }
  
  static addBreadcrumb(message: string, category: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      timestamp: Date.now() / 1000,
    });
  }
}
```

## ⚙️ **SERVICE CONFIGURATION**

### **Environment Variables**
```bash
# AI Services
VITE_OPENAI_API_KEY=sk-...
VITE_GOOGLE_TRANSLATE_API_KEY=...

# Communication
VITE_RESEND_API_KEY=re_...
VITE_TWILIO_ACCOUNT_SID=AC...
VITE_TWILIO_AUTH_TOKEN=...
VITE_TWILIO_PHONE_NUMBER=+1...

# Analytics
VITE_GA_MEASUREMENT_ID=G-...
VITE_MIXPANEL_PROJECT_TOKEN=...

# Media
VITE_UNSPLASH_ACCESS_KEY=...
VITE_CLOUDINARY_CLOUD_NAME=...
VITE_CLOUDINARY_API_KEY=...
VITE_CLOUDINARY_API_SECRET=...

# OAuth
VITE_GOOGLE_CLIENT_ID=...
VITE_MICROSOFT_CLIENT_ID=...

# Monitoring
VITE_SENTRY_DSN=https://...
```

### **Service Factory Pattern**
```typescript
// src/services/ServiceFactory.ts
export class ServiceFactory {
  private static instances = new Map<string, any>();
  
  static getOpenAIService(): OpenAIService {
    if (!this.instances.has('openai')) {
      this.instances.set('openai', new OpenAIService(
        import.meta.env.VITE_OPENAI_API_KEY
      ));
    }
    return this.instances.get('openai');
  }
  
  static getEmailService(): ResendEmailService {
    if (!this.instances.has('email')) {
      this.instances.set('email', new ResendEmailService(
        import.meta.env.VITE_RESEND_API_KEY
      ));
    }
    return this.instances.get('email');
  }
  
  static getAnalyticsService(): GoogleAnalyticsService {
    if (!this.instances.has('analytics')) {
      this.instances.set('analytics', new GoogleAnalyticsService(
        import.meta.env.VITE_GA_MEASUREMENT_ID
      ));
    }
    return this.instances.get('analytics');
  }
  
  // Add other services as needed
}
```

---

*Third-party integrations extend platform capabilities with powerful external services.*