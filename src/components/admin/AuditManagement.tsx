import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuditData } from '@/hooks/useAuditData';
import { DataTable, Column } from '@/components/ui/data-table';

import { AuditEvent, ComplianceReport, AuditConfiguration } from '@/hooks/useAuditData';
import { Shield, Download, Search, Settings, FileCheck, AlertTriangle } from 'lucide-react';

const AuditManagement: React.FC = () => {
  const {
    auditEvents,
    complianceReports,
    auditConfig,
    loading,
    error,
    refreshAuditData,
    generateComplianceReport,
    updateAuditConfig,
    exportAuditLog,
    searchAuditEvents
  } = useAuditData();

  const [searchQuery, setSearchQuery] = useState('');
  const [reportType, setReportType] = useState<'gdpr' | 'hipaa' | 'sox' | 'pci' | 'custom'>('gdpr');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');

  const filteredEvents = searchAuditEvents(searchQuery);

  const auditEventColumns: Column<AuditEvent>[] = [
    {
      key: 'timestamp',
      title: 'Timestamp',
      render: (value) => new Date(value).toLocaleString()
    },
    { key: 'user_id', title: 'User' },
    { key: 'action', title: 'Action' },
    { key: 'resource_type', title: 'Resource Type' },
    { key: 'status', title: 'Status' }
  ];

  const complianceReportColumns = [
    {
      key: 'name',
      title: 'Report Name',
      accessorKey: 'name',
      header: 'Report Name',
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('name')}</span>
      )
    },
    {
      key: 'type',
      title: 'Type',
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue('type')}</Badge>
      )
    },
    {
      key: 'period',
      title: 'Period',
      accessorKey: 'period',
      header: 'Period',
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue('period')}</span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge variant={status === 'completed' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        );
      }
    },
    {
      key: 'compliance_score',
      title: 'Score',
      accessorKey: 'compliance_score',
      header: 'Compliance Score',
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('compliance_score')}%</span>
      )
    },
    {
      key: 'violations',
      title: 'Violations',
      accessorKey: 'violations',
      header: 'Violations',
      cell: ({ row }) => {
        const violations = row.getValue('violations') as number;
        return violations > 0 ? 
          <span className="text-destructive font-medium">{violations}</span> :
          <span className="text-muted-foreground">0</span>;
      }
    }
  ];

  const auditConfigColumns = [
    {
      key: 'category',
      title: 'Category',
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('category')}</span>
      )
    },
    {
      key: 'enabled',
      title: 'Status',
      accessorKey: 'enabled',
      header: 'Status',
      cell: ({ row }) => {
        const enabled = row.getValue('enabled') as boolean;
        return (
          <Badge variant={enabled ? 'default' : 'secondary'}>
            {enabled ? 'Enabled' : 'Disabled'}
          </Badge>
        );
      }
    }
  ];

  const handleGenerateReport = async () => {
    if (startDate && endDate) {
      await generateComplianceReport(reportType, startDate, endDate);
    }
  };

  const handleExportLog = async () => {
    if (startDate && endDate) {
      await exportAuditLog(startDate, endDate, exportFormat);
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>Error loading audit data: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit Management</h1>
          <p className="text-muted-foreground">
            Monitor audit trails, compliance reports, and security events
          </p>
        </div>
        <Button onClick={refreshAuditData} disabled={loading}>
          <Shield className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Audit Events</TabsTrigger>
          <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Audit Events
              </CardTitle>
              <CardDescription>
                Track and monitor all system audit events and user activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <Input
                    placeholder="Search audit events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Start Date"
                  />
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="End Date"
                  />
                  <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as typeof exportFormat)}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleExportLog} disabled={!startDate || !endDate || loading}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <DataTable
                columns={auditEventColumns}
                data={filteredEvents}
                loading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Compliance Reports
              </CardTitle>
              <CardDescription>
                Generate and manage compliance reports for various regulations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="grid grid-cols-4 gap-4 flex-1">
                  <div>
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select value={reportType} onValueChange={(value) => setReportType(value as typeof reportType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gdpr">GDPR</SelectItem>
                        <SelectItem value="hipaa">HIPAA</SelectItem>
                        <SelectItem value="sox">SOX</SelectItem>
                        <SelectItem value="pci">PCI DSS</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>&nbsp;</Label>
                    <Button 
                      onClick={handleGenerateReport} 
                      disabled={!startDate || !endDate || loading}
                      className="w-full"
                    >
                      Generate Report
                    </Button>
                  </div>
                </div>
              </div>

              <DataTable
                columns={complianceReportColumns}
                data={complianceReports}
                loading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Audit Configuration
              </CardTitle>
              <CardDescription>
                Configure audit logging settings and compliance parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={auditConfigColumns}
                data={auditConfig}
                loading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditManagement;