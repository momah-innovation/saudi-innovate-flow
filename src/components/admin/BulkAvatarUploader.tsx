import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

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
              console.error(`Failed to update ${userName}:`, error);
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
          console.error(`Failed to process ${mapping.fileName}:`, error);
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
        toast.success('All avatars updated successfully!');
      } else {
        toast.warning(`${successfulUploads.length} avatars updated, ${failedUploads.length} failed`);
      }

      onComplete?.();
    } catch (error) {
      console.error('Bulk upload error:', error);
      toast.error('Failed to upload avatars');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Bulk Avatar Upload
        </CardTitle>
        <CardDescription>
          Upload avatar images for all existing users from the public folder
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This will update avatar URLs for {AVATAR_MAPPING.reduce((total, mapping) => total + mapping.userNames.length, 0)} users 
            using {AVATAR_MAPPING.length} professional avatar images.
          </AlertDescription>
        </Alert>

        {!uploading && results.total === 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Avatar Assignments:</h3>
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
              Uploading avatars... {Math.round(progress)}%
            </p>
          </div>
        )}

        {results.total > 0 && !uploading && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-green-900">{results.success.length}</p>
                <p className="text-sm text-green-700">Successful</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="font-medium text-red-900">{results.failed.length}</p>
                <p className="text-sm text-red-700">Failed</p>
              </div>
            </div>

            {results.failed.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Failed uploads:</strong>
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
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading Avatars...' : 'Start Bulk Upload'}
        </Button>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Note:</strong> Make sure you have manually uploaded the avatar images from 
            your public/avatars/ folder to the Supabase 'avatars' storage bucket first. 
            This tool will update the database references to point to those images.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}