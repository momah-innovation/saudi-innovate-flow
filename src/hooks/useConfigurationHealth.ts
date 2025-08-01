import { useState, useEffect, useCallback } from 'react'
import { useUploaderSettings } from '@/hooks/useUploaderSettings'
import { validateConfigurationHealth } from '@/utils/configurationValidator'

interface HealthStatus {
  overall: 'healthy' | 'warning' | 'error'
  errors: string[]
  warnings: string[]
  lastCheck: Date
  configCount: number
  enabledConfigs: number
  orphanedConfigs: number
}

export function useConfigurationHealth() {
  const { globalSettings, uploadConfigs, loading, error } = useUploaderSettings()
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    overall: 'healthy',
    errors: [],
    warnings: [],
    lastCheck: new Date(),
    configCount: 0,
    enabledConfigs: 0,
    orphanedConfigs: 0
  })

  const checkHealth = useCallback(() => {
    if (loading || error) return

    const validation = validateConfigurationHealth(uploadConfigs, globalSettings)
    
    // Count configurations
    const configCount = Object.keys(uploadConfigs).length
    const enabledConfigs = Object.values(uploadConfigs).filter(config => config.enabled).length
    const orphanedConfigs = Object.values(uploadConfigs).filter(config => 
      'bucketExists' in config && config.bucketExists === false
    ).length

    // Determine overall health
    let overall: 'healthy' | 'warning' | 'error' = 'healthy'
    if (validation.errors.length > 0 || orphanedConfigs > 0) {
      overall = 'error'
    } else if (validation.warnings.length > 0) {
      overall = 'warning'
    }

    setHealthStatus({
      overall,
      errors: validation.errors,
      warnings: validation.warnings,
      lastCheck: new Date(),
      configCount,
      enabledConfigs,
      orphanedConfigs
    })
  }, [globalSettings, uploadConfigs, loading, error])

  // Check health when dependencies change
  useEffect(() => {
    checkHealth()
  }, [checkHealth])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(checkHealth, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [checkHealth])

  return {
    healthStatus,
    refreshHealth: checkHealth,
    isLoading: loading
  }
}