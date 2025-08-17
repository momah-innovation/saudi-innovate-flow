# 🤖 AI Services API

## Content Generation
```http
POST /functions/v1/ai-content-generator
{
  "prompt": "Generate innovation ideas",
  "type": "idea|challenge|summary",
  "language": "ar|en"
}
```

## Semantic Search
```http
POST /functions/v1/semantic-search
{
  "query": "search term",
  "filters": {},
  "limit": 10
}
```

## Content Moderation
```http
POST /functions/v1/content-moderation
{
  "content": "text to moderate",
  "language": "ar"
}
```

## Rate Limits
- Content Generation: 50/hour
- Search: 200/hour
- Moderation: 100/hour