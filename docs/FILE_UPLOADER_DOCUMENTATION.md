# File Uploader System Documentation

## Overview
The File Uploader System provides a robust, configurable file upload solution with support for temporary uploads, validation, and database integration.

## Architecture

### Core Components
- `WizardFileUploader` - Multi-step upload wizard interface
- `FileUploader` - Simplified wrapper component  
- `useFileUploader` - React hook for upload operations
- `useUploaderSettings` - Configuration management hook

### Configuration System
Upload configurations are managed through:
- **Database Settings**: Dynamic configurations via `uploader_settings` table
- **Hardcoded Configs**: Fallback configurations in `uploadConfigs.ts`
- **Runtime Merging**: Intelligent combination of database and hardcoded settings

## Features

### Upload Capabilities
- **Multi-file Support**: Handle multiple files simultaneously
- **File Validation**: Size, type, and count restrictions
- **Progress Tracking**: Real-time upload progress
- **Error Handling**: Comprehensive error reporting
- **Temporary Uploads**: Staged uploads before commitment

### Configuration Options
```typescript
interface FileUploadConfig {
  uploadType: string;
  maxFiles?: number;
  maxSizeBytes?: number;
  allowedTypes?: string[];
  bucket?: string;
  isTemporary?: boolean;
  entityId?: string;
  tableName?: string;
  columnName?: string;
}
```

### Predefined Configurations
- `OPPORTUNITY_IMAGES` - Opportunity image uploads
- `CHALLENGE_DOCUMENTS` - Challenge attachments
- `USER_AVATARS` - Profile pictures
- `CAMPAIGN_MATERIALS` - Campaign resources

## Usage Examples

### Basic Upload
```typescript
import { FileUploader } from '@/components/ui/file-uploader';

<FileUploader
  uploadType="OPPORTUNITY_IMAGES"
  entityId={opportunityId}
  tableName="opportunities"
  columnName="image_url"
  onUploadComplete={handleFiles}
/>
```

### Wizard Upload
```typescript
import { WizardFileUploader } from '@/components/ui/wizard-file-uploader';

<WizardFileUploader
  config={uploadConfig}
  onUploadComplete={handleCommit}
  onCancel={handleCancel}
/>
```

## Security Features
- **Authentication Required**: All uploads require user authentication
- **RLS Policies**: Row-level security on file records
- **Temporary File Cleanup**: Automatic cleanup of uncommitted files
- **Virus Scanning**: Integration with security scanning (configurable)

## Database Integration
- **File Records**: Metadata stored in `file_records` table
- **Lifecycle Events**: Complete audit trail of file operations
- **Version Control**: Support for file versioning
- **Cleanup Jobs**: Automated maintenance tasks

## Performance Optimizations
- **Chunked Uploads**: Large file support with chunking
- **Concurrent Limits**: Configurable concurrent upload limits
- **Compression**: Optional file compression
- **CDN Integration**: Seamless CDN support for file delivery