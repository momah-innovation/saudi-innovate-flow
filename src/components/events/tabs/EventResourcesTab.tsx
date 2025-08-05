import { useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download, 
  FileText, 
  Image, 
  Video, 
  File, 
  Plus, 
  Edit2, 
  Trash2,
  Eye,
  Upload
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useRTLAware } from '@/hooks/useRTLAware';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EventResource {
  id: string;
  title: string;
  description?: string;
  resource_type: string;
  file_url?: string;
  file_format?: string;
  file_size_mb?: number;
  download_count: number;
  is_public: boolean;
  availability_status: string;
  display_order: number;
  created_at: string;
}

interface EventResourcesTabProps {
  eventId: string;
  resources?: EventResource[];
  isAdmin?: boolean;
  onResourcesUpdate?: () => void;
}

export const EventResourcesTab = ({ 
  eventId, 
  resources = [], 
  isAdmin = false,
  onResourcesUpdate
}: EventResourcesTabProps) => {
  const { isRTL } = useDirection();
  const { me } = useRTLAware();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingResource, setEditingResource] = useState<EventResource | null>(null);
  const [uploading, setUploading] = useState(false);

  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    resource_type: 'document',
    is_public: true,
    availability_status: 'available',
    display_order: 0
  });

  const getResourceIcon = (type: string, format?: string) => {
    if (type === 'presentation') return <FileText className="w-5 h-5 text-blue-500" />;
    if (type === 'video') return <Video className="w-5 h-5 text-red-500" />;
    if (type === 'image') return <Image className="w-5 h-5 text-green-500" />;
    if (format?.toLowerCase().includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const getResourceTypeText = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'document': isRTL ? 'مستند' : 'Document',
      'presentation': isRTL ? 'عرض تقديمي' : 'Presentation', 
      'video': isRTL ? 'فيديو' : 'Video',
      'image': isRTL ? 'صورة' : 'Image',
      'template': isRTL ? 'نموذج' : 'Template',
      'guide': isRTL ? 'دليل' : 'Guide',
      'other': isRTL ? 'أخرى' : 'Other'
    };
    return typeMap[type] || type;
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      case 'coming_soon': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getAvailabilityText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'available': isRTL ? 'متاح' : 'Available',
      'coming_soon': isRTL ? 'قريباً' : 'Coming Soon',
      'archived': isRTL ? 'مؤرشف' : 'Archived'
    };
    return statusMap[status] || status;
  };

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${eventId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-resources')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('event-resources')
        .getPublicUrl(filePath);

      return {
        url: publicUrl,
        format: fileExt,
        size: file.size / (1024 * 1024) // Convert to MB
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'خطأ في الرفع',
        description: 'حدث خطأ أثناء رفع الملف',
        variant: 'destructive'
      });
      return null;
    } finally {
      setUploading(false);
    }
  }, [eventId, toast]);

  const handleAddResource = async (file?: File) => {
    try {
      setLoading(true);

      let fileData = null;
      if (file) {
        fileData = await handleFileUpload(file);
        if (!fileData) return;
      }

      const resourceData = {
        event_id: eventId,
        title: newResource.title,
        description: newResource.description,
        resource_type: newResource.resource_type,
        file_url: fileData?.url,
        file_format: fileData?.format,
        file_size_mb: fileData?.size,
        is_public: newResource.is_public,
        availability_status: newResource.availability_status,
        display_order: newResource.display_order,
        download_count: 0
      };

      const { error } = await supabase
        .from('event_resources')
        .insert(resourceData);

      if (error) throw error;

      toast({
        title: 'تم إضافة المورد',
        description: 'تم إضافة المورد بنجاح'
      });

      setShowAddDialog(false);
      setNewResource({
        title: '',
        description: '',
        resource_type: 'document',
        is_public: true,
        availability_status: 'available',
        display_order: 0
      });
      onResourcesUpdate?.();
    } catch (error) {
      console.error('Error adding resource:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إضافة المورد',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resource: EventResource) => {
    try {
      if (!resource.file_url) return;

      // Increment download count
      await supabase
        .from('event_resources')
        .update({ download_count: resource.download_count + 1 })
        .eq('id', resource.id);

      // Open download link
      window.open(resource.file_url, '_blank');
      
      onResourcesUpdate?.();
    } catch (error) {
      console.error('Error downloading resource:', error);
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    try {
      const { error } = await supabase
        .from('event_resources')
        .delete()
        .eq('id', resourceId);

      if (error) throw error;

      toast({
        title: 'تم حذف المورد',
        description: 'تم حذف المورد بنجاح'
      });
      
      onResourcesUpdate?.();
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حذف المورد',
        variant: 'destructive'
      });
    }
  };

  if (resources.length === 0 && !isAdmin) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">
          {isRTL ? 'لا توجد موارد' : 'No Resources'}
        </p>
        <p className="text-muted-foreground">
          {isRTL ? 'لم يتم إضافة أي موارد لهذه الفعالية بعد' : 'No resources have been added to this event yet'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Resource Button for Admins */}
      {isAdmin && (
        <div className="flex justify-end">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {isRTL ? 'إضافة مورد' : 'Add Resource'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {isRTL ? 'إضافة مورد جديد' : 'Add New Resource'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">
                    {isRTL ? 'العنوان' : 'Title'}
                  </Label>
                  <Input
                    id="title"
                    value={newResource.title}
                    onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                    placeholder={isRTL ? 'عنوان المورد' : 'Resource title'}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">
                    {isRTL ? 'الوصف' : 'Description'}
                  </Label>
                  <Textarea
                    id="description"
                    value={newResource.description}
                    onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={isRTL ? 'وصف المورد' : 'Resource description'}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">
                    {isRTL ? 'النوع' : 'Type'}
                  </Label>
                  <Select
                    value={newResource.resource_type}
                    onValueChange={(value) => setNewResource(prev => ({ ...prev, resource_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="document">{isRTL ? 'مستند' : 'Document'}</SelectItem>
                      <SelectItem value="presentation">{isRTL ? 'عرض تقديمي' : 'Presentation'}</SelectItem>
                      <SelectItem value="video">{isRTL ? 'فيديو' : 'Video'}</SelectItem>
                      <SelectItem value="image">{isRTL ? 'صورة' : 'Image'}</SelectItem>
                      <SelectItem value="template">{isRTL ? 'نموذج' : 'Template'}</SelectItem>
                      <SelectItem value="guide">{isRTL ? 'دليل' : 'Guide'}</SelectItem>
                      <SelectItem value="other">{isRTL ? 'أخرى' : 'Other'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="file">
                    {isRTL ? 'الملف' : 'File'} ({isRTL ? 'اختياري' : 'Optional'})
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setNewResource(prev => ({ 
                          ...prev, 
                          title: prev.title || file.name.split('.')[0] 
                        }));
                      }
                    }}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                    disabled={loading || uploading}
                  >
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button
                    onClick={() => {
                      const fileInput = document.getElementById('file') as HTMLInputElement;
                      const file = fileInput?.files?.[0];
                      handleAddResource(file);
                    }}
                    disabled={loading || uploading || !newResource.title}
                  >
                    {loading || uploading ? (
                      isRTL ? 'جاري الإضافة...' : 'Adding...'
                    ) : (
                      isRTL ? 'إضافة' : 'Add'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getResourceIcon(resource.resource_type, resource.file_format)}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-medium line-clamp-2">
                      {resource.title}
                    </CardTitle>
                    {resource.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {resource.description}
                      </p>
                    )}
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingResource(resource)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteResource(resource.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Resource Info */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">
                    {getResourceTypeText(resource.resource_type)}
                  </Badge>
                  <Badge className={getAvailabilityColor(resource.availability_status)}>
                    {getAvailabilityText(resource.availability_status)}
                  </Badge>
                </div>
                
                {/* File Info */}
                {resource.file_format && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{resource.file_format.toUpperCase()}</span>
                    {resource.file_size_mb && (
                      <span>{resource.file_size_mb.toFixed(1)} MB</span>
                    )}
                  </div>
                )}
                
                {/* Download Count */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Download className="w-3 h-3" />
                  <span>
                    {resource.download_count} {isRTL ? 'تحميل' : 'downloads'}
                  </span>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  {resource.file_url && resource.availability_status === 'available' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(resource)}
                      className="flex-1"
                    >
                      <Download className={`w-3 h-3 ${me('1')}`} />
                      {isRTL ? 'تحميل' : 'Download'}
                    </Button>
                  )}
                  
                  {resource.file_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(resource.file_url, '_blank')}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {resources.length === 0 && isAdmin && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">
            {isRTL ? 'لا توجد موارد' : 'No Resources'}
          </p>
          <p className="text-muted-foreground mb-4">
            {isRTL ? 'ابدأ بإضافة موارد لهذه الفعالية' : 'Start by adding resources to this event'}
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className={`w-4 h-4 ${me('2')}`} />
            {isRTL ? 'إضافة مورد' : 'Add Resource'}
          </Button>
        </div>
      )}
    </div>
  );
};