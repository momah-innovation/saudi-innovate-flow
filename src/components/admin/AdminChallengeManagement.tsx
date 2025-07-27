import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSystemLists } from "@/hooks/useSystemLists";
import { useToast } from "@/hooks/use-toast";
import { ChallengeSettings } from "./ChallengeSettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Target, 
  Calendar,
  DollarSign,
  AlertTriangle,
  Users,
  FileText,
  Settings,
  Building2,
  UserCheck,
  Briefcase,
  Search,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";

interface Challenge {
  id: string;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  status: string;
  priority_level: string;
  sensitivity_level: string;
  challenge_type?: string;
  start_date?: string;
  end_date?: string;
  estimated_budget?: number;
  kpi_alignment?: string;
  vision_2030_goal?: string;
  challenge_owner_id?: string;
  created_at: string;
}

interface FocusQuestion {
  id: string;
  challenge_id: string;
  question_text: string;
  question_text_ar?: string;
  question_type: string;
  order_sequence: number;
  is_sensitive: boolean;
}

interface Expert {
  id: string;
  user_id: string;
  expertise_areas: string[];
  experience_years: number;
  expert_level: string;
  profiles?: {
    name: string;
    name_ar?: string;
    email: string;
  };
}

interface Partner {
  id: string;
  name: string;
  name_ar?: string;
  partner_type: string;
  status: string;
  capabilities?: string[];
}

interface ChallengeExpert {
  id: string;
  expert_id: string;
  role_type: string;
  status: string;
  experts: Expert;
}

interface ChallengePartner {
  id: string;
  partner_id: string;
  partnership_type: string;
  status: string;
  funding_amount?: number;
  partners: Partner;
}

