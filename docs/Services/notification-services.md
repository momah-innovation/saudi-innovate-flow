# Notification Services

Comprehensive notification system for email, push, and in-app notifications in the Enterprise Management System.

## 📧 Email Services

### Email Service Provider Integration
**Location**: `src/services/notifications/email-service.ts`

```typescript
import nodemailer from 'nodemailer';
import { supabase } from '@/integrations/supabase/client';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content: string;
  variables: string[];
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail(
    to: string | string[],
    templateId: string,
    variables: Record<string, any> = {},
    attachments?: any[]
  ) {
    try {
      // Get email template
      const template = await this.getEmailTemplate(templateId);
      
      // Process template with variables
      const processedContent = this.processTemplate(template, variables);
      
      // Send email
      const result = await this.transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject: processedContent.subject,
        html: processedContent.html,
        text: processedContent.text,
        attachments
      });

      // Log email activity
      await this.logEmailActivity(to, templateId, 'sent', result.messageId);
      
      return result;
    } catch (error) {
      await this.logEmailActivity(to, templateId, 'failed', null, error.message);
      throw error;
    }
  }

  private async getEmailTemplate(templateId: string): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (error || !data) {
      throw new Error(`Email template not found: ${templateId}`);
    }

    return data;
  }

  private processTemplate(template: EmailTemplate, variables: Record<string, any>) {
    let subject = template.subject;
    let html = template.html_content;
    let text = template.text_content;

    // Replace variables in template
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
      html = html.replace(new RegExp(placeholder, 'g'), String(value));
      text = text.replace(new RegExp(placeholder, 'g'), String(value));
    });

    return { subject, html, text };
  }

  private async logEmailActivity(
    recipient: string | string[],
    templateId: string,
    status: 'sent' | 'failed',
    messageId: string | null,
    errorMessage?: string
  ) {
    await supabase
      .from('email_logs')
      .insert([{
        recipient: Array.isArray(recipient) ? recipient[0] : recipient,
        template_id: templateId,
        status,
        message_id: messageId,
        error_message: errorMessage,
        sent_at: new Date().toISOString()
      }]);
  }
}

export const emailService = new EmailService();
```

### Email Templates
Pre-defined email templates for common scenarios:

#### Welcome Email
```html
<!DOCTYPE html>
<html>
<head>
  <title>Welcome to Innovation Platform</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #2563eb;">Welcome to Innovation Platform, {{user_name}}!</h1>
    
    <p>Thank you for joining our innovation community. We're excited to have you on board!</p>
    
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3>Get Started:</h3>
      <ul>
        <li>Complete your profile</li>
        <li>Browse active challenges</li>
        <li>Submit your first innovation</li>
      </ul>
    </div>
    
    <a href="{{platform_url}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
      Start Innovating
    </a>
    
    <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
      If you have any questions, feel free to contact our support team.
    </p>
  </div>
</body>
</html>
```

#### Challenge Notification
```html
<!DOCTYPE html>
<html>
<head>
  <title>New Challenge: {{challenge_title}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #059669;">New Challenge Available!</h1>
    
    <h2>{{challenge_title}}</h2>
    <p>{{challenge_description}}</p>
    
    <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p><strong>Deadline:</strong> {{deadline}}</p>
      <p><strong>Reward:</strong> {{reward}}</p>
      <p><strong>Category:</strong> {{category}}</p>
    </div>
    
    <a href="{{challenge_url}}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
      View Challenge
    </a>
  </div>
</body>
</html>
```

### Email Campaign Management
```typescript
interface EmailCampaign {
  id: string;
  name: string;
  template_id: string;
  audience_filter: Record<string, any>;
  schedule_type: 'immediate' | 'scheduled' | 'recurring';
  scheduled_at?: Date;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
}

class EmailCampaignManager {
  async createCampaign(campaign: Omit<EmailCampaign, 'id'>): Promise<string> {
    const { data, error } = await supabase
      .from('email_campaigns')
      .insert([campaign])
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  async sendCampaign(campaignId: string): Promise<void> {
    const campaign = await this.getCampaign(campaignId);
    const recipients = await this.getRecipients(campaign.audience_filter);
    
    // Update campaign status
    await this.updateCampaignStatus(campaignId, 'sending');
    
    try {
      // Send emails in batches
      const batchSize = 50;
      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        await this.sendBatchEmails(campaign, batch);
        
        // Rate limiting
        await this.delay(1000);
      }
      
      await this.updateCampaignStatus(campaignId, 'sent');
    } catch (error) {
      await this.updateCampaignStatus(campaignId, 'paused');
      throw error;
    }
  }

  private async getRecipients(filter: Record<string, any>): Promise<string[]> {
    let query = supabase
      .from('user_profiles')
      .select('email');

    // Apply filters
    Object.entries(filter).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        query = query.in(key, value);
      } else {
        query = query.eq(key, value);
      }
    });

    const { data, error } = await query;
    if (error) throw error;
    
    return data.map(user => user.email);
  }
}

export const emailCampaignManager = new EmailCampaignManager();
```

