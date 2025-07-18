import MapComponent from '@/components/dashboard/map-component';
import MetricTile from '@/components/ui/metric-tile';
import ProgressTile from '@/components/ui/progress-tile';
import RegionStatusTile from '@/components/ui/region-status-tile';
import DataTable from '@/components/ui/data-table';
import { OVERVIEW_METRICS, REGION_STATUS_DATA } from '@/constants/dashboard-data';

export default function OverviewView() {
  const overviewTableHeaders = [
    'Region',
    'Timeline',
    'Locations',
    'Completion %',
    'Schedule Status',
    'Current Phase',
    'Issues'
  ];

  const overviewTableRows = [
    [
      <strong key="west">West</strong>,
      'Months 4-6',
      '210/210',
      <span key="west-pct" className="text-green-600 font-semibold">100%</span>,
      <span key="west-status" className="text-green-600">On Time</span>,
      'Completed',
      '0'
    ],
    [
      <strong key="midwest">Midwest</strong>,
      'Months 7-9',
      '185/185',
      <span key="midwest-pct" className="text-green-600 font-semibold">100%</span>,
      <span key="midwest-status" className="text-blue-600">3 Days Early</span>,
      'Completed',
      '0'
    ],
    [
      <strong key="southeast">Southeast</strong>,
      'Months 10-12',
      '102/210',
      <span key="southeast-pct" className="text-yellow-600 font-semibold">49%</span>,
      <span key="southeast-status" className="text-blue-600">1 Week Ahead</span>,
      'Installation',
      '2'
    ],
    [
      <strong key="northeast">Northeast</strong>,
      'Months 13-15',
      '0/195',
      <span key="northeast-pct" className="text-gray-400 font-semibold">0%</span>,
      <span key="northeast-status" className="text-gray-400">Scheduled</span>,
      'Planning',
      '0'
    ]
  ];

  const projectPhases = ['Planning', 'West', 'Midwest', 'Southeast', 'Northeast'];
  const currentPhaseIndex = 3; // Southeast

  return (
    <div className="space-y-6">
      {/* Top Section - Hero Map and Region Status */}
      <div className="flex gap-6 mobile-flex-col">
        <div className="flex-[3]">
          <MapComponent />
        </div>
        <div className="flex-1">
          <RegionStatusTile regions={REGION_STATUS_DATA} />
        </div>
      </div>

      {/* Second Row - Overview Metrics and Progress */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {OVERVIEW_METRICS.map((metric, index) => (
          <MetricTile key={index} metric={metric} />
        ))}
        <div className="md:col-span-2">
          <ProgressTile
            title="Project Timeline Progress"
            phases={projectPhases}
            currentPhaseIndex={currentPhaseIndex}
            summary="Month 10 of 18 • 497/800 locations completed"
          />
        </div>
      </div>

      {/* Third Row - Regional Overview Table */}
      <DataTable
        title="Regional Performance Overview"
        headers={overviewTableHeaders}
        rows={overviewTableRows}
      />
    </div>
  );
} 