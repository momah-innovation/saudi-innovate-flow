-- Update sector types to include all major Saudi government sectors
UPDATE system_settings 
SET setting_value = '[
  "health", 
  "education", 
  "transport", 
  "environment", 
  "economy", 
  "technology", 
  "finance", 
  "defense", 
  "social", 
  "interior", 
  "foreign_affairs", 
  "justice", 
  "islamic_affairs", 
  "agriculture", 
  "energy", 
  "housing", 
  "labor", 
  "commerce", 
  "tourism", 
  "culture", 
  "sports", 
  "media", 
  "municipal_affairs", 
  "water", 
  "civil_service", 
  "planning", 
  "communications", 
  "public_works"
]'::jsonb
WHERE setting_key = 'sector_types';