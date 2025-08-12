import React, { useState, useRef } from 'react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Camera, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './button';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';


interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  userId: string;
  onAvatarUpdate?: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
  showUploadButton?: boolean;
}

export function AvatarUpload({ 
  currentAvatarUrl, 
  userId, 
  onAvatarUpdate,
  size = 'md',
  showUploadButton = true 
}: AvatarUploadProps) {
  const { t } = useUnifiedTranslation();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      // Upload file to storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL and metadata
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          profile_image_url: publicUrl,
          avatar_file_size: file.size,
          avatar_mime_type: file.type,
          avatar_uploaded_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      onAvatarUpdate?.(publicUrl);
      toast.success(t('toast.avatar_updated'));
    } catch (error) {
      logger.error('Error uploading avatar', { component: 'AvatarUpload', action: 'uploadAvatar' }, error as Error);
      toast.error(t('toast.avatar_upload_error'));
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(t('toast.select_image_file'));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('toast.file_size_limit'));
      return;
    }

    uploadAvatar(file);
  };

  const removeAvatar = async () => {
    try {
      setUploading(true);

      // Update profile to remove avatar URL and metadata
      const { error } = await supabase
        .from('profiles')
        .update({ 
          profile_image_url: null,
          avatar_file_size: null,
          avatar_mime_type: null
        })
        .eq('id', userId);

      if (error) throw error;

      setAvatarUrl(null);
      onAvatarUpdate?.('');
      toast.success(t('toast.avatar_removed'));
    } catch (error) {
      logger.error('Error removing avatar', { component: 'AvatarUpload', action: 'removeAvatar' }, error as Error);
      toast.error(t('toast.avatar_remove_error'));
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={avatarUrl || undefined} />
          <AvatarFallback className="bg-muted">
            <Camera className="h-4 w-4 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        
        {showUploadButton && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
               onClick={() => fileInputRef.current?.click()}>
            <Camera className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      {showUploadButton && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? t('ui.avatar_upload.uploading') : t('ui.avatar_upload.upload')}
          </Button>
          
          {avatarUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={removeAvatar}
              disabled={uploading}
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}