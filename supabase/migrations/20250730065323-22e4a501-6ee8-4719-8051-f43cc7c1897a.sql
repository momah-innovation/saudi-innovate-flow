-- Create evaluation criteria table
CREATE TABLE evaluation_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  description TEXT,
  description_ar TEXT,
  category VARCHAR(100) NOT NULL,
  weight INTEGER NOT NULL DEFAULT 10 CHECK (weight >= 1 AND weight <= 100),
  is_required BOOLEAN DEFAULT true,
  min_score INTEGER DEFAULT 1,
  max_score INTEGER DEFAULT 10,
  scoring_guide TEXT,
  scoring_guide_ar TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create evaluation templates table
CREATE TABLE evaluation_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  description TEXT,
  description_ar TEXT,
  evaluation_type VARCHAR(100) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  criteria_config JSONB DEFAULT '[]'::jsonb,
  scoring_method VARCHAR(50) DEFAULT 'weighted_average',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create evaluation rules table
CREATE TABLE evaluation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  condition_type VARCHAR(100) NOT NULL,
  condition_value NUMERIC NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  action_value TEXT,
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create evaluation scorecards table
CREATE TABLE evaluation_scorecards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  template_id UUID REFERENCES evaluation_templates(id) ON DELETE CASCADE,
  criteria_scores JSONB DEFAULT '{}'::jsonb,
  final_score NUMERIC,
  evaluation_notes TEXT,
  recommendation VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create evaluation system settings table
CREATE TABLE evaluation_system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'general',
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create template-criteria junction table
CREATE TABLE template_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES evaluation_templates(id) ON DELETE CASCADE,
  criteria_id UUID REFERENCES evaluation_criteria(id) ON DELETE CASCADE,
  weight_override INTEGER,
  is_required_override BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(template_id, criteria_id)
);

-- Enable RLS
ALTER TABLE evaluation_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_scorecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_criteria ENABLE ROW LEVEL SECURITY;

-- RLS policies for evaluation_criteria
CREATE POLICY "Admin users can manage evaluation criteria" ON evaluation_criteria
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'super_admin')
      AND ur.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'super_admin')
      AND ur.is_active = true
    )
  );

CREATE POLICY "Users can view active evaluation criteria" ON evaluation_criteria
  FOR SELECT USING (is_active = true);

-- RLS policies for evaluation_templates
CREATE POLICY "Admin users can manage evaluation templates" ON evaluation_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'super_admin')
      AND ur.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'super_admin')
      AND ur.is_active = true
    )
  );

CREATE POLICY "Users can view active evaluation templates" ON evaluation_templates
  FOR SELECT USING (is_active = true);

-- RLS policies for evaluation_rules
CREATE POLICY "Admin users can manage evaluation rules" ON evaluation_rules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'super_admin')
      AND ur.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'super_admin')
      AND ur.is_active = true
    )
  );

-- RLS policies for evaluation_scorecards
CREATE POLICY "Users can manage their evaluation scorecards" ON evaluation_scorecards
  FOR ALL USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Admin users can view all evaluation scorecards" ON evaluation_scorecards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'super_admin')
      AND ur.is_active = true
    )
  );

-- RLS policies for evaluation_system_settings
CREATE POLICY "Admin users can manage evaluation system settings" ON evaluation_system_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'super_admin')
      AND ur.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'super_admin')
      AND ur.is_active = true
    )
  );

-- RLS policies for template_criteria
CREATE POLICY "Admin users can manage template criteria" ON template_criteria
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'super_admin')
      AND ur.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'super_admin')
      AND ur.is_active = true
    )
  );

CREATE POLICY "Users can view template criteria" ON template_criteria
  FOR SELECT USING (true);

-- Create update triggers
CREATE TRIGGER update_evaluation_criteria_updated_at
  BEFORE UPDATE ON evaluation_criteria
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluation_templates_updated_at
  BEFORE UPDATE ON evaluation_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluation_rules_updated_at
  BEFORE UPDATE ON evaluation_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluation_scorecards_updated_at
  BEFORE UPDATE ON evaluation_scorecards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluation_system_settings_updated_at
  BEFORE UPDATE ON evaluation_system_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default evaluation criteria
