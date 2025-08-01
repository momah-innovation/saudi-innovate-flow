import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/ui/page-header';
import { StorageHero } from './StorageHero';
import { StorageAnalyticsTab } from './StorageAnalyticsTab';
import { UploaderSettingsTab } from './UploaderSettingsTab';
import { FileViewDialog } from './FileViewDialog';
import { BucketManagementDialog } from './BucketManagementDialog';
import { LayoutToggle, LayoutType } from '@/components/ui/layout-toggle';
import { StorageFileCard } from './StorageFileCard';
import { StorageFileTable } from './StorageFileTable';
import { StorageBucketCard } from './StorageBucketCard';
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
  Filter
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
  const [loading, setLoading] = useState(true);
  const [buckets, setBuckets] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showFileViewDialog, setShowFileViewDialog] = useState(false);
  const [showBucketManagementDialog, setShowBucketManagementDialog] = useState(false);
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
        const { data: files, error: filesError } = await supabase.storage.from(bucket.id).list();
        console.log(`Files from ${bucket.id}:`, { files, filesError });
        
        if (filesError) {
          console.error(`Error loading files from bucket ${bucket.id}:`, filesError);
          continue; // Skip this bucket and continue with others
        }
        
        if (files) {
          const filesWithBucket = files.map(file => ({
            ...file,
            bucket_id: bucket.id,
            is_public: bucket.public
          }));
          allFiles = [...allFiles, ...filesWithBucket];

          if (bucket.public) {
            publicCount += files.length;
          } else {
            privateCount += files.length;
          }

          // Calculate total size
          files.forEach(file => {
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

  const handleFileView = (file: any) => {
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

  const handleBucketManagement = (bucket: any) => {
    setSelectedBucketForManagement(bucket);
    setShowBucketManagementDialog(true);
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

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        <Tabs defaultValue="files" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="files">{t('storage.files')}</TabsTrigger>
            <TabsTrigger value="buckets">{t('storage.buckets')}</TabsTrigger>
            <TabsTrigger value="settings">Uploader Settings</TabsTrigger>
            <TabsTrigger value="analytics">{t('storage.analytics')}</TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="space-y-6">
            {/* Header with layout toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold">{t('storage.files')}</h3>
                <p className="text-sm text-muted-foreground">
                  {filteredFiles.length} {t('storage.files_found')}
                </p>
              </div>
              <LayoutToggle
                currentLayout={filesLayout}
                onLayoutChange={setFilesLayout}
              />
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

            {/* Files Display */}
            {filesLayout === 'table' ? (
              <StorageFileTable
                files={filteredFiles}
                onView={handleFileView}
                onDownload={handleFileDownload}
                onDelete={handleFileDelete}
              />
            ) : (
              <ViewLayouts viewMode={filesLayout}>
                {filteredFiles.map((file) => (
                  <StorageFileCard
                    key={`${file.bucket_id}-${file.name}`}
                    file={file}
                    onView={handleFileView}
                    onDownload={handleFileDownload}
                    onDelete={handleFileDelete}
                  />
                ))}
              </ViewLayouts>
            )}
          </TabsContent>

          <TabsContent value="buckets" className="space-y-6">
            {/* Header with layout toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold">{t('storage.buckets')}</h3>
                <p className="text-sm text-muted-foreground">
                  {buckets.length} {t('storage.buckets_found')}
                </p>
              </div>
              <LayoutToggle
                currentLayout={bucketsLayout}
                onLayoutChange={setBucketsLayout}
              />
            </div>

            {/* Buckets Display */}
            <ViewLayouts viewMode={bucketsLayout}>
              {buckets.map((bucket) => (
                <StorageBucketCard
                  key={bucket.id}
                  bucket={bucket}
                  onView={() => {}} // TODO: Implement bucket view
                  onSettings={handleBucketManagement}
                  onDelete={() => {}} // TODO: Implement bucket delete
                />
              ))}
            </ViewLayouts>
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