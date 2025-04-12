
import React from 'react';
import { Button } from '@/components/ui/button';
import { Compass } from 'lucide-react';

interface MapControlsProps {
  onLocate: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({ onLocate, onZoomIn, onZoomOut }) => {
  return (
    <div className="absolute bottom-6 right-6 flex flex-col gap-2">
      <Button 
        variant="secondary" 
        size="icon" 
        className="rounded-full shadow-lg h-12 w-12 bg-white hover:bg-gray-100"
        onClick={onLocate}
      >
        <Compass className="h-6 w-6 text-gray-700" />
      </Button>
      
      <div className="flex flex-col gap-2 bg-white rounded-full shadow-lg p-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-10 w-10"
          onClick={onZoomIn}
        >
          <span className="text-xl font-bold">+</span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-10 w-10"
          onClick={onZoomOut}
        >
          <span className="text-xl font-bold">-</span>
        </Button>
      </div>
    </div>
  );
};

export default MapControls;
