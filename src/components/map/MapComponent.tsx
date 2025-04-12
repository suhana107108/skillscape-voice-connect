
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mockProfiles } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// You should replace this with your own Mapbox token in a production environment
// Ideally, this would be stored in an environment variable
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZWRldiIsImEiOiJjbHdjNnF2YWMwNWQ5MnFxaWc2dW5jbWh5In0.a6C0CONSWVokXUjIJdNlpA';

interface MapComponentProps {
  onSelectProfile: (profile: any) => void;
  filteredProfiles?: any[];
}

const MapComponent: React.FC<MapComponentProps> = ({ onSelectProfile, filteredProfiles = mockProfiles }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([30, 15]);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const mapRefElement = useRef<HTMLDivElement>(null);

  // Function to update location that will be exposed to parent component
  const searchLocation = (query: string) => {
    if (!map.current) return;
    
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}`)
      .then(response => response.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          
          if (map.current) {
            map.current.flyTo({
              center: [lng, lat],
              zoom: 13,
              essential: true
            });
            setCurrentLocation([lng, lat]);
          }
        }
      })
      .catch(error => {
        console.error('Error searching location:', error);
      });
  };

  // Function to create a custom marker element
  const createCustomMarkerElement = (profile: any) => {
    const markerEl = document.createElement('div');
    markerEl.className = 'custom-marker';
    markerEl.style.cursor = 'pointer';
    
    // Create marker container
    markerEl.innerHTML = `
      <div class="relative">
        <div class="w-12 h-12 rounded-full overflow-hidden border-2 ${profile.isAvailable ? 'border-green-500' : 'border-gray-400'} shadow-lg">
          <div class="w-full h-full bg-white flex items-center justify-center overflow-hidden">
            <div class="text-lg font-bold">${profile.name.substring(0, 2)}</div>
          </div>
        </div>
        <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${profile.isAvailable ? 'bg-green-500' : 'bg-gray-400'} border-2 border-white"></div>
      </div>
    `;
    
    markerEl.addEventListener('click', () => {
      onSelectProfile(profile);
    });
    
    return markerEl;
  };

  // Function to add markers to the map
  const addMarkersToMap = () => {
    if (!map.current || !mapLoaded) return;
    
    // Clear existing markers
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};
    
    // Mock coordinates for providers
    // In a real app, these would come from your backend
    const providerLocations = [
      { id: 1, coordinates: [-73.93, 40.73] }, // Brooklyn
      { id: 2, coordinates: [-73.85, 40.75] }, // Queens
      { id: 3, coordinates: [-74.0, 40.72] },  // Manhattan
      { id: 4, coordinates: [-73.89, 40.85] }, // Bronx
      { id: 5, coordinates: [-74.15, 40.58] }, // Staten Island
      { id: 6, coordinates: [-73.95, 40.71] }  // Brooklyn again
    ];
    
    // Add markers for each profile
    filteredProfiles.forEach(profile => {
      // Find matching location for this profile
      const locationData = providerLocations.find(loc => loc.id === profile.id);
      if (!locationData) return;
      
      const el = createCustomMarkerElement(profile);
      
      // Create and add the marker
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
      })
        .setLngLat(locationData.coordinates)
        .addTo(map.current!);
      
      // Store marker reference
      markers.current[profile.id] = marker;
    });
  };

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return;

    // Set mapbox token
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    // Create the map instance
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12', // More Google Maps like
      center: currentLocation,
      zoom: 13
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add geolocate control
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });
    
    map.current.addControl(geolocateControl);

    // Add scale control (Google Maps like)
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // When map loads, add markers and set state
    map.current.on('load', () => {
      setMapLoaded(true);
      
      // Try to get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { longitude, latitude } = position.coords;
            if (map.current) {
              map.current.flyTo({
                center: [longitude, latitude],
                zoom: 13,
                essential: true
              });
              setCurrentLocation([longitude, latitude]);
            }
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      }
    });

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [onSelectProfile]);

  // Add markers when map is loaded or filtered profiles change
  useEffect(() => {
    addMarkersToMap();
  }, [mapLoaded, filteredProfiles]);

  // Expose the searchLocation method to the parent component
  useEffect(() => {
    if (mapRefElement.current) {
      // @ts-ignore - We're using this to expose the method to the parent
      mapRefElement.current.searchLocation = searchLocation;
    }
  }, []);

  return (
    <div className="h-full w-full">
      <div ref={mapContainer} className="h-full w-full" data-map-container="true" />
      {/* We use this element to expose the searchLocation method to the parent component */}
      <div 
        ref={mapRefElement}
        style={{ display: 'none' }} 
        data-map-ref="true"
      />
    </div>
  );
};

export default MapComponent;
