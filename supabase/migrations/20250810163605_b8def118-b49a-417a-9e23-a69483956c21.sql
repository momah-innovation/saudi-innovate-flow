-- Phase 1: Database Values Standardization
-- Fix mixed database values to use consistent English keys

-- 1. Fix campaigns theme values to use key format
UPDATE campaigns 
SET theme = CASE 
  WHEN theme = 'Financial Technology' THEN 'theme.fintech'
  WHEN theme = 'Education Technology' THEN 'theme.edtech'
  WHEN theme = 'Healthcare Technology' THEN 'theme.healthtech'
  WHEN theme = 'Digital Transformation' THEN 'theme.digital_transformation'
  WHEN theme = 'Smart Cities' THEN 'theme.smart_cities'
  WHEN theme = 'Sustainability' THEN 'theme.sustainability'
  ELSE theme
END
WHERE theme IN ('Financial Technology', 'Education Technology', 'Healthcare Technology', 'Digital Transformation', 'Smart Cities', 'Sustainability');

-- 2. Fix ideas status and maturity_level to use key format
UPDATE ideas 
SET status = CASE 
  WHEN status = 'draft' THEN 'status.draft'
  WHEN status = 'submitted' THEN 'status.submitted'
  WHEN status = 'under_review' THEN 'status.under_review'
  WHEN status = 'approved' THEN 'status.approved'
  WHEN status = 'rejected' THEN 'status.rejected'
  WHEN status = 'pending' THEN 'status.pending'
  ELSE status
END
WHERE status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'pending');

UPDATE ideas 
SET maturity_level = CASE 
  WHEN maturity_level = 'idea' THEN 'maturity.idea'
  WHEN maturity_level = 'concept' THEN 'maturity.concept'
  WHEN maturity_level = 'prototype' THEN 'maturity.prototype'
  WHEN maturity_level = 'development' THEN 'maturity.development'
  WHEN maturity_level = 'pilot' THEN 'maturity.pilot'
  WHEN maturity_level = 'scaling' THEN 'maturity.scaling'
  ELSE maturity_level
END
WHERE maturity_level IN ('idea', 'concept', 'prototype', 'development', 'pilot', 'scaling');

-- 3. Fix events status and event_type to use key format
UPDATE events 
SET status = CASE 
  WHEN status = 'upcoming' THEN 'status.upcoming'
  WHEN status = 'active' THEN 'status.active'
  WHEN status = 'completed' THEN 'status.completed'
  WHEN status IN ('status.scheduled', 'status.ongoing', 'status.postponed', 'status.completed') THEN status
  ELSE 'status.' || status
END
WHERE status NOT LIKE 'status.%';

UPDATE events 
SET event_type = CASE 
  WHEN event_type = 'workshop' THEN 'event_type.workshop'
  WHEN event_type = 'conference' THEN 'event_type.conference'
  WHEN event_type = 'summit' THEN 'event_type.summit'
  WHEN event_type = 'hackathon' THEN 'event_type.hackathon'
  WHEN event_type = 'forum' THEN 'event_type.forum'
  WHEN event_type = 'expo' THEN 'event_type.expo'
  WHEN event_type = 'training' THEN 'event_type.training'
  WHEN event_type = 'competition' THEN 'event_type.competition'
  WHEN event_type = 'demo' THEN 'event_type.demo'
  WHEN event_type = 'masterclass' THEN 'event_type.masterclass'
  WHEN event_type = 'meetup' THEN 'event_type.meetup'
  WHEN event_type = 'webinar' THEN 'event_type.webinar'
  WHEN event_type = 'brainstorm' THEN 'event_type.brainstorm'
  WHEN event_type = 'seminar' THEN 'event_type.seminar'
  WHEN event_type = 'showcase' THEN 'event_type.showcase'
  ELSE event_type
END
WHERE event_type NOT LIKE 'event_type.%';