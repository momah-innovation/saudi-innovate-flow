import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useContactData, Contact, ContactInteraction } from '@/hooks/useContactData';
import { DataTable, Column } from '@/components/ui/data-table';
import { 
  Users, 
  Phone, 
  Mail, 
  Building, 
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Calendar,
  MessageSquare
} from 'lucide-react';

function ContactManagement() {
  const {
    contacts,
    interactions,
    selectedContact,
    loading,
    createContact,
    updateContact,
    deleteContact,
    setSelectedContact,
    createInteraction,
    searchContacts,
    filterContactsByType,
    filterContactsByStatus,
    getContactInteractions,
    getPendingFollowUps,
    getContactStats,
    exportContacts,
    importContacts
  } = useContactData();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | Contact['type']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | Contact['status']>('all');
  const [activeTab, setActiveTab] = useState('contacts');

  const stats = getContactStats();
  const pendingFollowUps = getPendingFollowUps();

  // Filter contacts based on search and filters
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = searchQuery === '' || 
      contact.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || contact.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const contactColumns: Column<Contact>[] = [
    { key: 'first_name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'company', title: 'Company' },
    { key: 'type', title: 'Type' },
    { key: 'status', title: 'Status' }
  ];

  const interactionColumns: Column<ContactInteraction>[] = [
    { key: 'type', title: 'Type' },
    { key: 'subject', title: 'Subject' },
    { key: 'date', title: 'Date' },
    { key: 'outcome', title: 'Outcome' },
    { key: 'follow_up_required', title: 'Follow-up' }
  ];

  const handleCreateContact = async () => {
    try {
      await createContact({
        first_name: 'New',
        last_name: 'Contact',
        email: 'new.contact@example.com',
        type: 'prospect',
        status: 'active',
        tags: []
      });
    } catch (error) {
      console.error('Failed to create contact:', error);
    }
  };

  const handleAddInteraction = async (contactId: string) => {
    try {
      await createInteraction({
        contact_id: contactId,
        type: 'note',
        subject: 'Follow-up Note',
        description: 'Follow-up interaction',
        date: new Date().toISOString(),
        created_by: 'current_user'
      });
    } catch (error) {
      console.error('Failed to add interaction:', error);
    }
  };

  const handleExport = () => {
    exportContacts('csv');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importContacts(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Management</h1>
          <p className="text-muted-foreground">
            Manage customer relationships and track interactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={() => document.getElementById('import-file')?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <input
            id="import-file"
            type="file"
            accept=".csv,.xlsx"
            onChange={handleImport}
            className="hidden"
          />
          <Button onClick={handleCreateContact}>
            <Plus className="mr-2 h-4 w-4" />
            New Contact
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_contacts}</div>
            <p className="text-xs text-muted-foreground">
              All contacts in system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_contacts}</div>
            <p className="text-xs text-muted-foreground">
              Active contacts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.new_contacts_this_month}</div>
            <p className="text-xs text-muted-foreground">
              New contacts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interactions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.interactions_this_week}</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow-ups</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.follow_ups_pending}</div>
            <p className="text-xs text-muted-foreground">
              Pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.conversion_rate)}%</div>
            <p className="text-xs text-muted-foreground">
              Lead to customer
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="follow-ups">Follow-ups</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Contact Directory
              </CardTitle>
              <CardDescription>
                Manage customer and partner contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters and Search */}
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as typeof typeFilter)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="supplier">Supplier</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DataTable
                columns={contactColumns}
                data={filteredContacts}
                loading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Contact Interactions
              </CardTitle>
              <CardDescription>
                Track communication history and touchpoints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Recent Interactions</h3>
                  <p className="text-sm text-muted-foreground">
                    {interactions.length} total interactions recorded
                  </p>
                </div>
                <Button onClick={() => handleAddInteraction('1')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Interaction
                </Button>
              </div>

              <DataTable
                columns={interactionColumns}
                data={interactions}
                loading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="follow-ups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Pending Follow-ups
              </CardTitle>
              <CardDescription>
                Track required follow-up actions and deadlines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">Action Required</h3>
                <p className="text-sm text-muted-foreground">
                  {pendingFollowUps.length} follow-ups pending attention
                </p>
              </div>

              {pendingFollowUps.length > 0 ? (
                <div className="space-y-3">
                  {pendingFollowUps.map(followUp => {
                    const contact = contacts.find(c => c.id === followUp.contact_id);
                    return (
                      <div key={followUp.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="font-medium">{followUp.subject}</div>
                          <div className="text-sm text-muted-foreground">
                            {contact?.first_name} {contact?.last_name} ({contact?.company})
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Due: {new Date(followUp.follow_up_date!).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">{followUp.type}</Badge>
                          <Button size="sm" variant="outline">
                            Complete
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No pending follow-ups
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Contact Analytics
              </CardTitle>
              <CardDescription>
                View contact management metrics and insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contact Distribution</h3>
                  <div className="space-y-2">
                    {['customer', 'prospect', 'partner', 'supplier', 'internal'].map(type => {
                      const count = contacts.filter(c => c.type === type).length;
                      const percentage = contacts.length > 0 ? (count / contacts.length) * 100 : 0;
                      
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{type}</Badge>
                            <span className="text-sm">{count} contacts</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {Math.round(percentage)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Interaction Types</h3>
                  <div className="space-y-2">
                    {['email', 'call', 'meeting', 'note', 'task'].map(type => {
                      const count = interactions.filter(i => i.type === type).length;
                      const percentage = interactions.length > 0 ? (count / interactions.length) * 100 : 0;
                      
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{type}</Badge>
                            <span className="text-sm">{count} interactions</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {Math.round(percentage)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ContactManagement;