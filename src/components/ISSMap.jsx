import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom ISS icon
const issIcon = new L.Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/International_Space_Station.svg/200px-International_Space_Station.svg.png',
  iconSize: [50, 32],
  iconAnchor: [25, 16],
  popupAnchor: [0, -16],
});

// Component to update map view when ISS moves
function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView([position.latitude, position.longitude], map.getZoom(), {
        animate: true,
        duration: 1,
      });
    }
  }, [position, map]);
  return null;
}

export default function ISSMap({ currentPosition, positions }) {
  if (!currentPosition) {
    return (
      <div className="map-placeholder">
        <div className="spinner" />
        <p>Loading ISS position...</p>
        <style>{`
          .map-placeholder {
            width: 100%;
            height: 400px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            background: var(--bg-card);
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
          }
        `}</style>
      </div>
    );
  }

  const pathCoords = positions.map((p) => [p.latitude, p.longitude]);

  return (
    <div className="iss-map-wrapper">
      <MapContainer
        center={[currentPosition.latitude, currentPosition.longitude]}
        zoom={3}
        style={{ height: '400px', width: '100%' }}
        scrollWheelZoom={true}
        id="iss-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapUpdater position={currentPosition} />

        <Marker
          position={[currentPosition.latitude, currentPosition.longitude]}
          icon={issIcon}
        >
          <Popup>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem' }}>
              <strong>🛰️ ISS Position</strong><br />
              Lat: {currentPosition.latitude.toFixed(4)}°<br />
              Lon: {currentPosition.longitude.toFixed(4)}°<br />
              <small>Updated: {new Date(currentPosition.timestamp * 1000).toLocaleTimeString()}</small>
            </div>
          </Popup>
        </Marker>

        {pathCoords.length > 1 && (
          <Polyline
            positions={pathCoords}
            pathOptions={{
              color: '#6c63ff',
              weight: 2.5,
              opacity: 0.7,
              dashArray: '8, 6',
            }}
          />
        )}
      </MapContainer>

      <style>{`
        .iss-map-wrapper {
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-color);
        }
        .iss-map-wrapper .leaflet-container {
          border-radius: 0;
          border: none;
        }
      `}</style>
    </div>
  );
}
