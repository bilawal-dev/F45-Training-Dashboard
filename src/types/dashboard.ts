export interface Region {
  name: string;
  states: string[];
  status: 'finished' | 'current' | 'to_be_started' | 'upcoming';
}

export interface POI {
  lat: number;
  lng: number;
  text: string;
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
  id: string;
  type: 'success' | 'warning' | 'info';
  text: string;
  time: string;
}

export interface MetricCard {
  number: string;
  label: string;
  status?: {
    type: 'on-track' | 'behind' | 'ahead' | 'good';
    text: string;
  };
}

export interface AIResponse {
  user: string;
  ai: string;
}

export type ViewType = 'overview' | 'southeast' | 'northeast' | 'midwest' | 'west'; 