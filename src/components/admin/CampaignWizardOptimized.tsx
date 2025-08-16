import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { currentTimestamp, dateHandler } from '@/utils/unified-date-handler';
import { createErrorHandler } from '@/utils/unified-error-handler';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCampaignManagement } from "@/hooks/useCampaignManagement";
import { 
  Plus, 
  X,
  Calendar,
  Target,
  Users,
  Building2,
  MapPin,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Search,
  ChevronsUpDown,
  Check
} from "lucide-react";
import { useSettingsManager } from "@/hooks/useSettingsManager";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { CampaignFormData, SystemLists } from "@/types";

interface CampaignWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCampaign?: CampaignFormData | null;
  onSuccess: () => void;
}

// Optimized component with React.memo and consolidated state
const CampaignWizard = React.memo(({ 
  open, 
  onOpenChange, 
  editingCampaign, 
  onSuccess 
}: CampaignWizardProps) => {
  const { toast } = useToast();
  const { t, language } = useUnifiedTranslation();
  // Settings manager removed - not needed for this component
  
  // Use the centralized campaign management hook
  const {
    loading,
    error,
    options,
    loadCampaignOptions,
    loadCampaignLinks,
    createCampaign,
    updateCampaign,
    deleteCampaign
  } = useCampaignManagement();

  // Consolidated state object to reduce useState calls (was 18+ individual states)
  const [state, setState] = useState({
    currentStep: 1,
    formData: {
      title_ar: '',
      title_en: '',
      description_ar: '',
      description_en: '',
      status: 'planning',
      start_date: '',
      end_date: '',
      registration_deadline: '',
      budget: 0,
      target_participants: 0,
      target_ideas: 0,
      success_metrics: '',
      theme: '',
      campaign_manager_id: '',
      challenge_id: '',
      department_id: '',
      deputy_id: '',
      sector_id: '',
      sector_ids: [] as string[],
      deputy_ids: [] as string[],
      department_ids: [] as string[],
      challenge_ids: [] as string[],
      partner_ids: [] as string[],
      stakeholder_ids: [] as string[]
    } as CampaignFormData,
    errors: {} as Record<string, string>
  });

  // Memoized update function to prevent recreating on every render
  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const updateFormData = useCallback((updates: Partial<CampaignFormData>) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...updates }
    }));
  }, []);

  // Memoized validation function
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!state.formData.title_ar) {
      newErrors.title_ar = t('titleArRequired');
    }
    
    if (!state.formData.start_date) {
      newErrors.start_date = t('startDateRequired');
    }
    
    if (!state.formData.end_date) {
      newErrors.end_date = t('endDateRequired');
    }
    
    if (state.formData.start_date && state.formData.end_date) {
      if (new Date(state.formData.start_date) >= new Date(state.formData.end_date)) {
        newErrors.end_date = t('endDateMustBeAfterStartDate');
      }
    }
    
    updateState({ errors: newErrors });
    return Object.keys(newErrors).length === 0;
  }, [state.formData, t, updateState]);

  // Memoized submit handler
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    
    try {
      if (editingCampaign?.id) {
        await updateCampaign(editingCampaign.id, state.formData);
      } else {
        await createCampaign(state.formData);
      }
      
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      updateState({
        currentStep: 1,
        formData: {
          title_ar: '',
          title_en: '',
          description_ar: '',
          description_en: '',
          status: 'planning',
          start_date: '',
          end_date: '',
          registration_deadline: '',
          budget: 0,
          target_participants: 0,
          target_ideas: 0,
          success_metrics: '',
          theme: '',
          campaign_manager_id: '',
          challenge_id: '',
          department_id: '',
          deputy_id: '',
          sector_id: '',
          sector_ids: [],
          deputy_ids: [],
          department_ids: [],
          challenge_ids: [],
          partner_ids: [],
          stakeholder_ids: []
        },
        errors: {}
      });
    } catch (error) {
      console.error('Failed to save campaign:', error);
    }
  }, [validateForm, editingCampaign, state.formData, updateCampaign, createCampaign, onSuccess, onOpenChange, updateState]);

  // Load options on mount
  React.useEffect(() => {
    if (open) {
      loadCampaignOptions();
    }
  }, [open, loadCampaignOptions]);

  // Load campaign data for editing
  React.useEffect(() => {
    if (editingCampaign && open) {
      const loadEditingData = async () => {
        const links = await loadCampaignLinks(editingCampaign.id);
        updateState({
          formData: {
            ...editingCampaign,
            ...links
          }
        });
      };
      loadEditingData();
    }
  }, [editingCampaign, open, loadCampaignLinks, updateState]);

  // Memoized step navigation
  const nextStep = useCallback(() => {
    updateState({ currentStep: Math.min(state.currentStep + 1, 4) });
  }, [state.currentStep, updateState]);

  const prevStep = useCallback(() => {
    updateState({ currentStep: Math.max(state.currentStep - 1, 1) });
  }, [state.currentStep, updateState]);

  // Memoized multi-select handlers
  const handleMultiSelect = useCallback((field: keyof CampaignFormData, value: string, checked: boolean) => {
    const currentValues = (state.formData[field] as string[]) || [];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    updateFormData({ [field]: newValues });
  }, [state.formData, updateFormData]);

  // Memoized component sections for better performance
  const renderBasicInfo = useMemo(() => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title_ar">{t('titleArabic')} *</Label>
          <Input
            id="title_ar"
            value={state.formData.title_ar}
            onChange={(e) => updateFormData({ title_ar: e.target.value })}
            className={state.errors.title_ar ? 'border-red-500' : ''}
          />
          {state.errors.title_ar && (
            <p className="text-sm text-red-500 mt-1">{state.errors.title_ar}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="title_en">{t('titleEnglish')}</Label>
          <Input
            id="title_en"
            value={state.formData.title_en || ''}
            onChange={(e) => updateFormData({ title_en: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description_ar">{t('descriptionArabic')}</Label>
        <Textarea
          id="description_ar"
          value={state.formData.description_ar || ''}
          onChange={(e) => updateFormData({ description_ar: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="description_en">{t('descriptionEnglish')}</Label>
        <Textarea
          id="description_en"
          value={state.formData.description_en || ''}
          onChange={(e) => updateFormData({ description_en: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  ), [state.formData, state.errors, t, updateFormData]);

  const renderContent = useMemo(() => {
    switch (state.currentStep) {
      case 1:
        return renderBasicInfo;
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">{t('startDate')} *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={state.formData.start_date}
                  onChange={(e) => updateFormData({ start_date: e.target.value })}
                  className={state.errors.start_date ? 'border-red-500' : ''}
                />
                {state.errors.start_date && (
                  <p className="text-sm text-red-500 mt-1">{state.errors.start_date}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="end_date">{t('endDate')} *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={state.formData.end_date}
                  onChange={(e) => updateFormData({ end_date: e.target.value })}
                  className={state.errors.end_date ? 'border-red-500' : ''}
                />
                {state.errors.end_date && (
                  <p className="text-sm text-red-500 mt-1">{state.errors.end_date}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">{t('budget')}</Label>
                <Input
                  id="budget"
                  type="number"
                  value={state.formData.budget || 0}
                  onChange={(e) => updateFormData({ budget: parseFloat(e.target.value) || 0 })}
                />
              </div>
              
              <div>
                <Label htmlFor="target_participants">{t('targetParticipants')}</Label>
                <Input
                  id="target_participants"
                  type="number"
                  value={state.formData.target_participants || 0}
                  onChange={(e) => updateFormData({ target_participants: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('organizationalLinks')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{t('sectors')}</Label>
                <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                  {options.sectors.map((sector) => (
                    <div key={sector.id} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`sector-${sector.id}`}
                        checked={state.formData.sector_ids?.includes(sector.id) || false}
                        onCheckedChange={(checked) => 
                          handleMultiSelect('sector_ids', sector.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`sector-${sector.id}`} className="text-sm">
                        {language === 'ar' ? sector.name_ar : sector.name_en || sector.name_ar}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>{t('departments')}</Label>
                <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                  {options.departments.map((dept) => (
                    <div key={dept.id} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`dept-${dept.id}`}
                        checked={state.formData.department_ids?.includes(dept.id) || false}
                        onCheckedChange={(checked) => 
                          handleMultiSelect('department_ids', dept.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`dept-${dept.id}`} className="text-sm">
                        {language === 'ar' ? dept.name_ar : dept.name_en || dept.name_ar}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('partnerships')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{t('partners')}</Label>
                <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                  {options.partners.map((partner) => (
                    <div key={partner.id} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`partner-${partner.id}`}
                        checked={state.formData.partner_ids?.includes(partner.id) || false}
                        onCheckedChange={(checked) => 
                          handleMultiSelect('partner_ids', partner.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`partner-${partner.id}`} className="text-sm">
                        {language === 'ar' ? partner.name_ar : partner.name_en || partner.name_ar}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>{t('stakeholders')}</Label>
                <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                  {options.stakeholders.map((stakeholder) => (
                    <div key={stakeholder.id} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`stakeholder-${stakeholder.id}`}
                        checked={state.formData.stakeholder_ids?.includes(stakeholder.id) || false}
                        onCheckedChange={(checked) => 
                          handleMultiSelect('stakeholder_ids', stakeholder.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`stakeholder-${stakeholder.id}`} className="text-sm">
                        {language === 'ar' ? stakeholder.name_ar : stakeholder.name_en || stakeholder.name_ar}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return renderBasicInfo;
    }
  }, [state.currentStep, state.formData, state.errors, options, t, language, renderBasicInfo, updateFormData, handleMultiSelect]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingCampaign ? t('editCampaign') : t('createCampaign')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step <= state.currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step}
              </div>
            ))}
          </div>

          {/* Content */}
          {renderContent}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={state.currentStep === 1}
            >
              {t('previous')}
            </Button>
            
            <div className="space-x-2">
              {state.currentStep < 4 ? (
                <Button onClick={nextStep}>
                  {t('next')}
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading}
                >
                  {loading ? t('saving') : (editingCampaign ? t('update') : t('create'))}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

CampaignWizard.displayName = 'CampaignWizard';

export { CampaignWizard };