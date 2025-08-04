# Tag System Documentation

## Overview
The Tag System provides a comprehensive tagging solution for organizing and categorizing content across the Ruwād platform. It supports many-to-many relationships between tags and various entities.

## Database Schema

### Core Tables
- `tags` - Central tag management with multilingual support
- `{entity}_tags` - Junction tables for many-to-many relationships

### Supported Entities
- Challenges (`challenge_tags`)
- Events (`event_tags`) 
- Campaigns (`campaign_tags`)
- Partners (`partner_tags`)
- Stakeholders (`stakeholder_tags`)
- Users (`user_tags` - for skills/interests)

## Features

### Tag Management
- **Multilingual Support**: English/Arabic names and descriptions
- **Categorization**: Organized by categories (sector, technology, theme, etc.)
- **Usage Tracking**: Automatic count of tag usage across entities
- **Color Coding**: Visual distinction with customizable colors
- **System Tags**: Built-in tags that cannot be deleted

### Tag Operations
- **Create/Edit/Delete**: Full CRUD operations for authorized users
- **Search & Filter**: Quick tag discovery by name or category
- **Bulk Operations**: Manage multiple tags efficiently
- **Usage Analytics**: Track tag popularity and usage patterns

## Implementation

### Components
- `TagManager` - Admin interface for tag management
- `TagSelector` - User-friendly tag selection component
- `useTags` - React hook for tag operations

### Key Functions
```typescript
// Tag relationship helpers
updateChallengeTagsById(challengeId, tagIds)
updateEventTagsById(eventId, tagIds) 
updateUserTagsById(userId, tagIds, tagType)
```

### Usage Example
```typescript
import { TagSelector } from '@/components/ui/tag-selector';

<TagSelector
  selectedTags={selectedTagIds}
  onTagsChange={setSelectedTagIds}
  category="technology"
  placeholder="Select technology tags..."
/>
```

## Security
- **RLS Policies**: Row-level security for all tag tables
- **Role-based Access**: Team members and admins can manage tags
- **Audit Trail**: Automatic tracking of tag modifications

## Performance
- **Indexing**: Optimized indexes for queries
- **Usage Counting**: Efficient tracking with database triggers
- **Caching**: Memoized components for performance