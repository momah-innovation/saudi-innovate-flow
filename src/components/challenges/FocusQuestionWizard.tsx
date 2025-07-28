import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Edit3, Plus } from "lucide-react";
import { useSystemLists } from "@/hooks/useSystemLists";

interface FocusQuestion {
  id: string;
  question_text_ar: string;
  question_type?: string;
  is_sensitive: boolean;
  order_sequence: number;
}

interface FocusQuestionWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challengeId: string;
  question?: FocusQuestion;
  onQuestionSaved: () => void;
}

export function FocusQuestionWizard({ 
  open, 
  onOpenChange, 
  challengeId,
  question,
  onQuestionSaved 
}: FocusQuestionWizardProps) {
  const [questionText, setQuestionText] = useState("");
  const [questionTextAr, setQuestionTextAr] = useState("");
  const [questionType, setQuestionType] = useState("open");
  const [isSensitive, setIsSensitive] = useState(false);
  const [orderSequence, setOrderSequence] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const systemSettings = useSystemLists();
  const isEditing = !!question;

  useEffect(() => {
    if (question) {
      setQuestionText("");
      setQuestionTextAr(question.question_text_ar || "");
      setQuestionType(question.question_type || "open");
      setIsSensitive(question.is_sensitive);
      setOrderSequence(question.order_sequence);
    } else {
      // Reset form for new question
      setQuestionText("");
      setQuestionTextAr("");
      setQuestionType("open");
      setIsSensitive(false);
      setOrderSequence(0);
    }
  }, [question, open]);

  const handleSave = async () => {
    if (!questionText.trim()) {
      toast.error('Question text is required');
      return;
    }

    try {
      setLoading(true);

      const questionData = {
        challenge_id: challengeId,
        question_text: questionText.trim(),
        question_text_ar: questionTextAr.trim() || null,
        question_type: questionType,
        is_sensitive: isSensitive,
        order_sequence: orderSequence
      };

      if (isEditing) {
        const { error } = await supabase
          .from('focus_questions')
          .update(questionData)
          .eq('id', question.id);

        if (error) throw error;
        toast.success('Focus question updated successfully');
      } else {
        const { error } = await supabase
          .from('focus_questions')
          .insert(questionData);

        if (error) throw error;
        toast.success('Focus question created successfully');
      }

      onQuestionSaved();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving focus question:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} focus question`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Edit3 className="h-5 w-5" />
                Edit Focus Question
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Add Focus Question
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question-text">Question Text (English) *</Label>
            <Textarea
              id="question-text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter the focus question in English..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question-text-ar">Question Text (Arabic)</Label>
            <Textarea
              id="question-text-ar"
              value={questionTextAr}
              onChange={(e) => setQuestionTextAr(e.target.value)}
              placeholder="Enter the focus question in Arabic (optional)..."
              className="min-h-[80px]"
              dir="rtl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="question-type">Question Type</Label>
              <Select value={questionType} onValueChange={setQuestionType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {systemSettings.focusQuestionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order-sequence">Display Order</Label>
              <Input
                id="order-sequence"
                type="number"
                value={orderSequence}
                onChange={(e) => setOrderSequence(parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is-sensitive"
              checked={isSensitive}
              onCheckedChange={setIsSensitive}
            />
            <Label htmlFor="is-sensitive">
              Sensitive Question (Only visible to team members)
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || !questionText.trim()}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isEditing ? 'Update' : 'Create'} Question
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}