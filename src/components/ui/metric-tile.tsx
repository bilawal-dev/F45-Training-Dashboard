import { MetricCard } from '@/types/dashboard';

interface MetricTileProps {
  metric: MetricCard;
}

export default function MetricTile({ metric }: MetricTileProps) {
  const getStatusBadgeClasses = (type: string) => {
    const baseClasses = "text-xs font-semibold mt-1 px-2 py-1 rounded-xl uppercase tracking-wide";
    
    const statusClasses = {
      'on-track': 'status-on-track',
      'behind': 'status-behind', 
      'ahead': 'status-ahead',
      'good': 'status-good',
      'active': 'status-active',
      'info': 'status-info'
    };
    
    return `${baseClasses} ${statusClasses[type as keyof typeof statusClasses] || ''}`;
  };

  return (
    <div className="h-38 bg-white rounded-xl shadow-sm border border-primary transition-all duration-300 tile-hover flex flex-col items-center justify-center p-5 text-brand-primary">
      <div className="text-3xl font-bold mb-2 leading-none">
        {metric.number}
      </div>
      <div className="text-sm font-medium text-secondary text-center">
        {metric.label}
      </div>
      {metric.status && (
        <div className={getStatusBadgeClasses(metric.status.type)}>
          {metric.status.text}
        </div>
      )}
    </div>
  );
} 