import { z } from "zod";

// ===========================
// COMMON VALIDATION SCHEMAS
// ===========================

export const UUIDSchema = z.string().uuid("معرف غير صحيح");

export const EmailSchema = z.string().email("البريد الإلكتروني غير صحيح");

export const DateSchema = z.string().refine(
  (date) => !isNaN(Date.parse(date)),
  "تاريخ غير صحيح"
);

export const BudgetSchema = z.number()
  .min(0, "الميزانية يجب أن تكون أكبر من الصفر")
  .max(10000000, "الميزانية تتجاوز الحد الأقصى المسموح");

export const PhoneSchema = z.string()
  .regex(/^[+]?[\d\s\-()]+$/, "رقم هاتف غير صحيح")
  .min(8, "رقم الهاتف قصير جداً")
  .max(15, "رقم الهاتف طويل جداً");

export const URLSchema = z.string().url("رابط غير صحيح");

// ===========================
// CHALLENGE VALIDATION SCHEMAS
// ===========================

export const ChallengeFormSchema = z.object({
  title_ar: z.string()
    .min(10, "العنوان يجب أن يكون 10 أحرف على الأقل")
    .max(200, "العنوان لا يجب أن يتجاوز 200 حرف"),
  
  description_ar: z.string()
    .min(50, "الوصف يجب أن يكون 50 حرف على الأقل")
    .max(2000, "الوصف لا يجب أن يتجاوز 2000 حرف"),
  
  status: z.enum(['draft', 'active', 'completed', 'cancelled', 'on_hold']),
  
  priority_level: z.enum(['low', 'medium', 'high', 'urgent']),
  
  sensitivity_level: z.enum(['public', 'internal', 'confidential', 'restricted']),
  
  challenge_type: z.string().optional(),
  
  start_date: DateSchema.optional(),
  
  end_date: DateSchema.optional(),
  
  estimated_budget: BudgetSchema.optional(),
  
  actual_budget: BudgetSchema.optional(),
  
  vision_2030_goal: z.string().max(500).optional(),
  
  kpi_alignment: z.string().max(500).optional(),
  
  collaboration_details: z.string().max(1000).optional(),
  
  sector_id: UUIDSchema.optional(),
  department_id: UUIDSchema.optional(),
  deputy_id: UUIDSchema.optional(),
  domain_id: UUIDSchema.optional(),
  sub_domain_id: UUIDSchema.optional(),
  service_id: UUIDSchema.optional()
}).refine(
  (data) => {
    if (data.start_date && data.end_date) {
      return new Date(data.start_date) <= new Date(data.end_date);
    }
    return true;
  },
  {
    message: "تاريخ البداية يجب أن يكون قبل تاريخ النهاية",
    path: ["end_date"]
  }
).refine(
  (data) => {
    if (data.estimated_budget && data.actual_budget) {
      return data.actual_budget <= data.estimated_budget * 1.5; // Allow 50% over budget
    }
    return true;
  },
  {
    message: "الميزانية الفعلية تتجاوز الحد المسموح",
    path: ["actual_budget"]
  }
);

// ===========================
// IDEA VALIDATION SCHEMAS
// ===========================

