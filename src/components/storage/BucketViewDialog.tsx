import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Database, 
  Globe, 
  Lock, 
  Calendar, 
  HardDrive, 
  Files,
  Eye,
  Settings,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';

interface BucketViewDialogProps {
  bucket: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewFiles: (bucket: any) => void;
  onOpenSettings: (bucket: any) => void;
}

export function BucketViewDialog({ 
  bucket, 
  open, 
  onOpenChange, 
  onViewFiles, 
  onOpenSettings 
}: BucketViewDialogProps) {
  if (!bucket) return null;

  const formatSize = (size?: number) => {
    if (!size) return '0 B';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Database className="w-5 h-5" />
            Bucket Details: {bucket.name}
          </DialogTitle>
          <DialogDescription>
            View bucket information and quick actions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bucket Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bucket ID</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{bucket.id}</code>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Visibility</span>
                  <Badge variant={bucket.public ? "default" : "secondary"}>
                    {bucket.public ? (
                      <>
                        <Globe className="w-3 h-3 mr-1" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 mr-1" />
                        Private
                      </>
                    )}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Created</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(bucket.created_at), 'MMM dd, yyyy')}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Storage Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center gap-1">
                    <Files className="w-3 h-3" />
                    Files
                  </span>
                  <span className="text-sm font-medium">
                    {bucket.file_count?.toLocaleString() || '0'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center gap-1">
                    <HardDrive className="w-3 h-3" />
                    Size
                  </span>
                  <span className="text-sm font-medium">
                    {formatSize(bucket.total_size)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Last Modified
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {bucket.updated_at ? format(new Date(bucket.updated_at), 'MMM dd') : 'Unknown'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Public URL Info */}
          {bucket.public && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium mb-1">Public Access</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Files in this bucket are publicly accessible via direct URLs
                    </p>
                    <code className="text-xs bg-background px-2 py-1 rounded break-all">
                      https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/{bucket.id}/[filename]
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                onViewFiles(bucket);
                onOpenChange(false);
              }}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Files
            </Button>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  onOpenSettings(bucket);
                  onOpenChange(false);
                }}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Manage Settings
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}