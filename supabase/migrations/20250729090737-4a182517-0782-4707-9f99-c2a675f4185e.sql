-- Create user profiles for seeded innovators to fix the authentication links
-- First, let's create dummy user entries in profiles table for the seeded innovators

-- Generate some realistic user profiles for our seeded innovators
INSERT INTO profiles (id, name, name_ar, email, bio, avatar_url, phone, department, position, created_at) VALUES 
-- User 1: Ahmed Al-Rashid
('550e8400-e29b-41d4-a716-446655440011', 'Ahmed Al-Rashid', 'أحمد الراشد', 'ahmed.rashid@innovation.gov.sa', 'مبتكر في مجال التكنولوجيا المالية', null, '+966501234567', 'التكنولوجيا المالية', 'محلل أول', now()),

-- User 2: Fatima Al-Zahra
('550e8400-e29b-41d4-a716-446655440012', 'Fatima Al-Zahra', 'فاطمة الزهراء', 'fatima.zahra@innovation.gov.sa', 'خبيرة في الذكاء الاصطناعي والصحة', null, '+966501234568', 'الصحة الرقمية', 'مطورة تقنية', now()),

-- User 3: Omar Al-Mansouri  
('550e8400-e29b-41d4-a716-446655440013', 'Omar Al-Mansouri', 'عمر المنصوري', 'omar.mansouri@innovation.gov.sa', 'متخصص في حلول الطاقة المتجددة', null, '+966501234569', 'الطاقة والبيئة', 'مهندس بيئي', now()),

-- User 4: Sarah Al-Qasemi
('550e8400-e29b-41d4-a716-446655440014', 'Sarah Al-Qasemi', 'سارة القاسمي', 'sarah.qasemi@innovation.gov.sa', 'مبتكرة في مجال التعليم الرقمي', null, '+966501234570', 'التعليم والتطوير', 'مصممة تعليمية', now()),

-- User 5: Hassan Al-Otaibi
('550e8400-e29b-41d4-a716-446655440015', 'Hassan Al-Otaibi', 'حسان العتيبي', 'hassan.otaibi@innovation.gov.sa', 'خبير في الأمن السيبراني وإنترنت الأشياء', null, '+966501234571', 'الأمن السيبراني', 'محلل أمني', now());

-- Update the innovators table to link to these new user profiles
UPDATE innovators SET user_id = '550e8400-e29b-41d4-a716-446655440011' WHERE id = '550e8400-e29b-41d4-a716-446655440001';
UPDATE innovators SET user_id = '550e8400-e29b-41d4-a716-446655440012' WHERE id = '550e8400-e29b-41d4-a716-446655440002';
UPDATE innovators SET user_id = '550e8400-e29b-41d4-a716-446655440013' WHERE id = '550e8400-e29b-41d4-a716-446655440003';
UPDATE innovators SET user_id = '550e8400-e29b-41d4-a716-446655440014' WHERE id = '550e8400-e29b-41d4-a716-446655440004';
UPDATE innovators SET user_id = '550e8400-e29b-41d4-a716-446655440015' WHERE id = '550e8400-e29b-41d4-a716-446655440005';

-- Assign default innovator role to these new users
INSERT INTO user_roles (user_id, role, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440011', 'innovator', true),
('550e8400-e29b-41d4-a716-446655440012', 'innovator', true),
('550e8400-e29b-41d4-a716-446655440013', 'innovator', true),
('550e8400-e29b-41d4-a716-446655440014', 'innovator', true),
('550e8400-e29b-41d4-a716-446655440015', 'innovator', true);