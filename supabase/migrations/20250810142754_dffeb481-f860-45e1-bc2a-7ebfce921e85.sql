-- PHASE 4B: Complete Database Migration - Part 2 (Additional Tables)
-- Update more tables to use key-based translations

-- 6. AI and activity tables
UPDATE ai_feature_toggles 
SET 
  feature_category = CASE feature_category
    WHEN 'general' THEN 'ai_category.general'
    WHEN 'content' THEN 'ai_category.content'
    WHEN 'analysis' THEN 'ai_category.analysis'
    WHEN 'recommendation' THEN 'ai_category.recommendation'
    ELSE 'ai_category.' || feature_category
  END,
  required_subscription_tier = CASE required_subscription_tier
    WHEN 'basic' THEN 'subscription.basic'
    WHEN 'premium' THEN 'subscription.premium'
    WHEN 'enterprise' THEN 'subscription.enterprise'
    ELSE COALESCE('subscription.' || required_subscription_tier, required_subscription_tier)
  END
WHERE feature_category NOT LIKE 'ai_category.%' OR required_subscription_tier NOT LIKE 'subscription.%';

UPDATE ai_preferences 
SET 
  creativity_level = CASE creativity_level
    WHEN 'balanced' THEN 'creativity.balanced'
    WHEN 'conservative' THEN 'creativity.conservative'
    WHEN 'creative' THEN 'creativity.creative'
    WHEN 'experimental' THEN 'creativity.experimental'
    ELSE 'creativity.' || creativity_level
  END,
  language_preference = CASE language_preference
    WHEN 'ar' THEN 'language.ar'
    WHEN 'en' THEN 'language.en'
    ELSE 'language.' || language_preference
  END
WHERE creativity_level NOT LIKE 'creativity.%' OR language_preference NOT LIKE 'language.%';

UPDATE activity_events 
SET 
  event_type = CASE event_type
    WHEN 'create' THEN 'activity.create'
    WHEN 'update' THEN 'activity.update'
    WHEN 'delete' THEN 'activity.delete'
    WHEN 'view' THEN 'activity.view'
    WHEN 'like' THEN 'activity.like'
    WHEN 'comment' THEN 'activity.comment'
    WHEN 'share' THEN 'activity.share'
    ELSE 'activity.' || event_type
  END,
  entity_type = CASE entity_type
    WHEN 'challenge' THEN 'entity.challenge'
    WHEN 'idea' THEN 'entity.idea'
    WHEN 'event' THEN 'entity.event'
    WHEN 'opportunity' THEN 'entity.opportunity'
    WHEN 'campaign' THEN 'entity.campaign'
    ELSE 'entity.' || entity_type
  END,
  privacy_level = CASE privacy_level
    WHEN 'public' THEN 'visibility.public'
    WHEN 'private' THEN 'visibility.private'
    WHEN 'internal' THEN 'visibility.internal'
    WHEN 'restricted' THEN 'visibility.restricted'
    ELSE 'visibility.' || privacy_level
  END
WHERE event_type NOT LIKE 'activity.%' OR entity_type NOT LIKE 'entity.%' OR privacy_level NOT LIKE 'visibility.%';

-- 7. Challenge related tables
UPDATE challenge_requirements 
SET requirement_type = CASE requirement_type
  WHEN 'technical' THEN 'requirement.technical'
  WHEN 'business' THEN 'requirement.business'
  WHEN 'legal' THEN 'requirement.legal'
  WHEN 'documentation' THEN 'requirement.documentation'
  WHEN 'presentation' THEN 'requirement.presentation'
  ELSE 'requirement.' || requirement_type
END
WHERE requirement_type NOT LIKE 'requirement.%';

UPDATE challenge_scorecards 
SET 
  recommendation = CASE recommendation
    WHEN 'approve' THEN 'recommendation.approve'
    WHEN 'reject' THEN 'recommendation.reject'
    WHEN 'needs_improvement' THEN 'recommendation.needs_improvement'
    WHEN 'conditional_approval' THEN 'recommendation.conditional_approval'
    ELSE COALESCE('recommendation.' || recommendation, recommendation)
  END,
  risk_assessment = CASE risk_assessment
    WHEN 'low' THEN 'risk.low'
    WHEN 'medium' THEN 'risk.medium'
    WHEN 'high' THEN 'risk.high'
    WHEN 'critical' THEN 'risk.critical'
    ELSE COALESCE('risk.' || risk_assessment, risk_assessment)
  END
WHERE recommendation NOT LIKE 'recommendation.%' OR risk_assessment NOT LIKE 'risk.%';

UPDATE challenge_shares 
SET share_method = CASE share_method
  WHEN 'link' THEN 'share_method.link'
  WHEN 'email' THEN 'share_method.email'
  WHEN 'social' THEN 'share_method.social'
  WHEN 'embed' THEN 'share_method.embed'
  ELSE 'share_method.' || share_method
END
WHERE share_method NOT LIKE 'share_method.%';

UPDATE challenge_live_presence 
SET status = CASE status
  WHEN 'viewing' THEN 'presence.viewing'
  WHEN 'editing' THEN 'presence.editing'
  WHEN 'idle' THEN 'presence.idle'
  WHEN 'away' THEN 'presence.away'
  ELSE 'presence.' || status
END
WHERE status NOT LIKE 'presence.%';