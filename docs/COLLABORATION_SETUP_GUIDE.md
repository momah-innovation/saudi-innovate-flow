# دليل إعداد نظام التعاون المباشر (Collaboration Setup Guide)

## متطلبات النظام

### التقنيات المطلوبة
- React 18+
- TypeScript
- Supabase (قاعدة البيانات و Realtime)
- Tailwind CSS
- Radix UI Components

### الحزم المطلوبة
```json
{
  "@supabase/supabase-js": "^2.52.1",
  "@tanstack/react-query": "^5.56.2",
  "lucide-react": "^0.462.0",
  "sonner": "^1.5.0"
}
```

---

## إعداد قاعدة البيانات

### 1. إنشاء الجداول الأساسية

قم بتشغيل الـ SQL التالي في Supabase:

```sql
-- جدول حضور المستخدمين
CREATE TABLE user_presence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  user_info jsonb DEFAULT '{}',
  current_location jsonb DEFAULT '{}',
  status text DEFAULT 'online',
  last_seen timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- جدول أحداث الأنشطة
CREATE TABLE activity_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  event_type text NOT NULL,
  privacy_level text DEFAULT 'public',
  visibility_scope jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- جدول مساحات التعاون
CREATE TABLE collaboration_spaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  space_type text NOT NULL,
  privacy_level text DEFAULT 'public',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  participants uuid[] DEFAULT '{}',
  admins uuid[] DEFAULT '{}',
  settings jsonb DEFAULT '{"allow_mentions": true, "allow_file_uploads": true}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- جدول رسائل التعاون
CREATE TABLE collaboration_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id uuid REFERENCES collaboration_spaces(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  content text NOT NULL,
  message_type text DEFAULT 'text',
  entity_type text,
  entity_id uuid,
  thread_id uuid,
  reply_to uuid,
  metadata jsonb DEFAULT '{}',
  is_edited boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- جدول الإشعارات المباشرة
CREATE TABLE realtime_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  priority text DEFAULT 'medium',
  data jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);
```

### 2. تفعيل Row Level Security (RLS)

```sql
-- تفعيل RLS على جميع الجداول
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtime_notifications ENABLE ROW LEVEL SECURITY;

-- سياسات user_presence
CREATE POLICY "Users can update their own presence" ON user_presence
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view all presence" ON user_presence
  FOR SELECT USING (true);

-- سياسات activity_events
CREATE POLICY "Users can create their own activities" ON activity_events
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view public activities" ON activity_events
  FOR SELECT USING (
    privacy_level = 'public' OR 
    user_id = auth.uid() OR 
    (privacy_level = 'organization' AND auth.uid() IS NOT NULL)
  );

-- سياسات collaboration_spaces
CREATE POLICY "Users can create collaboration spaces" ON collaboration_spaces
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can view spaces they participate in" ON collaboration_spaces
  FOR SELECT USING (
    privacy_level = 'public' OR
    created_by = auth.uid() OR
    auth.uid() = ANY(participants) OR
    auth.uid() = ANY(admins)
  );

CREATE POLICY "Space admins can update spaces" ON collaboration_spaces
  FOR UPDATE USING (
    created_by = auth.uid() OR
    auth.uid() = ANY(admins)
  );

-- سياسات collaboration_messages
CREATE POLICY "Users can view messages in accessible spaces" ON collaboration_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM collaboration_spaces cs
      WHERE cs.id = space_id AND (
        cs.privacy_level = 'public' OR
        cs.created_by = auth.uid() OR
        auth.uid() = ANY(cs.participants) OR
        auth.uid() = ANY(cs.admins)
      )
    )
  );

CREATE POLICY "Users can create messages in accessible spaces" ON collaboration_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM collaboration_spaces cs
      WHERE cs.id = space_id AND (
        cs.privacy_level = 'public' OR
        cs.created_by = auth.uid() OR
        auth.uid() = ANY(cs.participants) OR
        auth.uid() = ANY(cs.admins)
      )
    )
  );

-- سياسات realtime_notifications
CREATE POLICY "Users can view their own notifications" ON realtime_notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON realtime_notifications
  FOR UPDATE USING (user_id = auth.uid());
```

### 3. تفعيل Realtime

```sql
-- إضافة الجداول لـ realtime publication
ALTER publication supabase_realtime ADD TABLE user_presence;
ALTER publication supabase_realtime ADD TABLE activity_events;
ALTER publication supabase_realtime ADD TABLE collaboration_messages;
ALTER publication supabase_realtime ADD TABLE realtime_notifications;

-- تفعيل replica identity
ALTER TABLE user_presence REPLICA IDENTITY FULL;
ALTER TABLE activity_events REPLICA IDENTITY FULL;
ALTER TABLE collaboration_messages REPLICA IDENTITY FULL;
ALTER TABLE realtime_notifications REPLICA IDENTITY FULL;
```

---

## إعداد التطبيق

### 1. تكوين Supabase Client

```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
```

### 2. إعداد CollaborationProvider

