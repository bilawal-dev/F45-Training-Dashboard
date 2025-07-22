'use client';

import DashboardContainer from '@/components/dashboard/dashboard-container';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardContainer />
    </Suspense>
  );
}
