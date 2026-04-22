import L from 'leaflet';
import { useEffect } from 'react';
import type { SiteEvent } from '../../types';

interface EventMarkersProps {
  map: L.Map | null;
  events: SiteEvent[];
  onEventClick?: (eventId: string) => void;
}

export function EventMarkers({ map, events, onEventClick }: EventMarkersProps) {
  useEffect(() => {
    if (!map) return;

    const markers: L.Marker[] = [];

    events.forEach((event) => {
      const eventColor = event.severity === 'critical' ? '#dc2626' :
                        event.severity === 'high' ? '#f97316' :
                        event.severity === 'medium' ? '#eab308' :
                        '#6b7280';

      const eventIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="event-marker" style="background-color: ${eventColor}">
          <span class="event-icon">${
            event.type === 'fence_alert' ? '🚧' :
            event.type === 'badge_failure' ? '🔒' :
            event.type === 'vehicle_movement' ? '🚗' :
            event.type === 'drone_patrol' ? '🚁' : '📍'
          }</span>
        </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker(
        [event.location.coordinates.lat, event.location.coordinates.lng],
        { icon: eventIcon }
      ).addTo(map);

      marker.bindPopup(`
        <div class="p-2">
          <strong>${event.description}</strong><br/>
          <small>${event.location.name}</small><br/>
          <small>Time: ${new Date(event.timestamp).toLocaleTimeString()}</small><br/>
          <span class="inline-block px-2 py-1 text-xs font-semibold rounded mt-1" 
                style="background-color: ${eventColor}; color: white;">
            ${event.severity}
          </span>
        </div>
      `);

      if (onEventClick) {
        marker.on('click', () => onEventClick(event.id));
      }

      markers.push(marker);
    });

    return () => {
      markers.forEach(marker => map.removeLayer(marker));
    };
  }, [map, events, onEventClick]);

  return null;
}