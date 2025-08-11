import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { CollaborationProvider } from '@/contexts/CollaborationContext';
import { CollaborativeIdeasBrowse } from '@/components/ideas/CollaborativeIdeasBrowse';
import { CollaborativeChallengesBrowse } from '@/components/challenges/CollaborativeChallengesBrowse';
import { CollaborativeEventsBrowse } from '@/components/events/CollaborativeEventsBrowse';
import { CollaborativeOpportunitiesBrowse } from '@/components/opportunities/CollaborativeOpportunitiesBrowse';

interface CollaborativeBrowsePageProps {
  type: 'ideas' | 'challenges' | 'events' | 'opportunities';
}

const CollaborativeBrowsePage: React.FC<CollaborativeBrowsePageProps> = ({ type }) => {
  // Mock data for demonstration - in real app this would come from props or API
  const mockData = {
    ideas: [],
    challenges: [],
    events: [],
    opportunities: []
  };

  const renderContent = () => {
    switch (type) {
      case 'ideas':
        return <CollaborativeIdeasBrowse ideas={mockData.ideas} onIdeaSelect={() => {}} />;
      case 'challenges':
        return <CollaborativeChallengesBrowse challenges={mockData.challenges} onChallengeSelect={() => {}} />;
      case 'events':
        return <CollaborativeEventsBrowse events={mockData.events} onEventSelect={() => {}} />;
      case 'opportunities':
        return <CollaborativeOpportunitiesBrowse opportunities={mockData.opportunities} onOpportunitySelect={() => {}} />;
      default:
        return <div>Invalid browse type</div>;
    }
  };

  return (
    <CollaborationProvider>
      <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="container mx-auto">
          {renderContent()}
        </div>
      </div>
    </CollaborationProvider>
  );
};

// Export individual pages for routing
export const CollaborativeIdeasPage = () => <CollaborativeBrowsePage type="ideas" />;
export const CollaborativeChallengesPage = () => <CollaborativeBrowsePage type="challenges" />;
export const CollaborativeEventsPage = () => <CollaborativeBrowsePage type="events" />;
export const CollaborativeOpportunitiesPage = () => <CollaborativeBrowsePage type="opportunities" />;

export default CollaborativeBrowsePage;