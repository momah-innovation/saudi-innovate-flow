import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/ui/page-header';
import { StorageHero } from './StorageHero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
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
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';

export function StorageManagementPage() {
  const { toast } = useToast();
  const { t, isRTL } = useTranslation();
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [buckets, setBuckets] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
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
      
      // Load buckets
      const { data: bucketsData } = await supabase.storage.listBuckets();
      if (bucketsData) {
        setBuckets(bucketsData);
        setStorageStats(prev => ({ ...prev, buckets: bucketsData.length }));
      }

      // Load files from all buckets
      let allFiles: any[] = [];
      let totalSize = 0;
      let publicCount = 0;
      let privateCount = 0;

      for (const bucket of bucketsData || []) {
        const { data: files } = await supabase.storage.from(bucket.id).list();
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
        title: t('error'),
        description: t('failed_to_load'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileView = (file: any) => {
    toast({
      title: t('view_file_details'),
      description: t('viewing_file', { filename: file.name })
    });
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

  const handleFileDelete = async (file: any) => {
    try {
      const { error } = await supabase.storage.from(file.bucket_id).remove([file.name]);
      if (!error) {
        toast({
          title: t('file_deleted'),
          description: t('file_deleted_successfully', { filename: file.name })
        });
        loadStorageData(); // Refresh data
      }
    } catch (error) {
      toast({
        title: t('delete_failed'),
        description: t('failed_to_delete'),
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
            <p className="text-sm text-muted-foreground">{t('loading')}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title={t('storage_management')}
        description={t('monitor_manage_storage')}
        actionButton={{
          label: t('upload_files'),
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="files">{t('files')}</TabsTrigger>
            <TabsTrigger value="buckets">{t('buckets')}</TabsTrigger>
            <TabsTrigger value="analytics">{t('analytics')}</TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={t('search_files')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => loadStorageData()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('refresh')}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFiles.map((file) => (
                <Card key={`${file.bucket_id}-${file.name}`} className="hover:shadow-lg transition-all duration-300 hover-scale">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <Files className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <Badge variant={file.is_public ? "default" : "secondary"}>
                        {file.is_public ? t('public') : t('private')}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {file.name}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex justify-between">
                        <span>{t('bucket')}</span>
                        <span>{file.bucket_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('file_size')}</span>
                        <span>{file.metadata?.size ? `${(file.metadata.size / 1024).toFixed(1)} KB` : t('unknown')}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => handleFileView(file)} className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        {t('view')}
                      </Button>
                      <Button onClick={() => handleFileDownload(file)} className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        {t('download')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="buckets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buckets.map((bucket) => (
                <Card key={bucket.id} className="hover:shadow-lg transition-all duration-300 hover-scale">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        {bucket.name}
                      </CardTitle>
                      <Badge variant={bucket.public ? "default" : "secondary"}>
                        {bucket.public ? t('public') : t('private')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>ID</span>
                        <span className="font-mono">{bucket.id}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{t('created_at')}</span>
                        <span>{bucket.created_at ? new Date(bucket.created_at).toLocaleDateString() : t('unknown')}</span>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Settings className="w-4 h-4 mr-2" />
                        {t('manage_bucket')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('storage_usage_trend')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {((storageStats.usedSpace / storageStats.totalSpace) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">{t('storage_used')}</div>
                    </div>
                    <Progress value={(storageStats.usedSpace / storageStats.totalSpace) * 100} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('file_distribution')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>{t('public_files')}</span>
                      <span className="font-semibold">{storageStats.publicFiles}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('private_files')}</span>
                      <span className="font-semibold">{storageStats.privateFiles}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('total_buckets')}</span>
                      <span className="font-semibold">{storageStats.buckets}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
              <Input id="bucket-select" placeholder={t('choose_bucket')} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="file-upload">{t('choose_files')}</Label>
              <Input id="file-upload" type="file" multiple className="mt-2" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={() => {
                toast({
                  title: t('upload_started'),
                  description: t('files_being_uploaded')
                });
                setShowUploadDialog(false);
              }}>
                <Upload className="w-4 h-4 mr-2" />
                {t('upload')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}