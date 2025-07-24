import React from 'react';

interface ProgressTileProps {
  title: string;
  phases: string[];
  currentPhaseIndex: number;
  completionPercentage: number;
  summary?: string;
}

export default function ProgressTile({
  title,
  phases,
  currentPhaseIndex,
  completionPercentage,
  summary
}: ProgressTileProps) {
  const progressPercent = (completionPercentage / 100) * 100;
  
  const getPhaseClasses = (index: number) => {
    const baseClasses = "flex-1 h-2 rounded-sm";
    
    if (index < currentPhaseIndex) {
      return `${baseClasses} bg-green-500`; // completed
    } else if (index === currentPhaseIndex) {
      return `${baseClasses} progress-step-current`; // current
    } else {
      return `${baseClasses} bg-gray-200`; // upcoming
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col justify-between">
      {title && (
        <div className="text-base font-semibold text-brand-primary mb-4 text-center">
          {title}
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-3">
        {phases.map((_, index) => (
          <div key={index} className={getPhaseClasses(index)} />
        ))}
      </div>
      
      <div className="flex text-xs text-secondary font-medium">
        {phases.map((phase, index) => (
          <span key={index} className="flex-1 text-center">
            {phase}
          </span>
        ))}
      </div>
      
      <div className="text-center mt-2 text-xs text-brand-primary font-semibold">
        Month 10 of 18 • 497/800 locations completed
      </div>
    </div>
  );
} 