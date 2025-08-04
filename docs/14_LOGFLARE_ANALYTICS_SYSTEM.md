# Logflare Analytics System Documentation

## 📋 **OVERVIEW**

The Logflare Analytics System provides comprehensive log management and analytics for the Ruwād Innovation Platform. It enables centralized logging, real-time analytics queries, and advanced log visualization through Logflare's powerful platform.

---

## 🏗️ **SYSTEM ARCHITECTURE**

### **Backend Components**
- **Edge Functions**: Secure Logflare API integration
- **Log Aggregation**: Centralized log collection and processing
- **Real-time Analytics**: Live query execution and data visualization

### **Frontend Components**
- **React Hooks**: Log management and analytics state
- **Dashboard Components**: Interactive analytics interface
- **Query Builder**: Custom log analysis tools

---

## 🔧 **TECHNICAL IMPLEMENTATION**

### **1. Edge Function**

#### **`logflare-analytics`**
- **Location**: `supabase/functions/logflare-analytics/index.ts`
- **Purpose**: Secure bridge between frontend and Logflare API
- **Authentication**: Required (JWT verification enabled)
- **Key Actions**:
  - `send_logs`: Send application logs to Logflare
  - `get_analytics`: Query log data with SQL
  - `create_source`: Create new log sources

```typescript
// Edge Function Actions
interface LogflareActions {
  send_logs: {
    source_name: string;
    logs: LogEntry[];
  };
  get_analytics: {
    source_name?: string;
    query?: string;
  };
  create_source: {
    source_name: string;
    description?: string;
  };
}
```

#### **Key Features**:
- **Secure API Communication**: Direct Logflare API integration
- **Error Handling**: Comprehensive error logging and reporting
- **CORS Support**: Proper headers for web application access
- **Input Validation**: Request validation and sanitization

### **2. React Hook**

#### **`useLogflareAnalytics`**
- **Location**: `src/hooks/useLogflareAnalytics.ts`
- **Purpose**: Centralized log management and analytics interface
- **Key Features**:
  - Send structured logs to Logflare
  - Execute SQL queries on log data
  - Create and manage log sources
  - Automatic event logging with metadata

```typescript
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  metadata?: Record<string, any>;
}

interface UseLogflareAnalyticsResult {
  sendLogs: (logs: LogEntry[], sourceName?: string) => Promise<any>;
  getAnalytics: (query: AnalyticsQuery) => Promise<any>;
  createSource: (sourceName: string, description?: string) => Promise<any>;
  logEvent: (level: LogEntry['level'], message: string, metadata?: Record<string, any>) => Promise<void>;
  isLoading: boolean;
}
```

### **3. Dashboard Component**

#### **`LogflareAnalyticsDashboard`**
- **Location**: `src/components/analytics/LogflareAnalyticsDashboard.tsx`
- **Route**: `/admin/logflare-analytics` (Admin access only)
- **Key Features**:
  - **Analytics Tab**: Custom SQL queries and data visualization
  - **Sources Tab**: Log source creation and management
  - **Testing Tab**: Log level testing and validation

#### **Analytics Features**:
- **Custom Queries**: SQL query builder with syntax highlighting
- **Real-time Results**: Live query execution and results display
- **Log Visualization**: Structured log display with level indicators
- **Filtering & Search**: Advanced log filtering capabilities

#### **Source Management**:
- **Source Creation**: Create new log sources for different application areas
- **Source Configuration**: Manage source descriptions and settings
- **Source Analytics**: Per-source analytics and metrics

#### **Testing Interface**:
- **Log Level Testing**: Test different log levels (info, warn, error, debug)
- **Metadata Injection**: Automatic metadata addition (user agent, URL, timestamp)
- **Real-time Feedback**: Immediate log submission and verification

---

## 📊 **LOG MANAGEMENT**

