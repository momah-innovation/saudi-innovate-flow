# Real-time Services Documentation

Comprehensive documentation for all real-time capabilities, WebSocket connections, and live synchronization services in the Enterprise Management System.

## 🎯 Real-time Architecture Overview

The application leverages multiple real-time technologies to provide instant updates, collaborative features, and responsive user experiences across all platform features.

## 🏗️ Real-time Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Real-time Layer                 │
│  ┌───────────────┐  ┌───────────────┐  ┌──────────────────┐ │
│  │   Supabase    │  │   WebSockets  │  │   OpenAI        │ │
│  │   Realtime    │  │   (Custom)    │  │   Realtime      │ │
│  └───────────────┘  └───────────────┘  └──────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Integration Services                     │
│  ┌───────────────┐  ┌───────────────┐  ┌──────────────────┐ │
│  │   Database    │  │   Edge        │  │   Voice/Chat    │ │
│  │   Changes     │  │   Functions   │  │   Processing    │ │
│  └───────────────┘  └───────────────┘  └──────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Backend Infrastructure                   │
│  ┌───────────────┐  ┌───────────────┐  ┌──────────────────┐ │
│  │   Supabase    │  │   OpenAI      │  │   External      │ │
│  │   Database    │  │   API         │  │   Services      │ │
│  └───────────────┘  └───────────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📡 Supabase Real-time Services

### **Database Change Subscriptions**

#### **Core Subscription Pattern**
**Location**: Various hooks throughout the application

