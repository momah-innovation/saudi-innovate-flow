import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, Image, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Progress } from './progress';
import { Badge } from './badge';

export interface FileItem {
  id: string;
  file: File;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  onFileRemove?: (fileId: string) => void;
  onUploadProgress?: (fileId: string, progress: number) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  maxSize?: number; // in MB
  multiple?: boolean;
  className?: string;
}

export function FileUploader({
  onFilesSelected,
  onFileRemove,
  onUploadProgress,
  acceptedTypes = ['*'],
  maxFiles = 10,
  maxSize = 10,
  multiple = true,
  className
}: FileUploaderProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter(file => {
      if (maxSize && file.size > maxSize * 1024 * 1024) return false;
      if (acceptedTypes.length > 0 && !acceptedTypes.includes('*')) {
        return acceptedTypes.some(type => file.type.includes(type) || file.name.endsWith(type));
      }
      return true;
    });

    const newFiles: FileItem[] = validFiles.slice(0, maxFiles - files.length).map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      status: 'uploading',
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);
    onFilesSelected(validFiles);

    // Simulate upload progress
    newFiles.forEach(fileItem => {
      simulateUpload(fileItem.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + Math.random() * 20, 100);
          onUploadProgress?.(fileId, newProgress);
          
          if (newProgress >= 100) {
            clearInterval(interval);
            return { ...file, progress: 100, status: 'success' as const };
          }
          return { ...file, progress: newProgress };
        }
        return file;
      }));
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    onFileRemove?.(fileId);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.includes('pdf') || file.type.includes('document')) return FileText;
    return File;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-muted-foreground/25 hover:border-primary/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">
          {isDragging ? "Drop files here" : "Upload files"}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop files here, or click to browse
        </p>
        
        <Button 
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
        >
          Choose Files
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <p>Maximum file size: {maxSize}MB</p>
          <p>Maximum files: {maxFiles}</p>
          {acceptedTypes.length > 0 && acceptedTypes[0] !== '*' && (
            <p>Accepted types: {acceptedTypes.join(', ')}</p>
          )}
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files ({files.length})</h4>
          {files.map((fileItem) => {
            const FileIcon = getFileIcon(fileItem.file);
            
            return (
              <div key={fileItem.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <FileIcon className="w-8 h-8 text-muted-foreground" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate">
                      {fileItem.file.name}
                    </p>
                    <div className="flex items-center gap-2">
                      {fileItem.status === 'success' && (
                        <CheckCircle className="w-4 h-4 text-success" />
                      )}
                      {fileItem.status === 'error' && (
                        <AlertCircle className="w-4 h-4 text-destructive" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(fileItem.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {(fileItem.file.size / (1024 * 1024)).toFixed(1)} MB
                    </Badge>
                    
                    {fileItem.status === 'uploading' && (
                      <div className="flex-1">
                        <Progress value={fileItem.progress} className="h-1" />
                      </div>
                    )}
                    
                    {fileItem.status === 'success' && (
                      <span className="text-xs text-success">Upload complete</span>
                    )}
                    
                    {fileItem.status === 'error' && (
                      <span className="text-xs text-destructive">
                        {fileItem.error || 'Upload failed'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}