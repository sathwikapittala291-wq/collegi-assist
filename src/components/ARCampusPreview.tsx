import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Scan, Eye, Zap } from "lucide-react";

interface ARLocation {
  id: string;
  name: string;
  type: 'building' | 'facility' | 'dining' | 'library';
  distance: number;
  status: 'open' | 'busy' | 'closed';
  coordinates: { x: number; y: number };
  features: string[];
}

interface ARCampusPreviewProps {
  selectedCategory?: string | null;
  isVisible: boolean;
}

const mockLocations: ARLocation[] = [
  {
    id: '1',
    name: 'Main Library',
    type: 'library',
    distance: 0.2,
    status: 'open',
    coordinates: { x: 40, y: 30 },
    features: ['Study Rooms', '24/7 Access', 'WiFi Zone']
  },
  {
    id: '2',
    name: 'Central Cafeteria',
    type: 'dining',
    distance: 0.3,
    status: 'busy',
    coordinates: { x: 60, y: 50 },
    features: ['Italian', 'Asian', 'Vegan Options']
  },
  {
    id: '3',
    name: 'Science Building',
    type: 'building',
    distance: 0.5,
    status: 'open',
    coordinates: { x: 20, y: 70 },
    features: ['Labs', 'Lecture Halls', 'Computer Lab']
  },
  {
    id: '4',
    name: 'Student Center',
    type: 'facility',
    distance: 0.1,
    status: 'open',
    coordinates: { x: 80, y: 20 },
    features: ['Events', 'Recreation', 'Services']
  }
];

export const ARCampusPreview = ({ selectedCategory, isVisible }: ARCampusPreviewProps) => {
  const [scanAnimation, setScanAnimation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<ARLocation | null>(null);
  const [filteredLocations, setFilteredLocations] = useState<ARLocation[]>(mockLocations);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = mockLocations.filter(location => {
        switch (selectedCategory) {
          case 'library': return location.type === 'library';
          case 'dining': return location.type === 'dining';
          case 'facilities': return location.type === 'facility' || location.type === 'building';
          default: return true;
        }
      });
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(mockLocations);
    }
  }, [selectedCategory]);

  const startScan = () => {
    setScanAnimation(true);
    setTimeout(() => setScanAnimation(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'closed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'library': return '📚';
      case 'dining': return '🍽️';
      case 'building': return '🏢';
      case 'facility': return '🏛️';
      default: return '📍';
    }
  };

  if (!isVisible) return null;

  return (
    <Card className="ar-overlay holographic-card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center neon-glow">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">🔮 AR Campus View</h3>
            <p className="text-sm text-muted-foreground">Augmented Reality Campus Navigation</p>
          </div>
        </div>
        <Button
          onClick={startScan}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          disabled={scanAnimation}
        >
          <Scan className={`w-4 h-4 mr-2 ${scanAnimation ? 'animate-spin' : ''}`} />
          {scanAnimation ? 'Scanning...' : 'AR Scan'}
        </Button>
      </div>

      <div className="relative aspect-video bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-lg overflow-hidden border-2 border-purple-500/30">
        {/* AR Scan Animation */}
        {scanAnimation && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent animate-ping"></div>
        )}
        
        {/* Particle Background for AR effect */}
        <div className="particle-bg absolute inset-0"></div>
        
        {/* AR Grid Overlay */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="url(#gradient)" strokeWidth="1"/>
                <linearGradient id="gradient">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* AR Location Markers */}
        {filteredLocations.map((location, index) => (
          <div
            key={location.id}
            className={`absolute floating-3d cursor-pointer transition-all duration-300 ${
              selectedLocation?.id === location.id ? 'scale-125 z-10' : 'hover:scale-110'
            }`}
            style={{
              left: `${location.coordinates.x}%`,
              top: `${location.coordinates.y}%`,
              transform: 'translate(-50%, -50%)',
              animationDelay: `${index * 0.2}s`
            }}
            onClick={() => setSelectedLocation(location)}
          >
            <div className="relative">
              <div className={`w-8 h-8 rounded-full ${getStatusColor(location.status)} flex items-center justify-center text-white font-bold shadow-lg animate-pulse`}>
                <span className="text-sm">{getTypeIcon(location.type)}</span>
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping"></div>
              
              {/* AR Distance Indicator */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                {location.distance}km
              </div>
            </div>
          </div>
        ))}

        {/* AR Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 border-2 border-purple-500 rounded-full opacity-50">
            <div className="w-full h-full border-2 border-pink-500 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Holographic Corner Indicators */}
        <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-purple-500 opacity-70"></div>
        <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-purple-500 opacity-70"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-purple-500 opacity-70"></div>
        <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-purple-500 opacity-70"></div>
      </div>

      {/* AR Location Details */}
      {selectedLocation && (
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <Navigation className="w-4 h-4 text-purple-500" />
              {selectedLocation.name}
            </h4>
            <Badge variant="outline" className={`${getStatusColor(selectedLocation.status)} text-white border-none`}>
              {selectedLocation.status}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedLocation.features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
                <Zap className="w-3 h-3 mr-1" />
                {feature}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {selectedLocation.distance}km away
            </span>
            <Button variant="outline" size="sm" className="border-purple-500/50 hover:bg-purple-500/20">
              Navigate →
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};