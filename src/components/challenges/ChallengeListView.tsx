import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import { useDirection } from '@/components/ui/direction-provider';
import { formatDateArabic } from '@/utils/unified-date-handler';

interface Challenge {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  status: string;
  end_date?: string;
  start_date?: string;
  participants?: number;
  submissions?: number;
  challenge_type?: string;
  estimated_budget?: number;
  priority_level?: string;
  image_url?: string;
  trending?: boolean;
  featured?: boolean;
  experts?: Array<{ name: string; profile_image_url: string; }>;
}

interface ChallengeListViewProps {
  challenges: Challenge[];
  onViewDetails: (challenge: Challenge) => void;
  onParticipate: (challenge: Challenge) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export const ChallengeListView = ({ 
  challenges, 
  onViewDetails, 
  onParticipate, 
  sortBy, 
  sortOrder, 
  onSort 
}: ChallengeListViewProps) => {
  return (
    <div className="space-y-3 animate-fade-in">
      {challenges.map((challenge) => (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          onViewDetails={onViewDetails}
          onParticipate={onParticipate}
          viewMode="list"
          variant="compact"
        />
      ))}
    </div>
  );
};