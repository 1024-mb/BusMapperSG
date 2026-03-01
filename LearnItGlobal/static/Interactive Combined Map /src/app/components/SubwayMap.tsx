import { useState } from 'react';
import { Card } from './ui/card';

interface Station {
  id: number;
  name: string;
  position: { x: number; y: number };
  connections: string[];
  lat: number,
  lng: number
}


const stations: Station[] = [
    //50,20
  { id: 1, name: 'Harbourfront', position: { x: 105, y: 20 }, connections: ['CCL'], lat: 0, lng: 0},
  { id: 2, name: 'Outram Park', position: { x: 105, y: 75.71429 }, connections: ['EWL', 'TEL', 'EW'], lat: 0, lng: 0},
  { id: 3, name: 'Chinatown', position: { x: 105, y: 131.42857 }, connections: ['DTL'], lat: 0, lng: 0},
  { id: 4, name: 'Clarke Quay', position: { x: 105, y: 187.1429 }, connections: [], lat: 0, lng: 0},
  { id: 5, name: 'Dhoby Ghaut', position: { x: 105, y: 242.857 }, connections: ['NE', 'CCL'], lat: 0, lng: 0},
  { id: 6, name: 'Little India', position: { x: 105, y: 298.5714 }, connections: ['DTL'], lat: 0, lng: 0},
  { id: 7, name: 'Farrer Park', position: { x: 105, y: 354.2857 }, connections: [], lat: 0, lng: 0},
  { id: 8, name: 'Boon Keng', position: { x: 105, y: 410 }, connections: [], lat: 0, lng: 0},
  { id: 9, name: 'Potong Pasir', position: { x: 147.5, y: 440 }, connections: [], lat: 0, lng: 0},
  { id: 10, name: 'Woodleigh', position: { x: 190, y: 410 }, connections: [], lat: 1.3393800000, lng: 103.8707500000},
  { id: 11, name: 'Serangoon', position: { x: 190, y: 354.2857 }, connections: ['CCL'], lat: 1.3496750000, lng: 103.8736490000},
  { id: 12, name: 'Kovan', position: { x: 190, y: 298.5714 }, connections: [], lat: 1.3601800000, lng: 103.8852400000},
  { id: 13, name: 'Hougang', position: { x: 190, y: 242.8571 }, connections: [], lat: 1.3709500000, lng: 103.8924900000},
  { id: 14, name: 'Buangkok', position: { x: 190, y: 187.1429 }, connections: [], lat: 1.3824100000, lng: 103.8929900000},
  { id: 15, name: 'Sengkang', position: { x: 190, y: 131.42857 }, connections: ['STC'], lat: 1.3912800000, lng: 103.8952100000},
  { id: 16, name: 'Punggol', position: { x: 190, y: 75.71429 }, connections: ['PTC'], lat: 1.4053460000, lng: 103.9024970000},
  { id: 17, name: 'Punggol Coast', position: { x: 190, y: 20 }, connections: [], lat: 1.4149500000, lng: 103.9101400000},

];


export function SubwayMap() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [hoveredStation, setHoveredStation] = useState<number | null>(null);

  const getLinePath = () => {
    const points = stations.map(s => `${s.position.x},${s.position.y}`);
    return `M ${points.join(' L ')}`;
  };
  const handleStationClick = (station: Station) => {
    (window as any).trigger_click?.(station.lat, station.lng);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-purple-100" style={{ backgroundColor: '#f3e8f7', height: '650px'}}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black mb-2" style={{marginLeft: '50px'}}>North-East Line</h1>
      </div>

      <div className="flex gap-8 w-full max-w-7xl" >
        {/* Subway Map */}
        <div className="flex-1 bg-white rounded-2xl shadow-2xl p-8">
          <svg
            viewBox={"-10 0 400 550"}
            className="w-full h-auto"
            style={{ height: '600px' }}
          >
            {/* Define gradient for the line */}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#9900aa" />
                <stop offset="50%" stopColor="#9900aa" />
                <stop offset="100%" stopColor="#9900aa" />
              </linearGradient>

              {/* Glow filter for selected station */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Metro Line */}
            <path
              d="M 105,20
              L 105,400
              C 105,400 105.5,405 106,410
              C 106,410 147.5,475 189,410
              C 189,410 189.5,405 190,400
              L 190,400
              L 190,20"
              stroke="#9900aa"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Stations */}
            {stations.map((station) => {
              const isSelected = selectedStation?.id === station.id;
              const isHovered = hoveredStation === station.id;
              // Center of the new path is (105 + 190) / 2 = 147.5
              const isLeft = station.position.x < 147.5;

              // The curve begins at y=400 and reaches its lowest control point at y=475 (depth of 75)
              const curveStart = 400;
              const curveDepth = Math.max(0, station.position.y - curveStart);
              const progress = Math.min(curveDepth / 75, 1);

              let rotation  = isLeft ? progress * -90 : progress * 90;

              if(station.name == "Potong Pasir") {
                rotation = 90;
              }
              const textAnchor = isLeft ? "end" : "start";


              // Maintain spacing from the dot

              return (
                <g key={station.id}>
                  {/* Station circle */}
                  <circle
                    cx={station.position.x}
                    cy={station.position.y}
                    r={isSelected ? 14 : isHovered ? 11 : 8}
                    fill="#9900aa"
                    stroke="white"
                    strokeWidth={isSelected ? 4 : 3}
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => handleStationClick(station)}
                    onMouseEnter={() => setHoveredStation(station.id)}
                    onMouseLeave={() => setHoveredStation(null)}
                    filter={isSelected ? 'url(#glow)' : undefined}
                  />

                  {/* Inner circle for selected station */}
                  {isSelected && (
                    <circle
                      cx={station.position.x}
                      cy={station.position.y}
                      r={5}
                      fill="white"
                      pointerEvents="none"
                    />
                  )}

                  {/* Station name */}

                  <text
                    x={station.name == "Potong Pasir" ? 200 : station.position.x == 175 ? station.position.x + 100 : station.position.x <= 170 ? station.position.x - 50 : station.position.x + 15}
                    y={station.name == "Potong Pasir" ? 445 : station.position.y + 5}
                    transform={`rotate(${rotation}, ${station.position.x}, ${station.position.y})`}
                    textAnchor={station.position.x < 50 ? "end" : station.position.x > 150 ? "start" : "middle"}
                    fontSize="11"
                    fontWeight={isSelected ? 'bold' : 'normal'}

                    className="pointer-events-none select-none fill-black"
                  >
                    {station.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Legend */}

    </div>
  );
}

