import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/ui/page-header';
import { StorageHero } from './StorageHero';
import { StorageAnalyticsDashboard } from '@/components/admin/StorageAnalyticsDashboard';
import { StorageQuotaManager } from '@/components/admin/StorageQuotaManager';
import { UploaderSettingsTab } from './UploaderSettingsTab';
import { FixedStorageUploadTab } from './FixedStorageUploadTab';

import { useFileUploader } from '@/hooks/useFileUploader';
import { useStorageAnalytics } from '@/hooks/useStorageAnalytics';
import { useStorageQuotas } from '@/hooks/useStorageQuotas';
import { useUploaderSettingsContext } from '@/contexts/UploaderSettingsContext';
import { FileViewDialog } from './FileViewDialog';
import { BucketManagementDialog } from './BucketManagementDialog';
import { BucketViewDialog } from './BucketViewDialog';

import { StorageFilters, type FilterOptions, type SortOptions } from './StorageFilters';
import { LayoutToggle, LayoutType } from '@/components/ui/layout-toggle';
import { StorageFileCard } from './StorageFileCard';
import { StorageFileTable } from './StorageFileTable';
import { StorageBucketCard } from './StorageBucketCard';
import { BulkFileActions } from './BulkFileActions';
import { StorageStatsCards } from './StorageStatsCards';
import { RTLAware, useRTLAwareClasses } from '@/components/ui/rtl-aware';
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
import { useTranslation } from '@/hooks/useAppTranslation';

