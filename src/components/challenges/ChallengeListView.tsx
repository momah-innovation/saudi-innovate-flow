import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  CalendarIcon, 
  Target, 
  Users, 
  Award, 
  Eye, 
  BookmarkIcon,
  TrendingUp,
  ArrowUpDown
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

interface Challenge {
  id: number;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  status: string;
  deadline: string;
  participants: number;
  submissions: number;
  category: string;
  category_en: string;
  prize: string;
  difficulty: string;
  trending?: boolean;
  experts?: Array<{ name: string; avatar: string; }>;
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
  const { isRTL } = useDirection();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'سهل': case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'متوسط': case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'صعب': case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return isRTL ? 'نشط' : 'Active';
      case 'upcoming': return isRTL ? 'قريباً' : 'Upcoming';
      case 'closed': return isRTL ? 'مغلق' : 'Closed';
      default: return status;
    }
  };

  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onSort(field)}
      className="h-auto p-1 font-medium hover:bg-transparent"
    >
      {children}
      <ArrowUpDown className="ml-2 h-3 w-3" />
    </Button>
  );

  return (
    <div className="border rounded-lg overflow-hidden animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[300px]">
              <SortButton field="title">
                {isRTL ? 'التحدي' : 'Challenge'}
              </SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="status">
                {isRTL ? 'الحالة' : 'Status'}
              </SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="difficulty">
                {isRTL ? 'الصعوبة' : 'Difficulty'}
              </SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="participants">
                {isRTL ? 'المشاركين' : 'Participants'}
              </SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="submissions">
                {isRTL ? 'المساهمات' : 'Submissions'}
              </SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="deadline">
                {isRTL ? 'الموعد النهائي' : 'Deadline'}
              </SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="prize">
                {isRTL ? 'الجائزة' : 'Prize'}
              </SortButton>
            </TableHead>
            <TableHead className="text-right">{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {challenges.map((challenge) => (
            <TableRow key={challenge.id} className="hover:bg-muted/30 transition-colors">
              <TableCell>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm line-clamp-1">
                      {isRTL ? challenge.title : challenge.title_en}
                    </h4>
                    {challenge.trending && (
                      <Badge variant="outline" className="text-orange-600 border-orange-200 text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {isRTL ? 'رائج' : 'Trending'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {isRTL ? challenge.description : challenge.description_en}
                  </p>
                  <Badge variant="outline" className="text-xs w-fit">
                    {isRTL ? challenge.category : challenge.category_en}
                  </Badge>
                  
                  {/* Expert Avatars */}
                  {challenge.experts && challenge.experts.length > 0 && (
                    <div className="flex -space-x-1">
                      {challenge.experts.slice(0, 3).map((expert, index) => (
                        <Avatar key={index} className="w-5 h-5 border border-background">
                          <AvatarImage src={expert.avatar} alt={expert.name} />
                          <AvatarFallback className="text-xs">{expert.name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                      {challenge.experts.length > 3 && (
                        <div className="w-5 h-5 bg-muted rounded-full border border-background flex items-center justify-center">
                          <span className="text-xs">+{challenge.experts.length - 3}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(challenge.status)} variant="outline">
                  {getStatusText(challenge.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getDifficultyColor(challenge.difficulty)} variant="outline">
                  {challenge.difficulty}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm">{challenge.participants}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm">{challenge.submissions}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm">{challenge.deadline}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Award className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm font-medium">{challenge.prize}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => onViewDetails(challenge)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <BookmarkIcon className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={() => onParticipate(challenge)}>
                    {isRTL ? 'مشاركة' : 'Join'}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};