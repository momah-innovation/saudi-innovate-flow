-- Link seeded innovators to existing users
-- First, let's see what real users we have and assign them to the seeded innovators

-- Update the seeded innovators to use existing user IDs
UPDATE innovators SET user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944' WHERE id = '550e8400-e29b-41d4-a716-446655440001';
UPDATE innovators SET user_id = '8066cfaf-4a91-4985-922b-74f6a286c441' WHERE id = '550e8400-e29b-41d4-a716-446655440002';
UPDATE innovators SET user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944' WHERE id = '550e8400-e29b-41d4-a716-446655440003';
UPDATE innovators SET user_id = '8066cfaf-4a91-4985-922b-74f6a286c441' WHERE id = '550e8400-e29b-41d4-a716-446655440004';
UPDATE innovators SET user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944' WHERE id = '550e8400-e29b-41d4-a716-446655440005';