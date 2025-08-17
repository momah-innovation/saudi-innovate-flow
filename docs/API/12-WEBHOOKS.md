# 🪝 Webhooks API

## Webhook Events
- `challenge.created`
- `challenge.updated`
- `idea.submitted`
- `user.registered`
- `evaluation.completed`

## Webhook Configuration
```http
POST /rest/v1/webhooks
{
  "url": "https://your-server.com/webhook",
  "events": ["challenge.created"],
  "secret": "webhook_secret"
}
```

## Payload Format
```json
{
  "event": "challenge.created",
  "data": {...},
  "timestamp": "2025-01-17T18:45:49Z",
  "signature": "sha256=..."
}
```

## Verification
Verify webhook signatures using HMAC-SHA256 with your webhook secret.