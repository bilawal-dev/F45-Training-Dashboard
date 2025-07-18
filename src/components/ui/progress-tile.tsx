interface ProgressTileProps {
  title: string;
  phases: string[];
  currentPhaseIndex: number;
  summary: string;
}

export default function ProgressTile({ 
  title, 
  phases, 
  currentPhaseIndex, 
  summary 
}: ProgressTileProps) {
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
    <div className="h-38 bg-white rounded-xl shadow-sm border border-primary transition-all duration-300 tile-hover p-6 flex flex-col justify-center">
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
      
      {summary && (
        <div className="text-center mt-2 text-xs text-brand-primary font-semibold">
          {summary}
        </div>
      )}
    </div>
  );
} 