
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockProfiles } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

// You should replace this with your own Mapbox token in a production environment
// Ideally, this would be stored in an environment variable
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZWRldiIsImEiOiJjbHdjNnF2YWMwNWQ5MnFxaWc2dW5jbWh5In0.a6C0CONSWVokXUjIJdNlpA';

interface MapComponentProps {
  onSelectProfile: (profile: any) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onSelectProfile }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { toast } = useToast();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([30, 15]);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return;

    // Set mapbox token
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    // Create the map instance
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
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
            toast({
              title: "Couldn't access your location",
              description: "Using default location instead.",
              variant: "destructive"
            });
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
  }, [toast]);

  // Add markers when map is loaded or when location changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear any existing markers
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};

    // Generate positions around the current location
    mockProfiles.forEach((profile, index) => {
      // Create random positions around current location
      const lng = currentLocation[0] + (Math.random() - 0.5) * 0.05;
      const lat = currentLocation[1] + (Math.random() - 0.5) * 0.05;
      
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.cursor = 'pointer';
      
      // Render marker content
      const markerContent = document.createElement('div');
      markerContent.className = 'relative';
      markerContent.innerHTML = `
        <div class="${profile.isAvailable ? 'animate-pulse' : ''}">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="${profile.isAvailable ? 'rgba(14, 165, 233, 0.2)' : 'transparent'}" stroke="rgb(14, 165, 233)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
        <div class="text-xs bg-white px-2 py-1 rounded shadow-sm whitespace-nowrap absolute left-1/2 transform -translate-x-1/2 -bottom-6">
          ${profile.skills[0]?.name || "Service"}
        </div>
      `;
      el.appendChild(markerContent);
      
      // Add click event
      el.addEventListener('click', () => {
        onSelectProfile(profile);
      });
      
      // Create and add marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(map.current!);
      
      markers.current[profile.id] = marker;
    });
  }, [mapLoaded, currentLocation, onSelectProfile]);

  // Function to update location
  const updateLocation = (lng: number, lat: number) => {
    if (map.current) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 13,
        essential: true
      });
      setCurrentLocation([lng, lat]);
    }
  };

  // Helper function to search for a location
  const searchLocation = (query: string) => {
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}`)
      .then(response => response.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          updateLocation(lng, lat);
          toast({
            title: "Location updated",
            description: `Moved to ${data.features[0].place_name}`,
          });
        } else {
          toast({
            title: "Location not found",
            description: "Could not find the specified location",
            variant: "destructive"
          });
        }
      })
      .catch(error => {
        console.error('Error searching location:', error);
        toast({
          title: "Search error",
          description: "There was an error searching for the location",
          variant: "destructive"
        });
      });
  };

  return {
    mapContainer,
    searchLocation
  };
};

export default MapComponent;
