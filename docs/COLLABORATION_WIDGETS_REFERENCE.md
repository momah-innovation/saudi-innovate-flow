# مرجع ويدجت التعاون المباشر (Collaboration Widgets Reference)

## نظرة عامة

هذا المرجع يوضح جميع ويدجت نظام التعاون المباشر مع خصائصها وطرق استخدامها والأمثلة العملية.

---

## CollaborationWidget

### الوصف
الويدجت الرئيسي العائم الذي يجمع جميع ميزات التعاون في واجهة واحدة.

### الخصائص (Props)

| الخاصية | النوع | مطلوب | القيمة الافتراضية | الوصف |
|---------|------|-------|-------------------|-------|
| `contextType` | `'global' \| 'organization' \| 'team' \| 'project' \| 'direct'` | لا | `'global'` | نوع سياق التعاون |
| `contextId` | `string` | لا | `'global'` | معرف السياق |
| `entityType` | `string` | لا | - | نوع الكيان المرتبط |
| `entityId` | `string` | لا | - | معرف الكيان |
| `position` | `'bottom-left' \| 'bottom-right' \| 'top-right'` | لا | `'bottom-right'` | موضع الويدجت |

### مثال على الاستخدام

```tsx
import { CollaborationWidget } from '@/components/collaboration';

// استخدام أساسي
<CollaborationWidget />

// استخدام متقدم
<CollaborationWidget
  contextType="team"
  contextId="team-innovation"
  entityType="project"
  entityId="ai-chatbot"
  position="bottom-left"
/>
```

### الميزات
- تبديل لوحات مختلفة (رسائل، إشعارات، أنشطة)
- عرض عدد المستخدمين المتصلين
- إمكانية التصغير والتكبير
- بدء/إيقاف التعاون

---

## MessagingPanel

### الوصف
لوحة الدردشة المباشرة مع دعم الإشارات والتفاعلات.

### الخصائص (Props)

| الخاصية | النوع | مطلوب | القيمة الافتراضية | الوصف |
|---------|------|-------|-------------------|-------|
| `contextType` | `'global' \| 'organization' \| 'team' \| 'project' \| 'direct'` | لا | `'global'` | نوع سياق الدردشة |
| `contextId` | `string` | لا | `'global'` | معرف السياق |
| `isOpen` | `boolean` | لا | `true` | حالة فتح اللوحة |
| `onClose` | `() => void` | لا | - | دالة الإغلاق |

### مثال على الاستخدام

```tsx
import { MessagingPanel } from '@/components/collaboration';

const [showChat, setShowChat] = useState(false);

<MessagingPanel
  contextType="team"
  contextId="development-team"
  isOpen={showChat}
  onClose={() => setShowChat(false)}
/>
```

### الميزات
- إرسال واستقبال الرسائل المباشرة
- إشارة المستخدمين (@username)
- عرض حالة القراءة والتحرير
- ردود الفعل والتفاعلات
- تاريخ الرسائل مع التمرير

---

## NotificationCenter

### الوصف
مركز الإشعارات مع التصفية والأولويات.

### الخصائص (Props)

| الخاصية | النوع | مطلوب | القيمة الافتراضية | الوصف |
|---------|------|-------|-------------------|-------|
| `isOpen` | `boolean` | لا | `false` | حالة فتح المركز |
| `onClose` | `() => void` | لا | - | دالة الإغلاق |

### مثال على الاستخدام

```tsx
import { NotificationCenter } from '@/components/collaboration';

const [showNotifications, setShowNotifications] = useState(false);

<NotificationCenter
  isOpen={showNotifications}
  onClose={() => setShowNotifications(false)}
/>
```

### الميزات
- تصفية الإشعارات (الكل، غير مقروءة، مقروءة)
- أولويات مختلفة (منخفضة، متوسطة، عالية، عاجلة)
- وضع علامة مقروء للكل أو فردياً
- روابط العمل للإشعارات
- عرض الوقت النسبي

---

## ActivityFeed

### الوصف
تدفق الأنشطة المباشرة مع إمكانيات التصفية.

