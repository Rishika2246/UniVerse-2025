// components/BusTracking.tsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './BusTracking.css';

// Fix for default icons in React-Leaflet
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Bus {
  id: string;
  routeNumber: string;
  routeName: string;
  driverName: string;
  contact: string;
  capacity: number;
  currentOccupancy: number;
  speed: number;
  nextStop: string;
  etaNextStop: number; // minutes
  position: [number, number];
  status: 'on-time' | 'delayed' | 'early';
  lastUpdated: string;
}

interface BusStop {
  id: string;
  name: string;
  position: [number, number];
  arrivalTimes: string[];
}

const BusTracking: React.FC = () => {
  // Changed to Hyderabad coordinates
  const defaultCenter: [number, number] = [17.3850, 78.4867]; // Hyderabad coordinates
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [activeRoute, setActiveRoute] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Sample bus data with Hyderabad locations
  const [buses, setBuses] = useState<Bus[]>([
    {
      id: 'bus-001',
      routeNumber: 'C-101',
      routeName: 'Main Campus - Kukatpally',
      driverName: 'Rajesh Kumar',
      contact: '+91 98765 43210',
      capacity: 40,
      currentOccupancy: 28,
      speed: 35,
      nextStop: 'HITEC City Metro',
      etaNextStop: 5,
      position: [17.3855, 78.4870], // Near Hyderabad
      status: 'on-time',
      lastUpdated: '10:30 AM'
    },
    {
      id: 'bus-002',
      routeNumber: 'C-102',
      routeName: 'Main Campus - Gachibowli',
      driverName: 'Suresh Patel',
      contact: '+91 98765 43211',
      capacity: 40,
      currentOccupancy: 32,
      speed: 40,
      nextStop: 'Financial District',
      etaNextStop: 8,
      position: [17.4441, 78.3489], // Gachibowli area
      status: 'delayed',
      lastUpdated: '10:32 AM'
    },
    {
      id: 'bus-003',
      routeNumber: 'C-103',
      routeName: 'Campus - Secunderabad',
      driverName: 'Amit Sharma',
      contact: '+91 98765 43212',
      capacity: 35,
      currentOccupancy: 25,
      speed: 30,
      nextStop: 'Paradise Circle',
      etaNextStop: 3,
      position: [17.4399, 78.4983], // Secunderabad area
      status: 'early',
      lastUpdated: '10:28 AM'
    },
    {
      id: 'bus-004',
      routeNumber: 'C-104',
      routeName: 'Campus - Banjara Hills',
      driverName: 'Vikram Singh',
      contact: '+91 98765 43213',
      capacity: 40,
      currentOccupancy: 35,
      speed: 25,
      nextStop: 'Jubilee Hills',
      etaNextStop: 6,
      position: [17.4126, 78.4440], // Banjara Hills area
      status: 'on-time',
      lastUpdated: '10:35 AM'
    },
  ]);

  // Sample bus stops in Hyderabad
  const busStops: BusStop[] = [
    { id: 'stop-1', name: 'Main Campus', position: [17.3850, 78.4867], arrivalTimes: ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'] },
    { id: 'stop-2', name: 'HITEC City Metro', position: [17.4241, 78.3387], arrivalTimes: ['8:15 AM', '10:15 AM', '12:15 PM', '2:15 PM', '4:15 PM'] },
    { id: 'stop-3', name: 'Financial District', position: [17.4326, 78.3789], arrivalTimes: ['8:25 AM', '10:25 AM', '12:25 PM', '2:25 PM', '4:25 PM'] },
    { id: 'stop-4', name: 'Gachibowli Circle', position: [17.4406, 78.3480], arrivalTimes: ['8:35 AM', '10:35 AM', '12:35 PM', '2:35 PM', '4:35 PM'] },
    { id: 'stop-5', name: 'Paradise Circle', position: [17.4434, 78.4991], arrivalTimes: ['8:45 AM', '10:45 AM', '12:45 PM', '2:45 PM', '4:45 PM'] },
    { id: 'stop-6', name: 'Secunderabad Station', position: [17.4398, 78.4983], arrivalTimes: ['8:55 AM', '10:55 AM', '12:55 PM', '2:55 PM', '4:55 PM'] },
    { id: 'stop-7', name: 'Jubilee Hills', position: [17.4331, 78.4090], arrivalTimes: ['9:05 AM', '11:05 AM', '1:05 PM', '3:05 PM', '5:05 PM'] },
    { id: 'stop-8', name: 'Banjara Hills Rd No.1', position: [17.4126, 78.4440], arrivalTimes: ['9:15 AM', '11:15 AM', '1:15 PM', '3:15 PM', '5:15 PM'] },
    { id: 'stop-9', name: 'Kukatpally', position: [17.4849, 78.4138], arrivalTimes: ['9:25 AM', '11:25 AM', '1:25 PM', '3:25 PM', '5:25 PM'] },
  ];

  // Route paths for Hyderabad
  const routePaths: { [key: string]: [number, number][] } = {
    'C-101': [
      [17.3850, 78.4867], // Main Campus
      [17.4241, 78.3387], // HITEC City
      [17.4849, 78.4138], // Kukatpally
    ],
    'C-102': [
      [17.3850, 78.4867], // Main Campus
      [17.4241, 78.3387], // HITEC City
      [17.4326, 78.3789], // Financial District
      [17.4406, 78.3480], // Gachibowli
    ],
    'C-103': [
      [17.3850, 78.4867], // Main Campus
      [17.4434, 78.4991], // Paradise Circle
      [17.4398, 78.4983], // Secunderabad Station
    ],
    'C-104': [
      [17.3850, 78.4867], // Main Campus
      [17.4331, 78.4090], // Jubilee Hills
      [17.4126, 78.4440], // Banjara Hills
    ]
  };

  // Custom bus icon
  const busIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23${selectedBus?.id === 'bus-001' ? '3B82F6' : (selectedBus?.id === 'bus-002' ? '10B981' : (selectedBus?.id === 'bus-003' ? 'EF4444' : 'F59E0B'))}" width="32" height="32">
        <path d="M18 11H6V6H18M16.5 17A1.5 1.5 0 0 1 15 15.5A1.5 1.5 0 0 1 16.5 14A1.5 1.5 0 0 1 18 15.5A1.5 1.5 0 0 1 16.5 17M7.5 17A1.5 1.5 0 0 1 6 15.5A1.5 1.5 0 0 1 7.5 14A1.5 1.5 0 0 1 9 15.5A1.5 1.5 0 0 1 7.5 17M4 16C4 16.88 4.39 17.67 5 18.22V20A1 1 0 0 0 6 21H7A1 1 0 0 0 8 20V19H16V20A1 1 0 0 0 17 21H18A1 1 0 0 0 19 20V18.22C19.61 17.67 20 16.88 20 16V6C20 2.5 16.42 2 12 2C7.58 2 4 2.5 4 6V16Z"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  // Custom bus stop icon
  const stopIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%238B5CF6" width="24" height="24">
        <circle cx="12" cy="12" r="8" stroke="white" stroke-width="2"/>
      </svg>
    `),
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });

  // Simulate real-time updates with Hyderabad area movement
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setBuses(prevBuses => 
        prevBuses.map(bus => {
          // Get route path for this bus
          const routePath = routePaths[bus.routeNumber];
          if (!routePath) return bus;
          
          // Find current segment the bus is on
          let currentSegment = 0;
          for (let i = 0; i < routePath.length - 1; i++) {
            const [lat1, lon1] = routePath[i];
            const [lat2, lon2] = routePath[i + 1];
            const latDiff = lat2 - lat1;
            const lonDiff = lon2 - lon1;
            
            // Simple linear interpolation
            const progress = Math.random() * 0.1; // Move 10% along segment
            const newLat = bus.position[0] + latDiff * progress;
            const newLon = bus.position[1] + lonDiff * progress;
            
            // Keep within Hyderabad bounds
            const boundedLat = Math.min(Math.max(newLat, 17.3), 17.5);
            const boundedLon = Math.min(Math.max(newLon, 78.3), 78.5);
            
            return {
              ...bus,
              position: [boundedLat, boundedLon] as [number, number],
              currentOccupancy: Math.min(
                bus.capacity,
                Math.max(10, bus.currentOccupancy + Math.floor(Math.random() * 6) - 3)
              ),
              etaNextStop: Math.max(1, Math.min(15, bus.etaNextStop - 1)), // Countdown ETA
              speed: 30 + Math.floor(Math.random() * 20),
              lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          }
          return bus;
        })
      );
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'on-time': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      case 'early': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'on-time': return '🟢';
      case 'delayed': return '🔴';
      case 'early': return '🔵';
      default: return '⚪';
    }
  };

  const getRouteColor = (routeNumber: string) => {
    switch(routeNumber) {
      case 'C-101': return '#3B82F6'; // Blue
      case 'C-102': return '#10B981'; // Green
      case 'C-103': return '#EF4444'; // Red
      case 'C-104': return '#F59E0B'; // Amber
      default: return '#6B7280'; // Gray
    }
  };

  const filteredBuses = activeRoute === 'all' 
    ? buses 
    : buses.filter(bus => bus.routeNumber === activeRoute);

  return (
    <div className="bus-tracking-container">
      <div className="bus-header">
        <h1 className="bus-title">🚌 Hyderabad College Bus Tracking</h1>
        <p className="bus-subtitle">Real-time tracking of college shuttle buses in Hyderabad</p>
        <div className="location-tag">
          <span className="location-icon">📍</span>
          <span>Hyderabad, Telangana</span>
        </div>
      </div>

      <div className="bus-content">
        <div className="bus-sidebar">
          <div className="bus-controls">
            <h3>Route Filter</h3>
            <div className="route-filters">
              <button 
                className={`route-filter-btn ${activeRoute === 'all' ? 'active' : ''}`}
                onClick={() => setActiveRoute('all')}
              >
                All Routes
              </button>
              {Array.from(new Set(buses.map(b => b.routeNumber))).map(route => (
                <button
                  key={route}
                  className={`route-filter-btn ${activeRoute === route ? 'active' : ''}`}
                  onClick={() => setActiveRoute(route)}
                  style={{ 
                    borderLeft: `4px solid ${getRouteColor(route)}`,
                    backgroundColor: activeRoute === route ? `${getRouteColor(route)}20` : 'white'
                  }}
                >
                  Route {route}
                </button>
              ))}
            </div>

            <div className="auto-refresh-toggle">
              <label>
                <input 
                  type="checkbox" 
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
                Auto-refresh (10s)
              </label>
            </div>

            <div className="route-legend">
              <h4>Route Colors:</h4>
              <div className="legend-items">
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#3B82F6' }}></span>
                  <span>C-101 (Main - Kukatpally)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#10B981' }}></span>
                  <span>C-102 (Main - Gachibowli)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#EF4444' }}></span>
                  <span>C-103 (Campus - Secunderabad)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#F59E0B' }}></span>
                  <span>C-104 (Campus - Banjara Hills)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bus-list">
            <h3>Active Buses ({filteredBuses.length})</h3>
            {filteredBuses.map(bus => (
              <div 
                key={bus.id}
                className={`bus-card ${selectedBus?.id === bus.id ? 'selected' : ''}`}
                onClick={() => setSelectedBus(bus)}
                style={{ 
                  borderLeft: `4px solid ${getRouteColor(bus.routeNumber)}`,
                  borderColor: selectedBus?.id === bus.id ? getRouteColor(bus.routeNumber) : '#e5e7eb'
                }}
              >
                <div className="bus-card-header">
                  <span className="bus-route-number">{bus.routeNumber}</span>
                  <span className={`bus-status ${getStatusColor(bus.status)}`}>
                    {getStatusIcon(bus.status)} {bus.status.toUpperCase()}
                  </span>
                </div>
                <div className="bus-card-body">
                  <p className="bus-route-name">{bus.routeName}</p>
                  <div className="bus-info-grid">
                    <div className="bus-info-item">
                      <span className="bus-info-label">Driver:</span>
                      <span className="bus-info-value">{bus.driverName}</span>
                    </div>
                    <div className="bus-info-item">
                      <span className="bus-info-label">Next Stop:</span>
                      <span className="bus-info-value">{bus.nextStop}</span>
                    </div>
                    <div className="bus-info-item">
                      <span className="bus-info-label">ETA:</span>
                      <span className="bus-info-value">{bus.etaNextStop} min</span>
                    </div>
                    <div className="bus-info-item">
                      <span className="bus-info-label">Occupancy:</span>
                      <span className="bus-info-value">
                        {bus.currentOccupancy}/{bus.capacity}
                        <div className="occupancy-bar">
                          <div 
                            className="occupancy-fill"
                            style={{ 
                              width: `${(bus.currentOccupancy / bus.capacity) * 100}%`,
                              backgroundColor: bus.currentOccupancy > bus.capacity * 0.8 ? '#EF4444' : 
                                             bus.currentOccupancy > bus.capacity * 0.5 ? '#F59E0B' : '#10B981'
                            }}
                          />
                        </div>
                      </span>
                    </div>
                  </div>
                  <p className="bus-updated">Updated: {bus.lastUpdated}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bus-stops-list">
            <h3>Hyderabad Bus Stops</h3>
            {busStops.map(stop => (
              <div key={stop.id} className="bus-stop-item">
                <span className="stop-icon">📍</span>
                <div className="stop-info">
                  <span className="stop-name">{stop.name}</span>
                  <span className="stop-times">
                    Next: {stop.arrivalTimes[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bus-map-container">
          <div className="map-wrapper">
            <MapContainer 
              center={defaultCenter} 
              zoom={13} 
              className="bus-map"
              scrollWheelZoom={true}
              minZoom={12}
              maxZoom={18}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Draw route paths */}
              {Object.entries(routePaths).map(([route, path]) => {
                if (activeRoute === 'all' || activeRoute === route) {
                  return (
                    <Polyline
                      key={route}
                      pathOptions={{
                        color: getRouteColor(route),
                        weight: 5,
                        opacity: 0.7,
                        dashArray: activeRoute === 'all' ? '5, 10' : undefined
                      }}
                      positions={path}
                    />
                  );
                }
                return null;
              })}

              {/* Bus stops */}
              {busStops.map(stop => (
                <Marker
                  key={stop.id}
                  position={stop.position}
                  icon={stopIcon}
                >
                  <Popup>
                    <div className="bus-stop-popup">
                      <h4>📍 {stop.name}</h4>
                      <p><strong>Location:</strong> Hyderabad</p>
                      <p><strong>Arrival Times:</strong></p>
                      <ul>
                        {stop.arrivalTimes.map((time, idx) => (
                          <li key={idx}>{time}</li>
                        ))}
                      </ul>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Buses */}
              {filteredBuses.map(bus => (
                <Marker
                  key={bus.id}
                  position={bus.position}
                  icon={new Icon({
                    ...busIcon.options,
                    iconUrl: busIcon.options.iconUrl?.replace(
                      /%23[a-fA-F0-9]{6}/,
                      getRouteColor(bus.routeNumber).replace('#', '%23')
                    )
                  })}
                  eventHandlers={{
                    click: () => setSelectedBus(bus),
                  }}
                >
                  <Popup>
                    <div className="bus-popup">
                      <div className="popup-header">
                        <h3>🚌 Bus {bus.routeNumber}</h3>
                        <span className={`popup-status ${getStatusColor(bus.status)}`}>
                          {bus.status.toUpperCase()}
                        </span>
                      </div>
                      <p><strong>Route:</strong> {bus.routeName}</p>
                      <p><strong>Driver:</strong> {bus.driverName}</p>
                      <p><strong>Contact:</strong> {bus.contact}</p>
                      <p><strong>Next Stop:</strong> {bus.nextStop} (ETA: {bus.etaNextStop} min)</p>
                      <p><strong>Occupancy:</strong> {bus.currentOccupancy}/{bus.capacity}</p>
                      <p><strong>Speed:</strong> {bus.speed} km/h</p>
                      <p><strong>Location:</strong> Hyderabad</p>
                      <p className="popup-updated">Updated: {bus.lastUpdated}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {selectedBus && (
            <div className="selected-bus-details">
              <div className="details-header">
                <h3>🚌 Bus {selectedBus.routeNumber} Details</h3>
                <span className="location-badge">
                  <span className="badge-icon">📍</span>
                  Hyderabad
                </span>
              </div>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Route Number:</span>
                  <span className="detail-value" style={{ color: getRouteColor(selectedBus.routeNumber) }}>
                    {selectedBus.routeNumber}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Route Name:</span>
                  <span className="detail-value">{selectedBus.routeName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Driver:</span>
                  <span className="detail-value">{selectedBus.driverName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Contact:</span>
                  <span className="detail-value">{selectedBus.contact}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className={`detail-value ${getStatusColor(selectedBus.status)}`}>
                    {getStatusIcon(selectedBus.status)} {selectedBus.status}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Next Stop:</span>
                  <span className="detail-value">{selectedBus.nextStop}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">ETA:</span>
                  <span className="detail-value">{selectedBus.etaNextStop} minutes</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Occupancy:</span>
                  <span className="detail-value">
                    {selectedBus.currentOccupancy}/{selectedBus.capacity} seats
                    <div className="mini-occupancy-bar">
                      <div 
                        className="mini-occupancy-fill"
                        style={{ 
                          width: `${(selectedBus.currentOccupancy / selectedBus.capacity) * 100}%`,
                          backgroundColor: selectedBus.currentOccupancy > selectedBus.capacity * 0.8 ? '#EF4444' : 
                                         selectedBus.currentOccupancy > selectedBus.capacity * 0.5 ? '#F59E0B' : '#10B981'
                        }}
                      />
                    </div>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Speed:</span>
                  <span className="detail-value">{selectedBus.speed} km/h</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Updated:</span>
                  <span className="detail-value">{selectedBus.lastUpdated}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { BusTracking };
export default BusTracking;