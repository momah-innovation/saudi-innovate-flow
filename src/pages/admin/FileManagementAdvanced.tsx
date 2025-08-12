import React from 'react';
import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  HardDrive, 
  Files, 
  TrendingUp, 
  Archive,
  Download,
  Trash2,
  FolderOpen,
  Database
} from 'lucide-react';

const FileManagementAdvanced: React.FC = () => {
  // Mock file system data
  const mockStorageData = {
    totalStorage: 1247483648, // bytes
    usedStorage: 892374829,
    bucketCount: 8,
    totalFiles: 15429
  };

  const mockBuckets = [
    { name: 'user-uploads-private', files: 8431, size: 524288000, type: 'private' },
    { name: 'challenge-attachments', files: 3248, size: 198745600, type: 'private' },
    { name: 'profile-images-public', files: 2847, size: 89431040, type: 'public' },
    { name: 'temp-uploads-private', files: 642, size: 45876224, type: 'private' },
    { name: 'archived-files-private', files: 234, size: 23456789, type: 'private' },
    { name: 'event-resources-public', files: 127, size: 12894732, type: 'public' }
  ];

  const mockRecentActivity = [
    { action: 'upload', file: 'presentation.pdf', user: 'أحمد محمد', time: '15:32', size: '2.4 MB' },
    { action: 'delete', file: 'old_logo.png', user: 'فاطمة علي', time: '14:28', size: '456 KB' },
    { action: 'archive', file: 'report_2023.docx', user: 'محمد حسن', time: '13:45', size: '1.2 MB' },
    { action: 'download', file: 'guidelines.pdf', user: 'زينب أحمد', time: '12:15', size: '3.8 MB' }
  ];

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'upload': return <TrendingUp className="w-4 h-4 text-success" />;
      case 'delete': return <Trash2 className="w-4 h-4 text-destructive" />;
      case 'archive': return <Archive className="w-4 h-4 text-warning" />;
      case 'download': return <Download className="w-4 h-4 text-primary" />;
      default: return <Files className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'upload': return 'رفع';
      case 'delete': return 'حذف';
      case 'archive': return 'أرشفة';
      case 'download': return 'تحميل';
      default: return action;
    }
  };

  return (
    <AdminPageWrapper
      title="إدارة الملفات المتقدمة"
      description="مراقبة وإدارة نظام الملفات والتخزين السحابي"
    >
      <div className="space-y-6">
        {/* Storage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    المساحة المستخدمة
                  </p>
                  <p className="text-2xl font-bold">{formatBytes(mockStorageData.usedStorage)}</p>
                </div>
                <HardDrive className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    إجمالي الملفات
                  </p>
                  <p className="text-2xl font-bold">{mockStorageData.totalFiles.toLocaleString()}</p>
                </div>
                <Files className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    المجلدات
                  </p>
                  <p className="text-2xl font-bold">{mockStorageData.bucketCount}</p>
                </div>
                <FolderOpen className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    معدل الاستخدام
                  </p>
                  <p className="text-2xl font-bold">
                    {Math.round((mockStorageData.usedStorage / mockStorageData.totalStorage) * 100)}%
                  </p>
                </div>
                <Database className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Storage Usage Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              استخدام التخزين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">المساحة المستخدمة</span>
                <span className="text-sm text-muted-foreground">
                  {formatBytes(mockStorageData.usedStorage)} من {formatBytes(mockStorageData.totalStorage)}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${(mockStorageData.usedStorage / mockStorageData.totalStorage) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bucket Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              إحصائيات المجلدات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم المجلد</TableHead>
                    <TableHead>عدد الملفات</TableHead>
                    <TableHead>الحجم</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBuckets.map((bucket, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {bucket.name}
                        </code>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          {bucket.files.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          {formatBytes(bucket.size)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={bucket.type === 'public' ? 'default' : 'outline'}>
                          {bucket.type === 'public' ? 'عام' : 'خاص'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Archive className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Recent File Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              النشاط الحديث
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getActionIcon(activity.action)}
                    <div>
                      <div className="font-medium text-sm">{activity.file}</div>
                      <div className="text-xs text-muted-foreground">
                        {getActionLabel(activity.action)} بواسطة {activity.user}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{activity.size}</div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* File Management Actions */}
        <Card>
          <CardHeader>
            <CardTitle>إجراءات إدارة الملفات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Archive className="w-6 h-6" />
                أرشفة الملفات القديمة
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Trash2 className="w-6 h-6" />
                تنظيف الملفات المؤقتة
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Download className="w-6 h-6" />
                تصدير البيانات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPageWrapper>
  );
};

export default FileManagementAdvanced;