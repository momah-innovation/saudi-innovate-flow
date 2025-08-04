# Paddle Subscription System Documentation

## 📋 **OVERVIEW**

The Paddle Subscription System provides comprehensive billing and subscription management for the Ruwād Innovation Platform. It includes Paddle checkout integration, subscription status tracking, and customer portal management.

---

## 🏗️ **SYSTEM ARCHITECTURE**

### **Backend Components**
- **Edge Functions**: Secure server-side payment processing
- **Database Integration**: Subscription tracking in Supabase
- **API Integration**: Direct Paddle API communication

### **Frontend Components**
- **React Hooks**: Subscription state management
- **UI Components**: Payment interfaces and status displays
- **Page Components**: Complete subscription management pages

---

## 🔧 **TECHNICAL IMPLEMENTATION**

### **1. Edge Functions**

#### **`create-paddle-checkout`**
- **Location**: `supabase/functions/create-paddle-checkout/index.ts`
- **Purpose**: Creates Paddle checkout sessions for subscription purchases
- **Authentication**: Required (JWT verification enabled)
- **Key Features**:
  - Plan-based checkout creation
  - Customer management
  - Secure Paddle API integration
  - CORS support for web applications

```typescript
// Usage Example
const { data, error } = await supabase.functions.invoke('create-paddle-checkout', {
  body: { planId: 'professional' }
});
```

#### **`check-paddle-subscription`**
- **Location**: `supabase/functions/check-paddle-subscription/index.ts`
- **Purpose**: Verifies and updates subscription status from Paddle
- **Authentication**: Required (JWT verification enabled)
- **Key Features**:
  - Real-time subscription verification
  - Automatic status updates
  - Subscription tier detection
  - Customer data synchronization

```typescript
// Usage Example
const { data, error } = await supabase.functions.invoke('check-paddle-subscription');
```

### **2. React Hooks**

#### **`useSubscription`**
- **Location**: `src/hooks/useSubscription.ts`
- **Purpose**: Centralized subscription state management
- **Key Features**:
  - Subscription status tracking
  - Plan management
  - Checkout session creation
  - Loading states and error handling

```typescript
interface SubscriptionStatus {
  hasSubscription: boolean;
  planNameAr: string;
  planNameEn: string;
  status: string;
  currentPeriodEnd?: string;
  features: SubscriptionFeatures;
}

interface UseSubscriptionResult {
  subscriptionStatus: SubscriptionStatus | null;
  loading: boolean;
  error: string | null;
  checkSubscription: () => Promise<void>;
  subscriptionPlans: SubscriptionPlan[];
  createCheckoutSession: (planId: string) => Promise<string | null>;
  cancelSubscription: () => Promise<boolean>;
  refreshSubscription: () => Promise<void>;
}
```

### **3. UI Components**

#### **Subscription Page**
- **Location**: `src/pages/PaddleSubscriptionPage.tsx`
- **Route**: `/paddle-subscription`
- **Access**: Authenticated users only
- **Features**:
  - Current subscription status display
  - Multiple pricing plans with Arabic/English support
  - Feature comparison table
  - Paddle checkout integration
  - Responsive design with Tailwind CSS

#### **Key Features**:
- **Multi-language Support**: Arabic and English labels
- **Subscription Status**: Real-time status updates
- **Plan Comparison**: Detailed feature matrices
- **Payment Integration**: Seamless Paddle checkout
- **Customer Management**: Basic portal access (placeholder)

---

## 📊 **SUBSCRIPTION PLANS**

### **Available Plans**

| Plan | Price (SAR) | Features |
|------|-------------|----------|
| **Basic** | 49/month | 10 ideas/month, Public challenges, Community support, Basic analytics |
| **Professional** | 199/month | Unlimited ideas, Exclusive challenges, AI assistance, Advanced analytics, Priority support |
| **Enterprise** | 999/month | Custom solutions, White-label branding, Advanced security, Custom support, API integration |

### **Feature Matrix**

| Feature | Basic | Professional | Enterprise |
|---------|-------|--------------|------------|
| Ideas per month | 10 | Unlimited | Unlimited |
| AI assistance | ❌ | ✅ | ✅ |
| Advanced analytics | ❌ | ✅ | ✅ |
| Custom support | ❌ | ✅ | ✅ |
| White-label branding | ❌ | ❌ | ✅ |

---

