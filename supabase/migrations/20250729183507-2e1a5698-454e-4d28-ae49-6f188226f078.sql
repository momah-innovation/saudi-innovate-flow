-- Seed auth.users table with 20 realistic users
-- Note: This inserts directly into auth.users which is managed by Supabase

INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    aud,
    role
) VALUES
-- Using default password 'Password123!' for all users (bcrypt hashed)
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'ahmed.alotaibi@gov.sa', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '{"name": "أحمد العتيبي", "name_ar": "أحمد العتيبي"}', 'authenticated', 'authenticated'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'fatima.alsaeed@gov.sa', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '{"name": "فاطمة السعيد", "name_ar": "فاطمة السعيد"}', 'authenticated', 'authenticated'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'mohammed.alharbi@gov.sa', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '{"name": "محمد الحربي", "name_ar": "محمد الحربي"}', 'authenticated', 'authenticated'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'sara.alzahrani@gov.sa', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '{"name": "سارة الزهراني", "name_ar": "سارة الزهراني"}', 'authenticated', 'authenticated'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'khalid.almutairi@gov.sa', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '{"name": "خالد المطيري", "name_ar": "خالد المطيري"}', 'authenticated', 'authenticated'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'noura.alqahtani@gov.sa', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '{"name": "نورا القحطاني", "name_ar": "نورا القحطاني"}', 'authenticated', 'authenticated'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'abdullah.alshamrani@gov.sa', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '{"name": "عبدالله الشمراني", "name_ar": "عبدالله الشمراني"}', 'authenticated', 'authenticated'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'aisha.aldosari@gov.sa', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '{"name": "عائشة الدوسري", "name_ar": "عائشة الدوسري"}', 'authenticated', 'authenticated'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'omar.alghamdi@gov.sa', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '{"name": "عمر الغامدي", "name_ar": "عمر الغامدي"}', 'authenticated', 'authenticated'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'maryam.alrashid@gov.sa', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '{"name": "مريم الرشيد", "name_ar": "مريم الرشيد"}', 'authenticated', 'authenticated'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'youssef.albarak@gov.sa', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '{"name": "يوسف البراك", "name_ar": "يوسف البراك"}', 'authenticated', 'authenticated'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'layla.almousa@gov.sa', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '{"name": "ليلى الموسى", "name_ar": "ليلى الموسى"}', 'authenticated', 'authenticated'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'mansour.alahmed@gov.sa', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '{"name": "منصور الأحمد", "name_ar": "منصور الأحمد"}', 'authenticated', 'authenticated'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'hind.alassaf@gov.sa', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '{"name": "هند العساف", "name_ar": "هند العساف"}', 'authenticated', 'authenticated'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'fahad.alsubaie@gov.sa', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '{"name": "فهد السبيعي", "name_ar": "فهد السبيعي"}', 'authenticated', 'authenticated'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'reem.alkhalil@gov.sa', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '{"name": "ريم الخليل", "name_ar": "ريم الخليل"}', 'authenticated', 'authenticated'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'sultan.alkhaldi@gov.sa', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '{"name": "سلطان الخالدي", "name_ar": "سلطان الخالدي"}', 'authenticated', 'authenticated'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'amira.alnajjar@gov.sa', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '{"name": "أميرة النجار", "name_ar": "أميرة النجار"}', 'authenticated', 'authenticated'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'hassan.almasoud@gov.sa', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '{"name": "حسن المسعود", "name_ar": "حسن المسعود"}', 'authenticated', 'authenticated'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'dalal.alturki@gov.sa', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '{"name": "دلال التركي", "name_ar": "دلال التركي"}', 'authenticated', 'authenticated');