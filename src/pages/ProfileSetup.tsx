import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const ProfileSetup = () => {
  const { user, userProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    name_ar: '',
    department: '',
    position: '',
    phone: '',
    bio: '',
    preferred_language: 'en',
    is_innovator: false,
    is_expert: false,
    innovation_background: '',
    areas_of_interest: [] as string[],
    experience_level: '',
    expertise_areas: [] as string[],
    certifications: [] as string[],
    experience_years: '',
  });

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Allow access to dashboard even without profile for now
  // This ensures users can access the system while profile is being set up

  console.log("ProfileSetup - User:", user?.id, "Profile:", userProfile);

  const handleInputChange = (field: string, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field: string, value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(Boolean);
    setProfileData(prev => ({ ...prev, [field]: array }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create or update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email!,
          name: profileData.name,
          name_ar: profileData.name_ar || null,
          department: profileData.department || null,
          position: profileData.position || null,
          phone: profileData.phone || null,
          bio: profileData.bio || null,
          preferred_language: profileData.preferred_language,
        });

      if (profileError) {
        throw profileError;
      }

      // Create innovator profile if selected
      if (profileData.is_innovator) {
        const { error: innovatorError } = await supabase
          .from('innovators')
          .insert({
            user_id: user.id,
            innovation_background: profileData.innovation_background || null,
            areas_of_interest: profileData.areas_of_interest.length > 0 ? profileData.areas_of_interest : null,
            experience_level: profileData.experience_level || null,
          });

        if (innovatorError) {
          throw innovatorError;
        }
      }

      // Create expert profile if selected
      if (profileData.is_expert) {
        const { error: expertError } = await supabase
          .from('experts')
          .insert({
            user_id: user.id,
            expertise_areas: profileData.expertise_areas.length > 0 ? profileData.expertise_areas : ['general'],
            certifications: profileData.certifications.length > 0 ? profileData.certifications : null,
            experience_years: profileData.experience_years ? parseInt(profileData.experience_years) : null,
          });

        if (expertError) {
          throw expertError;
        }
      }

      toast({
        title: "Profile Created",
        description: "Your profile has been successfully created.",
      });

      console.log("Profile created successfully, refreshing profile...");
      
      // Refresh profile and navigate to dashboard
      await refreshProfile();
      
      console.log("Profile refreshed, navigating to dashboard...");
      navigate('/');

    } catch (error: any) {
      console.error('Profile creation error:', error);
      toast({
        title: "Profile Creation Failed",
        description: error.message || "An error occurred while creating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground mt-2">
            Tell us about yourself to get started with Ruwād Innovation
          </p>
          <Button 
            variant="outline" 
            onClick={handleSkip}
            className="mt-4"
          >
            Skip for now
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              This information will help us customize your experience and connect you with relevant opportunities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name (English) *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name_ar">Full Name (Arabic)</Label>
                  <Input
                    id="name_ar"
                    type="text"
                    value={profileData.name_ar}
                    onChange={(e) => handleInputChange('name_ar', e.target.value)}
                    disabled={isSubmitting}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    type="text"
                    value={profileData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    type="text"
                    value={profileData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred_language">Preferred Language</Label>
                  <Select
                    value={profileData.preferred_language}
                    onValueChange={(value) => handleInputChange('preferred_language', value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={isSubmitting}
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Role Selection</h3>
                <p className="text-sm text-muted-foreground">
                  Select the roles that best describe your participation in the innovation ecosystem.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_innovator"
                      checked={profileData.is_innovator}
                      onCheckedChange={(checked) => handleInputChange('is_innovator', checked)}
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="is_innovator" className="text-sm font-medium">
                      Innovator - I want to submit ideas and solutions
                    </Label>
                  </div>

                  {profileData.is_innovator && (
                    <div className="ml-6 space-y-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="innovation_background">Innovation Background</Label>
                        <Textarea
                          id="innovation_background"
                          value={profileData.innovation_background}
                          onChange={(e) => handleInputChange('innovation_background', e.target.value)}
                          disabled={isSubmitting}
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="areas_of_interest">Areas of Interest (comma-separated)</Label>
                        <Input
                          id="areas_of_interest"
                          type="text"
                          value={profileData.areas_of_interest.join(', ')}
                          onChange={(e) => handleArrayInput('areas_of_interest', e.target.value)}
                          disabled={isSubmitting}
                          placeholder="e.g., Digital Transformation, Sustainability, AI"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience_level">Experience Level</Label>
                        <Select
                          value={profileData.experience_level}
                          onValueChange={(value) => handleInputChange('experience_level', value)}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_expert"
                      checked={profileData.is_expert}
                      onCheckedChange={(checked) => handleInputChange('is_expert', checked)}
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="is_expert" className="text-sm font-medium">
                      Expert - I want to evaluate ideas and provide guidance
                    </Label>
                  </div>

                  {profileData.is_expert && (
                    <div className="ml-6 space-y-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="expertise_areas">Areas of Expertise (comma-separated) *</Label>
                        <Input
                          id="expertise_areas"
                          type="text"
                          value={profileData.expertise_areas.join(', ')}
                          onChange={(e) => handleArrayInput('expertise_areas', e.target.value)}
                          disabled={isSubmitting}
                          required={profileData.is_expert}
                          placeholder="e.g., Project Management, Technology, Policy"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                        <Input
                          id="certifications"
                          type="text"
                          value={profileData.certifications.join(', ')}
                          onChange={(e) => handleArrayInput('certifications', e.target.value)}
                          disabled={isSubmitting}
                          placeholder="e.g., PMP, Six Sigma, PhD in Computer Science"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience_years">Years of Experience</Label>
                        <Input
                          id="experience_years"
                          type="number"
                          value={profileData.experience_years}
                          onChange={(e) => handleInputChange('experience_years', e.target.value)}
                          disabled={isSubmitting}
                          min="0"
                          max="50"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || (!profileData.is_innovator && !profileData.is_expert)}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Profile Setup
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;