### الخصائص (Props)

| الخاصية | النوع | مطلوب | القيمة الافتراضية | الوصف |
|---------|------|-------|-------------------|-------|
| `scope` | `'all' \| 'organization' \| 'team'` | لا | `'all'` | نطاق الأنشطة |
| `teamId` | `string` | لا | - | معرف الفريق للتصفية |
| `limit` | `number` | لا | `10` | عدد الأنشطة المعروضة |
| `showFilters` | `boolean` | لا | `true` | إظهار أزرار التصفية |

### مثال على الاستخدام

```tsx
import { ActivityFeed } from '@/components/collaboration';

// عرض أساسي
<ActivityFeed />

// عرض متقدم
<ActivityFeed
  scope="team"
  teamId="innovation-team"
  limit={20}
  showFilters={true}
/>
```

### الميزات
- تصفية حسب نوع الكيان
- تصفية حسب نوع الحدث
- عرض المستخدم والوقت
- أيقونات للأنشطة المختلفة
- تحديث مباشر للأنشطة الجديدة

---

## UserPresence

### الوصف
عرض المستخدمين المتصلين مع حالتهم ومعلوماتهم.

### الخصائص (Props)

| الخاصية | النوع | مطلوب | القيمة الافتراضية | الوصف |
|---------|------|-------|-------------------|-------|
| `users` | `UserPresence[]` | نعم | - | قائمة المستخدمين |
| `maxVisible` | `number` | لا | `5` | العدد الأقصى للعرض |
| `showStatus` | `boolean` | لا | `false` | إظهار حالة المستخدم |
| `showLocation` | `boolean` | لا | `false` | إظهار موقع المستخدم |
| `size` | `'sm' \| 'md' \| 'lg'` | لا | `'md'` | حجم الصور الرمزية |

### مثال على الاستخدام

```tsx
import { UserPresence } from '@/components/collaboration';
import { useCollaboration } from '@/components/collaboration';

function MyComponent() {
  const { onlineUsers } = useCollaboration();

  return (
    <UserPresence
      users={onlineUsers}
      maxVisible={8}
      showStatus={true}
      showLocation={true}
      size="lg"
    />
  );
}
```

### الميزات
- عرض الصور الرمزية للمستخدمين
- مؤشرات الحالة (متصل، مشغول، غائب)
- عرض الموقع الحالي
- تفاصيل عند التمرير
- عداد للمستخدمين الإضافيين

---

## LiveDocumentEditor

### الوصف
محرر المستندات التعاوني المباشر.

### الخصائص (Props)

| الخاصية | النوع | مطلوب | القيمة الافتراضية | الوصف |
|---------|------|-------|-------------------|-------|
| `documentId` | `string` | لا | - | معرف المستند |
| `documentType` | `'idea' \| 'challenge_submission' \| 'project_plan' \| 'proposal' \| 'notes'` | نعم | - | نوع المستند |
| `entityId` | `string` | لا | - | معرف الكيان المرتبط |
| `title` | `string` | لا | - | عنوان المستند |
| `content` | `any` | لا | - | محتوى المستند |
| `readOnly` | `boolean` | لا | `false` | وضع القراءة فقط |
| `onSave` | `(title: string, content: any) => void` | لا | - | دالة الحفظ |

### مثال على الاستخدام

```tsx
import { LiveDocumentEditor } from '@/components/collaboration';

const [documentContent, setDocumentContent] = useState('');

<LiveDocumentEditor
  documentId="doc-123"
  documentType="idea"
  entityId="idea-456"
  title="فكرة مبتكرة جديدة"
  content={documentContent}
  onSave={(title, content) => {
    setDocumentContent(content);
    // حفظ في قاعدة البيانات
  }}
/>
```

### الميزات
- تحرير تعاوني مباشر
- عرض المحررين النشطين
- حفظ تلقائي
- إدارة التضارب
- تاريخ التغييرات

---

## UserMentionSelector

### الوصف
منتقي المستخدمين للإشارات في الرسائل.

### الخصائص (Props)

