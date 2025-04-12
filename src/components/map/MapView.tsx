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
  const [filterBySkills, setFilterBySkills] = useState<string[]>([]);
  const [filterByAvailability, setFilterByAvailability] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    skills: [] as string[],
    availability: false
  });
  
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const filteredProfiles = React.useMemo(() => {
    return mockProfiles.filter(profile => {
      const matchesSearch = 
        searchTerm === '' || 
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        profile.skills.some(skill => 
          skill.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      if (!matchesSearch) return false;
      
      const matchesSkills = 
        appliedFilters.skills.length === 0 || 
        profile.skills.some(skill => 
          appliedFilters.skills.includes(skill.name)
        );
      
      if (!matchesSkills) return false;
      
      const matchesAvailability = 
        !appliedFilters.availability ||
        profile.isAvailable;
      
      return matchesAvailability;
    });
  }, [searchTerm, appliedFilters]);

  const applyFilters = () => {
    setAppliedFilters({
      skills: filterBySkills,
      availability: filterByAvailability
    });
    
    toast({
      title: "Filters applied",
      description: `Showing ${filterBySkills.length > 0 ? filterBySkills.join(', ') : 'all'} skills${filterByAvailability ? ' (available only)' : ''}`,
    });
  };

  const clearFilters = () => {
    setFilterBySkills([]);
    setFilterByAvailability(false);
    setAppliedFilters({
      skills: [],
      availability: false
    });
    
    toast({
      title: "Filters cleared",
      description: "Showing all services",
    });
  };

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          const mapNode = document.querySelector('[data-map-container="true"]');
          if (mapNode) {
            mapRef.current = mapNode;
          }
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, []);

  const handleLocationSearch = (location: string) => {
    const mapContainerEl = document.querySelector('[data-map-ref="true"]');
    if (mapContainerEl) {
      if (mapContainerEl && typeof mapContainerEl.searchLocation === 'function') {
        mapContainerEl.searchLocation(location);
      }
    }
  };

  const handleLocate = () => {
    const geolocateButton = document.querySelector('.mapboxgl-ctrl-geolocate');
    if (geolocateButton) {
      geolocateButton.click();
    }
  };

  const handleZoomIn = () => {
    const zoomInButton = document.querySelector('.mapboxgl-ctrl-zoom-in');
    if (zoomInButton) {
      zoomInButton.click();
    }
  };

  const handleZoomOut = () => {
    const zoomOutButton = document.querySelector('.mapboxgl-ctrl-zoom-out');
    if (zoomOutButton) {
      zoomOutButton.click();
    }
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full flex flex-col">
      <div className="relative flex-grow">
        <MapComponent 
          onSelectProfile={setSelectedProfile} 
          filteredProfiles={filteredProfiles}
        />
        
        <MapControls 
          onLocate={handleLocate}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />
      </div>
      
      <div className="absolute top-4 left-0 right-0 mx-auto w-full max-w-md px-4 z-10">
        <SearchBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredProfiles={filteredProfiles}
          setSelectedProfile={setSelectedProfile}
        />
      </div>

      <div className="absolute top-20 left-0 right-0 mx-auto w-full max-w-md px-4 z-10">
        <LocationSearch 
          locationSearch={locationSearch}
          setLocationSearch={setLocationSearch}
          onSearch={handleLocationSearch}
        />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 w-full bg-background/90 backdrop-blur-sm border-t border-border" style={{ zIndex: 1000 }}>
        <div className="max-w-4xl mx-auto px-4 py-2">
          <ServicesList 
            services={mockProfiles}
            filteredServices={filteredProfiles}
            onSelectService={setSelectedProfile}
            filterBySkills={filterBySkills}
            setFilterBySkills={setFilterBySkills}
            filterByAvailability={filterByAvailability}
            setFilterByAvailability={setFilterByAvailability}
            applyFilters={applyFilters}
            clearFilters={clearFilters}
          />
        </div>
      </div>
      
      {selectedProfile && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4 z-50">
          <ProfileCard profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
        </div>
      )}
      
      <div 
        style={{ display: 'none' }} 
        data-map-ref="true"
      />
    </div>
  );
};

export default MapView;
