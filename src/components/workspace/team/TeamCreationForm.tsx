import React, { useState } from 'react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Users, Target, Calendar } from 'lucide-react';

const teamFormSchema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters'),
  description: z.string().optional(),
  objectives: z.array(z.string()).min(1, 'At least one objective is required'),
  department_id: z.string().optional(),
  max_members: z.number().min(2).max(50).default(10),
  privacy_level: z.enum(['private', 'department', 'organization']).default('department'),
});

type TeamFormData = z.infer<typeof teamFormSchema>;

interface TeamCreationFormProps {
  onSubmit: (data: TeamFormData) => Promise<void>;
  onClose: () => void;
}

export function TeamCreationForm({ onSubmit, onClose }: TeamCreationFormProps) {
  const { t } = useUnifiedTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [objectives, setObjectives] = useState<string[]>(['']);

  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: '',
      description: '',
      objectives: [],
      max_members: 10,
      privacy_level: 'department',
    },
  });

  const handleSubmit = async (data: TeamFormData) => {
    setIsSubmitting(true);
    try {
      const filteredObjectives = objectives.filter(obj => obj.trim() !== '');
      await onSubmit({
        ...data,
        objectives: filteredObjectives,
      });
      onClose();
    } catch (error) {
      console.error('Failed to create team:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addObjective = () => {
    setObjectives([...objectives, '']);
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);
  };

  const removeObjective = (index: number) => {
    const newObjectives = objectives.filter((_, i) => i !== index);
    setObjectives(newObjectives);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('workspace.team.create.title')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {/* Team Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('workspace.team.create.name')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('workspace.team.create.name_placeholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('workspace.team.create.description')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('workspace.team.create.description_placeholder')}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Team Objectives */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FormLabel className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    {t('workspace.team.create.objectives')}
                  </FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addObjective}
                  >
                    {t('workspace.team.create.add_objective')}
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {objectives.map((objective, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={t('workspace.team.create.objective_placeholder')}
                        value={objective}
                        onChange={(e) => updateObjective(index, e.target.value)}
                        className="flex-1"
                      />
                      {objectives.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeObjective(index)}
                          className="p-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Settings */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="max_members"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('workspace.team.create.max_members')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={2}
                          max={50}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="privacy_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('workspace.team.create.privacy_level')}</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="private">
                            {t('workspace.team.privacy.private')}
                          </option>
                          <option value="department">
                            {t('workspace.team.privacy.department')}
                          </option>
                          <option value="organization">
                            {t('workspace.team.privacy.organization')}
                          </option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('common.creating') : t('workspace.team.create.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}