### **Log Levels**
| Level | Purpose | Icon | Color |
|-------|---------|------|-------|
| **INFO** | General information | ℹ️ | Blue |
| **WARN** | Warning conditions | ⚠️ | Yellow |
| **ERROR** | Error conditions | ❌ | Red |
| **DEBUG** | Debug information | 🐛 | Gray |

### **Log Structure**
```typescript
interface LogEntry {
  timestamp: string;           // ISO 8601 timestamp
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;            // Human-readable message
  metadata?: {
    component?: string;       // Component generating the log
    user_id?: string;         // Associated user ID
    session_id?: string;      // Session identifier
    url?: string;             // Current page URL
    user_agent?: string;      // Browser user agent
    [key: string]: any;       // Additional metadata
  };
}
```

### **Default Log Sources**
- **`innovation-platform`**: Main application logs
- **`user-actions`**: User interaction tracking
- **`system-events`**: System-level events
- **`error-tracking`**: Application error logs

---

## 🔍 **ANALYTICS CAPABILITIES**

### **SQL Query Interface**
Execute custom SQL queries on log data:

```sql
-- Example: Get error logs from last 24 hours
SELECT timestamp, message, metadata
FROM logs 
WHERE level = 'error' 
  AND timestamp > NOW() - INTERVAL '24 hours'
ORDER BY timestamp DESC;

-- Example: User activity analysis
SELECT 
  metadata->>'user_id' as user_id,
  COUNT(*) as action_count,
  MAX(timestamp) as last_activity
FROM logs 
WHERE level = 'info' 
  AND metadata->>'user_id' IS NOT NULL
GROUP BY metadata->>'user_id'
ORDER BY action_count DESC;
```

### **Pre-built Analytics**
- **Error Rate Monitoring**: Track application error trends
- **User Activity Analysis**: Monitor user engagement patterns
- **Performance Metrics**: Analyze system performance logs
- **Feature Usage**: Track feature adoption and usage

### **Real-time Dashboards**
- **Live Log Stream**: Real-time log display
- **Metrics Visualization**: Charts and graphs for log analytics
- **Alert Configuration**: Set up alerts for specific log patterns
- **Export Capabilities**: Export log data for external analysis

---

## 🔐 **SECURITY & CONFIGURATION**

### **Environment Variables**
Required secrets in Supabase Edge Functions:
- `LOGFLARE_API_KEY`: Logflare API key for secure communication

### **Access Control**
- **Admin Only**: Analytics dashboard restricted to admin users
- **JWT Authentication**: All API calls require valid authentication
- **Source Isolation**: Log sources can be isolated by organization/team

### **Data Privacy**
- **PII Filtering**: Automatic removal of sensitive information
- **Data Retention**: Configurable log retention policies
- **Access Logging**: Track who accesses log data

---

## 🚀 **DEPLOYMENT & SETUP**

