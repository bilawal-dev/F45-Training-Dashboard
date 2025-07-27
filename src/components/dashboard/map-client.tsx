'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { REGIONS, POIS } from '@/constants/dashboard-data';
import { POI } from '@/types/dashboard';

// Import leaflet CSS
import 'leaflet/dist/leaflet.css';

interface MapClientProps {
  pois?: POI[];
}

export default function MapClient({ pois }: MapClientProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Use provided POIs or fall back to static POIs
  const mapPOIs = pois && pois.length > 0 ? pois : POIS;

  useEffect(() => {
    // Add delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      if (!mapContainerRef.current || mapRef.current) return;

      try {
        // Double-check the container has dimensions and is in the DOM
        const container = mapContainerRef.current;
        if (!container || 
            container.offsetWidth === 0 || 
            container.offsetHeight === 0 ||
            !document.contains(container)) {
          console.warn('Map container not ready, retrying...');
          return;
        }

        // Initialize map
        const map = L.map(container, {
          zoomControl: false,
          attributionControl: false,
          scrollWheelZoom: false,
          dragging: false,
          touchZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          keyboard: false
        });

        mapRef.current = map;

    // Create custom panes for layering
    map.createPane('markerPane');
    if (map.getPane('markerPane')) {
      map.getPane('markerPane')!.style.zIndex = '650';
    }
    
    map.createPane('patternPane');
    if (map.getPane('patternPane')) {
      map.getPane('patternPane')!.style.zIndex = '600';
    }

    // Helper function to get region info
    const getRegionInfo = (stateName: string) => {
      for (const regionName in REGIONS) {
        if (REGIONS[regionName].states.includes(stateName)) {
          return { name: regionName, status: REGIONS[regionName].status };
        }
      }
      return null;
    };

    // Style functions
    const styleFills = (feature: any) => {
      const regionInfo = getRegionInfo(feature.properties.name);
      let color = 'transparent';
      let fillOpacity = 1;

      if (regionInfo) {
        switch (regionInfo.status) {
          case 'finished':
            color = '#c5ced9';
            fillOpacity = 0.4;
            break;
          case 'current':
            color = '#e15759';
            fillOpacity = 1;
            break;
          case 'to_be_started':
            color = '#c5ced9';
            fillOpacity = 0.4;
            break;
        }
      }
      return { fillColor: color, weight: 0, fillOpacity: fillOpacity };
    };

    const styleBorders = (feature: any) => {
      const regionInfo = getRegionInfo(feature.properties.name);
      const style: any = { fill: false, opacity: 1 };

      if (regionInfo) {
        switch (regionInfo.status) {
          case 'finished':
            Object.assign(style, { color: 'white', dashArray: null, weight: 1 });
            break;
          case 'current':
            Object.assign(style, { color: 'white', dashArray: null, weight: 1.5 });
            break;
          case 'to_be_started':
            Object.assign(style, { color: '#a0a0a0', dashArray: null, weight: 0.8 });
            break;
          default:
            Object.assign(style, { opacity: 0 });
        }
      } else {
        Object.assign(style, { opacity: 0 });
      }
      return style;
    };

    // Load GeoJSON data
    const geoJsonUrl = 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';
    fetch(geoJsonUrl)
      .then(response => response.json())
      .then(data => {
        // Filter out Alaska, Hawaii, Puerto Rico
        const filteredFeatures = data.features.filter((feature: any) => 
          !['Alaska', 'Hawaii', 'Puerto Rico'].includes(feature.properties.name)
        );

        // Layer 1: Color fills
        const fillLayer = L.geoJson({ ...data, features: filteredFeatures }, {
          style: styleFills
        }).addTo(map);

        // Layer 2: State borders
        const borderLayer = L.geoJson({ ...data, features: filteredFeatures }, {
          style: styleBorders
        }).addTo(map);

        // Fit bounds
        map.fitBounds(borderLayer.getBounds(), {
          padding: [0, 0],
          maxZoom: 7
        });

        // Set map as loaded after everything is rendered
        setTimeout(() => setIsMapLoaded(true), 500);
      })
      .catch(error => console.error('Error loading GeoJSON data:', error));

    // Helper function to determine POI region status
    const getPOIRegionStatus = (poi: any) => {
      const text = poi.text.toLowerCase();
      
      // State abbreviation mapping
      const stateMap: { [key: string]: string } = {
        'al': 'Alabama', 'ak': 'Alaska', 'az': 'Arizona', 'ar': 'Arkansas', 'ca': 'California',
        'co': 'Colorado', 'ct': 'Connecticut', 'de': 'Delaware', 'fl': 'Florida', 'ga': 'Georgia',
        'hi': 'Hawaii', 'id': 'Idaho', 'il': 'Illinois', 'in': 'Indiana', 'ia': 'Iowa',
        'ks': 'Kansas', 'ky': 'Kentucky', 'la': 'Louisiana', 'me': 'Maine', 'md': 'Maryland',
        'ma': 'Massachusetts', 'mi': 'Michigan', 'mn': 'Minnesota', 'ms': 'Mississippi', 'mo': 'Missouri',
        'mt': 'Montana', 'ne': 'Nebraska', 'nv': 'Nevada', 'nh': 'New Hampshire', 'nj': 'New Jersey',
        'nm': 'New Mexico', 'ny': 'New York', 'nc': 'North Carolina', 'nd': 'North Dakota', 'oh': 'Ohio',
        'ok': 'Oklahoma', 'or': 'Oregon', 'pa': 'Pennsylvania', 'ri': 'Rhode Island', 'sc': 'South Carolina',
        'sd': 'South Dakota', 'tn': 'Tennessee', 'tx': 'Texas', 'ut': 'Utah', 'vt': 'Vermont',
        'va': 'Virginia', 'wa': 'Washington', 'wv': 'West Virginia', 'wi': 'Wisconsin', 'wy': 'Wyoming'
      };
      
      let state = '';
      
      // Try to match state abbreviations
      for (const [abbr, fullName] of Object.entries(stateMap)) {
        const regex = new RegExp(`\\b${abbr}\\b`, 'i');
        if (regex.test(text)) {
          state = fullName;
          break;
        }
      }
      
      // Find region status based on state
      for (const regionName in REGIONS) {
        if (REGIONS[regionName].states.includes(state)) {
          return REGIONS[regionName].status;
        }
      }
      
      // Coordinate-based fallback
      if (poi.lng < -100) return 'finished';
      else if (poi.lat > 41 || (poi.lat > 39 && poi.lng < -80)) {
        if (poi.lng < -80) return 'finished';
        else return 'to_be_started';
      } else if (poi.lat < 37) return 'current';
      else {
        if (poi.lng > -80) return 'to_be_started';
        else return 'current';
      }
    };

    // Add POI markers
    mapPOIs.forEach(poi => {
      const regionStatus = getPOIRegionStatus(poi);
      
      let markerStyle: any;
      if (regionStatus === 'current') {
        if (poi.isCompleted) {
          markerStyle = {
            radius: 5,
            fillColor: "#3b82f6",
            color: "#ffffff",
            weight: 1,
            opacity: 1,
            fillOpacity: 1,
            pane: 'markerPane'
          };
        } else {
          markerStyle = {
            radius: 5,
            fillColor: "#ffffff",
            color: "#3b82f6", 
            weight: 2,
            opacity: 1,
            fillOpacity: 1,
            pane: 'markerPane'
          };
        }
      } else {
        markerStyle = {
          radius: 4,
          fillColor: "#000000",
          color: "#FFFFFF",
          weight: 1,
          opacity: 0.4,
          fillOpacity: 0.4,
          pane: 'markerPane'
        };
      }
      
      const hoverStyle = {
        fillColor: "#e15759",
        radius: regionStatus === 'current' ? 7 : 6,
        opacity: 1,
        fillOpacity: 1
      };

      const marker = L.circleMarker([poi.lat, poi.lng], markerStyle);
      marker.bindPopup(poi.text.replace('<br>', '<br/>'));
      
      // Use arrow functions to avoid 'this' context issues
      marker.on('mouseover', () => { 
        marker.setStyle(hoverStyle); 
        marker.openPopup(); 
      });
      marker.on('mouseout', () => { 
        marker.setStyle(markerStyle); 
        marker.closePopup(); 
      });
      marker.addTo(map);
    });

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    }, 100); // Small delay to ensure DOM is ready

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="h-96 bg-white rounded-xl shadow-sm border border-primary transition-all duration-300 tile-hover relative overflow-hidden z-10">
      <div 
        ref={mapContainerRef} 
        className="w-full h-full rounded-xl" 
        style={{ minHeight: '384px', minWidth: '100%' }}
      />
      
      {/* Loading overlay */}
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-[1001]">
          <div className="text-gray-500 text-sm">Loading interactive map...</div>
        </div>
      )}
      
      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200 text-xs leading-relaxed min-w-48 z-20">
        <div className="font-semibold text-brand-primary mb-3 text-sm">
          Map Legend
        </div>
        
        <div className="mb-3">
          <div className="font-semibold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">
            Regions
          </div>
          <div className="flex items-center mb-1 gap-2">
            <div className="w-4 h-3 rounded-sm bg-current" style={{ color: '#e15759' }}></div>
            <span className="text-secondary">Current Region</span>
          </div>
          <div className="flex items-center mb-1 gap-2">
            <div className="w-4 h-3 rounded-sm finished-pattern" style={{ backgroundColor: '#c5ced9' }}></div>
            <span className="text-secondary">Completed Regions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 rounded-sm opacity-40" style={{ backgroundColor: '#c5ced9' }}></div>
            <span className="text-secondary">Upcoming Regions</span>
          </div>
        </div>
        
        <div>
          <div className="font-semibold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">
            Locations
          </div>
          <div className="flex items-center mb-1 gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 border border-white"></div>
            <span className="text-secondary">Completed</span>
          </div>
          <div className="flex items-center mb-1 gap-2">
            <div className="w-3 h-3 rounded-full bg-white border-2 border-blue-500"></div>
            <span className="text-secondary">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-black border border-white opacity-40"></div>
            <span className="text-secondary">Other Regions</span>
          </div>
        </div>
      </div>
    </div>
  );
} 