export function StorageManagementPage() {
  const { toast } = useToast();
  const { t, language, isRTL } = useTranslation();
  const rtlClasses = useRTLAwareClasses();
  const { uploadFiles, isUploading, getFileUrl: getUploaderFileUrl } = useFileUploader();
  const { analytics, loading: analyticsLoading, refreshAnalytics } = useStorageAnalytics();
  const { quotas, loading: quotasLoading, refreshQuotas } = useStorageQuotas();
  const { uploadConfigs = {}, globalSettings = {
    autoCleanupEnabled: false,
    defaultCleanupDays: 7,
    maxConcurrentUploads: 3,
    chunkSizeMB: 5,
    retryAttempts: 3,
    compressionEnabled: false,
    thumbnailGeneration: false
  }, loading: settingsLoading } = useUploaderSettingsContext();
  
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const [selectedBucketForManagement, setSelectedBucketForManagement] = useState<any | null>(null);
  const [selectedBucketForView, setSelectedBucketForView] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [buckets, setBuckets] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFileViewDialog, setShowFileViewDialog] = useState(false);
  const [showBucketManagementDialog, setShowBucketManagementDialog] = useState(false);
  const [showBucketViewDialog, setShowBucketViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<any | null>(null);
  const [filesLayout, setFilesLayout] = useState<LayoutType>('cards');
  const [bucketsLayout, setBucketsLayout] = useState<LayoutType>('grid');
  const [activeTab, setActiveTab] = useState("overview");

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

  // Helper functions for filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.fileType !== 'all') count++;
    if (filters.bucket !== 'all') count++;
    if (filters.visibility !== 'all') count++;
    if (filters.sizeRange !== 'all') count++;
    if (filters.dateRange !== 'all') count++;
    return count;
  };

  const clearAllFilters = () => {
    setFilters({
      fileType: 'all',
      bucket: 'all',
      visibility: 'all',
      sizeRange: 'all',
      dateRange: 'all'
    });
  };

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      setLoading(true);
      
      // Try database function first, fallback to storage API
      let bucketsData = [];
      
      try {
        const { data: dbBuckets, error: dbError } = await supabase
          .rpc('get_basic_storage_info');
        
        if (dbError) {
          // Fallback to storage API
          const { data: storageB, error: storageE } = await supabase.storage.listBuckets();
          bucketsData = storageB || [];
        } else {
          // Convert database response to storage API format
          bucketsData = dbBuckets?.map(bucket => ({
            id: bucket.bucket_id,
            name: bucket.bucket_name,
            public: bucket.public,
            created_at: bucket.created_at
          })) || [];
        }
      } catch (error) {
        console.error('Error loading buckets:', error);
        const { data: storageB } = await supabase.storage.listBuckets();
        bucketsData = storageB || [];
      }
      
      setBuckets(bucketsData);

      // Load files from all buckets
      let allFiles: any[] = [];

      for (const bucket of bucketsData || []) {
        const { data: files, error: filesError } = await supabase.storage.from(bucket.id).list('', {
          limit: 100,
          offset: 0
        });
        
        if (filesError) {
          console.error(`Error loading files from bucket ${bucket.id}:`, filesError);
          continue;
        }
        
        if (files) {
          const processedFiles = files
            .filter(item => item.metadata) // Only files, not folders
            .map(file => ({
              ...file,
              bucket_id: bucket.id,
              is_public: bucket.public,
              full_path: file.name
            }));
          
          allFiles = [...allFiles, ...processedFiles];
        }
      }

      setFiles(allFiles);

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

  const handleFileView = async (file: any) => {
    if (!file.is_public) {
      try {
        const { data, error } = await supabase.storage
          .from(file.bucket_id)
          .createSignedUrl(file.name, 3600);
        
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
        loadStorageData();
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

  // Filter files based on current filters
  const filteredFiles = files.filter(file => {
    if (searchTerm && !file.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filters.bucket && filters.bucket !== 'all' && file.bucket_id !== filters.bucket) {
      return false;
    }
    return true;
  });

  return (
    <PageLayout>
      <div className={`space-y-6 ${isRTL ? 'font-arabic' : 'font-english'}`}>
        <PageHeader 
          title={t('storage.storage_management')}
          description={t('storage.manage_files_and_buckets')}
        />

        <StorageHero 
          totalFiles={files.length}
          totalSize={files.reduce((acc, file) => acc + (file.metadata?.size || 0), 0)}
          usedSpace={files.reduce((acc, file) => acc + (file.metadata?.size || 0), 0)}
          totalSpace={100 * 1024 * 1024 * 1024}
          publicFiles={files.filter(f => f.is_public).length}
          privateFiles={files.filter(f => !f.is_public).length}
          recentUploads={Math.floor(files.length * 0.1)}
          buckets={buckets.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">{t('storage.overview')}</TabsTrigger>
            <TabsTrigger value="files">{t('storage.files')}</TabsTrigger>
            <TabsTrigger value="buckets">{t('storage.buckets')}</TabsTrigger>
            <TabsTrigger value="analytics">{t('storage.analytics')}</TabsTrigger>
            <TabsTrigger value="quotas">{t('storage.quotas')}</TabsTrigger>
            <TabsTrigger value="upload">{t('storage.upload')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <StorageStatsCards 
              stats={{
                totalFiles: files.length,
                totalSize: files.reduce((acc, file) => acc + (file.metadata?.size || 0), 0),
                usedSpace: files.reduce((acc, file) => acc + (file.metadata?.size || 0), 0),
                totalSpace: 100 * 1024 * 1024 * 1024,
                publicFiles: files.filter(f => f.is_public).length,
                privateFiles: files.filter(f => !f.is_public).length,
                recentUploads: Math.floor(files.length * 0.1),
                buckets: buckets.length
              }}
              files={files}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Files className="h-5 w-5" />
                    {t('storage.recent_files')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {files.slice(0, 5).map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded border">
                        <div className="flex items-center gap-3">
                          <Files className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.bucket_id}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {file.metadata?.size ? `${(file.metadata.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    {t('storage.storage_buckets')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {buckets.slice(0, 5).map((bucket, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded border">
                        <div className="flex items-center gap-3">
                          <Database className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">{bucket.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {bucket.public ? t('storage.public') : t('storage.private')}
                            </p>
                          </div>
                        </div>
                        <Badge variant={bucket.public ? "default" : "secondary"}>
                          {bucket.public ? t('storage.public') : t('storage.private')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={t('storage.search_files')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <StorageFilters 
                  filters={filters} 
                  onFiltersChange={setFilters}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  buckets={buckets}
                  onClearFilters={clearAllFilters}
                  activeFilterCount={getActiveFilterCount()}
                />
              </div>
              <div className="flex items-center gap-2">
                <LayoutToggle currentLayout={filesLayout} onLayoutChange={setFilesLayout} />
                <Button onClick={loadStorageData}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('common.refresh')}
                </Button>
              </div>
            </div>

            {filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <Files className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('storage.no_files_found')}</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? t('storage.try_different_search') : t('storage.no_files_available')}
                </p>
              </div>
            ) : filesLayout === 'table' ? (
              <StorageFileTable 
                files={filteredFiles}
                onView={handleFileView}
                onDownload={handleFileDownload}
                onDelete={handleFileDelete}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredFiles.map((file, index) => (
                  <StorageFileCard
                    key={`${file.bucket_id}-${file.name}-${index}`}
                    file={file}
                    onView={() => handleFileView(file)}
                    onDownload={() => handleFileDownload(file)}
                    onDelete={() => handleFileDelete(file)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="buckets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {buckets.map((bucket, index) => (
                <StorageBucketCard
                  key={`${bucket.id}-${index}`}
                  bucket={bucket}
                  onView={() => setSelectedBucketForView(bucket)}
                  onSettings={() => setSelectedBucketForManagement(bucket)}
                  onDelete={() => console.log('Delete bucket:', bucket)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <StorageAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="quotas" className="space-y-6">
            <StorageQuotaManager />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <FixedStorageUploadTab onFilesUploaded={loadStorageData} />
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <FileViewDialog
          file={selectedFile}
          open={showFileViewDialog}
          onOpenChange={setShowFileViewDialog}
        />

        <BucketManagementDialog
          bucket={selectedBucketForManagement}
          open={showBucketManagementDialog}
          onOpenChange={setShowBucketManagementDialog}
          onRefresh={loadStorageData}
        />

        <BucketViewDialog
          bucket={selectedBucketForView}
          open={showBucketViewDialog}
          onOpenChange={setShowBucketViewDialog}
          onViewFiles={(bucket) => {
            setSelectedBucket(bucket.id);
            setActiveTab('files');
          }}
          onOpenSettings={(bucket) => {
            setSelectedBucketForManagement(bucket);
            setShowBucketManagementDialog(true);
          }}
        />

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('storage.confirm_delete')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('storage.delete_file_warning', { filename: fileToDelete?.name })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={confirmFileDelete} className="bg-destructive hover:bg-destructive/90">
                {t('common.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageLayout>
  );
}