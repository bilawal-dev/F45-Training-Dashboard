import { RegionData } from '@/types/dashboard';

export const REGIONAL_DATA: { [key: string]: RegionData } = {
  northeast: {
    name: 'Northeast',
    stateList: ['Maine', 'New Hampshire', 'Vermont', 'Massachusetts', 'Rhode Island', 'Connecticut', 'New York', 'New Jersey', 'Pennsylvania'],
    metrics: [
        { number: '50/125', label: 'Locations Completed', status: { type: 'info', text: '40% COMPLETE' } },
        { number: '3 days', label: 'Behind Schedule', status: { type: 'behind', text: 'Behind' } },
        { number: 'Production', label: 'Current Phase', status: { type: 'active', text: 'Active' } },
        { number: '8', label: 'Locations Need Attention', status: { type: 'behind', text: 'Action Required' } }
    ],
    phases: ['Planning', 'Permitting', 'Production', 'Shipping', 'Installation', 'Close-out'],
    currentPhaseIndex: 2,
    completionPercentage: 40,
    summary: '50/125 stores completed',
    states: [
      { name: 'New York', completed: '20/40', currentPhase: 'Production', status: 'on-track', issues: 3, hasAISummary: true, lastUpdated: '2024-07-22' },
      { name: 'New Jersey', completed: '10/25', currentPhase: 'Permitting', status: 'behind', issues: 5, hasAISummary: false, lastUpdated: '2024-07-21' },
      { name: 'Pennsylvania', completed: '15/30', currentPhase: 'Production', status: 'on-track', issues: 0, hasAISummary: true, lastUpdated: '2024-07-22' },
      { name: 'Massachusetts', completed: '5/20', currentPhase: 'Planning', status: 'ahead', issues: 0, hasAISummary: false, lastUpdated: '2024-07-20' },
      { name: 'Connecticut', completed: '0/10', currentPhase: 'Permitting', status: 'scheduled', issues: 0, hasAISummary: false, lastUpdated: '2024-07-19' },
    ],
  },
  southeast: {
    name: 'Southeast',
    stateList: ['Texas', 'Oklahoma', 'Arkansas', 'Louisiana', 'Mississippi', 'Alabama', 'Georgia', 'Florida', 'South Carolina', 'North Carolina', 'Tennessee', 'Kentucky', 'West Virginia', 'Virginia', 'Maryland', 'Delaware', 'District of Columbia'],
    metrics: [
        { number: '102/210', label: 'Locations Completed', status: { type: 'info', text: '49% COMPLETE' } },
        { number: '7 days', label: 'Ahead of Schedule', status: { type: 'ahead', text: 'Ahead' } },
        { number: 'Installation', label: 'Current Phase', status: { type: 'active', text: 'Active' } },
        { number: '2', label: 'Locations Need Attention', status: { type: 'behind', text: 'Action Required' } }
    ],
    phases: ['Planning', 'Permitting', 'Production', 'Shipping', 'Installation', 'Close-out'],
    currentPhaseIndex: 4,
    completionPercentage: 49,
    summary: '102/210 stores completed',
    states: [
      { name: 'Texas', completed: '28/52', currentPhase: 'Installation', status: 'ahead', issues: 1, hasAISummary: false, lastUpdated: '2 hours ago' },
      { name: 'Florida', completed: '18/31', currentPhase: 'Installation', status: 'on-track', issues: 0, hasAISummary: false, lastUpdated: '4 hours ago' },
      { name: 'Georgia', completed: '15/24', currentPhase: 'Installation', status: 'on-track', issues: 0, hasAISummary: false, lastUpdated: '1 day ago' },
      { name: 'North Carolina', completed: '12/22', currentPhase: 'Shipping', status: 'behind', issues: 1, hasAISummary: true, lastUpdated: '6 hours ago' },
      { name: 'Virginia', completed: '11/19', currentPhase: 'Installation', status: 'on-track', issues: 0, hasAISummary: false, lastUpdated: '3 hours ago' },
      { name: 'South Carolina', completed: '9/15', currentPhase: 'Installation', status: 'on-track', issues: 0, hasAISummary: false, lastUpdated: '1 day ago' },
      { name: 'Tennessee', completed: '6/13', currentPhase: 'Shipping', status: 'on-track', issues: 0, hasAISummary: false, lastUpdated: '8 hours ago' },
      { name: 'Maryland', completed: '3/11', currentPhase: 'Production', status: 'on-track', issues: 0, hasAISummary: false, lastUpdated: '5 hours ago' },
      { name: 'Alabama', completed: '0/8', currentPhase: 'Permitting', status: 'on-track', issues: 0, hasAISummary: false, lastUpdated: '2 days ago' },
      { name: 'Other States', completed: '0/15', currentPhase: 'Planning', status: 'scheduled', issues: 0, hasAISummary: false, lastUpdated: '1 week ago' },
    ],
  },
  west: {
    name: 'West',
    stateList: ['Washington', 'Oregon', 'California', 'Nevada', 'Arizona', 'Utah', 'Idaho', 'Montana', 'Wyoming', 'Colorado', 'New Mexico', 'Alaska', 'Hawaii'],
    metrics: [
        { number: '80/160', label: 'Locations Completed', status: { type: 'info', text: '50% COMPLETE' } },
        { number: 'On Schedule', label: 'Schedule Adherence', status: { type: 'on-track', text: 'On Track' } },
        { number: 'Shipping', label: 'Current Phase', status: { type: 'active', text: 'Active' } },
        { number: '5', label: 'Locations Need Attention', status: { type: 'behind', text: 'Action Required' } }
    ],
    phases: ['Planning', 'Permitting', 'Production', 'Shipping', 'Installation', 'Close-out'],
    currentPhaseIndex: 3,
    completionPercentage: 50,
    summary: '80/160 stores completed',
    states: [
      { name: 'California', completed: '45/80', currentPhase: 'Shipping', status: 'on-track', issues: 3, hasAISummary: true, lastUpdated: '2024-07-21' },
      { name: 'Arizona', completed: '15/30', currentPhase: 'Production', status: 'ahead', issues: 0, hasAISummary: false, lastUpdated: '2024-07-22' },
      { name: 'Washington', completed: '10/25', currentPhase: 'Installation', status: 'on-track', issues: 1, hasAISummary: true, lastUpdated: '2024-07-22' },
      { name: 'Oregon', completed: '5/15', currentPhase: 'Permitting', status: 'behind', issues: 1, hasAISummary: false, lastUpdated: '2024-07-20' },
      { name: 'Nevada', completed: '5/10', currentPhase: 'Close-out', status: 'complete', issues: 0, hasAISummary: true, lastUpdated: '2024-07-19' },
    ],
  },
  midwest: {
    name: 'Midwest',
    stateList: ['Illinois', 'Ohio', 'Michigan', 'Indiana', 'Wisconsin', 'Minnesota', 'Iowa', 'Missouri', 'Kansas', 'Nebraska', 'North Dakota', 'South Dakota'],
    metrics: [
      { number: '30/95', label: 'Locations Completed', status: { type: 'info', text: '32% COMPLETE' } },
      { number: '1 day', label: 'Ahead of Schedule', status: { type: 'ahead', text: 'Ahead' } },
      { number: 'Permitting', label: 'Current Phase', status: { type: 'active', text: 'Active' } },
      { number: '3', label: 'Locations Need Attention', status: { type: 'behind', text: 'Action Required' } }
    ],
    phases: ['Planning', 'Permitting', 'Production', 'Shipping', 'Installation', 'Close-out'],
    currentPhaseIndex: 1,
    completionPercentage: 32,
    summary: '30/95 stores completed',
    states: [
      { name: 'Illinois', completed: '10/25', currentPhase: 'Permitting', status: 'on-track', issues: 1, hasAISummary: true, lastUpdated: '2024-07-22' },
      { name: 'Ohio', completed: '8/20', currentPhase: 'Planning', status: 'ahead', issues: 0, hasAISummary: false, lastUpdated: '2024-07-21' },
      { name: 'Michigan', completed: '5/15', currentPhase: 'Permitting', status: 'behind', issues: 2, hasAISummary: false, lastUpdated: '2024-07-20' },
      { name: 'Indiana', completed: '4/10', currentPhase: 'Production', status: 'on-track', issues: 0, hasAISummary: true, lastUpdated: '2024-07-22' },
      { name: 'Wisconsin', completed: '3/10', currentPhase: 'Planning', status: 'scheduled', issues: 0, hasAISummary: false, lastUpdated: '2024-07-19' },
    ],
  }
}; 