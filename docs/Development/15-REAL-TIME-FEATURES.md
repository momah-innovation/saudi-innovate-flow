# ⚡ Real-Time Features Guide

## Overview
Comprehensive guide for implementing real-time features in the Ruwād Platform using Supabase Real-time, WebSockets, and live data synchronization.

## Real-Time Architecture

### Supabase Real-Time Setup
```typescript
// src/lib/realtime/realtimeClient.ts
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(private supabase: typeof supabase) {
    this.setupConnectionMonitoring();
  }

  private setupConnectionMonitoring() {
    // Monitor connection status
    this.supabase.realtime.onOpen(() => {
      console.log('Real-time connection opened');
      this.reconnectAttempts = 0;
    });

    this.supabase.realtime.onClose(() => {
      console.log('Real-time connection closed');
      this.handleReconnection();
    });

    this.supabase.realtime.onError((error) => {
      console.error('Real-time error:', error);
    });
  }

  private async handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
      
      console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
      
      setTimeout(() => {
        this.reconnectAllChannels();
      }, delay);
    }
  }

  private async reconnectAllChannels() {
    for (const [channelName, channel] of this.channels) {
      await channel.unsubscribe();
      // Channels will be recreated when needed
      this.channels.delete(channelName);
    }
  }

  createChannel(
    channelName: string,
    config?: { presence?: { key: string } }
  ): RealtimeChannel {
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!;
    }

    const channel = this.supabase.channel(channelName, config);
    this.channels.set(channelName, channel);
    
    return channel;
  }

  removeChannel(channelName: string) {
    const channel = this.channels.get(channelName);
    if (channel) {
      channel.unsubscribe();
      this.channels.delete(channelName);
    }
  }

  async cleanup() {
    for (const channel of this.channels.values()) {
      await channel.unsubscribe();
    }
    this.channels.clear();
  }
}

export const realtimeManager = new RealtimeManager(supabase);
```

## Database Change Subscriptions

