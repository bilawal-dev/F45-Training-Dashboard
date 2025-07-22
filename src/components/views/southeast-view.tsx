import MetricTile from '@/components/ui/metric-tile';
import ProgressTile from '@/components/ui/progress-tile';
import DataTable from '@/components/ui/data-table';
import ActivityFeed from '@/components/ui/activity-feed';
import { SOUTHEAST_METRICS, SOUTHEAST_STATES, ACTIVITY_ITEMS } from '@/constants/dashboard-data';

export default function SoutheastView() {
  const stateTableHeaders = [
    'State',
    'Complete',
    'Current Phase',
    'Status',
    'Issues',
    'AI Summary',
    'Designs',
    'Updated'
  ];

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'ahead': 'status-ahead',
      'on-track': 'status-on-track',
      'behind': 'status-behind',
      'scheduled': 'status-complete'
    };

    const statusTexts = {
      'ahead': 'Ahead',
      'on-track': 'On Track',
      'behind': 'Behind',
      'scheduled': 'Scheduled'
    };

    return (
      <span className={`px-2 py-1 rounded-xl text-xs font-semibold uppercase tracking-wide ${statusClasses[status as keyof typeof statusClasses] || ''}`}>
        {statusTexts[status as keyof typeof statusTexts] || status}
      </span>
    );
  };

  const stateTableRows = SOUTHEAST_STATES.map(state => [
    <strong key={state.name}>{state.name}</strong>,
    state.completed,
    state.currentPhase,
    getStatusBadge(state.status),
    state.issues.toString(),
    state.hasAISummary ? (
      <span key={`${state.name}-ai`} className="text-blue-600 cursor-pointer text-xs font-medium hover:text-blue-800">
        AI Summary ⓘ
      </span>
    ) : (
      <span key={`${state.name}-placeholder`} className="text-gray-300 italic">—</span>
    ),
    <button key={`${state.name}-designs`} className="text-gray-500 hover:text-gray-700 text-xs underline">
      View Approved Designs
    </button>,
    state.lastUpdated
  ]);

  const southeastPhases = ['Planning', 'Permitting', 'Production', 'Shipping', 'Installation', 'Close-out'];
  const currentPhaseIndex = 4; // Installation

  return (
    <div className="space-y-6">
      {/* Region Header */}
      <div className="bg-white rounded-xl shadow-sm border border-primary p-6">
        <h1 className="text-3xl font-bold text-brand-primary mb-2">
          Southeast Region
        </h1>
        <p className="text-secondary text-sm leading-relaxed max-w-4xl font-normal tracking-wide py-3">
          Texas, Oklahoma, Arkansas, Louisiana, Mississippi, Alabama, Georgia, Florida, South Carolina,
          North Carolina, Tennessee, Kentucky, West Virginia, Virginia, Maryland, Delaware, District of Columbia
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SOUTHEAST_METRICS.map((metric, index) => (
          <MetricTile key={index} metric={metric} />
        ))}
      </div>

      {/* Phase Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-primary p-6">
        <h2 className="text-lg font-semibold text-brand-primary mb-5">
          Southeast Region Phase Progress
        </h2>
        <ProgressTile
          title=""
          phases={southeastPhases}
          currentPhaseIndex={currentPhaseIndex}
          summary=""
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* State-by-State Progress Table */}
        <div className="lg:col-span-2">
          <DataTable
            title="State-by-State Progress"
            headers={stateTableHeaders}
            rows={stateTableRows}
          />
        </div>

        {/* Activity Feed */}
        <div>
          <ActivityFeed activities={ACTIVITY_ITEMS} />
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-primary p-5">
          <h3 className="text-sm font-semibold text-brand-primary mb-3">
            Upcoming Milestones
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary">Next 7 days</span>
              <span className="text-gray-700 font-medium">18 installations scheduled</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary">Permit deadlines</span>
              <span className="text-gray-700 font-medium">4 applications due this week</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary">Production shipments</span>
              <span className="text-gray-700 font-medium">6 batches arriving Monday</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary">Phase transition</span>
              <span className="text-gray-700 font-medium">Alabama → Production (Est. Dec 15)</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-primary p-5">
          <h3 className="text-sm font-semibold text-brand-primary mb-3">
            Quality Metrics
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary">Installation success rate</span>
              <span className="text-gray-700 font-medium">98.5% first-time approval</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary">Permit approval rate</span>
              <span className="text-gray-700 font-medium">94% approved on first submission</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary">Customer satisfaction</span>
              <span className="text-gray-700 font-medium">4.8/5 average rating</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary">Rework incidents</span>
              <span className="text-gray-700 font-medium">1.2% of completed locations</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-primary p-5">
          <h3 className="text-sm font-semibold text-brand-primary mb-3">
            Resource Allocation
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary">Installation crews</span>
              <span className="text-gray-700 font-medium">6 active, 2 on standby</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary">Current capacity</span>
              <span className="text-gray-700 font-medium">22-25 locations per week</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary">Primary bottleneck</span>
              <span className="text-gray-700 font-medium">Urban permit complexity</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary">Next crew rotation</span>
              <span className="text-gray-700 font-medium">December 20th</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-primary p-5">
          <h3 className="text-sm font-semibold text-brand-primary mb-3">
            Problem Locations
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-secondary">Dallas Downtown, TX</span>
                <span className="text-red-500 font-medium">2 days behind</span>
              </div>
              <div className="text-xs text-secondary">
                Permit amendment required. Resolution expected Dec 12.
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-secondary">Charlotte Metro, NC</span>
                <span className="text-yellow-500 font-medium">1 day behind</span>
              </div>
              <div className="text-xs text-secondary">
                Material delivery delay. Installation rescheduled for tomorrow.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}