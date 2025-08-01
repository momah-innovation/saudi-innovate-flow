import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Download,
  Trash2,
  Move,
  X,
  CheckSquare,
  Square
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BulkFileActionsProps {
  selectedFiles: any[];
  onSelectionChange: (files: any[]) => void;
  onFilesUpdated: () => void;
  buckets: any[];
  allFiles: any[];
}

export function BulkFileActions({
  selectedFiles,
  onSelectionChange,
  onFilesUpdated,
  buckets,
  allFiles
}: BulkFileActionsProps) {
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [targetBucket, setTargetBucket] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectAll = () => {
    onSelectionChange(allFiles);
  };

  const clearSelection = () => {
    onSelectionChange([]);
  };

  const isAllSelected = selectedFiles.length === allFiles.length && allFiles.length > 0;
  const isPartialSelection = selectedFiles.length > 0 && selectedFiles.length < allFiles.length;

  const handleBulkDownload = async () => {
    setIsProcessing(true);
    try {
      // For multiple files, we'll download them one by one
      // In a real app, you might want to create a zip file
      for (const file of selectedFiles) {
        const { data } = await supabase.storage.from(file.bucket_id).download(file.name);
        if (data) {
          const url = URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.name;
          a.click();
          URL.revokeObjectURL(url);
        }
      }
      
      toast({
        title: "Download Started",
        description: `Downloading ${selectedFiles.length} files`
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download files",
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    setIsProcessing(true);
    try {
      const deletePromises = selectedFiles.map(file =>
        supabase.storage.from(file.bucket_id).remove([file.name])
      );
      
      await Promise.all(deletePromises);
      
      toast({
        title: "Files Deleted",
        description: `Successfully deleted ${selectedFiles.length} files`
      });
      
      onSelectionChange([]);
      onFilesUpdated();
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete files",
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
      setShowDeleteDialog(false);
    }
  };

  const handleBulkMove = async () => {
    if (!targetBucket) return;

    setIsProcessing(true);
    try {
      // For each file, we need to copy to new bucket and delete from old bucket
      for (const file of selectedFiles) {
        if (file.bucket_id === targetBucket) continue; // Skip if already in target bucket
        
        // Download file data
        const { data: fileData } = await supabase.storage
          .from(file.bucket_id)
          .download(file.name);
          
        if (fileData) {
          // Upload to new bucket
          const { error: uploadError } = await supabase.storage
            .from(targetBucket)
            .upload(file.name, fileData, {
              upsert: true
            });
            
          if (!uploadError) {
            // Delete from old bucket
            await supabase.storage
              .from(file.bucket_id)
              .remove([file.name]);
          }
        }
      }
      
      toast({
        title: "Files Moved",
        description: `Successfully moved ${selectedFiles.length} files to ${targetBucket}`
      });
      
      onSelectionChange([]);
      onFilesUpdated();
    } catch (error) {
      toast({
        title: "Move Failed",
        description: "Failed to move files",
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
      setShowMoveDialog(false);
      setTargetBucket('');
    }
  };

  if (selectedFiles.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={isAllSelected ? clearSelection : selectAll}
          className="flex items-center gap-2"
        >
          {isAllSelected ? (
            <CheckSquare className="w-4 h-4" />
          ) : isPartialSelection ? (
            <Square className="w-4 h-4 opacity-50" />
          ) : (
            <Square className="w-4 h-4" />
          )}
          {isAllSelected ? 'Deselect All' : `Select All (${allFiles.length})`}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
      <div className="flex items-center gap-2 flex-1">
        <Badge variant="secondary" className="px-2 py-1">
          {selectedFiles.length} selected
        </Badge>
        
        <Button
          variant="outline"
          size="sm"
          onClick={clearSelection}
          className="h-7 px-2"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBulkDownload}
          disabled={isProcessing}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMoveDialog(true)}
          disabled={isProcessing}
          className="flex items-center gap-2"
        >
          <Move className="w-4 h-4" />
          Move
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          disabled={isProcessing}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Files</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedFiles.length} selected files? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Files
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Move Dialog */}
      <AlertDialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
        <AlertDialogContent className="bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle>Move Files</AlertDialogTitle>
            <AlertDialogDescription>
              Select the destination bucket for {selectedFiles.length} selected files.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Destination Bucket</label>
            <Select value={targetBucket} onValueChange={setTargetBucket}>
              <SelectTrigger>
                <SelectValue placeholder="Select a bucket" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                {buckets.map((bucket) => (
                  <SelectItem key={bucket.id} value={bucket.id}>
                    {bucket.name || bucket.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkMove}
              disabled={!targetBucket}
            >
              Move Files
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}