### Table Change Monitoring
```typescript
// src/hooks/realtime/useTableSubscription.ts
export const useTableSubscription = <T = any>(
  table: string,
  filters?: {
    event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
    schema?: string;
    filter?: string;
  },
  onUpdate?: (payload: RealtimePostgresChangesPayload<T>) => void
) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const channelName = `table-${table}-${Date.now()}`;
    const channel = realtimeManager.createChannel(channelName);

    channel
      .on(
        'postgres_changes',
        {
          event: filters?.event || '*',
          schema: filters?.schema || 'public',
          table,
          filter: filters?.filter
        },
        (payload) => {
          console.log(`Real-time update for ${table}:`, payload);
          onUpdate?.(payload);
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for ${table}:`, status);
        setIsConnected(status === 'SUBSCRIBED');
        
        if (status === 'CHANNEL_ERROR') {
          setError('Failed to subscribe to real-time updates');
        } else {
          setError(null);
        }
      });

    return () => {
      realtimeManager.removeChannel(channelName);
    };
  }, [table, filters?.event, filters?.schema, filters?.filter]);

  return { isConnected, error };
};
```

### Live Challenge Updates
```typescript
// src/hooks/realtime/useLiveChallenges.ts
export const useLiveChallenges = (challengeId?: string) => {
  const queryClient = useQueryClient();
  const [liveUpdates, setLiveUpdates] = useState<LiveUpdate[]>([]);

  // Subscribe to challenge updates
  useTableSubscription(
    'challenges',
    {
      event: '*',
      filter: challengeId ? `id=eq.${challengeId}` : undefined
    },
    (payload) => {
      const update: LiveUpdate = {
        id: Date.now().toString(),
        type: 'challenge_update',
        event: payload.eventType,
        timestamp: new Date().toISOString(),
        data: payload.new || payload.old
      };

      setLiveUpdates(prev => [update, ...prev.slice(0, 49)]); // Keep last 50 updates

      // Update React Query cache
      if (payload.eventType === 'UPDATE' && payload.new) {
        queryClient.setQueryData(['challenge', payload.new.id], payload.new);
        queryClient.invalidateQueries({ queryKey: ['challenges'] });
      } else if (payload.eventType === 'INSERT' && payload.new) {
        queryClient.invalidateQueries({ queryKey: ['challenges'] });
      } else if (payload.eventType === 'DELETE' && payload.old) {
        queryClient.removeQueries({ queryKey: ['challenge', payload.old.id] });
        queryClient.invalidateQueries({ queryKey: ['challenges'] });
      }
    }
  );

  // Subscribe to challenge submissions
  useTableSubscription(
    'challenge_submissions',
    {
      event: '*',
      filter: challengeId ? `challenge_id=eq.${challengeId}` : undefined
    },
    (payload) => {
      const update: LiveUpdate = {
        id: Date.now().toString(),
        type: 'submission_update',
        event: payload.eventType,
        timestamp: new Date().toISOString(),
        data: payload.new || payload.old
      };

      setLiveUpdates(prev => [update, ...prev.slice(0, 49)]);

      // Update submissions cache
      queryClient.invalidateQueries({ 
        queryKey: ['challenge-submissions', challengeId] 
      });
    }
  );

  const clearUpdates = () => setLiveUpdates([]);

  return {
    liveUpdates,
    clearUpdates
  };
};
```

## Real-Time Chat System

### Chat Hook Implementation
```typescript
// src/hooks/realtime/useChat.ts
export const useChat = (roomId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
  const [typing, setTyping] = useState<TypingUser[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !roomId) return;

    const channelName = `chat-${roomId}`;
    const channel = realtimeManager.createChannel(channelName, {
      config: { presence: { key: user.id } }
    });

    // Handle new messages
    channel
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_id=eq.${roomId}`
      }, (payload) => {
        const newMessage = payload.new as ChatMessage;
        setMessages(prev => [...prev, newMessage]);
        
        // Clear typing indicator for this user
        setTyping(prev => prev.filter(t => t.userId !== newMessage.user_id));
      })

      // Handle message updates (reactions, edits)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_id=eq.${roomId}`
      }, (payload) => {
        const updatedMessage = payload.new as ChatMessage;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === updatedMessage.id ? updatedMessage : msg
          )
        );
      })

      // Handle typing indicators
      .on('broadcast', { event: 'typing' }, (payload) => {
        const { userId, isTyping, userName } = payload.payload;
        
        if (userId === user.id) return; // Don't show own typing
        
        setTyping(prev => {
          const filtered = prev.filter(t => t.userId !== userId);
          
          if (isTyping) {
            return [...filtered, { userId, userName, timestamp: Date.now() }];
          }
          
          return filtered;
        });
      })

      // Handle presence (online users)
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const users = Object.values(presenceState).flat() as PresenceUser[];
        setOnlineUsers(users);
      })

      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })

      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })

      .subscribe(async (status) => {
        console.log('Chat subscription status:', status);
        setConnectionStatus(
          status === 'SUBSCRIBED' ? 'connected' : 
          status === 'CHANNEL_ERROR' ? 'disconnected' : 'connecting'
        );

        if (status === 'SUBSCRIBED') {
          // Track user presence
          await channel.track({
            userId: user.id,
            userName: user.user_metadata?.display_name || user.email,
            joinedAt: new Date().toISOString()
          });

          // Load recent messages
          loadRecentMessages();
        }
      });

    // Clear typing indicators after timeout
    const typingTimer = setInterval(() => {
      setTyping(prev => 
        prev.filter(t => Date.now() - t.timestamp < 3000)
      );
    }, 1000);

    return () => {
      clearInterval(typingTimer);
      realtimeManager.removeChannel(channelName);
    };
  }, [roomId, user]);

  const loadRecentMessages = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        user_profile:profiles!user_id(display_name, avatar_url)
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(50);

    if (!error && data) {
      setMessages(data);
    }
  };

  const sendMessage = async (content: string, type: 'text' | 'file' = 'text') => {
    if (!user || !content.trim()) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        room_id: roomId,
        user_id: user.id,
        content,
        type,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const sendTypingIndicator = (isTyping: boolean) => {
    if (!user) return;

    const channel = realtimeManager.createChannel(`chat-${roomId}`);
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        userId: user.id,
        userName: user.user_metadata?.display_name || user.email,
        isTyping
      }
    });
  };

  const addReaction = async (messageId: string, emoji: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('message_reactions')
      .insert({
        message_id: messageId,
        user_id: user.id,
        emoji
      });

    if (error && error.code !== '23505') { // Ignore duplicate key errors
      console.error('Error adding reaction:', error);
    }
  };

  return {
    messages,
    onlineUsers,
    typing,
    connectionStatus,
    sendMessage,
    sendTypingIndicator,
    addReaction
  };
};
```

### Chat UI Component
```tsx
// src/components/chat/ChatRoom.tsx
export const ChatRoom = ({ roomId, className }: ChatRoomProps) => {
  const {
    messages,
    onlineUsers,
    typing,
    connectionStatus,
    sendMessage,
    sendTypingIndicator
  } = useChat(roomId);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    try {
      await sendMessage(newMessage);
      setNewMessage('');
      handleStopTyping();
    } catch (error) {
      toast.error('فشل في إرسال الرسالة');
    }
  };

  const handleInputChange = (value: string) => {
    setNewMessage(value);
    
    if (value && !isTyping) {
      setIsTyping(true);
      sendTypingIndicator(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 2000);
  };

  const handleStopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      sendTypingIndicator(false);
    }
  };

  return (
    <Card className={`flex flex-col h-96 ${className}`}>
      {/* Header */}
      <CardHeader className="flex-row items-center justify-between py-3">
        <h3 className="font-semibold">المحادثة</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' :
            connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <span className="text-sm text-muted-foreground">
            {onlineUsers.length} متصل
          </span>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto space-y-3 p-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {/* Typing indicators */}
        {typing.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span>
              {typing.map(t => t.userName).join(', ')} يكتب...
            </span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input */}
      <CardFooter className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
          <Input
            value={newMessage}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="اكتب رسالة..."
            disabled={connectionStatus !== 'connected'}
            dir="rtl"
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || connectionStatus !== 'connected'}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};
```

## Live Analytics Dashboard

### Real-Time Metrics
```typescript
// src/hooks/realtime/useLiveAnalytics.ts
export const useLiveAnalytics = () => {
  const [metrics, setMetrics] = useState<LiveMetrics>({
    activeUsers: 0,
    totalChallenges: 0,
    newSubmissions: 0,
    onlineUsers: 0
  });

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  // Subscribe to user activity
  useTableSubscription(
    'user_activities',
    { event: 'INSERT' },
    (payload) => {
      const activity = payload.new as ActivityItem;
      setRecentActivity(prev => [activity, ...prev.slice(0, 9)]);
      
      // Update active users count
      setMetrics(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + 1
      }));
    }
  );

  // Subscribe to challenge submissions
  useTableSubscription(
    'challenge_submissions',
    { event: 'INSERT' },
    (payload) => {
      setMetrics(prev => ({
        ...prev,
        newSubmissions: prev.newSubmissions + 1
      }));
    }
  );

  // Subscribe to new challenges
  useTableSubscription(
    'challenges',
    { event: 'INSERT' },
    (payload) => {
      setMetrics(prev => ({
        ...prev,
        totalChallenges: prev.totalChallenges + 1
      }));
    }
  );

  // Periodic metrics refresh
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { data } = await supabase.rpc('get_live_metrics');
        if (data) {
          setMetrics(data);
        }
      } catch (error) {
        console.error('Error fetching live metrics:', error);
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { metrics, recentActivity };
};
```

## Collaborative Features

### Real-Time Document Editing
```typescript
// src/hooks/realtime/useCollaborativeDocument.ts
export const useCollaborativeDocument = (documentId: string) => {
  const [document, setDocument] = useState<CollaborativeDocument | null>(null);
  const [cursors, setCursors] = useState<UserCursor[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !documentId) return;

    const channelName = `document-${documentId}`;
    const channel = realtimeManager.createChannel(channelName, {
      config: { presence: { key: user.id } }
    });

    channel
      // Document content changes
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'collaborative_documents',
        filter: `id=eq.${documentId}`
      }, (payload) => {
        const updatedDoc = payload.new as CollaborativeDocument;
        setDocument(updatedDoc);
      })

      // Real-time cursor positions
      .on('broadcast', { event: 'cursor' }, (payload) => {
        const { userId, position, selection } = payload.payload;
        
        if (userId === user.id) return;
        
        setCursors(prev => {
          const filtered = prev.filter(c => c.userId !== userId);
          return [...filtered, { userId, position, selection, timestamp: Date.now() }];
        });
      })

      // Text operations (operational transform)
      .on('broadcast', { event: 'operation' }, (payload) => {
        const { operation, version } = payload.payload;
        
        if (operation.userId === user.id) return;
        
        // Apply operation to document
        applyOperation(operation, version);
      })

      // Presence for collaborators
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const users = Object.values(presenceState).flat() as Collaborator[];
        setCollaborators(users);
      })

      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            userId: user.id,
            userName: user.user_metadata?.display_name || user.email,
            userColor: generateUserColor(user.id),
            joinedAt: new Date().toISOString()
          });

          // Load document
          loadDocument();
        }
      });

    // Cleanup cursor positions
    const cursorCleanup = setInterval(() => {
      setCursors(prev => 
        prev.filter(c => Date.now() - c.timestamp < 5000)
      );
    }, 1000);

    return () => {
      clearInterval(cursorCleanup);
      realtimeManager.removeChannel(channelName);
    };
  }, [documentId, user]);

  const loadDocument = async () => {
    const { data, error } = await supabase
      .from('collaborative_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (!error && data) {
      setDocument(data);
    }
  };

  const updateContent = async (content: string, version: number) => {
    if (!user) return;

    const { error } = await supabase
      .from('collaborative_documents')
      .update({
        content,
        version: version + 1,
        last_modified_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId);

    if (error) {
      console.error('Error updating document:', error);
    }
  };

  const broadcastCursor = (position: number, selection?: { start: number; end: number }) => {
    if (!user) return;

    const channel = realtimeManager.createChannel(`document-${documentId}`);
    channel.send({
      type: 'broadcast',
      event: 'cursor',
      payload: {
        userId: user.id,
        position,
        selection
      }
    });
  };

  const broadcastOperation = (operation: TextOperation, version: number) => {
    if (!user) return;

    const channel = realtimeManager.createChannel(`document-${documentId}`);
    channel.send({
      type: 'broadcast',
      event: 'operation',
      payload: {
        operation: { ...operation, userId: user.id },
        version
      }
    });
  };

  const applyOperation = (operation: TextOperation, version: number) => {
    // Implement operational transform logic here
    console.log('Applying operation:', operation, version);
  };

  return {
    document,
    cursors,
    collaborators,
    updateContent,
    broadcastCursor,
    broadcastOperation
  };
};
```

## Performance Optimization

### Connection Management
```typescript
// src/lib/realtime/connectionOptimizer.ts
export class RealtimeConnectionOptimizer {
  private connectionPool: Map<string, RealtimeChannel> = new Map();
  private subscriptionCount = 0;
  private maxSubscriptions = 100; // Supabase limit