INSERT INTO evaluation_criteria (name, name_ar, description, description_ar, category, weight, is_required, min_score, max_score, scoring_guide, scoring_guide_ar) VALUES
('Technical Feasibility', 'الجدوى التقنية', 'Assess the technical implementation feasibility of the idea', 'تقييم إمكانية التنفيذ التقني للفكرة', 'technical', 20, true, 1, 10, 'Evaluate technical complexity, available technology, implementation challenges', 'تقييم التعقيد التقني والتكنولوجيا المتاحة وتحديات التنفيذ'),
('Financial Viability', 'الجدوى المالية', 'Financial feasibility analysis and expected return', 'تحليل الجدوى المالية والعائد المتوقع', 'financial', 25, true, 1, 10, 'Analyze costs, revenue potential, ROI, budget requirements', 'تحليل التكاليف والعائد المحتمل ومتطلبات الميزانية'),
('Market Potential', 'إمكانات السوق', 'Market size, demand, and commercial viability', 'حجم السوق والطلب والجدوى التجارية', 'market', 20, true, 1, 10, 'Assess market size, target audience, competition, demand', 'تقييم حجم السوق والجمهور المستهدف والمنافسة والطلب'),
('Strategic Alignment', 'التوافق الاستراتيجي', 'Alignment with organizational strategy and goals', 'التوافق مع الاستراتيجية والأهداف التنظيمية', 'strategic', 15, true, 1, 10, 'Evaluate alignment with vision, mission, strategic objectives', 'تقييم التوافق مع الرؤية والرسالة والأهداف الاستراتيجية'),
('Innovation Level', 'مستوى الابتكار', 'Degree of innovation and uniqueness', 'درجة الابتكار والتفرد', 'innovation', 20, true, 1, 10, 'Assess novelty, creativity, disruptive potential', 'تقييم الجدة والإبداع والإمكانات التخريبية');

-- Insert default evaluation template
INSERT INTO evaluation_templates (name, name_ar, description, description_ar, evaluation_type, is_default, criteria_config, scoring_method) VALUES
('Comprehensive Innovation Evaluation', 'تقييم الابتكار الشامل', 'Complete evaluation template for innovative ideas', 'قالب تقييم شامل للأفكار الابتكارية', 'innovation', true, '[{"criteria_id": "", "weight": 20}, {"criteria_id": "", "weight": 25}]', 'weighted_average');

-- Insert default evaluation rules
INSERT INTO evaluation_rules (name, name_ar, condition_type, condition_value, action_type, action_value, priority, is_active) VALUES
('Auto Approval Rule', 'قاعدة الموافقة التلقائية', 'min_score', 8, 'auto_approve', 'approved', 1, true),
('Review Flag Rule', 'قاعدة تحديد المراجعة', 'avg_score', 6, 'flag_review', 'needs_review', 2, true),
('Auto Rejection Rule', 'قاعدة الرفض التلقائي', 'max_score', 3, 'auto_reject', 'rejected', 3, true);

-- Insert default system settings
INSERT INTO evaluation_system_settings (setting_key, setting_value, description, category) VALUES
('scoring_scale', '{"min": 1, "max": 10, "type": "numeric"}', 'Default scoring scale for evaluations', 'scoring'),
('calculation_method', '{"method": "weighted_average", "round_to": 1}', 'How final scores are calculated', 'scoring'),
('approval_threshold', '{"excellent": 8, "good": 6, "poor": 4}', 'Score thresholds for automatic actions', 'thresholds'),
('mandatory_feedback', '{"strengths": true, "weaknesses": true, "recommendations": true}', 'Required feedback fields', 'feedback'),
('evaluation_timeout', '{"days": 7, "reminder_days": [3, 1]}', 'Evaluation deadlines and reminders', 'workflow');