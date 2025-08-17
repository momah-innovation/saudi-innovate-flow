# 🔍 Search API

## Text Search
```http
GET /rest/v1/challenges?or=(title_ar.ilike.*term*,title_en.ilike.*term*)
```

## Semantic Search
```http
POST /functions/v1/semantic-search
{
  "query": "innovation ideas",
  "limit": 20
}
```

## Filters
- Status: `status=eq.published`
- Date: `created_at=gte.2025-01-01`
- Categories: `category=in.(tech,innovation)`