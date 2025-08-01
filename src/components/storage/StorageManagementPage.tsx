import { useState, useEffect, useMemo } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/ui/page-header';
import { StorageHero } from './StorageHero';
import { StorageAnalyticsTab } from './StorageAnalyticsTab';
import { UploaderSettingsTab } from './UploaderSettingsTab';
import { FileViewDialog } from './FileViewDialog';
import { BucketManagementDialog } from './BucketManagementDialog';
import { BucketViewDialog } from './BucketViewDialog';
import { StorageFilters, type FilterOptions, type SortOptions } from './StorageFilters';
import { LayoutToggle, LayoutType } from '@/components/ui/layout-toggle';
import { StorageFileCard } from './StorageFileCard';
import { StorageFileTable } from './StorageFileTable';
import { StorageBucketCard } from './StorageBucketCard';
import { EnhancedStorageFileCard } from './EnhancedStorageFileCard';
import { BulkFileActions } from './BulkFileActions';
import { StorageStatsCards } from './StorageStatsCards';
import { ViewLayouts } from '@/components/ui/view-layouts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Database, 
  Files, 
  Upload,
  Download,
  Settings,
  Trash2,
  Eye,
  MoreHorizontal,
  RefreshCw,
  Plus,
  Shield,
  HardDrive,
  Search,
  Filter,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export function StorageManagementPage() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const [selectedBucketForManagement, setSelectedBucketForManagement] = useState<any | null>(null);
  const [selectedBucketForView, setSelectedBucketForView] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [buckets, setBuckets] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showFileViewDialog, setShowFileViewDialog] = useState(false);
  const [showBucketManagementDialog, setShowBucketManagementDialog] = useState(false);
  const [showBucketViewDialog, setShowBucketViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<any | null>(null);
  const [selectedUploadBucket, setSelectedUploadBucket] = useState<string>('');
  const [filesLayout, setFilesLayout] = useState<LayoutType>('cards');
  const [bucketsLayout, setBucketsLayout] = useState<LayoutType>('cards');
  const [storageStats, setStorageStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    usedSpace: 0,
    totalSpace: 100 * 1024 * 1024 * 1024, // 100GB
    publicFiles: 0,
    privateFiles: 0,
    recentUploads: 0,
    buckets: 0
  });

  // Filter and sort state
  const [filters, setFilters] = useState<FilterOptions>({
    fileType: 'all',
    bucket: 'all',
    visibility: 'all',
    sizeRange: 'all',
    dateRange: 'all'
  });

  const [sortBy, setSortBy] = useState<SortOptions>({
    field: 'name',
    direction: 'asc'
  });

  // Bulk selection state
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [activeTab, setActiveTab] = useState("files");

  // Bucket filtering state
  const [bucketSearchTerm, setBucketSearchTerm] = useState('');
  const [bucketFilter, setBucketFilter] = useState('all');
  const [bucketSortBy, setBucketSortBy] = useState('name-asc');

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      setLoading(true);
      
      // Try database function first, fallback to storage API
      let bucketsData = [];
      let bucketError = null;
      
      try {
        const { data: dbBuckets, error: dbError } = await supabase
          .rpc('get_basic_storage_info');
        console.log('Database buckets response:', { dbBuckets, dbError });
        
        if (dbError) {
          console.log('Database function failed, trying storage API...');
          // Fallback to storage API
          const { data: storageB, error: storageE } = await supabase.storage.listBuckets();
          bucketsData = storageB || [];
          bucketError = storageE;
          console.log('Storage API fallback:', { bucketsData, bucketError });
        } else {
          // Convert database response to storage API format
          bucketsData = dbBuckets?.map(bucket => ({
            id: bucket.bucket_id,
            name: bucket.bucket_name,
            public: bucket.public,
            created_at: bucket.created_at
          })) || [];
          console.log('Using database buckets:', bucketsData);
        }
      } catch (error) {
        console.error('Both methods failed, trying direct storage access:', error);
        const { data: storageB, error: storageE } = await supabase.storage.listBuckets();
        bucketsData = storageB || [];
        bucketError = storageE;
        console.log('Final fallback:', { bucketsData, bucketError });
      }
      
      if (bucketsData) {
        console.log('Setting buckets:', bucketsData);
        setBuckets(bucketsData);
        setStorageStats(prev => ({ ...prev, buckets: bucketsData.length }));
      }

      // Load files from all buckets
      let allFiles: any[] = [];
      let totalSize = 0;
      let publicCount = 0;
      let privateCount = 0;

      for (const bucket of bucketsData || []) {
        console.log(`Loading files from bucket: ${bucket.id}`);
        
        // First try listing root level files
        const { data: files, error: filesError } = await supabase.storage.from(bucket.id).list('', {
          limit: 100,
          offset: 0
        });
        console.log(`Files from ${bucket.id}:`, { files, filesError });
        
        if (filesError) {
          console.error(`Error loading files from bucket ${bucket.id}:`, filesError);
          continue; // Skip this bucket and continue with others
        }
        
        if (files) {
          // Process both files and folders
          const processedFiles = [];
          
          for (const item of files) {
            if (item.name && item.metadata) {
              // This is a file
              console.log('Processing file:', item);
              processedFiles.push({
                ...item,
                bucket_id: bucket.id,
                is_public: bucket.public,
                full_path: item.name
              });
            } else if (item.name && !item.metadata) {
              // This might be a folder, let's check inside
              console.log('Found potential folder:', item.name);
              const { data: subFiles, error: subError } = await supabase.storage
                .from(bucket.id)
                .list(item.name, { limit: 100 });
              
              if (subFiles && !subError) {
                console.log(`Files in folder ${item.name}:`, subFiles);
                subFiles.forEach(subFile => {
                  if (subFile.metadata) {
                    processedFiles.push({
                      ...subFile,
                      bucket_id: bucket.id,
                      is_public: bucket.public,
                      name: `${item.name}/${subFile.name}`,
                      full_path: `${item.name}/${subFile.name}`
                    });
                  }
                });
              }
            }
          }
          
          allFiles = [...allFiles, ...processedFiles];

          if (bucket.public) {
            publicCount += processedFiles.length;
          } else {
            privateCount += processedFiles.length;
          }

          // Calculate total size
          processedFiles.forEach(file => {
            if (file.metadata?.size) {
              totalSize += file.metadata.size;
            }
          });
        }
      }

      setFiles(allFiles);
      setStorageStats(prev => ({
        ...prev,
        totalFiles: allFiles.length,
        totalSize,
        usedSpace: totalSize,
        publicFiles: publicCount,
        privateFiles: privateCount,
        recentUploads: Math.floor(allFiles.length * 0.1) // Simulate recent uploads
      }));

    } catch (error) {
      console.error('Error loading storage data:', error);
      toast({
        title: t('common.error'),
        description: t('storage.failed_to_load'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getFileUrl = (file: any): string => {
    if (!file || !file.name) {
      console.log('Invalid file data:', file);
      return '';
    }
    
    if (file.is_public) {
      const { data } = supabase.storage.from(file.bucket_id).getPublicUrl(file.name);
      console.log('Generated public URL:', data.publicUrl, 'for file:', file.name);
      return data.publicUrl;
    } else {
      // For private files, we'll need to generate a signed URL
      return '';
    }
  };

  const handleFileView = async (file: any) => {
    // Generate signed URL for private files or public URL for public files
    if (!file.is_public) {
      try {
        const { data, error } = await supabase.storage
          .from(file.bucket_id)
          .createSignedUrl(file.name, 3600); // 1 hour expiry
        
        if (data && !error) {
          file.signedUrl = data.signedUrl;
        }
      } catch (error) {
        console.error('Error generating signed URL:', error);
      }
    } else {
      const { data } = supabase.storage.from(file.bucket_id).getPublicUrl(file.name);
      file.publicUrl = data.publicUrl;
    }
    
    setSelectedFile(file);
    setShowFileViewDialog(true);
  };

  const handleFileDownload = async (file: any) => {
    try {
      const { data } = await supabase.storage.from(file.bucket_id).download(file.name);
      if (data) {
        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
        
        toast({
          title: t('download_started'),
          description: t('downloading_file', { filename: file.name })
        });
      }
    } catch (error) {
      toast({
        title: t('download_failed'),
        description: t('failed_to_download'),
        variant: 'destructive'
      });
    }
  };

  const handleFileDelete = (file: any) => {
    setFileToDelete(file);
    setShowDeleteDialog(true);
  };

  const confirmFileDelete = async () => {
    if (!fileToDelete) return;
    
    try {
      const { error } = await supabase.storage.from(fileToDelete.bucket_id).remove([fileToDelete.name]);
      if (!error) {
        toast({
          title: t('file_deleted'),
          description: t('file_deleted_successfully', { filename: fileToDelete.name })
        });
        loadStorageData(); // Refresh data
        setShowDeleteDialog(false);
        setFileToDelete(null);
      }
    } catch (error) {
      toast({
        title: t('delete_failed'),
        description: t('failed_to_delete'),
        variant: 'destructive'
      });
    }
  };

  const handleBucketView = (bucket: any) => {
    console.log('handleBucketView called with bucket:', bucket);
    setSelectedBucketForView(bucket);
    setShowBucketViewDialog(true);
  };

  const handleBucketViewFiles = (bucket: any) => {
    console.log('handleBucketViewFiles called with bucket:', bucket);
    
    // Set the bucket filter to show only files from this bucket
    setFilters(prev => {
      const newFilters = { ...prev, bucket: bucket.id };
      console.log('Setting filters:', newFilters);
      return newFilters;
    });
    
    // Switch to files tab using state
    console.log('Switching to files tab...');
    setActiveTab("files");
    
    toast({
      title: "Viewing Bucket Files",
      description: `Showing files from bucket: ${bucket.name}`
    });
  };

  const handleBucketManagement = (bucket: any) => {
    console.log('handleBucketManagement called with bucket:', bucket);
    setSelectedBucketForManagement(bucket);
    setShowBucketManagementDialog(true);
    console.log('Dialog state updated:', { bucket, showDialog: true });
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !selectedUploadBucket) {
      toast({
        title: "Upload Error",
        description: "Please select files and a bucket",
        variant: 'destructive'
      });
      return;
    }

    const uploadPromises = Array.from(files).map(async (file) => {
      const { error } = await supabase.storage
        .from(selectedUploadBucket)
        .upload(file.name, file);
      
      if (error) throw error;
      return file.name;
    });

    try {
      await Promise.all(uploadPromises);
      toast({
        title: "Upload Successful",
        description: `${files.length} file(s) uploaded successfully`
      });
      setShowUploadDialog(false);
      loadStorageData();
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "One or more files failed to upload",
        variant: 'destructive'
      });
    }
  };

  // Filter and sort logic
  const getFileType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) return 'image';
    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension || '')) return 'document';
    if (['mp4', 'avi', 'mov', 'webm', 'mkv'].includes(extension || '')) return 'video';
    if (['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(extension || '')) return 'audio';
    return 'other';
  };

  const getFileSizeCategory = (size: number): string => {
    const mb = size / (1024 * 1024);
    if (mb < 1) return 'small';
    if (mb <= 10) return 'medium';
    return 'large';
  };

  const isWithinDateRange = (fileDate: string, range: string): boolean => {
    const date = new Date(fileDate);
    const now = new Date();
    
    switch (range) {
      case 'today':
        return date.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return date >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return date >= monthAgo;
      case 'year':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        return date >= yearAgo;
      default:
        return true;
    }
  };

  const filteredAndSortedFiles = useMemo(() => {
    let filtered = files.filter(file => {
      // Search filter
      if (searchTerm && !file.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // File type filter
      if (filters.fileType && filters.fileType !== 'all' && getFileType(file.name) !== filters.fileType) {
        return false;
      }

      // Bucket filter
      if (filters.bucket && filters.bucket !== 'all' && file.bucket_id !== filters.bucket) {
        return false;
      }

      // Visibility filter
      if (filters.visibility && filters.visibility !== 'all') {
        const isPublic = file.is_public;
        if (filters.visibility === 'public' && !isPublic) return false;
        if (filters.visibility === 'private' && isPublic) return false;
      }

      // Size filter
      if (filters.sizeRange && filters.sizeRange !== 'all' && file.metadata?.size) {
        const sizeCategory = getFileSizeCategory(file.metadata.size);
        if (sizeCategory !== filters.sizeRange) return false;
      }

      // Date filter
      if (filters.dateRange && filters.dateRange !== 'all' && file.created_at) {
        if (!isWithinDateRange(file.created_at, filters.dateRange)) return false;
      }

      return true;
    });

    // Sort files
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy.field) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'size':
          aValue = a.metadata?.size || 0;
          bValue = b.metadata?.size || 0;
          break;
        case 'date':
          aValue = new Date(a.updated_at || a.created_at || 0).getTime();
          bValue = new Date(b.updated_at || b.created_at || 0).getTime();
          break;
        case 'type':
          aValue = getFileType(a.name);
          bValue = getFileType(b.name);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortBy.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortBy.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [files, searchTerm, filters, sortBy]);

  // Bucket filtering and sorting logic
  const filteredAndSortedBuckets = useMemo(() => {
    let filtered = buckets.filter(bucket => {
      // Search filter
      if (bucketSearchTerm && !bucket.id.toLowerCase().includes(bucketSearchTerm.toLowerCase())) {
        return false;
      }

      // Type filter
      if (bucketFilter && bucketFilter !== 'all') {
        switch (bucketFilter) {
          case 'public':
            if (!bucket.public) return false;
            break;
          case 'private':
            if (bucket.public) return false;
            break;
          case 'empty':
            // Count files in this bucket
            const bucketFiles = files.filter(file => file.bucket_id === bucket.id);
            if (bucketFiles.length > 0) return false;
            break;
          case 'large':
            // Calculate bucket size
            const bucketSize = files
              .filter(file => file.bucket_id === bucket.id)
              .reduce((total, file) => total + (file.metadata?.size || 0), 0);
            if (bucketSize <= 100 * 1024 * 1024) return false; // 100MB
            break;
        }
      }

      return true;
    });

    // Sort buckets
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (bucketSortBy) {
        case 'name-asc':
          return a.id.localeCompare(b.id);
        case 'name-desc':
          return b.id.localeCompare(a.id);
        case 'created-newest':
          aValue = new Date(a.created_at || 0).getTime();
          bValue = new Date(b.created_at || 0).getTime();
          return bValue - aValue;
        case 'created-oldest':
          aValue = new Date(a.created_at || 0).getTime();
          bValue = new Date(b.created_at || 0).getTime();
          return aValue - bValue;
        case 'size-largest':
          aValue = files.filter(f => f.bucket_id === a.id).reduce((total, f) => total + (f.metadata?.size || 0), 0);
          bValue = files.filter(f => f.bucket_id === b.id).reduce((total, f) => total + (f.metadata?.size || 0), 0);
          return bValue - aValue;
        case 'size-smallest':
          aValue = files.filter(f => f.bucket_id === a.id).reduce((total, f) => total + (f.metadata?.size || 0), 0);
          bValue = files.filter(f => f.bucket_id === b.id).reduce((total, f) => total + (f.metadata?.size || 0), 0);
          return aValue - bValue;
        case 'files-most':
          aValue = files.filter(f => f.bucket_id === a.id).length;
          bValue = files.filter(f => f.bucket_id === b.id).length;
          return bValue - aValue;
        case 'files-least':
          aValue = files.filter(f => f.bucket_id === a.id).length;
          bValue = files.filter(f => f.bucket_id === b.id).length;
          return aValue - bValue;
        default:
          return 0;
      }
    });

    return filtered;
  }, [buckets, files, bucketSearchTerm, bucketFilter, bucketSortBy]);

  const getActiveFilterCount = (): number => {
    return Object.values(filters).filter(value => value !== 'all').length;
  };

  const handleClearFilters = () => {
    setFilters({
      fileType: 'all',
      bucket: 'all',
      visibility: 'all',
      sizeRange: 'all',
      dateRange: 'all'
    });
  };

  // Bulk file selection handlers
  const handleFileSelection = (file: any, selected: boolean) => {
    if (selected) {
      setSelectedFiles(prev => [...prev, file]);
    } else {
      setSelectedFiles(prev => prev.filter(f => f !== file));
    }
  };

  const handleBulkSelectionChange = (files: any[]) => {
    setSelectedFiles(files);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title={t('storage.title')}
        description={t('storage.description')}
        actionButton={{
          label: t('storage.upload_files'),
          icon: <Upload className="w-4 h-4" />,
          onClick: () => setShowUploadDialog(true)
        }}
      />

      <div className="space-y-6">
        {/* Enhanced Hero Dashboard */}
        <StorageHero 
          totalFiles={storageStats.totalFiles}
          totalSize={storageStats.totalSize}
          usedSpace={storageStats.usedSpace}
          totalSpace={storageStats.totalSpace}
          publicFiles={storageStats.publicFiles}
          privateFiles={storageStats.privateFiles}
          recentUploads={storageStats.recentUploads}
          buckets={storageStats.buckets}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="files">{t('storage.files')}</TabsTrigger>
            <TabsTrigger value="buckets">{t('storage.buckets')}</TabsTrigger>
            <TabsTrigger value="settings">Uploader Settings</TabsTrigger>
            <TabsTrigger value="analytics">{t('storage.analytics')}</TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="space-y-6">
            {/* Enhanced Stats Cards */}
            <StorageStatsCards stats={storageStats} files={filteredAndSortedFiles} />

            {/* Header with layout toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold">{t('storage.files')}</h3>
                <p className="text-sm text-muted-foreground">
                  {filteredAndSortedFiles.length} {t('storage.files_found')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className={showBulkActions ? 'bg-primary text-primary-foreground' : ''}
                >
                  {showBulkActions ? 'Exit Selection' : 'Select Files'}
                </Button>
                <LayoutToggle
                  currentLayout={filesLayout}
                  onLayoutChange={setFilesLayout}
                />
              </div>
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={t('storage.search_files')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => loadStorageData()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('common.refresh')}
              </Button>
            </div>

            {/* Filter and Sort Controls */}
            <StorageFilters
              buckets={buckets}
              filters={filters}
              sortBy={sortBy}
              onFiltersChange={setFilters}
              onSortChange={setSortBy}
              onClearFilters={handleClearFilters}
              activeFilterCount={getActiveFilterCount()}
            />

            {/* Bulk Actions */}
            {showBulkActions && (
              <BulkFileActions
                selectedFiles={selectedFiles}
                onSelectionChange={handleBulkSelectionChange}
                onFilesUpdated={loadStorageData}
                buckets={buckets}
                allFiles={filteredAndSortedFiles}
              />
            )}

            {/* Files Display */}
            {filteredAndSortedFiles.length === 0 ? (
              <div className="text-center py-12">
                <Files className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No files found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || getActiveFilterCount() > 0 
                    ? 'Try adjusting your search or filters' 
                    : 'Upload some files to get started'}
                </p>
                {!searchTerm && getActiveFilterCount() === 0 && (
                  <Button onClick={() => setShowUploadDialog(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </Button>
                )}
              </div>
            ) : filesLayout === 'table' ? (
              <StorageFileTable
                files={filteredAndSortedFiles}
                onView={handleFileView}
                onDownload={handleFileDownload}
                onDelete={handleFileDelete}
              />
            ) : (
              <ViewLayouts viewMode={filesLayout}>
                {filteredAndSortedFiles.map((file) => (
                  <EnhancedStorageFileCard
                    key={`${file.bucket_id}-${file.name}`}
                    file={file}
                    onView={handleFileView}
                    onDownload={handleFileDownload}
                    onDelete={handleFileDelete}
                    isSelected={selectedFiles.some(f => f.name === file.name && f.bucket_id === file.bucket_id)}
                    onSelectionChange={handleFileSelection}
                    showSelection={showBulkActions}
                  />
                ))}
              </ViewLayouts>
            )}
          </TabsContent>

          <TabsContent value="buckets" className="space-y-6">
            {/* Header with layout toggle and controls */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{t('storage.buckets')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {filteredAndSortedBuckets.length} of {buckets.length} {t('storage.buckets_found')}
                  </p>
                </div>
                <LayoutToggle
                  currentLayout={bucketsLayout}
                  onLayoutChange={setBucketsLayout}
                />
              </div>

              {/* Search, Filter, and Sort Controls */}
              <div className="flex flex-col lg:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search buckets by name..."
                      value={bucketSearchTerm}
                      onChange={(e) => setBucketSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                {/* Filter by Type */}
                <Select value={bucketFilter} onValueChange={setBucketFilter}>
                  <SelectTrigger className="w-full lg:w-[200px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Buckets</SelectItem>
                    <SelectItem value="public">Public Only</SelectItem>
                    <SelectItem value="private">Private Only</SelectItem>
                    <SelectItem value="empty">Empty Buckets</SelectItem>
                    <SelectItem value="large">Large Buckets (>100MB)</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort Options */}
                <Select value={bucketSortBy} onValueChange={setBucketSortBy}>
                  <SelectTrigger className="w-full lg:w-[200px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                    <SelectItem value="name-desc">Name Z-A</SelectItem>
                    <SelectItem value="created-newest">Newest First</SelectItem>
                    <SelectItem value="created-oldest">Oldest First</SelectItem>
                    <SelectItem value="size-largest">Largest First</SelectItem>
                    <SelectItem value="size-smallest">Smallest First</SelectItem>
                    <SelectItem value="files-most">Most Files</SelectItem>
                    <SelectItem value="files-least">Least Files</SelectItem>
                  </SelectContent>
                </Select>

                {/* Clear Filters */}
                {(bucketSearchTerm || bucketFilter !== 'all' || bucketSortBy !== 'name-asc') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setBucketSearchTerm('')
                      setBucketFilter('all')
                      setBucketSortBy('name-asc')
                    }}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Buckets Display */}
            <ViewLayouts viewMode={bucketsLayout}>
              {filteredAndSortedBuckets.map((bucket) => (
                <StorageBucketCard
                  key={bucket.id}
                  bucket={bucket}
                  onView={handleBucketView}
                  onSettings={handleBucketManagement}
                  onDelete={() => {}} // TODO: Implement bucket delete
                />
              ))}
            </ViewLayouts>

            {/* Empty State */}
            {filteredAndSortedBuckets.length === 0 && buckets.length > 0 && (
              <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No buckets found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <UploaderSettingsTab />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <StorageAnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('upload_files')}</DialogTitle>
            <DialogDescription>
              {t('select_files_to_upload')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bucket-select">{t('select_bucket')}</Label>
              <Select value={selectedUploadBucket} onValueChange={setSelectedUploadBucket}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={t('choose_bucket')} />
                </SelectTrigger>
                <SelectContent>
                  {buckets.map((bucket) => (
                    <SelectItem key={bucket.id} value={bucket.id}>
                      {bucket.name} ({bucket.public ? 'Public' : 'Private'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="file-upload">{t('choose_files')}</Label>
              <Input 
                id="file-upload" 
                type="file" 
                multiple 
                className="mt-2"
                onChange={(e) => {
                  // Store files for upload
                  if (e.target.files) {
                    setSelectedUploadBucket(selectedUploadBucket);
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                {t('cancel')}
              </Button>
              <Button 
                onClick={() => {
                  const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                  if (fileInput?.files) {
                    handleFileUpload(fileInput.files);
                  }
                }}
                disabled={!selectedUploadBucket}
              >
                <Upload className="w-4 h-4 mr-2" />
                {t('upload')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* File View Dialog */}
      <FileViewDialog
        file={selectedFile}
        open={showFileViewDialog}
        onOpenChange={setShowFileViewDialog}
      />

      {/* Bucket Management Dialog */}
      <BucketManagementDialog
        bucket={selectedBucketForManagement}
        open={showBucketManagementDialog}
        onOpenChange={setShowBucketManagementDialog}
        onRefresh={loadStorageData}
      />

      {/* Bucket View Dialog */}
      <BucketViewDialog
        bucket={selectedBucketForView}
        open={showBucketViewDialog}
        onOpenChange={setShowBucketViewDialog}
        onViewFiles={handleBucketViewFiles}
        onOpenSettings={handleBucketManagement}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{fileToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setFileToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmFileDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
}