# Basic UI Components

Core building blocks of the enterprise management system interface.

## 🔘 Button Component

**Location**: `src/components/ui/button.tsx`

### Usage
```typescript
import { Button } from '@/components/ui/button';

<Button variant="default" size="md">
  Click me
</Button>
```

### Variants
- `default` - Primary brand color
- `destructive` - Red for dangerous actions
- `outline` - Outlined style
- `secondary` - Muted background
- `ghost` - Transparent background
- `link` - Text link style

### Sizes
- `default` - Standard size (h-10)
- `sm` - Small (h-9)
- `lg` - Large (h-11)
- `icon` - Square icon button

### Props
```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

## 🏷️ Badge Component

**Location**: `src/components/ui/badge.tsx`

### Usage
```typescript
import { Badge } from '@/components/ui/badge';

<Badge variant="default">Active</Badge>
<Badge variant="destructive">Critical</Badge>
```

### Specialized Badges
- `PriorityBadge` - For priority levels (high, medium, low)
- `StatusBadge` - For status indicators
- `TypeBadge` - For categorization
- `VisibilityBadge` - For visibility settings

## 📋 Card Component

**Location**: `src/components/ui/card.tsx`

### Usage
```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

### Features
- Consistent spacing and shadows
- Responsive design
- Dark mode support
- Optional header, content, and footer sections

## 🖼️ Avatar Component

**Location**: `src/components/ui/avatar.tsx`

### Usage
```typescript
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

<Avatar>
  <AvatarImage src="/user.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### AvatarUpload Component
**Location**: `src/components/ui/avatar-upload.tsx`

Specialized avatar component with upload functionality:
```typescript
<AvatarUpload
  currentAvatar="/current.jpg"
  onAvatarChange={(file) => handleUpload(file)}
  uploadPath="avatars"
/>
```

## 🎛️ Input Components

### Basic Input
**Location**: `src/components/ui/input.tsx`

```typescript
import { Input } from '@/components/ui/input';

<Input 
  type="text" 
  placeholder="Enter text..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Textarea
**Location**: `src/components/ui/textarea.tsx`

```typescript
import { Textarea } from '@/components/ui/textarea';

<Textarea
  placeholder="Enter description..."
  rows={4}
/>
```

### Label
**Location**: `src/components/ui/label.tsx`

```typescript
import { Label } from '@/components/ui/label';

<Label htmlFor="email">Email Address</Label>
<Input id="email" type="email" />
```

## ✅ Checkbox & Radio

### Checkbox
**Location**: `src/components/ui/checkbox.tsx`

```typescript
import { Checkbox } from '@/components/ui/checkbox';

<Checkbox 
  id="agree"
  checked={agreed}
  onCheckedChange={setAgreed}
/>
```

### Radio Group
**Location**: `src/components/ui/radio-group.tsx`

```typescript
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

<RadioGroup value={selected} onValueChange={setSelected}>
  <RadioGroupItem value="option1" id="option1" />
  <Label htmlFor="option1">Option 1</Label>
</RadioGroup>
```

## 🔽 Select Component

**Location**: `src/components/ui/select.tsx`

```typescript
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

## 🔗 Link Components

### Safe Navigation Link
**Location**: `src/components/ui/SafeNavigationLink.tsx`

Protected navigation with error boundaries:
```typescript
import SafeNavigationLink from '@/components/ui/SafeNavigationLink';

<SafeNavigationLink 
  to="/dashboard"
  className="nav-link"
  fallback="Dashboard"
>
  Go to Dashboard
</SafeNavigationLink>
```

## 📏 Separator

**Location**: `src/components/ui/separator.tsx`

```typescript
import { Separator } from '@/components/ui/separator';

<Separator orientation="horizontal" />
<Separator orientation="vertical" />
```

## 🔄 Switch

**Location**: `src/components/ui/switch.tsx`

```typescript
import { Switch } from '@/components/ui/switch';

<Switch 
  checked={enabled}
  onCheckedChange={setEnabled}
/>
```

## 📊 Progress

**Location**: `src/components/ui/progress.tsx`

```typescript
import { Progress } from '@/components/ui/progress';

<Progress value={75} className="w-full" />
```

## 🎨 Design System Integration

All basic components use:
- **Semantic color tokens** from CSS variables
- **Consistent spacing** (padding, margins)
- **Typography scale** for text sizes
- **Border radius** system
- **Shadow system** for depth
- **Transition** animations

## ♿ Accessibility Features

- **Keyboard navigation** support
- **Screen reader** friendly
- **Focus management** 
- **ARIA attributes** where needed
- **High contrast** mode support
- **Reduced motion** respect

---

*Components: 15+ basic components documented*
*Status: ✅ Production ready*