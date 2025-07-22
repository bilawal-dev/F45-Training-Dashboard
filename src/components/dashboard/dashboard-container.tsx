'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import OverviewView from '@/components/views/overview-view';
import SoutheastView from '@/components/views/southeast-view';
import AIChatWidget from '@/components/dashboard/ai-chat-widget';
import { ViewType } from '@/types/dashboard';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function DashboardContainer() {
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const dashboardData = useDashboardData();

  const renderCurrentView = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewView dashboardData={dashboardData} />;
      case 'southeast':
        return <SoutheastView />;
      default:
        return <OverviewView dashboardData={dashboardData} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <main className="flex-1 p-8 mobile-p-4">
        {renderCurrentView()}
      </main>

      <AIChatWidget />
    </div>
  );
} 