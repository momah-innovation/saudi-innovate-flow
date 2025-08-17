# 🛠️ REST API Endpoints

## Overview

Complete REST API reference for all database tables and operations using Supabase PostgREST.

## Base URL
```
https://jxpbiljkoibvqxzdkgod.supabase.co/rest/v1
```

## Headers
```http
Authorization: Bearer <jwt_token>
apikey: <anon_key>
Content-Type: application/json
accept-profile: public
x-client-info: supabase-js-web/2.52.1
```

## Core Entities

### Users & Profiles

#### Get User Profile
```http
GET /profiles?id=eq.<user_id>
```

#### Update Profile
```http
PATCH /profiles?id=eq.<user_id>
Content-Type: application/json

{
  "name": "Updated Name",
  "name_ar": "الاسم المحدث",
  "bio": "Updated bio",
  "preferred_language": "ar"
}
```

#### Get User Roles
```http
GET /user_roles?user_id=eq.<user_id>&is_active=eq.true
```

### Challenges

#### Get All Challenges
```http
GET /challenges?select=*&order=created_at.desc
```

#### Get Challenge by ID
```http
GET /challenges?id=eq.<challenge_id>&select=*
```

#### Create Challenge
```http
POST /challenges
Content-Type: application/json

{
  "title_ar": "تحدي الابتكار",
  "title_en": "Innovation Challenge",
  "description_ar": "وصف التحدي",
  "description_en": "Challenge description",
  "status": "draft",
  "priority": "medium",
  "deadline": "2025-12-31T23:59:59Z"
}
```

#### Update Challenge
```http
PATCH /challenges?id=eq.<challenge_id>
Content-Type: application/json

{
  "status": "published",
  "updated_at": "2025-01-17T18:45:49Z"
}
```

#### Delete Challenge
```http
DELETE /challenges?id=eq.<challenge_id>
```

### Ideas

#### Get Ideas
```http
GET /ideas?select=*&order=created_at.desc&limit=20
```

#### Filter Ideas by Status
```http
GET /ideas?status=eq.published&select=*
```

#### Create Idea
```http
POST /ideas
Content-Type: application/json

{
  "title_ar": "فكرة مبتكرة",
  "title_en": "Innovative Idea",
  "description_ar": "وصف الفكرة",
  "description_en": "Idea description",
  "challenge_id": "challenge_uuid",
  "status": "draft"
}
```

### Events

#### Get Events
```http
GET /events?select=*&order=start_date.asc
```

#### Get Event with Registration Count
```http
GET /events?select=*,event_registrations(count)&id=eq.<event_id>
```

#### Create Event
```http
POST /events
Content-Type: application/json

{
  "title_ar": "فعالية الابتكار",
  "title_en": "Innovation Event",
  "description_ar": "وصف الفعالية",
  "start_date": "2025-02-01T09:00:00Z",
  "end_date": "2025-02-01T17:00:00Z",
  "location": "Riyadh, Saudi Arabia",
  "capacity": 100
}
```

#### Register for Event
```http
POST /event_registrations
Content-Type: application/json

{
  "event_id": "event_uuid",
  "user_id": "user_uuid",
  "status": "confirmed"
}
```

## System Configuration

### Get System Settings
```http
GET /system_settings?setting_key=in.(ui_initials_max_length,notification_fetch_limit,password_min_length)
```

**Response:**
```json
[
  {
    "setting_key": "notification_fetch_limit",
    "setting_value": 50
  },
  {
    "setting_key": "ui_initials_max_length", 
    "setting_value": 2
  },
  {
    "setting_key": "password_min_length",
    "setting_value": 8
  }
]
```

### Get All System Settings
```http
GET /system_settings?select=setting_key,setting_value,data_type,is_localizable,setting_category
```

### Update System Setting
```http
PATCH /system_settings?setting_key=eq.<key>
Content-Type: application/json

{
  "setting_value": "new_value"
}
```

## File Upload Configuration

### Get Upload Settings
```http
GET /uploader_settings?setting_type=eq.global&is_active=eq.true
```

### Get Upload Configurations
```http
GET /uploader_settings?setting_type=eq.upload_config&is_active=eq.true
```

**Response:**
```json
[
  {
    "id": "uuid",
    "setting_type": "upload_config",
    "setting_key": "challenges-documents-private",
    "setting_value": {
      "bucket": "challenges-documents-private",
      "enabled": true,
      "maxFiles": 5,
      "allowedTypes": ["application/pdf", "image/jpeg"],
      "maxSizeBytes": 10485760
    },
    "is_active": true
  }
]
```

## Advanced Queries

### Full-Text Search
```http
GET /challenges?or=(title_ar.ilike.*search*,title_en.ilike.*search*)
```

### Range Queries
```http
GET /events?start_date=gte.2025-01-01&start_date=lt.2025-12-31
```

### Joins
```http
GET /challenges?select=*,challenge_participants(count),ideas(count)
```

### Aggregations
```http
GET /challenges?select=status,count()&group_by=status
```

### Pagination
```http
GET /challenges?select=*&order=created_at.desc&limit=20&offset=40
```

## RPC Functions

### Check User Role
```http
POST /rpc/has_role
Content-Type: application/json

{
  "user_id": "user_uuid",
  "role_name": "admin"
}
```

### Get Analytics Data
```http
POST /rpc/get_challenge_analytics
Content-Type: application/json

{
  "challenge_id": "challenge_uuid",
  "date_range": "last_30_days"
}
```

### Refresh Analytics
```http
POST /rpc/refresh_opportunity_analytics
Content-Type: application/json

{
  "opportunity_id": "opportunity_uuid"
}
```

## Filtering & Sorting

### Common Filters
- `eq` - equals
- `neq` - not equals
- `gt` - greater than
- `gte` - greater than or equal
- `lt` - less than
- `lte` - less than or equal
- `like` - LIKE operator
- `ilike` - case insensitive LIKE
- `in` - IN operator
- `is` - IS operator (for null values)

### Examples
```http
# Filter by status
GET /challenges?status=eq.published

# Filter by date range
GET /events?start_date=gte.2025-01-01&start_date=lte.2025-12-31

# Search in text fields
GET /ideas?title_ar.ilike.*ابتكار*

# Filter by multiple values
GET /challenges?status=in.(published,active)

# Filter nulls
GET /challenges?deadline=is.null
```

### Sorting
```http
# Sort ascending
GET /challenges?order=created_at.asc

# Sort descending
GET /challenges?order=created_at.desc

# Multiple sort fields
GET /challenges?order=priority.desc,created_at.desc
```

## Error Handling

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `204` - No Content (successful DELETE)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

### Error Response Format
```json
{
  "code": "PGRST116",
  "details": "The result contains 0 rows",
  "hint": null,
  "message": "JSON object requested, multiple (or no) rows returned"
}
```

## Rate Limits
- **Authenticated requests**: 1000 requests per minute
- **Anonymous requests**: 100 requests per minute
- **Bulk operations**: 50 requests per minute

## Best Practices

1. **Use specific selects** to reduce payload size
2. **Implement pagination** for large datasets
3. **Use RLS policies** for data security
4. **Cache responses** when appropriate
5. **Handle errors gracefully**
6. **Use transactions** for related operations

### Example Optimized Query
```http
GET /challenges?select=id,title_ar,status,created_at&status=eq.published&order=created_at.desc&limit=10
```