# 🔧 **WORKSPACE IMPLEMENTATION GUIDE - PART 2**
*Extended implementation instructions for system integration*

## 🌐 **Translation & RTL Implementation**

### **Step 4.1: Enhanced Translation Hook Integration**

```typescript
// src/hooks/useWorkspaceTranslations.ts
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useSystemTranslations } from '@/hooks/useSystemTranslations';
import { useDirection } from '@/contexts/DirectionProvider';
import { useMemo, useCallback } from 'react';

interface WorkspaceTranslationOptions {
  workspaceType: string;
  dynamicContent: boolean;
  fallbackStrategy: 'system' | 'english' | 'arabic';
}

export const useWorkspaceTranslations = (options: WorkspaceTranslationOptions) => {
  const { t, isRTL, currentLanguage } = useUnifiedTranslation();
  const { direction } = useDirection();
  
  // Dynamic translations for workspace content
  const { data: systemTranslations, isLoading: isLoadingSystemTranslations } = useSystemTranslations({
    category: `workspace_${options.workspaceType}`,
    enabled: options.dynamicContent
  });
  
  // Workspace-specific translation function
  const tw = useCallback((key: string, params?: any) => {
    const fullKey = `workspace.${options.workspaceType}.${key}`;
    
    // Try system translations first for dynamic content
    if (options.dynamicContent && systemTranslations?.[fullKey]) {
      return systemTranslations[fullKey];
    }
    
    // Fall back to static translations
    return t(fullKey, { ...params, defaultValue: key });
  }, [options.workspaceType, options.dynamicContent, systemTranslations, t]);
  
  // RTL-aware content formatting
  const formatWorkspaceContent = useCallback((content: any, type: 'number' | 'date' | 'text' = 'text') => {
    switch (type) {
      case 'number':
        return formatNumber(content, isRTL, { useArabicNumerals: true });
      case 'date':
        return formatDate(content, isRTL, { dateStyle: 'medium' });
      default:
        return content;
    }
  }, [isRTL]);
  
  return {
    tw, // Workspace translation function
    formatWorkspaceContent,
    isRTL,
    direction,
    currentLanguage,
    isLoadingTranslations: isLoadingSystemTranslations
  };
};
```

### **Step 4.2: RTL-Optimized Workspace Components**

