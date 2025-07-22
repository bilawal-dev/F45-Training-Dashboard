'use client';

import { ViewType } from '@/types/dashboard';
import Image from 'next/image';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

interface SidebarItem {
  id: ViewType;
  label: string;
  icon: string;
  status: 'completed' | 'current' | 'upcoming' | 'test';
  clickable: boolean;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: 'home',
    status: 'completed',
    clickable: true
  },  
  {
    id: 'northeast',
    label: 'Northeast',
    icon: 'compass',
    status: 'upcoming',
    clickable: false
  },
  {
    id: 'southeast',
    label: 'Southeast',
    icon: 'compass',
    status: 'current',
    clickable: true
  },
  {
    id: 'midwest',
    label: 'Midwest',
    icon: 'compass',
    status: 'completed',
    clickable: false
  },
  {
    id: 'west',
    label: 'West',
    icon: 'compass',
    status: 'completed',
    clickable: false
  }
];

const getItemClasses = (item: SidebarItem, isActive: boolean) => {
  const baseClasses = "flex items-center justify-between px-6 py-3 text-left w-full transition-colors duration-200";
  
  if (item.status === 'test') {
    return `${baseClasses} ${
      isActive 
        ? 'bg-blue-100 text-blue-800 border-r-4 border-blue-600' 
        : 'text-blue-600 hover:bg-blue-50'
    }`;
  }
  
  if (!item.clickable) {
    return `${baseClasses} text-gray-400 cursor-not-allowed`;
  }

  if (isActive) {
    return `${baseClasses} bg-blue-100 text-black border-r-4 border-blue-600`;
  }

  switch (item.status) {
    case 'completed':
      return `${baseClasses} text-brand-primary hover:bg-blue-100`;
    case 'current':
      return `${baseClasses} text-brand-primary hover:bg-blue-100 font-medium`;
    case 'upcoming':
      return `${baseClasses} text-gray-500 hover:bg-gray-50`;
    default:
      return `${baseClasses} text-gray-700 hover:bg-gray-50`;
  }
};

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
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
        {sidebarItems.map((item) => {
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