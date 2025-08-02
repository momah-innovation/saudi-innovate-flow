import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useStorageAnalytics } from '@/hooks/useStorageAnalytics'
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
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
  HardDrive, 
  Files, 
  RefreshCw, 
  Upload, 
  Download, 
  Users,
  Clock,
  Activity
} from 'lucide-react'

interface StorageAnalyticsDashboardProps {
  className?: string
}

const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export const StorageAnalyticsDashboard: React.FC<StorageAnalyticsDashboardProps> = ({ className }) => {
  const { analytics, loading, error, refreshAnalytics } = useStorageAnalytics()

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Error loading analytics: {error}</p>
            <Button onClick={refreshAnalytics} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Storage Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive overview of your file storage system
          </p>
        </div>
        <Button onClick={refreshAnalytics} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(analytics.totalStorage)}</div>
            <p className="text-xs text-muted-foreground">
              Across all buckets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <Files className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalFiles.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Files stored
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Buckets</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.bucketBreakdown.length}</div>
            <p className="text-xs text-muted-foreground">
              Storage buckets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Uploaders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.topUploaders.length}</div>
            <p className="text-xs text-muted-foreground">
              Active users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Trends (30 Days)</CardTitle>
            <CardDescription>Daily upload activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.uploadTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()} 
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value, name) => [
                    name === 'uploads' ? value : formatBytes(Number(value)),
                    name === 'uploads' ? 'Uploads' : 'Total Size'
                  ]}
                />
                <Line type="monotone" dataKey="uploads" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* File Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>File Types Distribution</CardTitle>
            <CardDescription>Breakdown by MIME type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.fileTypes.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ mime_type, percentage }) => `${mime_type.split('/')[1]} (${percentage.toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="file_count"
                >
                  {analytics.fileTypes.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, 'Files']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Access Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Access Patterns (24 Hours)</CardTitle>
          <CardDescription>File access activity by hour</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.accessPatterns}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={(value) => `${value}:00`} />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => `${value}:00`}
                formatter={(value) => [value, 'Accesses']}
              />
              <Bar dataKey="access_count" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bucket Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Storage by Bucket</CardTitle>
            <CardDescription>Usage breakdown by storage bucket</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.bucketBreakdown.slice(0, 8).map((bucket, index) => (
              <div key={bucket.bucket_name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{bucket.bucket_name}</span>
                    <Badge variant={bucket.public ? "default" : "secondary"}>
                      {bucket.public ? "Public" : "Private"}
                    </Badge>
                  </div>
                  <span className="text-muted-foreground">
                    {formatBytes(bucket.total_size)} ({bucket.file_count} files)
                  </span>
                </div>
                <Progress 
                  value={bucket.usage_percentage || (bucket.total_size / analytics.totalStorage) * 100} 
                  className="h-2" 
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest file operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentActivity.slice(0, 10).map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 text-sm">
                  <div className="flex-shrink-0">
                    {activity.event_type === 'uploaded' && <Upload className="h-4 w-4 text-green-500" />}
                    {activity.event_type === 'accessed' && <Download className="h-4 w-4 text-blue-500" />}
                    {activity.event_type === 'deleted' && <Activity className="h-4 w-4 text-red-500" />}
                    {!['uploaded', 'accessed', 'deleted'].includes(activity.event_type) && (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {activity.file_path.split('/').pop()}
                    </p>
                    <p className="text-muted-foreground capitalize">
                      {activity.event_type} • {formatTimeAgo(activity.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}