
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// You should replace this with your own Mapbox token in a production environment
// Ideally, this would be stored in an environment variable
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZWRldiIsImEiOiJjbHdjNnF2YWMwNWQ5MnFxaWc2dW5jbWh5In0.a6C0CONSWVokXUjIJdNlpA';

interface MapComponentProps {
  onSelectProfile: (profile: any) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onSelectProfile }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
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

  // Function to update location
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

  return (
    <div className="h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />
      {/* We return the mapContainer and searchLocation for use in the parent component */}
      {React.createElement('div', { style: { display: 'none' }, 
        ref: (el) => {
          if (el) {
            // @ts-ignore - We're using this to pass data to the parent
            el.mapContainerRef = mapContainer;
            // @ts-ignore
            el.searchLocation = searchLocation;
          }
        }
      })}
    </div>
  );
};

export default MapComponent;
