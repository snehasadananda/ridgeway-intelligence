import { useEffect, useRef, useState } from 'react';
import type { Investigation, SiteLayout } from '../../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface SiteMapProps {
  investigation: Investigation;
  siteLayout: SiteLayout;
}

export function SiteMap({ investigation, siteLayout }: SiteMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView(
      [siteLayout.center.lat, siteLayout.center.lng],
      16
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [siteLayout]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Clear existing layers (except tile layer)
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) return;
      map.removeLayer(layer);
    });

    // Draw zones
    siteLayout.zones.forEach((zone) => {
      const color = zone.accessLevel === 'restricted' ? '#ef4444' :
                    zone.accessLevel === 'high_security' ? '#dc2626' :
                    '#3b82f6';

      const polygon = L.polygon(
        zone.polygon.map(p => [p.lat, p.lng]),
        {
          color: color,
          fillColor: color,
          fillOpacity: 0.1,
          weight: 2
        }
      ).addTo(map);

      polygon.bindTooltip(zone.name, {
        permanent: false,
        direction: 'center'
      });
    });

    // Draw assets
    siteLayout.assets.forEach((asset) => {
      const assetIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="asset-marker ${asset.type}">
          ${asset.type === 'access_point' ? '🚪' : 
            asset.type === 'camera' ? '📹' :
            asset.type === 'sensor' ? '📡' : '🏢'}
        </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      L.marker([asset.coordinates.lat, asset.coordinates.lng], { 
        icon: assetIcon 
      }).addTo(map)
        .bindPopup(`<strong>${asset.name}</strong><br/>Type: ${asset.type}`);
    });

    // Draw event markers
    investigation.events.forEach((event) => {
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

      marker.on('click', () => {
        setSelectedEvent(event.id);
      });
    });

    // Draw vehicle paths if available
    const vehicleToolCalls = investigation.toolCalls.filter(
      tc => tc.tool === 'get_vehicle_history' && tc.status === 'success'
    );

    vehicleToolCalls.forEach(tc => {
      if (tc.output?.vehicle_paths) {
        Object.values(tc.output.vehicle_paths).forEach((path: any) => {
          if (Array.isArray(path) && path.length > 1) {
            const pathCoords = path.map((p: any) => [p.location.lat, p.location.lng]);
            L.polyline(pathCoords, {
              color: '#8b5cf6',
              weight: 3,
              opacity: 0.7,
              dashArray: '10, 10'
            }).addTo(map)
              .bindTooltip('Vehicle Path');
          }
        });
      }
    });

  }, [investigation, siteLayout]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            🗺️ Site Map - Ridgeway Industrial Site
          </h3>
          
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Public Zone</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Restricted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span>Vehicle Path</span>
            </div>
          </div>
        </div>

        <div 
          ref={mapContainerRef} 
          className="h-[600px] rounded-lg border border-gray-200"
        />
      </div>

      {selectedEvent && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Selected Event</h4>
          <p className="text-sm text-blue-800">
            Event ID: {selectedEvent}
          </p>
          <button
            onClick={() => setSelectedEvent(null)}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800"
          >
            Clear selection
          </button>
        </div>
      )}

      <style>{`
        .event-marker {
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          width: 40px;
          height: 40px;
        }
        
        .asset-marker {
          font-size: 20px;
          background: white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #666;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }

        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}