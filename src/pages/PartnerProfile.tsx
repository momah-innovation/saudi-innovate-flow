import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Building, Globe, Users, DollarSign, Plus, X, 
  Save, Edit, Mail, Phone, MapPin, Calendar
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AppShell } from '@/components/layout/AppShell';
import { EnhancedPartnerProfileHero } from '@/components/partners/EnhancedPartnerProfileHero';

interface PartnerProfile {
  id?: string;
  user_id: string;
  organization_name: string;
  organization_name_ar: string;
  organization_type: string;
  industry_sector: string;
  website_url?: string;
  description: string;
  description_ar: string;
  headquarters_location: string;
  employee_count_range: string;
  annual_revenue_range: string;
  partnership_interests: string[];
  investment_capacity_range: string;
  previous_partnerships: string[];
  contact_person_name: string;
  contact_email: string;
  contact_phone: string;
  partnership_goals: string;
  available_resources: string[];
  preferred_collaboration_types: string[];
}

const ORGANIZATION_TYPES = [
  { value: 'private_company', label: 'Private Company' },
  { value: 'public_company', label: 'Public Company' },
  { value: 'government_entity', label: 'Government Entity' },
  { value: 'non_profit', label: 'Non-Profit Organization' },
  { value: 'startup', label: 'Startup' },
  { value: 'investment_fund', label: 'Investment Fund' },
  { value: 'academic_institution', label: 'Academic Institution' }
];

const INDUSTRY_SECTORS = [
  'Technology & Software',
  'Healthcare & Pharmaceuticals',
  'Financial Services',
  'Manufacturing',
  'Energy & Utilities',
  'Education',
  'Retail & E-commerce',
  'Transportation & Logistics',
  'Real Estate',
  'Agriculture',
  'Entertainment & Media',
  'Telecommunications',
  'Construction',
  'Consulting Services'
];

const EMPLOYEE_COUNT_RANGES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' }
];

const REVENUE_RANGES = [
  { value: 'under_1m', label: 'Under 1M SAR' },
  { value: '1m_10m', label: '1M - 10M SAR' },
  { value: '10m_50m', label: '10M - 50M SAR' },
  { value: '50m_100m', label: '50M - 100M SAR' },
  { value: '100m_500m', label: '100M - 500M SAR' },
  { value: '500m+', label: '500M+ SAR' }
];

const INVESTMENT_CAPACITY_RANGES = [
  { value: 'under_100k', label: 'Under 100K SAR' },
  { value: '100k_500k', label: '100K - 500K SAR' },
  { value: '500k_1m', label: '500K - 1M SAR' },
  { value: '1m_5m', label: '1M - 5M SAR' },
  { value: '5m_10m', label: '5M - 10M SAR' },
  { value: '10m+', label: '10M+ SAR' }
];

const PARTNERSHIP_INTERESTS = [
  'Innovation Challenges',
  'Event Sponsorship',
  'Research & Development',
  'Technology Transfer',
  'Startup Incubation',
  'Talent Development',
  'Market Expansion',
  'Product Development',
  'Digital Transformation',
  'Sustainability Initiatives'
];

const COLLABORATION_TYPES = [
  'Financial Sponsorship',
  'Resource Sharing',
  'Expertise Provision',
  'Co-development',
  'Mentorship Programs',
  'Technology Licensing',
  'Joint Marketing',
  'Strategic Consulting'
];

const AVAILABLE_RESOURCES = [
  'Funding',
  'Technology Infrastructure',
  'Expert Mentors',
  'Testing Facilities',
  'Market Access',
  'Distribution Networks',
  'Research Capabilities',
  'Manufacturing Facilities',
  'Legal Support',
  'Marketing Resources'
];

