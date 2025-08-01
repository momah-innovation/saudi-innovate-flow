import React from 'react'
import { useUploaderSettings } from '@/hooks/useUploaderSettings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export function ConfigurationTester() {
  const { globalSettings, uploadConfigs, loading, error, getUploadConfig } = useUploaderSettings()

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading uploader settings...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>Error loading settings: {error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Test specific configs
  const opportunityConfig = getUploadConfig('OPPORTUNITY_IMAGES')
  const avatarConfig = getUploadConfig('USER_AVATARS')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Configuration Test Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Global Settings */}
        <div>
          <h4 className="font-medium mb-2">Global Settings</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Max Concurrent: <Badge variant="secondary">{globalSettings.maxConcurrentUploads}</Badge></div>
            <div>Chunk Size: <Badge variant="secondary">{globalSettings.chunkSizeMB}MB</Badge></div>
            <div>Retry Attempts: <Badge variant="secondary">{globalSettings.retryAttempts}</Badge></div>
            <div>Cleanup: <Badge variant={globalSettings.autoCleanupEnabled ? "default" : "secondary"}>
              {globalSettings.autoCleanupEnabled ? `${globalSettings.defaultCleanupDays} days` : 'Disabled'}
            </Badge></div>
          </div>
        </div>

        {/* Upload Configs */}
        <div>
          <h4 className="font-medium mb-2">Upload Configurations ({Object.keys(uploadConfigs).length} total)</h4>
          
          {opportunityConfig && (
            <div className="mb-2 p-2 bg-muted/50 rounded">
              <div className="font-medium text-sm">OPPORTUNITY_IMAGES</div>
              <div className="text-xs text-muted-foreground grid grid-cols-2 gap-1">
                <div>Max Files: {opportunityConfig.maxFiles}</div>
                <div>Max Size: {Math.round(opportunityConfig.maxSizeBytes / 1024 / 1024)}MB</div>
                <div>Types: {opportunityConfig.allowedTypes.length}</div>
                <div>Bucket: {opportunityConfig.bucket}</div>
              </div>
            </div>
          )}

          {avatarConfig && (
            <div className="mb-2 p-2 bg-muted/50 rounded">
              <div className="font-medium text-sm">USER_AVATARS</div>
              <div className="text-xs text-muted-foreground grid grid-cols-2 gap-1">
                <div>Max Files: {avatarConfig.maxFiles}</div>
                <div>Max Size: {Math.round(avatarConfig.maxSizeBytes / 1024 / 1024)}MB</div>
                <div>Types: {avatarConfig.allowedTypes.length}</div>
                <div>Bucket: {avatarConfig.bucket}</div>
              </div>
            </div>
          )}
        </div>

        {/* Raw Data (for debugging) */}
        <details className="text-xs">
          <summary className="cursor-pointer font-medium">Raw Configuration Keys</summary>
          <div className="mt-2 p-2 bg-muted rounded text-xs font-mono">
            {Object.keys(uploadConfigs).map(key => (
              <div key={key}>{key}</div>
            ))}
          </div>
        </details>
      </CardContent>
    </Card>
  )
}