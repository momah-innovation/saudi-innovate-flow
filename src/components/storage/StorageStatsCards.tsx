import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  HardDrive,
  Files,
  FolderOpen,
  TrendingUp,
  Calendar,
  Database
} from 'lucide-react';

interface StorageStatsCardsProps {
  stats: {
    totalFiles: number;
    totalSize: number;
    usedSpace: number;
    totalSpace: number;
    publicFiles: number;
    privateFiles: number;
    recentUploads: number;
    buckets: number;
  };
  files: any[];
}

export function StorageStatsCards({ stats, files }: StorageStatsCardsProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const usagePercentage = (stats.usedSpace / stats.totalSpace) * 100;

  // Calculate file type distribution
  const getFileTypeStats = () => {
    const types = { images: 0, documents: 0, videos: 0, audio: 0, others: 0 };
    
    files.forEach(file => {
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
        types.images++;
      } else if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension)) {
        types.documents++;
      } else if (['mp4', 'avi', 'mov', 'webm', 'mkv'].includes(extension)) {
        types.videos++;
      } else if (['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(extension)) {
        types.audio++;
      } else {
        types.others++;
      }
    });
    
    return types;
  };

  const fileTypes = getFileTypeStats();

  // Calculate recent uploads (last 7 days)
  const getRecentUploadsCount = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return files.filter(file => {
      if (!file.created_at) return false;
      return new Date(file.created_at) > sevenDaysAgo;
    }).length;
  };

  const recentUploads = getRecentUploadsCount();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Storage Usage */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
          <HardDrive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatFileSize(stats.usedSpace)}
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            of {formatFileSize(stats.totalSpace)} used
          </p>
          <Progress value={usagePercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {usagePercentage.toFixed(1)}% used
          </p>
        </CardContent>
      </Card>

      {/* Total Files */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Files</CardTitle>
          <Files className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalFiles}</div>
          <p className="text-xs text-muted-foreground">
            {stats.publicFiles} public, {stats.privateFiles} private
          </p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span>Images: {fileTypes.images}</span>
              <span>Docs: {fileTypes.documents}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Videos: {fileTypes.videos}</span>
              <span>Others: {fileTypes.others + fileTypes.audio}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Buckets */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Storage Buckets</CardTitle>
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.buckets}</div>
          <p className="text-xs text-muted-foreground">
            Active storage buckets
          </p>
          <div className="mt-2">
            <div className="text-xs text-muted-foreground">
              Avg files per bucket: {stats.buckets > 0 ? Math.round(stats.totalFiles / stats.buckets) : 0}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentUploads}</div>
          <p className="text-xs text-muted-foreground">
            Files uploaded in last 7 days
          </p>
          <div className="mt-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1" />
              {recentUploads > 0 ? 'Active uploads' : 'No recent uploads'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}