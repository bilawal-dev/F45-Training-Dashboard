'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import OverviewView from '@/components/views/overview-view';
import RegionView from '@/components/views/region-view';
import AIChatWidget from '@/components/dashboard/ai-chat-widget';
import { ViewType } from '@/types/dashboard';
import { useDashboardData } from '@/hooks/useDashboardData';
import { REGIONAL_DATA } from '@/constants/regional-data';

export default function DashboardContainer() {
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const dashboardData = useDashboardData();

  const renderCurrentView = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewView dashboardData={dashboardData} />;
      case 'northeast':
      case 'southeast':
      case 'midwest':
      case 'west':
        const regionData = REGIONAL_DATA[activeView];
        if (!regionData || regionData.stateList.length === 0) {
            return <OverviewView dashboardData={dashboardData} />;
        }
        return <RegionView regionData={regionData} />;
      default:
        return <OverviewView dashboardData={dashboardData} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        isStatic={dashboardData.isStatic}
        regionStatus={dashboardData.data.regionStatus}
      />

      <main className="flex-1 p-8 mobile-p-4">
        {renderCurrentView()}
      </main>

      <AIChatWidget />
    </div>
  );
} 