import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation'
import { 
  History, 
  Download, 
  Eye, 
  GitBranch, 
  Clock, 
  User, 
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface FileVersion {
  id: string
  versionNumber: number
  createdAt: string
  createdBy: string
  size: number
  changeDescription?: string
  downloadUrl: string
  isCurrent: boolean
  hasConflicts?: boolean
}

interface WorkspaceFileVersioningProps {
  fileId: string
  fileName: string
  workspaceId: string
}

export const WorkspaceFileVersioning: React.FC<WorkspaceFileVersioningProps> = ({
  fileId,
  fileName,
  workspaceId
}) => {
  const { t } = useUnifiedTranslation()
  const [versions, setVersions] = useState<FileVersion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedVersions, setSelectedVersions] = useState<string[]>([])
  const [conflictResolution, setConflictResolution] = useState('')

  // Mock data for demonstration
  useEffect(() => {
    const mockVersions: FileVersion[] = [
      {
        id: 'v3',
        versionNumber: 3,
        createdAt: '2024-01-15T14:20:00Z',
        createdBy: 'أحمد محمد',
        size: 2048000,
        changeDescription: 'تحديث البيانات المالية وإضافة الرسوم البيانية الجديدة',
        downloadUrl: '/download/v3',
        isCurrent: true
      },
      {
        id: 'v2',
        versionNumber: 2,
        createdAt: '2024-01-14T10:15:00Z', 
        createdBy: 'فاطمة أحمد',
        size: 1987000,
        changeDescription: 'مراجعة المحتوى وتصحيح الأخطاء الإملائية',
        downloadUrl: '/download/v2',
        isCurrent: false,
        hasConflicts: true
      },
      {
        id: 'v1',
        versionNumber: 1,
        createdAt: '2024-01-13T09:00:00Z',
        createdBy: t('mock_data.sample_member_3'), 
        size: 1756000,
        changeDescription: t('workspace.files.version_descriptions.initial_version'),
        downloadUrl: '/download/v1',
        isCurrent: false
      }
    ]
    setVersions(mockVersions)
  }, [fileId])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleRestoreVersion = async (versionId: string) => {
    setIsLoading(true)
    try {
      // Call edge function to restore version
      console.log('Restoring version:', versionId)
      // In real app: await supabase.functions.invoke('workspace-file-processing', { ... })
    } catch (error) {
      console.error('Error restoring version:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompareVersions = () => {
    if (selectedVersions.length === 2) {
      console.log('Comparing versions:', selectedVersions)
      // Open comparison view
    }
  }

  const handleResolveConflict = async (versionId: string) => {
    setIsLoading(true)
    try {
      // Call edge function to resolve conflict
      console.log('Resolving conflict for version:', versionId, 'with resolution:', conflictResolution)
    } catch (error) {
      console.error('Error resolving conflict:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleVersionSelection = (versionId: string) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionId)) {
        return prev.filter(id => id !== versionId)
      } else if (prev.length < 2) {
        return [...prev, versionId]
      } else {
        return [prev[1], versionId]
      }
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            {t('workspace.files.version_history')}
          </CardTitle>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{fileName}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Version Comparison Controls */}
            {selectedVersions.length === 2 && (
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {t('workspace.files.compare_selected_versions')}
                  </span>
                </div>
                <Button onClick={handleCompareVersions} size="sm">
                  {t('workspace.files.compare')}
                </Button>
              </div>
            )}

            {/* Version List */}
            <div className="space-y-3">
              {versions.map((version) => (
                <div key={version.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedVersions.includes(version.id)}
                        onChange={() => toggleVersionSelection(version.id)}
                        className="mt-1"
                        disabled={selectedVersions.length >= 2 && !selectedVersions.includes(version.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">
                            {t('workspace.files.version')} {version.versionNumber}
                          </h4>
                          {version.isCurrent && (
                            <Badge variant="default">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {t('workspace.files.current')}
                            </Badge>
                          )}
                          {version.hasConflicts && (
                            <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {t('workspace.files.has_conflicts')}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {version.createdBy}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(version.createdAt).toLocaleDateString('ar-SA')}
                            </span>
                            <span>{formatFileSize(version.size)}</span>
                          </div>
                          {version.changeDescription && (
                            <p className="text-foreground mt-2">{version.changeDescription}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      {!version.isCurrent && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRestoreVersion(version.id)}
                          disabled={isLoading}
                        >
                          {t('workspace.files.restore')}
                        </Button>
                      )}
                      {version.hasConflicts && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              {t('workspace.files.resolve_conflict')}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{t('workspace.files.resolve_version_conflict')}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="resolution">
                                  {t('workspace.files.conflict_resolution_method')}
                                </Label>
                                <Textarea
                                  id="resolution"
                                  placeholder={t('workspace.files.describe_resolution')}
                                  value={conflictResolution}
                                  onChange={(e) => setConflictResolution(e.target.value)}
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline">
                                  {t('common.cancel')}
                                </Button>
                                <Button 
                                  onClick={() => handleResolveConflict(version.id)}
                                  disabled={isLoading || !conflictResolution.trim()}
                                >
                                  {t('workspace.files.resolve')}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}