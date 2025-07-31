import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Eye, Filter, Download, Calendar, 
  Search, DollarSign, Building
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface Application {
  id: string;
  opportunity_title: string;
  opportunity_type: string;
  submitted_date: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  contribution_amount: number;
  contact_person: string;
  review_notes?: string;
}

interface PartnershipApplicationsTableProps {
  applications?: Application[];
  onViewApplication?: (application: Application) => void;
}

export function PartnershipApplicationsTable({
  applications = [],
  onViewApplication
}: PartnershipApplicationsTableProps) {
  const { t, isRTL } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Demo data if no applications provided
  const demoApplications: Application[] = [
    {
      id: '1',
      opportunity_title: 'Healthcare Innovation Challenge',
      opportunity_type: 'Challenge Sponsorship',
      submitted_date: '2024-01-15',
      status: 'approved',
      contribution_amount: 500000,
      contact_person: 'Ahmed Al-Rashid',
      review_notes: 'Excellent proposal with strong technical merit'
    },
    {
      id: '2',
      opportunity_title: 'EdTech Summit 2024',
      opportunity_type: 'Event Partnership',
      submitted_date: '2024-01-20',
      status: 'under_review',
      contribution_amount: 300000,
      contact_person: 'Sara Mohammed',
    },
    {
      id: '3',
      opportunity_title: 'Green Innovation Campaign',
      opportunity_type: 'Campaign Partnership',
      submitted_date: '2024-01-25',
      status: 'pending',
      contribution_amount: 1000000,
      contact_person: 'Omar Hassan',
    },
    {
      id: '4',
      opportunity_title: 'AI Research Initiative',
      opportunity_type: 'Research Partnership',
      submitted_date: '2024-01-10',
      status: 'rejected',
      contribution_amount: 750000,
      contact_person: 'Fatima Al-Zahra',
      review_notes: 'Budget requirements not aligned with current priorities'
    }
  ];

  const displayApplications = applications.length > 0 ? applications : demoApplications;

  const filteredApplications = displayApplications.filter(app => {
    const matchesSearch = app.opportunity_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.contact_person.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.includes('Challenge')) return '🎯';
    if (type.includes('Event')) return '📅';
    if (type.includes('Campaign')) return '🚀';
    if (type.includes('Research')) return '🔬';
    return '🤝';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <Building className="w-5 h-5" />
          {t('partnershipApplications')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className={`flex gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="flex-1">
            <div className={`relative ${isRTL ? 'text-right' : 'text-left'}`}>
              <Search className={`absolute top-3 w-4 h-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
              <Input
                placeholder={t('searchApplications')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={isRTL ? 'pr-10 text-right' : 'pl-10 text-left'}
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-2 border rounded-md ${isRTL ? 'text-right' : 'text-left'}`}
          >
            <option value="all">{t('allStatuses')}</option>
            <option value="pending">{t('pending')}</option>
            <option value="under_review">{t('underReview')}</option>
            <option value="approved">{t('approved')}</option>
            <option value="rejected">{t('rejected')}</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Applications Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('opportunity')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('type')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('submittedDate')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('status')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('contribution')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('contact')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-lg">{getTypeIcon(application.opportunity_type)}</span>
                      <div>
                        <div className="font-medium">{application.opportunity_title}</div>
                        <div className="text-sm text-muted-foreground">{application.opportunity_type}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                    <Badge variant="outline">{application.opportunity_type}</Badge>
                  </TableCell>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {new Date(application.submitted_date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                    <Badge className={getStatusColor(application.status)}>
                      {t(`status${application.status.charAt(0).toUpperCase() + application.status.slice(1).replace('_', '')}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      {application.contribution_amount.toLocaleString()} {t('currency')}
                    </div>
                  </TableCell>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                    {application.contact_person}
                  </TableCell>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewApplication?.(application)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredApplications.length === 0 && (
          <div className={`text-center py-8 text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('noApplicationsFound')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}