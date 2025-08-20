# EvaluationManagement.tsx Translation Fixes

## Total Violations Found: 100+

### Categories of Violations

#### 1. Mock Data (Lines 140-179)

- Criteria names and descriptions
- Template names and descriptions
- Rule names
- Scoring guides

#### 2. Toast Messages (20+ violations)

- Save success/error messages
- Delete confirmations
- Various status updates

#### 3. UI Labels (60+ violations)

- Page title and description
- Tab labels
- Button labels
- Form field labels
- Card titles
- Badge texts
- Select options
- Dialog titles
- Alert messages

#### 4. Statistics Labels (10+ violations)

- Metric names
- Statistical values
- Chart labels

## Keys to Add to Translation Files

### admin.json additions needed:

```json
{
  "evaluation": {
    "title": "Evaluation System Management",
    "description": "Manage evaluation criteria, templates, and rules",
    "loading": "Loading data...",
    "system_settings": "System Settings",

    "metrics": {
      "active_criteria": "Active Criteria",
      "templates": "Templates",
      "active_rules": "Active Rules",
      "avg_weight": "Avg Weight"
    },

    "tabs": {
      "criteria": "Criteria",
      "templates": "Templates",
      "rules": "Rules",
      "scorecards": "Scorecards",
      "framework": "Framework",
      "analytics": "Analytics"
    },

    "criteria": {
      "title": "Evaluation Criteria",
      "add": "Add Criteria",
      "edit": "Edit Criteria",
      "add_new": "Add New Criteria",
      "name": "Criteria Name",
      "name_placeholder": "Enter criteria name",
      "category": "Category",
      "category_placeholder": "Select category",
      "description": "Description",
      "description_placeholder": "Enter criteria description",
      "weight": "Weight (%)",
      "min_score": "Min Score",
      "max_score": "Max Score",
      "scoring_guide": "Scoring Guide",
      "scoring_guide_placeholder": "Enter detailed scoring guide",
      "required": "Required Criteria",
      "delete_title": "Delete Criteria",
      "delete_confirm": "Are you sure you want to delete this criteria? This action cannot be undone.",
      "save_success": "Criteria saved successfully",
      "delete_success": "Criteria deleted successfully",

      "categories": {
        "technical": "Technical",
        "financial": "Financial",
        "strategic": "Strategic",
        "innovation": "Innovation",
        "market": "Market"
      }
    },

    "templates": {
      "title": "Evaluation Templates",
      "add": "Add Template",
      "edit": "Edit Template",
      "add_new": "Add New Template",
      "name": "Template Name",
      "name_placeholder": "Enter template name",
      "type": "Evaluation Type",
      "type_placeholder": "Select type",
      "description": "Description",
      "description_placeholder": "Enter template description",
      "selected_criteria": "Selected Criteria",
      "default": "Default Template",
      "included_criteria": "Included Criteria",
      "delete_title": "Delete Template",
      "delete_confirm": "Are you sure you want to delete this template? This action cannot be undone.",
      "save_success": "Template saved successfully",
      "delete_success": "Template deleted successfully",

      "types": {
        "innovation": "Innovation",
        "feasibility": "Feasibility",
        "impact": "Impact",
        "comprehensive": "Comprehensive"
      }
    },

    "rules": {
      "title": "Evaluation Rules",
      "add": "Add Rule",
      "edit": "Edit Rule",
      "add_new": "Add New Rule",
      "name": "Rule Name",
      "name_placeholder": "Enter rule name",
      "condition_type": "Condition Type",
      "condition_value": "Condition Value",
      "action_type": "Action Type",
      "action_value": "Action Value",
      "action_value_placeholder": "Enter action value (optional)",
      "priority": "Priority",
      "active": "Active Rule",
      "status_active": "Active",
      "status_inactive": "Inactive",
      "condition": "Condition",
      "action": "Action",
      "delete_title": "Delete Rule",
      "delete_confirm": "Are you sure you want to delete this rule? This action cannot be undone.",
      "save_success": "Rule saved successfully",
      "delete_success": "Rule deleted successfully",

      "conditions": {
        "min_score": "Minimum Score",
        "max_score": "Maximum Score",
        "avg_score": "Average Score",
        "criteria_score": "Specific Criteria Score"
      },

      "actions": {
        "auto_approve": "Auto Approve",
        "auto_reject": "Auto Reject",
        "flag_review": "Flag for Review",
        "assign_evaluator": "Assign Evaluator",
        "send_notification": "Send Notification"
      }
    },

    "scorecards": {
      "title": "Evaluation Scorecards",
      "description": "Manage and customize scorecards for idea evaluation",
      "create": "Create Scorecard"
    },

    "framework": {
      "title": "Evaluation Framework",
      "description": "Configure the overall evaluation system framework",
      "scale_type": "Scale Type",
      "final_score": "Final Score Calculation",
      "thresholds": "Evaluation Thresholds",
      "approval_threshold": "Approval Threshold (Excellent)",
      "review_threshold": "Review Threshold (Good)",
      "rejection_threshold": "Rejection Threshold (Poor)",

      "scales": {
        "points_5": "1-5 Points",
        "points_10": "1-10 Points",
        "points_100": "1-100 Points",
        "percentage": "Percentage"
      },

      "calculations": {
        "weighted_average": "Weighted Average",
        "simple_average": "Simple Average",
        "sum": "Sum",
        "custom": "Custom"
      }
    },

    "analytics": {
      "criteria_stats": "Criteria Statistics",
      "usage_stats": "Usage Statistics",
      "total_evaluations": "Total Evaluations",
      "average_score": "Average Score",
      "approval_rate": "Approval Rate",
      "avg_evaluation_time": "Avg Evaluation Time",
      "days": "days"
    },

    "common": {
      "save": "Save",
      "cancel": "Cancel",
      "delete": "Delete",
      "weight_label": "Weight"
    }
  }
}
```

## Files Completed

- ✅ Translation keys documented
- 🔄 Next: Add keys to translation files and fix the code