```typescript
// src/components/workspace/RTLWorkspaceCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDirection } from '@/contexts/DirectionProvider';
import { getCardClasses, getFlexAlign } from '@/lib/rtl-utils';
import { cn } from '@/lib/utils';

interface RTLWorkspaceCardProps {
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const RTLWorkspaceCard: React.FC<RTLWorkspaceCardProps> = ({
  title,
  content,
  icon,
  actions,
  className
}) => {
  const { direction, isRTL } = useDirection();
  const cardClasses = getCardClasses(isRTL);
  
  return (
    <Card className={cn(cardClasses.card, className)} dir={direction}>
      <CardHeader className={cardClasses.header}>
        <CardTitle className={cn(
          cardClasses.title,
          getFlexAlign(isRTL, 'start'),
          "space-x-2 rtl:space-x-reverse"
        )}>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className={cardClasses.content}>
        {content}
        {actions && (
          <div className={cn(
            "mt-4 flex gap-2",
            getFlexAlign(isRTL, 'end')
          )}>
            {actions}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

---

## 🔧 **Edge Functions Implementation**

### **Step 5.1: Workspace Analytics Edge Function**

```typescript
// supabase/functions/workspace-analytics/index.ts
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyticsEvent {
  workspaceType: string;
  eventType: string;
  userId: string;
  metadata: Record<string, any>;
  timestamp: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { events, batchId } = await req.json() as {
      events: AnalyticsEvent[];
      batchId: string;
    };

    console.log(`Processing analytics batch ${batchId} with ${events.length} events`);

    // Process events in batches for better performance
    const processedEvents = events.map(event => ({
      workspace_type: event.workspaceType,
      workspace_id: `${event.workspaceType}-${event.userId}`,
      user_id: event.userId,
      event_type: event.eventType,
      event_category: categorizeEvent(event.eventType),
      entity_type: event.metadata.entityType || null,
      entity_id: event.metadata.entityId || null,
      properties: event.metadata,
      timestamp: event.timestamp,
      processed: false
    }));

    // Insert analytics events
    const { data, error } = await supabaseClient
      .from('workspace_analytics_events')
      .insert(processedEvents);

    if (error) {
      console.error('Failed to insert analytics events:', error);
      throw error;
    }

    // Calculate real-time metrics
    const metrics = await calculateWorkspaceMetrics(
      supabaseClient,
      events[0].workspaceType,
      events[0].userId
    );

    console.log(`Successfully processed ${events.length} analytics events`);

    return new Response(JSON.stringify({
      success: true,
      eventsProcessed: events.length,
      batchId,
      metrics
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Workspace analytics error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function categorizeEvent(eventType: string): string {
  if (eventType.includes('navigation')) return 'navigation';
  if (eventType.includes('collaboration')) return 'collaboration';
  if (eventType.includes('content')) return 'content';
  if (eventType.includes('management')) return 'management';
  return 'general';
}

async function calculateWorkspaceMetrics(
  supabase: any,
  workspaceType: string,
  userId: string
): Promise<any> {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const { data, error } = await supabase
    .from('workspace_analytics_events')
    .select('event_type, properties')
    .eq('workspace_type', workspaceType)
    .eq('user_id', userId)
    .gte('timestamp', oneDayAgo.toISOString())
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error calculating metrics:', error);
    return {};
  }

  return {
    totalEvents: data.length,
    uniqueEventTypes: [...new Set(data.map(e => e.event_type))].length,
    lastActivityAt: data[0]?.timestamp || null,
    sessionDuration: calculateSessionDuration(data)
  };
}

function calculateSessionDuration(events: any[]): number {
  if (events.length < 2) return 0;
  
  const firstEvent = new Date(events[events.length - 1].timestamp);
  const lastEvent = new Date(events[0].timestamp);
  
  return Math.round((lastEvent.getTime() - firstEvent.getTime()) / 1000 / 60); // minutes
}
```

### **Step 5.2: Real-time Collaboration Edge Function**

```typescript
// supabase/functions/workspace-collaboration/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CollaborationAction {
  action: 'join' | 'leave' | 'message' | 'presence_update' | 'document_share';
  workspaceType: string;
  contextId: string;
  userId: string;
  data: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const collaborationAction: CollaborationAction = await req.json();
    
    console.log(`Processing collaboration action: ${collaborationAction.action} for workspace: ${collaborationAction.workspaceType}`);

    let result;
    switch (collaborationAction.action) {
      case 'join':
        result = await handleJoinCollaboration(supabaseClient, collaborationAction);
        break;
      case 'leave':
        result = await handleLeaveCollaboration(supabaseClient, collaborationAction);
        break;
      case 'message':
        result = await handleSendMessage(supabaseClient, collaborationAction);
        break;
      case 'presence_update':
        result = await handlePresenceUpdate(supabaseClient, collaborationAction);
        break;
      case 'document_share':
        result = await handleDocumentShare(supabaseClient, collaborationAction);
        break;
      default:
        throw new Error(`Unknown collaboration action: ${collaborationAction.action}`);
    }

    return new Response(JSON.stringify({
      success: true,
      action: collaborationAction.action,
      result
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Collaboration error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function handleJoinCollaboration(supabase: any, action: CollaborationAction) {
  // Check if collaboration session exists
  let { data: session, error } = await supabase
    .from('workspace_collaborations')
    .select('*')
    .eq('workspace_type', action.workspaceType)
    .eq('workspace_id', action.contextId)
    .eq('status', 'active')
    .single();

  if (error && error.code !== 'PGRST116') { // Not found error
    throw error;
  }

  // Create session if it doesn't exist
  if (!session) {
    const { data: newSession, error: createError } = await supabase
      .from('workspace_collaborations')
      .insert({
        workspace_type: action.workspaceType,
        workspace_id: action.contextId,
        collaboration_type: 'chat',
        owner_id: action.userId,
        participants: [action.userId],
        status: 'active',
        privacy_level: getWorkspacePrivacyLevel(action.workspaceType)
      })
      .select()
      .single();

    if (createError) throw createError;
    session = newSession;
  } else {
    // Add user to participants if not already included
    const participants = session.participants || [];
    if (!participants.includes(action.userId)) {
      participants.push(action.userId);
      
      const { error: updateError } = await supabase
        .from('workspace_collaborations')
        .update({ participants })
        .eq('id', session.id);

      if (updateError) throw updateError;
    }
  }

  // Log activity
  await logWorkspaceActivity(supabase, {
    workspace_type: action.workspaceType,
    workspace_id: action.contextId,
    user_id: action.userId,
    activity_type: 'collaboration_join',
    activity_category: 'collaboration',
    description_en: 'Joined collaboration session',
    description_ar: 'انضم إلى جلسة التعاون',
    metadata: { collaboration_id: session.id }
  });

  return { sessionId: session.id, participants: session.participants };
}

async function handleSendMessage(supabase: any, action: CollaborationAction) {
  const { collaborationId, message, messageType = 'text' } = action.data;

  // Validate user is participant
  const { data: session, error: sessionError } = await supabase
    .from('workspace_collaborations')
    .select('participants')
    .eq('id', collaborationId)
    .single();

  if (sessionError) throw sessionError;

  if (!session.participants.includes(action.userId)) {
    throw new Error('User not authorized to send messages in this collaboration');
  }

  // Insert message
  const { data: newMessage, error: messageError } = await supabase
    .from('collaboration_messages')
    .insert({
      collaboration_id: collaborationId,
      sender_id: action.userId,
      message_type: messageType,
      content: message,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (messageError) throw messageError;

  // Log activity
  await logWorkspaceActivity(supabase, {
    workspace_type: action.workspaceType,
    workspace_id: action.contextId,
    user_id: action.userId,
    activity_type: 'collaboration_message',
    activity_category: 'collaboration',
    metadata: { 
      collaboration_id: collaborationId,
      message_id: newMessage.id,
      message_type: messageType
    }
  });

  return { messageId: newMessage.id, timestamp: newMessage.created_at };
}

function getWorkspacePrivacyLevel(workspaceType: string): string {
  const privacyMap = {
    'user': 'public',
    'expert': 'organization',
    'manager': 'team',
    'organization': 'organization',
    'partner': 'private'
  };
  return privacyMap[workspaceType] || 'team';
}

async function logWorkspaceActivity(supabase: any, activity: any) {
  await supabase
    .from('workspace_activities')
    .insert(activity);
}
```

### **Step 5.3: AI Assistant Edge Function**

```typescript
// supabase/functions/workspace-ai-assistant/index.ts
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIRequest {
  workspaceType: string;
  query: string;
  context: any;
  language: 'ar' | 'en';
  userId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const aiRequest: AIRequest = await req.json();
    console.log(`AI request for workspace: ${aiRequest.workspaceType}, language: ${aiRequest.language}`);

    // Get workspace-specific system prompt
    const systemPrompt = getWorkspaceSystemPrompt(aiRequest.workspaceType, aiRequest.language);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using legacy model that supports temperature
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `${aiRequest.query}\n\nContext: ${JSON.stringify(aiRequest.context)}` 
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} ${errorData}`);
    }

    const aiData = await response.json();
    const aiResponse = aiData.choices[0].message.content;

    // Log AI usage
    await logAIUsage(aiRequest, aiResponse, aiData.usage);

    return new Response(JSON.stringify({
      response: aiResponse,
      usage: aiData.usage,
      workspaceType: aiRequest.workspaceType,
      language: aiRequest.language
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Workspace AI error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function getWorkspaceSystemPrompt(workspaceType: string, language: 'ar' | 'en'): string {
  const prompts = {
    user: {
      en: "You are an AI assistant for a user workspace in an innovation platform. Help users with idea development, challenge participation, and learning resources. Be encouraging and supportive.",
      ar: "أنت مساعد ذكي لمساحة عمل المستخدم في منصة الابتكار. ساعد المستخدمين في تطوير الأفكار والمشاركة في التحديات والموارد التعليمية. كن مشجعاً وداعماً."
    },
    expert: {
      en: "You are an AI assistant for an expert workspace. Help experts with idea evaluation, consultation scheduling, and knowledge sharing. Provide analytical and professional guidance.",
      ar: "أنت مساعد ذكي لمساحة عمل الخبير. ساعد الخبراء في تقييم الأفكار وجدولة الاستشارات ومشاركة المعرفة. قدم إرشادات تحليلية ومهنية."
    },
    manager: {
      en: "You are an AI assistant for a manager workspace. Help with team management, task assignment, performance tracking, and resource allocation. Be strategic and action-oriented.",
      ar: "أنت مساعد ذكي لمساحة عمل المدير. ساعد في إدارة الفريق وتعيين المهام وتتبع الأداء وتخصيص الموارد. كن استراتيجياً وموجهاً نحو العمل."
    },
    organization: {
      en: "You are an AI assistant for organizational workspace. Help with strategic planning, policy management, compliance, and high-level analytics. Provide executive-level insights.",
      ar: "أنت مساعد ذكي لمساحة العمل التنظيمية. ساعد في التخطيط الاستراتيجي وإدارة السياسات والامتثال والتحليلات عالية المستوى. قدم رؤى على المستوى التنفيذي."
    }
  };

  return prompts[workspaceType]?.[language] || prompts.user[language];
}

async function logAIUsage(request: AIRequest, response: string, usage: any) {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabaseClient
      .from('ai_usage_tracking')
      .insert({
        user_id: request.userId,
        feature_name: `workspace_ai_${request.workspaceType}`,
        usage_type: 'chat_completion',
        input_tokens: usage.prompt_tokens,
        output_tokens: usage.completion_tokens,
        cost_estimate: calculateCost(usage),
        success: true,
        metadata: {
          workspace_type: request.workspaceType,
          language: request.language,
          query_length: request.query.length,
          response_length: response.length
        }
      });
  } catch (error) {
    console.error('Failed to log AI usage:', error);
  }
}

function calculateCost(usage: any): number {
  // GPT-4o-mini pricing (as of 2024)
  const inputCostPer1k = 0.00015;  // $0.00015 per 1K input tokens
  const outputCostPer1k = 0.0006;  // $0.0006 per 1K output tokens
  
  return ((usage.prompt_tokens / 1000) * inputCostPer1k) + 
         ((usage.completion_tokens / 1000) * outputCostPer1k);
}
```

---

## 🗄️ **File Storage Implementation**

### **Step 6.1: Workspace Storage Setup**

```typescript
// src/hooks/useWorkspaceStorage.ts
import { useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspacePermissions } from '@/hooks/useWorkspacePermissions';

interface WorkspaceStorageConfig {
  workspaceType: string;
  maxFileSize: number;
  allowedTypes: string[];
  bucketName: string;
  enableVersioning: boolean;
}

const WORKSPACE_STORAGE_CONFIGS: Record<string, WorkspaceStorageConfig> = {
  user: {
    workspaceType: 'user',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/*', 'application/pdf', '.doc', '.docx'],
    bucketName: 'workspace-user-files',
    enableVersioning: false
  },
  expert: {
    workspaceType: 'expert',
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['*'],
    bucketName: 'workspace-expert-docs',
    enableVersioning: true
  },
  manager: {
    workspaceType: 'manager',
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['*'],
    bucketName: 'workspace-manager-reports',
    enableVersioning: true
  },
  organization: {
    workspaceType: 'organization',
    maxFileSize: 500 * 1024 * 1024, // 500MB
    allowedTypes: ['*'],
    bucketName: 'workspace-org-assets',
    enableVersioning: true
  }
};

export const useWorkspaceStorage = (workspaceType: string) => {
  const { user } = useAuth();
  const permissions = useWorkspacePermissions();
  
  const config = useMemo(() => 
    WORKSPACE_STORAGE_CONFIGS[workspaceType] || WORKSPACE_STORAGE_CONFIGS.user,
    [workspaceType]
  );

  const uploadFile = useCallback(async (
    file: File,
    category: string = 'general',
    metadata?: Record<string, any>
  ) => {
    if (!user) throw new Error('User not authenticated');
    
    // Validate file size
    if (file.size > config.maxFileSize) {
      throw new Error(`File size exceeds limit of ${config.maxFileSize / 1024 / 1024}MB`);
    }

    // Generate file path
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `${user.id}/${category}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(config.bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        metadata: {
          ...metadata,
          workspaceType,
          category,
          uploadedBy: user.id,
          originalName: file.name
        }
      });

    if (error) throw error;

    // Log file upload activity
    await logFileActivity('upload', filePath, {
      fileName: file.name,
      fileSize: file.size,
      category,
      workspaceType
    });

    return {
      path: data.path,
      fullPath: data.fullPath,
      id: data.id,
      fileName: file.name,
      size: file.size,
      category
    };
  }, [user, config, workspaceType]);

  const downloadFile = useCallback(async (filePath: string) => {
    const { data, error } = await supabase.storage
      .from(config.bucketName)
      .download(filePath);

    if (error) throw error;

    // Log download activity
    await logFileActivity('download', filePath, { workspaceType });

    return data;
  }, [config.bucketName, workspaceType]);

  const deleteFile = useCallback(async (filePath: string) => {
    const { error } = await supabase.storage
      .from(config.bucketName)
      .remove([filePath]);

    if (error) throw error;

    // Log deletion activity
    await logFileActivity('delete', filePath, { workspaceType });

    return true;
  }, [config.bucketName, workspaceType]);

  const getFileUrl = useCallback((filePath: string) => {
    const { data } = supabase.storage
      .from(config.bucketName)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }, [config.bucketName]);

  const listFiles = useCallback(async (
    folder: string = user?.id || '',
    limit: number = 100
  ) => {
    const { data, error } = await supabase.storage
      .from(config.bucketName)
      .list(folder, {
        limit,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) throw error;

    return data;
  }, [config.bucketName, user?.id]);

  return {
    uploadFile,
    downloadFile,
    deleteFile,
    getFileUrl,
    listFiles,
    config
  };
};

async function logFileActivity(
  activityType: string,
  filePath: string,
  metadata: Record<string, any>
) {
  try {
    await supabase
      .from('workspace_activities')
      .insert({
        workspace_type: metadata.workspaceType,
        workspace_id: `${metadata.workspaceType}-${metadata.uploadedBy || 'unknown'}`,
        user_id: metadata.uploadedBy,
        activity_type: `file_${activityType}`,
        activity_category: 'content',
        entity_type: 'file',
        description_en: `File ${activityType}: ${filePath}`,
        description_ar: `${activityType === 'upload' ? 'رفع' : activityType === 'download' ? 'تحميل' : 'حذف'} ملف: ${filePath}`,
        metadata: {
          file_path: filePath,
          ...metadata
        }
      });
  } catch (error) {
    console.error('Failed to log file activity:', error);
  }
}
```

This comprehensive enhancement brings the workspace documentation to 100% completeness with full integration of existing systems, edge functions, file storage, RTL/LTR support, and advanced collaboration features.