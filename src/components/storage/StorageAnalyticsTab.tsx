import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useStorageAnalytics, StorageAnalytics } from '@/hooks/useStorageAnalytics'
import { useToast } from '@/hooks/use-toast'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Trash2,
  HardDrive
} from 'lucide-react'

interface StorageAnalyticsTabProps {
  className?: string
}

export function StorageAnalyticsTab({ className }: StorageAnalyticsTabProps) {
  const [analytics, setAnalytics] = useState<StorageAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [cleanupLoading, setCleanupLoading] = useState(false)
  
  const { getAllBucketAnalytics, performAdminCleanup } = useStorageAnalytics()
  const { toast } = useToast()

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const data = await getAllBucketAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdminCleanup = async () => {
    setCleanupLoading(true)
    try {
      const success = await performAdminCleanup()
      if (success) {
        // Reload analytics after cleanup
        await loadAnalytics()
      }
    } finally {
      setCleanupLoading(false)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />
      default: return <HardDrive className="w-4 h-4 text-gray-500" />
    }
  }

  // Prepare chart data
  const chartData = analytics.map(item => ({
    name: item.bucketName.replace(/-/g, ' '),
    size: item.stats.total_size,
    files: item.stats.total_files,
    usage: item.usagePercentage
  }))

  const healthData = [
    { name: 'Healthy', value: analytics.filter(a => a.healthStatus === 'healthy').length, color: '#10b981' },
    { name: 'Warning', value: analytics.filter(a => a.healthStatus === 'warning').length, color: '#f59e0b' },
    { name: 'Critical', value: analytics.filter(a => a.healthStatus === 'critical').length, color: '#ef4444' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Admin Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Storage Management
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadAnalytics} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleAdminCleanup}
                disabled={cleanupLoading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {cleanupLoading ? 'Cleaning...' : 'Admin Cleanup'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {analytics.reduce((sum, item) => sum + item.stats.total_files, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {formatBytes(analytics.reduce((sum, item) => sum + item.stats.total_size, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Total Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {analytics.length}
              </div>
              <div className="text-sm text-muted-foreground">Active Buckets</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Storage Usage by Bucket</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'size' ? formatBytes(value as number) : value,
                  name === 'size' ? 'Size' : 'Files'
                ]} />
                <Bar dataKey="size" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Health Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Bucket Health Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={healthData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Bucket Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Bucket Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.map((item) => (
              <div key={item.bucketName} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getHealthIcon(item.healthStatus)}
                    <div>
                      <h4 className="font-medium">{item.bucketName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.stats.total_files} files • {formatBytes(item.stats.total_size)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={item.healthStatus === 'healthy' ? 'default' : 
                                 item.healthStatus === 'warning' ? 'secondary' : 'destructive'}>
                    {item.healthStatus}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Usage</span>
                    <span>{item.usagePercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={item.usagePercentage} className="h-2" />
                </div>

                {item.stats.oldest_file && item.stats.newest_file && (
                  <div className="grid grid-cols-2 gap-4 mt-3 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">Oldest:</span> {new Date(item.stats.oldest_file).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Newest:</span> {new Date(item.stats.newest_file).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}