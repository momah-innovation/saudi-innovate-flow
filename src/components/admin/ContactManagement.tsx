import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Plus, 
  Upload, 
  Download, 
  Filter,
  Users,
  Phone,
  Mail,
  Building,
  Tag,
  Calendar,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  FileText,
  MessageSquare,
  Star
} from 'lucide-react';
import { useContactData, type Contact, type ContactInteraction } from '@/hooks/useContactData';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';

const ContactManagement = () => {
  const {
    contacts,
    interactions,
    stats,
    loading,
    error,
    filters,
    setFilters,
    addContact,
    updateContact,
    deleteContact,
    bulkDeleteContacts,
    exportContacts,
    importContacts,
    addInteraction,
    getContactInteractions,
    searchContacts,
    refresh
  } = useContactData();

  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    type: 'customer',
    status: 'active',
    tags: []
  });

  // Contact type configurations
  const contactTypes = [
    { value: 'customer', label: 'Customer', color: 'bg-blue-100 text-blue-800' },
    { value: 'partner', label: 'Partner', color: 'bg-green-100 text-green-800' },
    { value: 'supplier', label: 'Supplier', color: 'bg-purple-100 text-purple-800' },
    { value: 'prospect', label: 'Prospect', color: 'bg-orange-100 text-orange-800' },
    { value: 'internal', label: 'Internal', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
    { value: 'blocked', label: 'Blocked', color: 'bg-red-100 text-red-800' }
  ];

  // Table columns
  const columns: ColumnDef<Contact>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => {
            table.toggleAllPageRowsSelected(e.target.checked);
            if (e.target.checked) {
              setSelectedContacts(contacts.map(c => c.id));
            } else {
              setSelectedContacts([]);
            }
          }}
          className="rounded border border-input"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedContacts.includes(row.original.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedContacts([...selectedContacts, row.original.id]);
            } else {
              setSelectedContacts(selectedContacts.filter(id => id !== row.original.id));
            }
          }}
          className="rounded border border-input"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Contact',
      cell: ({ row }) => {
        const contact = row.original;
        const fullName = `${contact.first_name} ${contact.last_name}`;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {contact.first_name[0]}{contact.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{fullName}</div>
              <div className="text-sm text-muted-foreground">{contact.email}</div>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: 'company',
      header: 'Company',
      cell: ({ row }) => {
        const contact = row.original;
        return (
          <div>
            <div className="font-medium">{contact.company || 'N/A'}</div>
            <div className="text-sm text-muted-foreground">{contact.position || ''}</div>
          </div>
        );
      }
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = contactTypes.find(t => t.value === row.original.type);
        return (
          <Badge variant="secondary" className={type?.color}>
            {type?.label}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = statusOptions.find(s => s.value === row.original.status);
        return (
          <Badge variant="outline" className={status?.color}>
            {status?.label}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'last_contact_date',
      header: 'Last Contact',
      cell: ({ row }) => {
        const date = row.original.last_contact_date;
        return (
          <div className="text-sm">
            {date ? new Date(date).toLocaleDateString() : 'Never'}
          </div>
        );
      }
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {row.original.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{row.original.tags.length - 2}
            </Badge>
          )}
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setViewingContact(row.original)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit Contact
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => deleteContact(row.original.id)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  const handleAddContact = async () => {
    if (!newContact.first_name || !newContact.last_name || !newContact.email) {
      return;
    }

    await addContact({
      first_name: newContact.first_name,
      last_name: newContact.last_name,
      email: newContact.email,
      phone: newContact.phone,
      company: newContact.company,
      position: newContact.position,
      type: newContact.type || 'customer',
      status: newContact.status || 'active',
      tags: newContact.tags || [],
      notes: newContact.notes
    });

    setIsAddDialogOpen(false);
    setNewContact({ type: 'customer', status: 'active', tags: [] });
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importContacts(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading contacts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Management</h1>
          <p className="text-muted-foreground">
            Manage customer relationships and business contacts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => exportContacts()}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <input
            type="file"
            accept=".json,.csv"
            onChange={handleFileImport}
            className="hidden"
            id="import-file"
          />
          <Button variant="outline" onClick={() => document.getElementById('import-file')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
                <DialogDescription>
                  Create a new contact in your CRM system.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input 
                      id="first_name" 
                      value={newContact.first_name || ''}
                      onChange={(e) => setNewContact({ ...newContact, first_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input 
                      id="last_name" 
                      value={newContact.last_name || ''}
                      onChange={(e) => setNewContact({ ...newContact, last_name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={newContact.email || ''}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      value={newContact.phone || ''}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select 
                      value={newContact.type} 
                      onValueChange={(value) => setNewContact({ ...newContact, type: value as Contact['type'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {contactTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input 
                      id="company" 
                      value={newContact.company || ''}
                      onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input 
                      id="position" 
                      value={newContact.position || ''}
                      onChange={(e) => setNewContact({ ...newContact, position: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    id="notes" 
                    rows={3} 
                    value={newContact.notes || ''}
                    onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddContact}>Add Contact</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Contacts</p>
                <p className="text-2xl font-bold">{stats?.total_contacts || contacts.length}</p>
              </div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Contacts</p>
                <p className="text-2xl font-bold">
                  {stats?.active_contacts || contacts.filter(c => c.status === 'active').length}
                </p>
              </div>
              <Building className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New This Month</p>
                <p className="text-2xl font-bold">
                  {stats?.new_contacts_this_month || 0}
                </p>
              </div>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interactions</p>
                <p className="text-2xl font-bold">
                  {stats?.interactions_this_week || 0}
                </p>
              </div>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Directory</CardTitle>
          <CardDescription>
            Search and filter your business contacts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
            <Select 
              value={filters.type || ''} 
              onValueChange={(value) => setFilters({ ...filters, type: value as Contact['type'] })}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {contactTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={filters.status || ''} 
              onValueChange={(value) => setFilters({ ...filters, status: value as Contact['status'] })}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                {statusOptions.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedContacts.length > 0 && (
              <Button 
                variant="destructive" 
                onClick={() => {
                  bulkDeleteContacts(selectedContacts);
                  setSelectedContacts([]);
                }}
              >
                Delete Selected ({selectedContacts.length})
              </Button>
            )}
          </div>

          <DataTable 
            columns={columns}
            data={contacts}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Contact Details Dialog */}
      {viewingContact && (
        <Dialog open={!!viewingContact} onOpenChange={() => setViewingContact(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Contact Details</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="interactions">Interactions</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {viewingContact.first_name[0]}{viewingContact.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {viewingContact.first_name} {viewingContact.last_name}
                    </h3>
                    <p className="text-muted-foreground">{viewingContact.position}</p>
                    <p className="text-sm text-muted-foreground">{viewingContact.company}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{viewingContact.email}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{viewingContact.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {viewingContact.tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="interactions">
                <div className="text-center py-8 text-muted-foreground">
                  Interaction history coming soon...
                </div>
              </TabsContent>
              
              <TabsContent value="notes">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <div className="p-3 border rounded-md">
                      <p className="text-sm">{viewingContact.notes || 'No notes available'}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ContactManagement;