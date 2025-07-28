import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MultiStepForm } from "@/components/ui/multi-step-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Building, User, Mail, Phone, Users, Target } from "lucide-react";

interface Stakeholder {
  id?: string;
  name: string;
  organization: string;
  position: string;
  email: string;
  phone?: string;
  stakeholder_type: string;
  influence_level: string;
  interest_level: string;
  engagement_status: string;
  notes?: string;
}

interface StakeholderWizardProps {
  isOpen: boolean;
  onClose: () => void;
  stakeholder?: Stakeholder | null;
  onSave: () => void;
}

export function StakeholderWizard({
  isOpen,
  onClose,
  stakeholder,
  onSave,
}: StakeholderWizardProps) {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    position: "",
    email: "",
    phone: "",
    stakeholder_type: "government",
    influence_level: "medium",
    interest_level: "medium",
    engagement_status: "neutral",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Predefined options
  const stakeholderTypes = [
    { value: "government", label: "Government" },
    { value: "private_sector", label: "Private Sector" },
    { value: "academic", label: "Academic" },
    { value: "ngo", label: "NGO/Non-Profit" },
    { value: "community", label: "Community" },
    { value: "international", label: "International" },
  ];

  const influenceLevels = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const interestLevels = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const engagementStatuses = [
    { value: "supporter", label: "Supporter" },
    { value: "active", label: "Active" },
    { value: "neutral", label: "Neutral" },
    { value: "passive", label: "Passive" },
    { value: "resistant", label: "Resistant" },
  ];

  useEffect(() => {
    if (stakeholder) {
      setFormData({
        name: stakeholder.name || "",
        organization: stakeholder.organization || "",
        position: stakeholder.position || "",
        email: stakeholder.email || "",
        phone: stakeholder.phone || "",
        stakeholder_type: stakeholder.stakeholder_type || "government",
        influence_level: stakeholder.influence_level || "medium",
        interest_level: stakeholder.interest_level || "medium",
        engagement_status: stakeholder.engagement_status || "neutral",
        notes: stakeholder.notes || "",
      });
    } else {
      setFormData({
        name: "",
        organization: "",
        position: "",
        email: "",
        phone: "",
        stakeholder_type: "government",
        influence_level: "medium",
        interest_level: "medium",
        engagement_status: "neutral",
        notes: "",
      });
    }
    setErrors({});
  }, [stakeholder, isOpen]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      // Basic Information validation
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      }
      if (!formData.organization.trim()) {
        newErrors.organization = "Organization is required";
      }
      if (!formData.position.trim()) {
        newErrors.position = "Position is required";
      }
    }

    if (step === 1) {
      // Contact Information validation
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<boolean> => {
    if (!validateStep(0) || !validateStep(1)) {
      return false;
    }

    setIsSubmitting(true);

    try {
      const stakeholderData = {
        name: formData.name.trim(),
        organization: formData.organization.trim(),
        position: formData.position.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        stakeholder_type: formData.stakeholder_type,
        influence_level: formData.influence_level,
        interest_level: formData.interest_level,
        engagement_status: formData.engagement_status,
        notes: formData.notes.trim() || null,
      };

      if (stakeholder?.id) {
        // Update existing stakeholder
        const { error } = await supabase
          .from("stakeholders")
          .update(stakeholderData)
          .eq("id", stakeholder.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Stakeholder updated successfully",
        });
      } else {
        // Create new stakeholder
        const { error } = await supabase
          .from("stakeholders")
          .insert([stakeholderData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Stakeholder created successfully",
        });
      }

      onSave();
      onClose();
      return true;
    } catch (error) {
      console.error("Error saving stakeholder:", error);
      toast({
        title: "Error",
        description: "Failed to save stakeholder. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleComplete = async () => {
    return await handleSubmit();
  };

  const steps = [
    {
      id: "basic-info",
      title: "Basic Information",
      description: "Enter the stakeholder's basic details",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                placeholder="Enter stakeholder name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization *</Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => updateFormData("organization", e.target.value)}
                placeholder="Enter organization name"
                className={errors.organization ? "border-destructive" : ""}
              />
              {errors.organization && (
                <p className="text-sm text-destructive">{errors.organization}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => updateFormData("position", e.target.value)}
                placeholder="Enter position/role"
                className={errors.position ? "border-destructive" : ""}
              />
              {errors.position && (
                <p className="text-sm text-destructive">{errors.position}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stakeholder_type">Stakeholder Type</Label>
              <Select
                value={formData.stakeholder_type}
                onValueChange={(value) => updateFormData("stakeholder_type", value)}
              >
                <SelectTrigger id="stakeholder_type">
                  <SelectValue placeholder="Select stakeholder type" />
                </SelectTrigger>
                <SelectContent>
                  {stakeholderTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ),
      validation: () => validateStep(0),
    },
    {
      id: "contact-info",
      title: "Contact Information",
      description: "Add contact details",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                placeholder="Enter email address"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
                placeholder="Enter phone number (optional)"
              />
            </div>
          </div>
        </div>
      ),
      validation: () => validateStep(1),
    },
    {
      id: "engagement-details",
      title: "Engagement Details",
      description: "Define influence and engagement levels",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="influence_level">Influence Level</Label>
              <Select
                value={formData.influence_level}
                onValueChange={(value) => updateFormData("influence_level", value)}
              >
                <SelectTrigger id="influence_level">
                  <SelectValue placeholder="Select influence level" />
                </SelectTrigger>
                <SelectContent>
                  {influenceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interest_level">Interest Level</Label>
              <Select
                value={formData.interest_level}
                onValueChange={(value) => updateFormData("interest_level", value)}
              >
                <SelectTrigger id="interest_level">
                  <SelectValue placeholder="Select interest level" />
                </SelectTrigger>
                <SelectContent>
                  {interestLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="engagement_status">Engagement Status</Label>
              <Select
                value={formData.engagement_status}
                onValueChange={(value) => updateFormData("engagement_status", value)}
              >
                <SelectTrigger id="engagement_status">
                  <SelectValue placeholder="Select engagement status" />
                </SelectTrigger>
                <SelectContent>
                  {engagementStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "additional-notes",
      title: "Additional Notes",
      description: "Add any additional information or notes",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateFormData("notes", e.target.value)}
              placeholder="Enter any additional notes about this stakeholder..."
              rows={4}
              className="resize-none"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <MultiStepForm
      isOpen={isOpen}
      onClose={onClose}
      title={stakeholder ? "Edit Stakeholder" : "Add New Stakeholder"}
      steps={steps}
      onComplete={handleComplete}
    />
  );
}