```tsx
// src/App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { CollaborationProvider } from '@/components/collaboration';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CollaborationProvider>
          {/* مكونات التطبيق */}
          <Routes>
            {/* المسارات */}
          </Routes>
          
          {/* نظام الإشعارات */}
          <Toaster position="top-right" />
        </CollaborationProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
```

### 3. إعداد الترجمة

```json
// src/locales/ar/collaboration.json
{
  "collaboration": {
    "global_chat": "الدردشة العامة",
    "organization_chat": "دردشة المؤسسة",
    "team_chat": "دردشة الفريق",
    "project_chat": "دردشة المشروع",
    "direct_chat": "دردشة مباشرة",
    "messages": "الرسائل",
    "notifications": "الإشعارات",
    "activities": "الأنشطة",
    "users_online": "متصل",
    "no_messages": "لا توجد رسائل",
    "type_message": "اكتب رسالة...",
    "send_message": "إرسال",
    "mark_all_read": "وضع علامة مقروء للكل",
    "no_notifications": "لا توجد إشعارات",
    "search_users": "البحث عن مستخدمين...",
    "message_edited": "معدّل",
    "time_now": "الآن",
    "time_minutes_ago": "منذ {{count}} دقيقة",
    "time_hours_ago": "منذ {{count}} ساعة",
    "time_days_ago": "منذ {{count}} يوم"
  }
}
```

---

## التكوين المتقدم

### 1. إعداد أنواع المساحات المخصصة

```typescript
// src/types/collaboration.ts
export interface CustomSpaceConfig {
  spaceType: string;
  defaultSettings: {
    allowMentions: boolean;
    allowFileUploads: boolean;
    requireApprovalForNewMembers: boolean;
    maxParticipants?: number;
  };
  permissions: {
    canCreateMessages: (userId: string) => boolean;
    canViewMessages: (userId: string) => boolean;
    canManageSpace: (userId: string) => boolean;
  };
}
```

### 2. تخصيص أنواع الإشعارات

```typescript
// src/config/notifications.ts
export const NOTIFICATION_TYPES = {
  MENTION: 'mention',
  MESSAGE: 'message',
  ACTIVITY: 'activity',
  SYSTEM: 'system',
  COLLABORATION_INVITE: 'collaboration_invite',
  DOCUMENT_SHARED: 'document_shared',
  // إضافة أنواع مخصصة
  CUSTOM_ALERT: 'custom_alert',
  TASK_ASSIGNED: 'task_assigned',
} as const;

export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;
```

### 3. تكوين العلامات والفئات

```typescript
// src/config/collaboration.ts
export const COLLABORATION_CONFIG = {
  MAX_MESSAGE_LENGTH: 2000,
  MAX_PARTICIPANTS_PER_SPACE: 100,
  PRESENCE_UPDATE_INTERVAL: 30000, // 30 seconds
  MESSAGE_HISTORY_LIMIT: 100,
  ACTIVITY_FEED_LIMIT: 50,
  NOTIFICATION_BATCH_SIZE: 20,
};

export const ACTIVITY_TYPES = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  COMMENT: 'comment',
  LIKE: 'like',
  SHARE: 'share',
  JOIN: 'join',
  LEAVE: 'leave',
} as const;
```

---

## إعداد الأذونات المتقدمة

### 1. دالة فحص الوصول للتحديات

```sql
-- دالة فحص الوصول للتحديات
CREATE OR REPLACE FUNCTION user_has_access_to_challenge(challenge_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  challenge_sensitivity text;
  user_role text;
BEGIN
  -- الحصول على مستوى الحساسية للتحدي
  SELECT sensitivity_level INTO challenge_sensitivity
  FROM challenges
  WHERE id = challenge_id;

  -- إذا كان التحدي عادي، يمكن للجميع الوصول
  IF challenge_sensitivity = 'normal' OR challenge_sensitivity IS NULL THEN
    RETURN true;
  END IF;

  -- فحص إذا كان المستخدم له دور مناسب
  IF has_role(auth.uid(), 'admin'::app_role) OR 
     has_role(auth.uid(), 'super_admin'::app_role) THEN
    RETURN true;
  END IF;

  -- فحص إضافي للتحديات الحساسة
  IF challenge_sensitivity = 'confidential' THEN
    -- فقط أعضاء الفريق المصرح لهم
    RETURN EXISTS (
      SELECT 1 FROM innovation_team_members itm
      WHERE itm.user_id = auth.uid() 
      AND itm.status = 'active'
      AND itm.security_clearance >= 'confidential'
    );
  END IF;

  RETURN false;
END;
$$;
```

### 2. إعداد دور team_member

```sql
-- التأكد من وجود دور team_member
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM ('user', 'expert', 'admin', 'super_admin', 'partner', 'team_member');
  ELSE
    -- إضافة team_member إذا لم يكن موجوداً
    BEGIN
      ALTER TYPE app_role ADD VALUE 'team_member';
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END IF;
END
$$;
```

---

## اختبار النظام

### 1. اختبار الاتصال

