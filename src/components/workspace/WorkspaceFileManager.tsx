import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useWorkspaceFileManagement } from '@/hooks/useWorkspaceFileManagement'
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation'
import { 
  Upload, 
  Search, 
  Filter, 
  FileText, 
  Image, 
  Download, 
  Share2,
  MoreVertical,
  Eye,
  Clock,
  Users
} from 'lucide-react'

interface WorkspaceFileManagerProps {
  workspaceId: string
  workspaceType: string
}

interface FileItem {
  id: string
  name: string
  size: number
  type: string
  createdAt: string
  uploadedBy: string
  version: number
  isCollaborating: boolean
  lastModified?: string
  downloadUrl?: string
}

export const WorkspaceFileManager: React.FC<WorkspaceFileManagerProps> = ({
  workspaceId,
  workspaceType
}) => {
  const { t } = useUnifiedTranslation()
  const { uploads, isUploading, uploadFile, processFile, getFilePreview, clearUploads } = useWorkspaceFileManagement()
  
  const [files, setFiles] = useState<FileItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for demonstration - in real app, fetch from API
  useEffect(() => {
    const mockFiles: FileItem[] = [
      {
        id: '1',
        name: t('workspace.files.sample_file_1'),
        size: 2048000,
        type: 'application/pdf',
        createdAt: '2024-01-15T10:30:00Z',
        uploadedBy: t('mock_data.sample_member_1'),
        version: 3,
        isCollaborating: true,
        lastModified: '2024-01-15T14:20:00Z'
      },
      {
        id: '2', 
        name: t('workspace.files.sample_file_2'),
        size: 5120000,
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        createdAt: '2024-01-14T09:15:00Z',
        uploadedBy: t('mock_data.sample_member_2'),
        version: 1,
        isCollaborating: false
      },
      {
        id: '3',
        name: t('workspace.files.sample_file_3'),
        size: 1024000,
        type: 'image/png', 
        createdAt: '2024-01-13T16:45:00Z',
        uploadedBy: t('mock_data.sample_member_3'),
        version: 2,
        isCollaborating: false
      }
    ]
    setFiles(mockFiles)
  }, [workspaceId])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsLoading(true)
    try {
      for (const file of Array.from(files)) {
        await uploadFile(workspaceId, file)
      }
    } catch (error) {
      console.error('File upload error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilePreview = async (file: FileItem) => {
    try {
      const preview = await getFilePreview(workspaceId, file.name)
      console.log('File preview:', preview)
    } catch (error) {
      console.error('Preview error:', error)
    }
  }

  const handleFileProcess = async (fileName: string, action: string) => {
    try {
      await processFile(workspaceId, fileName, action)
    } catch (error) {
      console.error('Process error:', error)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activeTab === 'all' || 
     (activeTab === 'images' && file.type.startsWith('image/')) ||
     (activeTab === 'documents' && !file.type.startsWith('image/')) ||
     (activeTab === 'collaborative' && file.isCollaborating))
  )

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {t('workspace.files.upload_files')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">{t('workspace.files.drag_drop_files')}</p>
              <p className="text-sm text-muted-foreground">{t('workspace.files.or_click_to_browse')}</p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="secondary" className="cursor-pointer" disabled={isLoading}>
                  {isLoading ? t('workspace.files.uploading') : t('workspace.files.select_files')}
                </Button>
              </label>
            </div>
          </div>

          {/* Upload Progress */}
          {uploads.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploads.map((upload) => (
                <div key={upload.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm font-medium">{upload.file.name}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={upload.progress} className="w-24" />
                    <Badge variant={
                      upload.status === 'completed' ? 'default' :
                      upload.status === 'error' ? 'destructive' : 'secondary'
                    }>
                      {t(`workspace.files.status.${upload.status}`)}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={clearUploads}>
                {t('workspace.files.clear_uploads')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('workspace.files.search_files')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {t('workspace.files.filter')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">{t('workspace.files.all_files')}</TabsTrigger>
          <TabsTrigger value="documents">{t('workspace.files.documents')}</TabsTrigger>
          <TabsTrigger value="images">{t('workspace.files.images')}</TabsTrigger>
          <TabsTrigger value="collaborative">{t('workspace.files.collaborative')}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardContent className="p-0">
              {filteredFiles.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4" />
                  <p>{t('workspace.files.no_files_found')}</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredFiles.map((file) => (
                    <div key={file.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {getFileIcon(file.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{file.name}</h4>
                              {file.isCollaborating && (
                                <Badge variant="secondary" className="text-xs">
                                  <Users className="h-3 w-3 mr-1" />
                                  {t('workspace.files.collaborating')}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                v{file.version}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                              <span>{formatFileSize(file.size)}</span>
                              <span>{t('workspace.files.uploaded_by')} {file.uploadedBy}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(file.createdAt).toLocaleDateString(t('locale'))}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleFilePreview(file)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}