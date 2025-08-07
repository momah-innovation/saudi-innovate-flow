import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

export type BookmarkType = 'challenge' | 'event' | 'idea' | 'focus_question' | 'campaign' | 'sector' | 'stakeholder' | 'expert' | 'partner' | 'opportunity';

interface Collection {
  id: string;
  user_id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  color: string;
  icon: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export function useBookmarks() {
  const [challengeBookmarks, setChallengeBookmarks] = useState<unknown[]>([]);
  const [eventBookmarks, setEventBookmarks] = useState<unknown[]>([]);
  const [ideaBookmarks, setIdeaBookmarks] = useState<unknown[]>([]);
  const [focusQuestionBookmarks, setFocusQuestionBookmarks] = useState<unknown[]>([]);
  const [campaignBookmarks, setCampaignBookmarks] = useState<unknown[]>([]);
  const [sectorBookmarks, setSectorBookmarks] = useState<unknown[]>([]);
  const [stakeholderBookmarks, setStakeholderBookmarks] = useState<unknown[]>([]);
  const [expertBookmarks, setExpertBookmarks] = useState<unknown[]>([]);
  const [partnerBookmarks, setPartnerBookmarks] = useState<unknown[]>([]);
  const [opportunityBookmarks, setOpportunityBookmarks] = useState<unknown[]>([]);
  const [publicTeams, setPublicTeams] = useState<unknown[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchChallengeBookmarks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('challenge_bookmarks')
        .select(`
          id,
          user_id,
          created_at,
          challenge_id,
          challenges!fk_challenge_bookmarks_challenge_id(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setChallengeBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching challenge bookmarks:', error);
    }
  };

  const fetchEventBookmarks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('event_bookmarks')
        .select(`
          id,
          user_id,
          created_at,
          event_id,
          events!fk_event_bookmarks_event_id(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setEventBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching event bookmarks:', error);
    }
  };

  const fetchIdeaBookmarks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('idea_bookmarks')
        .select(`
          id,
          user_id,
          created_at,
          notes,
          priority,
          idea_id,
          ideas!fk_idea_bookmarks_idea_id(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setIdeaBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching idea bookmarks:', error);
    }
  };

  const fetchFocusQuestionBookmarks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('focus_question_bookmarks')
        .select(`
          id,
          user_id,
          created_at,
          notes,
          priority,
          focus_question_id,
          focus_questions!fk_focus_question_bookmarks_focus_question_id(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setFocusQuestionBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching focus question bookmarks:', error);
    }
  };

  const fetchCampaignBookmarks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('campaign_bookmarks')
        .select(`
          id,
          user_id,
          created_at,
          notes,
          priority,
          campaign_id,
          campaigns!fk_campaign_bookmarks_campaign_id(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setCampaignBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching campaign bookmarks:', error);
    }
  };

  const fetchSectorBookmarks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('sector_bookmarks')
        .select(`
          id,
          user_id,
          created_at,
          notes,
          priority,
          sector_id,
          sectors!fk_sector_bookmarks_sector_id(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setSectorBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching sector bookmarks:', error);
    }
  };

  const fetchStakeholderBookmarks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('stakeholder_bookmarks')
        .select(`
          id,
          user_id,
          created_at,
          notes,
          priority,
          stakeholder_id,
          stakeholders!fk_stakeholder_bookmarks_stakeholder_id(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setStakeholderBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching stakeholder bookmarks:', error);
    }
  };

  const fetchExpertBookmarks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('expert_bookmarks')
        .select(`
          id,
          user_id,
          created_at,
          notes,
          priority,
          expert_id
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setExpertBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching expert bookmarks:', error);
    }
  };

  const fetchPartnerBookmarks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('partner_bookmarks')
        .select(`
          id,
          user_id,
          created_at,
          notes,
          priority,
          partner_id,
          partners!fk_partner_bookmarks_partner_id(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setPartnerBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching partner bookmarks:', error);
    }
  };

  const fetchOpportunityBookmarks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('opportunity_bookmarks')
        .select(`
          id,
          user_id,
          created_at,
          notes,
          priority,
          opportunity_id
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // If we have bookmarks, fetch the opportunity details separately
      if (data && data.length > 0) {
        const opportunityIds = data.map(bookmark => bookmark.opportunity_id);
        const { data: opportunities } = await supabase
          .from('opportunities')
          .select('*')
          .in('id', opportunityIds);
        
        // Combine bookmark data with opportunity details
        const bookmarksWithOpportunities = data.map(bookmark => ({
          ...bookmark,
          opportunities: opportunities?.find(opp => opp.id === bookmark.opportunity_id)
        }));
        
        setOpportunityBookmarks(bookmarksWithOpportunities);
      } else {
        setOpportunityBookmarks(data || []);
      }
    } catch (error) {
      console.error('Error fetching opportunity bookmarks:', error);
    }
  };

  const fetchPublicTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('innovation_team_members')
        .select(`
          id,
          user_id,
          status,
          specialization,
          department,
          innovation_teams:team_id(*)
        `)
        .eq('status', 'active')
        .limit(20);

