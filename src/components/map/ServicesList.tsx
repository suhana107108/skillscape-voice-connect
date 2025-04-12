
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface Service {
  id: string | number;
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
    <div className="w-full">
      <Drawer>
        <DrawerTrigger asChild>
          <div className="flex items-center justify-between bg-background/95 backdrop-blur-sm p-3 rounded-t-lg border-t border-x border-border cursor-pointer hover:bg-secondary/50 transition-colors">
            <h2 className="text-lg font-semibold flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Available Services
              <Badge variant="outline" className="ml-2">
                {services.length}
              </Badge>
            </h2>
            <div className="w-10 h-1 rounded-full bg-muted mx-auto" />
          </div>
        </DrawerTrigger>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader className="border-b pb-2">
            <DrawerTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Available Services ({services.length})
            </DrawerTitle>
          </DrawerHeader>
          
          <ScrollArea className="h-[calc(80vh-4rem)] px-4 pt-2">
            {services.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No services available in this area
              </div>
            ) : (
              <div className="grid gap-3 pb-6">
                {services.map((service) => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    onSelect={onSelectService} 
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

const ServiceCard = ({ service, onSelect }: { service: Service; onSelect: (service: Service) => void }) => (
  <Card 
    className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden border-l-4 hover:border-l-primary"
    onClick={() => onSelect(service)}
  >
    <CardContent className="p-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
          <AvatarImage src={service.avatar} alt={service.name} />
          <AvatarFallback>{service.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-base truncate">{service.name}</h3>
            <div className={`h-2 w-2 rounded-full flex-shrink-0 ${service.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          </div>
          
          <div className="flex items-center text-sm mt-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-medium">{service.rating}</span>
            <span className="text-xs text-muted-foreground ml-1">({service.reviews})</span>
            <span className="text-xs ml-2 text-muted-foreground">{service.location}</span>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-1.5">
            {service.skills.map((skill) => (
              <div key={skill.name} className="flex items-center">
                <Badge variant="outline" className="text-xs bg-secondary/50">
                  <span className="truncate max-w-[100px]">{skill.name}</span>
                  <span className="ml-1 font-semibold text-primary">${skill.hourlyRate}/hr</span>
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ServicesList;