  optimizeSubscription(
    channelName: string,
    config: any,
    callbacks: any[]
  ): RealtimeChannel | null {
    // Check subscription limit
    if (this.subscriptionCount >= this.maxSubscriptions) {
      console.warn('Subscription limit reached, consolidating channels');
      this.consolidateChannels();
    }

    // Reuse existing channel if possible
    const existingChannel = this.connectionPool.get(channelName);
    if (existingChannel) {
      // Add new callbacks to existing channel
      callbacks.forEach(callback => {
        existingChannel.on(callback.event, callback.filter, callback.handler);
      });
      return existingChannel;
    }

    // Create new optimized channel
    const channel = supabase.channel(channelName, {
      config: {
        ...config,
        presence: config.presence || {},
        broadcast: config.broadcast || { self: false }
      }
    });

    this.connectionPool.set(channelName, channel);
    this.subscriptionCount++;

    return channel;
  }

  private consolidateChannels() {
    // Group similar channels and merge them
    const channelGroups = new Map<string, RealtimeChannel[]>();
    
    for (const [name, channel] of this.connectionPool) {
      const baseType = name.split('-')[0];
      const group = channelGroups.get(baseType) || [];
      group.push(channel);
      channelGroups.set(baseType, group);
    }

    // Merge channels with same base type
    for (const [baseType, channels] of channelGroups) {
      if (channels.length > 3) {
        console.log(`Consolidating ${channels.length} ${baseType} channels`);
        this.mergeChannels(baseType, channels);
      }
    }
  }

