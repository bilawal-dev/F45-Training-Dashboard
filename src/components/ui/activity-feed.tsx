import { ActivityItem } from '@/types/dashboard';

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
}

export default function ActivityFeed({ activities, title = "Recent Activity" }: ActivityFeedProps) {
  const getDotColor = (type: string) => {
    const colors = {
      'success': 'bg-green-500',
      'warning': 'bg-yellow-500',
      'info': 'bg-blue-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-primary p-6">
      <h3 className="text-base font-semibold text-brand-primary mb-4">
        {title}
      </h3>
      
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getDotColor(activity.type)}`} />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-700 mb-0.5">
                {activity.text}
              </div>
              <div className="text-xs text-muted">
                {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}