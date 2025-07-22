"use client";

/**
 * useDashboardData Hook
 * 
 * This hook manages the dashboard data state, URL parameters, and data fetching
 * for the F45 Dashboard with ClickUp integration.
 */

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { regionalDataAggregator } from '@/services/regionalDataAggregator';
import { OVERVIEW_METRICS, REGION_STATUS_DATA, SOUTHEAST_STATES, ACTIVITY_ITEMS } from '@/constants/dashboard-data';

export interface TableRow {
  region: string;
  timeline: string;
  locations: string;
  completion: {
    percentage: number;
    color: 'green' | 'yellow' | 'red' | 'gray';
  };
  scheduleStatus: {
    text: string;
    color: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  };
  currentPhase: string;
  issues: string;
}

export interface DashboardData {
  isStatic: boolean;
  isLoading: boolean;
  error: string | null;
  folderName?: string;
  data: {
    metrics: any[];
    regionStatus: any[];
    tableData: TableRow[];
    mapPOIs: any[];
    activityFeed: any[];
    overallHealth: number;
    scheduleStatus: string;
    daysAheadBehind: number;
    overallCompletion: number;
    projectTimeline: {
      phases: string[];
      currentPhaseIndex: number;
    };
  };
}

export function useDashboardData() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    isStatic: true,
    isLoading: false,
    error: null,
    data: {
      metrics: OVERVIEW_METRICS,
      regionStatus: REGION_STATUS_DATA,
      tableData: getStaticTableData(),
      mapPOIs: [],
      activityFeed: ACTIVITY_ITEMS,
      overallHealth: 87,
      scheduleStatus: 'Ahead of Schedule',
      daysAheadBehind: 7,
      overallCompletion: 62,
      projectTimeline: {
        phases: ['Planning', 'West', 'Midwest', 'Southeast', 'Northeast'],
        currentPhaseIndex: 3
      }
    }
  });

  const folderId = searchParams.get('folderId');

  useEffect(() => {
    if (folderId) {
      loadDynamicData(folderId);
    } else {
      // Reset to static data when no folderId
      setDashboardData(prev => ({
        ...prev,
        isStatic: true,
        isLoading: false,
        error: null,
        folderName: undefined
      }));
    }
  }, [folderId]);

  const loadDynamicData = async (folderId: string) => {
    setDashboardData(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      isStatic: false
    }));

    try {
      console.log(`🔄 [useDashboardData] Loading data for folder: ${folderId}`);
      const clickUpData = await regionalDataAggregator.getDashboardDataByFolder(folderId);

      // Transform ClickUp data to dashboard format
      const transformedData = transformClickUpDataToDashboard(clickUpData);

      setDashboardData(prev => ({
        ...prev,
        isLoading: false,
        error: null,
        isStatic: false,
        folderName: clickUpData.folderName,
        data: transformedData
      }));

      console.log(`✅ [useDashboardData] Successfully loaded data for ${clickUpData.folderName}`);

    } catch (error) {
      console.error('❌ [useDashboardData] Failed to load dynamic data:', error);
      setDashboardData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load data',
        isStatic: false
      }));
    }
  };

  const setSelectedFolder = (folderId: string | null, folderName?: string) => {
    if (folderId) {
      console.log(`🎯 [useDashboardData] Setting folder: ${folderName} (${folderId})`);
      router.push(`/?folderId=${folderId}`);
    } else {
      console.log(`🏠 [useDashboardData] Returning to static view`);
      router.push('/');
    }
  };

  const refreshData = () => {
    if (folderId) {
      regionalDataAggregator.clearCache(folderId);
      loadDynamicData(folderId);
    }
  };

  return {
    ...dashboardData,
    currentFolderId: folderId,
    setSelectedFolder,
    refreshData
  };
}

/**
 * Transform ClickUp data to dashboard format
 */
