# Translation System Structure Design - UPDATED ✅

## ✅ **IMPLEMENTED Structure**

### 1. Static Translations (Files) - **COMPLETED**
```
src/i18n/locales/
├── en/
│   ├── common.json           ✅ Buttons, labels, general UI (54 keys)
│   ├── navigation.json       ✅ Menu items, headers, breadcrumbs (31 keys)
│   ├── auth.json            ✅ Login, signup, permissions (27 keys)  
│   ├── dashboard.json       ✅ Dashboard-specific content (35 keys)
│   ├── errors.json          ✅ Error messages (49 keys)
│   ├── validation.json      ✅ Form validation messages (36 keys)
│   ├── system-lists.json    ✅ Dropdowns, sectors, types (78 keys)
│   ├── profile.json         ✅ User profile management (89 keys)
│   ├── challenges/
│   │   ├── index.json       ✅ Challenge listing, filters (40 keys)
│   │   ├── form.json        ✅ Challenge creation/editing (124 keys)
│   │   ├── details.json     ✅ Challenge view, participation (95 keys)
│   │   └── submissions.json ✅ Submission process (64 keys)
│   ├── campaigns/
│   │   ├── index.json       ✅ Campaign listing (24 keys)
│   │   ├── form.json        ❌ Campaign management [TODO]
│   │   └── analytics.json   ❌ Campaign metrics [TODO]
│   ├── admin/
│   │   ├── index.json       ✅ Admin sections (25 keys)
│   │   ├── settings.json    ✅ System settings (45 keys)
│   │   ├── users.json       ✅ User management (108 keys)
│   │   └── analytics.json   ❌ Admin dashboard [TODO]
│   ├── events.json          ✅ Event management (97 keys)
│   ├── partners.json        ❌ Partner management [TODO]
│   └── opportunities.json   ❌ Opportunities management [TODO]

**TOTAL: 922 keys across 17 completed files (~65% coverage)**

### 2. Dynamic Translations (Database) - **HYBRID APPROACH**
✅ **Moved to Static Files (Better Performance):**
- Basic sectors, challenge types, priority levels → `system-lists.json`
- User roles, organization types, access levels → `system-lists.json`
- Common status values → `system-lists.json`

❌ **Still in Database (Truly Dynamic):**
- User-generated content labels
- Partner organization names (custom entries)
- Custom field labels created by admins
- Complex nested system lists (48 different types)
- Expert-specific statuses and engagement levels

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

### 5. ✅ **IMPLEMENTED Loading Strategy**
1. **✅ Immediate**: Load `common`, `navigation`, `dashboard`, `auth`, `errors`, `validation` on app start
2. **✅ Route-based**: Dynamic loading for `challenges-details`, `challenges-form`, `admin-settings`, `profile`, etc.
3. **✅ Backend Integration**: Custom FeatureBasedBackend with fallback to database via `useSystemTranslations`
4. **✅ Performance**: Namespaces loaded on-demand with caching and preloading helpers

### 6. ✅ **IMPLEMENTED Architecture**
- **Enhanced Config v3**: Feature-based backend with dynamic namespace loading
- **Unified Hooks**: `useUnifiedTranslation` combines static + database translations  
- **Fallback Strategy**: Static files → Database → English fallback → Missing key logging
- **RTL Support**: Direction management with `useDirection()` and CSS utilities