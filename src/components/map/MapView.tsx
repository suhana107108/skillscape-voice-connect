
import React, { useState, useRef, useEffect } from 'react';
import { mockProfiles } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';
import 'mapbox-gl/dist/mapbox-gl.css';

import MapComponent from './MapComponent';
import SearchBar from './SearchBar';
import LocationSearch from './LocationSearch';
import ProfileCard from './ProfileCard';
import MapControls from './MapControls';
import ServicesList from './ServicesList';

const MapView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [locationSearch, setLocationSearch] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Filter profiles based on search term
  const filteredProfiles = mockProfiles.filter(profile => 
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    profile.skills.some(skill => 
      skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Handle getting a reference to the map container
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          // @ts-ignore
          const mapNode = document.querySelector('[data-map-container="true"]');
          if (mapNode) {
            // @ts-ignore
            mapRef.current = mapNode;
          }
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, []);

  // Handle location search
  const handleLocationSearch = (location: string) => {
    // We'll use a reference to the MapComponent to call its searchLocation function
    const mapContainerEl = document.querySelector('[data-map-ref="true"]');
    if (mapContainerEl) {
      // Access the searchLocation function via DOM property
      // @ts-ignore - This property is set in the MapComponent
      if (mapContainerEl && typeof mapContainerEl.searchLocation === 'function') {
        // @ts-ignore
        mapContainerEl.searchLocation(location);
      }
    }
  };

  // Map control handlers
  const handleLocate = () => {
    const geolocateButton = document.querySelector('.mapboxgl-ctrl-geolocate');
    if (geolocateButton) {
      // @ts-ignore
      geolocateButton.click();
    }
  };

  const handleZoomIn = () => {
    const zoomInButton = document.querySelector('.mapboxgl-ctrl-zoom-in');
    if (zoomInButton) {
      // @ts-ignore
      zoomInButton.click();
    }
  };

  const handleZoomOut = () => {
    const zoomOutButton = document.querySelector('.mapboxgl-ctrl-zoom-out');
    if (zoomOutButton) {
      // @ts-ignore
      zoomOutButton.click();
    }
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full flex flex-col">
      {/* Map container */}
      <div className="relative flex-grow">
        <MapComponent onSelectProfile={setSelectedProfile} />
        
        {/* Map controls */}
        <MapControls 
          onLocate={handleLocate}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />
      </div>
      
      {/* Search and filter overlay */}
      <div className="absolute top-4 left-0 right-0 mx-auto w-full max-w-md px-4 z-10">
        <SearchBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredProfiles={filteredProfiles}
          setSelectedProfile={setSelectedProfile}
        />
      </div>

      {/* Location search input */}
      <div className="absolute top-20 left-0 right-0 mx-auto w-full max-w-md px-4 z-10">
        <LocationSearch 
          locationSearch={locationSearch}
          setLocationSearch={setLocationSearch}
          onSearch={handleLocationSearch}
        />
      </div>
      
      {/* Services list */}
      <div className="absolute bottom-0 left-0 right-0 w-full bg-background/90 backdrop-blur-sm border-t border-border" style={{ zIndex: 1000 }}>
        <div className="max-w-4xl mx-auto px-4 py-2">
          <ServicesList 
            services={mockProfiles} 
            onSelectService={setSelectedProfile} 
          />
        </div>
      </div>
      
      {/* Selected Profile Card */}
      {selectedProfile && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4 z-50">
          <ProfileCard profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
        </div>
      )}
      
      {/* Hidden element to get references to map methods */}
      <div 
        style={{ display: 'none' }} 
        data-map-ref="true"
      />
    </div>
  );
};

export default MapView;
