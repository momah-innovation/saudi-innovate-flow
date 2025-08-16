import React, { useReducer } from 'react';

// State management optimization for CampaignWizard
interface CampaignWizardState {
  loading: boolean;
  currentStep: number;
  formData: any;
  entities: {
    sectors: any[];
    deputies: any[];
    departments: any[];
    challenges: any[];
    partners: any[];
    stakeholders: any[];
    managers: any[];
  };
  searchTerms: {
    manager: string;
    partner: string;
    stakeholder: string;
  };
  dropdownStates: {
    manager: boolean;
    sector: boolean;
    deputy: boolean;
    department: boolean;
    challenge: boolean;
  };
}

type CampaignWizardAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<any> }
  | { type: 'SET_ENTITIES'; entityType: keyof CampaignWizardState['entities']; payload: any[] }
  | { type: 'SET_SEARCH_TERM'; searchType: keyof CampaignWizardState['searchTerms']; payload: string }
  | { type: 'TOGGLE_DROPDOWN'; dropdown: keyof CampaignWizardState['dropdownStates'] }
  | { type: 'SET_DROPDOWN'; dropdown: keyof CampaignWizardState['dropdownStates']; payload: boolean };

const initialState: CampaignWizardState = {
  loading: false,
  currentStep: 0,
  formData: {},
  entities: {
    sectors: [],
    deputies: [],
    departments: [],
    challenges: [],
    partners: [],
    stakeholders: [],
    managers: [],
  },
  searchTerms: {
    manager: "",
    partner: "",
    stakeholder: "",
  },
  dropdownStates: {
    manager: false,
    sector: false,
    deputy: false,
    department: false,
    challenge: false,
  }
};

function campaignWizardReducer(state: CampaignWizardState, action: CampaignWizardAction): CampaignWizardState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'UPDATE_FORM_DATA':
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case 'SET_ENTITIES':
      return { 
        ...state, 
        entities: { ...state.entities, [action.entityType]: action.payload }
      };
    case 'SET_SEARCH_TERM':
      return {
        ...state,
        searchTerms: { ...state.searchTerms, [action.searchType]: action.payload }
      };
    case 'TOGGLE_DROPDOWN':
      return {
        ...state,
        dropdownStates: { 
          ...state.dropdownStates, 
          [action.dropdown]: !state.dropdownStates[action.dropdown]
        }
      };
    case 'SET_DROPDOWN':
      return {
        ...state,
        dropdownStates: { 
          ...state.dropdownStates, 
          [action.dropdown]: action.payload
        }
      };
    default:
      return state;
  }
}

// Custom hook for CampaignWizard state management
export function useCampaignWizardState() {
  const [state, dispatch] = useReducer(campaignWizardReducer, initialState);

  const actions = React.useMemo(() => ({
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setCurrentStep: (step: number) => dispatch({ type: 'SET_CURRENT_STEP', payload: step }),
    updateFormData: (data: Partial<any>) => dispatch({ type: 'UPDATE_FORM_DATA', payload: data }),
    setEntities: (entityType: keyof CampaignWizardState['entities'], data: any[]) => 
      dispatch({ type: 'SET_ENTITIES', entityType, payload: data }),
    setSearchTerm: (searchType: keyof CampaignWizardState['searchTerms'], term: string) =>
      dispatch({ type: 'SET_SEARCH_TERM', searchType, payload: term }),
    toggleDropdown: (dropdown: keyof CampaignWizardState['dropdownStates']) =>
      dispatch({ type: 'TOGGLE_DROPDOWN', dropdown }),
    setDropdown: (dropdown: keyof CampaignWizardState['dropdownStates'], open: boolean) =>
      dispatch({ type: 'SET_DROPDOWN', dropdown, payload: open }),
  }), []);

  return { state, actions };
}