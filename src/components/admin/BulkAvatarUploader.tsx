import React, { useState, useCallback, useMemo } from 'react';
import { Upload, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useAppTranslation';

// Avatar mapping for the existing users
const AVATAR_MAPPING = [
  { fileName: 'male-professional-1.jpg', userNames: ['Abdullah Alqahtani', 'عبدالله القحطاني'] },
  { fileName: 'male-professional-2.jpg', userNames: ['أحمد العتيبي'] },
  { fileName: 'male-professional-3.jpg', userNames: ['محمد الحربي', 'سلطان الخالدي'] },
  { fileName: 'male-professional-4.jpg', userNames: ['خالد المطيري', 'فهد السبيعي'] },
  { fileName: 'male-professional-5.jpg', userNames: ['عبدالله الشمراني', 'منصور الأحمد'] },
  { fileName: 'male-professional-6.jpg', userNames: ['عمر الغامدي', 'يوسف البراك'] },
  { fileName: 'female-professional-1.jpg', userNames: ['فاطمة السعيد', 'هند العساف'] },
  { fileName: 'female-professional-2.jpg', userNames: ['سارة الزهراني', 'ريم الخليل'] },
  { fileName: 'female-professional-3.jpg', userNames: ['نورا القحطاني', 'أميرة النجار'] },
  { fileName: 'female-professional-4.jpg', userNames: ['عائشة الدوسري'] },
  { fileName: 'female-professional-5.jpg', userNames: ['مريم الرشيد'] },
  { fileName: 'female-professional-6.jpg', userNames: ['ليلى الموسى'] }
];

interface BulkAvatarUploaderProps {
  onComplete?: () => void;
}

export function BulkAvatarUploader({ onComplete }: BulkAvatarUploaderProps) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    success: string[];
    failed: string[];
    total: number;
  }>({ success: [], failed: [], total: 0 });

  const uploadAvatarsFromPublic = async () => {
    try {
      setUploading(true);
      setProgress(0);
      setResults({ success: [], failed: [], total: AVATAR_MAPPING.length });

      let completed = 0;
      const successfulUploads: string[] = [];
      const failedUploads: string[] = [];

      for (const mapping of AVATAR_MAPPING) {
        try {
          // For demo purposes, we'll create placeholder URLs
          // In a real scenario, you would fetch the actual image files
          const storageUrl = `https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/avatars/${mapping.fileName}`;
          
          // Update all users associated with this avatar
          for (const userName of mapping.userNames) {
            const { error } = await supabase
              .from('profiles')
              .update({
                profile_image_url: storageUrl,
                avatar_file_size: 150000, // Approximate file size
                avatar_mime_type: 'image/jpeg',
                avatar_uploaded_at: new Date().toISOString()
              })
              .eq('name', userName);

            if (error) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
              failedUploads.push(`${userName} (${mapping.fileName})`);
            } else {
              successfulUploads.push(`${userName} (${mapping.fileName})`);
            }
          }

          completed++;
          setProgress((completed / AVATAR_MAPPING.length) * 100);
          
          // Small delay to show progress
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          failedUploads.push(mapping.fileName);
          completed++;
          setProgress((completed / AVATAR_MAPPING.length) * 100);
        }
      }

      setResults({
        success: successfulUploads,
        failed: failedUploads,
        total: AVATAR_MAPPING.length
      });

      if (failedUploads.length === 0) {
        toast.success(t('all_avatars_updated_successfully'));
      } else {
        toast.warning(t('avatars_update_partial_success', { 
          success: successfulUploads.length, 
          failed: failedUploads.length 
        }));
      }

      onComplete?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(t('failed_to_upload_avatars'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {t('bulk_avatar_upload')}
        </CardTitle>
        <CardDescription>
          {t('bulk_avatar_upload_description')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('bulk_avatar_update_warning', { 
              userCount: AVATAR_MAPPING.reduce((total, mapping) => total + mapping.userNames.length, 0),
              imageCount: AVATAR_MAPPING.length 
            })}
          </AlertDescription>
        </Alert>

        {!uploading && results.total === 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">{t('avatar_assignments')}:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
              {AVATAR_MAPPING.map((mapping, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <p className="font-medium text-sm">{mapping.fileName}</p>
                  <ul className="text-xs text-muted-foreground mt-1">
                    {mapping.userNames.map((name, i) => (
                      <li key={i}>• {name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploading && (
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center text-muted-foreground">
              {t('uploading_avatars_progress', { progress: Math.round(progress) })}
            </p>
          </div>
        )}

        {results.total > 0 && !uploading && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 status-success rounded-lg">
                <CheckCircle className="h-8 w-8 icon-success mx-auto mb-2" />
                <p className="font-medium text-success">{results.success.length}</p>
                <p className="text-sm text-success">{t('successful')}</p>
              </div>
              <div className="text-center p-4 status-error rounded-lg">
                <AlertCircle className="h-8 w-8 icon-error mx-auto mb-2" />
                <p className="font-medium text-destructive">{results.failed.length}</p>
                <p className="text-sm text-destructive">{t('failed')}</p>
              </div>
            </div>

            {results.failed.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{t('failed_uploads')}:</strong>
                  <ul className="mt-2 list-disc list-inside text-sm">
                    {results.failed.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <Button
          onClick={uploadAvatarsFromPublic}
          disabled={uploading}
          className="w-full"
          size="lg"
        >
          <Upload className="h-4 w-4 me-2" />
          {uploading ? t('uploading_avatars') : t('start_bulk_upload')}
        </Button>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>{t('note')}:</strong> {t('avatar_upload_note')}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}