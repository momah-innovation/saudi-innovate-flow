import React, { useReducer } from 'react';

// State management optimization for ExpertAssignmentManagement
interface ExpertAssignmentState {
  experts: any[];
  challenges: any[];
  challengeExperts: any[];
  loading: boolean;
  selectedExpert: any | null;
  selectedChallenge: any | null;
  selectedAssignment: any | null;
  dialogs: {
    assign: boolean;
    bulkAssign: boolean;
    editAssignment: boolean;
    viewAssignment: boolean;
    expertProfile: boolean;
  };
  selections: {
    bulkChallenges: string[];
    bulkExperts: string[];
    expertId: string | null;
  };
  filters: {
    expertFilter: string;
    challengeFilter: string;
    statusFilter: string;
  };
}

type ExpertAssignmentAction = 
  | { type: 'SET_EXPERTS'; payload: any[] }
  | { type: 'SET_CHALLENGES'; payload: any[] }
  | { type: 'SET_CHALLENGE_EXPERTS'; payload: any[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SELECTED_EXPERT'; payload: any | null }
  | { type: 'SET_SELECTED_CHALLENGE'; payload: any | null }
  | { type: 'SET_SELECTED_ASSIGNMENT'; payload: any | null }
  | { type: 'TOGGLE_DIALOG'; dialog: keyof ExpertAssignmentState['dialogs'] }
  | { type: 'SET_DIALOG'; dialog: keyof ExpertAssignmentState['dialogs']; payload: boolean }
  | { type: 'SET_BULK_SELECTION'; selectionType: keyof ExpertAssignmentState['selections']; payload: any }
  | { type: 'SET_FILTER'; filterType: keyof ExpertAssignmentState['filters']; payload: string };

const initialAssignmentState: ExpertAssignmentState = {
  experts: [],
  challenges: [],
  challengeExperts: [],
  loading: true,
  selectedExpert: null,
  selectedChallenge: null,
  selectedAssignment: null,
  dialogs: {
    assign: false,
    bulkAssign: false,
    editAssignment: false,
    viewAssignment: false,
    expertProfile: false,
  },
  selections: {
    bulkChallenges: [],
    bulkExperts: [],
    expertId: null,
  },
  filters: {
    expertFilter: '',
    challengeFilter: '',
    statusFilter: 'all',
  }
};

function expertAssignmentReducer(state: ExpertAssignmentState, action: ExpertAssignmentAction): ExpertAssignmentState {
  switch (action.type) {
    case 'SET_EXPERTS':
      return { ...state, experts: action.payload };
    case 'SET_CHALLENGES':
      return { ...state, challenges: action.payload };
    case 'SET_CHALLENGE_EXPERTS':
      return { ...state, challengeExperts: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SELECTED_EXPERT':
      return { ...state, selectedExpert: action.payload };
    case 'SET_SELECTED_CHALLENGE':
      return { ...state, selectedChallenge: action.payload };
    case 'SET_SELECTED_ASSIGNMENT':
      return { ...state, selectedAssignment: action.payload };
    case 'TOGGLE_DIALOG':
      return {
        ...state,
        dialogs: { ...state.dialogs, [action.dialog]: !state.dialogs[action.dialog] }
      };
    case 'SET_DIALOG':
      return {
        ...state,
        dialogs: { ...state.dialogs, [action.dialog]: action.payload }
      };
    case 'SET_BULK_SELECTION':
      return {
        ...state,
        selections: { ...state.selections, [action.selectionType]: action.payload }
      };
    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, [action.filterType]: action.payload }
      };
    default:
      return state;
  }
}

// Custom hook for ExpertAssignmentManagement state management
export function useExpertAssignmentState() {
  const [state, dispatch] = useReducer(expertAssignmentReducer, initialAssignmentState);

  const actions = React.useMemo(() => ({
    setExperts: (experts: any[]) => dispatch({ type: 'SET_EXPERTS', payload: experts }),
    setChallenges: (challenges: any[]) => dispatch({ type: 'SET_CHALLENGES', payload: challenges }),
    setChallengeExperts: (challengeExperts: any[]) => dispatch({ type: 'SET_CHALLENGE_EXPERTS', payload: challengeExperts }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setSelectedExpert: (expert: any | null) => dispatch({ type: 'SET_SELECTED_EXPERT', payload: expert }),
    setSelectedChallenge: (challenge: any | null) => dispatch({ type: 'SET_SELECTED_CHALLENGE', payload: challenge }),
    setSelectedAssignment: (assignment: any | null) => dispatch({ type: 'SET_SELECTED_ASSIGNMENT', payload: assignment }),
    toggleDialog: (dialog: keyof ExpertAssignmentState['dialogs']) => dispatch({ type: 'TOGGLE_DIALOG', dialog }),
    setDialog: (dialog: keyof ExpertAssignmentState['dialogs'], open: boolean) => 
      dispatch({ type: 'SET_DIALOG', dialog, payload: open }),
    setBulkSelection: (selectionType: keyof ExpertAssignmentState['selections'], value: any) =>
      dispatch({ type: 'SET_BULK_SELECTION', selectionType, payload: value }),
    setFilter: (filterType: keyof ExpertAssignmentState['filters'], value: string) =>
      dispatch({ type: 'SET_FILTER', filterType, payload: value }),
  }), []);

  return { state, actions };
}