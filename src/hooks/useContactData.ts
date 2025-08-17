import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  type: 'customer' | 'partner' | 'supplier' | 'prospect' | 'internal';
  status: 'active' | 'inactive' | 'blocked';
  tags: string[];
  address?: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  social_media?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  last_contact_date?: string;
  notes?: string;
  assigned_to?: string;
  lead_source?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactInteraction {
  id: string;
  contact_id: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'task';
  subject: string;
  description: string;
  date: string;
  duration_minutes?: number;
  outcome?: string;
  follow_up_required?: boolean;
  follow_up_date?: string;
  created_by: string;
  created_at: string;
}

export interface ContactStats {
  total_contacts: number;
  active_contacts: number;
  new_contacts_this_month: number;
  interactions_this_week: number;
  follow_ups_pending: number;
  conversion_rate: number;
}

// Mock data
const mockContacts: Contact[] = [
  {
    id: '1',
    first_name: 'Ahmed',
    last_name: 'Al-Rashid',
    email: 'ahmed.rashid@company.sa',
    phone: '+966501234567',
    company: 'Innovation Corp',
    position: 'CTO',
    type: 'customer',
    status: 'active',
    tags: ['high-value', 'tech-leader'],
    address: {
      street: 'King Fahd Road',
      city: 'Riyadh',
      state: 'Riyadh Province',
      postal_code: '11564',
      country: 'Saudi Arabia'
    },
    social_media: {
      linkedin: 'https://linkedin.com/in/ahmed-rashid',
      website: 'https://innovationcorp.sa'
    },
    last_contact_date: '2025-01-15T10:00:00Z',
    notes: 'Interested in digital transformation initiatives',
    assigned_to: 'user1',
    lead_source: 'conference',
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    first_name: 'Fatima',
    last_name: 'Al-Zahra',
    email: 'fatima.zahra@startup.sa',
    phone: '+966502345678',
    company: 'Tech Startup',
    position: 'Founder',
    type: 'prospect',
    status: 'active',
    tags: ['startup', 'ai-focus'],
    last_contact_date: '2025-01-17T14:30:00Z',
    notes: 'Exploring partnership opportunities',
    assigned_to: 'user2',
    lead_source: 'website',
    created_at: '2025-01-10T00:00:00Z',
    updated_at: '2025-01-17T14:30:00Z'
  },
  {
    id: '3',
    first_name: 'Mohammed',
    last_name: 'Al-Saud',
    email: 'mohammed.saud@enterprise.sa',
    phone: '+966503456789',
    company: 'Enterprise Solutions',
    position: 'Director',
    type: 'partner',
    status: 'active',
    tags: ['strategic-partner', 'enterprise'],
    last_contact_date: '2025-01-16T09:15:00Z',
    notes: 'Strategic partnership for enterprise clients',
    assigned_to: 'user1',
    lead_source: 'referral',
    created_at: '2024-11-15T00:00:00Z',
    updated_at: '2025-01-16T09:15:00Z'
  }
];

const mockInteractions: ContactInteraction[] = [
  {
    id: '1',
    contact_id: '1',
    type: 'meeting',
    subject: 'Digital Transformation Discussion',
    description: 'Discussed requirements for digital transformation project',
    date: '2025-01-15T10:00:00Z',
    duration_minutes: 60,
    outcome: 'Positive - interested in pilot project',
    follow_up_required: true,
    follow_up_date: '2025-01-22T10:00:00Z',
    created_by: 'user1',
    created_at: '2025-01-15T11:00:00Z'
  },
  {
    id: '2',
    contact_id: '2',
    type: 'email',
    subject: 'Partnership Proposal',
    description: 'Sent partnership proposal document',
    date: '2025-01-17T14:30:00Z',
    outcome: 'Awaiting response',
    follow_up_required: true,
    follow_up_date: '2025-01-24T09:00:00Z',
    created_by: 'user2',
    created_at: '2025-01-17T14:35:00Z'
  },
  {
    id: '3',
    contact_id: '3',
    type: 'call',
    subject: 'Quarterly Review',
    description: 'Quarterly partnership review call',
    date: '2025-01-16T09:15:00Z',
    duration_minutes: 45,
    outcome: 'Successful - relationship on track',
    follow_up_required: false,
    created_by: 'user1',
    created_at: '2025-01-16T10:00:00Z'
  }
];

