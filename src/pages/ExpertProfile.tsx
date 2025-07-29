import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, Star, BookOpen, Award, Plus, X, 
  Calendar, Clock, DollarSign, Save, Edit
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AppShell } from '@/components/layout/AppShell';

interface ExpertProfile {
  id?: string;
  user_id: string;
  expertise_areas: string[];
  experience_years: number;
  expert_level: string;
  education_background: string;
  certifications: string[];
  consultation_rate?: number;
  availability_status: string;
}

const EXPERTISE_AREAS = [
  'Technology & Innovation',
  'Digital Transformation',
  'Business Strategy',
  'Financial Technology',
  'Healthcare Innovation',
  'Sustainability',
  'Artificial Intelligence',
  'Blockchain',
  'Cybersecurity',
  'Data Analytics',
  'IoT & Smart Systems',
  'Renewable Energy',
  'Biotechnology',
  'E-commerce',
  'Education Technology'
];

const EXPERT_LEVELS = [
  { value: 'junior', label: 'Junior Expert (2-5 years)' },
  { value: 'mid', label: 'Mid-level Expert (5-10 years)' },
  { value: 'senior', label: 'Senior Expert (10-15 years)' },
  { value: 'principal', label: 'Principal Expert (15+ years)' },
  { value: 'distinguished', label: 'Distinguished Expert (20+ years)' }
];

const AVAILABILITY_STATUS = [
  { value: 'available', label: 'Available' },
  { value: 'limited', label: 'Limited Availability' },
  { value: 'busy', label: 'Busy' },
  { value: 'unavailable', label: 'Unavailable' }
];

export default function ExpertProfile() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<ExpertProfile>({
    user_id: userProfile?.id || '',
    expertise_areas: [],
    experience_years: 0,
    expert_level: '',
    education_background: '',
    certifications: [],
    consultation_rate: 0,
    availability_status: 'available'
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCertification, setNewCertification] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadExpertProfile();
  }, [userProfile]);

  const loadExpertProfile = async () => {
    if (!userProfile?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('user_id', userProfile.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile({
          id: data.id,
          user_id: data.user_id,
          expertise_areas: data.expertise_areas || [],
          experience_years: data.experience_years || 0,
          expert_level: data.expert_level || '',
          education_background: data.education_background || '',
          certifications: data.certifications || [],
          consultation_rate: data.consultation_rate || 0,
          availability_status: data.availability_status || 'available'
        });
      } else {
        setIsEditing(true); // New profile, start in edit mode
      }
    } catch (error) {
      console.error('Error loading expert profile:', error);
      toast.error('Error loading expert profile');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!userProfile?.id) return;
    
    try {
      setSaving(true);
      
      const profileData = {
        user_id: userProfile.id,
        expertise_areas: profile.expertise_areas,
        experience_years: profile.experience_years,
        expert_level: profile.expert_level,
        education_background: profile.education_background,
        certifications: profile.certifications,
        consultation_rate: profile.consultation_rate,
        availability_status: profile.availability_status
      };

      const { error } = await supabase
        .from('experts')
        .upsert(profileData, { onConflict: 'user_id' });

      if (error) throw error;

      toast.success('Expert profile saved successfully!');
      setIsEditing(false);
      await loadExpertProfile();
      
    } catch (error) {
      console.error('Error saving expert profile:', error);
      toast.error('Error saving expert profile');
    } finally {
      setSaving(false);
    }
  };

  const handleExpertiseToggle = (area: string) => {
    setProfile(prev => ({
      ...prev,
      expertise_areas: prev.expertise_areas.includes(area)
        ? prev.expertise_areas.filter(a => a !== area)
        : [...prev.expertise_areas, area]
    }));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setProfile(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    setProfile(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (field: keyof ExpertProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <PageLayout title="Expert Profile" description="Loading your expert profile...">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <AppShell>
      <PageLayout
        title="ملف الخبير الشخصي"
        description="إدارة معلومات الخبير ومجالات التخصص"
        maxWidth="xl"
        className="space-y-6"
      >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6" />
          <h2 className="text-xl font-semibold">
            {userProfile?.display_name || userProfile?.name || 'Expert'}
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
        {/* Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience_years">Years of Experience</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    value={profile.experience_years}
                    onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || 0)}
                    disabled={!isEditing}
                    min="0"
                    max="50"
                  />
                </div>
                <div>
                  <Label htmlFor="expert_level">Expert Level</Label>
                  <Select
                    value={profile.expert_level}
                    onValueChange={(value) => handleInputChange('expert_level', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select expert level" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERT_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="education_background">Education Background</Label>
                <Textarea
                  id="education_background"
                  value={profile.education_background}
                  onChange={(e) => handleInputChange('education_background', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Describe your educational background..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="consultation_rate">Consultation Rate (SAR/hour)</Label>
                  <Input
                    id="consultation_rate"
                    type="number"
                    value={profile.consultation_rate || ''}
                    onChange={(e) => handleInputChange('consultation_rate', parseFloat(e.target.value) || 0)}
                    disabled={!isEditing}
                    min="0"
                    step="50"
                  />
                </div>
                <div>
                  <Label htmlFor="availability_status">Availability Status</Label>
                  <Select
                    value={profile.availability_status}
                    onValueChange={(value) => handleInputChange('availability_status', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABILITY_STATUS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expertise Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Areas of Expertise
              </CardTitle>
              <CardDescription>
                Select your areas of expertise. You can choose multiple areas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {EXPERTISE_AREAS.map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={area}
                      checked={profile.expertise_areas.includes(area)}
                      onCheckedChange={() => handleExpertiseToggle(area)}
                      disabled={!isEditing}
                    />
                    <Label htmlFor={area} className="text-sm">
                      {area}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Certifications & Qualifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Add a certification..."
                    onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                  />
                  <Button onClick={addCertification} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <div className="space-y-2">
                {profile.certifications.length > 0 ? (
                  profile.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{cert}</span>
                      {isEditing && (
                        <Button
                          onClick={() => removeCertification(index)}
                          size="sm"
                          variant="ghost"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No certifications added yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{profile.experience_years} years experience</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm capitalize">{profile.expert_level || 'Not specified'}</span>
              </div>
              {profile.consultation_rate && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{profile.consultation_rate} SAR/hour</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Badge variant={profile.availability_status === 'available' ? 'default' : 'secondary'}>
                  {AVAILABILITY_STATUS.find(s => s.value === profile.availability_status)?.label}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Selected Expertise */}
          <Card>
            <CardHeader>
              <CardTitle>Selected Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.expertise_areas.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.expertise_areas.map((area) => (
                    <Badge key={area} variant="outline" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No expertise areas selected yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={() => navigate('/expert-dashboard')} className="w-full justify-start">
                <Star className="w-4 h-4 mr-2" />
                Go to Expert Dashboard
              </Button>
              <Button onClick={() => navigate('/evaluations')} variant="outline" className="w-full justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                View Pending Evaluations
              </Button>
              <Button onClick={() => navigate('/challenges')} variant="outline" className="w-full justify-start">
                <Award className="w-4 h-4 mr-2" />
                Browse Challenges
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      </PageLayout>
    </AppShell>
  );
}