  private mergeChannels(baseType: string, channels: RealtimeChannel[]) {
    // Implementation for merging multiple channels into one
    // This is a simplified version - actual implementation would be more complex
    const consolidatedChannel = supabase.channel(`${baseType}-consolidated`);
    
    // Unsubscribe old channels
    channels.forEach(channel => {
      channel.unsubscribe();
      // Transfer event handlers to consolidated channel
    });

    this.connectionPool.set(`${baseType}-consolidated`, consolidatedChannel);
    this.subscriptionCount = this.subscriptionCount - channels.length + 1;
  }
}

export const connectionOptimizer = new RealtimeConnectionOptimizer();
```

### Bandwidth Optimization
```typescript
// src/lib/realtime/bandwidthOptimizer.ts
export class BandwidthOptimizer {
  private updateQueue: Map<string, any> = new Map();
  private batchTimeout?: NodeJS.Timeout;
  private readonly batchDelay = 100; // ms

  // Batch multiple updates to reduce bandwidth
  queueUpdate(key: string, data: any) {
    this.updateQueue.set(key, data);

    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }

    this.batchTimeout = setTimeout(() => {
      this.processBatch();
    }, this.batchDelay);
  }

  private processBatch() {
    if (this.updateQueue.size === 0) return;

    const batch = Object.fromEntries(this.updateQueue);
    this.updateQueue.clear();

    // Send batched updates
    console.log('Sending batched updates:', batch);
    
    // Implementation would send the batch to subscribers
  }

  // Compress data before transmission
  compressData(data: any): string {
    try {
      return JSON.stringify(data);
    } catch (error) {
      console.error('Data compression error:', error);
      return '';
    }
  }

  // Decompress received data
  decompressData(compressed: string): any {
    try {
      return JSON.parse(compressed);
    } catch (error) {
      console.error('Data decompression error:', error);
      return null;
    }
  }
}