| الخاصية | النوع | مطلوب | القيمة الافتراضية | الوصف |
|---------|------|-------|-------------------|-------|
| `onUserSelect` | `(user: UserProfile) => void` | نعم | - | دالة اختيار المستخدم |
| `contextType` | `string` | لا | `'global'` | سياق البحث |
| `contextId` | `string` | لا | - | معرف السياق |
| `placeholder` | `string` | لا | `'البحث عن مستخدم...'` | نص المساعد |
| `showSuggestions` | `boolean` | لا | `true` | إظهار الاقتراحات |

### مثال على الاستخدام

```tsx
import { UserMentionSelector } from '@/components/collaboration';

<UserMentionSelector
  onUserSelect={(user) => {
    handleMentionUser(user);
  }}
  contextType="team"
  contextId="development-team"
  placeholder="اختر مستخدم للإشارة..."
  showSuggestions={true}
/>
```

### الميزات
- البحث المباشر عن المستخدمين
- اقتراحات ذكية
- عرض المستخدمين المتصلين
- تصفية حسب السياق

---

## WorkspaceCollaboration

### الوصف
مكون شامل للتعاون في مساحات العمل المختلفة.

### الخصائص (Props)

| الخاصية | النوع | مطلوب | القيمة الافتراضية | الوصف |
|---------|------|-------|-------------------|-------|
| `workspaceType` | `'user' \| 'expert' \| 'organization' \| 'partner' \| 'admin' \| 'team'` | نعم | - | نوع مساحة العمل |
| `entityId` | `string` | لا | - | معرف الكيان |
| `showWidget` | `boolean` | لا | `true` | إظهار الويدجت |
| `showPresence` | `boolean` | لا | `true` | إظهار الحضور |
| `showActivity` | `boolean` | لا | `false` | إظهار الأنشطة |

### مثال على الاستخدام

```tsx
import { WorkspaceCollaboration } from '@/components/collaboration';

<WorkspaceCollaboration
  workspaceType="team"
  entityId="innovation-team"
  showWidget={true}
  showPresence={true}
  showActivity={true}
/>
```

### الميزات
- تكوين تلقائي للسياق
- دعم مساحات عمل متعددة
- تحكم في العناصر المعروضة
- تكامل مع نظام الأذونات

---

## أمثلة التكامل

### تكامل مع صفحة المشروع

```tsx
import React from 'react';
import { CollaborationProvider, WorkspaceCollaboration } from '@/components/collaboration';

export const ProjectDetailPage = ({ projectId }) => {
  return (
    <CollaborationProvider>
      <div className="container mx-auto p-6">
        {/* محتوى المشروع */}
        <div className="project-details">
          {/* تفاصيل المشروع */}
        </div>

        {/* ويدجت التعاون */}
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

### تكامل مع نظام الدردشة المخصص

```tsx
import React, { useState } from 'react';
import { MessagingPanel, UserPresence, useCollaboration } from '@/components/collaboration';

export const CustomChatInterface = () => {
  const [activeChat, setActiveChat] = useState('general');
  const { onlineUsers } = useCollaboration();

  return (
    <div className="chat-interface">
      {/* قائمة جانبية للمحادثات */}
      <div className="sidebar">
        <UserPresence
          users={onlineUsers}
          maxVisible={10}
          showStatus={true}
        />
      </div>

      {/* منطقة الدردشة الرئيسية */}
      <div className="main-chat">
        <MessagingPanel
          contextType="team"
          contextId={activeChat}
          isOpen={true}
        />
      </div>
    </div>
  );
};
```

## نصائح الاستخدام

### الأداء
1. استخدم `limit` في `ActivityFeed` لتحسين الأداء
2. أغلق الويدجت غير المستخدمة
3. استخدم التصفية لتقليل البيانات

### تجربة المستخدم
1. استخدم مواضع مناسبة للويدجت
2. اجعل الإشعارات واضحة ومفيدة
3. وفر ردود فعل فورية للتفاعلات

### التخصيص
1. استخدم CSS variables للألوان
2. خصص الأيقونات حسب السياق
3. اجعل الرسائل قابلة للترجمة