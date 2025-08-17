# 📊 Analytics API

## Track Events
```http
POST /functions/v1/analytics-processor
{
  "event_type": "page_view|challenge_view|idea_submission",
  "user_id": "uuid",
  "properties": {}
}
```

## Real-time Stats
```http
POST /functions/v1/real-time-stats
{
  "metrics": ["active_users", "submissions"],
  "time_range": "last_hour"
}
```

## Generate Reports
```http
POST /functions/v1/report-generator
{
  "report_type": "challenge_performance",
  "date_range": {"start": "2025-01-01", "end": "2025-01-31"}
}
```