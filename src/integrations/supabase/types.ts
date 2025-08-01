export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      bookmark_collections: {
        Row: {
          color: string | null
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          icon: string | null
          id: string
          is_public: boolean | null
          name_ar: string
          name_en: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          icon?: string | null
          id?: string
          is_public?: boolean | null
          name_ar: string
          name_en: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          icon?: string | null
          id?: string
          is_public?: boolean | null
          name_ar?: string
          name_en?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      campaign_bookmarks: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          priority: string | null
          reminder_date: string | null
          user_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          reminder_date?: string | null
          user_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          reminder_date?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_bookmarks_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_campaign_bookmarks_campaign_id"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_challenge_links: {
        Row: {
          campaign_id: string
          challenge_id: string
          created_at: string
          id: string
        }
        Insert: {
          campaign_id: string
          challenge_id: string
          created_at?: string
          id?: string
        }
        Update: {
          campaign_id?: string
          challenge_id?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      campaign_department_links: {
        Row: {
          campaign_id: string
          created_at: string
          department_id: string
          id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          department_id: string
          id?: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          department_id?: string
          id?: string
        }
        Relationships: []
      }
      campaign_deputy_links: {
        Row: {
          campaign_id: string
          created_at: string
          deputy_id: string
          id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          deputy_id: string
          id?: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          deputy_id?: string
          id?: string
        }
        Relationships: []
      }
      campaign_partner_links: {
        Row: {
          campaign_id: string
          created_at: string
          id: string
          partner_id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          id?: string
          partner_id: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          id?: string
          partner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_campaign_partner_links_campaign"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_campaign_partner_links_partner"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_partners: {
        Row: {
          campaign_id: string
          contribution_amount: number | null
          created_at: string | null
          id: string
          partner_id: string
          partnership_role: string | null
          partnership_status: string | null
        }
        Insert: {
          campaign_id: string
          contribution_amount?: number | null
          created_at?: string | null
          id?: string
          partner_id: string
          partnership_role?: string | null
          partnership_status?: string | null
        }
        Update: {
          campaign_id?: string
          contribution_amount?: number | null
          created_at?: string | null
          id?: string
          partner_id?: string
          partnership_role?: string | null
          partnership_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_partners_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_partners_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_sector_links: {
        Row: {
          campaign_id: string
          created_at: string
          id: string
          sector_id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          id?: string
          sector_id: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          id?: string
          sector_id?: string
        }
        Relationships: []
      }
      campaign_stakeholder_links: {
        Row: {
          campaign_id: string
          created_at: string
          id: string
          stakeholder_id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          id?: string
          stakeholder_id: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          id?: string
          stakeholder_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_campaign_stakeholder_links_campaign"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_campaign_stakeholder_links_stakeholder"
            columns: ["stakeholder_id"]
            isOneToOne: false
            referencedRelation: "stakeholders"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          budget: number | null
          campaign_manager_id: string | null
          challenge_id: string | null
          created_at: string | null
          department_id: string | null
          deputy_id: string | null
          description_ar: string | null
          end_date: string
          id: string
          registration_deadline: string | null
          sector_id: string | null
          start_date: string
          status: string | null
          success_metrics: string | null
          target_ideas: number | null
          target_participants: number | null
          theme: string | null
          title_ar: string
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          campaign_manager_id?: string | null
          challenge_id?: string | null
          created_at?: string | null
          department_id?: string | null
          deputy_id?: string | null
          description_ar?: string | null
          end_date: string
          id?: string
          registration_deadline?: string | null
          sector_id?: string | null
          start_date: string
          status?: string | null
          success_metrics?: string | null
          target_ideas?: number | null
          target_participants?: number | null
          theme?: string | null
          title_ar: string
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          campaign_manager_id?: string | null
          challenge_id?: string | null
          created_at?: string | null
          department_id?: string | null
          deputy_id?: string | null
          description_ar?: string | null
          end_date?: string
          id?: string
          registration_deadline?: string | null
          sector_id?: string | null
          start_date?: string
          status?: string | null
          success_metrics?: string | null
          target_ideas?: number | null
          target_participants?: number | null
          theme?: string | null
          title_ar?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_deputy_id_fkey"
            columns: ["deputy_id"]
            isOneToOne: false
            referencedRelation: "deputies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_campaigns_challenge_id"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_campaigns_department_id"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_campaigns_deputy_id"
            columns: ["deputy_id"]
            isOneToOne: false
            referencedRelation: "deputies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_campaigns_sector_id"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_bookmarks: {
        Row: {
          challenge_id: string
          created_at: string | null
          id: string
          notes: string | null
          priority: string | null
          reminder_date: string | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          reminder_date?: string | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          reminder_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_challenge_bookmarks_challenge_id"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_comments: {
        Row: {
          challenge_id: string
          content: string
          created_at: string | null
          id: string
          is_expert_comment: boolean | null
          is_pinned: boolean | null
          likes_count: number | null
          parent_comment_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          content: string
          created_at?: string | null
          id?: string
          is_expert_comment?: boolean | null
          is_pinned?: boolean | null
          likes_count?: number | null
          parent_comment_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_expert_comment?: boolean | null
          is_pinned?: boolean | null
          likes_count?: number | null
          parent_comment_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "challenge_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_challenge_comments_challenge"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_experts: {
        Row: {
          assignment_date: string | null
          challenge_id: string
          created_at: string | null
          expert_id: string
          id: string
          notes: string | null
          role_type: string | null
          status: string | null
        }
        Insert: {
          assignment_date?: string | null
          challenge_id: string
          created_at?: string | null
          expert_id: string
          id?: string
          notes?: string | null
          role_type?: string | null
          status?: string | null
        }
        Update: {
          assignment_date?: string | null
          challenge_id?: string
          created_at?: string | null
          expert_id?: string
          id?: string
          notes?: string | null
          role_type?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_experts_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_experts_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_feedback: {
        Row: {
          challenge_id: string
          created_at: string | null
          feedback_text: string | null
          id: string
          rating: number | null
          updated_at: string | null
          user_id: string
          would_recommend: boolean | null
        }
        Insert: {
          challenge_id: string
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          rating?: number | null
          updated_at?: string | null
          user_id: string
          would_recommend?: boolean | null
        }
        Update: {
          challenge_id?: string
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          rating?: number | null
          updated_at?: string | null
          user_id?: string
          would_recommend?: boolean | null
        }
        Relationships: []
      }
      challenge_notifications: {
        Row: {
          action_url: string | null
          challenge_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          notification_type: string
          recipient_id: string
          sender_id: string | null
          title: string
        }
        Insert: {
          action_url?: string | null
          challenge_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          notification_type: string
          recipient_id: string
          sender_id?: string | null
          title: string
        }
        Update: {
          action_url?: string | null
          challenge_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          notification_type?: string
          recipient_id?: string
          sender_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_challenge_notifications_challenge"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_participants: {
        Row: {
          challenge_id: string
          created_at: string | null
          id: string
          notifications_enabled: boolean | null
          participation_type: string | null
          registration_date: string | null
          status: string | null
          team_name: string | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          created_at?: string | null
          id?: string
          notifications_enabled?: boolean | null
          participation_type?: string | null
          registration_date?: string | null
          status?: string | null
          team_name?: string | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          created_at?: string | null
          id?: string
          notifications_enabled?: boolean | null
          participation_type?: string | null
          registration_date?: string | null
          status?: string | null
          team_name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_challenge_participants_challenge"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_partners: {
        Row: {
          challenge_id: string
          contribution_details: string | null
          created_at: string | null
          funding_amount: number | null
          id: string
          partner_id: string
          partnership_end_date: string | null
          partnership_start_date: string | null
          partnership_type: string | null
          status: string | null
        }
        Insert: {
          challenge_id: string
          contribution_details?: string | null
          created_at?: string | null
          funding_amount?: number | null
          id?: string
          partner_id: string
          partnership_end_date?: string | null
          partnership_start_date?: string | null
          partnership_type?: string | null
          status?: string | null
        }
        Update: {
          challenge_id?: string
          contribution_details?: string | null
          created_at?: string | null
          funding_amount?: number | null
          id?: string
          partner_id?: string
          partnership_end_date?: string | null
          partnership_start_date?: string | null
          partnership_type?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_partners_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_partners_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_requirements: {
        Row: {
          challenge_id: string
          created_at: string
          description: string | null
          id: string
          is_mandatory: boolean | null
          order_sequence: number | null
          requirement_type: string
          title: string
          updated_at: string
          weight_percentage: number | null
        }
        Insert: {
          challenge_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_mandatory?: boolean | null
          order_sequence?: number | null
          requirement_type: string
          title: string
          updated_at?: string
          weight_percentage?: number | null
        }
        Update: {
          challenge_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_mandatory?: boolean | null
          order_sequence?: number | null
          requirement_type?: string
          title?: string
          updated_at?: string
          weight_percentage?: number | null
        }
        Relationships: []
      }
      challenge_scorecards: {
        Row: {
          challenge_id: string | null
          cost_effectiveness_score: number | null
          created_at: string | null
          evaluated_by: string | null
          evaluation_date: string | null
          evaluation_notes: string | null
          feasibility_score: number | null
          id: string
          impact_potential_score: number | null
          innovation_level_score: number | null
          overall_score: number | null
          recommendation: string | null
          resource_availability_score: number | null
          risk_assessment: string | null
          stakeholder_support_score: number | null
          strategic_alignment_score: number | null
        }
        Insert: {
          challenge_id?: string | null
          cost_effectiveness_score?: number | null
          created_at?: string | null
          evaluated_by?: string | null
          evaluation_date?: string | null
          evaluation_notes?: string | null
          feasibility_score?: number | null
          id?: string
          impact_potential_score?: number | null
          innovation_level_score?: number | null
          overall_score?: number | null
          recommendation?: string | null
          resource_availability_score?: number | null
          risk_assessment?: string | null
          stakeholder_support_score?: number | null
          strategic_alignment_score?: number | null
        }
        Update: {
          challenge_id?: string | null
          cost_effectiveness_score?: number | null
          created_at?: string | null
          evaluated_by?: string | null
          evaluation_date?: string | null
          evaluation_notes?: string | null
          feasibility_score?: number | null
          id?: string
          impact_potential_score?: number | null
          innovation_level_score?: number | null
          overall_score?: number | null
          recommendation?: string | null
          resource_availability_score?: number | null
          risk_assessment?: string | null
          stakeholder_support_score?: number | null
          strategic_alignment_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_scorecards_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_submissions: {
        Row: {
          attachment_urls: string[] | null
          business_model: string | null
          challenge_id: string
          created_at: string | null
          description_ar: string
          expected_impact: string | null
          id: string
          implementation_plan: string | null
          is_public: boolean | null
          review_notes: string | null
          score: number | null
          solution_approach: string | null
          status: string | null
          submission_date: string | null
          submitted_by: string
          team_members: Json | null
          technical_details: Json | null
          title_ar: string
          updated_at: string | null
        }
        Insert: {
          attachment_urls?: string[] | null
          business_model?: string | null
          challenge_id: string
          created_at?: string | null
          description_ar: string
          expected_impact?: string | null
          id?: string
          implementation_plan?: string | null
          is_public?: boolean | null
          review_notes?: string | null
          score?: number | null
          solution_approach?: string | null
          status?: string | null
          submission_date?: string | null
          submitted_by: string
          team_members?: Json | null
          technical_details?: Json | null
          title_ar: string
          updated_at?: string | null
        }
        Update: {
          attachment_urls?: string[] | null
          business_model?: string | null
          challenge_id?: string
          created_at?: string | null
          description_ar?: string
          expected_impact?: string | null
          id?: string
          implementation_plan?: string | null
          is_public?: boolean | null
          review_notes?: string | null
          score?: number | null
          solution_approach?: string | null
          status?: string | null
          submission_date?: string | null
          submitted_by?: string
          team_members?: Json | null
          technical_details?: Json | null
          title_ar?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_challenge_submissions_challenge"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          actual_budget: number | null
          assigned_expert_id: string | null
          challenge_owner_id: string | null
          challenge_type: string | null
          collaboration_details: string | null
          created_at: string | null
          created_by: string | null
          department_id: string | null
          deputy_id: string | null
          description_ar: string
          domain_id: string | null
          end_date: string | null
          estimated_budget: number | null
          id: string
          image_url: string | null
          internal_team_notes: string | null
          kpi_alignment: string | null
          partner_organization_id: string | null
          priority_level: string | null
          sector_id: string | null
          sensitivity_level: string | null
          service_id: string | null
          start_date: string | null
          status: string | null
          sub_domain_id: string | null
          title_ar: string
          updated_at: string | null
          vision_2030_goal: string | null
        }
        Insert: {
          actual_budget?: number | null
          assigned_expert_id?: string | null
          challenge_owner_id?: string | null
          challenge_type?: string | null
          collaboration_details?: string | null
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          deputy_id?: string | null
          description_ar: string
          domain_id?: string | null
          end_date?: string | null
          estimated_budget?: number | null
          id?: string
          image_url?: string | null
          internal_team_notes?: string | null
          kpi_alignment?: string | null
          partner_organization_id?: string | null
          priority_level?: string | null
          sector_id?: string | null
          sensitivity_level?: string | null
          service_id?: string | null
          start_date?: string | null
          status?: string | null
          sub_domain_id?: string | null
          title_ar: string
          updated_at?: string | null
          vision_2030_goal?: string | null
        }
        Update: {
          actual_budget?: number | null
          assigned_expert_id?: string | null
          challenge_owner_id?: string | null
          challenge_type?: string | null
          collaboration_details?: string | null
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          deputy_id?: string | null
          description_ar?: string
          domain_id?: string | null
          end_date?: string | null
          estimated_budget?: number | null
          id?: string
          image_url?: string | null
          internal_team_notes?: string | null
          kpi_alignment?: string | null
          partner_organization_id?: string | null
          priority_level?: string | null
          sector_id?: string | null
          sensitivity_level?: string | null
          service_id?: string | null
          start_date?: string | null
          status?: string | null
          sub_domain_id?: string | null
          title_ar?: string
          updated_at?: string | null
          vision_2030_goal?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenges_assigned_expert_id_fkey"
            columns: ["assigned_expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_deputy_id_fkey"
            columns: ["deputy_id"]
            isOneToOne: false
            referencedRelation: "deputies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_partner_organization_id_fkey"
            columns: ["partner_organization_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_sub_domain_id_fkey"
            columns: ["sub_domain_id"]
            isOneToOne: false
            referencedRelation: "sub_domains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_challenges_department_id"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_challenges_deputy_id"
            columns: ["deputy_id"]
            isOneToOne: false
            referencedRelation: "deputies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_challenges_domain_id"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_challenges_sector_id"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_challenges_service_id"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_challenges_sub_domain_id"
            columns: ["sub_domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_items: {
        Row: {
          added_at: string | null
          bookmark_id: string
          bookmark_type: string
          collection_id: string
          id: string
        }
        Insert: {
          added_at?: string | null
          bookmark_id: string
          bookmark_type: string
          collection_id: string
          id?: string
        }
        Update: {
          added_at?: string | null
          bookmark_id?: string
          bookmark_type?: string
          collection_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "bookmark_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          budget_allocation: number | null
          created_at: string | null
          department_head: string | null
          deputy_id: string | null
          id: string
          name: string
          name_ar: string | null
          updated_at: string | null
        }
        Insert: {
          budget_allocation?: number | null
          created_at?: string | null
          department_head?: string | null
          deputy_id?: string | null
          id?: string
          name: string
          name_ar?: string | null
          updated_at?: string | null
        }
        Update: {
          budget_allocation?: number | null
          created_at?: string | null
          department_head?: string | null
          deputy_id?: string | null
          id?: string
          name?: string
          name_ar?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_deputy_id_fkey"
            columns: ["deputy_id"]
            isOneToOne: false
            referencedRelation: "deputies"
            referencedColumns: ["id"]
          },
        ]
      }
      deputies: {
        Row: {
          contact_email: string | null
          created_at: string | null
          deputy_minister: string | null
          id: string
          name: string
          name_ar: string | null
          sector_id: string | null
          updated_at: string | null
        }
        Insert: {
          contact_email?: string | null
          created_at?: string | null
          deputy_minister?: string | null
          id?: string
          name: string
          name_ar?: string | null
          sector_id?: string | null
          updated_at?: string | null
        }
        Update: {
          contact_email?: string | null
          created_at?: string | null
          deputy_minister?: string | null
          id?: string
          name?: string
          name_ar?: string | null
          sector_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deputies_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      domains: {
        Row: {
          created_at: string | null
          department_id: string | null
          domain_lead: string | null
          id: string
          name: string
          name_ar: string | null
          specialization: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          domain_lead?: string | null
          id?: string
          name: string
          name_ar?: string | null
          specialization?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          domain_lead?: string | null
          id?: string
          name?: string
          name_ar?: string | null
          specialization?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "domains_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluation_criteria: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          description_ar: string | null
          id: string
          is_active: boolean | null
          is_required: boolean | null
          max_score: number | null
          min_score: number | null
          name: string
          name_ar: string | null
          scoring_guide: string | null
          scoring_guide_ar: string | null
          updated_at: string | null
          weight: number
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          description_ar?: string | null
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          max_score?: number | null
          min_score?: number | null
          name: string
          name_ar?: string | null
          scoring_guide?: string | null
          scoring_guide_ar?: string | null
          updated_at?: string | null
          weight?: number
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          description_ar?: string | null
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          max_score?: number | null
          min_score?: number | null
          name?: string
          name_ar?: string | null
          scoring_guide?: string | null
          scoring_guide_ar?: string | null
          updated_at?: string | null
          weight?: number
        }
        Relationships: []
      }
      evaluation_rules: {
        Row: {
          action_type: string
          action_value: string | null
          condition_type: string
          condition_value: number
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          name: string
          name_ar: string | null
          priority: number | null
          updated_at: string | null
        }
        Insert: {
          action_type: string
          action_value?: string | null
          condition_type: string
          condition_value: number
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          name_ar?: string | null
          priority?: number | null
          updated_at?: string | null
        }
        Update: {
          action_type?: string
          action_value?: string | null
          condition_type?: string
          condition_value?: number
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          name_ar?: string | null
          priority?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      evaluation_scorecards: {
        Row: {
          created_at: string | null
          created_by: string | null
          criteria_scores: Json | null
          evaluation_notes: string | null
          final_score: number | null
          id: string
          name: string
          name_ar: string | null
          recommendation: string | null
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          criteria_scores?: Json | null
          evaluation_notes?: string | null
          final_score?: number | null
          id?: string
          name: string
          name_ar?: string | null
          recommendation?: string | null
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          criteria_scores?: Json | null
          evaluation_notes?: string | null
          final_score?: number | null
          id?: string
          name?: string
          name_ar?: string | null
          recommendation?: string | null
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evaluation_scorecards_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "evaluation_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluation_system_settings: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_system: boolean | null
          setting_key: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          setting_key: string
          setting_value: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      evaluation_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          criteria_config: Json | null
          description: string | null
          description_ar: string | null
          evaluation_type: string
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          name_ar: string | null
          scoring_method: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          criteria_config?: Json | null
          description?: string | null
          description_ar?: string | null
          evaluation_type: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          name_ar?: string | null
          scoring_method?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          criteria_config?: Json | null
          description?: string | null
          description_ar?: string | null
          evaluation_type?: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          name_ar?: string | null
          scoring_method?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      event_attendee_interests: {
        Row: {
          event_type: string
          id: string
          interest_score: number | null
          last_interaction: string | null
          user_id: string
        }
        Insert: {
          event_type: string
          id?: string
          interest_score?: number | null
          last_interaction?: string | null
          user_id: string
        }
        Update: {
          event_type?: string
          id?: string
          interest_score?: number | null
          last_interaction?: string | null
          user_id?: string
        }
        Relationships: []
      }
      event_bookmarks: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          notes: string | null
          priority: string | null
          reminder_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          notes?: string | null
          priority?: string | null
          reminder_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          notes?: string | null
          priority?: string | null
          reminder_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_bookmarks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_event_bookmarks_event_id"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_challenge_links: {
        Row: {
          challenge_id: string
          created_at: string
          event_id: string
          id: string
        }
        Insert: {
          challenge_id: string
          created_at?: string
          event_id: string
          id?: string
        }
        Update: {
          challenge_id?: string
          created_at?: string
          event_id?: string
          id?: string
        }
        Relationships: []
      }
      event_feedback: {
        Row: {
          created_at: string | null
          event_id: string
          feedback_text: string | null
          id: string
          rating: number | null
          updated_at: string | null
          user_id: string
          would_recommend: boolean | null
        }
        Insert: {
          created_at?: string | null
          event_id: string
          feedback_text?: string | null
          id?: string
          rating?: number | null
          updated_at?: string | null
          user_id: string
          would_recommend?: boolean | null
        }
        Update: {
          created_at?: string | null
          event_id?: string
          feedback_text?: string | null
          id?: string
          rating?: number | null
          updated_at?: string | null
          user_id?: string
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "event_feedback_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_focus_question_links: {
        Row: {
          created_at: string
          event_id: string
          focus_question_id: string
          id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          focus_question_id: string
          id?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          focus_question_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_event_focus_question_links_event_id"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_event_focus_question_links_focus_question_id"
            columns: ["focus_question_id"]
            isOneToOne: false
            referencedRelation: "focus_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      event_likes: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      event_participant_notifications: {
        Row: {
          created_at: string
          event_id: string
          id: string
          message_content: string | null
          notification_type: string
          participant_id: string
          sent_at: string
          status: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          message_content?: string | null
          notification_type: string
          participant_id: string
          sent_at?: string
          status?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          message_content?: string | null
          notification_type?: string
          participant_id?: string
          sent_at?: string
          status?: string
        }
        Relationships: []
      }
      event_participants: {
        Row: {
          attendance_status: string
          check_in_time: string | null
          check_out_time: string | null
          created_at: string
          event_id: string
          id: string
          notes: string | null
          registration_date: string
          registration_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attendance_status?: string
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          event_id: string
          id?: string
          notes?: string | null
          registration_date?: string
          registration_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attendance_status?: string
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          event_id?: string
          id?: string
          notes?: string | null
          registration_date?: string
          registration_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      event_partner_links: {
        Row: {
          created_at: string
          event_id: string
          id: string
          partner_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          partner_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          partner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_event_partner_links_event_id"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_event_partner_links_partner_id"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      event_recommendations: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          reason: string | null
          recommendation_score: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          reason?: string | null
          recommendation_score?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          reason?: string | null
          recommendation_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_event_recommendations_event_id"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_resources: {
        Row: {
          availability_status: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          display_order: number | null
          download_count: number | null
          event_id: string
          file_format: string | null
          file_size_mb: number | null
          file_url: string | null
          id: string
          is_public: boolean | null
          resource_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          availability_status?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          download_count?: number | null
          event_id: string
          file_format?: string | null
          file_size_mb?: number | null
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          resource_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          availability_status?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          download_count?: number | null
          event_id?: string
          file_format?: string | null
          file_size_mb?: number | null
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          resource_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      event_reviews: {
        Row: {
          created_at: string | null
          event_id: string
          helpful_count: number | null
          id: string
          rating: number
          review_text: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          helpful_count?: number | null
          id?: string
          rating: number
          review_text?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          helpful_count?: number | null
          id?: string
          rating?: number
          review_text?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_event_reviews_event_id"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_stakeholder_links: {
        Row: {
          created_at: string
          event_id: string
          id: string
          stakeholder_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          stakeholder_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          stakeholder_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_event_stakeholder_links_event_id"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_event_stakeholder_links_stakeholder_id"
            columns: ["stakeholder_id"]
            isOneToOne: false
            referencedRelation: "stakeholders"
            referencedColumns: ["id"]
          },
        ]
      }
      event_stakeholders: {
        Row: {
          attendance_status: string | null
          created_at: string | null
          event_id: string
          id: string
          invitation_status: string | null
          stakeholder_id: string
        }
        Insert: {
          attendance_status?: string | null
          created_at?: string | null
          event_id: string
          id?: string
          invitation_status?: string | null
          stakeholder_id: string
        }
        Update: {
          attendance_status?: string | null
          created_at?: string | null
          event_id?: string
          id?: string
          invitation_status?: string | null
          stakeholder_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_stakeholders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_stakeholders_stakeholder_id_fkey"
            columns: ["stakeholder_id"]
            isOneToOne: false
            referencedRelation: "stakeholders"
            referencedColumns: ["id"]
          },
        ]
      }
      event_waitlist: {
        Row: {
          event_id: string
          expires_at: string | null
          id: string
          joined_at: string | null
          notification_sent: boolean | null
          position_in_queue: number | null
          user_id: string
        }
        Insert: {
          event_id: string
          expires_at?: string | null
          id?: string
          joined_at?: string | null
          notification_sent?: boolean | null
          position_in_queue?: number | null
          user_id: string
        }
        Update: {
          event_id?: string
          expires_at?: string | null
          id?: string
          joined_at?: string | null
          notification_sent?: boolean | null
          position_in_queue?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_event_waitlist_event_id"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          actual_participants: number | null
          additional_links: string | null
          allow_waitlist: boolean | null
          auto_confirmation: boolean | null
          budget: number | null
          campaign_id: string | null
          challenge_id: string | null
          created_at: string | null
          description_ar: string | null
          email_reminders: boolean | null
          enable_feedback: boolean | null
          enable_networking: boolean | null
          enable_qr_checkin: boolean | null
          end_date: string | null
          end_time: string | null
          event_category: string | null
          event_date: string
          event_language: string | null
          event_manager_id: string | null
          event_type: string | null
          event_visibility: string | null
          format: string | null
          id: string
          image_url: string | null
          inherit_from_campaign: boolean | null
          is_recurring: boolean | null
          live_stream_url: string | null
          location: string | null
          max_participants: number | null
          participant_requirements: string | null
          partner_organizations: string[] | null
          record_sessions: boolean | null
          recording_url: string | null
          recurrence_end_date: string | null
          recurrence_pattern: string | null
          registered_participants: number | null
          registration_fee: number | null
          registration_type: string | null
          related_focus_questions: string[] | null
          reminder_schedule: string | null
          requires_approval: boolean | null
          sector_id: string | null
          selection_criteria: string | null
          sms_notifications: boolean | null
          start_time: string | null
          status: string | null
          target_stakeholder_groups: string[] | null
          timezone: string | null
          title_ar: string
          virtual_link: string | null
        }
        Insert: {
          actual_participants?: number | null
          additional_links?: string | null
          allow_waitlist?: boolean | null
          auto_confirmation?: boolean | null
          budget?: number | null
          campaign_id?: string | null
          challenge_id?: string | null
          created_at?: string | null
          description_ar?: string | null
          email_reminders?: boolean | null
          enable_feedback?: boolean | null
          enable_networking?: boolean | null
          enable_qr_checkin?: boolean | null
          end_date?: string | null
          end_time?: string | null
          event_category?: string | null
          event_date: string
          event_language?: string | null
          event_manager_id?: string | null
          event_type?: string | null
          event_visibility?: string | null
          format?: string | null
          id?: string
          image_url?: string | null
          inherit_from_campaign?: boolean | null
          is_recurring?: boolean | null
          live_stream_url?: string | null
          location?: string | null
          max_participants?: number | null
          participant_requirements?: string | null
          partner_organizations?: string[] | null
          record_sessions?: boolean | null
          recording_url?: string | null
          recurrence_end_date?: string | null
          recurrence_pattern?: string | null
          registered_participants?: number | null
          registration_fee?: number | null
          registration_type?: string | null
          related_focus_questions?: string[] | null
          reminder_schedule?: string | null
          requires_approval?: boolean | null
          sector_id?: string | null
          selection_criteria?: string | null
          sms_notifications?: boolean | null
          start_time?: string | null
          status?: string | null
          target_stakeholder_groups?: string[] | null
          timezone?: string | null
          title_ar: string
          virtual_link?: string | null
        }
        Update: {
          actual_participants?: number | null
          additional_links?: string | null
          allow_waitlist?: boolean | null
          auto_confirmation?: boolean | null
          budget?: number | null
          campaign_id?: string | null
          challenge_id?: string | null
          created_at?: string | null
          description_ar?: string | null
          email_reminders?: boolean | null
          enable_feedback?: boolean | null
          enable_networking?: boolean | null
          enable_qr_checkin?: boolean | null
          end_date?: string | null
          end_time?: string | null
          event_category?: string | null
          event_date?: string
          event_language?: string | null
          event_manager_id?: string | null
          event_type?: string | null
          event_visibility?: string | null
          format?: string | null
          id?: string
          image_url?: string | null
          inherit_from_campaign?: boolean | null
          is_recurring?: boolean | null
          live_stream_url?: string | null
          location?: string | null
          max_participants?: number | null
          participant_requirements?: string | null
          partner_organizations?: string[] | null
          record_sessions?: boolean | null
          recording_url?: string | null
          recurrence_end_date?: string | null
          recurrence_pattern?: string | null
          registered_participants?: number | null
          registration_fee?: number | null
          registration_type?: string | null
          related_focus_questions?: string[] | null
          reminder_schedule?: string | null
          requires_approval?: boolean | null
          sector_id?: string | null
          selection_criteria?: string | null
          sms_notifications?: boolean | null
          start_time?: string | null
          status?: string | null
          target_stakeholder_groups?: string[] | null
          timezone?: string | null
          title_ar?: string
          virtual_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_events_campaign_id"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_events_challenge_id"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_events_sector_id"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_bookmarks: {
        Row: {
          created_at: string | null
          expert_id: string | null
          id: string
          notes: string | null
          priority: string | null
          reminder_date: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expert_id?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          reminder_date?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expert_id?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          reminder_date?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      experts: {
        Row: {
          availability_status: string | null
          certifications: string[] | null
          consultation_rate: number | null
          created_at: string | null
          education_background: string | null
          experience_years: number | null
          expert_level: string | null
          expertise_areas: string[]
          id: string
          user_id: string | null
        }
        Insert: {
          availability_status?: string | null
          certifications?: string[] | null
          consultation_rate?: number | null
          created_at?: string | null
          education_background?: string | null
          experience_years?: number | null
          expert_level?: string | null
          expertise_areas: string[]
          id?: string
          user_id?: string | null
        }
        Update: {
          availability_status?: string | null
          certifications?: string[] | null
          consultation_rate?: number | null
          created_at?: string | null
          education_background?: string | null
          experience_years?: number | null
          expert_level?: string | null
          expertise_areas?: string[]
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      focus_question_bookmarks: {
        Row: {
          created_at: string | null
          focus_question_id: string
          id: string
          notes: string | null
          priority: string | null
          reminder_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          focus_question_id: string
          id?: string
          notes?: string | null
          priority?: string | null
          reminder_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          focus_question_id?: string
          id?: string
          notes?: string | null
          priority?: string | null
          reminder_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_focus_question_bookmarks_focus_question_id"
            columns: ["focus_question_id"]
            isOneToOne: false
            referencedRelation: "focus_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      focus_questions: {
        Row: {
          challenge_id: string | null
          created_at: string | null
          id: string
          is_sensitive: boolean | null
          order_sequence: number | null
          question_text_ar: string
          question_type: string | null
          updated_at: string | null
        }
        Insert: {
          challenge_id?: string | null
          created_at?: string | null
          id?: string
          is_sensitive?: boolean | null
          order_sequence?: number | null
          question_text_ar: string
          question_type?: string | null
          updated_at?: string | null
        }
        Update: {
          challenge_id?: string | null
          created_at?: string | null
          id?: string
          is_sensitive?: boolean | null
          order_sequence?: number | null
          question_text_ar?: string
          question_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "focus_questions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_analytics: {
        Row: {
          created_at: string | null
          id: string
          idea_id: string
          metric_data: Json | null
          metric_name: string
          metric_value: number | null
          recorded_by: string | null
          recorded_date: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          idea_id: string
          metric_data?: Json | null
          metric_name: string
          metric_value?: number | null
          recorded_by?: string | null
          recorded_date?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          idea_id?: string
          metric_data?: Json | null
          metric_name?: string
          metric_value?: number | null
          recorded_by?: string | null
          recorded_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "idea_analytics_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_approval_workflows: {
        Row: {
          approval_level: number
          approver_id: string
          created_at: string | null
          decision_date: string | null
          decision_reason: string | null
          delegation_to: string | null
          id: string
          idea_id: string
          is_required: boolean | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approval_level: number
          approver_id: string
          created_at?: string | null
          decision_date?: string | null
          decision_reason?: string | null
          delegation_to?: string | null
          id?: string
          idea_id: string
          is_required?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approval_level?: number
          approver_id?: string
          created_at?: string | null
          decision_date?: string | null
          decision_reason?: string | null
          delegation_to?: string | null
          id?: string
          idea_id?: string
          is_required?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "idea_approval_workflows_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_assignments: {
        Row: {
          assigned_by: string
          assigned_to: string
          assignment_type: string
          completed_at: string | null
          created_at: string | null
          due_date: string | null
          id: string
          idea_id: string
          notes: string | null
          priority: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_by: string
          assigned_to: string
          assignment_type: string
          completed_at?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          idea_id: string
          notes?: string | null
          priority?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_by?: string
          assigned_to?: string
          assignment_type?: string
          completed_at?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          idea_id?: string
          notes?: string | null
          priority?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "idea_assignments_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_attachments: {
        Row: {
          created_at: string | null
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          idea_id: string
          is_public: boolean | null
          uploaded_by: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          idea_id: string
          is_public?: boolean | null
          uploaded_by: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          idea_id?: string
          is_public?: boolean | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_attachments_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_bookmarks: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          notes: string | null
          priority: string | null
          reminder_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          notes?: string | null
          priority?: string | null
          reminder_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          notes?: string | null
          priority?: string | null
          reminder_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_idea_bookmarks_idea_id"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_collaboration_teams: {
        Row: {
          added_by: string
          id: string
          idea_id: string
          joined_at: string | null
          member_id: string
          permissions: Json | null
          role: string
          status: string | null
        }
        Insert: {
          added_by: string
          id?: string
          idea_id: string
          joined_at?: string | null
          member_id: string
          permissions?: Json | null
          role: string
          status?: string | null
        }
        Update: {
          added_by?: string
          id?: string
          idea_id?: string
          joined_at?: string | null
          member_id?: string
          permissions?: Json | null
          role?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "idea_collaboration_teams_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_comments: {
        Row: {
          author_id: string
          comment_type: string | null
          content: string
          created_at: string | null
          id: string
          idea_id: string
          is_internal: boolean | null
          parent_comment_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_id: string
          comment_type?: string | null
          content: string
          created_at?: string | null
          id?: string
          idea_id: string
          is_internal?: boolean | null
          parent_comment_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          comment_type?: string | null
          content?: string
          created_at?: string | null
          id?: string
          idea_id?: string
          is_internal?: boolean | null
          parent_comment_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_idea_comments_author_id"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "idea_comments_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "idea_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "idea_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_evaluations: {
        Row: {
          created_at: string | null
          evaluation_date: string | null
          evaluator_id: string
          evaluator_type: string | null
          financial_viability: number | null
          id: string
          idea_id: string | null
          implementation_complexity: number | null
          innovation_level: number | null
          market_potential: number | null
          next_steps: string | null
          recommendations: string | null
          strategic_alignment: number | null
          strengths: string | null
          technical_feasibility: number | null
          weaknesses: string | null
        }
        Insert: {
          created_at?: string | null
          evaluation_date?: string | null
          evaluator_id: string
          evaluator_type?: string | null
          financial_viability?: number | null
          id?: string
          idea_id?: string | null
          implementation_complexity?: number | null
          innovation_level?: number | null
          market_potential?: number | null
          next_steps?: string | null
          recommendations?: string | null
          strategic_alignment?: number | null
          strengths?: string | null
          technical_feasibility?: number | null
          weaknesses?: string | null
        }
        Update: {
          created_at?: string | null
          evaluation_date?: string | null
          evaluator_id?: string
          evaluator_type?: string | null
          financial_viability?: number | null
          id?: string
          idea_id?: string | null
          implementation_complexity?: number | null
          innovation_level?: number | null
          market_potential?: number | null
          next_steps?: string | null
          recommendations?: string | null
          strategic_alignment?: number | null
          strengths?: string | null
          technical_feasibility?: number | null
          weaknesses?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "idea_evaluations_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_lifecycle_milestones: {
        Row: {
          achieved_by: string | null
          achieved_date: string | null
          created_at: string | null
          description: string | null
          id: string
          idea_id: string
          is_required: boolean | null
          milestone_type: string
          order_sequence: number | null
          status: string | null
          target_date: string | null
          title: string
        }
        Insert: {
          achieved_by?: string | null
          achieved_date?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          idea_id: string
          is_required?: boolean | null
          milestone_type: string
          order_sequence?: number | null
          status?: string | null
          target_date?: string | null
          title: string
        }
        Update: {
          achieved_by?: string | null
          achieved_date?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          idea_id?: string
          is_required?: boolean | null
          milestone_type?: string
          order_sequence?: number | null
          status?: string | null
          target_date?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_lifecycle_milestones_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_likes: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_likes_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "idea_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_metrics: {
        Row: {
          comments_count: number | null
          downloads_count: number | null
          engagement_rate: number | null
          id: string
          idea_id: string
          implementation_progress: number | null
          likes_count: number | null
          metric_date: string
          shares_count: number | null
          views_count: number | null
          virality_score: number | null
        }
        Insert: {
          comments_count?: number | null
          downloads_count?: number | null
          engagement_rate?: number | null
          id?: string
          idea_id: string
          implementation_progress?: number | null
          likes_count?: number | null
          metric_date: string
          shares_count?: number | null
          views_count?: number | null
          virality_score?: number | null
        }
        Update: {
          comments_count?: number | null
          downloads_count?: number | null
          engagement_rate?: number | null
          id?: string
          idea_id?: string
          implementation_progress?: number | null
          likes_count?: number | null
          metric_date?: string
          shares_count?: number | null
          views_count?: number | null
          virality_score?: number | null
        }
        Relationships: []
      }
      idea_notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          idea_id: string
          is_read: boolean | null
          message: string
          notification_type: string
          recipient_id: string
          sender_id: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          idea_id: string
          is_read?: boolean | null
          message: string
          notification_type: string
          recipient_id: string
          sender_id?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          idea_id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: string
          recipient_id?: string
          sender_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_notifications_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_recommendations: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          expires_at: string | null
          id: string
          interaction_type: string | null
          is_clicked: boolean | null
          is_viewed: boolean | null
          reasoning: string | null
          recommendation_type: string
          recommended_idea_id: string
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          interaction_type?: string | null
          is_clicked?: boolean | null
          is_viewed?: boolean | null
          reasoning?: string | null
          recommendation_type: string
          recommended_idea_id: string
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          interaction_type?: string | null
          is_clicked?: boolean | null
          is_viewed?: boolean | null
          reasoning?: string | null
          recommendation_type?: string
          recommended_idea_id?: string
          user_id?: string
        }
        Relationships: []
      }
      idea_tag_links: {
        Row: {
          added_by: string
          created_at: string | null
          id: string
          idea_id: string
          tag_id: string
        }
        Insert: {
          added_by: string
          created_at?: string | null
          id?: string
          idea_id: string
          tag_id: string
        }
        Update: {
          added_by?: string
          created_at?: string | null
          id?: string
          idea_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_tag_links_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "idea_tag_links_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "idea_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_tags: {
        Row: {
          category: string | null
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      idea_templates: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          description_ar: string | null
          id: string
          is_active: boolean | null
          name: string
          name_ar: string | null
          template_data: Json
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_ar?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          name_ar?: string | null
          template_data?: Json
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_ar?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_ar?: string | null
          template_data?: Json
          updated_at?: string
        }
        Relationships: []
      }
      idea_versions: {
        Row: {
          changed_by: string
          changes_summary: string | null
          created_at: string | null
          field_changes: Json | null
          id: string
          idea_id: string
          version_number: number
        }
        Insert: {
          changed_by: string
          changes_summary?: string | null
          created_at?: string | null
          field_changes?: Json | null
          id?: string
          idea_id: string
          version_number: number
        }
        Update: {
          changed_by?: string
          changes_summary?: string | null
          created_at?: string | null
          field_changes?: Json | null
          id?: string
          idea_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "idea_versions_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_workflow_states: {
        Row: {
          created_at: string | null
          from_status: string | null
          id: string
          idea_id: string
          metadata: Json | null
          reason: string | null
          to_status: string
          triggered_by: string
        }
        Insert: {
          created_at?: string | null
          from_status?: string | null
          id?: string
          idea_id: string
          metadata?: Json | null
          reason?: string | null
          to_status: string
          triggered_by: string
        }
        Update: {
          created_at?: string | null
          from_status?: string | null
          id?: string
          idea_id?: string
          metadata?: Json | null
          reason?: string | null
          to_status?: string
          triggered_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_workflow_states_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas: {
        Row: {
          alignment_score: number | null
          challenge_id: string | null
          collaboration_open: boolean | null
          comment_count: number | null
          created_at: string | null
          description_ar: string
          estimated_timeline: string | null
          expected_impact: string | null
          feasibility_score: number | null
          featured: boolean | null
          focus_question_id: string | null
          id: string
          image_url: string | null
          impact_score: number | null
          implementation_plan: string | null
          innovation_level: string | null
          innovation_score: number | null
          innovator_id: string
          like_count: number | null
          maturity_level: string | null
          overall_score: number | null
          resource_requirements: string | null
          solution_approach: string | null
          status: string | null
          tags: string[] | null
          title_ar: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          alignment_score?: number | null
          challenge_id?: string | null
          collaboration_open?: boolean | null
          comment_count?: number | null
          created_at?: string | null
          description_ar: string
          estimated_timeline?: string | null
          expected_impact?: string | null
          feasibility_score?: number | null
          featured?: boolean | null
          focus_question_id?: string | null
          id?: string
          image_url?: string | null
          impact_score?: number | null
          implementation_plan?: string | null
          innovation_level?: string | null
          innovation_score?: number | null
          innovator_id: string
          like_count?: number | null
          maturity_level?: string | null
          overall_score?: number | null
          resource_requirements?: string | null
          solution_approach?: string | null
          status?: string | null
          tags?: string[] | null
          title_ar: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          alignment_score?: number | null
          challenge_id?: string | null
          collaboration_open?: boolean | null
          comment_count?: number | null
          created_at?: string | null
          description_ar?: string
          estimated_timeline?: string | null
          expected_impact?: string | null
          feasibility_score?: number | null
          featured?: boolean | null
          focus_question_id?: string | null
          id?: string
          image_url?: string | null
          impact_score?: number | null
          implementation_plan?: string | null
          innovation_level?: string | null
          innovation_score?: number | null
          innovator_id?: string
          like_count?: number | null
          maturity_level?: string | null
          overall_score?: number | null
          resource_requirements?: string | null
          solution_approach?: string | null
          status?: string | null
          tags?: string[] | null
          title_ar?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ideas_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ideas_focus_question_id_fkey"
            columns: ["focus_question_id"]
            isOneToOne: false
            referencedRelation: "focus_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ideas_innovator_id_fkey"
            columns: ["innovator_id"]
            isOneToOne: false
            referencedRelation: "innovators"
            referencedColumns: ["id"]
          },
        ]
      }
      implementation_tracker: {
        Row: {
          actual_completion_date: string | null
          approved_budget: number | null
          challenge_id: string | null
          completion_percentage: number | null
          created_at: string | null
          estimated_completion_date: string | null
          health_status: string | null
          id: string
          implementation_owner_id: string | null
          implementation_stage: string | null
          last_update_date: string | null
          milestones_completed: number | null
          next_review_date: string | null
          project_manager_id: string | null
          remaining_budget: number | null
          sla_deadline: string | null
          spent_budget: number | null
          stakeholder_sponsor_id: string | null
          total_milestones: number | null
          updated_at: string | null
        }
        Insert: {
          actual_completion_date?: string | null
          approved_budget?: number | null
          challenge_id?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          estimated_completion_date?: string | null
          health_status?: string | null
          id?: string
          implementation_owner_id?: string | null
          implementation_stage?: string | null
          last_update_date?: string | null
          milestones_completed?: number | null
          next_review_date?: string | null
          project_manager_id?: string | null
          remaining_budget?: number | null
          sla_deadline?: string | null
          spent_budget?: number | null
          stakeholder_sponsor_id?: string | null
          total_milestones?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_completion_date?: string | null
          approved_budget?: number | null
          challenge_id?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          estimated_completion_date?: string | null
          health_status?: string | null
          id?: string
          implementation_owner_id?: string | null
          implementation_stage?: string | null
          last_update_date?: string | null
          milestones_completed?: number | null
          next_review_date?: string | null
          project_manager_id?: string | null
          remaining_budget?: number | null
          sla_deadline?: string | null
          spent_budget?: number | null
          stakeholder_sponsor_id?: string | null
          total_milestones?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "implementation_tracker_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      innovation_challenges_enhanced: {
        Row: {
          base_challenge_id: string | null
          collaboration_encouraged: boolean | null
          created_at: string | null
          difficulty_level: string | null
          estimated_hours: number | null
          id: string
          innovation_method: string | null
          mentorship_available: boolean | null
          required_skills: Json | null
          resource_links: Json | null
          reward_points: number | null
          success_criteria: Json | null
        }
        Insert: {
          base_challenge_id?: string | null
          collaboration_encouraged?: boolean | null
          created_at?: string | null
          difficulty_level?: string | null
          estimated_hours?: number | null
          id?: string
          innovation_method?: string | null
          mentorship_available?: boolean | null
          required_skills?: Json | null
          resource_links?: Json | null
          reward_points?: number | null
          success_criteria?: Json | null
        }
        Update: {
          base_challenge_id?: string | null
          collaboration_encouraged?: boolean | null
          created_at?: string | null
          difficulty_level?: string | null
          estimated_hours?: number | null
          id?: string
          innovation_method?: string | null
          mentorship_available?: boolean | null
          required_skills?: Json | null
          resource_links?: Json | null
          reward_points?: number | null
          success_criteria?: Json | null
        }
        Relationships: []
      }
      innovation_leaderboard: {
        Row: {
          engagement_score: number | null
          id: string
          ideas_implemented: number | null
          ideas_submitted: number | null
          period_end: string
          period_start: string
          period_type: string
          rank_position: number | null
          total_points: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          engagement_score?: number | null
          id?: string
          ideas_implemented?: number | null
          ideas_submitted?: number | null
          period_end: string
          period_start: string
          period_type?: string
          rank_position?: number | null
          total_points?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          engagement_score?: number | null
          id?: string
          ideas_implemented?: number | null
          ideas_submitted?: number | null
          period_end?: string
          period_start?: string
          period_type?: string
          rank_position?: number | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      innovation_maturity_index: {
        Row: {
          assessed_by: string | null
          assessment_date: string | null
          assessment_period: string | null
          created_at: string | null
          culture_maturity: number | null
          governance_maturity: number | null
          id: string
          international_benchmark_score: number | null
          maturity_level: string | null
          measurement_scope: string | null
          national_benchmark_score: number | null
          overall_maturity_score: number | null
          process_maturity: number | null
          scope_id: string | null
          strategy_maturity: number | null
          technology_maturity: number | null
        }
        Insert: {
          assessed_by?: string | null
          assessment_date?: string | null
          assessment_period?: string | null
          created_at?: string | null
          culture_maturity?: number | null
          governance_maturity?: number | null
          id?: string
          international_benchmark_score?: number | null
          maturity_level?: string | null
          measurement_scope?: string | null
          national_benchmark_score?: number | null
          overall_maturity_score?: number | null
          process_maturity?: number | null
          scope_id?: string | null
          strategy_maturity?: number | null
          technology_maturity?: number | null
        }
        Update: {
          assessed_by?: string | null
          assessment_date?: string | null
          assessment_period?: string | null
          created_at?: string | null
          culture_maturity?: number | null
          governance_maturity?: number | null
          id?: string
          international_benchmark_score?: number | null
          maturity_level?: string | null
          measurement_scope?: string | null
          national_benchmark_score?: number | null
          overall_maturity_score?: number | null
          process_maturity?: number | null
          scope_id?: string | null
          strategy_maturity?: number | null
          technology_maturity?: number | null
        }
        Relationships: []
      }
      innovation_profiles: {
        Row: {
          achievement_badges: Json | null
          bio: string | null
          collaboration_preferences: Json | null
          created_at: string | null
          expertise_areas: Json | null
          id: string
          innovation_journey: Json | null
          innovation_score: number | null
          level_tier: string | null
          mentorship_status: string | null
          skills_tags: Json | null
          total_points: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achievement_badges?: Json | null
          bio?: string | null
          collaboration_preferences?: Json | null
          created_at?: string | null
          expertise_areas?: Json | null
          id?: string
          innovation_journey?: Json | null
          innovation_score?: number | null
          level_tier?: string | null
          mentorship_status?: string | null
          skills_tags?: Json | null
          total_points?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achievement_badges?: Json | null
          bio?: string | null
          collaboration_preferences?: Json | null
          created_at?: string | null
          expertise_areas?: Json | null
          id?: string
          innovation_journey?: Json | null
          innovation_score?: number | null
          level_tier?: string | null
          mentorship_status?: string | null
          skills_tags?: Json | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      innovation_success_stories: {
        Row: {
          created_at: string | null
          created_by: string | null
          detailed_story: string | null
          featured_image_url: string | null
          id: string
          idea_id: string
          impact_areas: Json | null
          implementation_timeline: Json | null
          media_urls: Json | null
          published_at: string | null
          roi_metrics: Json | null
          status: string | null
          summary: string
          testimonials: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          detailed_story?: string | null
          featured_image_url?: string | null
          id?: string
          idea_id: string
          impact_areas?: Json | null
          implementation_timeline?: Json | null
          media_urls?: Json | null
          published_at?: string | null
          roi_metrics?: Json | null
          status?: string | null
          summary: string
          testimonials?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          detailed_story?: string | null
          featured_image_url?: string | null
          id?: string
          idea_id?: string
          impact_areas?: Json | null
          implementation_timeline?: Json | null
          media_urls?: Json | null
          published_at?: string | null
          roi_metrics?: Json | null
          status?: string | null
          summary?: string
          testimonials?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      innovation_team_members: {
        Row: {
          cic_role: string
          contact_email: string | null
          created_at: string | null
          current_workload: number | null
          department: string | null
          id: string
          join_date: string | null
          max_concurrent_projects: number | null
          notes: string | null
          performance_rating: number | null
          specialization: string[] | null
          status: string | null
          team_id: string | null
          user_id: string | null
        }
        Insert: {
          cic_role: string
          contact_email?: string | null
          created_at?: string | null
          current_workload?: number | null
          department?: string | null
          id?: string
          join_date?: string | null
          max_concurrent_projects?: number | null
          notes?: string | null
          performance_rating?: number | null
          specialization?: string[] | null
          status?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Update: {
          cic_role?: string
          contact_email?: string | null
          created_at?: string | null
          current_workload?: number | null
          department?: string | null
          id?: string
          join_date?: string | null
          max_concurrent_projects?: number | null
          notes?: string | null
          performance_rating?: number | null
          specialization?: string[] | null
          status?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "innovation_team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "innovation_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      innovation_teams: {
        Row: {
          created_at: string | null
          department: string | null
          description: string | null
          focus_area: string | null
          id: string
          logo_url: string | null
          max_members: number | null
          name: string
          name_ar: string | null
          status: string | null
          team_lead_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          description?: string | null
          focus_area?: string | null
          id?: string
          logo_url?: string | null
          max_members?: number | null
          name: string
          name_ar?: string | null
          status?: string | null
          team_lead_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          description?: string | null
          focus_area?: string | null
          id?: string
          logo_url?: string | null
          max_members?: number | null
          name?: string
          name_ar?: string | null
          status?: string | null
          team_lead_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "innovation_teams_team_lead_id_fkey"
            columns: ["team_lead_id"]
            isOneToOne: false
            referencedRelation: "innovation_team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      innovators: {
        Row: {
          areas_of_interest: string[] | null
          created_at: string | null
          experience_level: string | null
          id: string
          innovation_background: string | null
          innovation_score: number | null
          total_ideas_approved: number | null
          total_ideas_submitted: number | null
          user_id: string | null
        }
        Insert: {
          areas_of_interest?: string[] | null
          created_at?: string | null
          experience_level?: string | null
          id?: string
          innovation_background?: string | null
          innovation_score?: number | null
          total_ideas_approved?: number | null
          total_ideas_submitted?: number | null
          user_id?: string | null
        }
        Update: {
          areas_of_interest?: string[] | null
          created_at?: string | null
          experience_level?: string | null
          id?: string
          innovation_background?: string | null
          innovation_score?: number | null
          total_ideas_approved?: number | null
          total_ideas_submitted?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      insights: {
        Row: {
          actionability_score: number | null
          applicable_domains: string[] | null
          created_at: string | null
          extracted_by: string | null
          id: string
          insight_text_ar: string
          insight_type: string | null
          trend_report_id: string | null
        }
        Insert: {
          actionability_score?: number | null
          applicable_domains?: string[] | null
          created_at?: string | null
          extracted_by?: string | null
          id?: string
          insight_text_ar: string
          insight_type?: string | null
          trend_report_id?: string | null
        }
        Update: {
          actionability_score?: number | null
          applicable_domains?: string[] | null
          created_at?: string | null
          extracted_by?: string | null
          id?: string
          insight_text_ar?: string
          insight_type?: string | null
          trend_report_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insights_trend_report_id_fkey"
            columns: ["trend_report_id"]
            isOneToOne: false
            referencedRelation: "trend_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_page_content: {
        Row: {
          content_ar: string
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          section_key: string
          section_type: string | null
          title_ar: string
          updated_at: string | null
        }
        Insert: {
          content_ar: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          section_key: string
          section_type?: string | null
          title_ar: string
          updated_at?: string | null
        }
        Update: {
          content_ar?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          section_key?: string
          section_type?: string | null
          title_ar?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      landing_page_faqs: {
        Row: {
          answer_ar: string
          category: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          order_sequence: number | null
          question_ar: string
          updated_at: string | null
        }
        Insert: {
          answer_ar: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          order_sequence?: number | null
          question_ar: string
          updated_at?: string | null
        }
        Update: {
          answer_ar?: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          order_sequence?: number | null
          question_ar?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          benefits: Json | null
          budget_max: number | null
          budget_min: number | null
          category_id: string | null
          contact_email: string | null
          contact_person: string | null
          created_at: string | null
          created_by: string | null
          deadline: string | null
          department_id: string | null
          description_ar: string
          description_en: string | null
          id: string
          image_url: string | null
          location: string | null
          manager_id: string | null
          opportunity_type: string | null
          priority_level: string | null
          qualifications: string | null
          requirements: Json | null
          sector: string | null
          sector_id: string | null
          status: string | null
          success_metrics: string | null
          tags: string[] | null
          target_audience: Json | null
          title_ar: string
          title_en: string | null
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          benefits?: Json | null
          budget_max?: number | null
          budget_min?: number | null
          category_id?: string | null
          contact_email?: string | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          department_id?: string | null
          description_ar: string
          description_en?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          manager_id?: string | null
          opportunity_type?: string | null
          priority_level?: string | null
          qualifications?: string | null
          requirements?: Json | null
          sector?: string | null
          sector_id?: string | null
          status?: string | null
          success_metrics?: string | null
          tags?: string[] | null
          target_audience?: Json | null
          title_ar: string
          title_en?: string | null
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          benefits?: Json | null
          budget_max?: number | null
          budget_min?: number | null
          category_id?: string | null
          contact_email?: string | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          department_id?: string | null
          description_ar?: string
          description_en?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          manager_id?: string | null
          opportunity_type?: string | null
          priority_level?: string | null
          qualifications?: string | null
          requirements?: Json | null
          sector?: string | null
          sector_id?: string | null
          status?: string | null
          success_metrics?: string | null
          tags?: string[] | null
          target_audience?: Json | null
          title_ar?: string
          title_en?: string | null
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: []
      }
      opportunity_analytics: {
        Row: {
          application_count: number
          bookmark_count: number
          created_at: string
          id: string
          last_updated: string | null
          like_count: number
          opportunity_id: string
          share_count: number | null
          updated_at: string
          view_count: number
        }
        Insert: {
          application_count?: number
          bookmark_count?: number
          created_at?: string
          id?: string
          last_updated?: string | null
          like_count?: number
          opportunity_id: string
          share_count?: number | null
          updated_at?: string
          view_count?: number
        }
        Update: {
          application_count?: number
          bookmark_count?: number
          created_at?: string
          id?: string
          last_updated?: string | null
          like_count?: number
          opportunity_id?: string
          share_count?: number | null
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      opportunity_applications: {
        Row: {
          applicant_id: string
          application_source: string | null
          application_type: string | null
          attachment_urls: string[] | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string | null
          expected_budget: number | null
          follow_up_date: string | null
          id: string
          opportunity_id: string
          organization_name: string | null
          priority: string | null
          proposal_summary: string | null
          relevant_experience: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          status: string | null
          team_size: number | null
          timeline_months: number | null
          updated_at: string | null
        }
        Insert: {
          applicant_id: string
          application_source?: string | null
          application_type?: string | null
          attachment_urls?: string[] | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          expected_budget?: number | null
          follow_up_date?: string | null
          id?: string
          opportunity_id: string
          organization_name?: string | null
          priority?: string | null
          proposal_summary?: string | null
          relevant_experience?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: string | null
          team_size?: number | null
          timeline_months?: number | null
          updated_at?: string | null
        }
        Update: {
          applicant_id?: string
          application_source?: string | null
          application_type?: string | null
          attachment_urls?: string[] | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          expected_budget?: number | null
          follow_up_date?: string | null
          id?: string
          opportunity_id?: string
          organization_name?: string | null
          priority?: string | null
          proposal_summary?: string | null
          relevant_experience?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: string | null
          team_size?: number | null
          timeline_months?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      opportunity_audit_log: {
        Row: {
          action_type: string
          change_reason: string | null
          changed_by: string | null
          created_at: string
          id: string
          new_values: Json | null
          old_values: Json | null
          opportunity_id: string
        }
        Insert: {
          action_type: string
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          opportunity_id: string
        }
        Update: {
          action_type?: string
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          opportunity_id?: string
        }
        Relationships: []
      }
      opportunity_bookmarks: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          opportunity_id: string
          priority: string | null
          reminder_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          opportunity_id: string
          priority?: string | null
          reminder_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          opportunity_id?: string
          priority?: string | null
          reminder_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_bookmarks_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_bookmarks_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "partnership_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name_ar: string
          name_en: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_ar: string
          name_en?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_ar?: string
          name_en?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      opportunity_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          is_public: boolean | null
          likes_count: number | null
          opportunity_id: string
          parent_comment_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          is_public?: boolean | null
          likes_count?: number | null
          opportunity_id: string
          parent_comment_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          is_public?: boolean | null
          likes_count?: number | null
          opportunity_id?: string
          parent_comment_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      opportunity_geographic_analytics: {
        Row: {
          city: string | null
          country_code: string | null
          country_name: string | null
          created_at: string
          first_view_at: string
          id: string
          ip_address: unknown | null
          last_view_at: string
          opportunity_id: string
          region: string | null
          session_id: string
          updated_at: string
          user_id: string | null
          view_count: number
        }
        Insert: {
          city?: string | null
          country_code?: string | null
          country_name?: string | null
          created_at?: string
          first_view_at?: string
          id?: string
          ip_address?: unknown | null
          last_view_at?: string
          opportunity_id: string
          region?: string | null
          session_id: string
          updated_at?: string
          user_id?: string | null
          view_count?: number
        }
        Update: {
          city?: string | null
          country_code?: string | null
          country_name?: string | null
          created_at?: string
          first_view_at?: string
          id?: string
          ip_address?: unknown | null
          last_view_at?: string
          opportunity_id?: string
          region?: string | null
          session_id?: string
          updated_at?: string
          user_id?: string | null
          view_count?: number
        }
        Relationships: []
      }
      opportunity_likes: {
        Row: {
          created_at: string | null
          id: string
          opportunity_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          opportunity_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          opportunity_id?: string
          user_id?: string
        }
        Relationships: []
      }
      opportunity_live_presence: {
        Row: {
          created_at: string
          current_section: string | null
          id: string
          is_active: boolean
          last_seen: string
          opportunity_id: string
          session_id: string
          user_agent: string | null
          user_avatar: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          created_at?: string
          current_section?: string | null
          id?: string
          is_active?: boolean
          last_seen?: string
          opportunity_id: string
          session_id: string
          user_agent?: string | null
          user_avatar?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          created_at?: string
          current_section?: string | null
          id?: string
          is_active?: boolean
          last_seen?: string
          opportunity_id?: string
          session_id?: string
          user_agent?: string | null
          user_avatar?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_live_presence_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_live_presence_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "partnership_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          notification_type: string
          opportunity_id: string
          recipient_id: string
          sender_id: string | null
          title: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          notification_type: string
          opportunity_id: string
          recipient_id: string
          sender_id?: string | null
          title: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          notification_type?: string
          opportunity_id?: string
          recipient_id?: string
          sender_id?: string | null
          title?: string
        }
        Relationships: []
      }
      opportunity_shares: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          opportunity_id: string
          platform: string | null
          share_type: string | null
          shared_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          opportunity_id: string
          platform?: string | null
          share_type?: string | null
          shared_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          opportunity_id?: string
          platform?: string | null
          share_type?: string | null
          shared_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      opportunity_status: {
        Row: {
          challenge_id: string | null
          created_at: string | null
          current_stage: string
          id: string
          next_milestone_date: string | null
          stage_completion_percentage: number | null
          stage_notes: string | null
          stage_owner_id: string | null
          stage_start_date: string | null
        }
        Insert: {
          challenge_id?: string | null
          created_at?: string | null
          current_stage: string
          id?: string
          next_milestone_date?: string | null
          stage_completion_percentage?: number | null
          stage_notes?: string | null
          stage_owner_id?: string | null
          stage_start_date?: string | null
        }
        Update: {
          challenge_id?: string | null
          created_at?: string | null
          current_stage?: string
          id?: string
          next_milestone_date?: string | null
          stage_completion_percentage?: number | null
          stage_notes?: string | null
          stage_owner_id?: string | null
          stage_start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_status_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_user_journeys: {
        Row: {
          created_at: string
          id: string
          journey_step: string
          opportunity_id: string
          page_url: string | null
          previous_step: string | null
          session_id: string
          step_data: Json | null
          step_timestamp: string
          time_from_previous_ms: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          journey_step: string
          opportunity_id: string
          page_url?: string | null
          previous_step?: string | null
          session_id: string
          step_data?: Json | null
          step_timestamp?: string
          time_from_previous_ms?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          journey_step?: string
          opportunity_id?: string
          page_url?: string | null
          previous_step?: string | null
          session_id?: string
          step_data?: Json | null
          step_timestamp?: string
          time_from_previous_ms?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_user_journeys_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_user_journeys_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "partnership_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_view_sessions: {
        Row: {
          created_at: string
          first_view_at: string
          id: string
          ip_address: unknown | null
          last_view_at: string
          opportunity_id: string
          referrer: string | null
          session_id: string
          source: string | null
          time_spent_seconds: number | null
          updated_at: string
          user_agent: string | null
          user_id: string | null
          view_count: number
        }
        Insert: {
          created_at?: string
          first_view_at?: string
          id?: string
          ip_address?: unknown | null
          last_view_at?: string
          opportunity_id: string
          referrer?: string | null
          session_id: string
          source?: string | null
          time_spent_seconds?: number | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
          view_count?: number
        }
        Update: {
          created_at?: string
          first_view_at?: string
          id?: string
          ip_address?: unknown | null
          last_view_at?: string
          opportunity_id?: string
          referrer?: string | null
          session_id?: string
          source?: string | null
          time_spent_seconds?: number | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
          view_count?: number
        }
        Relationships: []
      }
      partner_bookmarks: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          partner_id: string
          priority: string | null
          reminder_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          partner_id: string
          priority?: string | null
          reminder_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          partner_id?: string
          priority?: string | null
          reminder_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_partner_bookmarks_partner_id"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          address: string | null
          capabilities: string[] | null
          collaboration_history: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          funding_capacity: number | null
          id: string
          logo_url: string | null
          name: string
          name_ar: string | null
          partner_type: string | null
          phone: string | null
          status: string | null
        }
        Insert: {
          address?: string | null
          capabilities?: string[] | null
          collaboration_history?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          funding_capacity?: number | null
          id?: string
          logo_url?: string | null
          name: string
          name_ar?: string | null
          partner_type?: string | null
          phone?: string | null
          status?: string | null
        }
        Update: {
          address?: string | null
          capabilities?: string[] | null
          collaboration_history?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          funding_capacity?: number | null
          id?: string
          logo_url?: string | null
          name?: string
          name_ar?: string | null
          partner_type?: string | null
          phone?: string | null
          status?: string | null
        }
        Relationships: []
      }
      partnership_analytics: {
        Row: {
          created_at: string | null
          id: string
          measurement_date: string | null
          metadata: Json | null
          metric_name: string
          metric_value: number
          partner_id: string | null
          partnership_id: string
          partnership_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          measurement_date?: string | null
          metadata?: Json | null
          metric_name: string
          metric_value: number
          partner_id?: string | null
          partnership_id: string
          partnership_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          measurement_date?: string | null
          metadata?: Json | null
          metric_name?: string
          metric_value?: number
          partner_id?: string | null
          partnership_id?: string
          partnership_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "partnership_analytics_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partnership_applications: {
        Row: {
          applicant_user_id: string
          company_background: string | null
          company_name: string
          contact_email: string
          contact_person: string
          contact_phone: string | null
          created_at: string | null
          id: string
          opportunity_id: string | null
          partner_id: string | null
          proposal_summary: string
          proposed_contribution: number | null
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          status: string
          submitted_at: string | null
          supporting_documents: Json | null
          updated_at: string | null
        }
        Insert: {
          applicant_user_id: string
          company_background?: string | null
          company_name: string
          contact_email: string
          contact_person: string
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          opportunity_id?: string | null
          partner_id?: string | null
          proposal_summary: string
          proposed_contribution?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: string
          submitted_at?: string | null
          supporting_documents?: Json | null
          updated_at?: string | null
        }
        Update: {
          applicant_user_id?: string
          company_background?: string | null
          company_name?: string
          contact_email?: string
          contact_person?: string
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          opportunity_id?: string | null
          partner_id?: string | null
          proposal_summary?: string
          proposed_contribution?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: string
          submitted_at?: string | null
          supporting_documents?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partnership_applications_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_file_size: number | null
          avatar_mime_type: string | null
          avatar_uploaded_at: string | null
          avatar_version: number | null
          bio: string | null
          created_at: string | null
          department: string | null
          email: string
          id: string
          name: string
          name_ar: string | null
          phone: string | null
          position: string | null
          preferred_language: string | null
          profile_image_url: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_file_size?: number | null
          avatar_mime_type?: string | null
          avatar_uploaded_at?: string | null
          avatar_version?: number | null
          bio?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          id: string
          name: string
          name_ar?: string | null
          phone?: string | null
          position?: string | null
          preferred_language?: string | null
          profile_image_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_file_size?: number | null
          avatar_mime_type?: string | null
          avatar_uploaded_at?: string | null
          avatar_version?: number | null
          bio?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          id?: string
          name?: string
          name_ar?: string | null
          phone?: string | null
          position?: string | null
          preferred_language?: string | null
          profile_image_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      public_statistics: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon_name: string | null
          id: string
          is_visible: boolean | null
          last_updated: string | null
          metric_description_ar: string | null
          metric_description_en: string | null
          metric_name: string
          metric_value: number
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_visible?: boolean | null
          last_updated?: string | null
          metric_description_ar?: string | null
          metric_description_en?: string | null
          metric_name: string
          metric_value?: number
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_visible?: boolean | null
          last_updated?: string | null
          metric_description_ar?: string | null
          metric_description_en?: string | null
          metric_name?: string
          metric_value?: number
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action: string
          created_at: string
          id: string
          request_count: number | null
          user_id: string
          window_start: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          request_count?: number | null
          user_id: string
          window_start?: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          request_count?: number | null
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
      role_approval_requests: {
        Row: {
          approver_id: string | null
          created_at: string
          expires_at: string | null
          id: string
          justification: string | null
          requested_role: Database["public"]["Enums"]["app_role"]
          requester_id: string
          reviewed_at: string | null
          reviewer_notes: string | null
          status: string | null
          target_user_id: string
        }
        Insert: {
          approver_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          justification?: string | null
          requested_role: Database["public"]["Enums"]["app_role"]
          requester_id: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: string | null
          target_user_id: string
        }
        Update: {
          approver_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          justification?: string | null
          requested_role?: Database["public"]["Enums"]["app_role"]
          requester_id?: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: string | null
          target_user_id?: string
        }
        Relationships: []
      }
      role_assignments: {
        Row: {
          assigned_to_id: string | null
          assigned_to_type: string | null
          assignment_date: string | null
          created_at: string | null
          end_date: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          notes: string | null
          role: string | null
          status: string | null
        }
        Insert: {
          assigned_to_id?: string | null
          assigned_to_type?: string | null
          assignment_date?: string | null
          created_at?: string | null
          end_date?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          notes?: string | null
          role?: string | null
          status?: string | null
        }
        Update: {
          assigned_to_id?: string | null
          assigned_to_type?: string | null
          assignment_date?: string | null
          created_at?: string | null
          end_date?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          notes?: string | null
          role?: string | null
          status?: string | null
        }
        Relationships: []
      }
      role_audit_log: {
        Row: {
          action_type: string
          created_at: string
          id: string
          justification: string | null
          metadata: Json | null
          new_expires_at: string | null
          old_expires_at: string | null
          performed_by: string
          target_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          justification?: string | null
          metadata?: Json | null
          new_expires_at?: string | null
          old_expires_at?: string | null
          performed_by: string
          target_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          justification?: string | null
          metadata?: Json | null
          new_expires_at?: string | null
          old_expires_at?: string | null
          performed_by?: string
          target_role?: Database["public"]["Enums"]["app_role"]
          target_user_id?: string
        }
        Relationships: []
      }
      role_hierarchy: {
        Row: {
          can_assign_roles: Database["public"]["Enums"]["app_role"][] | null
          created_at: string
          hierarchy_level: Database["public"]["Enums"]["role_hierarchy_level"]
          id: string
          requires_approval_for:
            | Database["public"]["Enums"]["app_role"][]
            | null
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          can_assign_roles?: Database["public"]["Enums"]["app_role"][] | null
          created_at?: string
          hierarchy_level: Database["public"]["Enums"]["role_hierarchy_level"]
          id?: string
          requires_approval_for?:
            | Database["public"]["Enums"]["app_role"][]
            | null
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          can_assign_roles?: Database["public"]["Enums"]["app_role"][] | null
          created_at?: string
          hierarchy_level?: Database["public"]["Enums"]["role_hierarchy_level"]
          id?: string
          requires_approval_for?:
            | Database["public"]["Enums"]["app_role"][]
            | null
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      role_requests: {
        Row: {
          created_at: string
          current_roles: Database["public"]["Enums"]["app_role"][] | null
          id: string
          justification: string | null
          reason: string | null
          requested_at: string
          requested_role: Database["public"]["Enums"]["app_role"]
          requester_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_roles?: Database["public"]["Enums"]["app_role"][] | null
          id?: string
          justification?: string | null
          reason?: string | null
          requested_at?: string
          requested_role: Database["public"]["Enums"]["app_role"]
          requester_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_roles?: Database["public"]["Enums"]["app_role"][] | null
          id?: string
          justification?: string | null
          reason?: string | null
          requested_at?: string
          requested_role?: Database["public"]["Enums"]["app_role"]
          requester_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      sector_bookmarks: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          priority: string | null
          reminder_date: string | null
          sector_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          reminder_date?: string | null
          sector_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          reminder_date?: string | null
          sector_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_sector_bookmarks_sector_id"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sector_bookmarks_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      sectors: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          name_ar: string | null
          updated_at: string | null
          vision_2030_alignment: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          name_ar?: string | null
          updated_at?: string | null
          vision_2030_alignment?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          name_ar?: string | null
          updated_at?: string | null
          vision_2030_alignment?: string | null
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action_type: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string | null
          risk_level: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          risk_level?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          risk_level?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          citizen_facing: boolean | null
          created_at: string | null
          digital_maturity_score: number | null
          id: string
          name: string
          name_ar: string | null
          service_type: string | null
          sub_domain_id: string | null
          updated_at: string | null
        }
        Insert: {
          citizen_facing?: boolean | null
          created_at?: string | null
          digital_maturity_score?: number | null
          id?: string
          name: string
          name_ar?: string | null
          service_type?: string | null
          sub_domain_id?: string | null
          updated_at?: string | null
        }
        Update: {
          citizen_facing?: boolean | null
          created_at?: string | null
          digital_maturity_score?: number | null
          id?: string
          name?: string
          name_ar?: string | null
          service_type?: string | null
          sub_domain_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_sub_domain_id_fkey"
            columns: ["sub_domain_id"]
            isOneToOne: false
            referencedRelation: "sub_domains"
            referencedColumns: ["id"]
          },
        ]
      }
      stakeholder_bookmarks: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          priority: string | null
          reminder_date: string | null
          stakeholder_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          reminder_date?: string | null
          stakeholder_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          reminder_date?: string | null
          stakeholder_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_stakeholder_bookmarks_stakeholder_id"
            columns: ["stakeholder_id"]
            isOneToOne: false
            referencedRelation: "stakeholders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stakeholder_bookmarks_stakeholder_id_fkey"
            columns: ["stakeholder_id"]
            isOneToOne: false
            referencedRelation: "stakeholders"
            referencedColumns: ["id"]
          },
        ]
      }
      stakeholders: {
        Row: {
          created_at: string | null
          email: string | null
          engagement_status: string | null
          id: string
          influence_level: string | null
          interest_level: string | null
          name: string | null
          notes: string | null
          organization: string | null
          phone: string | null
          position: string | null
          stakeholder_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          engagement_status?: string | null
          id?: string
          influence_level?: string | null
          interest_level?: string | null
          name?: string | null
          notes?: string | null
          organization?: string | null
          phone?: string | null
          position?: string | null
          stakeholder_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          engagement_status?: string | null
          id?: string
          influence_level?: string | null
          interest_level?: string | null
          name?: string | null
          notes?: string | null
          organization?: string | null
          phone?: string | null
          position?: string | null
          stakeholder_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sub_domains: {
        Row: {
          created_at: string | null
          domain_id: string | null
          id: string
          name: string
          name_ar: string | null
          technical_focus: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain_id?: string | null
          id?: string
          name: string
          name_ar?: string | null
          technical_focus?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain_id?: string | null
          id?: string
          name?: string
          name_ar?: string | null
          technical_focus?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sub_domains_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      suspicious_activities: {
        Row: {
          activity_type: string
          auto_detected: boolean | null
          created_at: string
          description: string
          id: string
          ip_address: unknown | null
          request_details: Json | null
          resolution_notes: string | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          auto_detected?: boolean | null
          created_at?: string
          description: string
          id?: string
          ip_address?: unknown | null
          request_details?: Json | null
          resolution_notes?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          auto_detected?: boolean | null
          created_at?: string
          description?: string
          id?: string
          ip_address?: unknown | null
          request_details?: Json | null
          resolution_notes?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_category: string
          setting_key: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_category: string
          setting_key: string
          setting_value: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_category?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      team_activities: {
        Row: {
          activity_date: string | null
          activity_description: string
          activity_type: string
          assignment_id: string | null
          collaboration_rating: number | null
          created_at: string | null
          deliverables: string | null
          end_time: string | null
          hours_spent: number | null
          id: string
          innovation_rating: number | null
          notes: string | null
          quality_rating: number | null
          start_time: string | null
          team_member_id: string
        }
        Insert: {
          activity_date?: string | null
          activity_description: string
          activity_type: string
          assignment_id?: string | null
          collaboration_rating?: number | null
          created_at?: string | null
          deliverables?: string | null
          end_time?: string | null
          hours_spent?: number | null
          id?: string
          innovation_rating?: number | null
          notes?: string | null
          quality_rating?: number | null
          start_time?: string | null
          team_member_id: string
        }
        Update: {
          activity_date?: string | null
          activity_description?: string
          activity_type?: string
          assignment_id?: string | null
          collaboration_rating?: number | null
          created_at?: string | null
          deliverables?: string | null
          end_time?: string | null
          hours_spent?: number | null
          id?: string
          innovation_rating?: number | null
          notes?: string | null
          quality_rating?: number | null
          start_time?: string | null
          team_member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_activities_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "team_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_activities_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "innovation_team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      team_assignments: {
        Row: {
          actual_hours: number | null
          assigned_by: string | null
          assigned_date: string | null
          assignment_id: string
          assignment_type: string
          completion_date: string | null
          created_at: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          notes: string | null
          priority_level: string | null
          role_in_assignment: string | null
          start_date: string | null
          status: string | null
          team_member_id: string
          updated_at: string | null
          workload_percentage: number | null
        }
        Insert: {
          actual_hours?: number | null
          assigned_by?: string | null
          assigned_date?: string | null
          assignment_id: string
          assignment_type: string
          completion_date?: string | null
          created_at?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          notes?: string | null
          priority_level?: string | null
          role_in_assignment?: string | null
          start_date?: string | null
          status?: string | null
          team_member_id: string
          updated_at?: string | null
          workload_percentage?: number | null
        }
        Update: {
          actual_hours?: number | null
          assigned_by?: string | null
          assigned_date?: string | null
          assignment_id?: string
          assignment_type?: string
          completion_date?: string | null
          created_at?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          notes?: string | null
          priority_level?: string | null
          role_in_assignment?: string | null
          start_date?: string | null
          status?: string | null
          team_member_id?: string
          updated_at?: string | null
          workload_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "team_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_assignments_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "innovation_team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      team_capacity_history: {
        Row: {
          actual_hours_worked: number | null
          allocated_hours: number | null
          availability_status: string | null
          created_at: string | null
          id: string
          leave_type: string | null
          notes: string | null
          peak_workload_day: string | null
          planned_capacity_hours: number | null
          team_member_id: string
          utilization_percentage: number | null
          week_start_date: string
        }
        Insert: {
          actual_hours_worked?: number | null
          allocated_hours?: number | null
          availability_status?: string | null
          created_at?: string | null
          id?: string
          leave_type?: string | null
          notes?: string | null
          peak_workload_day?: string | null
          planned_capacity_hours?: number | null
          team_member_id: string
          utilization_percentage?: number | null
          week_start_date: string
        }
        Update: {
          actual_hours_worked?: number | null
          allocated_hours?: number | null
          availability_status?: string | null
          created_at?: string | null
          id?: string
          leave_type?: string | null
          notes?: string | null
          peak_workload_day?: string | null
          planned_capacity_hours?: number | null
          team_member_id?: string
          utilization_percentage?: number | null
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_capacity_history_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "innovation_team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      team_performance_metrics: {
        Row: {
          assignments_completed: number | null
          assignments_overdue: number | null
          average_collaboration_rating: number | null
          average_innovation_rating: number | null
          average_quality_rating: number | null
          certifications_earned: number | null
          created_at: string | null
          evaluated_by: string | null
          evaluation_period: string
          goals_achieved: number | null
          goals_total: number | null
          id: string
          overall_performance_score: number | null
          peer_feedback_score: number | null
          performance_notes: string | null
          period_end_date: string
          period_start_date: string
          projects_contributed: number | null
          projects_led: number | null
          stakeholder_feedback_score: number | null
          supervisor_rating: number | null
          team_member_id: string
          total_hours_worked: number | null
          training_hours_completed: number | null
        }
        Insert: {
          assignments_completed?: number | null
          assignments_overdue?: number | null
          average_collaboration_rating?: number | null
          average_innovation_rating?: number | null
          average_quality_rating?: number | null
          certifications_earned?: number | null
          created_at?: string | null
          evaluated_by?: string | null
          evaluation_period: string
          goals_achieved?: number | null
          goals_total?: number | null
          id?: string
          overall_performance_score?: number | null
          peer_feedback_score?: number | null
          performance_notes?: string | null
          period_end_date: string
          period_start_date: string
          projects_contributed?: number | null
          projects_led?: number | null
          stakeholder_feedback_score?: number | null
          supervisor_rating?: number | null
          team_member_id: string
          total_hours_worked?: number | null
          training_hours_completed?: number | null
        }
        Update: {
          assignments_completed?: number | null
          assignments_overdue?: number | null
          average_collaboration_rating?: number | null
          average_innovation_rating?: number | null
          average_quality_rating?: number | null
          certifications_earned?: number | null
          created_at?: string | null
          evaluated_by?: string | null
          evaluation_period?: string
          goals_achieved?: number | null
          goals_total?: number | null
          id?: string
          overall_performance_score?: number | null
          peer_feedback_score?: number | null
          performance_notes?: string | null
          period_end_date?: string
          period_start_date?: string
          projects_contributed?: number | null
          projects_led?: number | null
          stakeholder_feedback_score?: number | null
          supervisor_rating?: number | null
          team_member_id?: string
          total_hours_worked?: number | null
          training_hours_completed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "team_performance_metrics_evaluated_by_fkey"
            columns: ["evaluated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_performance_metrics_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "innovation_team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      team_project_outcomes: {
        Row: {
          achievement_percentage: number | null
          actual_value: number | null
          assignment_id: string
          budget_variance_percentage: number | null
          completed_date: string | null
          created_at: string | null
          id: string
          impact_level: string | null
          lessons_learned: string | null
          outcome_description: string
          outcome_type: string
          project_id: string
          project_type: string
          recognition_received: string | null
          recommendations: string | null
          stakeholder_satisfaction: number | null
          success_metrics: Json | null
          target_value: number | null
          team_member_id: string
          timeline_variance_days: number | null
        }
        Insert: {
          achievement_percentage?: number | null
          actual_value?: number | null
          assignment_id: string
          budget_variance_percentage?: number | null
          completed_date?: string | null
          created_at?: string | null
          id?: string
          impact_level?: string | null
          lessons_learned?: string | null
          outcome_description: string
          outcome_type: string
          project_id: string
          project_type: string
          recognition_received?: string | null
          recommendations?: string | null
          stakeholder_satisfaction?: number | null
          success_metrics?: Json | null
          target_value?: number | null
          team_member_id: string
          timeline_variance_days?: number | null
        }
        Update: {
          achievement_percentage?: number | null
          actual_value?: number | null
          assignment_id?: string
          budget_variance_percentage?: number | null
          completed_date?: string | null
          created_at?: string | null
          id?: string
          impact_level?: string | null
          lessons_learned?: string | null
          outcome_description?: string
          outcome_type?: string
          project_id?: string
          project_type?: string
          recognition_received?: string | null
          recommendations?: string | null
          stakeholder_satisfaction?: number | null
          success_metrics?: Json | null
          target_value?: number | null
          team_member_id?: string
          timeline_variance_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "team_project_outcomes_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "team_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_project_outcomes_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "innovation_team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      template_criteria: {
        Row: {
          created_at: string | null
          criteria_id: string | null
          id: string
          is_required_override: boolean | null
          template_id: string | null
          weight_override: number | null
        }
        Insert: {
          created_at?: string | null
          criteria_id?: string | null
          id?: string
          is_required_override?: boolean | null
          template_id?: string | null
          weight_override?: number | null
        }
        Update: {
          created_at?: string | null
          criteria_id?: string | null
          id?: string
          is_required_override?: boolean | null
          template_id?: string | null
          weight_override?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "template_criteria_criteria_id_fkey"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "evaluation_criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_criteria_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "evaluation_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      trend_reports: {
        Row: {
          content: string
          content_ar: string | null
          created_at: string | null
          created_by: string | null
          credibility_score: number | null
          domain_tags: string[] | null
          geographic_scope: string | null
          id: string
          impact_potential: number | null
          publication_date: string | null
          relevance_score: number | null
          report_type: string | null
          sector_tags: string[] | null
          source_organization: string | null
          source_url: string | null
          title: string
          title_ar: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          content_ar?: string | null
          created_at?: string | null
          created_by?: string | null
          credibility_score?: number | null
          domain_tags?: string[] | null
          geographic_scope?: string | null
          id?: string
          impact_potential?: number | null
          publication_date?: string | null
          relevance_score?: number | null
          report_type?: string | null
          sector_tags?: string[] | null
          source_organization?: string | null
          source_url?: string | null
          title: string
          title_ar?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          content_ar?: string | null
          created_at?: string | null
          created_by?: string | null
          credibility_score?: number | null
          domain_tags?: string[] | null
          geographic_scope?: string | null
          id?: string
          impact_potential?: number | null
          publication_date?: string | null
          relevance_score?: number | null
          report_type?: string | null
          sector_tags?: string[] | null
          source_organization?: string | null
          source_url?: string | null
          title?: string
          title_ar?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      uploader_settings: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          setting_key: string
          setting_type: string
          setting_value?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          setting_key?: string
          setting_type?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_level: string
          achievement_type: string
          description: string | null
          earned_at: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          points_earned: number | null
          title: string
          user_id: string
        }
        Insert: {
          achievement_level?: string
          achievement_type: string
          description?: string | null
          earned_at?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          points_earned?: number | null
          title: string
          user_id: string
        }
        Update: {
          achievement_level?: string
          achievement_type?: string
          description?: string | null
          earned_at?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          points_earned?: number | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_invitations: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          created_at: string
          department: string | null
          email: string
          expires_at: string
          id: string
          initial_roles: string[] | null
          invitation_token: string
          invited_by: string
          name: string | null
          name_ar: string | null
          position: string | null
          status: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          department?: string | null
          email: string
          expires_at?: string
          id?: string
          initial_roles?: string[] | null
          invitation_token: string
          invited_by: string
          name?: string | null
          name_ar?: string | null
          position?: string | null
          status?: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          department?: string | null
          email?: string
          expires_at?: string
          id?: string
          initial_roles?: string[] | null
          invitation_token?: string
          invited_by?: string
          name?: string | null
          name_ar?: string | null
          position?: string | null
          status?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      partnership_opportunities: {
        Row: {
          benefits: Json | null
          budget_max: number | null
          budget_min: number | null
          category_id: string | null
          contact_email: string | null
          contact_person: string | null
          created_at: string | null
          created_by: string | null
          deadline: string | null
          department_id: string | null
          description_ar: string | null
          description_en: string | null
          id: string | null
          image_url: string | null
          location: string | null
          manager_id: string | null
          opportunity_type: string | null
          priority_level: string | null
          requirements: Json | null
          sector_id: string | null
          status: string | null
          success_metrics: string | null
          target_audience: Json | null
          title_ar: string | null
          title_en: string | null
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          benefits?: Json | null
          budget_max?: number | null
          budget_min?: number | null
          category_id?: string | null
          contact_email?: string | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          department_id?: string | null
          description_ar?: string | null
          description_en?: string | null
          id?: string | null
          image_url?: string | null
          location?: string | null
          manager_id?: string | null
          opportunity_type?: string | null
          priority_level?: string | null
          requirements?: Json | null
          sector_id?: string | null
          status?: string | null
          success_metrics?: string | null
          target_audience?: Json | null
          title_ar?: string | null
          title_en?: string | null
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          benefits?: Json | null
          budget_max?: number | null
          budget_min?: number | null
          category_id?: string | null
          contact_email?: string | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          department_id?: string | null
          description_ar?: string | null
          description_en?: string | null
          id?: string | null
          image_url?: string | null
          location?: string | null
          manager_id?: string | null
          opportunity_type?: string | null
          priority_level?: string | null
          requirements?: Json | null
          sector_id?: string | null
          status?: string | null
          success_metrics?: string | null
          target_audience?: Json | null
          title_ar?: string | null
          title_en?: string | null
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_cleanup_temp_files: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      approve_role_request: {
        Args: { request_id: string; approve: boolean; reviewer_notes?: string }
        Returns: Json
      }
      assign_role_with_justification: {
        Args: {
          target_user_id: string
          target_role: Database["public"]["Enums"]["app_role"]
          justification?: string
          expires_at?: string
        }
        Returns: string
      }
      assign_role_with_validation: {
        Args: {
          target_user_id: string
          target_role: Database["public"]["Enums"]["app_role"]
          justification?: string
          expires_at?: string
        }
        Returns: Json
      }
      auto_track_weekly_capacity: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_idea_analytics: {
        Args: { p_idea_id: string }
        Returns: undefined
      }
      can_view_event: {
        Args: {
          event_id: string
          event_visibility: string
          event_status: string
        }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          p_user_id: string
          p_action: string
          p_window_minutes?: number
          p_max_requests?: number
        }
        Returns: number
      }
      cleanup_expired_security_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_temp_files: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      detect_suspicious_activity: {
        Args: {
          p_user_id: string
          p_activity_type: string
          p_description: string
          p_severity?: string
          p_request_details?: Json
        }
        Returns: string
      }
      ensure_innovator_exists: {
        Args: { user_uuid: string }
        Returns: string
      }
      generate_invitation_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_basic_storage_info: {
        Args: Record<PropertyKey, never>
        Returns: {
          bucket_id: string
          bucket_name: string
          public: boolean
          created_at: string
        }[]
      }
      get_bucket_stats: {
        Args: { bucket_name: string }
        Returns: {
          total_files: number
          total_size: number
          avg_file_size: number
          oldest_file: string
          newest_file: string
        }[]
      }
      get_event_stats: {
        Args: { event_uuid: string }
        Returns: Json
      }
      get_opportunity_analytics_summary: {
        Args: { p_opportunity_id: string }
        Returns: {
          total_views: number
          total_likes: number
          total_applications: number
          total_shares: number
          engagement_rate: number
          conversion_rate: number
        }[]
      }
      get_storage_buckets_info: {
        Args: Record<PropertyKey, never>
        Returns: {
          bucket_id: string
          bucket_name: string
          public: boolean
          created_at: string
          file_count: number
          total_size: number
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      increment_opportunity_views: {
        Args: { p_opportunity_id: string }
        Returns: undefined
      }
      log_security_event: {
        Args: {
          action_type: string
          resource_type?: string
          resource_id?: string
          details?: Json
          risk_level?: string
        }
        Returns: string
      }
      refresh_opportunity_analytics: {
        Args: { p_opportunity_id: string }
        Returns: undefined
      }
      revoke_role_with_validation: {
        Args: {
          target_user_id: string
          target_role: Database["public"]["Enums"]["app_role"]
          reason?: string
        }
        Returns: Json
      }
      send_challenge_notification: {
        Args: {
          p_challenge_id: string
          p_recipient_id: string
          p_notification_type: string
          p_title: string
          p_message: string
          p_action_url?: string
          p_metadata?: Json
        }
        Returns: string
      }
      send_idea_workflow_notifications: {
        Args: { p_idea_id: string; p_from_status: string; p_to_status: string }
        Returns: undefined
      }
      send_notification: {
        Args: {
          target_user_id: string
          notification_title: string
          notification_message: string
          notification_type?: string
          notification_metadata?: Json
        }
        Returns: string
      }
      trigger_idea_workflow_change: {
        Args: { p_idea_id: string; p_to_status: string; p_reason?: string }
        Returns: boolean
      }
      update_file_paths_for_migration: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_weekly_capacity: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      validate_role_assignment: {
        Args: {
          assigner_user_id: string
          target_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "admin"
        | "sector_lead"
        | "department_head"
        | "domain_expert"
        | "evaluator"
        | "innovator"
        | "viewer"
        | "user_manager"
        | "role_manager"
        | "challenge_manager"
        | "expert_coordinator"
        | "content_manager"
        | "system_auditor"
        | "data_analyst"
        | "campaign_manager"
        | "event_manager"
        | "stakeholder_manager"
        | "partnership_manager"
      role_hierarchy_level: "1" | "2" | "3" | "4" | "5"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "admin",
        "sector_lead",
        "department_head",
        "domain_expert",
        "evaluator",
        "innovator",
        "viewer",
        "user_manager",
        "role_manager",
        "challenge_manager",
        "expert_coordinator",
        "content_manager",
        "system_auditor",
        "data_analyst",
        "campaign_manager",
        "event_manager",
        "stakeholder_manager",
        "partnership_manager",
      ],
      role_hierarchy_level: ["1", "2", "3", "4", "5"],
    },
  },
} as const
