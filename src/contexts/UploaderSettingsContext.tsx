import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useUploaderSettings } from '@/hooks/useUploaderSettings'

interface UploaderSettingsContextType {
  globalSettings: {
    autoCleanupEnabled: boolean
    defaultCleanupDays: number
    maxConcurrentUploads: number
    chunkSizeMB: number
    retryAttempts: number
    compressionEnabled: boolean
    thumbnailGeneration: boolean
  }
  uploadConfigs: Record<string, any>
  loading: boolean
  error: string | null
  refreshSettings: () => void
  getUploadConfig: (configKey: string) => any | null
}

const UploaderSettingsContext = createContext<UploaderSettingsContextType | undefined>(undefined)

interface UploaderSettingsProviderProps {
  children: ReactNode
}

export function UploaderSettingsProvider({ children }: UploaderSettingsProviderProps) {
  const uploaderSettings = useUploaderSettings()

  return (
    <UploaderSettingsContext.Provider value={uploaderSettings}>
      {children}
    </UploaderSettingsContext.Provider>
  )
}

export function useUploaderSettingsContext() {
  const context = useContext(UploaderSettingsContext)
  if (context === undefined) {
    throw new Error('useUploaderSettingsContext must be used within a UploaderSettingsProvider')
  }
  return context
}