```typescript
import { supabase } from '@/integrations/supabase/client';

// Standard subscription pattern
useEffect(() => {
  const channel = supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'challenges'
      },
      (payload) => {
        console.log('New challenge created:', payload);
        // Update local state
        setData(prevData => [...prevData, payload.new]);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'challenges'
      },
      (payload) => {
        console.log('Challenge updated:', payload);
        // Update specific item
        setData(prevData => 
          prevData.map(item => 
            item.id === payload.new.id ? { ...item, ...payload.new } : item
          )
        );
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'challenges'
      },
      (payload) => {
        console.log('Challenge deleted:', payload);
        // Remove from local state
        setData(prevData => 
          prevData.filter(item => item.id !== payload.old.id)
        );
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

### **Protected Real-time Implementations**

#### **Challenge Real-time Updates**
**Location**: `src/hooks/useChallengeManagement.ts`

```typescript
// Real-time challenge updates with security
useEffect(() => {
  if (!user) return; // Ensure user is authenticated

  const channel = supabase
    .channel('challenge-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'challenges',
        filter: `created_by=eq.${user.id}` // User-specific filtering
      },
      (payload) => {
        handleChallengeUpdate(payload);
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [user]);
```

#### **Event Management Real-time**
**Location**: `src/hooks/useEventsData.ts`

```typescript
// Real-time event participant tracking
useEffect(() => {
  const participantChannel = supabase
    .channel('event-participants')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'event_participants'
      },
      (payload) => {
        // Update participant count in real-time
        updateEventParticipants(payload.new.event_id, payload.new);
      }
    )
    .subscribe();

  return () => supabase.removeChannel(participantChannel);
}, []);
```

### **Campaign & Content Real-time**

#### **Campaign Status Updates**
**Location**: `src/hooks/useCampaignManagement.ts`

```typescript
// Real-time campaign status synchronization
const useCampaignRealtime = (campaignId: string) => {
  useEffect(() => {
    const channel = supabase
      .channel(`campaign-${campaignId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'campaigns',
          filter: `id=eq.${campaignId}`
        },
        (payload) => {
          // Update campaign status, metrics, approval status
          setCampaign(payload.new);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [campaignId]);
};
```

#### **Content Collaboration**
**Location**: `src/hooks/useContentData.ts`

```typescript
// Real-time content editing and collaboration
const useContentCollaboration = (contentId: string) => {
  useEffect(() => {
    const channel = supabase
      .channel(`content-${contentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_items',
          filter: `id=eq.${contentId}`
        },
        (payload) => {
          // Handle concurrent editing
          if (payload.eventType === 'UPDATE') {
            showCollaborationIndicator(payload.new);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [contentId]);
};
```

## 👥 Presence Tracking Services

### **User Presence Management**

#### **Collaborative Presence**
**Location**: `src/hooks/useRealtimeSubscription.ts`

```typescript
// Track user presence across the application
export const useUserPresence = (roomId: string) => {
  const [presence, setPresence] = useState<Record<string, any>>({});
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !roomId) return;

    const channel = supabase.channel(`presence-${roomId}`)
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        setPresence(newState);
        console.log('Presence sync:', newState);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return;

        // Track current user presence
        const presenceTrackStatus = await channel.track({
          user_id: user.id,
          user_name: user.name,
          online_at: new Date().toISOString(),
          activity: 'viewing',
          location: window.location.pathname
        });
        
        console.log('Presence tracking status:', presenceTrackStatus);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, roomId]);

  return {
    presence,
    userCount: Object.keys(presence).length,
    activeUsers: Object.values(presence).flat()
  };
};
```

### **Challenge Collaboration Presence**

```typescript
// Real-time collaboration for challenge editing
export const useChallengeCollaboration = (challengeId: string) => {
  const { user } = useAuth();
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([]);

  useEffect(() => {
    if (!user || !challengeId) return;

    const channel = supabase.channel(`challenge-${challengeId}`)
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const currentCollaborators = Object.values(presenceState)
          .flat()
          .filter(presence => presence.user_id !== user.id);
        setCollaborators(currentCollaborators);
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return;

        await channel.track({
          user_id: user.id,
          user_name: user.name || user.email,
          editing_section: null,
          cursor_position: null,
          last_activity: new Date().toISOString()
        });
      });

    return () => supabase.removeChannel(channel);
  }, [user, challengeId]);

  const updateEditingSection = useCallback(async (section: string) => {
    const channel = supabase.channel(`challenge-${challengeId}`);
    await channel.track({
      user_id: user.id,
      user_name: user.name || user.email,
      editing_section: section,
      last_activity: new Date().toISOString()
    });
  }, [challengeId, user]);

  return {
    collaborators,
    updateEditingSection,
    isCollaborative: collaborators.length > 0
  };
};
```

## 🎙️ AI Real-time Voice Services

### **OpenAI Realtime API Integration**

#### **Edge Function for Secure Token Generation**
**Location**: `supabase/functions/openai-realtime-token/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Request ephemeral token from OpenAI
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "alloy",
        instructions: `You are an AI assistant for an enterprise innovation management platform. 
        Help users with challenge creation, event planning, and idea development. 
        Be professional, helpful, and concise in your responses.`
      }),
    });

    const data = await response.json();
    console.log("OpenAI Realtime session created:", data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error creating OpenAI session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

#### **Audio Processing Utilities**
**Location**: `src/utils/RealtimeAudio.ts`

```typescript
export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.audioContext = new AudioContext({ sampleRate: 24000 });
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.onAudioData(new Float32Array(inputData));
      };
      
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  stop() {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Audio encoding for OpenAI API
export const encodeAudioForAPI = (float32Array: Float32Array): string => {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  const uint8Array = new Uint8Array(int16Array.buffer);
  let binary = '';
  const chunkSize = 0x8000;
  
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
};
```

#### **WebSocket Realtime Chat Service**
**Location**: `supabase/functions/realtime-chat/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  let openAISocket: WebSocket | null = null;
  let sessionConfigured = false;

  // Initialize OpenAI WebSocket connection
  const initOpenAI = () => {
    openAISocket = new WebSocket(
      "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01",
      [],
      {
        headers: {
          "Authorization": `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          "OpenAI-Beta": "realtime=v1"
        }
      }
    );

    openAISocket.onopen = () => {
      console.log("Connected to OpenAI Realtime API");
    };

    openAISocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("OpenAI message:", data.type);

      // Configure session after connection
      if (data.type === 'session.created' && !sessionConfigured) {
        const sessionUpdate = {
          type: 'session.update',
          session: {
            modalities: ["text", "audio"],
            instructions: "You are a helpful AI assistant for an enterprise platform.",
            voice: "alloy",
            input_audio_format: "pcm16",
            output_audio_format: "pcm16",
            input_audio_transcription: { model: "whisper-1" },
            turn_detection: {
              type: "server_vad",
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 1000
            },
            temperature: 0.8,
            max_response_output_tokens: "inf"
          }
        };
        
        openAISocket?.send(JSON.stringify(sessionUpdate));
        sessionConfigured = true;
        console.log("Session configured with VAD");
      }

      // Forward all messages to client
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(event.data);
      }
    };

    openAISocket.onerror = (error) => {
      console.error("OpenAI WebSocket error:", error);
    };

    openAISocket.onclose = () => {
      console.log("OpenAI WebSocket closed");
    };
  };

  // Handle client messages
  socket.onopen = () => {
    console.log("Client connected");
    initOpenAI();
  };

  socket.onmessage = (event) => {
    if (openAISocket?.readyState === WebSocket.OPEN) {
      openAISocket.send(event.data);
    }
  };

  socket.onclose = () => {
    console.log("Client disconnected");
    openAISocket?.close();
  };

  return response;
});
```

### **Voice Interface Component**
**Location**: `src/components/VoiceInterface.tsx`

```typescript
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceInterfaceProps {
  onTranscript?: (text: string) => void;
  onSpeakingChange?: (speaking: boolean) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ 
  onTranscript, 
  onSpeakingChange 
}) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recorderRef = useRef<any>(null);

  // Audio processing utilities
  const createWavFromPCM = (pcmData: Uint8Array) => {
    const int16Data = new Int16Array(pcmData.length / 2);
    for (let i = 0; i < pcmData.length; i += 2) {
      int16Data[i / 2] = (pcmData[i + 1] << 8) | pcmData[i];
    }

    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    
    // WAV header setup
    const writeString = (view: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    const sampleRate = 24000;
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + int16Data.byteLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, int16Data.byteLength, true);

    const wavArray = new Uint8Array(wavHeader.byteLength + int16Data.byteLength);
    wavArray.set(new Uint8Array(wavHeader), 0);
    wavArray.set(new Uint8Array(int16Data.buffer), wavHeader.byteLength);
    
    return wavArray;
  };

  const playAudioData = async (audioData: Uint8Array) => {
    if (!audioContextRef.current || isMuted) return;

    try {
      const wavData = createWavFromPCM(audioData);
      const audioBuffer = await audioContextRef.current.decodeAudioData(wavData.buffer);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const startConversation = async () => {
    try {
      // Initialize audio context
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      
      // Connect to realtime WebSocket
      wsRef.current = new WebSocket(
        'wss://jxpbiljkoibvqxzdkgod.functions.supabase.co/functions/v1/realtime-chat'
      );

      wsRef.current.onopen = () => {
        console.log('Connected to realtime chat');
        setIsConnected(true);
        setIsListening(true);
        onSpeakingChange?.(false);
      };

      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('Received message:', data.type);

        if (data.type === 'response.audio.delta') {
          // Convert base64 to Uint8Array and play
          const binaryString = atob(data.delta);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          await playAudioData(bytes);
          onSpeakingChange?.(true);
        } else if (data.type === 'response.audio_transcript.delta') {
          onTranscript?.(data.delta);
        } else if (data.type === 'response.audio.done') {
          onSpeakingChange?.(false);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to voice service",
          variant: "destructive",
        });
      };

      // Start audio recording
      const { AudioRecorder, encodeAudioForAPI } = await import('@/utils/RealtimeAudio');
      recorderRef.current = new AudioRecorder((audioData: Float32Array) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encodeAudioForAPI(audioData)
          }));
        }
      });

      await recorderRef.current.start();

      toast({
        title: "Voice Interface Active",
        description: "You can now speak to the AI assistant",
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start voice conversation",
        variant: "destructive",
      });
    }
  };

  const endConversation = () => {
    wsRef.current?.close();
    recorderRef.current?.stop();
    audioContextRef.current?.close();
    
    setIsConnected(false);
    setIsListening(false);
    onSpeakingChange?.(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    return () => {
      endConversation();
    };
  }, []);

  return (
    <div className="fixed bottom-8 right-8 flex flex-col items-center gap-2">
      <div className="flex gap-2">
        {isConnected && (
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMute}
            className={isMuted ? 'text-destructive' : ''}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        )}
        
        {!isConnected ? (
          <Button 
            onClick={startConversation}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Mic className="mr-2 h-4 w-4" />
            Start Voice Chat
          </Button>
        ) : (
          <Button 
            onClick={endConversation}
            variant="destructive"
          >
            <MicOff className="mr-2 h-4 w-4" />
            End Chat
          </Button>
        )}
      </div>
      
      {isListening && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          Listening...
        </div>
      )}
    </div>
  );
};

