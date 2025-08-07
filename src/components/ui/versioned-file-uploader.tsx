import React, { useState, useEffect } from 'react'
import { useSettingsManager } from '@/hooks/useSettingsManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { logger } from '@/utils/logger'
import { 
  Upload, 
  Download, 
  History, 
  RotateCcw, 
  Plus,
  FileText,
  Calendar,
  User
} from 'lucide-react'

interface FileVersion {
  id: string
  version_number: number
  file_path: string
  file_size: number
  mime_type: string
  version_notes: string | null
  created_by: string
  created_at: string
  is_current: boolean
  replaced_version_id: string | null
}

interface VersionedFileUploaderProps {
  fileRecordId: string
  onVersionCreated?: (versionId: string) => void
  className?: string
}

export const VersionedFileUploader: React.FC<VersionedFileUploaderProps> = ({
  fileRecordId,
  onVersionCreated,
  className
}) => {
  const [versions, setVersions] = useState<FileVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [restoreLoading, setRestoreLoading] = useState<string | null>(null)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [versionNotes, setVersionNotes] = useState('')
  const { toast } = useToast()

  const fetchVersions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('file_versions')
        .select('*')
        .eq('file_record_id', fileRecordId)
        .order('version_number', { ascending: false })

      if (error) throw error
      setVersions(data || [])
    } catch (error) {
      logger.error('Error fetching file versions', { component: 'VersionedFileUploader', action: 'fetchVersions', fileRecordId }, error as Error)
      toast({
        title: 'Error',
        description: 'Failed to fetch file versions',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const createNewVersion = async () => {
    if (!selectedFile) {
      toast({
        title: 'Error',
        description: 'Please select a file',
        variant: 'destructive'
      })
      return
    }

    try {
      setUploadLoading(true)

      // First upload the file to storage
      const fileName = `${fileRecordId}_v${Date.now()}_${selectedFile.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('file-versions')
        .upload(`versions/${fileName}`, selectedFile)

      if (uploadError) throw uploadError

      // Create the version record using the database function
      const { data: versionId, error: versionError } = await supabase.rpc('create_file_version', {
        p_file_record_id: fileRecordId,
        p_file_path: uploadData.path,
        p_file_size: selectedFile.size,
        p_mime_type: selectedFile.type,
        p_version_notes: versionNotes || null
      })

      if (versionError) throw versionError

      toast({
        title: 'Success',
        description: 'New file version created successfully'
      })

      // Reset form and refresh versions
      setSelectedFile(null)
      setVersionNotes('')
      setIsUploadDialogOpen(false)
      await fetchVersions()

      if (onVersionCreated) {
        onVersionCreated(versionId)
      }
    } catch (error) {
      logger.error('Error creating version', { component: 'VersionedFileUploader', action: 'createNewVersion', fileRecordId }, error as Error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create new version',
        variant: 'destructive'
      })
    } finally {
      setUploadLoading(false)
    }
  }

  const restoreVersion = async (versionId: string, versionNumber: number) => {
    try {
      setRestoreLoading(versionId)

      const { data, error } = await supabase.rpc('restore_file_version', {
        p_version_id: versionId
      })

      if (error) throw error

      toast({
        title: 'Success',
        description: `Version ${versionNumber} restored successfully`
      })

      await fetchVersions()
    } catch (error) {
      logger.error('Error restoring version', { component: 'VersionedFileUploader', action: 'restoreVersion', versionId }, error as Error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to restore version',
        variant: 'destructive'
      })
    } finally {
      setRestoreLoading(null)
    }
  }

  const downloadVersion = (version: FileVersion) => {
    const { data } = supabase.storage
      .from('file-versions')
      .getPublicUrl(version.file_path)
    
    window.open(data.publicUrl, '_blank')
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const { getSettingValue } = useSettingsManager();
    const sizes = getSettingValue('file_size_units_standard', ['Bytes', 'KB', 'MB', 'GB']) as string[];
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    fetchVersions()
  }, [fileRecordId])

  const currentVersion = versions.find(v => v.is_current)

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              File Versions
            </CardTitle>
            <CardDescription>
              Manage different versions of this file
            </CardDescription>
          </div>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Version
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Version</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file">Select File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileSelect}
                    accept="*/*"
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="notes">Version Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={versionNotes}
                    onChange={(e) => setVersionNotes(e.target.value)}
                    placeholder="Describe what changed in this version..."
                    rows={3}
                  />
                </div>
                <Button 
                  onClick={createNewVersion} 
                  disabled={!selectedFile || uploadLoading}
                  className="w-full"
                >
                  {uploadLoading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-pulse" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Version
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No versions available
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current Version Highlight */}
            {currentVersion && (
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="default">Current Version</Badge>
                    <span className="text-sm text-muted-foreground">
                      v{currentVersion.version_number}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {formatFileSize(currentVersion.file_size)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(currentVersion.created_at)}
                    </div>
                  </div>
                  {currentVersion.version_notes && (
                    <p className="text-sm text-muted-foreground">
                      {currentVersion.version_notes}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => downloadVersion(currentVersion)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Previous Versions */}
            {versions.filter(v => !v.is_current).length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-3">Previous Versions</h4>
                  <div className="space-y-3">
                    {versions
                      .filter(v => !v.is_current)
                      .map((version) => (
                        <Card key={version.id} className="border-muted">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">
                                    v{version.version_number}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {formatFileSize(version.file_size)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(version.created_at)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {version.created_by}
                                  </div>
                                </div>
                                {version.version_notes && (
                                  <p className="text-sm text-muted-foreground">
                                    {version.version_notes}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => downloadVersion(version)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => restoreVersion(version.id, version.version_number)}
                                  disabled={restoreLoading === version.id}
                                >
                                  {restoreLoading === version.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                  ) : (
                                    <RotateCcw className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}