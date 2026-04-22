import type { SiteEvent } from '../../types';

interface EventTimelineProps {
  events: SiteEvent[];
}

const severityColors = {
  low: 'bg-gray-100 text-gray-700 border-gray-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  critical: 'bg-red-100 text-red-800 border-red-300',
};

const eventIcons: Record<string, string> = {
  fence_alert: '🚧',
  badge_failure: '🔒',
  vehicle_movement: '🚗',
  drone_patrol: '🚁',
  camera_offline: '📹',
};

export function EventTimeline({ events }: EventTimelineProps) {
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Overnight Events ({events.length})
      </h3>
      
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {sortedEvents.map((event) => (
          <div
            key={event.id}
            className={`border-l-4 ${
              event.severity === 'high' || event.severity === 'critical' 
                ? 'border-red-500' 
                : event.severity === 'medium'
                ? 'border-yellow-500'
                : 'border-gray-300'
            } pl-4 py-2`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2">
                <span className="text-xl">{eventIcons[event.type] || '📍'}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {event.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    📍 {event.location.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    🕐 {new Date(event.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                severityColors[event.severity]
              }`}>
                {event.severity}
              </span>
            </div>

            {event.metadata && Object.keys(event.metadata).length > 0 && (
              <div className="mt-2 text-xs text-gray-600 bg-gray-50 rounded p-2">
                {Object.entries(event.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-500">{key}:</span>
                    <span className="font-mono">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}