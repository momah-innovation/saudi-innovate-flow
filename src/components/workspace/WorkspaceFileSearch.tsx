import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation'
import { 
  Search, 
  Filter, 
  Calendar, 
  FileText, 
  Image, 
  Video,
  Download,
  User,
  Clock,
  X,
  SortAsc,
  SortDesc
} from 'lucide-react'

interface SearchFilters {
  fileTypes: string[]
  uploadDateRange: {
    start: string
    end: string
  }
  sizeRange: {
    min: number
    max: number
  }
  uploadedBy: string[]
  tags: string[]
  hasCollaboration: boolean
}

interface FileSearchResult {
  id: string
  name: string
  type: string
  size: number
  uploadedBy: string
  uploadedAt: string
  tags: string[]
  version: number
  isCollaborating: boolean
  downloadUrl: string
  thumbnailUrl?: string
}

interface WorkspaceFileSearchProps {
  workspaceId: string
  onFileSelect?: (file: FileSearchResult) => void
}

export const WorkspaceFileSearch: React.FC<WorkspaceFileSearchProps> = ({
  workspaceId,
  onFileSelect
}) => {
  const { t } = useUnifiedTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isLoading, setIsLoading] = useState(false)
  
  const [filters, setFilters] = useState<SearchFilters>({
    fileTypes: [],
    uploadDateRange: { start: '', end: '' },
    sizeRange: { min: 0, max: 100 },
    uploadedBy: [],
    tags: [],
    hasCollaboration: false
  })

  // Mock search results
  const [searchResults, setSearchResults] = useState<FileSearchResult[]>([
    {
      id: '1',
      name: t('workspace.files.sample_search_file_1'),
      type: 'application/pdf',
      size: 2048000,
      uploadedBy: t('mock_data.sample_member_1'),
      uploadedAt: '2024-01-15T10:30:00Z',
      tags: [t('workspace.files.tags.report'), t('workspace.files.tags.project'), t('workspace.files.tags.final')],
      version: 3,
      isCollaborating: true,
      downloadUrl: '/download/1'
    },
    {
      id: '2',
      name: t('workspace.files.sample_search_file_2'),
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      size: 5120000,
      uploadedBy: 'فاطمة أحمد',
      uploadedAt: '2024-01-14T09:15:00Z',
      tags: ['عرض', 'عملاء', 'تقديمي'],
      version: 2,
      isCollaborating: false,
      downloadUrl: '/download/2'
    },
    {
      id: '3',
      name: 'مخطط المشروع.png',
      type: 'image/png',
      size: 1024000,
      uploadedBy: 'سارة علي',
      uploadedAt: '2024-01-13T16:45:00Z',
      tags: ['مخطط', 'تصميم', 'مشروع'],
      version: 1,
      isCollaborating: true,
      downloadUrl: '/download/3',
      thumbnailUrl: '/thumbnails/3'
    }
  ])

  const fileTypeOptions = [
    { value: 'application/pdf', label: 'PDF', icon: FileText },
    { value: 'image/', label: t('workspace.files.images'), icon: Image },
    { value: 'video/', label: t('workspace.files.videos'), icon: Video },
    { value: 'application/vnd.openxml', label: 'Office', icon: FileText }
  ]

  const availableTags = [t('workspace.files.tags.report'), t('workspace.files.tags.project'), t('workspace.files.tags.final'), t('workspace.files.tags.presentation'), t('workspace.files.tags.clients'), t('workspace.files.tags.design')]
  const availableUsers = [t('mock_data.sample_member_1'), t('mock_data.sample_member_2'), t('mock_data.sample_member_3'), t('mock_data.sample_member_4')]

  // Filter and sort results
  const filteredResults = useMemo(() => {
    let results = searchResults.filter(file => {
      // Text search
      const matchesSearch = searchTerm === '' || 
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      // File type filter
      const matchesFileType = filters.fileTypes.length === 0 ||
        filters.fileTypes.some(type => file.type.startsWith(type))

      // Uploaded by filter
      const matchesUploadedBy = filters.uploadedBy.length === 0 ||
        filters.uploadedBy.includes(file.uploadedBy)

      // Tags filter
      const matchesTags = filters.tags.length === 0 ||
        filters.tags.some(tag => file.tags.includes(tag))

      // Collaboration filter
      const matchesCollaboration = !filters.hasCollaboration || file.isCollaborating

      // Date range filter
      const matchesDateRange = (!filters.uploadDateRange.start || file.uploadedAt >= filters.uploadDateRange.start) &&
        (!filters.uploadDateRange.end || file.uploadedAt <= filters.uploadDateRange.end)

      // Size range filter (MB)
      const fileSizeMB = file.size / (1024 * 1024)
      const matchesSizeRange = fileSizeMB >= filters.sizeRange.min && fileSizeMB <= filters.sizeRange.max

      return matchesSearch && matchesFileType && matchesUploadedBy && 
             matchesTags && matchesCollaboration && matchesDateRange && matchesSizeRange
    })

    // Sort results
    results.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'ar')
          break
        case 'date':
          comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
          break
        case 'size':
          comparison = a.size - b.size
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return results
  }, [searchResults, searchTerm, filters, sortBy, sortOrder])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />
    if (type.startsWith('video/')) return <Video className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  const clearFilters = () => {
    setFilters({
      fileTypes: [],
      uploadDateRange: { start: '', end: '' },
      sizeRange: { min: 0, max: 100 },
      uploadedBy: [],
      tags: [],
      hasCollaboration: false
    })
  }

  const activeFilterCount = 
    filters.fileTypes.length + 
    filters.uploadedBy.length + 
    filters.tags.length +
    (filters.uploadDateRange.start ? 1 : 0) +
    (filters.uploadDateRange.end ? 1 : 0) +
    (filters.hasCollaboration ? 1 : 0)

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {t('workspace.files.search_files')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Main Search */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('workspace.files.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <Filter className="h-4 w-4 mr-2" />
                {t('workspace.files.filters')}
                {activeFilterCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label>{t('workspace.files.sort_by')}:</Label>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">{t('workspace.files.date')}</SelectItem>
                    <SelectItem value="name">{t('workspace.files.name')}</SelectItem>
                    <SelectItem value="size">{t('workspace.files.size')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {filteredResults.length} {t('workspace.files.files_found')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{t('workspace.files.advanced_filters')}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  {t('workspace.files.clear_filters')}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Types */}
            <div>
              <Label className="text-base font-medium">{t('workspace.files.file_types')}</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {fileTypeOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={filters.fileTypes.includes(option.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters(prev => ({
                            ...prev,
                            fileTypes: [...prev.fileTypes, option.value]
                          }))
                        } else {
                          setFilters(prev => ({
                            ...prev,
                            fileTypes: prev.fileTypes.filter(type => type !== option.value)
                          }))
                        }
                      }}
                    />
                    <Label htmlFor={option.value} className="flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Upload Date Range */}
            <div>
              <Label className="text-base font-medium">{t('workspace.files.upload_date_range')}</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="start-date">{t('workspace.files.start_date')}</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={filters.uploadDateRange.start}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      uploadDateRange: { ...prev.uploadDateRange, start: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">{t('workspace.files.end_date')}</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={filters.uploadDateRange.end}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      uploadDateRange: { ...prev.uploadDateRange, end: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Uploaded By */}
            <div>
              <Label className="text-base font-medium">{t('workspace.files.uploaded_by')}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {availableUsers.map(user => (
                  <div key={user} className="flex items-center space-x-2">
                    <Checkbox
                      id={user}
                      checked={filters.uploadedBy.includes(user)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters(prev => ({
                            ...prev,
                            uploadedBy: [...prev.uploadedBy, user]
                          }))
                        } else {
                          setFilters(prev => ({
                            ...prev,
                            uploadedBy: prev.uploadedBy.filter(u => u !== user)
                          }))
                        }
                      }}
                    />
                    <Label htmlFor={user} className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {user}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Tags */}
            <div>
              <Label className="text-base font-medium">{t('workspace.files.tags')}</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (filters.tags.includes(tag)) {
                        setFilters(prev => ({
                          ...prev,
                          tags: prev.tags.filter(t => t !== tag)
                        }))
                      } else {
                        setFilters(prev => ({
                          ...prev,
                          tags: [...prev.tags, tag]
                        }))
                      }
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Collaboration Filter */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="collaboration"
                checked={filters.hasCollaboration}
                onCheckedChange={(checked) => setFilters(prev => ({
                  ...prev,
                  hasCollaboration: !!checked
                }))}
              />
              <Label htmlFor="collaboration">{t('workspace.files.show_collaborative_only')}</Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>{t('workspace.files.searching')}</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4" />
              <p>{t('workspace.files.no_results_found')}</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredResults.map((file) => (
                <div 
                  key={file.id} 
                  className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => onFileSelect?.(file)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {file.thumbnailUrl ? (
                          <img src={file.thumbnailUrl} alt="" className="h-10 w-10 rounded object-cover" />
                        ) : (
                          getFileIcon(file.type)
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{file.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            v{file.version}
                          </Badge>
                          {file.isCollaborating && (
                            <Badge variant="secondary" className="text-xs">
                              {t('workspace.files.collaborating')}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span>{formatFileSize(file.size)}</span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {file.uploadedBy}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(file.uploadedAt).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                        <div className="flex gap-1 mt-2">
                          {file.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}