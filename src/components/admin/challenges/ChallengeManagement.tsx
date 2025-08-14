import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useOrganizationalHierarchy } from '@/hooks/useOrganizationalHierarchy';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

interface Challenge {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  status: string;
  priority_level: string;
  sensitivity_level: string;
  challenge_type?: string;
  sector_id?: string;
  deputy_id?: string;
  department_id?: string;
  domain_id?: string;
  sub_domain_id?: string;
  service_id?: string;
  created_at: string;
  updated_at: string;
}

export function ChallengeManagement() {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { user } = useCurrentUser();
  const { sectors, deputies, departments, domains, subDomains, services } = useOrganizationalHierarchy();
  
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: '',
    status: 'draft',
    priority_level: 'medium',
    sensitivity_level: 'normal',
    challenge_type: '',
    sector_id: '',
    deputy_id: '',
    department_id: '',
    domain_id: '',
    sub_domain_id: '',
    service_id: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const challengeData = {
        ...formData,
        // Convert empty strings to null for optional fields
        title_en: formData.title_en || null,
        description_en: formData.description_en || null,
        challenge_type: formData.challenge_type || null,
        sector_id: formData.sector_id || null,
        deputy_id: formData.deputy_id || null,
        department_id: formData.department_id || null,
        domain_id: formData.domain_id || null,
        sub_domain_id: formData.sub_domain_id || null,
        service_id: formData.service_id || null,
      };

      if (selectedChallenge) {
        // Update existing challenge
        const { error } = await supabase
          .from('challenges')
          .update(challengeData)
          .eq('id', selectedChallenge.id);
        
        if (error) throw error;
        
        toast({
          title: t('challenges.updated'),
          description: t('challenges.update_success')
        });
      } else {
        // Create new challenge
        const { error } = await supabase
          .from('challenges')
          .insert({
            ...challengeData,
            created_by: user?.id
          });
        
        if (error) throw error;
        
        toast({
          title: t('challenges.created'),
          description: t('challenges.create_success')
        });
      }
      
      // Reset form and close
      setFormData({
        title_ar: '',
        title_en: '',
        description_ar: '',
        description_en: '',
        status: 'draft',
        priority_level: 'medium',
        sensitivity_level: 'normal',
        challenge_type: '',
        sector_id: '',
        deputy_id: '',
        department_id: '',
        domain_id: '',
        sub_domain_id: '',
        service_id: '',
      });
      setSelectedChallenge(null);
      setIsFormOpen(false);
      
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('challenges.management')}</h2>
          <p className="text-muted-foreground">
            {t('challenges.management_description')}
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('challenges.create')}
        </Button>
      </div>

      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedChallenge ? t('challenges.edit') : t('challenges.create')}
            </CardTitle>
            <CardDescription>
              {selectedChallenge ? t('challenges.edit_description') : t('challenges.create_description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title_ar">{t('form.title_ar')} *</Label>
                  <Input
                    id="title_ar"
                    value={formData.title_ar}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
                    placeholder={t('placeholder.enter_title')}
                    dir="rtl"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="title_en">{t('form.title_en')}</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                    placeholder={t('placeholder.enter_title_en')}
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description_ar">{t('form.description_ar')} *</Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_ar: e.target.value }))}
                  placeholder={t('placeholder.enter_description')}
                  dir="rtl"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description_en">{t('form.description_en')}</Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
                  placeholder={t('placeholder.enter_description_en')}
                  dir="ltr"
                  rows={4}
                />
              </div>

              {/* Organizational Hierarchy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sector_id">{t('form.sector')}</Label>
                  <Select value={formData.sector_id} onValueChange={(value) => setFormData(prev => ({ ...prev, sector_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('placeholder.select_sector')} />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector.id} value={sector.id}>
                          {sector.name_ar || sector.name_en || 'Unnamed Sector'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="department_id">{t('form.department')}</Label>
                  <Select value={formData.department_id} onValueChange={(value) => setFormData(prev => ({ ...prev, department_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('placeholder.select_department')} />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name_ar || dept.name || 'Unnamed Department'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="status">{t('form.status')}</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('placeholder.select_status')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">{t('status.draft')}</SelectItem>
                      <SelectItem value="active">{t('status.active')}</SelectItem>
                      <SelectItem value="completed">{t('status.completed')}</SelectItem>
                      <SelectItem value="cancelled">{t('status.cancelled')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority_level">{t('form.priority_level')}</Label>
                  <Select value={formData.priority_level} onValueChange={(value) => setFormData(prev => ({ ...prev, priority_level: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('placeholder.select_priority')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{t('priority.low')}</SelectItem>
                      <SelectItem value="medium">{t('priority.medium')}</SelectItem>
                      <SelectItem value="high">{t('priority.high')}</SelectItem>
                      <SelectItem value="critical">{t('priority.critical')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sensitivity_level">{t('form.sensitivity_level')}</Label>
                  <Select value={formData.sensitivity_level} onValueChange={(value) => setFormData(prev => ({ ...prev, sensitivity_level: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('placeholder.select_sensitivity')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">{t('sensitivity.normal')}</SelectItem>
                      <SelectItem value="restricted">{t('sensitivity.restricted')}</SelectItem>
                      <SelectItem value="confidential">{t('sensitivity.confidential')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button type="submit">
                  {selectedChallenge ? t('update') : t('create')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}