# Translation System Structure Design

## Proposed Structure

### 1. Static Translations (Files)
```
src/i18n/locales/
├── en/
│   ├── common.json           # Buttons, labels, general UI
│   ├── navigation.json       # Menu items, headers, breadcrumbs
│   ├── auth.json            # Login, signup, permissions
│   ├── dashboard.json       # Dashboard-specific content
│   ├── challenges/
│   │   ├── index.json       # Challenge listing, filters
│   │   ├── form.json        # Challenge creation/editing
│   │   ├── details.json     # Challenge view, participation
│   │   └── submissions.json # Submission process
│   ├── campaigns/
│   │   ├── index.json       # Campaign listing
│   │   ├── form.json        # Campaign management
│   │   └── analytics.json   # Campaign metrics
│   ├── admin/
│   │   ├── users.json       # User management
│   │   ├── settings.json    # System settings
│   │   └── analytics.json   # Admin dashboard
│   ├── errors.json          # Error messages
│   └── validation.json      # Form validation messages
└── ar/
    └── [same structure as en/]
```

### 2. Dynamic Translations (Database)
- Challenge categories and types
- System settings descriptions
- User-generated content labels
- Partner organization names
- Sector/department names
- Dynamic status messages
- Custom field labels

### 3. File Size Guidelines
- Each file should be < 100 translation keys
- Group related functionality together
- Use nested objects for sub-features

### 4. Key Naming Convention
```javascript
// Static files use dot notation
"challenges.form.title_label": "Challenge Title"
"challenges.form.description_placeholder": "Enter description..."

// Database uses underscore notation matching table structure
"challenge_status_active": "Active"
"sector_health_description": "Health Ministry"
```

### 5. Loading Strategy
1. **Immediate**: Load common.json, navigation.json on app start
2. **Route-based**: Load feature files when navigating to sections
3. **Database**: Fetch dynamic translations on demand with caching