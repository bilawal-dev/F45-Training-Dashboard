import { ActivityItem } from '@/types/dashboard';

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
}

export default function ActivityFeed({ activities, title = "Recent Activity" }: ActivityFeedProps) {
  const getDotColor = (id: string) => {
    const hash = id.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const colors = ['bg-green-500', 'bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500'];
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-primary p-6">
      <h3 className="text-base font-semibold text-brand-primary mb-4">
        {title}
      </h3>
      
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getDotColor(activity.id)}`} />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-700 mb-0.5">
                <span className="font-semibold">{activity.user}</span>
                {' '}{activity.action}{' '}
                <span className="font-semibold">{activity.target}</span>
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