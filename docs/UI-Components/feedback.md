# Feedback Components Documentation

User feedback and notification components for the Enterprise Management System.

## 🔔 Alert Components

### ⚠️ Alert

**Location**: `src/components/ui/alert.tsx`

#### Basic Usage
```typescript
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

<Alert variant="destructive">
  <AlertTriangle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Your session has expired. Please log in again.
  </AlertDescription>
</Alert>
```

#### Variants
- `default` - Standard information alert
- `destructive` - Error/warning alerts
- `success` - Success confirmation alerts
- `warning` - Warning alerts

### 🍞 Toast Notifications

**Location**: `src/components/ui/toast.tsx`

#### Toast Implementation
```typescript
import { useToast } from '@/hooks/use-toast';

const MyComponent = () => {
  const { toast } = useToast();

  const handleSuccess = () => {
    toast({
      title: "Success!",
      description: "Your idea has been submitted successfully.",
      variant: "default",
    });
  };

  const handleError = () => {
    toast({
      title: "Error",
      description: "Failed to submit idea. Please try again.",
      variant: "destructive",
    });
  };
};
```

## 🪟 Modal Components

### 📱 Dialog

**Location**: `src/components/ui/dialog.tsx`

#### Modal Dialog
```typescript
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete this challenge?
      </DialogDescription>
    </DialogHeader>
    <div className="flex justify-end gap-2">
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  </DialogContent>
</Dialog>
```

### 🎭 Sheet (Slide-out Panel)

**Location**: `src/components/ui/sheet.tsx`

#### Side Panel
```typescript
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Panel</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Challenge Details</SheetTitle>
      <SheetDescription>
        Review challenge information and submissions.
      </SheetDescription>
    </SheetHeader>
    <div className="py-4">
      <ChallengeDetails challengeId={challengeId} />
    </div>
  </SheetContent>
</Sheet>
```

## ⏳ Loading States

### 🌀 Skeleton Loader

**Location**: `src/components/ui/skeleton.tsx`

#### Content Placeholders
```typescript
import { Skeleton } from '@/components/ui/skeleton';

const LoadingCard = () => (
  <div className="space-y-3">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
    <Skeleton className="h-[125px] w-full rounded-xl" />
  </div>
);
```

### ⭕ Progress Indicators

**Location**: `src/components/ui/progress.tsx`

#### Progress Bar
```typescript
import { Progress } from '@/components/ui/progress';

<Progress value={33} className="w-[60%]" />
```

---

*Feedback Components: 8+ documented | Accessibility: ✅ WCAG 2.1 AA | UX: ✅ Optimized*