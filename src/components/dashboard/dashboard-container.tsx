'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import OverviewView from '@/components/views/overview-view';
import SoutheastView from '@/components/views/southeast-view';
import AIChatWidget from '@/components/dashboard/ai-chat-widget';
import { ViewType } from '@/types/dashboard';

export default function DashboardContainer() {
  const [activeView, setActiveView] = useState<ViewType>('overview');

  const renderCurrentView = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewView />;
      case 'southeast':
        return <SoutheastView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
      />

      {/* Main Content */}
      <main className="flex-1 p-8 mobile-p-4">
        {renderCurrentView()}
      </main>

      {/* AI Chat Widget */}
      <AIChatWidget />
    </div>
  );
} 