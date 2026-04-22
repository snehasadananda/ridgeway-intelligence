import { useState, useEffect } from 'react';
import L from 'leaflet';
import type { DronePatrol } from '../../types';

interface DroneSimulatorProps {
  map: L.Map | null;
  mission: DronePatrol | null;
  onComplete?: () => void;
}

export function DroneSimulator({ map, mission, onComplete }: DroneSimulatorProps) {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [droneMarker, setDroneMarker] = useState<L.Marker | null>(null);

  useEffect(() => {
    if (!map || !mission || mission.status !== 'in_progress') return;

    // Create drone icon
    const droneIcon = L.divIcon({
      className: 'drone-marker',
      html: `<div style="font-size: 30px; animation: float 2s ease-in-out infinite;">🚁</div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    // Draw route
    const route = L.polyline(
      mission.route.map(coord => [coord.lat, coord.lng]),
      {
        color: '#8b5cf6',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10'
      }
    ).addTo(map);

    // Create drone marker
    const marker = L.marker(
      [mission.route[0].lat, mission.route[0].lng],
      { icon: droneIcon }
    ).addTo(map);
    setDroneMarker(marker);

    return () => {
      if (marker) map.removeLayer(marker);
      if (route) map.removeLayer(route);
    };
  }, [map, mission]);

  useEffect(() => {
    if (!mission || !droneMarker || mission.status !== 'in_progress') return;

    const interval = setInterval(() => {
      setCurrentPosition(prev => {
        const next = prev + 1;
        
        if (next >= mission.route.length) {
          clearInterval(interval);
          if (onComplete) onComplete();
          return prev;
        }

        const nextPos = mission.route[next];
        droneMarker.setLatLng([nextPos.lat, nextPos.lng]);
        
        return next;
      });
    }, 1000); // Move every second

    return () => clearInterval(interval);
  }, [mission, droneMarker, onComplete]);

  if (!mission) return null;

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000] max-w-xs">
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-2xl">🚁</span>
        <div>
          <p className="font-semibold text-sm">Drone Patrol</p>
          <p className="text-xs text-gray-500">{mission.targetZone}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Status:</span>
          <span className={`font-medium ${
            mission.status === 'completed' ? 'text-green-600' :
            mission.status === 'in_progress' ? 'text-blue-600' :
            'text-gray-600'
          }`}>
            {mission.status.replace(/_/g, ' ').toUpperCase()}
          </span>
        </div>

        {mission.status === 'in_progress' && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Progress:</span>
            <span className="font-medium">
              {Math.round((currentPosition / mission.route.length) * 100)}%
            </span>
          </div>
        )}

        {mission.status === 'completed' && mission.findings && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">Findings:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              {mission.findings.map((finding, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-1">•</span>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