```typescript
// src/utils/testCollaboration.ts
export const testCollaborationSystem = async () => {
  const tests = [
    {
      name: 'Supabase Connection',
      test: async () => {
        const { data, error } = await supabase.from('user_presence').select('*').limit(1);
        return !error;
      }
    },
    {
      name: 'Realtime Connection',
      test: async () => {
        return new Promise((resolve) => {
          const channel = supabase.channel('test-channel');
          channel.subscribe((status) => {
            resolve(status === 'SUBSCRIBED');
          });
          setTimeout(() => resolve(false), 5000);
        });
      }
    },
    {
      name: 'User Presence',
      test: async () => {
        const { error } = await supabase.from('user_presence').upsert({
          user_id: 'test-user',
          session_id: 'test-session',
          status: 'online'
        });
        return !error;
      }
    }
  ];

  for (const test of tests) {
    try {
      const result = await test.test();
      console.log(`✅ ${test.name}: ${result ? 'PASS' : 'FAIL'}`);
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR`, error);
    }
  }
};
```

### 2. اختبار الأداء

```typescript
// src/utils/performanceTest.ts
export const testCollaborationPerformance = async () => {
  const startTime = performance.now();
  
  // اختبار تحميل البيانات
  const { data: users } = await supabase.from('user_presence').select('*');
  const { data: messages } = await supabase.from('collaboration_messages').select('*').limit(50);
  const { data: activities } = await supabase.from('activity_events').select('*').limit(100);
  
  const endTime = performance.now();
  const loadTime = endTime - startTime;
  
  console.log(`Data load time: ${loadTime}ms`);
  console.log(`Users loaded: ${users?.length || 0}`);
  console.log(`Messages loaded: ${messages?.length || 0}`);
  console.log(`Activities loaded: ${activities?.length || 0}`);
  
  return {
    loadTime,
    usersCount: users?.length || 0,
    messagesCount: messages?.length || 0,
    activitiesCount: activities?.length || 0
  };
};
```

---

## استكشاف الأخطاء

### المشاكل الشائعة

#### 1. مشكلة في الاتصال بـ Realtime
```typescript
// التحقق من حالة الاتصال
const checkRealtimeConnection = () => {
  const channel = supabase.channel('health-check');
  
  channel.subscribe((status) => {
    console.log('Realtime status:', status);
    if (status === 'SUBSCRIBED') {
      console.log('✅ Realtime connected successfully');
    } else if (status === 'CHANNEL_ERROR') {
      console.log('❌ Realtime connection failed');
    }
  });
  
  return channel;
};
```

#### 2. مشاكل الأذونات
```sql
-- فحص الأذونات
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('user_presence', 'collaboration_messages', 'activity_events');
```

#### 3. مشاكل الأداء
```typescript
// مراقبة الأداء
const monitorPerformance = () => {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name.includes('collaboration')) {
        console.log(`${entry.name}: ${entry.duration}ms`);
      }
    }
  });
  
  observer.observe({ entryTypes: ['measure', 'navigation'] });
};
```

---

## الصيانة والمراقبة

### 1. تنظيف البيانات القديمة

```sql
-- تنظيف بيانات الحضور القديمة (أكثر من 24 ساعة)
DELETE FROM user_presence 
WHERE last_seen < NOW() - INTERVAL '24 hours';

-- تنظيف الرسائل القديمة (أكثر من 30 يوم)
DELETE FROM collaboration_messages 
WHERE created_at < NOW() - INTERVAL '30 days'
AND message_type = 'text';

-- تنظيف الأنشطة القديمة (أكثر من 90 يوم)
DELETE FROM activity_events 
WHERE created_at < NOW() - INTERVAL '90 days'
AND privacy_level = 'public';
```

### 2. مراقبة الاستخدام

```sql
-- إحصائيات الاستخدام
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN last_seen > NOW() - INTERVAL '5 minutes' THEN 1 END) as active_users,
  COUNT(CASE WHEN status = 'online' THEN 1 END) as online_users
FROM user_presence;

SELECT 
  DATE(created_at) as date,
  COUNT(*) as messages_count
FROM collaboration_messages 
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### 3. النسخ الاحتياطي

```bash
# نسخ احتياطي للبيانات المهمة
pg_dump --host=db.xxx.supabase.co \
        --username=postgres \
        --dbname=postgres \
        --table=collaboration_messages \
        --table=collaboration_spaces \
        --table=activity_events > collaboration_backup.sql
```

---

## الخطوات التالية

1. **إضافة ميزات متقدمة:**
   - مكالمات الصوت والفيديو
   - مشاركة الشاشة
   - تسجيل الصوت

2. **تحسين الأداء:**
   - تنفيذ التخزين المؤقت
   - تحسين الاستعلامات
   - ضغط البيانات

3. **تطوير التحليلات:**
   - تتبع المشاركة
   - تحليل أنماط الاستخدام
   - تقارير الأداء

4. **تعزيز الأمان:**
   - تشفير الرسائل
   - تدقيق أقوى
   - حماية من البريد العشوائي