### **1. Logflare Configuration**
1. Create account at [logflare.app](https://logflare.app)
2. Generate API key from Logflare dashboard
3. Create initial log sources
4. Configure retention and alerts

### **2. Supabase Configuration**
1. Add Logflare API key to Edge Function secrets:
   ```bash
   # In Supabase dashboard: Functions > Settings
   LOGFLARE_API_KEY=your_logflare_api_key
   ```

### **3. Application Integration**
Automatic integration through the useLogflareAnalytics hook. No additional setup required.

---

## 📝 **USAGE EXAMPLES**

### **Basic Event Logging**
```typescript
import { useLogflareAnalytics } from '@/hooks/useLogflareAnalytics';

function MyComponent() {
  const { logEvent } = useLogflareAnalytics();
  
  const handleUserAction = async (action: string) => {
    await logEvent('info', `User performed action: ${action}`, {
      component: 'MyComponent',
      action_type: action,
      timestamp: Date.now()
    });
  };
  
  return (
    <Button onClick={() => handleUserAction('button_click')}>
      Click Me
    </Button>
  );
}
```

### **Error Logging**
```typescript
import { useLogflareAnalytics } from '@/hooks/useLogflareAnalytics';

function ApiCall() {
  const { logEvent } = useLogflareAnalytics();
  
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('API request failed');
      
      await logEvent('info', 'API call successful', {
        endpoint: '/api/data',
        status: response.status
      });
    } catch (error) {
      await logEvent('error', 'API call failed', {
        endpoint: '/api/data',
        error: error.message,
        stack: error.stack
      });
    }
  };
}
```

### **Custom Analytics Query**
```typescript
import { useLogflareAnalytics } from '@/hooks/useLogflareAnalytics';

function AnalyticsReport() {
  const { getAnalytics } = useLogflareAnalytics();
  
  const getErrorRate = async () => {
    const result = await getAnalytics({
      query: `
        SELECT 
          DATE(timestamp) as date,
          COUNT(CASE WHEN level = 'error' THEN 1 END) as error_count,
          COUNT(*) as total_logs,
          (COUNT(CASE WHEN level = 'error' THEN 1 END) * 100.0 / COUNT(*)) as error_rate
        FROM logs 
        WHERE timestamp > NOW() - INTERVAL '7 days'
        GROUP BY DATE(timestamp)
        ORDER BY date DESC
      `
    });
    
    return result.data;
  };
}
```

---

## 🔧 **MAINTENANCE & MONITORING**

### **Health Checks**
- **API Connectivity**: Monitor Logflare API availability
- **Log Ingestion**: Track log submission success rates
- **Query Performance**: Monitor analytics query execution times

### **Common Issues**
1. **API Key Expiration**: Rotate Logflare API keys regularly
2. **Rate Limiting**: Handle Logflare API rate limits gracefully
3. **Log Volume**: Monitor log volume to prevent quota overages

### **Performance Optimization**
- **Batch Logging**: Group multiple logs for efficient transmission
- **Async Processing**: Non-blocking log submission
- **Query Caching**: Cache frequently accessed analytics data

---

## 📊 **MONITORING & ALERTING**

### **Key Metrics**
- **Log Volume**: Daily/hourly log ingestion rates
- **Error Rates**: Application error frequency trends
- **Query Performance**: Analytics query execution metrics
- **User Activity**: Platform usage patterns

### **Alert Configuration**
Set up alerts for:
- High error rates (>5% of total logs)
- System downtime indicators
- Unusual user activity patterns
- Performance degradation signals

---

## 🔄 **ADVANCED FEATURES**

### **Log Correlation**
- **Session Tracking**: Correlate logs across user sessions
- **Request Tracing**: Track requests across system components
- **Error Grouping**: Group similar errors for better analysis

### **Custom Dashboards**
- **Executive Dashboards**: High-level platform metrics
- **Technical Dashboards**: Detailed system performance
- **User Analytics**: User behavior and engagement patterns

### **Integration Capabilities**
- **Webhook Support**: Real-time log streaming to external systems
- **API Integration**: Programmatic access to analytics data
- **Export Functions**: Bulk data export for external analysis

---

## 🔄 **FUTURE ENHANCEMENTS**

### **Planned Features**
1. **Automated Alerting**: ML-based anomaly detection
2. **Log Correlation**: Advanced cross-system log correlation
3. **Performance Analytics**: Detailed performance monitoring
4. **Custom Visualizations**: Advanced charting and visualization
5. **Log Retention Policies**: Automated log lifecycle management

### **Integration Roadmap**
- **APM Integration**: Application performance monitoring
- **Security Analytics**: Security event correlation
- **Business Intelligence**: Business metrics tracking
- **Compliance Reporting**: Automated compliance reports

---

## 📚 **RELATED DOCUMENTATION**

- [Logflare Documentation](https://docs.logflare.app/)
- [SQL Query Reference](https://docs.logflare.app/concepts/query-your-logs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Analytics Best Practices](./analytics-best-practices.md)

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Status**: Production Ready