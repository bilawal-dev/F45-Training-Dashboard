'use client';

import dynamic from 'next/dynamic';

// Dynamically import Leaflet only on client side to avoid SSR issues
const MapComponent = dynamic(() => import('./map-client'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-white rounded-xl shadow-sm border border-primary flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  )
});

export default MapComponent; 