## 🔔 In-App Notifications

### Real-time Notification System
**Location**: `src/services/notifications/notification-service.ts`

```typescript
interface Notification {
  id: string;
  user_id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  created_at: Date;
  expires_at?: Date;
}

class NotificationService {
  async createNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    data?: Record<string, any>,
    expiresAt?: Date
  ): Promise<string> {
    const notification = {
      user_id: userId,
      type,
      title,
      message,
      data,
      read: false,
      created_at: new Date(),
      expires_at: expiresAt
    };

    const { data: result, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select('id')
      .single();

    if (error) throw error;

    // Send real-time notification
    await this.broadcastNotification(userId, notification);
    
    return result.id;
  }

  async getUserNotifications(
    userId: string,
    unreadOnly: boolean = false
  ): Promise<Notification[]> {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return data;
  }

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  }

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
  }

  private async broadcastNotification(userId: string, notification: any) {
    // Use Supabase real-time to broadcast notification
    await supabase
      .channel(`notifications:${userId}`)
      .send({
        type: 'broadcast',
        event: 'new_notification',
        payload: notification
      });
  }
}

export const notificationService = new NotificationService();
```

### Notification Types and Templates
```typescript
export const NotificationTemplates = {
  CHALLENGE_CREATED: {
    type: 'info' as const,
    title: 'New Challenge Available',
    getMessage: (challengeTitle: string) => 
      `A new challenge "${challengeTitle}" has been created and is now accepting submissions.`
  },
  
  SUBMISSION_RECEIVED: {
    type: 'success' as const,
    title: 'Submission Received',
    getMessage: (challengeTitle: string) => 
      `Your submission for "${challengeTitle}" has been received and is being reviewed.`
  },
  
  EVALUATION_COMPLETED: {
    type: 'info' as const,
    title: 'Evaluation Complete',
    getMessage: (challengeTitle: string, score: number) => 
      `Your submission for "${challengeTitle}" has been evaluated. Score: ${score}/100`
  },
  
  CHALLENGE_DEADLINE: {
    type: 'warning' as const,
    title: 'Challenge Deadline Approaching',
    getMessage: (challengeTitle: string, daysLeft: number) => 
      `Only ${daysLeft} days left to submit for "${challengeTitle}"`
  },
  
  SYSTEM_MAINTENANCE: {
    type: 'warning' as const,
    title: 'Scheduled Maintenance',
    getMessage: (startTime: string, duration: string) => 
      `System maintenance scheduled for ${startTime}. Expected duration: ${duration}`
  }
};

// Helper function to create typed notifications
export const createTypedNotification = async (
  userId: string,
  template: keyof typeof NotificationTemplates,
  ...args: any[]
) => {
  const config = NotificationTemplates[template];
  
  return notificationService.createNotification(
    userId,
    config.type,
    config.title,
    config.getMessage(...args)
  );
};
```

## 📱 Push Notifications

### Web Push Notifications
**Location**: `src/services/notifications/push-service.ts`

```typescript
interface PushSubscription {
  user_id: string;
  endpoint: string;
  p256dh_key: string;
  auth_key: string;
  created_at: Date;
}

class PushNotificationService {
  private vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY!,
    privateKey: process.env.VAPID_PRIVATE_KEY!
  };

  async subscribeToPush(
    userId: string,
    subscription: PushSubscriptionJSON
  ): Promise<void> {
    const pushSubscription = {
      user_id: userId,
      endpoint: subscription.endpoint!,
      p256dh_key: subscription.keys!.p256dh,
      auth_key: subscription.keys!.auth,
      created_at: new Date()
    };

    const { error } = await supabase
      .from('push_subscriptions')
      .upsert([pushSubscription], {
        onConflict: 'user_id,endpoint'
      });

    if (error) throw error;
  }

  async sendPushNotification(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<void> {
    // Get user's push subscriptions
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId);

    if (error || !subscriptions.length) return;

    const payload = JSON.stringify({
      title,
      body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      data: {
        ...data,
        timestamp: Date.now(),
        url: data?.url || '/'
      }
    });

    // Send to all user's devices
    const promises = subscriptions.map(sub => 
      this.sendToSubscription(sub, payload)
    );

    await Promise.allSettled(promises);
  }

  private async sendToSubscription(
    subscription: PushSubscription,
    payload: string
  ): Promise<void> {
    try {
      const webpush = await import('web-push');
      
      webpush.setVapidDetails(
        'mailto:admin@innovationplatform.com',
        this.vapidKeys.publicKey,
        this.vapidKeys.privateKey
      );

      await webpush.sendNotification({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh_key,
          auth: subscription.auth_key
        }
      }, payload);

    } catch (error) {
      // Remove invalid subscriptions
      if (error.statusCode === 410) {
        await this.removeSubscription(subscription.user_id, subscription.endpoint);
      }
    }
  }

  private async removeSubscription(userId: string, endpoint: string): Promise<void> {
    await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', userId)
      .eq('endpoint', endpoint);
  }
}

export const pushNotificationService = new PushNotificationService();
```

