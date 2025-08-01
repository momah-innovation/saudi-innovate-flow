import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MoreHorizontal,
  Eye,
  Download,
  Copy,
  Move,
  Edit3,
  Share2,
  Trash2,
  Info,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FileActionsDropdownProps {
  file: any;
  onView: (file: any) => void;
  onDownload: (file: any) => void;
  onDelete: (file: any) => void;
  onMove?: (file: any) => void;
  onRename?: (file: any) => void;
  onShare?: (file: any) => void;
  onShowInfo?: (file: any) => void;
}

export function FileActionsDropdown({
  file,
  onView,
  onDownload,
  onDelete,
  onMove,
  onRename,
  onShare,
  onShowInfo
}: FileActionsDropdownProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyUrl = async () => {
    if (file.is_public) {
      const { data } = supabase.storage.from(file.bucket_id).getPublicUrl(file.name);
      await navigator.clipboard.writeText(data.publicUrl);
      toast({
        title: "URL Copied",
        description: "File URL copied to clipboard"
      });
    } else {
      toast({
        title: "Cannot Copy URL",
        description: "This file is private and doesn't have a public URL",
        variant: "destructive"
      });
    }
    setIsOpen(false);
  };

  const handleOpenInNewTab = () => {
    if (file.is_public) {
      const { data } = supabase.storage.from(file.bucket_id).getPublicUrl(file.name);
      window.open(data.publicUrl, '_blank');
    }
    setIsOpen(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background border shadow-lg z-50">
        <div className="px-2 py-1.5 border-b">
          <p className="font-medium text-sm truncate">{file.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={file.is_public ? "default" : "secondary"} className="text-xs">
              {file.is_public ? "Public" : "Private"}
            </Badge>
            {file.metadata?.size && (
              <span className="text-xs text-muted-foreground">
                {formatFileSize(file.metadata.size)}
              </span>
            )}
          </div>
        </div>

        <DropdownMenuItem onClick={() => { onView(file); setIsOpen(false); }}>
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => { onDownload(file); setIsOpen(false); }}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </DropdownMenuItem>

        {file.is_public && (
          <>
            <DropdownMenuItem onClick={handleCopyUrl}>
              <Copy className="w-4 h-4 mr-2" />
              Copy URL
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleOpenInNewTab}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in New Tab
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        {onMove && (
          <DropdownMenuItem onClick={() => { onMove(file); setIsOpen(false); }}>
            <Move className="w-4 h-4 mr-2" />
            Move File
          </DropdownMenuItem>
        )}

        {onRename && (
          <DropdownMenuItem onClick={() => { onRename(file); setIsOpen(false); }}>
            <Edit3 className="w-4 h-4 mr-2" />
            Rename
          </DropdownMenuItem>
        )}

        {onShare && (
          <DropdownMenuItem onClick={() => { onShare(file); setIsOpen(false); }}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </DropdownMenuItem>
        )}

        {onShowInfo && (
          <DropdownMenuItem onClick={() => { onShowInfo(file); setIsOpen(false); }}>
            <Info className="w-4 h-4 mr-2" />
            Properties
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          onClick={() => { onDelete(file); setIsOpen(false); }}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}