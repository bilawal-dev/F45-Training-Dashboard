export interface Region {
  name: string;
  states: string[];
  status: 'finished' | 'current' | 'to_be_started' | 'upcoming';
}

export interface POI {
  lat: number;
  lng: number;
  text: string;
  isCompleted?: boolean;
}

export interface RegionStatus {
  name: string;
  completedStores: number;
  totalStores: number;
  status: 'completed' | 'in-progress' | 'planned';
}

export interface StateProgress {
  name: string;
  completed: string;
  currentPhase: string;
  status: 'ahead' | 'on-track' | 'behind' | 'complete' | 'scheduled';
  issues: number;
  hasAISummary?: boolean;
  aiSummaryData?: string;
  lastUpdated: string;
}

export interface ActivityItem {
  type: 'success' | 'warning' | 'info';
  text: string;
  time: string;
}

export interface MetricCard {
  number: string;
  label: string;
  status?: {
    type: 'on-track' | 'behind' | 'ahead' | 'good' | 'active' | 'info';
    text: string;
  };
}

export interface AIResponse {
  user: string;
  ai: string;
}

export type Status = 'completed' | 'in-progress' | 'upcoming' | 'active' | 'heading';

export type ViewType = 
  | 'overview' 
  | 'northeast' 
  | 'southeast' 
  | 'midwest' 
  | 'west'
  | 'regional-heading';

export interface SidebarItem {
  id: ViewType;
  label: string;
  icon?: string;
  status: Status;
  clickable: boolean;
} 

export interface StateData {
  name: string;
  completed: string;
  currentPhase: string;
  status: string;
  issues: number;
  hasAISummary: boolean;
  lastUpdated: string;
}
export interface RegionData {
  name: string;
  stateList: string[];
  metrics: MetricCard[];
  phases: string[];
  currentPhaseIndex: number;
  completionPercentage: number;
  summary: string;
  states: StateData[];
} 