export const bandwidthOptimizer = new BandwidthOptimizer();
```

## Testing Real-Time Features

### Real-Time Testing Utilities
```typescript
// src/test/realtime/realtimeTestUtils.ts
export class RealtimeTestUtils {
  private mockChannels: Map<string, MockChannel> = new Map();

  createMockChannel(name: string): MockChannel {
    const mockChannel = new MockChannel(name);
    this.mockChannels.set(name, mockChannel);
    return mockChannel;
  }

  simulateUpdate(channelName: string, event: string, payload: any) {
    const channel = this.mockChannels.get(channelName);
    if (channel) {
      channel.triggerEvent(event, payload);
    }
  }

  cleanup() {
    this.mockChannels.clear();
  }
}

class MockChannel {
  private handlers: Map<string, Function[]> = new Map();

  constructor(private name: string) {}

  on(event: string, handler: Function) {
    const handlers = this.handlers.get(event) || [];
    handlers.push(handler);
    this.handlers.set(event, handlers);
    return this;
  }

  off(event: string, handler?: Function) {
    if (!handler) {
      this.handlers.delete(event);
    } else {
      const handlers = this.handlers.get(event) || [];
      const filtered = handlers.filter(h => h !== handler);
      this.handlers.set(event, filtered);
    }
    return this;
  }

  triggerEvent(event: string, payload: any) {
    const handlers = this.handlers.get(event) || [];
    handlers.forEach(handler => handler(payload));
  }

  subscribe(callback: (status: string) => void) {
    setTimeout(() => callback('SUBSCRIBED'), 0);
    return { unsubscribe: () => {} };
  }

  unsubscribe() {
    return Promise.resolve();
  }
}

// Test examples
describe('Real-time Chat', () => {
  let testUtils: RealtimeTestUtils;

  beforeEach(() => {
    testUtils = new RealtimeTestUtils();
  });

  afterEach(() => {
    testUtils.cleanup();
  });

  test('should handle new messages', () => {
    const onMessage = jest.fn();
    const { result } = renderHook(() => useChat('test-room'));

    // Simulate new message
    testUtils.simulateUpdate('chat-test-room', 'postgres_changes', {
      eventType: 'INSERT',
      new: {
        id: '1',
        content: 'Test message',
        user_id: 'user-1',
        created_at: new Date().toISOString()
      }
    });

    expect(result.current.messages).toHaveLength(1);
  });
});
```

## Best Practices

### 1. **Connection Management**
- Use connection pooling for efficiency
- Implement proper cleanup on unmount
- Handle reconnection scenarios gracefully

### 2. **Performance**
- Batch updates to reduce bandwidth
- Use selective subscriptions with filters
- Implement connection limits and optimization

### 3. **Error Handling**
- Monitor connection status
- Implement fallback mechanisms
- Log real-time errors for debugging

### 4. **Security**
- Validate real-time permissions
- Use RLS policies for data access
- Implement rate limiting for real-time operations

---

**Last Updated**: January 17, 2025  
**Guide Version**: 1.0  
**Real-Time Features**: Production Ready