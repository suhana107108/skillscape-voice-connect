
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Service {
  id: string | number; // Updated to accept both string and number
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  isAvailable: boolean;
  skills: { name: string; level: string; hourlyRate: number }[];
  location: string;
}

interface ServicesListProps {
  services: Service[];
  onSelectService: (service: Service) => void;
}

const ServicesList: React.FC<ServicesListProps> = ({ services, onSelectService }) => {
  return (
    <div className="mt-4 space-y-2 max-h-[40vh] overflow-y-auto p-2">
      <h2 className="text-lg font-semibold mb-2">Available Services Nearby</h2>
      
      {services.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No services available in this area
        </div>
      ) : (
        services.map((service) => (
          <Card 
            key={service.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelectService(service)}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={service.avatar} alt={service.name} />
                  <AvatarFallback>{service.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="font-medium">{service.name}</div>
                  <div className="flex items-center text-sm">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{service.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">({service.reviews})</span>
                    <div className={`h-2 w-2 rounded-full ml-2 ${service.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-xs ml-1">{service.isAvailable ? 'Available' : 'Unavailable'}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  {service.skills.slice(0, 2).map((skill) => (
                    <Badge key={skill.name} variant="outline" className="ml-auto">
                      {skill.name}: ${skill.hourlyRate}/hr
                    </Badge>
                  ))}
                  {service.skills.length > 2 && (
                    <span className="text-xs text-muted-foreground">+{service.skills.length - 2} more</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ServicesList;