export const AdminChallengeManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { challengePriorityLevels, challengeSensitivityLevels, challengeTypes, challengeStatusOptions, focusQuestionTypes } = useSystemLists();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [focusQuestions, setFocusQuestions] = useState<FocusQuestion[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [challengeExperts, setChallengeExperts] = useState<ChallengeExpert[]>([]);
  const [challengePartners, setChallengePartners] = useState<ChallengePartner[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [domains, setDomains] = useState<any[]>([]);
  const [subDomains, setSubDomains] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [deputies, setDeputies] = useState<any[]>([]);
  const [selectedExperts, setSelectedExperts] = useState<string[]>([]);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [isTeamMember, setIsTeamMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("challenges");
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  
  // System settings
  const [systemSettings, setSystemSettings] = useState({
    maxBudget: 1000000,
    maxSubmissions: 10,
    textareaRows: 5,
    expertExpertisePreviewLimit: 2
  });
  
  // Form states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [isEditQuestionDialogOpen, setIsEditQuestionDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<FocusQuestion | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsChallenge, setSettingsChallenge] = useState<Challenge | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    title_ar: "",
    description: "",
    description_ar: "",
    status: "draft",
    priority_level: "medium",
    sensitivity_level: "normal",
    challenge_type: "",
    start_date: "",
    end_date: "",
    estimated_budget: "",
    kpi_alignment: "",
    vision_2030_goal: "",
    challenge_owner_id: "",
    assigned_expert_id: "",
    partner_organization_id: "",
    internal_team_notes: "",
    collaboration_details: "",
    sector_id: "",
    deputy_id: "",
    department_id: "",
    domain_id: "",
    sub_domain_id: "",
    service_id: ""
  });
  
  // Filtering states
  const [challengeFilter, setChallengeFilter] = useState('');
  const [challengeStatusFilter, setChallengeStatusFilter] = useState('all');
  const [challengePriorityFilter, setChallengePriorityFilter] = useState('all');
  const [questionFilter, setQuestionFilter] = useState('');
  const [questionTypeFilter, setQuestionTypeFilter] = useState('all');
  const [questionSensitivityFilter, setQuestionSensitivityFilter] = useState('all');
  
  const [questionFormData, setQuestionFormData] = useState({
    question_text: "",
    question_text_ar: "",
    question_type: "general",
    is_sensitive: false,
    order_sequence: 1
  });

  useEffect(() => {
    checkTeamMembership();
    fetchChallenges();
    fetchExperts();
    fetchPartners();
    fetchProfiles();
    fetchSectors();
    fetchOrganizationalStructure();
    fetchSystemSettings();
    if (selectedChallenge) {
      fetchFocusQuestions(selectedChallenge);
      fetchChallengeExperts(selectedChallenge);
      fetchChallengePartners(selectedChallenge);
    }
  }, [selectedChallenge]);

  const fetchSystemSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_key, setting_value')
        .in('setting_key', [
          'challenge_max_budget',
          'challenge_max_submissions_per_challenge',
          'challenge_textarea_rows',
          'expert_expertise_preview_limit'
        ]);

      if (error) throw error;

      const settings = data?.reduce((acc: any, setting) => {
        const value = typeof setting.setting_value === 'string' ? 
          parseInt(setting.setting_value) || 0 : 
          setting.setting_value || 0;
        
        switch (setting.setting_key) {
          case 'challenge_max_budget':
            acc.maxBudget = value;
            break;
          case 'challenge_max_submissions_per_challenge':
            acc.maxSubmissions = value;
            break;
          case 'challenge_textarea_rows':
            acc.textareaRows = value;
            break;
          case 'expert_expertise_preview_limit':
            acc.expertExpertisePreviewLimit = value;
            break;
        }
        return acc;
      }, {}) || {};

      setSystemSettings(prev => ({ ...prev, ...settings }));
    } catch (error) {
      console.error('Error fetching system settings:', error);
    }
  };

  const checkTeamMembership = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: teamMember } = await supabase
        .from('innovation_team_members')
        .select('id')
        .eq('user_id', user.id)
        .single();

      setIsTeamMember(!!teamMember);
    } catch (error) {
      console.error('Error checking team membership:', error);
    }
  };

  const fetchExperts = async () => {
    try {
      const { data, error } = await supabase
        .from('experts')
        .select(`
          id,
          user_id,
          expertise_areas,
          experience_years,
          expert_level
        `);

      if (error) throw error;
      
      // Fetch profiles separately to avoid relation issues
      const expertsWithProfiles = [];
      for (const expert of data || []) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, name_ar, email')
          .eq('id', expert.user_id)
          .single();
        
        expertsWithProfiles.push({
          ...expert,
          profiles: profile || { name: t('unknownExpert'), email: '' }
        });
      }
      
      setExperts(expertsWithProfiles);
    } catch (error) {
      console.error('Error fetching experts:', error);
    }
  };

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('id, name, name_ar, partner_type, status, capabilities')
        .eq('status', 'active');

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, name_ar, email, department, position, status')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const fetchSectors = async () => {
    try {
      const { data, error } = await supabase
        .from('sectors')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching sectors:', error);
        return;
      }

      setSectors(data || []);
    } catch (error) {
      console.error('Error fetching sectors:', error);
    }
  };

  const fetchOrganizationalStructure = async () => {
    try {
      const [deptData, domainData, subDomainData, serviceData, deputyData] = await Promise.all([
        supabase.from('departments').select('*').order('name'),
        supabase.from('domains').select('*').order('name'), 
        supabase.from('sub_domains').select('*').order('name'),
        supabase.from('services').select('*').order('name'),
        supabase.from('deputies').select('*').order('name')
      ]);

      setDepartments(deptData.data || []);
      setDomains(domainData.data || []);
      setSubDomains(subDomainData.data || []);
      setServices(serviceData.data || []);
      setDeputies(deputyData.data || []);
    } catch (error) {
      console.error('Error fetching organizational structure:', error);
    }
  };

  // Filter functions for cascading dropdowns
  const getFilteredDeputies = () => {
    if (!formData.sector_id) return [];
    return deputies.filter(deputy => deputy.sector_id === formData.sector_id);
  };

  const getFilteredDepartments = () => {
    if (!formData.deputy_id) return [];
    return departments.filter(dept => dept.deputy_id === formData.deputy_id);
  };

  const getFilteredDomains = () => {
    if (!formData.department_id) return [];
    return domains.filter(domain => domain.department_id === formData.department_id);
  };

  const getFilteredSubDomains = () => {
    if (!formData.domain_id) return [];
    return subDomains.filter(subDomain => subDomain.domain_id === formData.domain_id);
  };

  const getFilteredServices = () => {
    if (!formData.sub_domain_id) return [];
    return services.filter(service => service.sub_domain_id === formData.sub_domain_id);
  };

  // Handle cascading resets
  const handleSectorChange = (value: string) => {
    setFormData({
      ...formData,
      sector_id: value,
      deputy_id: "",
      department_id: "",
      domain_id: "",
      sub_domain_id: "",
      service_id: ""
    });
  };

  const handleDeputyChange = (value: string) => {
    setFormData({
      ...formData,
      deputy_id: value,
      department_id: "",
      domain_id: "",
      sub_domain_id: "",
      service_id: ""
    });
  };

  const handleDepartmentChange = (value: string) => {
    setFormData({
      ...formData,
      department_id: value,
      domain_id: "",
      sub_domain_id: "",
      service_id: ""
    });
  };

  const handleDomainChange = (value: string) => {
    setFormData({
      ...formData,
      domain_id: value,
      sub_domain_id: "",
      service_id: ""
    });
  };

  const handleSubDomainChange = (value: string) => {
    setFormData({
      ...formData,
      sub_domain_id: value,
      service_id: ""
    });
  };

  const fetchChallengeExperts = async (challengeId: string) => {
    try {
      const { data, error } = await supabase
        .from('challenge_experts')
        .select(`
          id,
          expert_id,
          role_type,
          status
        `)
        .eq('challenge_id', challengeId)
        .eq('status', 'active');

      if (error) throw error;
      
      // Fetch expert details separately
      const expertsWithDetails = [];
      for (const ce of data || []) {
        const { data: expert } = await supabase
          .from('experts')
          .select('id, user_id, expertise_areas, experience_years, expert_level')
          .eq('id', ce.expert_id)
          .single();
        
        if (expert) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, name_ar, email')
            .eq('id', expert.user_id)
            .single();
          
          expertsWithDetails.push({
            ...ce,
            experts: {
              ...expert,
              profiles: profile || { name: t('unknownExpert'), email: '' }
            }
          });
        }
      }
      
      setChallengeExperts(expertsWithDetails);
    } catch (error) {
      console.error('Error fetching challenge experts:', error);
    }
  };

  const fetchChallengePartners = async (challengeId: string) => {
    try {
      const { data, error } = await supabase
        .from('challenge_partners')
        .select(`
          id,
          partner_id,
          partnership_type,
          status,
          funding_amount,
          partners:partner_id (
            id,
            name,
            name_ar,
            partner_type,
            status,
            capabilities
          )
        `)
        .eq('challenge_id', challengeId)
        .eq('status', 'active');

      if (error) throw error;
      setChallengePartners(data || []);
    } catch (error) {
      console.error('Error fetching challenge partners:', error);
    }
  };

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      
      // Basic fields that everyone can see
      let selectFields = `
        id,
        title,
        title_ar,
        description,
        description_ar,
        status,
        priority_level,
        sensitivity_level,
        challenge_type,
        start_date,
        end_date,
        estimated_budget,
        kpi_alignment,
        vision_2030_goal,
        challenge_owner_id,
        created_at
      `;

      // Add team-only fields if user is a team member
      if (isTeamMember) {
        selectFields += `, assigned_expert_id, partner_organization_id, internal_team_notes, collaboration_details`;
      }

      const { data: challengesData, error } = await supabase
        .from('challenges')
        .select(selectFields)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching challenges:', error);
        toast({
          title: "Error",
          description: "Failed to fetch challenges. Please try again.",
          variant: "destructive",
        });
        setChallenges([]); // Set empty array on error
        return;
      }

      setChallenges(challengesData as any || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast({
        title: "Error",
        description: "Failed to fetch challenges. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFocusQuestions = async (challengeId: string) => {
    try {
      const { data: questionsData, error } = await supabase
        .from('focus_questions')
        .select('*')
        .eq('challenge_id', challengeId)
        .order('order_sequence', { ascending: true });

      if (error) {
        console.error('Error fetching focus questions:', error);
        return;
      }

      setFocusQuestions(questionsData || []);
    } catch (error) {
      console.error('Error fetching focus questions:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      title_ar: "",
      description: "",
      description_ar: "",
      status: "draft",
      priority_level: "medium",
      sensitivity_level: "normal",
      challenge_type: "",
      start_date: "",
      end_date: "",
      estimated_budget: "",
      kpi_alignment: "",
      vision_2030_goal: "",
      challenge_owner_id: "",
      assigned_expert_id: "",
      partner_organization_id: "",
      internal_team_notes: "",
      collaboration_details: "",
      sector_id: "",
      deputy_id: "",
      department_id: "",
      domain_id: "",
      sub_domain_id: "",
      service_id: ""
    });
    setSelectedExperts([]);
    setSelectedPartners([]);
  };

  const handleOpenCreateChallenge = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateChallenge = () => {
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const resetQuestionForm = () => {
    setQuestionFormData({
      question_text: "",
      question_text_ar: "",
      question_type: "general",
      is_sensitive: false,
      order_sequence: 1
    });
  };

  const handleOpenAddQuestion = () => {
    resetQuestionForm();
    setIsQuestionDialogOpen(true);
  };

  const handleCloseAddQuestion = () => {
    setIsQuestionDialogOpen(false);
    resetQuestionForm();
  };

  const handleCreateChallenge = async () => {
    try {
      const challengeData = {
        title: formData.title,
        title_ar: formData.title_ar || null,
        description: formData.description,
        description_ar: formData.description_ar || null,
        status: formData.status,
        priority_level: formData.priority_level,
        sensitivity_level: formData.sensitivity_level,
        challenge_type: formData.challenge_type || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        estimated_budget: formData.estimated_budget ? parseFloat(formData.estimated_budget) : null,
        kpi_alignment: formData.kpi_alignment || null,
        vision_2030_goal: formData.vision_2030_goal || null,
        created_by: '8066cfaf-4a91-4985-922b-74f6a286c441',
        challenge_owner_id: formData.challenge_owner_id || null
      };

      // Add team-only fields if user is a team member
      if (isTeamMember) {
        Object.assign(challengeData, {
          assigned_expert_id: formData.assigned_expert_id || null,
          partner_organization_id: formData.partner_organization_id || null,
          internal_team_notes: formData.internal_team_notes || null,
          collaboration_details: formData.collaboration_details || null
        });
      }

      const { data, error } = await supabase
        .from('challenges')
        .insert([challengeData])
        .select();

      if (error) {
        console.error('Error creating challenge:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to create challenge. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t('challengeCreated'),
        description: "New challenge has been successfully created.",
      });
      
      setIsCreateDialogOpen(false);
      resetForm();
      fetchChallenges();
    } catch (error) {
      console.error('Error creating challenge:', error);
      toast({
        title: "Error",
        description: "Failed to create challenge. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateQuestion = async () => {
    if (!selectedChallenge) return;
    
    try {
      const { data, error } = await supabase
        .from('focus_questions')
        .insert([{
          challenge_id: selectedChallenge,
          question_text: questionFormData.question_text,
          question_text_ar: questionFormData.question_text_ar || null,
          question_type: questionFormData.question_type,
          is_sensitive: questionFormData.is_sensitive,
          order_sequence: focusQuestions.length + 1
        }])
        .select();

      if (error) {
        console.error('Error creating focus question:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to create focus question. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Focus Question Added",
        description: "Focus question has been successfully added to the challenge.",
      });
      
      setIsQuestionDialogOpen(false);
      if (selectedChallenge) {
        fetchFocusQuestions(selectedChallenge);
      }
      resetQuestionForm();
    } catch (error) {
      console.error('Error creating focus question:', error);
      toast({
        title: "Error",
        description: "Failed to create focus question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditQuestion = (question: FocusQuestion) => {
    resetQuestionForm();
    setEditingQuestion(question);
    setQuestionFormData({
      question_text: question.question_text,
      question_text_ar: question.question_text_ar || "",
      question_type: question.question_type,
      is_sensitive: question.is_sensitive,
      order_sequence: question.order_sequence
    });
    setIsEditQuestionDialogOpen(true);
  };

  const handleCloseEditQuestion = () => {
    setIsEditQuestionDialogOpen(false);
    setEditingQuestion(null);
    resetQuestionForm();
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion || !questionFormData.question_text) {
      return;
    }

    try {
      const { error } = await supabase
        .from('focus_questions')
        .update({
          question_text: questionFormData.question_text,
          question_text_ar: questionFormData.question_text_ar || null,
          question_type: questionFormData.question_type,
          is_sensitive: questionFormData.is_sensitive,
          order_sequence: questionFormData.order_sequence,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingQuestion.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Focus question updated successfully.",
      });

      setIsEditQuestionDialogOpen(false);
      setEditingQuestion(null);
      if (selectedChallenge) {
        fetchFocusQuestions(selectedChallenge);
      }
      resetQuestionForm();

    } catch (error) {
      console.error('Error updating focus question:', error);
      toast({
        title: "Error",
        description: "Failed to update focus question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'closed': return 'outline';
      case 'archived': return 'destructive';
      default: return 'outline';
    }
  };

  const formatBudget = (budget?: number) => {
    if (!budget) return t('notSpecified');
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      notation: 'compact'
    }).format(budget);
  };

  const handleEditChallenge = (challenge: Challenge) => {
    // First reset the form to clear any previous data
    resetForm();
    
    // Then set the editing challenge data
    setFormData({
      title: challenge.title,
      title_ar: challenge.title_ar || "",
      description: challenge.description,
      description_ar: challenge.description_ar || "",
      status: challenge.status,
      priority_level: challenge.priority_level,
      sensitivity_level: challenge.sensitivity_level,
      challenge_type: challenge.challenge_type || "",
      start_date: challenge.start_date || "",
      end_date: challenge.end_date || "",
      estimated_budget: challenge.estimated_budget?.toString() || "",
      kpi_alignment: challenge.kpi_alignment || "",
      vision_2030_goal: challenge.vision_2030_goal || "",
      challenge_owner_id: (challenge as any).challenge_owner_id || "",
      assigned_expert_id: (challenge as any).assigned_expert_id || "",
      partner_organization_id: (challenge as any).partner_organization_id || "",
      internal_team_notes: (challenge as any).internal_team_notes || "",
      collaboration_details: (challenge as any).collaboration_details || "",
      sector_id: (challenge as any).sector_id || "",
      deputy_id: (challenge as any).deputy_id || "",
      department_id: (challenge as any).department_id || "",
      domain_id: (challenge as any).domain_id || "",
      sub_domain_id: (challenge as any).sub_domain_id || "",
      service_id: (challenge as any).service_id || ""
    });
    setIsCreateDialogOpen(true);
  };

  const handleChallengeSettings = (challenge: Challenge) => {
    setSettingsChallenge(challenge);
    setIsSettingsOpen(true);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('focus_questions')
        .delete()
        .eq('id', questionId);

      if (error) {
        console.error('Error deleting focus question:', error);
        toast({
          title: "Error",
          description: "Failed to delete focus question. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t('questionDeleted'),
        description: "Focus question has been successfully deleted.",
      });

      if (selectedChallenge) {
        fetchFocusQuestions(selectedChallenge);
      }
    } catch (error) {
      console.error('Error deleting focus question:', error);
      toast({
        title: "Error",
        description: "Failed to delete focus question. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter functions
  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(challengeFilter.toLowerCase()) ||
                         (challenge.title_ar && challenge.title_ar.includes(challengeFilter));
    const matchesStatus = challengeStatusFilter === 'all' || challenge.status === challengeStatusFilter;
    const matchesPriority = challengePriorityFilter === 'all' || challenge.priority_level === challengePriorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const filteredFocusQuestions = focusQuestions.filter(question => {
    const matchesSearch = question.question_text.toLowerCase().includes(questionFilter.toLowerCase()) ||
                         (question.question_text_ar && question.question_text_ar.includes(questionFilter));
    const matchesType = questionTypeFilter === 'all' || question.question_type === questionTypeFilter;
    const matchesSensitivity = questionSensitivityFilter === 'all' || 
                              (questionSensitivityFilter === 'sensitive' && question.is_sensitive) ||
                              (questionSensitivityFilter === 'normal' && !question.is_sensitive);
    
    return matchesSearch && matchesType && matchesSensitivity;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Challenge Management</h1>
          <p className="text-muted-foreground">
            Create and manage innovation challenges for your organization
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/focus-questions')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Manage Focus Questions
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
            if (open) {
              handleOpenCreateChallenge();
            } else {
              handleCloseCreateChallenge();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenCreateChallenge}>
                <Plus className="h-4 w-4 mr-2" />
                Create Challenge
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{formData.title ? t('editChallenge') : t('createNewChallenge')}</DialogTitle>
              <DialogDescription>
                {formData.title ? t('updateChallengeDetails') : t('createInnovationChallenge')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title (English) *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Challenge title in English"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_ar">Title (Arabic)</Label>
                  <Input
                    id="title_ar"
                    value={formData.title_ar}
                    onChange={(e) => setFormData({...formData, title_ar: e.target.value})}
                    placeholder="عنوان التحدي بالعربية"
                    dir="rtl"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (English) *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed description of the challenge"
                  rows={systemSettings.textareaRows}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description_ar">Description (Arabic)</Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                  placeholder="وصف مفصل للتحدي"
                  rows={systemSettings.textareaRows}
                  dir="rtl"
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {challengeStatusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select value={formData.priority_level} onValueChange={(value) => setFormData({...formData, priority_level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {challengePriorityLevels.map((level) => (
                        <SelectItem key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sensitivity">Sensitivity Level</Label>
                  <Select value={formData.sensitivity_level} onValueChange={(value) => setFormData({...formData, sensitivity_level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {challengeSensitivityLevels.map((level) => (
                        <SelectItem key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="challenge_type">Challenge Type</Label>
                  <Select value={formData.challenge_type} onValueChange={(value) => setFormData({...formData, challenge_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {challengeTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">Estimated Budget (SAR)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.estimated_budget}
                    onChange={(e) => setFormData({...formData, estimated_budget: e.target.value})}
                    placeholder="500000"
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vision_2030">Vision 2030 Alignment</Label>
                <Textarea
                  id="vision_2030"
                  value={formData.vision_2030_goal}
                  onChange={(e) => setFormData({...formData, vision_2030_goal: e.target.value})}
                  placeholder="How this challenge aligns with Saudi Vision 2030"
                  rows={systemSettings.textareaRows - 2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kpi">Success Metrics & KPIs</Label>
                <Textarea
                  id="kpi"
                  value={formData.kpi_alignment}
                  onChange={(e) => setFormData({...formData, kpi_alignment: e.target.value})}
                  placeholder="Define measurable success criteria and KPIs"
                  rows={systemSettings.textareaRows - 2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenge_owner">Challenge Owner</Label>
                <Select value={formData.challenge_owner_id} onValueChange={(value) => setFormData({...formData, challenge_owner_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select challenge owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.name} {profile.department && `(${profile.department})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Organizational Linking */}
              <Separator className="my-6" />
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  Organizational Structure
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sector">Sector</Label>
                    <Select value={formData.sector_id} onValueChange={handleSectorChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map((sector) => (
                          <SelectItem key={sector.id} value={sector.id}>
                            {sector.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deputy">Deputyship</Label>
                    <Select 
                      value={formData.deputy_id} 
                      onValueChange={handleDeputyChange}
                      disabled={!formData.sector_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={formData.sector_id ? "Select deputyship" : "Select sector first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {getFilteredDeputies().map((deputy) => (
                          <SelectItem key={deputy.id} value={deputy.id}>
                            {deputy.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select 
                      value={formData.department_id} 
                      onValueChange={handleDepartmentChange}
                      disabled={!formData.deputy_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={formData.deputy_id ? "Select department" : "Select deputyship first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {getFilteredDepartments().map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Select 
                      value={formData.domain_id} 
                      onValueChange={handleDomainChange}
                      disabled={!formData.department_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={formData.department_id ? "Select domain" : "Select department first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {getFilteredDomains().map((domain) => (
                          <SelectItem key={domain.id} value={domain.id}>
                            {domain.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sub_domain">Sub-Domain</Label>
                    <Select 
                      value={formData.sub_domain_id} 
                      onValueChange={handleSubDomainChange}
                      disabled={!formData.domain_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={formData.domain_id ? "Select sub-domain" : "Select domain first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {getFilteredSubDomains().map((subDomain) => (
                          <SelectItem key={subDomain.id} value={subDomain.id}>
                            {subDomain.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service">Service</Label>
                    <Select 
                      value={formData.service_id} 
                      onValueChange={(value) => setFormData({...formData, service_id: value})}
                      disabled={!formData.sub_domain_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={formData.sub_domain_id ? "Select service" : "Select sub-domain first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {getFilteredServices().map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Team-only fields - only visible to team members */}
              {isTeamMember && (
                <>
                  <Separator className="my-6" />
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Users className="h-4 w-4" />
                      Team Management (Internal Only)
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="assigned_expert">Primary Expert (Legacy)</Label>
                        <Select 
                          value={formData.assigned_expert_id} 
                          onValueChange={(value) => setFormData({...formData, assigned_expert_id: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select primary expert" />
                          </SelectTrigger>
                          <SelectContent>
                            
                            {experts.map((expert) => (
                              <SelectItem key={expert.id} value={expert.id}>
                                <div className="flex items-center gap-2">
                                  <UserCheck className="h-4 w-4" />
                                  {expert.profiles?.name || 'Expert'} 
                                  <span className="text-xs text-muted-foreground">
                                    ({expert.expertise_areas?.slice(0, systemSettings.expertExpertisePreviewLimit).join(', ')})
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="partner_org">Primary Partner (Legacy)</Label>
                        <Select 
                          value={formData.partner_organization_id} 
                          onValueChange={(value) => setFormData({...formData, partner_organization_id: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select primary partner" />
                          </SelectTrigger>
                          <SelectContent>
                            
                            {partners.map((partner) => (
                              <SelectItem key={partner.id} value={partner.id}>
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-4 w-4" />
                                  {partner.name}
                                  <span className="text-xs text-muted-foreground">
                                    ({partner.partner_type})
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Multi-select for experts and partners */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Challenge Experts (Multi-select)</Label>
                        <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
                          {experts.map((expert) => (
                            <div key={expert.id} className="flex items-center space-x-2 p-1">
                              <input
                                type="checkbox"
                                id={`expert-${expert.id}`}
                                checked={selectedExperts.includes(expert.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedExperts([...selectedExperts, expert.id]);
                                  } else {
                                    setSelectedExperts(selectedExperts.filter(id => id !== expert.id));
                                  }
                                }}
                                className="rounded border-gray-300"
                              />
                              <label htmlFor={`expert-${expert.id}`} className="text-sm flex-1 cursor-pointer">
                                {expert.profiles?.name || 'Expert'} - {expert.expertise_areas?.slice(0, systemSettings.expertExpertisePreviewLimit).join(', ')}
                              </label>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {selectedExperts.length} expert(s) selected
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Challenge Partners (Multi-select)</Label>
                        <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
                          {partners.map((partner) => (
                            <div key={partner.id} className="flex items-center space-x-2 p-1">
                              <input
                                type="checkbox"
                                id={`partner-${partner.id}`}
                                checked={selectedPartners.includes(partner.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedPartners([...selectedPartners, partner.id]);
                                  } else {
                                    setSelectedPartners(selectedPartners.filter(id => id !== partner.id));
                                  }
                                }}
                                className="rounded border-gray-300"
                              />
                              <label htmlFor={`partner-${partner.id}`} className="text-sm flex-1 cursor-pointer">
                                {partner.name} ({partner.partner_type})
                              </label>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {selectedPartners.length} partner(s) selected
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="internal_notes">Internal Team Notes</Label>
                      <Textarea
                        id="internal_notes"
                        value={formData.internal_team_notes}
                        onChange={(e) => setFormData({...formData, internal_team_notes: e.target.value})}
                        placeholder="Internal notes for team coordination and planning..."
                        rows={systemSettings.textareaRows - 2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="collaboration_details">Collaboration Details</Label>
                      <Textarea
                        id="collaboration_details"
                        value={formData.collaboration_details}
                        onChange={(e) => setFormData({...formData, collaboration_details: e.target.value})}
                        placeholder="Details about partnerships, expert involvement, and collaboration approach..."
                        rows={systemSettings.textareaRows - 2}
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCloseCreateChallenge}>
                  Cancel
                </Button>
                <Button onClick={handleCreateChallenge} disabled={!formData.title || !formData.description}>
                  {formData.title && challenges.some(c => c.title === formData.title) ? t('updateChallenge') : t('createChallenge')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="challenges">{t('challengesTab')}</TabsTrigger>
          <TabsTrigger value="questions">{t('focusQuestionsTab')}</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-4">
          {/* Challenge Filters */}
          <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-1 min-w-64">
              <Input
                placeholder={t('searchChallenges')}
                value={challengeFilter}
                onChange={(e) => setChallengeFilter(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={challengeStatusFilter} onValueChange={setChallengeStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatuses')}</SelectItem>
                {challengeStatusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={challengePriorityFilter} onValueChange={setChallengePriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('filterByPriorityLevel')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allPriorities')}</SelectItem>
                {challengePriorityLevels.map((level) => (
                  <SelectItem key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Challenges List */}
          <div className="grid gap-4">
            {filteredChallenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      {challenge.title_ar && (
                        <CardDescription className="text-right" dir="rtl">
                          {challenge.title_ar}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant={getStatusColor(challenge.status)}>
                        {challenge.status}
                      </Badge>
                      <Badge variant={getPriorityColor(challenge.priority_level)}>
                        {challenge.priority_level}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {challenge.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {challenge.challenge_type && (
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          <span className="capitalize">{challenge.challenge_type}</span>
                        </div>
                      )}
                      {challenge.estimated_budget && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{formatBudget(challenge.estimated_budget)}</span>
                        </div>
                      )}
                      {challenge.end_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {new Date(challenge.end_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Team-only information */}
                    {isTeamMember && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-md space-y-2">
                        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                          <Users className="h-3 w-3" />
                          Team Information
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          {(challenge as any).assigned_expert_id && (
                            <div className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4 text-blue-500" />
                              <span className="text-xs">Expert Assigned</span>
                            </div>
                          )}
                          {(challenge as any).partner_organization_id && (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-green-500" />
                              <span className="text-xs">Partner Linked</span>
                            </div>
                          )}
                          {(challenge as any).internal_team_notes && (
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-orange-500" />
                              <span className="text-xs">Internal Notes</span>
                            </div>
                          )}
                          {(challenge as any).collaboration_details && (
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-purple-500" />
                              <span className="text-xs">Collaboration Details</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedChallenge(challenge.id);
                          setActiveTab("questions");
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Manage Questions
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/challenges/${challenge.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditChallenge(challenge)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      {isTeamMember && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleChallengeSettings(challenge)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredChallenges.length === 0 && (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No challenges found</h3>
                <p className="text-muted-foreground">
                  {challengeFilter || challengeStatusFilter !== 'all' || challengePriorityFilter !== 'all' 
                    ? "No challenges match your current filters. Try adjusting your search criteria."
                    : "Create your first challenge to get started."
                  }
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          {selectedChallenge ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Focus Questions</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage focus questions for the selected challenge
                  </p>
                </div>
                
                <Dialog open={isQuestionDialogOpen} onOpenChange={(open) => {
                  if (open) {
                    handleOpenAddQuestion();
                  } else {
                    handleCloseAddQuestion();
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button onClick={handleOpenAddQuestion}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Focus Question</DialogTitle>
                      <DialogDescription>
                        Add a guiding question to help innovators develop their solutions.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="question_text">Question (English) *</Label>
                        <Textarea
                          id="question_text"
                          value={questionFormData.question_text}
                          onChange={(e) => setQuestionFormData({...questionFormData, question_text: e.target.value})}
                          placeholder="What specific problem should this solution address?"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="question_text_ar">Question (Arabic)</Label>
                        <Textarea
                          id="question_text_ar"
                          value={questionFormData.question_text_ar}
                          onChange={(e) => setQuestionFormData({...questionFormData, question_text_ar: e.target.value})}
                          placeholder="ما هي المشكلة المحددة التي يجب أن يعالجها هذا الحل؟"
                          dir="rtl"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="question_type">Question Type</Label>
                        <Select 
                          value={questionFormData.question_type} 
                          onValueChange={(value) => setQuestionFormData({...questionFormData, question_type: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {focusQuestionTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_sensitive_tab"
                          checked={questionFormData.is_sensitive}
                          onCheckedChange={(checked) => setQuestionFormData({...questionFormData, is_sensitive: checked})}
                        />
                        <Label htmlFor="is_sensitive_tab" className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Sensitive Question
                        </Label>
                      </div>
                    
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={handleCloseAddQuestion}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateQuestion} disabled={!questionFormData.question_text}>
                          Add Question
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              {/* Focus Questions Filters */}
              <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex-1 min-w-64">
                  <Input
                    placeholder="Search focus questions..."
                    value={questionFilter}
                    onChange={(e) => setQuestionFilter(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={questionTypeFilter} onValueChange={setQuestionTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {focusQuestionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={questionSensitivityFilter} onValueChange={setQuestionSensitivityFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by Sensitivity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Questions</SelectItem>
                    {challengeSensitivityLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                {filteredFocusQuestions.map((question, index) => (
                  <Card key={question.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">#{index + 1}</Badge>
                            <Badge variant="secondary">{question.question_type.replace('_', ' ')}</Badge>
                            {question.is_sensitive && (
                              <Badge variant="destructive">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Sensitive
                              </Badge>
                            )}
                          </div>
                          <p className="font-medium">{question.question_text}</p>
                          {question.question_text_ar && (
                            <p className="text-sm text-muted-foreground" dir="rtl">
                              {question.question_text_ar}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 ml-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditQuestion(question)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredFocusQuestions.length === 0 && focusQuestions.length > 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No questions match your filter</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria or filters.
                    </p>
                  </div>
                )}
                
                {focusQuestions.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No focus questions yet</h3>
                    <p className="text-muted-foreground">
                      Add focus questions to guide innovators in developing their solutions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a challenge</h3>
              <p className="text-muted-foreground">
                Choose a challenge from the Challenges tab to manage its focus questions.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Edit Focus Question Dialog */}
      <Dialog open={isEditQuestionDialogOpen} onOpenChange={(open) => {
        if (!open) {
          handleCloseEditQuestion();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Focus Question</DialogTitle>
            <DialogDescription>
              Update the focus question details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_question_text">Question (English) *</Label>
              <Textarea
                id="edit_question_text"
                value={questionFormData.question_text}
                onChange={(e) => setQuestionFormData({...questionFormData, question_text: e.target.value})}
                placeholder="What specific problem should this solution address?"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_question_text_ar">Question (Arabic)</Label>
              <Textarea
                id="edit_question_text_ar"
                value={questionFormData.question_text_ar}
                onChange={(e) => setQuestionFormData({...questionFormData, question_text_ar: e.target.value})}
                placeholder="ما هي المشكلة المحددة التي يجب أن يعالجها هذا الحل؟"
                dir="rtl"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_question_type">Question Type</Label>
              <Select 
                value={questionFormData.question_type} 
                onValueChange={(value) => setQuestionFormData({...questionFormData, question_type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {focusQuestionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_order_sequence">Order</Label>
              <Input
                id="edit_order_sequence"
                type="number"
                value={questionFormData.order_sequence}
                onChange={(e) => setQuestionFormData({...questionFormData, order_sequence: parseInt(e.target.value) || 1})}
                min="1"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit_is_sensitive"
                checked={questionFormData.is_sensitive}
                onCheckedChange={(checked) => setQuestionFormData({...questionFormData, is_sensitive: checked})}
              />
              <Label htmlFor="edit_is_sensitive" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Sensitive Question
              </Label>
            </div>
          
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCloseEditQuestion}>
                Cancel
              </Button>
              <Button onClick={handleUpdateQuestion} disabled={!questionFormData.question_text}>
                Update Question
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Challenge Settings Dialog */}
      {settingsChallenge && (
        <ChallengeSettings
          challenge={settingsChallenge}
          isOpen={isSettingsOpen}
          onClose={() => {
            setIsSettingsOpen(false);
            setSettingsChallenge(null);
          }}
          onUpdate={() => {
            fetchChallenges();
            setIsSettingsOpen(false);
            setSettingsChallenge(null);
          }}
        />
      )}
    </div>
  );
};