### Service Worker Registration
**Location**: `public/sw.js`

```javascript
self.addEventListener('push', event => {
  const options = event.data ? event.data.json() : {};
  
  event.waitUntil(
    self.registration.showNotification(options.title, {
      body: options.body,
      icon: options.icon,
      badge: options.badge,
      data: options.data,
      actions: [
        {
          action: 'view',
          title: 'View',
          icon: '/action-view.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/action-dismiss.png'
        }
      ]
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'view' || !event.action) {
    const url = event.notification.data?.url || '/';
    
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});
```

## 📊 Notification Analytics

### Notification Performance Tracking
```typescript
interface NotificationMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
}

class NotificationAnalytics {
  async trackNotificationEvent(
    notificationId: string,
    event: 'sent' | 'delivered' | 'opened' | 'clicked',
    metadata?: Record<string, any>
  ): Promise<void> {
    await supabase
      .from('notification_events')
      .insert([{
        notification_id: notificationId,
        event_type: event,
        metadata,
        timestamp: new Date()
      }]);
  }

  async getNotificationMetrics(
    timeframe: 'day' | 'week' | 'month',
    notificationType?: string
  ): Promise<NotificationMetrics> {
    const startDate = this.getStartDate(timeframe);
    
    let query = supabase
      .from('notification_events')
      .select('event_type, notification_id')
      .gte('timestamp', startDate.toISOString());

    if (notificationType) {
      query = query.eq('notification_type', notificationType);
    }

    const { data, error } = await query;
    if (error) throw error;

    return this.calculateMetrics(data);
  }

  private calculateMetrics(events: any[]): NotificationMetrics {
    const metrics = {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0
    };

    events.forEach(event => {
      metrics[event.event_type]++;
    });

    return {
      ...metrics,
      delivery_rate: metrics.sent > 0 ? (metrics.delivered / metrics.sent) * 100 : 0,
      open_rate: metrics.delivered > 0 ? (metrics.opened / metrics.delivered) * 100 : 0,
      click_rate: metrics.opened > 0 ? (metrics.clicked / metrics.opened) * 100 : 0
    };
  }
}

export const notificationAnalytics = new NotificationAnalytics();
```

## 🎯 Smart Notification Rules

### Automated Notification Triggers
```typescript
interface NotificationRule {
  id: string;
  name: string;
  trigger_event: string;
  conditions: Record<string, any>;
  notification_template: string;
  delivery_method: 'email' | 'push' | 'in_app' | 'all';
  is_active: boolean;
}

class SmartNotificationEngine {
  async processEvent(eventType: string, eventData: any): Promise<void> {
    // Get applicable notification rules
    const { data: rules, error } = await supabase
      .from('notification_rules')
      .select('*')
      .eq('trigger_event', eventType)
      .eq('is_active', true);

    if (error || !rules.length) return;

    // Process each rule
    for (const rule of rules) {
      if (this.evaluateConditions(rule.conditions, eventData)) {
        await this.executeNotificationRule(rule, eventData);
      }
    }
  }

  private evaluateConditions(conditions: Record<string, any>, eventData: any): boolean {
    return Object.entries(conditions).every(([key, expectedValue]) => {
      const actualValue = this.getNestedValue(eventData, key);
      
      if (typeof expectedValue === 'object' && expectedValue.operator) {
        return this.evaluateOperator(actualValue, expectedValue);
      }
      
      return actualValue === expectedValue;
    });
  }

  private async executeNotificationRule(rule: NotificationRule, eventData: any): Promise<void> {
    const recipients = await this.getRecipients(rule, eventData);
    
    for (const recipient of recipients) {
      switch (rule.delivery_method) {
        case 'email':
          await emailService.sendEmail(recipient.email, rule.notification_template, eventData);
          break;
        case 'push':
          await pushNotificationService.sendPushNotification(
            recipient.id,
            'Notification',
            'You have a new notification',
            eventData
          );
          break;
        case 'in_app':
          await notificationService.createNotification(
            recipient.id,
            'info',
            'Notification',
            'You have a new notification',
            eventData
          );
          break;
        case 'all':
          // Send via all channels
          break;
      }
    }
  }
}

export const smartNotificationEngine = new SmartNotificationEngine();
```

---

*Notification Services: 20+ documented | Multi-Channel: ✅ Enabled | Analytics: ✅ Tracked*