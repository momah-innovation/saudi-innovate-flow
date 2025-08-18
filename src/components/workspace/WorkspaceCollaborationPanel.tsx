import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useWorkspaceCollaboration } from '@/hooks/useWorkspaceCollaboration'
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation'
import { 
  Users, 
  MessageSquare, 
  Clock, 
  Activity, 
  Circle,
  Send,
  Eye,
  Edit,
  FileText,
  User
} from 'lucide-react'

interface WorkspaceCollaborationPanelProps {
  workspaceId: string
  workspaceType: string
  currentUserId?: string
}

export const WorkspaceCollaborationPanel: React.FC<WorkspaceCollaborationPanelProps> = ({
  workspaceId,
  workspaceType,
  currentUserId
}) => {
  const { t } = useUnifiedTranslation()
  const { 
    messages,
    meetings,
    onlineUsers,
    loading,
    sendMessage,
    fetchMessages,
    updatePresence
  } = useWorkspaceCollaboration()
  
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'users' | 'activity' | 'chat'>('users')

  // Update presence when component mounts or activities change
  useEffect(() => {
    updatePresence('online', window.location.pathname)
    
    const handleActivity = () => {
      updatePresence('online', window.location.pathname)
    }

    // Track user activity
    const events = ['click', 'keypress', 'scroll', 'mousemove']
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
      updatePresence('offline')
    }
  }, [updatePresence])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500'
      case 'away': return 'text-yellow-500'
      case 'busy': return 'text-red-500'
      case 'offline': return 'text-gray-500'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    return <Circle className={`h-3 w-3 ${getStatusColor(status)} fill-current`} />
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'file_edit': return <Edit className="h-4 w-4" />
      case 'comment_added': return <MessageSquare className="h-4 w-4" />
      case 'task_updated': return <FileText className="h-4 w-4" />
      case 'member_joined': return <User className="h-4 w-4 text-green-500" />
      case 'member_left': return <User className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(message.trim())
      setMessage('')
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffMs = now.getTime() - time.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return t('workspace.collaboration.just_now')
    if (diffMins < 60) return t('workspace.collaboration.minutes_ago', { count: diffMins })
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return t('workspace.collaboration.hours_ago', { count: diffHours })
    
    const diffDays = Math.floor(diffHours / 24)
    return t('workspace.collaboration.days_ago', { count: diffDays })
  }

  return (
    <div className="w-80 border-l border-border bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">{t('workspace.collaboration.title')}</h3>
          <div className="flex items-center gap-2">
            <Circle className="h-3 w-3 text-green-500 fill-current" />
            <span className="text-xs text-muted-foreground">
              {t('workspace.collaboration.connected')}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
              activeTab === 'users' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="h-4 w-4 mx-auto" />
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
              activeTab === 'activity' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Activity className="h-4 w-4 mx-auto" />
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
              activeTab === 'chat' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageSquare className="h-4 w-4 mx-auto" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {/* Online Users Tab */}
        {activeTab === 'users' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {t('workspace.collaboration.online_members')} ({onlineUsers.length})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchMessages()}
              >
                <Activity className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {onlineUsers.map((user) => (
                <div key={user.user_id} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1">
                      {getStatusIcon(user.status)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user.user_id.substring(0, 8)}...
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {user.current_location && (
                        <>
                          <Eye className="h-3 w-3" />
                          <span className="truncate">{user.current_location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {onlineUsers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">{t('workspace.collaboration.no_online_users')}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Activity Feed Tab */}
        {activeTab === 'activity' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {t('workspace.collaboration.recent_activity')}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchMessages()}
              >
                <Activity className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {/* Mock activity data */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon('file_edit')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">المستخدم</span>
                    <span className="text-muted-foreground ml-1">
                      قام بتحديث ملف
                    </span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      منذ 5 دقائق
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">{t('workspace.collaboration.no_recent_activity')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {msg.sender?.display_name || 'مستخدم'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(msg.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">{t('workspace.collaboration.no_messages')}</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Textarea
                  placeholder={t('workspace.collaboration.type_message')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || loading}
                  size="sm"
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}