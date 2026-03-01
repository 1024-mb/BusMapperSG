import { useEffect, useState } from 'react';

interface Station {
  id: string;               // StopSequence as string
  code: string;             // BusStopCode
  name: string;             // Description
  distance: number;
  position: { x: number; y: number };
  direction: number;
  lat: number;
  lng: number;
}

interface BusRouteApiResponse {
  value: Array<{
    ServiceNo: string;
    Direction: number;
    StopSequence: number;
    BusStopCode: string;
    Distance: number;
    // other fields omitted
  }>;
}

interface BusStopApiResponse {
  value: Array<{
    BusStopCode: string;
    RoadName: string;
    Description: string;
    Latitude: number;
    Longitude: number;
  }>;
}
function getPositionsOnPath(pathD: string, count: number): { x: number; y: number }[] {
  if (typeof window === 'undefined') return []; // Safety for SSR

  const svgNS = "http://www.w3.org/2000/svg";
  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("d", pathD);

  const length = path.getTotalLength();
  const positions = [];

  if (count === 1) {
    const point = path.getPointAtLength(0);
    return [{ x: point.x, y: point.y }];
  }

  for (let i = 0; i < count; i++) {
    // Distribute points from 0 to total length
    // If count is 10, intervals are at 0/9, 1/9 ... 9/9
    const distance = (i / (count - 1)) * length;
    const point = path.getPointAtLength(distance);
    positions.push({ x: point.x, y: point.y });
  }
  return positions;
}
export async function getBusRoute(serviceNo: string): Promise<Station[]> {
  // Fetch both datasets
  const [busesRes, stopsRes] = await Promise.all([
    fetch(`/api/busroutes/?service=${serviceNo}`),
    fetch('/api/busstations/')
  ]);

  const busesData: BusRouteApiResponse = await busesRes.json();
  const stopsData: BusStopApiResponse = await stopsRes.json();

  // Build a map of bus stops by BusStopCode
  type StopInfo = {
    Description: string;
    RoadName: string;
    Latitude: number;
    Longitude: number;
  };

  const stopMap: Record<string, StopInfo> = {};
  for (const stop of stopsData.value) {
    stopMap[stop.BusStopCode] = {
      Description: stop.Description,
      RoadName: stop.RoadName,
      Latitude: stop.Latitude,
      Longitude: stop.Longitude,
    };
  }
  const routeBuses = busesData.value
  .filter(bus => bus.ServiceNo === serviceNo && bus.Direction === 1)
  .sort((a, b) => a.StopSequence - b.StopSequence);

  const pathD = "M 165,20 L 165,380 C 165,400 175,410 195,410 L 215,410 C 235,410 245,400 245,380 L 245,20";
  const smoothPositions = getPositionsOnPath(pathD, routeBuses.length);

  return routeBuses.map((bus, i) => {
    const stop = stopMap[bus.BusStopCode];
    return {
      id: String(bus.StopSequence),
      code: bus.BusStopCode,
      name: stop?.Description || "Unknown",
      distance: i === 0 ? 0 : bus.Distance - routeBuses[i - 1].Distance,
      position: smoothPositions[i] || { x: 0, y: 0 },
      direction: bus.Direction,
      lat: stop?.Latitude || 0,
      lng: stop?.Longitude || 0
    };
  });
}

interface BusMapProps {
  busNumber: string;
}

export function BusMap({ busNumber }: BusMapProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(false);
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);

  useEffect(() => {
    async function loadRoute() {
      setLoading(true);
      try {
        const data = await getBusRoute(busNumber);
        setStations(data);
      } catch (error) {
        console.error('Failed to load bus route:', error);
      } finally {
        setLoading(false);
      }
    }
    loadRoute();
  }, [busNumber]);

  const handleStationClick = (station: Station) => {
    (window as any).trigger_click?.(station.lat, station.lng);
    setSelectedStation(station);

  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen" style={{margin: '30px'}}> Loading route...</div>;
  }


    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-green-50 to-green-100" style={{ backgroundColor: '#E6F5EC', padding: '7.5px', height: '800' }}>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2" style={{marginLeft: '40px'}}>
            Bus {busNumber} - Route
          </h1>
        </div>

        <div className="flex gap-8 w-full max-w-7xl">
          {/* Map area */}
          <div className="flex-1 bg-white rounded-2xl shadow-2xl p-8">
            <svg
              viewBox={`25 00 400 550`}
              className="w-full h-auto"
              style={{ height: '500px' }}
            >
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00B159" />
                  <stop offset="100%" stopColor="#009245" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background route line */}
              <path
                d="M 165,20 L 165,380 C 165,400 175,410 195,410 L 215,410 C 235,410 245,400 245,380 L 245,20"
                stroke="url(#lineGradient)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Stations */}
              {stations.map((station) => {
                const isSelected = selectedStation?.id === station.id;
                const isHovered = hoveredStation === station.id;

                const isLeft = station.position.x < 205;
                const curveDepth = Math.max(0, station.position.y - 380);
                const progress = Math.min(curveDepth / 30, 1);
                const rotation = isLeft ? progress * -90 : progress * 90;
                const textAnchor = isLeft ? "end" : "start";
                const dx = isLeft ? -13 : 12;

                let dy = 0;
                let scaleFactor = 1;

                if (stations.length > 35) scaleFactor = 0.75;
                if (stations.length > 40) scaleFactor = 0.7;
                if (stations.length > 50) scaleFactor = 0.65;

                // Station colors
                const circleColor = isSelected
                  ? "#00A651"
                  : isHovered
                  ? "#66CC99"
                  : "#00B159";

                return (
                  <g key={station.code} className="cursor-pointer">
                    <circle
                      cx={station.position.x}
                      cy={station.position.y}
                      r={
                        isSelected
                          ? 14 * scaleFactor
                          : isHovered
                          ? 11 * scaleFactor
                          : 8 * scaleFactor
                      }
                      fill={circleColor}
                      stroke="white"
                      strokeWidth={isSelected ? 4 * scaleFactor : 3 * scaleFactor}
                      className="cursor-pointer transition-all duration-200"
                      onClick={() => handleStationClick(station)}
                      onMouseEnter={() => setHoveredStation(station.id)}
                      onMouseLeave={() => setHoveredStation(null)}
                    />
                    {isSelected && (
                      <circle
                        cx={station.position.x}
                        cy={station.position.y}
                        r={5}
                        fill="white"
                        pointerEvents="none"
                      />
                    )}
                    <text
                      x={
                        station.position.x >= 245
                          ? station.position.x + 3
                          : station.position.x <= 165
                          ? station.position.x - 3
                          : station.position.x
                      }
                      y={station.position.y}
                      transform={`rotate(${rotation}, ${station.position.x}, ${station.position.y})`}
                      dx={dx}
                      dy={dy}
                      textAnchor={textAnchor}
                      fontSize="10"
                      fontWeight="normal"
                      fill="black"
                      className="pointer-events-none select-none transition-all duration-200"
                    >
                      {station.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Info panel */}
          {selectedStation && (
            <div className="w-64 bg-white rounded-2xl shadow-2xl p-6">
              <h3 className="text-xl font-bold text-[#00A651] mb-2">
                {selectedStation.name}
              </h3>
              <p className="text-gray-600 mb-1">Code: {selectedStation.code}</p>
              <p className="text-gray-600 mb-1">
                Distance from previous: {selectedStation.distance.toFixed(2)} km
              </p>
              <p className="text-gray-600">Stop #{selectedStation.id}</p>
            </div>
          )}
        </div>
      </div>
    );

}