export const IdeaFormSchema = z.object({
  title_ar: z.string()
    .min(10, "العنوان يجب أن يكون 10 أحرف على الأقل")
    .max(150, "العنوان لا يجب أن يتجاوز 150 حرف"),
  
  description_ar: z.string()
    .min(50, "الوصف يجب أن يكون 50 حرف على الأقل")
    .max(1500, "الوصف لا يجب أن يتجاوز 1500 حرف"),
  
  status: z.enum(['draft', 'submitted', 'under_review', 'approved', 'rejected', 'in_development', 'implemented']),
  
  maturity_level: z.enum(['concept', 'prototype', 'pilot', 'scaled']),
  
  challenge_id: UUIDSchema.optional(),
  
  focus_question_id: UUIDSchema.optional(),
  
  solution_approach: z.string().max(1000).optional(),
  
  implementation_plan: z.string().max(1000).optional(),
  
  expected_impact: z.string().max(800).optional(),
  
  resource_requirements: z.string().max(600).optional(),
  
  estimated_timeline: z.string().max(200).optional(),
  
  collaboration_open: z.boolean().default(false),
  
  visibility_level: z.enum(['public', 'internal', 'restricted']).default('internal')
}).refine(
  (data) => {
    // If not draft, challenge_id and focus_question_id are required
    if (data.status !== 'draft') {
      return data.challenge_id && data.focus_question_id;
    }
    return true;
  },
  {
    message: "التحدي والسؤال المحوري مطلوبان للأفكار غير المسودات",
    path: ["challenge_id"]
  }
);

// ===========================
// EXPERT VALIDATION SCHEMAS
// ===========================

export const ExpertFormSchema = z.object({
  user_id: UUIDSchema,
  
  expertise_areas: z.array(z.string())
    .min(1, "يجب تحديد مجال خبرة واحد على الأقل")
    .max(10, "لا يمكن تحديد أكثر من 10 مجالات خبرة"),
  
  expert_level: z.enum(['junior', 'senior', 'lead', 'principal']),
  
  availability_status: z.enum(['available', 'busy', 'unavailable']),
  
  hourly_rate: z.number().min(0).max(10000).optional(),
  
  bio: z.string().max(1000).optional(),
  
  years_of_experience: z.number()
    .min(0, "سنوات الخبرة لا يمكن أن تكون سالبة")
    .max(50, "سنوات الخبرة تتجاوز الحد المسموح").optional(),
  
  certification_level: z.string().max(100).optional(),
  
  specialization_tags: z.array(z.string()).max(20).optional(),
  
  max_concurrent_projects: z.number()
    .min(1, "يجب أن يكون الحد الأدنى مشروع واحد")
    .max(20, "الحد الأقصى 20 مشروع").optional(),
  
  preferred_project_types: z.array(z.string()).max(15).optional(),
  
  language_preferences: z.array(z.string()).max(10).optional()
});

// ===========================
// PARTNER VALIDATION SCHEMAS
// ===========================

export const PartnerFormSchema = z.object({
  name: z.string()
    .min(2, "اسم الشريك يجب أن يكون حرفين على الأقل")
    .max(100, "اسم الشريك لا يجب أن يتجاوز 100 حرف"),
  
  name_ar: z.string()
    .min(2, "الاسم بالعربية يجب أن يكون حرفين على الأقل")
    .max(100, "الاسم بالعربية لا يجب أن يتجاوز 100 حرف").optional(),
  
  partnership_type: z.enum(['strategic', 'operational', 'technical', 'financial', 'academic']),
  
  partnership_status: z.enum(['active', 'pending', 'inactive', 'terminated']),
  
  contact_email: EmailSchema.optional(),
  
  contact_phone: PhoneSchema.optional(),
  
  website: URLSchema.optional(),
  
  description: z.string().max(1000).optional(),
  
  services_offered: z.array(z.string()).max(20).optional(),
  
  expertise_areas: z.array(z.string()).max(15).optional(),
  
  logo_url: URLSchema.optional()
});

// ===========================
// EVENT VALIDATION SCHEMAS
// ===========================

