# دليل استكشاف أخطاء نظام التعاون المباشر

## المشاكل الشائعة والحلول

### 1. مشاكل الاتصال

#### المشكلة: عدم الاتصال بـ Realtime
**الأعراض:**
- عدم تحديث البيانات في الوقت الفعلي
- عدم ظهور المستخدمين المتصلين
- عدم وصول الرسائل

**التشخيص:**
```typescript
// فحص حالة الاتصال
const { isConnected, connectionQuality } = useCollaboration();
console.log('Connected:', isConnected);
console.log('Quality:', connectionQuality);
```

**الحلول:**
1. تحقق من إعدادات Supabase:
```typescript
// التأكد من تفعيل Realtime في مشروع Supabase
const supabase = createClient(url, key, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
```

2. فحص الشبكة:
```typescript
// فحص الاتصال بالإنترنت
if (!navigator.onLine) {
  console.log('لا يوجد اتصال بالإنترنت');
}
```

3. إعادة تهيئة الاتصال:
```typescript
// في useRealTimeCollaboration.ts
const reconnect = () => {
  // إغلاق الاتصالات الحالية
  channels.forEach(channel => supabase.removeChannel(channel));
  
  // إعادة تهيئة الاتصالات
  setupPresenceChannel();
  setupActivityChannel();
  setupMessagingChannel();
};
```

---

### 2. مشاكل الأذونات

#### المشكلة: عدم القدرة على إرسال الرسائل
**الأعراض:**
- ظهور خطأ "غير مصرح" عند إرسال الرسائل
- عدم ظهور أزرار الإرسال

**التشخيص:**
```sql
-- فحص سياسات RLS
SELECT * FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'collaboration_messages';
```

**الحلول:**
1. التحقق من المصادقة:
```typescript
const { user } = useAuth();
if (!user) {
  console.log('المستخدم غير مصادق عليه');
  return;
}
```

2. فحص عضوية المساحة:
```typescript
const checkSpaceAccess = async (spaceId: string) => {
  const { data, error } = await supabase
    .from('collaboration_spaces')
    .select('*')
    .eq('id', spaceId)
    .single();
    
  if (error) {
    console.log('خطأ في الوصول للمساحة:', error);
    return false;
  }
  
  const userId = user?.id;
  return data.privacy_level === 'public' ||
         data.created_by === userId ||
         data.participants?.includes(userId) ||
         data.admins?.includes(userId);
};
```

---

### 3. مشاكل الأداء

#### المشكلة: بطء في التحديثات
**الأعراض:**
- تأخير في ظهور الرسائل
- بطء في تحديث حالة الحضور

**التشخيص:**
```typescript
// قياس أداء الشبكة
const measureNetworkPerformance = async () => {
  const start = performance.now();
  
  try {
    const { data } = await supabase
      .from('user_presence')
      .select('*')
      .limit(1);
    
    const end = performance.now();
    console.log(`وقت الاستعلام: ${end - start}ms`);
    
    return end - start;
  } catch (error) {
    console.log('خطأ في الشبكة:', error);
    return -1;
  }
};
```

**الحلول:**
1. تحسين الاستعلامات:
```typescript
// استخدام الفهارس المناسبة
const { data } = await supabase
  .from('collaboration_messages')
  .select('*, sender:sender_id(display_name, avatar_url)')
  .eq('space_id', spaceId)
  .order('created_at', { ascending: false })
  .limit(50); // تحديد عدد الرسائل
```

2. استخدام التخزين المؤقت:
```typescript
// تخزين مؤقت للبيانات
const useMessagesCache = (spaceId: string) => {
  const [cachedMessages, setCachedMessages] = useState<Message[]>([]);
  
  useEffect(() => {
    const cached = localStorage.getItem(`messages_${spaceId}`);
    if (cached) {
      setCachedMessages(JSON.parse(cached));
    }
  }, [spaceId]);
  
  return cachedMessages;
};
```

---

### 4. مشاكل واجهة المستخدم

#### المشكلة: عدم ظهور الويدجت
**الأعراض:**
- الويدجت غير مرئي
- لا يظهر في الموضع المحدد

**التشخيص:**
```typescript
// فحص حالة الويدجت
const { isConnected } = useCollaboration();
console.log('Widget should be visible:', isConnected);
```

**الحلول:**
1. التحقق من CSS:
```css
/* التأكد من z-index */
.collaboration-widget {
  position: fixed;
  z-index: 9999;
  pointer-events: auto;
}
```

2. فحص الشروط:
```tsx
// التأكد من الشروط
if (!isConnected) {
  return null; // الويدجت لن يظهر
}
```

---

### 5. مشاكل البيانات

#### المشكلة: عدم تحديث بيانات الحضور
**الأعراض:**
- عدم ظهور المستخدمين الجدد
- عدم إزالة المستخدمين المنقطعين

**التشخيص:**
```sql
-- فحص بيانات الحضور
SELECT 
  user_id,
  status,
  last_seen,
  NOW() - last_seen as offline_duration
FROM user_presence
WHERE last_seen > NOW() - INTERVAL '1 hour'
ORDER BY last_seen DESC;
```

**الحلول:**
1. تنظيف البيانات القديمة:
```typescript
const cleanupStalePresence = async () => {
  const { error } = await supabase
    .from('user_presence')
    .delete()
    .lt('last_seen', new Date(Date.now() - 5 * 60 * 1000)); // 5 دقائق
    
  if (error) {
    console.log('خطأ في تنظيف البيانات:', error);
  }
};
```

2. تحديث دوري للحضور:
```typescript
// في useRealTimeCollaboration.ts
useEffect(() => {
  const interval = setInterval(async () => {
    await updatePresence({
      page: window.location.pathname,
      last_seen: new Date().toISOString()
    });
  }, 30000); // كل 30 ثانية

  return () => clearInterval(interval);
}, []);
```

