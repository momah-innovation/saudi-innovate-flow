# دليل نظام التعاون المباشر (Real-Time Collaboration System)

## نظرة عامة

نظام التعاون المباشر في منصة رواد يوفر إمكانيات تفاعلية متقدمة تمكن المستخدمين من التواصل والتعاون في الوقت الفعلي. يشمل النظام الدردشة المباشرة، وتتبع الحضور، وتدفق الأنشطة، والإشعارات، وتحرير المستندات التعاوني.

## المكونات الرئيسية

### 1. CollaborationProvider
مزود السياق الرئيسي للنظام، يجب أن يلف التطبيق بأكمله.

```tsx
import { CollaborationProvider } from '@/components/collaboration';

function App() {
  return (
    <CollaborationProvider>
      {/* محتوى التطبيق */}
    </CollaborationProvider>
  );
}
```

### 2. CollaborationWidget
الويدجت الرئيسي العائم الذي يجمع جميع ميزات التعاون.

```tsx
import { CollaborationWidget } from '@/components/collaboration';

<CollaborationWidget
  contextType="team"
  contextId="team-123"
  entityType="project"
  entityId="project-456"
  position="bottom-right"
/>
```

### 3. MessagingPanel
لوحة الدردشة المباشرة مع إمكانية الإشارة للمستخدمين.

```tsx
import { MessagingPanel } from '@/components/collaboration';

<MessagingPanel
  contextType="global"
  contextId="global"
  isOpen={true}
  onClose={() => setShowMessages(false)}
/>
```

### 4. NotificationCenter
مركز الإشعارات مع التصفية والأولويات.

```tsx
import { NotificationCenter } from '@/components/collaboration';

<NotificationCenter
  isOpen={showNotifications}
  onClose={() => setShowNotifications(false)}
/>
```

### 5. ActivityFeed
تدفق الأنشطة المباشرة مع التصفية.

```tsx
import { ActivityFeed } from '@/components/collaboration';

<ActivityFeed
  scope="organization"
  teamId="team-123"
  limit={20}
  showFilters={true}
/>
```

### 6. UserPresence
عرض المستخدمين المتصلين مع حالتهم.

```tsx
import { UserPresence } from '@/components/collaboration';

<UserPresence
  users={onlineUsers}
  maxVisible={8}
  showStatus={true}
  showLocation={true}
/>
```

### 7. LiveDocumentEditor
محرر المستندات التعاوني.

```tsx
import { LiveDocumentEditor } from '@/components/collaboration';

<LiveDocumentEditor
  documentId="doc-123"
  documentType="idea"
  entityId="idea-456"
  title="العنوان الأولي"
  content={documentContent}
  onSave={(title, content) => handleSave(title, content)}
/>
```

## الهوك الرئيسي

### useCollaboration
الهوك الأساسي للوصول لحالة التعاون.

```tsx
import { useCollaboration } from '@/components/collaboration';

function MyComponent() {
  const {
    onlineUsers,
    messages,
    notifications,
    activities,
    isConnected,
    sendMessage,
    markAsRead,
    updatePresence
  } = useCollaboration();

  // استخدام البيانات والوظائف
}
```

## أنواع السياقات المدعومة

### contextType
- `global`: سياق عام لجميع المستخدمين
- `organization`: سياق على مستوى المؤسسة
- `team`: سياق على مستوى الفريق
- `project`: سياق على مستوى المشروع
- `direct`: محادثة مباشرة

### Workspace Types
- `user`: مساحة عمل المستخدم العادي
- `expert`: مساحة عمل الخبراء
- `organization`: مساحة عمل المؤسسة
- `partner`: مساحة عمل الشركاء
- `admin`: مساحة عمل الإداريين
- `team`: مساحة عمل الفريق

## الميزات المتقدمة

### 1. إشارة المستخدمين (User Mentions)
```tsx
// في النص: @اسم_المستخدم
// سيتم إرسال إشعار تلقائياً للمستخدم المشار إليه
```

### 2. أولويات الإشعارات
- `low`: أولوية منخفضة
- `medium`: أولوية متوسطة (افتراضي)
- `high`: أولوية عالية
- `urgent`: عاجل

