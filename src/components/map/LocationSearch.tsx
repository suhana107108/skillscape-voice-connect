
import React, { useRef } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface LocationSearchProps {
  locationSearch: string;
  setLocationSearch: (location: string) => void;
  onSearch: (location: string) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ 
  locationSearch, 
  setLocationSearch,
  onSearch
}) => {
  const locationInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleLocationSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (locationSearch.trim()) {
      onSearch(locationSearch);
      toast({
        title: "Location updated",
        description: `Moved to ${locationSearch}`,
      });
    }
  };

  return (
    <form onSubmit={handleLocationSearch} className="relative">
      <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        ref={locationInputRef}
        type="text"
        placeholder="Search location..."
        className="pl-8 pr-16 py-2 rounded-full shadow-md"
        value={locationSearch}
        onChange={(e) => setLocationSearch(e.target.value)}
      />
      <Button 
        type="submit"
        size="sm"
        className="absolute right-1 top-1 rounded-full"
      >
        Go
      </Button>
    </form>
  );
};

export default LocationSearch;