---

### 6. مشاكل الإشعارات

#### المشكلة: عدم ظهور الإشعارات
**الأعراض:**
- لا تظهر إشعارات الرسائل الجديدة
- عدم تحديث عداد الإشعارات

**التشخيص:**
```typescript
// فحص إعدادات المتصفح
if ('Notification' in window) {
  console.log('Notification permission:', Notification.permission);
} else {
  console.log('المتصفح لا يدعم الإشعارات');
}
```

**الحلول:**
1. طلب إذن الإشعارات:
```typescript
const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    console.log('إذن الإشعارات:', permission);
    return permission === 'granted';
  }
  return Notification.permission === 'granted';
};
```

2. فحص فلاتر الإشعارات:
```typescript
// التأكد من عدم تصفية الإشعارات
const shouldShowNotification = (notification: RealtimeNotification) => {
  // فحص الأولوية
  if (notification.priority === 'low') {
    return false; // لا تظهر الإشعارات منخفضة الأولوية
  }
  
  // فحص التكرار
  if (recentNotifications.includes(notification.id)) {
    return false;
  }
  
  return true;
};
```

---

## أدوات التشخيص

### 1. مكون فحص الحالة

```tsx
import React from 'react';
import { useCollaboration } from '@/components/collaboration';

export const CollaborationHealthCheck = () => {
  const { 
    isConnected, 
    connectionQuality, 
    onlineUsers, 
    messages, 
    notifications 
  } = useCollaboration();

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-bold mb-2">فحص حالة النظام</h3>
      
      <div className="space-y-2">
        <div className={`flex items-center gap-2 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          <span>🔌</span>
          <span>الاتصال: {isConnected ? 'متصل' : 'منقطع'}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span>📊</span>
          <span>جودة الاتصال: {connectionQuality}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span>👥</span>
          <span>المستخدمون المتصلون: {onlineUsers.length}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span>💬</span>
          <span>الرسائل: {messages.length}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span>🔔</span>
          <span>الإشعارات: {notifications.length}</span>
        </div>
      </div>
    </div>
  );
};
```

### 2. سجل الأحداث

```typescript
class CollaborationLogger {
  private static logs: Array<{
    timestamp: string;
    level: 'info' | 'warn' | 'error';
    message: string;
    data?: any;
  }> = [];

  static log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };
    
    this.logs.push(logEntry);
    console.log(`[Collaboration ${level.toUpperCase()}]`, message, data);
    
    // الاحتفاظ بآخر 100 سجل فقط
    if (this.logs.length > 100) {
      this.logs.splice(0, 50);
    }
  }

  static getLogs() {
    return this.logs;
  }

  static exportLogs() {
    const logsText = this.logs
      .map(log => `${log.timestamp} [${log.level.toUpperCase()}] ${log.message}`)
      .join('\n');
    
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `collaboration-logs-${new Date().getTime()}.txt`;
    a.click();
    
    URL.revokeObjectURL(url);
  }
}

// الاستخدام
CollaborationLogger.log('info', 'تم تهيئة النظام بنجاح');
CollaborationLogger.log('error', 'فشل في الاتصال', { error: 'Connection timeout' });
```

---

## سكريبت الصيانة

### تنظيف البيانات القديمة

```sql
-- سكريبت تنظيف شامل
DO $$
DECLARE
  deleted_presence INT;
  deleted_messages INT;
  deleted_activities INT;
BEGIN
  -- تنظيف بيانات الحضور القديمة
  DELETE FROM user_presence 
  WHERE last_seen < NOW() - INTERVAL '24 hours';
  GET DIAGNOSTICS deleted_presence = ROW_COUNT;
  
  -- تنظيف الرسائل القديمة
  DELETE FROM collaboration_messages 
  WHERE created_at < NOW() - INTERVAL '30 days'
  AND message_type = 'text';
  GET DIAGNOSTICS deleted_messages = ROW_COUNT;
  
  -- تنظيف الأنشطة القديمة
  DELETE FROM activity_events 
  WHERE created_at < NOW() - INTERVAL '90 days'
  AND privacy_level = 'public';
  GET DIAGNOSTICS deleted_activities = ROW_COUNT;
  
  -- سجل النتائج
  RAISE NOTICE 'تم حذف % من بيانات الحضور', deleted_presence;
  RAISE NOTICE 'تم حذف % من الرسائل', deleted_messages;
  RAISE NOTICE 'تم حذف % من الأنشطة', deleted_activities;
END
$$;
```

---

## الحصول على المساعدة

### 1. جمع معلومات التشخيص
```typescript
const collectDiagnosticInfo = () => {
  const info = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    collaboration: {
      isConnected: useCollaboration().isConnected,
      connectionQuality: useCollaboration().connectionQuality,
      onlineUsersCount: useCollaboration().onlineUsers.length,
      messagesCount: useCollaboration().messages.length,
    },
    browser: {
      cookiesEnabled: navigator.cookieEnabled,
      language: navigator.language,
      platform: navigator.platform,
    },
    errors: CollaborationLogger.getLogs().filter(log => log.level === 'error'),
  };
  
  console.log('معلومات التشخيص:', info);
  return info;
};
```

### 2. الإبلاغ عن المشاكل
عند الإبلاغ عن مشكلة، يرجى تضمين:
- وصف تفصيلي للمشكلة
- خطوات إعادة الإنتاج
- معلومات التشخيص
- لقطات شاشة إن أمكن
- سجلات وحدة التحكم

### 3. موارد إضافية
- [وثائق Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [مجتمع Supabase Discord](https://discord.supabase.com/)
- [GitHub Issues للمشروع](https://github.com/your-repo/issues)