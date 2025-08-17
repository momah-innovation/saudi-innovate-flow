# 🔐 Authentication API

## Overview

Authentication system using Supabase Auth with JWT tokens, role-based access control, and session management.

## Authentication Flow

### Sign Up
```http
POST /auth/v1/signup
Content-Type: application/json
apikey: <anon-key>

{
  "email": "user@example.com",
  "password": "password123",
  "data": {
    "name": "John Doe",
    "name_ar": "جون دو"
  }
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "email_verified": false,
    "user_metadata": {
      "name": "John Doe"
    }
  },
  "session": {
    "access_token": "jwt_token",
    "token_type": "bearer",
    "expires_in": 3600,
    "refresh_token": "refresh_token"
  }
}
```

### Sign In
```http
POST /auth/v1/token?grant_type=password
Content-Type: application/json
apikey: <anon-key>

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Refresh Token
```http
POST /auth/v1/token?grant_type=refresh_token
Content-Type: application/json
apikey: <anon-key>

{
  "refresh_token": "refresh_token"
}
```

### Sign Out
```http
POST /auth/v1/logout
Authorization: Bearer <access_token>
apikey: <anon-key>
```

## User Profile Management

### Get Current User
```http
GET /auth/v1/user
Authorization: Bearer <access_token>
apikey: <anon-key>
```

### Update User Metadata
```http
PUT /auth/v1/user
Authorization: Bearer <access_token>
Content-Type: application/json
apikey: <anon-key>

{
  "data": {
    "name": "Updated Name",
    "preferred_language": "ar"
  }
}
```

## Role Management

### Get User Roles
```http
GET /rest/v1/user_roles?user_id=eq.<user_id>
Authorization: Bearer <access_token>
apikey: <anon-key>
```

**Response:**
```json
[
  {
    "role": "admin",
    "is_active": true,
    "expires_at": null
  },
  {
    "role": "super_admin",
    "is_active": true,
    "expires_at": null
  }
]
```

### Check Role Permissions
```http
GET /rest/v1/rpc/has_role
Authorization: Bearer <access_token>
Content-Type: application/json
apikey: <anon-key>

{
  "user_id": "user_uuid",
  "role_name": "admin"
}
```

## Profile Information

### Get User Profile
```http
GET /rest/v1/profiles?id=eq.<user_id>
Authorization: Bearer <access_token>
apikey: <anon-key>
```

**Response:**
```json
[
  {
    "id": "user_uuid",
    "email": "user@example.com",
    "name": "Abdullah Alqahtani",
    "name_ar": "عبدالله القحطاني",
    "phone": "0505971183",
    "department": "MoMAH",
    "position": "Head",
    "bio": "Admin",
    "profile_image_url": "https://example.com/avatar.jpg",
    "preferred_language": "ar",
    "status": "active",
    "profile_completion_percentage": 80
  }
]
```

### Update Profile
```http
PATCH /rest/v1/profiles?id=eq.<user_id>
Authorization: Bearer <access_token>
Content-Type: application/json
apikey: <anon-key>

{
  "name": "Updated Name",
  "name_ar": "الاسم المحدث",
  "bio": "Updated bio",
  "preferred_language": "en"
}
```

## Password Management

### Reset Password Request
```http
POST /auth/v1/recover
Content-Type: application/json
apikey: <anon-key>

{
  "email": "user@example.com"
}
```

### Update Password
```http
PUT /auth/v1/user
Authorization: Bearer <access_token>
Content-Type: application/json
apikey: <anon-key>

{
  "password": "new_password"
}
```

## Session Management

### Get Session
```http
GET /auth/v1/user
Authorization: Bearer <access_token>
apikey: <anon-key>
```

### Extend Session
```http
POST /auth/v1/token?grant_type=refresh_token
Content-Type: application/json
apikey: <anon-key>

{
  "refresh_token": "current_refresh_token"
}
```

## Role Definitions

### Available Roles
- `super_admin` - Full system access
- `admin` - Administrative privileges
- `expert` - Expert evaluation capabilities
- `innovator` - Basic user access

### Permission Matrix
```json
{
  "super_admin": ["system.*"],
  "admin": [
    "users.manage",
    "challenges.manage",
    "events.manage",
    "analytics.view"
  ],
  "expert": [
    "challenges.evaluate",
    "ideas.evaluate",
    "events.create"
  ],
  "innovator": [
    "challenges.view",
    "challenges.participate",
    "ideas.create",
    "events.register"
  ]
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Invalid credentials |
| 401 | Authentication required |
| 403 | Insufficient permissions |
| 422 | Validation error |
| 429 | Rate limit exceeded |

## JavaScript Examples

### Using Supabase Client
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, anonKey);

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: {
      name: 'John Doe',
      name_ar: 'جون دو'
    }
  }
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Sign out
const { error } = await supabase.auth.signOut();
```

### Custom Hook Example
```javascript
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
};
```