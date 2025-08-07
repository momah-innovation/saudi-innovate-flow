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
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface Application {
  id: string;
  company_name: string;
  contact_person: string;
  contact_email?: string;
  proposed_contribution: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submitted_at: string;
  reviewer_notes?: string;
  partnership_opportunities?: {
    title_ar: string;
    opportunity_type: string;
  };
}

interface PartnershipApplicationsTableProps {
  applications?: Application[];
  loading?: boolean;
  onViewApplication?: (application: Application) => void;
}

export function PartnershipApplicationsTable({
  applications = [],
  loading = false,
  onViewApplication
}: PartnershipApplicationsTableProps) {
  const { t, isRTL } = useUnifiedTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Demo data if no applications provided
  const demoApplications: Application[] = [
    {
      id: '1',
      company_name: 'شركة التقنيات المتقدمة',
      contact_person: 'د. أحمد الراشد',
      contact_email: 'ahmed@techcorp.sa',
      proposed_contribution: 500000,
      status: 'approved',
      submitted_at: '2024-01-15T10:00:00Z',
      reviewer_notes: 'Excellent proposal with strong technical merit',
      partnership_opportunities: {
        title_ar: 'تحدي الابتكار الصحي',
        opportunity_type: 'Challenge Sponsorship'
      }
    },
    {
      id: '2',
      company_name: 'مجموعة التعليم الرقمي',
      contact_person: 'د. سارة محمد',
      contact_email: 'sara@edtech.sa',
      proposed_contribution: 300000,
      status: 'under_review',
      submitted_at: '2024-01-20T14:00:00Z',
      partnership_opportunities: {
        title_ar: 'قمة التعليم التقني 2024',
        opportunity_type: 'Event Partnership'
      }
    }
  ];

  const displayApplications = applications.length > 0 ? applications : demoApplications;

  const filteredApplications = displayApplications.filter(app => {
    const opportunityTitle = app.partnership_opportunities?.title_ar || '';
    const matchesSearch = opportunityTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company_name.toLowerCase().includes(searchTerm.toLowerCase());
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
              {loading ? (
                // Loading skeleton rows
                Array.from({length: 3}).map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell colSpan={7}>
                      <div className="animate-pulse flex space-x-4">
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-lg">{getTypeIcon(application.partnership_opportunities?.opportunity_type || 'Partnership')}</span>
                      <div>
                        <div className="font-medium">{application.partnership_opportunities?.title_ar || application.company_name}</div>
                        <div className="text-sm text-muted-foreground">{application.partnership_opportunities?.opportunity_type || 'Partnership'}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                    <Badge variant="outline">{application.partnership_opportunities?.opportunity_type || 'Partnership'}</Badge>
                  </TableCell>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {new Date(application.submitted_at).toLocaleDateString()}
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
                      {application.proposed_contribution.toLocaleString()} {t('currency')}
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