'use client';

import { ViewType } from '@/types/dashboard';
import Image from 'next/image';
import { REGIONAL_DATA } from '@/constants/regional-data';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  isStatic: boolean;
  regionStatus: { name: string; totalStores: number }[];
}

interface SidebarItem {
  id: ViewType;
  label: string;
  icon: string;
  status: 'completed' | 'current' | 'upcoming' | 'test';
  clickable: boolean;
}

const sidebarItems: Omit<SidebarItem, 'clickable'>[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: 'home',
    status: 'completed',
  },  
  {
    id: 'northeast',
    label: 'Northeast',
    icon: 'compass',
    status: 'upcoming',
  },
  {
    id: 'southeast',
    label: 'Southeast',
    icon: 'compass',
    status: 'current',
  },
  {
    id: 'midwest',
    label: 'Midwest',
    icon: 'compass',
    status: 'completed',
  },
  {
    id: 'west',
    label: 'West',
    icon: 'compass',
    status: 'completed',
  }
];

const getItemClasses = (item: SidebarItem, isActive: boolean) => {
  const baseClasses = "flex items-center justify-between px-6 py-3 text-left w-full transition-colors duration-200";
  
  if (!item.clickable) {
    return `${baseClasses} text-gray-400 cursor-not-allowed`;
  }

  if (isActive) {
    return `${baseClasses} bg-blue-100 text-black border-r-4 border-blue-600`;
  }
  
  return `${baseClasses} text-black hover:bg-blue-100`;
};

export default function Sidebar({ activeView, onViewChange, isStatic, regionStatus }: SidebarProps) {
    const processedSidebarItems: SidebarItem[] = sidebarItems.map(item => {
        let isClickable;
        if (isStatic) {
            isClickable = item.id === 'overview' || (REGIONAL_DATA[item.id] && REGIONAL_DATA[item.id].stateList.length > 0);
        } else {
            const region = regionStatus.find(r => r.name.toLowerCase() === item.id);
            isClickable = item.id === 'overview' || (region ? region.totalStores > 0 : false);
        }
        return {
            ...item,
            clickable: isClickable
        };
    });
  return (
    <nav className="w-60 bg-white border-r border-primary">
      <div className="p-6 border-b-2 border-brand-secondary mb-6">
        <div className="h-12 w-auto mx-auto">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/F45-logo.svg/1200px-F45-logo.svg.png"
            alt="F45"
            width={150}
            height={48}
            className="h-full w-auto object-contain"
          />
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        {processedSidebarItems.map((item) => {
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => item.clickable && onViewChange(item.id)}
              className={getItemClasses(item, isActive)}
              disabled={!item.clickable}
            >
              <span className="text-base font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
} 