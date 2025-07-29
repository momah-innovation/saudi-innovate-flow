import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, FileEdit, Tag, Users, Archive, AlertTriangle } from "lucide-react";

interface BulkActionsPanelProps {
  selectedItems: string[];
  onItemsUpdate: () => void;
  onClearSelection: () => void;
}

export function BulkActionsPanel({ selectedItems, onItemsUpdate, onClearSelection }: BulkActionsPanelProps) {
  const { toast } = useToast();
  const { t, isRTL } = useTranslation();
  
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  
  const [newStatus, setNewStatus] = useState("");
  const [statusReason, setStatusReason] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [assigneeId, setAssigneeId] = useState("");
  const [loading, setLoading] = useState(false);

  const [availableTags, setAvailableTags] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  // Status options
  const statusOptions = [
    { value: 'draft', label: 'مسودة' },
    { value: 'submitted', label: 'مُرسلة' },
    { value: 'under_review', label: 'قيد المراجعة' },
    { value: 'approved', label: 'موافق عليها' },
    { value: 'rejected', label: 'مرفوضة' },
    { value: 'in_development', label: 'قيد التطوير' },
    { value: 'implemented', label: 'منفذة' }
  ];

  const handleBulkStatusChange = async () => {
    if (!newStatus || selectedItems.length === 0) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('idea-workflow-manager', {
        body: {
          action: 'bulk_status_change',
          data: {
            ideaIds: selectedItems,
            newStatus: newStatus,
            reason: statusReason
          }
        }
      });

      if (error) throw error;

      toast({
        title: "نجح التحديث",
        description: `تم تحديث حالة ${selectedItems.length} فكرة بنجاح`,
      });

      setShowStatusDialog(false);
      setNewStatus("");
      setStatusReason("");
      onItemsUpdate();
      onClearSelection();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة الأفكار",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .in('id', selectedItems);

      if (error) throw error;

      toast({
        title: "نجح الحذف",
        description: `تم حذف ${selectedItems.length} فكرة بنجاح`,
      });

      setShowDeleteDialog(false);
      onItemsUpdate();
      onClearSelection();
    } catch (error: any) {
      console.error('Error deleting ideas:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الأفكار",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkTagging = async () => {
    if (selectedTags.length === 0 || selectedItems.length === 0) return;
    
    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create tag links for all selected ideas
      const tagLinks = [];
      for (const ideaId of selectedItems) {
        for (const tagId of selectedTags) {
          tagLinks.push({
            idea_id: ideaId,
            tag_id: tagId,
            added_by: user?.id
          });
        }
      }

      const { error } = await supabase
        .from('idea_tag_links')
        .insert(tagLinks);

      if (error) throw error;

      toast({
        title: "نجح إضافة العلامات",
        description: `تم إضافة العلامات لـ ${selectedItems.length} فكرة بنجاح`,
      });

      setShowTagDialog(false);
      setSelectedTags([]);
      onItemsUpdate();
      onClearSelection();
    } catch (error: any) {
      console.error('Error adding tags:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة العلامات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAssignment = async () => {
    if (!assigneeId || selectedItems.length === 0) return;
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const assignments = selectedItems.map(ideaId => ({
        idea_id: ideaId,
        assigned_to: assigneeId,
        assigned_by: user?.id,
        assignment_type: 'reviewer',
        status: 'pending'
      }));

      const { error } = await supabase
        .from('idea_assignments')
        .insert(assignments);

      if (error) throw error;

      toast({
        title: "نجح التكليف",
        description: `تم تكليف المراجع لـ ${selectedItems.length} فكرة بنجاح`,
      });

      setShowAssignDialog(false);
      setAssigneeId("");
      onItemsUpdate();
      onClearSelection();
    } catch (error: any) {
      console.error('Error assigning ideas:', error);
      toast({
        title: "خطأ",
        description: "فشل في تكليف المراجع",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load tags and team members when dialogs open
  const loadTags = async () => {
    const { data, error } = await supabase
      .from('idea_tags')
      .select('*')
      .order('name');
    
    if (!error) {
      setAvailableTags(data || []);
    }
  };

  const loadTeamMembers = async () => {
    const { data, error } = await supabase
      .from('innovation_team_members')
      .select('*')
      .eq('status', 'active')
      .order('cic_role');
    
    if (!error) {
      setTeamMembers(data || []);
    }
  };

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-card border rounded-lg p-4 mb-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">تم تحديد {selectedItems.length} فكرة</span>
          </div>
          <Button variant="outline" size="sm" onClick={onClearSelection}>
            إلغاء التحديد
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStatusDialog(true)}
            className="gap-2"
          >
            <FileEdit className="w-4 h-4" />
            تغيير الحالة
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              loadTags();
              setShowTagDialog(true);
            }}
            className="gap-2"
          >
            <Tag className="w-4 h-4" />
            إضافة علامات
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              loadTeamMembers();
              setShowAssignDialog(true);
            }}
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            تكليف مراجع
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            حذف
          </Button>
        </div>
      </div>

      {/* Status Change Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>تغيير حالة الأفكار</DialogTitle>
            <DialogDescription>
              تغيير حالة {selectedItems.length} فكرة محددة
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">الحالة الجديدة</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة الجديدة" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">سبب التغيير (اختياري)</label>
              <Textarea
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder="اكتب سبب تغيير الحالة..."
                dir="rtl"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleBulkStatusChange} disabled={!newStatus || loading}>
              {loading ? 'جارٍ التحديث...' : 'تحديث الحالة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tag Dialog */}
      <Dialog open={showTagDialog} onOpenChange={setShowTagDialog}>
        <DialogContent dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>إضافة علامات</DialogTitle>
            <DialogDescription>
              إضافة علامات لـ {selectedItems.length} فكرة محددة
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">العلامات المتاحة</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableTags.map((tag) => (
                  <label key={tag.id} className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTags([...selectedTags, tag.id]);
                        } else {
                          setSelectedTags(selectedTags.filter(id => id !== tag.id));
                        }
                      }}
                    />
                    <span className="text-sm">{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTagDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleBulkTagging} disabled={selectedTags.length === 0 || loading}>
              {loading ? 'جارٍ الإضافة...' : 'إضافة العلامات'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>تكليف مراجع</DialogTitle>
            <DialogDescription>
              تكليف مراجع لـ {selectedItems.length} فكرة محددة
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">المراجع</label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المراجع" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.user_id}>
                      {member.cic_role} - {member.contact_email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleBulkAssignment} disabled={!assigneeId || loading}>
              {loading ? 'جارٍ التكليف...' : 'تكليف المراجع'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              تأكيد الحذف
            </DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف {selectedItems.length} فكرة؟ هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete} disabled={loading}>
              {loading ? 'جارٍ الحذف...' : 'حذف'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}