// TypeScript interfaces for ClickUp API data

export interface ClickUpTask {
  id: string;
  name: string;
  status: {
    status: string;
    color?: string;
  };
  custom_fields?: ClickUpCustomField[];
  due_date?: string;
  start_date?: string;
  url: string;
  creator?: any;
  watchers?: any[];
  time_estimate?: number;
}

export interface ClickUpCustomField {
  id: string;
  name: string;
  value: any;
  type: string;
}

export interface ClickUpProject {
  id: string;
  name: string;
  customerFolder: string;
  folderId: string | null;
  spaceId: string;
  spaceName: string;
  taskCount: number;
  url: string;
  archived: boolean;
}

export interface ClickUpProcessedProject {
  projectDetails: any;
  phases: ClickUpPhaseGroup[];
  allTasks: ProcessedTask[];
  timeline: ProjectTimeline;
  overallCompletion: number;
  summary: {
    totalPhases: number;
    totalTasks: number;
    overallCompletion: number;
  };
}

export interface ClickUpPhaseGroup {
  name: string;
  tasks: ProcessedTask[];
  totalTasks: number;
  completedTasks: number;
  averageCompletion: number;
}

export interface ProcessedTask {
  id: string;
  name: string;
  status: string;
  percentComplete: number;
  phase: number;
  phaseName: string;
  f45Phase: string;
  url: string;
  dueDate?: string;
  startDate?: string;
}

export interface ProjectTimeline {
  startDate: Date;
  endDate: Date;
  duration: number;
  timelineType: 'daily' | 'weekly' | 'monthly';
}

// F45 Dashboard compatible data structures
export interface F45StateProgress {
  name: string;
  completed: string;
  currentPhase: string;
  status: 'ahead' | 'on-track' | 'behind' | 'complete' | 'scheduled';
  issues: number;
  hasAISummary?: boolean;
  aiSummaryData?: string;
  lastUpdated: string;
  clickupProjectId?: string;
  clickupData?: ClickUpProcessedProject;
}

export interface F45RegionData {
  name: string;
  states: F45StateProgress[];
  totalLocations: number;
  completedLocations: number;
  overallProgress: number;
  currentPhase: string;
  status: 'completed' | 'in-progress' | 'planned';
}

export interface F45MetricCard {
  number: string;
  label: string;
  status?: {
    type: 'on-track' | 'behind' | 'ahead' | 'good';
    text: string;
  };
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
} 