export const EventFormSchema = z.object({
  title_ar: z.string()
    .min(5, "عنوان الفعالية يجب أن يكون 5 أحرف على الأقل")
    .max(150, "عنوان الفعالية لا يجب أن يتجاوز 150 حرف"),
  
  description_ar: z.string()
    .min(20, "وصف الفعالية يجب أن يكون 20 حرف على الأقل")
    .max(1000, "وصف الفعالية لا يجب أن يتجاوز 1000 حرف").optional(),
  
  event_type: z.enum(['workshop', 'seminar', 'conference', 'hackathon', 'competition', 'networking', 'training']),
  
  event_date: DateSchema,
  
  end_date: DateSchema.optional(),
  
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "وقت البداية غير صحيح").optional(),
  
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "وقت النهاية غير صحيح").optional(),
  
  location: z.string().max(200).optional(),
  
  virtual_link: URLSchema.optional(),
  
  format: z.enum(['in_person', 'virtual', 'hybrid']),
  
  max_participants: z.number()
    .min(1, "الحد الأدنى مشارك واحد")
    .max(10000, "الحد الأقصى 10,000 مشارك").optional(),
  
  status: z.enum(['draft', 'published', 'ongoing', 'completed', 'cancelled']),
  
  budget: BudgetSchema.optional(),
  
  event_visibility: z.enum(['public', 'internal', 'restricted']).default('public'),
  
  event_category: z.string().max(50).optional(),
  
  campaign_id: UUIDSchema.optional(),
  challenge_id: UUIDSchema.optional(),
  sector_id: UUIDSchema.optional()
}).refine(
  (data) => {
    if (data.event_date && data.end_date) {
      return new Date(data.event_date) <= new Date(data.end_date);
    }
    return true;
  },
  {
    message: "تاريخ البداية يجب أن يكون قبل تاريخ النهاية",
    path: ["end_date"]
  }
).refine(
  (data) => {
    if (data.format === 'virtual' && !data.virtual_link) {
      return false;
    }
    return true;
  },
  {
    message: "رابط الفعالية الافتراضية مطلوب للفعاليات الافتراضية",
    path: ["virtual_link"]
  }
).refine(
  (data) => {
    if (data.format === 'in_person' && !data.location) {
      return false;
    }
    return true;
  },
  {
    message: "موقع الفعالية مطلوب للفعاليات الحضورية",
    path: ["location"]
  }
);

// ===========================
// CAMPAIGN VALIDATION SCHEMAS
// ===========================

export const CampaignFormSchema = z.object({
  title_ar: z.string()
    .min(5, "عنوان الحملة يجب أن يكون 5 أحرف على الأقل")
    .max(150, "عنوان الحملة لا يجب أن يتجاوز 150 حرف"),
  
  description_ar: z.string()
    .min(20, "وصف الحملة يجب أن يكون 20 حرف على الأقل")
    .max(1500, "وصف الحملة لا يجب أن يتجاوز 1500 حرف").optional(),
  
  status: z.enum(['draft', 'active', 'completed', 'cancelled', 'paused']),
  
  theme: z.string().max(100).optional(),
  
  start_date: DateSchema,
  
  end_date: DateSchema,
  
  registration_deadline: DateSchema.optional(),
  
  target_participants: z.number()
    .min(1, "الهدف الأدنى مشارك واحد")
    .max(100000, "الهدف الأقصى 100,000 مشارك").optional(),
  
  target_ideas: z.number()
    .min(1, "الهدف الأدنى فكرة واحدة")
    .max(10000, "الهدف الأقصى 10,000 فكرة").optional(),
  
  budget: BudgetSchema.optional(),
  
  success_metrics: z.string().max(800).optional(),
  
  campaign_manager_id: UUIDSchema.optional(),
  challenge_id: UUIDSchema.optional(),
  sector_id: UUIDSchema.optional(),
  deputy_id: UUIDSchema.optional(),
  department_id: UUIDSchema.optional()
}).refine(
  (data) => {
    return new Date(data.start_date) <= new Date(data.end_date);
  },
  {
    message: "تاريخ البداية يجب أن يكون قبل تاريخ النهاية",
    path: ["end_date"]
  }
).refine(
  (data) => {
    if (data.registration_deadline) {
      return new Date(data.registration_deadline) <= new Date(data.end_date);
    }
    return true;
  },
  {
    message: "موعد انتهاء التسجيل يجب أن يكون قبل نهاية الحملة",
    path: ["registration_deadline"]
  }
);

