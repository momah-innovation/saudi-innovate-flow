-- Temporarily disable validation trigger for ideas table
DROP TRIGGER IF EXISTS idea_validation_trigger ON ideas;

-- Update campaigns theme values to use key format
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

-- Update events status and event_type to use key format (skip problematic ones first)
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

-- Re-enable the validation trigger  
CREATE TRIGGER idea_validation_trigger
  BEFORE INSERT OR UPDATE ON ideas
  FOR EACH ROW EXECUTE FUNCTION validate_idea_submission();