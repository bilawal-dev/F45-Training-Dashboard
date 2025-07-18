import { RegionStatus } from '@/types/dashboard';

interface RegionStatusTileProps {
  regions: RegionStatus[];
}

export default function RegionStatusTile({ regions }: RegionStatusTileProps) {
  const getStatusIcon = (status: string) => {
    if (status === 'planned') {
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-gray-400">
          <rect x="3" y="4" width="22" height="20" rx="5" fill="#f6f7fa" stroke="#e5e7eb" strokeWidth="1.5"/>
          <rect x="8" y="2.5" width="2" height="3" rx="1" fill="#e5e7eb"/>
          <rect x="18" y="2.5" width="2" height="3" rx="1" fill="#e5e7eb"/>
          <line x1="3" y1="9" x2="25" y2="9" stroke="#e5e7eb" strokeWidth="1"/>
          <rect x="7.5" y="11" width="2" height="2" rx="1" fill="#d1d5db"/>
          <rect x="12" y="11" width="2" height="2" rx="1" fill="#d1d5db"/>
          <rect x="16.5" y="11" width="2" height="2" rx="1" fill="#d1d5db"/>
          <rect x="7.5" y="14.5" width="2" height="2" rx="1" fill="#d1d5db"/>
          <rect x="12" y="14.5" width="2" height="2" rx="1" fill="#d1d5db"/>
          <rect x="16.5" y="14.5" width="2" height="2" rx="1" fill="#d1d5db"/>
        </svg>
      );
    }
    
    if (status === 'in-progress') {
      return (
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" stroke="#3b82f6" strokeWidth="4" opacity="0.2"/>
          <path d="M16 2a14 14 0 1 1-9.9 24" stroke="#3b82f6" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M12 17l3 3 6-6" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    
    if (status === 'completed') {
      return (
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#22c55e"/>
          <path d="M10 17l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    
    return null;
  };

  return (
    <div className="h-96 bg-white rounded-xl shadow-sm border border-primary transition-all duration-300 tile-hover flex flex-col gap-3 items-stretch justify-center p-5">
      {regions.map((region) => (
        <div
          key={region.name}
          className="flex flex-col gap-1.5 p-3 bg-gray-50 bg-opacity-60 rounded-lg border border-gray-200 border-opacity-80 transition-all duration-200 hover:bg-gray-50 hover:bg-opacity-90 hover:border-brand-secondary hover:transform hover:-translate-y-0.5 hover:shadow-sm"
        >
          <div className="flex justify-between items-center w-full">
            <span className="text-brand-primary text-sm font-semibold">
              {region.name}
            </span>
            <span className="flex items-center">
              {getStatusIcon(region.status)}
            </span>
          </div>
          <div className="text-secondary text-xs font-medium text-left ml-0.5">
            {region.completedStores}/{region.totalStores} stores
          </div>
        </div>
      ))}
    </div>
  );
} 