// ===========================
// OPPORTUNITY VALIDATION SCHEMAS
// ===========================

export const OpportunityFormSchema = z.object({
  title_ar: z.string()
    .min(10, "عنوان الفرصة يجب أن يكون 10 أحرف على الأقل")
    .max(200, "عنوان الفرصة لا يجب أن يتجاوز 200 حرف"),
  
  description_ar: z.string()
    .min(50, "وصف الفرصة يجب أن يكون 50 حرف على الأقل")
    .max(2000, "وصف الفرصة لا يجب أن يتجاوز 2000 حرف"),
  
  status: z.enum(['open', 'closed', 'paused']),
  
  opportunity_type: z.string()
    .min(2, "نوع الفرصة مطلوب")
    .max(50, "نوع الفرصة لا يجب أن يتجاوز 50 حرف"),
  
  deadline: DateSchema.optional(),
  
  budget_min: BudgetSchema.optional(),
  
  budget_max: BudgetSchema.optional(),
  
  requirements: z.array(z.string()).max(20).optional(),
  
  deliverables: z.array(z.string()).max(15).optional(),
  
  application_process: z.string().max(1000).optional(),
  
  evaluation_criteria: z.array(z.string()).max(10).optional(),
  
  sector_id: UUIDSchema.optional(),
  department_id: UUIDSchema.optional()
}).refine(
  (data) => {
    if (data.budget_min && data.budget_max) {
      return data.budget_min <= data.budget_max;
    }
    return true;
  },
  {
    message: "الحد الأدنى للميزانية يجب أن يكون أقل من أو يساوي الحد الأقصى",
    path: ["budget_max"]
  }
).refine(
  (data) => {
    if (data.deadline) {
      return new Date(data.deadline) > new Date();
    }
    return true;
  },
  {
    message: "موعد انتهاء التقديم يجب أن يكون في المستقبل",
    path: ["deadline"]
  }
);

// ===========================
// FOCUS QUESTION VALIDATION SCHEMAS
// ===========================

export const FocusQuestionFormSchema = z.object({
  challenge_id: UUIDSchema.optional(),
  
  question_text_ar: z.string()
    .min(10, "نص السؤال يجب أن يكون 10 أحرف على الأقل")
    .max(500, "نص السؤال لا يجب أن يتجاوز 500 حرف"),
  
  question_type: z.enum(['text', 'rating', 'choice', 'file', 'date']),
  
  sensitivity_level: z.enum(['public', 'internal', 'confidential']),
  
  order_sequence: z.number()
    .min(1, "ترتيب السؤال يجب أن يكون 1 على الأقل")
    .max(100, "ترتيب السؤال لا يجب أن يتجاوز 100"),
  
  is_required: z.boolean().default(false),
  
  is_active: z.boolean().default(true),
  
  options: z.array(z.string()).max(20).optional(),
  
  min_rating: z.number().min(1).max(10).optional(),
  
  max_rating: z.number().min(1).max(10).optional(),
  
  rating_labels: z.array(z.string()).max(10).optional(),
  
  allowed_file_types: z.array(z.string()).max(10).optional(),
  
  max_file_size: z.number().min(1).max(100).optional(), // MB
  
  metadata: z.record(z.any()).optional()
}).refine(
  (data) => {
    if (data.question_type === 'rating' && data.min_rating && data.max_rating) {
      return data.min_rating <= data.max_rating;
    }
    return true;
  },
  {
    message: "الحد الأدنى للتقييم يجب أن يكون أقل من أو يساوي الحد الأقصى",
    path: ["max_rating"]
  }
).refine(
  (data) => {
    if (data.question_type === 'choice' && (!data.options || data.options.length < 2)) {
      return false;
    }
    return true;
  },
  {
    message: "أسئلة الاختيار تتطلب خيارين على الأقل",
    path: ["options"]
  }
);

// ===========================
// TEAM VALIDATION SCHEMAS
// ===========================

