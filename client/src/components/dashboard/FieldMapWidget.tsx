import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FieldMapWidget() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const { user } = useAuth();

  const { data: fields } = useQuery({
    queryKey: ["/api/fields"],
    enabled: !!user,
  });

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize Leaflet map
    const L = (window as any).L;
    if (!L) {
      // Load Leaflet if not available
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initializeMap;
      document.head.appendChild(script);
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    } else {
      initializeMap();
    }

    function initializeMap() {
      if (!mapRef.current) return;
      
      const L = (window as any).L;
      const map = L.map(mapRef.current).setView([-1.2921, 36.8219], 10); // Nairobi coordinates
      mapInstanceRef.current = map;
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      
      // Add field markers when fields data is available
      if (fields && fields.length > 0) {
        fields.forEach((field: any) => {
          const ndvi = Math.random() * 0.4 + 0.5; // Mock NDVI value
          const health = ndvi > 0.7 ? 'healthy' : ndvi > 0.5 ? 'warning' : 'critical';
          const color = health === 'healthy' ? '#228B22' : 
                       health === 'warning' ? '#FFD700' : '#FF6347';
          
          const marker = L.circleMarker([Number(field.latitude), Number(field.longitude)], {
            color: color,
            fillColor: color,
            fillOpacity: 0.7,
            radius: 10
          }).addTo(map);
          
          marker.bindPopup(`
            <strong>${field.name}</strong><br>
            Size: ${field.size} acres<br>
            Crop: ${field.cropType}<br>
            NDVI: ${ndvi.toFixed(3)}<br>
            Status: ${health}
          `);
        });
        
        // Fit map to show all fields
        const group = new L.featureGroup(map._layers);
        if (Object.keys(group._layers).length > 0) {
          map.fitBounds(group.getBounds().pad(0.1));
        }
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [fields]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Field Overview Map</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="default" 
              size="sm"
              data-testid="button-ndvi-view"
            >
              NDVI
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              data-testid="button-evi-view"
            >
              EVI
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              data-testid="button-sarvi-view"
            >
              SARVI
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="map-container rounded-lg h-80 relative overflow-hidden">
          <div ref={mapRef} className="w-full h-full" data-testid="map-container"></div>
          
          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-card rounded-lg p-3 shadow-lg border border-border">
            <h4 className="text-sm font-semibold mb-2">NDVI Scale</h4>
            <div className="space-y-1">
              <div className="flex items-center text-xs">
                <div className="w-4 h-3 bg-red-500 rounded mr-2"></div>
                <span>Poor (0.0-0.3)</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-4 h-3 bg-yellow-500 rounded mr-2"></div>
                <span>Fair (0.3-0.6)</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-4 h-3 bg-green-500 rounded mr-2"></div>
                <span>Good (0.6-1.0)</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