### 3. مستويات الخصوصية
- `public`: عام لجميع المستخدمين
- `organization`: مقتصر على المؤسسة
- `team`: مقتصر على الفريق
- `private`: خاص

### 4. أنواع الأنشطة
- `create`: إنشاء محتوى جديد
- `update`: تحديث محتوى موجود
- `delete`: حذف محتوى
- `comment`: إضافة تعليق
- `like`: إعجاب
- `share`: مشاركة
- `join`: انضمام
- `leave`: مغادرة

## التكامل مع أنظمة أخرى

### التكامل مع العلامات (Tags)
```tsx
import { TagSelector } from '@/components/collaboration';

// استخدام منتقي العلامات داخل الرسائل
```

### التكامل مع الأذونات
النظام يتكامل مع نظام الأذونات لضمان الوصول الآمن:

```tsx
// يتم فحص الأذونات تلقائياً
const hasAccess = await checkPermissions(userId, contextType, contextId);
```

## أمثلة عملية

### إعداد التعاون في صفحة مشروع
```tsx
import React from 'react';
import { CollaborationProvider, WorkspaceCollaboration } from '@/components/collaboration';

export const ProjectPage = ({ projectId }) => {
  return (
    <CollaborationProvider>
      <div className="project-page">
        {/* محتوى الصفحة */}
        
        <WorkspaceCollaboration
          workspaceType="team"
          entityId={projectId}
          showWidget={true}
          showPresence={true}
          showActivity={true}
        />
      </div>
    </CollaborationProvider>
  );
};
```

### إعداد دردشة مخصصة
```tsx
import React, { useState } from 'react';
import { MessagingPanel, UserPresence } from '@/components/collaboration';

export const CustomChat = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChat(true)}>
        فتح الدردشة
      </button>
      
      {showChat && (
        <MessagingPanel
          contextType="team"
          contextId="my-team"
          isOpen={showChat}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};
```

## استكشاف الأخطاء

### مشاكل الاتصال
1. تأكد من تشغيل Supabase Realtime
2. تحقق من أذونات المستخدم
3. تأكد من صحة السياق المحدد

### عدم ظهور الرسائل
1. تحقق من `contextType` و `contextId`
2. تأكد من أذونات الوصول للمساحة
3. تحقق من حالة الاتصال

### مشاكل الإشعارات
1. تأكد من تفعيل الإشعارات في المتصفح
2. تحقق من إعدادات الإشعارات في الملف الشخصي
3. تأكد من صحة أولوية الإشعار

## التخصيص

### تخصيص الألوان والأيقونات
```tsx
// في index.css
:root {
  --collaboration-primary: hsl(220, 70%, 50%);
  --collaboration-secondary: hsl(220, 30%, 90%);
}
```

### تخصيص الرسائل
```tsx
// إضافة مكونات مخصصة للرسائل
const CustomMessageComponent = ({ message }) => {
  return (
    <div className="custom-message">
      {/* تخصيص عرض الرسالة */}
    </div>
  );
};
```

## الأداء والتحسين

### نصائح للأداء
1. استخدم `limit` في `ActivityFeed` لتحديد عدد الأنشطة
2. أغلق الاتصالات غير المستخدمة
3. استخدم التصفية لتقليل البيانات المحملة

### مراقبة الاستخدام
```tsx
// يمكن مراقبة الاستخدام من خلال
const { connectionQuality, isConnected } = useCollaboration();
```

## الأمان

### حماية البيانات
- جميع الرسائل محمية بـ RLS (Row Level Security)
- التحقق من الأذونات على مستوى قاعدة البيانات
- تشفير البيانات الحساسة

### أفضل الممارسات
1. لا تخزن معلومات حساسة في metadata
2. استخدم مستويات الخصوصية المناسبة
3. راجع أذونات المستخدمين بانتظام

## الدعم والصيانة

للحصول على المساعدة:
1. راجع هذا الدليل أولاً
2. تحقق من السجلات في وحدة التحكم
3. راجع وثائق Supabase Realtime
4. اتصل بفريق التطوير للمساعدة التقنية