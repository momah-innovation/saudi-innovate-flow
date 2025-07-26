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
      campaigns: {
        Row: {
          budget: number | null
          campaign_manager_id: string | null
          created_at: string | null
          description: string | null
          description_ar: string | null
          end_date: string
          id: string
          registration_deadline: string | null
          start_date: string
          status: string | null
          success_metrics: string | null
          target_ideas: number | null
          target_participants: number | null
          theme: string | null
          title: string
          title_ar: string | null
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          campaign_manager_id?: string | null
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          end_date: string
          id?: string
          registration_deadline?: string | null
          start_date: string
          status?: string | null
          success_metrics?: string | null
          target_ideas?: number | null
          target_participants?: number | null
          theme?: string | null
          title: string
          title_ar?: string | null
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          campaign_manager_id?: string | null
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          end_date?: string
          id?: string
          registration_deadline?: string | null
          start_date?: string
          status?: string | null
          success_metrics?: string | null
          target_ideas?: number | null
          target_participants?: number | null
          theme?: string | null
          title?: string
          title_ar?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
          description: string
          description_ar: string | null
          domain_id: string | null
          end_date: string | null
          estimated_budget: number | null
          id: string
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
          title: string
          title_ar: string | null
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
          description: string
          description_ar?: string | null
          domain_id?: string | null
          end_date?: string | null
          estimated_budget?: number | null
          id?: string
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
          title: string
          title_ar?: string | null
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
          description?: string
          description_ar?: string | null
          domain_id?: string | null
          end_date?: string | null
          estimated_budget?: number | null
          id?: string
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
          title?: string
          title_ar?: string | null
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
      events: {
        Row: {
          actual_participants: number | null
          budget: number | null
          campaign_id: string | null
          created_at: string | null
          description: string | null
          description_ar: string | null
          end_time: string | null
          event_date: string
          event_manager_id: string | null
          event_type: string | null
          format: string | null
          id: string
          location: string | null
          max_participants: number | null
          registered_participants: number | null
          start_time: string | null
          status: string | null
          title: string
          title_ar: string | null
          virtual_link: string | null
        }
        Insert: {
          actual_participants?: number | null
          budget?: number | null
          campaign_id?: string | null
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          end_time?: string | null
          event_date: string
          event_manager_id?: string | null
          event_type?: string | null
          format?: string | null
          id?: string
          location?: string | null
          max_participants?: number | null
          registered_participants?: number | null
          start_time?: string | null
          status?: string | null
          title: string
          title_ar?: string | null
          virtual_link?: string | null
        }
        Update: {
          actual_participants?: number | null
          budget?: number | null
          campaign_id?: string | null
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          end_time?: string | null
          event_date?: string
          event_manager_id?: string | null
          event_type?: string | null
          format?: string | null
          id?: string
          location?: string | null
          max_participants?: number | null
          registered_participants?: number | null
          start_time?: string | null
          status?: string | null
          title?: string
          title_ar?: string | null
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
        ]
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
      focus_questions: {
        Row: {
          challenge_id: string | null
          created_at: string | null
          id: string
          is_sensitive: boolean | null
          order_sequence: number | null
          question_text: string
          question_text_ar: string | null
          question_type: string | null
          updated_at: string | null
        }
        Insert: {
          challenge_id?: string | null
          created_at?: string | null
          id?: string
          is_sensitive?: boolean | null
          order_sequence?: number | null
          question_text: string
          question_text_ar?: string | null
          question_type?: string | null
          updated_at?: string | null
        }
        Update: {
          challenge_id?: string | null
          created_at?: string | null
          id?: string
          is_sensitive?: boolean | null
          order_sequence?: number | null
          question_text?: string
          question_text_ar?: string | null
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
      ideas: {
        Row: {
          alignment_score: number | null
          challenge_id: string | null
          created_at: string | null
          description: string
          description_ar: string | null
          expected_impact: string | null
          feasibility_score: number | null
          focus_question_id: string | null
          id: string
          impact_score: number | null
          implementation_plan: string | null
          innovation_score: number | null
          innovator_id: string
          maturity_level: string | null
          overall_score: number | null
          resource_requirements: string | null
          solution_approach: string | null
          status: string | null
          title: string
          title_ar: string | null
          updated_at: string | null
        }
        Insert: {
          alignment_score?: number | null
          challenge_id?: string | null
          created_at?: string | null
          description: string
          description_ar?: string | null
          expected_impact?: string | null
          feasibility_score?: number | null
          focus_question_id?: string | null
          id?: string
          impact_score?: number | null
          implementation_plan?: string | null
          innovation_score?: number | null
          innovator_id: string
          maturity_level?: string | null
          overall_score?: number | null
          resource_requirements?: string | null
          solution_approach?: string | null
          status?: string | null
          title: string
          title_ar?: string | null
          updated_at?: string | null
        }
        Update: {
          alignment_score?: number | null
          challenge_id?: string | null
          created_at?: string | null
          description?: string
          description_ar?: string | null
          expected_impact?: string | null
          feasibility_score?: number | null
          focus_question_id?: string | null
          id?: string
          impact_score?: number | null
          implementation_plan?: string | null
          innovation_score?: number | null
          innovator_id?: string
          maturity_level?: string | null
          overall_score?: number | null
          resource_requirements?: string | null
          solution_approach?: string | null
          status?: string | null
          title?: string
          title_ar?: string | null
          updated_at?: string | null
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
      innovation_team_members: {
        Row: {
          cic_role: string
          created_at: string | null
          current_workload: number | null
          id: string
          max_concurrent_projects: number | null
          performance_rating: number | null
          specialization: string[] | null
          user_id: string | null
        }
        Insert: {
          cic_role: string
          created_at?: string | null
          current_workload?: number | null
          id?: string
          max_concurrent_projects?: number | null
          performance_rating?: number | null
          specialization?: string[] | null
          user_id?: string | null
        }
        Update: {
          cic_role?: string
          created_at?: string | null
          current_workload?: number | null
          id?: string
          max_concurrent_projects?: number | null
          performance_rating?: number | null
          specialization?: string[] | null
          user_id?: string | null
        }
        Relationships: []
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
          insight_text: string
          insight_text_ar: string | null
          insight_type: string | null
          trend_report_id: string | null
        }
        Insert: {
          actionability_score?: number | null
          applicable_domains?: string[] | null
          created_at?: string | null
          extracted_by?: string | null
          id?: string
          insight_text: string
          insight_text_ar?: string | null
          insight_type?: string | null
          trend_report_id?: string | null
        }
        Update: {
          actionability_score?: number | null
          applicable_domains?: string[] | null
          created_at?: string | null
          extracted_by?: string | null
          id?: string
          insight_text?: string
          insight_text_ar?: string | null
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
          name?: string
          name_ar?: string | null
          partner_type?: string | null
          phone?: string | null
          status?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
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
      sectors: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          name_ar: string | null
          updated_at: string | null
          vision_2030_alignment: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          name_ar?: string | null
          updated_at?: string | null
          vision_2030_alignment?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          name_ar?: string | null
          updated_at?: string | null
          vision_2030_alignment?: string | null
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
      stakeholders: {
        Row: {
          created_at: string | null
          email: string | null
          engagement_status: string | null
          id: string
          influence_level: string | null
          interest_level: string | null
          name: string
          name_ar: string | null
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
          name: string
          name_ar?: string | null
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
          name?: string
          name_ar?: string | null
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
      [_ in never]: never
    }
    Functions: {
      generate_invitation_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
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
    },
  },
} as const
