import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  HardDrive, 
  Files,
  Upload,
  Shield,
  Database,
  TrendingUp,
  Activity,
  Users
} from 'lucide-react';

interface StorageHeroProps {
  totalFiles: number;
  totalSize: number;
  usedSpace: number;
  totalSpace: number;
  publicFiles: number;
  privateFiles: number;
  recentUploads: number;
  buckets: number;
}

export function StorageHero({
  totalFiles,
  totalSize,
  usedSpace,
  totalSpace,
  publicFiles,
  privateFiles,
  recentUploads,
  buckets
}: StorageHeroProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const usagePercentage = (usedSpace / totalSpace) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Storage Usage */}
      <Card className="gradient-border hover-scale">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
          <HardDrive className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatBytes(usedSpace)}</div>
          <p className="text-xs text-muted-foreground">
            of {formatBytes(totalSpace)} used
          </p>
          <div className="mt-2">
            <Progress value={usagePercentage} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {usagePercentage.toFixed(1)}% capacity
          </p>
        </CardContent>
      </Card>

      {/* Total Files */}
      <Card className="gradient-border hover-scale">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Files</CardTitle>
          <Files className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalFiles.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {recentUploads} recent uploads
          </p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-xs text-green-600">+12% this month</span>
          </div>
        </CardContent>
      </Card>

      {/* File Distribution */}
      <Card className="gradient-border hover-scale">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">File Distribution</CardTitle>
          <Shield className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Public Files</span>
              <span className="font-semibold">{publicFiles}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Private Files</span>
              <span className="font-semibold">{privateFiles}</span>
            </div>
          </div>
          <div className="mt-2">
            <Progress value={(publicFiles / totalFiles) * 100} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {((publicFiles / totalFiles) * 100).toFixed(1)}% public
          </p>
        </CardContent>
      </Card>

      {/* Storage Buckets */}
      <Card className="gradient-border hover-scale">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Storage Buckets</CardTitle>
          <Database className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{buckets}</div>
          <p className="text-xs text-muted-foreground">
            Active storage buckets
          </p>
          <div className="flex items-center gap-1 mt-2">
            <Activity className="h-3 w-3 text-blue-500" />
            <span className="text-xs text-blue-600">All operational</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}