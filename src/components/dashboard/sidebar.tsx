'use client';

import { Calendar, CheckCircle, Circle } from 'lucide-react';
import Image from 'next/image';
import { ViewType } from '@/types/dashboard';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const sidebarItems = [
    { 
      id: 'overview' as ViewType, 
      label: 'Overview', 
      status: 'active',
      clickable: true 
    },
    { 
      id: 'northeast' as ViewType, 
      label: 'Northeast', 
      status: 'upcoming',
      clickable: false 
    },
    { 
      id: 'southeast' as ViewType, 
      label: 'Southeast', 
      status: 'current',
      clickable: true 
    },
    { 
      id: 'midwest' as ViewType, 
      label: 'Midwest', 
      status: 'completed',
      clickable: false 
    },
    { 
      id: 'west' as ViewType, 
      label: 'West', 
      status: 'completed',
      clickable: false 
    }
  ];

  const getStatusIcon = (status: string, isActive: boolean) => {
    if (status === 'upcoming') {
      return (
        <Calendar className="w-7 h-7 text-gray-400" />
      );
    }
    
    if (status === 'current') {
      return (
        <div className="relative">
          <Circle className="w-7 h-7 text-blue-500" strokeWidth={4} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      );
    }
    
    if (status === 'completed') {
      return (
        <CheckCircle className="w-7 h-7 text-green-500 fill-current" />
      );
    }
    
    return null;
  };

  const getItemClasses = (item: any, isActive: boolean) => {
    const baseClasses = "flex items-center justify-between w-full px-6 py-5 text-left transition-all duration-200 border-r-4 mb-1 rounded-l-lg sidebar-item-hover";
    
    if (!item.clickable) {
      const statusClasses = {
        'completed': 'text-secondary bg-gray-50 border-transparent cursor-default opacity-75',
        'upcoming': 'text-muted cursor-default opacity-60',
        'current': 'text-secondary bg-red-50 border-red-300 cursor-default'
      };
      return `${baseClasses} ${statusClasses[item.status as keyof typeof statusClasses] || ''}`;
    }
    
    if (isActive) {
      return `${baseClasses} text-brand-primary font-semibold bg-purple-50 border-transparent shadow-lg`;
    }
    
    return `${baseClasses} text-muted border-transparent hover:text-secondary hover:bg-purple-25`;
  };

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
      
      <div className="space-y-1">
        {sidebarItems.map((item) => {
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => item.clickable && onViewChange(item.id)}
              className={getItemClasses(item, isActive)}
              disabled={!item.clickable}
            >
              <span className="text-sm font-medium">
                {item.label}
              </span>
              {getStatusIcon(item.status, isActive)}
            </button>
          );
        })}
      </div>
    </nav>
  );
} 