## 🔐 **SECURITY & CONFIGURATION**

### **Environment Variables**
Required secrets in Supabase Edge Functions:
- `PADDLE_API_KEY`: Paddle API key for secure API communication
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for database operations

### **Database Security**
- **RLS Policies**: Row-level security for subscription data
- **Service Role Usage**: Edge functions use service role for secure operations
- **Data Validation**: Input validation and sanitization

### **API Security**
- **JWT Authentication**: Required for all subscription operations
- **CORS Headers**: Properly configured for web application access
- **Rate Limiting**: Built-in Paddle API rate limiting

---

## 🚀 **DEPLOYMENT & SETUP**

### **1. Paddle Configuration**
1. Create Paddle account at [paddle.com](https://paddle.com)
2. Obtain API keys from Paddle dashboard
3. Configure product catalog in Paddle
4. Set up webhook endpoints (if needed)

### **2. Supabase Configuration**
1. Add Paddle API key to Edge Function secrets:
   ```bash
   # In Supabase dashboard: Functions > Settings
   PADDLE_API_KEY=your_paddle_api_key
   ```

### **3. Frontend Configuration**
The frontend automatically uses the configured edge functions. No additional configuration required.

---

## 📝 **USAGE EXAMPLES**

### **Creating a Checkout Session**
```typescript
import { useSubscription } from '@/hooks/useSubscription';

function SubscriptionButton({ planId }: { planId: string }) {
  const { createCheckoutSession, loading } = useSubscription();
  
  const handleSubscribe = async () => {
    try {
      await createCheckoutSession(planId);
      // Checkout opens in new tab automatically
    } catch (error) {
      console.error('Subscription failed:', error);
    }
  };
  
  return (
    <Button onClick={handleSubscribe} disabled={loading}>
      {loading ? 'Processing...' : 'Subscribe Now'}
    </Button>
  );
}
```

### **Checking Subscription Status**
```typescript
import { useSubscription } from '@/hooks/useSubscription';

function SubscriptionStatus() {
  const { subscriptionStatus, loading } = useSubscription();
  
  if (loading) return <div>Loading subscription status...</div>;
  
  return (
    <div>
      <h3>Subscription Status</h3>
      <p>Status: {subscriptionStatus?.hasSubscription ? 'Active' : 'Inactive'}</p>
      <p>Plan: {subscriptionStatus?.planNameEn}</p>
      {subscriptionStatus?.currentPeriodEnd && (
        <p>Expires: {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()}</p>
      )}
    </div>
  );
}
```

---

## 🔧 **MAINTENANCE & MONITORING**

### **Health Checks**
- **Edge Function Logs**: Monitor function execution in Supabase dashboard
- **Paddle Dashboard**: Track subscription metrics and payments
- **Database Monitoring**: Monitor subscription table updates

### **Common Issues**
1. **API Key Issues**: Verify Paddle API key configuration
2. **CORS Errors**: Check edge function CORS headers
3. **Subscription Sync**: Use refresh function to sync status

### **Performance Optimization**
- **Caching**: Subscription status cached in React state
- **Lazy Loading**: Components loaded on-demand
- **Error Boundaries**: Graceful error handling

---

## 📊 **ANALYTICS & REPORTING**

### **Available Metrics**
- Subscription conversion rates
- Plan popularity
- Customer lifecycle tracking
- Revenue analytics (via Paddle dashboard)

### **Custom Tracking**
Edge functions can be extended to track custom subscription events and integrate with analytics platforms.

---

## 🔄 **FUTURE ENHANCEMENTS**

### **Planned Features**
1. **Customer Portal Integration**: Full Paddle customer portal
2. **Webhook Integration**: Real-time subscription updates
3. **Usage-Based Billing**: Dynamic pricing based on usage
4. **Organization Subscriptions**: Team and enterprise billing
5. **Subscription Analytics**: Advanced reporting dashboard

### **Extension Points**
- Custom subscription workflows
- Integration with external CRM systems
- Advanced billing rules and discounts
- Multi-currency support

---

## 📚 **RELATED DOCUMENTATION**

- [Paddle API Documentation](https://developer.paddle.com/)
- [Supabase Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Phase 4 Progress Tracker](./12_PHASE_4_PROGRESS_UPDATE.md)
- [System Architecture Overview](./02_PHASE_TRACKER.md)

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Status**: Production Ready