function transformClickUpDataToDashboard(clickUpData: any) {
  // Transform metrics
  const metrics = [
    {
      number: `${clickUpData.overview.projectHealthScore}%`,
      label: 'Project Health Score',
      status: { 
        type: clickUpData.overview.projectHealthScore >= 80 ? 'good' : clickUpData.overview.projectHealthScore >= 60 ? 'warning' : 'bad', 
        text: clickUpData.overview.projectHealthScore >= 80 ? 'Good' : clickUpData.overview.projectHealthScore >= 60 ? 'Fair' : 'Poor'
      }
    },
    {
      number: clickUpData.overview.daysAheadBehind > 0 ? `${clickUpData.overview.daysAheadBehind} days` : `${Math.abs(clickUpData.overview.daysAheadBehind)} days`,
      label: clickUpData.overview.daysAheadBehind > 0 ? 'Ahead of Schedule' : 'Behind Schedule',
      status: { 
        type: clickUpData.overview.daysAheadBehind > 0 ? 'ahead' : 'behind', 
        text: clickUpData.overview.scheduleStatus 
      }
    }
  ];

  // Transform region status
  const regionStatus = clickUpData.regions.map((region: any) => ({
    name: region.region,
    completedStores: region.completedLocations,
    totalStores: region.totalLocations,
    status: region.totalLocations === 0 ? 'planned' : 
            region.completionPercentage >= 90 ? 'completed' :
            region.completionPercentage > 0 ? 'in-progress' : 'planned'
  }));

  // Transform table data (return structured data instead of JSX)
  const tableData: TableRow[] = clickUpData.regions.map((region: any) => ({
    region: region.region,
    timeline: region.totalLocations > 0 ? 'Active' : 'Scheduled',
    locations: region.totalLocations > 0 ? `${region.completedLocations}/${region.totalLocations}` : '0/0',
    completion: {
      percentage: region.completionPercentage,
      color: region.totalLocations === 0 ? 'gray' as const :
             region.completionPercentage >= 80 ? 'green' as const :
             region.completionPercentage >= 50 ? 'yellow' as const : 'red' as const
    },
    scheduleStatus: {
      text: region.totalLocations > 0 ? region.scheduleStatus : 'Scheduled',
      color: region.totalLocations === 0 ? 'gray' as const :
             region.scheduleStatus === 'Ahead of Schedule' ? 'blue' as const :
             region.scheduleStatus === 'On Track' ? 'green' as const :
             region.scheduleStatus === 'Minor Delays' ? 'yellow' as const : 'red' as const
    },
    currentPhase: region.totalLocations > 0 ? region.currentPhase : 'Planning',
    issues: region.totalLocations > 0 ? region.issuesCount.toString() : '0'
  }));

  return {
    metrics,
    regionStatus,
    tableData,
    mapPOIs: clickUpData.mapPOIs,
    activityFeed: clickUpData.activityFeed,
    overallHealth: clickUpData.overview.projectHealthScore,
    scheduleStatus: clickUpData.overview.scheduleStatus,
    daysAheadBehind: clickUpData.overview.daysAheadBehind,
    overallCompletion: clickUpData.overview.overallCompletion,
    projectTimeline: clickUpData.overview.projectTimeline
  };
}

/**
 * Get static table data for default view
 */
function getStaticTableData(): TableRow[] {
  return [
    {
      region: 'West',
      timeline: 'Months 4-6',
      locations: '210/210',
      completion: { percentage: 100, color: 'green' },
      scheduleStatus: { text: 'On Time', color: 'green' },
      currentPhase: 'Completed',
      issues: '0'
    },
    {
      region: 'Midwest',
      timeline: 'Months 7-9',
      locations: '185/185',
      completion: { percentage: 100, color: 'green' },
      scheduleStatus: { text: '3 Days Early', color: 'blue' },
      currentPhase: 'Completed',
      issues: '0'
    },
    {
      region: 'Southeast',
      timeline: 'Months 10-12',
      locations: '102/210',
      completion: { percentage: 49, color: 'yellow' },
      scheduleStatus: { text: '1 Week Ahead', color: 'blue' },
      currentPhase: 'Installation',
      issues: '2'
    },
    {
      region: 'Northeast',
      timeline: 'Months 13-15',
      locations: '0/195',
      completion: { percentage: 0, color: 'gray' },
      scheduleStatus: { text: 'Scheduled', color: 'gray' },
      currentPhase: 'Planning',
      issues: '0'
    }
  ];
} 