export function useContactData() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [interactions, setInteractions] = useState<ContactInteraction[]>(mockInteractions);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Contact operations
  const createContact = useCallback(async (contactData: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      
      const newContact: Contact = {
        ...contactData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setContacts(prev => [...prev, newContact]);
      return newContact;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateContact = useCallback(async (id: string, updates: Partial<Contact>) => {
    try {
      setLoading(true);
      
      setContacts(prev => prev.map(contact => 
        contact.id === id 
          ? { ...contact, ...updates, updated_at: new Date().toISOString() }
          : contact
      ));
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteContact = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setContacts(prev => prev.filter(contact => contact.id !== id));
      // Also remove related interactions
      setInteractions(prev => prev.filter(interaction => interaction.contact_id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Interaction operations
  const createInteraction = useCallback(async (interactionData: Omit<ContactInteraction, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      
      const newInteraction: ContactInteraction = {
        ...interactionData,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };

      setInteractions(prev => [...prev, newInteraction]);
      
      // Update contact's last_contact_date
      setContacts(prev => prev.map(contact => 
        contact.id === interactionData.contact_id 
          ? { ...contact, last_contact_date: interactionData.date, updated_at: new Date().toISOString() }
          : contact
      ));

      return newInteraction;
    } catch (error) {
      console.error('Error creating interaction:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateInteraction = useCallback(async (id: string, updates: Partial<ContactInteraction>) => {
    try {
      setLoading(true);
      
      setInteractions(prev => prev.map(interaction => 
        interaction.id === id 
          ? { ...interaction, ...updates }
          : interaction
      ));
    } catch (error) {
      console.error('Error updating interaction:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteInteraction = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setInteractions(prev => prev.filter(interaction => interaction.id !== id));
    } catch (error) {
      console.error('Error deleting interaction:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search and filter functions
  const searchContacts = useCallback((query: string) => {
    if (!query.trim()) return contacts;
    
    const lowercaseQuery = query.toLowerCase();
    return contacts.filter(contact => 
      contact.first_name.toLowerCase().includes(lowercaseQuery) ||
      contact.last_name.toLowerCase().includes(lowercaseQuery) ||
      contact.email.toLowerCase().includes(lowercaseQuery) ||
      contact.company?.toLowerCase().includes(lowercaseQuery) ||
      contact.position?.toLowerCase().includes(lowercaseQuery) ||
      contact.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, [contacts]);

  const filterContactsByType = useCallback((type: Contact['type'] | 'all') => {
    if (type === 'all') return contacts;
    return contacts.filter(contact => contact.type === type);
  }, [contacts]);

  const filterContactsByStatus = useCallback((status: Contact['status'] | 'all') => {
    if (status === 'all') return contacts;
    return contacts.filter(contact => contact.status === status);
  }, [contacts]);

  const getContactInteractions = useCallback((contactId: string) => {
    return interactions.filter(interaction => interaction.contact_id === contactId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [interactions]);

  const getPendingFollowUps = useCallback(() => {
    return interactions.filter(interaction => 
      interaction.follow_up_required && 
      interaction.follow_up_date &&
      new Date(interaction.follow_up_date) <= new Date()
    );
  }, [interactions]);

  // Analytics and stats
  const getContactStats = useCallback((): ContactStats => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const totalContacts = contacts.length;
    const activeContacts = contacts.filter(c => c.status === 'active').length;
    const newContactsThisMonth = contacts.filter(c => 
      new Date(c.created_at) >= thisMonth
    ).length;
    const interactionsThisWeek = interactions.filter(i => 
      new Date(i.date) >= thisWeek
    ).length;
    const followUpsPending = getPendingFollowUps().length;
    
    // Simple conversion rate calculation (prospects to customers)
    const prospects = contacts.filter(c => c.type === 'prospect').length;
    const customers = contacts.filter(c => c.type === 'customer').length;
    const conversionRate = prospects > 0 ? (customers / (prospects + customers)) * 100 : 0;
    
    return {
      total_contacts: totalContacts,
      active_contacts: activeContacts,
      new_contacts_this_month: newContactsThisMonth,
      interactions_this_week: interactionsThisWeek,
      follow_ups_pending: followUpsPending,
      conversion_rate: conversionRate
    };
  }, [contacts, interactions, getPendingFollowUps]);

  const exportContacts = useCallback((format: 'csv' | 'excel' = 'csv') => {
    // Mock export functionality
    console.log(`Exporting ${contacts.length} contacts as ${format}`);
    
    if (format === 'csv') {
      const csvHeaders = 'First Name,Last Name,Email,Phone,Company,Position,Type,Status,Tags';
      const csvData = contacts.map(contact => 
        `${contact.first_name},${contact.last_name},${contact.email},${contact.phone || ''},${contact.company || ''},${contact.position || ''},${contact.type},${contact.status},"${contact.tags.join('; ')}"`
      ).join('\n');
      
      const csvContent = `${csvHeaders}\n${csvData}`;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }, [contacts]);

  const importContacts = useCallback(async (file: File) => {
    try {
      setLoading(true);
      // Mock import functionality
      console.log('Importing contacts from file:', file.name);
      
      // In a real implementation, you would parse the file
      // and create contacts from the data
      
      return { success: true, imported: 0, errors: [] };
    } catch (error) {
      console.error('Error importing contacts:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Data
    contacts,
    interactions,
    selectedContact,
    loading,
    stats: getContactStats(),
    error: null,
    filters: {},
    
    // Contact operations
    createContact,
    updateContact,
    deleteContact,
    addContact: createContact,
    bulkDeleteContacts: async (ids: string[]) => {
      for (const id of ids) {
        await deleteContact(id);
      }
    },
    setSelectedContact,
    setFilters: () => {}, // Mock implementation
    
    // Interaction operations
    createInteraction,
    updateInteraction,
    deleteInteraction,
    addInteraction: createInteraction,
    getContactInteractions,
    
    // Search and filter
    searchContacts,
    filterContactsByType,
    filterContactsByStatus,
    getPendingFollowUps,
    
    // Analytics
    getContactStats,
    
    // Import/Export
    exportContacts,
    importContacts,
    refresh: async () => {}
  };
}