export default function PartnerProfile() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<PartnerProfile>({
    user_id: userProfile?.id || '',
    organization_name: '',
    organization_name_ar: '',
    organization_type: '',
    industry_sector: '',
    website_url: '',
    description: '',
    description_ar: '',
    headquarters_location: '',
    employee_count_range: '',
    annual_revenue_range: '',
    partnership_interests: [],
    investment_capacity_range: '',
    previous_partnerships: [],
    contact_person_name: '',
    contact_email: '',
    contact_phone: '',
    partnership_goals: '',
    available_resources: [],
    preferred_collaboration_types: []
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newPartnership, setNewPartnership] = useState('');

  useEffect(() => {
    loadPartnerProfile();
  }, [userProfile]);

  const loadPartnerProfile = async () => {
    if (!userProfile?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('email', userProfile.email)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile({
          id: data.id,
          user_id: userProfile.id,
          organization_name: data.name || '',
          organization_name_ar: data.name_ar || '',
          organization_type: data.partner_type || '',
          industry_sector: 'Technology', // Default since field doesn't exist
          website_url: '',
          description: data.collaboration_history || '',
          description_ar: '',
          headquarters_location: data.address || '',
          employee_count_range: '',
          annual_revenue_range: '',
          partnership_interests: [],
          investment_capacity_range: data.funding_capacity ? `${data.funding_capacity}` : '',
          previous_partnerships: data.collaboration_history ? [data.collaboration_history] : [],
          contact_person_name: data.contact_person || '',
          contact_email: data.email || '',
          contact_phone: data.phone || '',
          partnership_goals: '',
          available_resources: data.capabilities || [],
          preferred_collaboration_types: []
        });
      } else {
        setIsEditing(true); // New profile, start in edit mode
      }
    } catch (error) {
      console.error('Error loading partner profile:', error);
      toast.error('Error loading partner profile');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!userProfile?.id) return;
    
    try {
      setSaving(true);
      
      const profileData = {
        name: profile.organization_name,
        name_ar: profile.organization_name_ar,
        partner_type: profile.organization_type,
        email: profile.contact_email,
        phone: profile.contact_phone,
        address: profile.headquarters_location,
        contact_person: profile.contact_person_name,
        capabilities: profile.available_resources,
        funding_capacity: 0, // Default value
        status: 'active'
      };

      const { error } = await supabase
        .from('partners')
        .upsert(profileData, { onConflict: 'email' });

      if (error) throw error;

      toast.success('Partner profile saved successfully!');
      setIsEditing(false);
      await loadPartnerProfile();
      
    } catch (error) {
      console.error('Error saving partner profile:', error);
      toast.error('Error saving partner profile');
    } finally {
      setSaving(false);
    }
  };

  const handleArrayToggle = (field: keyof PartnerProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(value)
        ? (prev[field] as string[]).filter(item => item !== value)
        : [...(prev[field] as string[]), value]
    }));
  };

  const addPartnership = () => {
    if (newPartnership.trim()) {
      setProfile(prev => ({
        ...prev,
        previous_partnerships: [...prev.previous_partnerships, newPartnership.trim()]
      }));
      setNewPartnership('');
    }
  };

  const removePartnership = (index: number) => {
    setProfile(prev => ({
      ...prev,
      previous_partnerships: prev.previous_partnerships.filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (field: keyof PartnerProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <PageLayout title="Partner Profile" description="Loading your partner profile...">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <AppShell>
      <EnhancedPartnerProfileHero
        partnerProfile={profile}
        isEditing={isEditing}
        onToggleEdit={() => {
          if (isEditing) {
            saveProfile();
          } else {
            setIsEditing(true);
          }
        }}
        onNavigate={navigate}
      />
      
      <PageLayout
        title="ملف المؤسسة الشريكة"
        description="إدارة معلومات المؤسسة ومجالات الشراكة"
        maxWidth="xl"
        className="space-y-6"
      >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Building className="w-6 h-6" />
          <h2 className="text-xl font-semibold">
            {profile.organization_name || 'Organization Profile'}
          </h2>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button onClick={() => setIsEditing(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={saveProfile} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Organization Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Organization Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organization_name">Organization Name (English)</Label>
                  <Input
                    id="organization_name"
                    value={profile.organization_name}
                    onChange={(e) => handleInputChange('organization_name', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter organization name"
                  />
                </div>
                <div>
                  <Label htmlFor="organization_name_ar">Organization Name (Arabic)</Label>
                  <Input
                    id="organization_name_ar"
                    value={profile.organization_name_ar}
                    onChange={(e) => handleInputChange('organization_name_ar', e.target.value)}
                    disabled={!isEditing}
                    placeholder="أدخل اسم المؤسسة"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organization_type">Organization Type</Label>
                  <Select
                    value={profile.organization_type}
                    onValueChange={(value) => handleInputChange('organization_type', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ORGANIZATION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="industry_sector">Industry Sector</Label>
                  <Select
                    value={profile.industry_sector}
                    onValueChange={(value) => handleInputChange('industry_sector', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRY_SECTORS.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website_url">Website URL</Label>
                  <Input
                    id="website_url"
                    type="url"
                    value={profile.website_url}
                    onChange={(e) => handleInputChange('website_url', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="headquarters_location">Headquarters Location</Label>
                  <Input
                    id="headquarters_location"
                    value={profile.headquarters_location}
                    onChange={(e) => handleInputChange('headquarters_location', e.target.value)}
                    disabled={!isEditing}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Organization Description (English)</Label>
                <Textarea
                  id="description"
                  value={profile.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Describe your organization and its mission..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="description_ar">Organization Description (Arabic)</Label>
                <Textarea
                  id="description_ar"
                  value={profile.description_ar}
                  onChange={(e) => handleInputChange('description_ar', e.target.value)}
                  disabled={!isEditing}
                  placeholder="اوصف مؤسستك ومهمتها..."
                  rows={3}
                  dir="rtl"
                />
              </div>
            </CardContent>
          </Card>

          {/* Partnership Interests */}
          <Card>
            <CardHeader>
              <CardTitle>Partnership Interests</CardTitle>
              <CardDescription>
                Select the types of partnerships your organization is interested in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PARTNERSHIP_INTERESTS.map((interest) => (
                  <div
                    key={interest}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      profile.partnership_interests.includes(interest)
                        ? 'border-primary bg-primary/10'
                        : 'border-muted hover:border-primary/50'
                    } ${!isEditing ? 'cursor-default' : ''}`}
                    onClick={() => isEditing && handleArrayToggle('partnership_interests', interest)}
                  >
                    <span className="text-sm">{interest}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contact_person_name">Contact Person</Label>
                <Input
                  id="contact_person_name"
                  value={profile.contact_person_name}
                  onChange={(e) => handleInputChange('contact_person_name', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Full name"
                />
              </div>
              <div>
                <Label htmlFor="contact_email">Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={profile.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  disabled={!isEditing}
                  placeholder="contact@example.com"
                />
              </div>
              <div>
                <Label htmlFor="contact_phone">Phone</Label>
                <Input
                  id="contact_phone"
                  value={profile.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  disabled={!isEditing}
                  placeholder="+966 XX XXX XXXX"
                />
              </div>
            </CardContent>
          </Card>

          {/* Organization Size */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Size</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="employee_count_range">Employee Count</Label>
                <Select
                  value={profile.employee_count_range}
                  onValueChange={(value) => handleInputChange('employee_count_range', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYEE_COUNT_RANGES.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="annual_revenue_range">Annual Revenue</Label>
                <Select
                  value={profile.annual_revenue_range}
                  onValueChange={(value) => handleInputChange('annual_revenue_range', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {REVENUE_RANGES.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="investment_capacity_range">Investment Capacity</Label>
                <Select
                  value={profile.investment_capacity_range}
                  onValueChange={(value) => handleInputChange('investment_capacity_range', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {INVESTMENT_CAPACITY_RANGES.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={() => navigate('/partner-dashboard')} className="w-full justify-start">
                <Building className="w-4 h-4 mr-2" />
                Go to Partner Dashboard
              </Button>
              <Button onClick={() => navigate('/challenges')} variant="outline" className="w-full justify-start">
                <Globe className="w-4 h-4 mr-2" />
                Browse Challenges
              </Button>
              <Button onClick={() => navigate('/events')} variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                View Events
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      </PageLayout>
    </AppShell>
  );
}