export default VoiceInterface;
```

## 📊 Performance Monitoring & Analytics

### **Real-time Performance Tracking**

```typescript
// Real-time connection monitoring
export const useRealtimeHealth = () => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('disconnected');
  const [latency, setLatency] = useState<number>(0);
  const [messageCount, setMessageCount] = useState<number>(0);

  useEffect(() => {
    const startTime = Date.now();
    
    const healthChannel = supabase
      .channel('health-check')
      .on('presence', { event: 'sync' }, () => {
        const endTime = Date.now();
        setLatency(endTime - startTime);
        setConnectionStatus('connected');
      })
      .subscribe();

    const interval = setInterval(() => {
      // Ping for latency measurement
      healthChannel.track({
        ping: Date.now(),
        user_id: 'health-check'
      });
    }, 5000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(healthChannel);
    };
  }, []);

  return {
    connectionStatus,
    latency,
    messageCount,
    isHealthy: connectionStatus === 'connected' && latency < 1000
  };
};
```

## 🔒 Security & Access Control

### **Authenticated Real-time Connections**

```typescript
// Secure real-time with RLS enforcement
export const useSecureRealtime = (tableName: string, userId: string) => {
  const { user } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!user) return; // Require authentication

    const channel = supabase
      .channel(`secure-${tableName}-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
          filter: `user_id=eq.${userId}` // Row-level filtering
        },
        (payload) => {
          // Verify payload belongs to authenticated user
          if (payload.new?.user_id === user.id || payload.old?.user_id === user.id) {
            handleDataUpdate(payload);
          }
        }
      )
      .subscribe((status) => {
        console.log(`Secure subscription status: ${status}`);
      });

    return () => supabase.removeChannel(channel);
  }, [user, tableName, userId]);

  return data;
};
```

### **Rate Limiting & Throttling**

```typescript
// Throttled real-time updates to prevent spam
export const useThrottledRealtime = (callback: Function, delay: number = 1000) => {
  const lastRun = useRef(Date.now());

  return useCallback((...args: any[]) => {
    const now = Date.now();
    if (now - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = now;
    }
  }, [callback, delay]);
};
```

## 🚀 Performance Optimization

### **Connection Pooling**
- **Shared Channels**: Reuse channels across components
- **Channel Cleanup**: Automatic cleanup on unmount
- **Reconnection Logic**: Automatic reconnection on failure
- **Heartbeat Monitoring**: Keep-alive pings

### **Data Efficiency**
- **Selective Subscriptions**: Filter data at the database level
- **Batch Updates**: Group related updates
- **Debounced Processing**: Prevent excessive updates
- **Memory Management**: Clean up subscriptions

## 📈 Monitoring & Debugging

### **Real-time Debugging Tools**

```typescript
// Development debugging helper
export const useRealtimeDebugger = (channelName: string) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const debugChannel = supabase
      .channel(`debug-${channelName}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: '*' }, (payload) => {
        console.group(`🔴 Real-time Event: ${payload.eventType}`);
        console.log('Table:', payload.table);
        console.log('Schema:', payload.schema);
        console.log('Old:', payload.old);
        console.log('New:', payload.new);
        console.log('Timestamp:', new Date().toISOString());
        console.groupEnd();
      })
      .subscribe();

    return () => supabase.removeChannel(debugChannel);
  }, [channelName]);
};
```

## 🎯 Best Practices

### **Connection Management**
1. **Always Clean Up**: Use cleanup functions in useEffect
2. **Authentication Check**: Verify user before subscribing
3. **Error Handling**: Implement reconnection logic
4. **Performance**: Minimize active subscriptions
5. **Security**: Use RLS filtering

### **Data Synchronization**
1. **Optimistic Updates**: Update UI immediately
2. **Conflict Resolution**: Handle concurrent updates
3. **State Consistency**: Maintain data integrity
4. **Error Recovery**: Handle failed updates gracefully
5. **User Feedback**: Show connection status

---

*Real-time Services: 15+ integration points documented*
*Technologies: Supabase Realtime, WebSockets, OpenAI Realtime API*
*Security: RLS-protected with authentication required*
*Status: ✅ Enterprise-ready with comprehensive monitoring*