export const TeamFormSchema = z.object({
  name: z.string()
    .min(2, "اسم الفريق يجب أن يكون حرفين على الأقل")
    .max(100, "اسم الفريق لا يجب أن يتجاوز 100 حرف"),
  
  name_ar: z.string()
    .min(2, "الاسم بالعربية يجب أن يكون حرفين على الأقل")
    .max(100, "الاسم بالعربية لا يجب أن يتجاوز 100 حرف").optional(),
  
  team_type: z.enum(['innovation', 'technical', 'advisory', 'evaluation']),
  
  status: z.enum(['active', 'inactive', 'forming', 'disbanded']),
  
  description: z.string().max(1000).optional(),
  
  team_lead_id: UUIDSchema.optional(),
  
  department_id: UUIDSchema.optional(),
  deputy_id: UUIDSchema.optional(),
  sector_id: UUIDSchema.optional(),
  
  max_members: z.number()
    .min(1, "الحد الأدنى عضو واحد")
    .max(50, "الحد الأقصى 50 عضو").optional(),
  
  specialization: z.string().max(200).optional(),
  
  goals: z.array(z.string()).max(10).optional(),
  
  meeting_schedule: z.string().max(200).optional(),
  
  budget_allocation: BudgetSchema.optional(),
  
  logo_url: URLSchema.optional()
});

// ===========================
// PROFILE VALIDATION SCHEMAS
// ===========================

export const ProfileFormSchema = z.object({
  first_name: z.string()
    .min(2, "الاسم الأول يجب أن يكون حرفين على الأقل")
    .max(50, "الاسم الأول لا يجب أن يتجاوز 50 حرف"),
  
  last_name: z.string()
    .min(2, "اسم العائلة يجب أن يكون حرفين على الأقل")
    .max(50, "اسم العائلة لا يجب أن يتجاوز 50 حرف"),
  
  display_name: z.string().max(100).optional(),
  
  email: EmailSchema.optional(),
  
  phone: PhoneSchema.optional(),
  
  position: z.string().max(100).optional(),
  
  department_id: UUIDSchema.optional(),
  deputy_id: UUIDSchema.optional(),
  sector_id: UUIDSchema.optional(),
  
  role: z.string().max(50).optional(),
  
  is_active: z.boolean().default(true),
  
  preferences: z.record(z.any()).optional()
});

// ===========================
// COMMON FORM UTILITIES
// ===========================

export const createFormValidator = <T extends z.ZodSchema>(schema: T) => {
  return {
    validate: (data: unknown) => {
      try {
        return {
          success: true,
          data: schema.parse(data),
          errors: null
        };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            success: false,
            data: null,
            errors: error.errors
          };
        }
        return {
          success: false,
          data: null,
          errors: [{ message: "خطأ غير متوقع في التحقق من البيانات" }]
        };
      }
    },
    
    validateField: (fieldName: string, value: unknown) => {
      try {
        // Simple field validation without accessing shape
        schema.parse({ [fieldName]: value });
        return { success: true, error: null };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return { 
            success: false, 
            error: error.errors[0]?.message || "قيمة غير صحيحة" 
          };
        }
        return { success: false, error: "خطأ في التحقق" };
      }
    }
  };
};

// Pre-built validators
export const challengeValidator = createFormValidator(ChallengeFormSchema);
export const ideaValidator = createFormValidator(IdeaFormSchema);
export const expertValidator = createFormValidator(ExpertFormSchema);
export const partnerValidator = createFormValidator(PartnerFormSchema);
export const eventValidator = createFormValidator(EventFormSchema);
export const campaignValidator = createFormValidator(CampaignFormSchema);
export const opportunityValidator = createFormValidator(OpportunityFormSchema);
export const focusQuestionValidator = createFormValidator(FocusQuestionFormSchema);
export const teamValidator = createFormValidator(TeamFormSchema);
export const profileValidator = createFormValidator(ProfileFormSchema);