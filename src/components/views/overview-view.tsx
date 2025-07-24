'use client';

import React from 'react';
import MapComponent from '@/components/dashboard/map-component';
import MetricTile from '@/components/ui/metric-tile';
import ProgressTile from '@/components/ui/progress-tile';
import RegionStatusTile from '@/components/ui/region-status-tile';
import DataTable from '@/components/ui/data-table';
import ProjectSelectorHeader from '../dashboard/project-selector-header';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { DashboardData } from '@/hooks/useDashboardData';

interface OverviewViewProps {
  dashboardData: DashboardData & {
    setSelectedFolder: (folderId: string | null, folderName?: string) => void;
    refreshData: () => void;
  };
}

export default function OverviewView({ dashboardData }: OverviewViewProps) {
  const {
    isStatic,
    isLoading,
    error,
    folderName,
    data,
    setSelectedFolder,
    refreshData
  } = dashboardData;

  console.log('Project Data', data);

  const overviewTableHeaders = [
    'Region',
    'Timeline',
    'Locations',
    'Completion %',
    'Schedule Status',
    'Current Phase',
    'Issues'
  ];

  // Transform structured table data to JSX format for DataTable
  const tableRows = data.tableData.map((row) => [
    <strong key={row.region}>{row.region}</strong>,
    row.timeline,
    row.locations,
    <span 
      key={`${row.region}-pct`}
      className={`font-semibold ${
        row.completion.color === 'green' ? 'text-green-600' :
        row.completion.color === 'yellow' ? 'text-yellow-600' :
        row.completion.color === 'red' ? 'text-red-600' :
        'text-gray-400'
      }`}
    >
      {row.completion.percentage}%
    </span>,
    <span 
      key={`${row.region}-status`}
      className={
        row.scheduleStatus.color === 'blue' ? 'text-blue-600' :
        row.scheduleStatus.color === 'green' ? 'text-green-600' :
        row.scheduleStatus.color === 'yellow' ? 'text-yellow-600' :
        row.scheduleStatus.color === 'red' ? 'text-red-600' :
        'text-gray-400'
      }
    >
      {row.scheduleStatus.text}
    </span>,
    row.currentPhase,
    row.issues
  ]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <ProjectSelectorHeader
          onFolderSelect={setSelectedFolder}
          selectedFolderName={folderName}
        />
        
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Loading Dashboard Data
            </h3>
            <p className="text-gray-600">
              Fetching and processing data from ClickUp...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <ProjectSelectorHeader
          onFolderSelect={setSelectedFolder}
          selectedFolderName={folderName}
        />
        
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to Load Data
            </h3>
            <p className="text-gray-600 mb-4">
              {error}
            </p>
            <button
              onClick={refreshData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProjectSelectorHeader
        onFolderSelect={setSelectedFolder}
        selectedFolderName={folderName}
      />

      {/* Data Source Indicator */}
      {!isStatic && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-800 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Live ClickUp Data</span>
              <span className="text-green-600">
                {folderName && `• ${folderName}`}
              </span>
            </div>
            <button
              onClick={refreshData}
              className="text-green-700 hover:text-green-900 text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* Top Section - Hero Map and Region Status */}
      <div className="flex gap-6 mobile-flex-col">
        <div className="flex-[3]">
          <MapComponent pois={data.mapPOIs} />
        </div>
        <div className="flex-1">
          <RegionStatusTile regions={data.regionStatus} />
        </div>
      </div>

      {/* Second Row - Overview Metrics and Progress */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {data.metrics.map((metric, index) => (
          <MetricTile key={index} metric={metric} />
        ))}
        <div className="md:col-span-2">
          <ProgressTile
            title="Project Timeline Progress"
            phases={data.projectTimeline.phases}
            currentPhaseIndex={data.projectTimeline.currentPhaseIndex}
            completionPercentage={data.overallCompletion}
            summary={
              isStatic 
                ? "Month 10 of 18 • 497/800 locations completed"
                : `${folderName || 'Selected Brand'} • ${data.overallHealth}% health score`
            }
          />
        </div>
      </div>

      {/* Third Row - Regional Overview Table */}
      <DataTable
        title="Regional Performance Overview"
        headers={overviewTableHeaders}
        rows={tableRows}
      />
    </div>
  );
} 