      if (error) throw error;
      setPublicTeams(data || []);
    } catch (error) {
      console.error('Error fetching public teams:', error);
    }
  };

  const fetchCollections = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('bookmark_collections')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setCollections(data || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const fetchAllBookmarks = async () => {
    setLoading(true);
    await Promise.all([
      fetchChallengeBookmarks(),
      fetchEventBookmarks(),
      fetchIdeaBookmarks(),
      fetchFocusQuestionBookmarks(),
      fetchCampaignBookmarks(),
      fetchSectorBookmarks(),
      fetchStakeholderBookmarks(),
      fetchExpertBookmarks(),
      fetchPartnerBookmarks(),
      fetchOpportunityBookmarks(),
      fetchPublicTeams(),
      fetchCollections()
    ]);
    setLoading(false);
  };

  const addBookmark = async (type: BookmarkType, itemId: string, notes?: string, priority?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      let tableName: string;
      let fieldName: string;

      switch (type) {
        case 'challenge':
          tableName = 'challenge_bookmarks';
          fieldName = 'challenge_id';
          break;
        case 'event':
          tableName = 'event_bookmarks';
          fieldName = 'event_id';
          break;
        case 'idea':
          tableName = 'idea_bookmarks';
          fieldName = 'idea_id';
          break;
        case 'opportunity':
          tableName = 'opportunity_bookmarks';
          fieldName = 'opportunity_id';
          break;
        case 'partner':
          tableName = 'partner_bookmarks';
          fieldName = 'partner_id';
          break;
        default:
          return false;
      }

      const insertData: any = {
        user_id: user.id,
        [fieldName]: itemId
      };

      // Add notes and priority for all bookmark types now that they support them
      if (notes) insertData.notes = notes;
      if (priority) insertData.priority = priority || 'medium';

      const { error } = await supabase.from(tableName as any).insert(insertData);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "تحذير",
            description: "هذا العنصر محفوظ مسبقاً",
            variant: "destructive"
          });
          return false;
        }
        throw error;
      }

      toast({
        title: "تم بنجاح",
        description: "تم حفظ العنصر"
      });

      fetchAllBookmarks();
      return true;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ العنصر",
        variant: "destructive"
      });
      return false;
    }
  };

  const removeBookmark = async (bookmarkId: string, type: BookmarkType) => {
    try {
      let tableName: string;

      switch (type) {
        case 'challenge':
          tableName = 'challenge_bookmarks';
          break;
        case 'event':
          tableName = 'event_bookmarks';
          break;
        case 'idea':
          tableName = 'idea_bookmarks';
          break;
        case 'opportunity':
          tableName = 'opportunity_bookmarks';
          break;
        case 'partner':
          tableName = 'partner_bookmarks';
          break;
        default:
          return false;
      }

      const { error } = await supabase.from(tableName as any).delete().eq('id', bookmarkId);

      if (error) throw error;

      toast({
        title: "تم بنجاح",
        description: "تم حذف العنصر من المحفوظات"
      });

      fetchAllBookmarks();
      return true;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف العنصر",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateBookmark = async (bookmarkId: string, type: BookmarkType, updates: { notes?: string; priority?: string; reminder_date?: string }) => {
    try {
      // For now, only basic bookmark functionality is supported
      // Extended functionality will be added when the table columns are available
      toast({
        title: "معلومات",
        description: "خاصية التحديث ستكون متاحة قريباً"
      });
      return true;
    } catch (error) {
      console.error('Error updating bookmark:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث العنصر",
        variant: "destructive"
      });
      return false;
    }
  };

  const isBookmarked = (type: BookmarkType, itemId: string): boolean => {
    switch (type) {
      case 'challenge':
        return challengeBookmarks.some(b => b.challenge_id === itemId);
      case 'event':
        return eventBookmarks.some(b => b.event_id === itemId);
      case 'idea':
        return ideaBookmarks.some(b => b.idea_id === itemId);
      case 'opportunity':
        return opportunityBookmarks.some(b => b.opportunity_id === itemId);
      case 'partner':
        return partnerBookmarks.some(b => b.partner_id === itemId);
      default:
        return false;
    }
  };

  const getBookmarkId = (type: BookmarkType, itemId: string): string | null => {
    let bookmark;
    switch (type) {
      case 'challenge':
        bookmark = challengeBookmarks.find(b => b.challenge_id === itemId);
        break;
      case 'event':
        bookmark = eventBookmarks.find(b => b.event_id === itemId);
        break;
      case 'idea':
        bookmark = ideaBookmarks.find(b => b.idea_id === itemId);
        break;
      case 'opportunity':
        bookmark = opportunityBookmarks.find(b => b.opportunity_id === itemId);
        break;
      case 'partner':
        bookmark = partnerBookmarks.find(b => b.partner_id === itemId);
        break;
      default:
        return null;
    }
    return bookmark?.id || null;
  };

  // Set up real-time subscriptions
  useEffect(() => {
    fetchAllBookmarks();

    // Set up real-time subscription for bookmarks
    const challengeChannel = supabase
      .channel('challenge-bookmarks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'challenge_bookmarks'
        },
        () => {
          fetchChallengeBookmarks();
        }
      )
      .subscribe();

    const eventChannel = supabase
      .channel('event-bookmarks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_bookmarks'
        },
        () => {
          fetchEventBookmarks();
        }
      )
      .subscribe();

    const ideaChannel = supabase
      .channel('idea-bookmarks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'idea_bookmarks'
        },
        () => {
          fetchIdeaBookmarks();
        }
      )
      .subscribe();

    return () => {
      challengeChannel.unsubscribe();
      eventChannel.unsubscribe();
      ideaChannel.unsubscribe();
    };
  }, []);

  return {
    challengeBookmarks,
    eventBookmarks,
    ideaBookmarks,
    focusQuestionBookmarks,
    campaignBookmarks,
    sectorBookmarks,
    stakeholderBookmarks,
    expertBookmarks,
    partnerBookmarks,
    opportunityBookmarks,
    publicTeams,
    collections,
    loading,
    addBookmark,
    removeBookmark,
    updateBookmark,
    isBookmarked,
    getBookmarkId,
    fetchAllBookmarks
  };
}