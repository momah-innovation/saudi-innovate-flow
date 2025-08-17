# 🚦 Rate Limits

## REST API Limits
- Authenticated: 1000 requests/minute
- Anonymous: 100 requests/minute

## Edge Functions
- AI Services: 50/hour per user
- Notifications: 100/hour per user
- Analytics: 1000/hour per user

## File Upload
- 50 uploads/minute per user
- 10MB max file size

## Headers
Rate limit info in response headers:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`