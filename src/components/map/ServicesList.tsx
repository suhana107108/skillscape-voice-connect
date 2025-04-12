
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Filter, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Skill {
  name: string;
  level: string;
  hourlyRate: number;
}

interface Service {
  id: string | number;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  isAvailable: boolean;
  skills: Skill[];
  location: string;
}

interface ServicesListProps {
  services: Service[];
  onSelectService: (service: Service) => void;
  filteredServices?: Service[];
  filterBySkills: string[];
  setFilterBySkills: (skills: string[]) => void;
  filterByAvailability: boolean;
  setFilterByAvailability: (status: boolean) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}

const ServicesList: React.FC<ServicesListProps> = ({ 
  services, 
  onSelectService,
  filteredServices,
  filterBySkills,
  setFilterBySkills,
  filterByAvailability,
  setFilterByAvailability,
  applyFilters,
  clearFilters
}) => {
  // Get all unique skills from services
  const allSkills = React.useMemo(() => {
    const skillsSet = new Set<string>();
    services.forEach(service => {
      service.skills.forEach(skill => {
        skillsSet.add(skill.name);
      });
    });
    return Array.from(skillsSet).sort();
  }, [services]);

  const displayServices = filteredServices || services;
  
  // Handle skill checkbox change
  const handleSkillChange = (skillName: string, checked: boolean) => {
    if (checked) {
      setFilterBySkills([...filterBySkills, skillName]);
    } else {
      setFilterBySkills(filterBySkills.filter(skill => skill !== skillName));
    }
  };

  return (
    <div className="w-full">
      <Drawer>
        <DrawerTrigger asChild>
          <div className="flex items-center justify-between bg-background/95 backdrop-blur-sm p-3 rounded-t-lg border-t border-x border-border cursor-pointer hover:bg-secondary/50 transition-colors">
            <h2 className="text-lg font-semibold flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Available Services
              <Badge variant="outline" className="ml-2">
                {displayServices.length}
              </Badge>
            </h2>
            <div className="flex items-center">
              {(filterBySkills.length > 0 || filterByAvailability) && (
                <Badge variant="secondary" className="mr-2">
                  Filters Active
                </Badge>
              )}
              <div className="w-10 h-1 rounded-full bg-muted mx-auto" />
            </div>
          </div>
        </DrawerTrigger>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader className="border-b pb-2">
            <DrawerTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Available Services ({displayServices.length})
              </div>
              <Button variant="outline" size="sm" onClick={() => {
                const filterDrawer = document.getElementById('filter-drawer');
                if (filterDrawer) {
                  filterDrawer.click();
                }
              }}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DrawerTitle>
          </DrawerHeader>
          
          <ScrollArea className="h-[calc(80vh-4rem)] px-4 pt-2">
            {displayServices.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No services available with the current filters
              </div>
            ) : (
              <div className="grid gap-3 pb-6">
                {displayServices.map((service) => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    onSelect={onSelectService} 
                  />
                ))}
              </div>
            )}
          </ScrollArea>
          
          {/* Filter Drawer */}
          <Drawer>
            <DrawerTrigger asChild>
              <div id="filter-drawer" className="hidden">Filter</div>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filter Services</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Availability</h3>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="available-filter"
                      checked={filterByAvailability}
                      onCheckedChange={setFilterByAvailability}
                    />
                    <label htmlFor="available-filter" className="text-sm cursor-pointer">
                      Show only available providers
                    </label>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Skills</h3>
                  <ScrollArea className="h-[200px] pr-4">
                    <div className="space-y-2">
                      {allSkills.map(skill => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`skill-${skill}`}
                            checked={filterBySkills.includes(skill)}
                            onCheckedChange={(checked) => handleSkillChange(skill, checked === true)}
                          />
                          <label 
                            htmlFor={`skill-${skill}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {skill}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <DrawerFooter className="border-t pt-2">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    Clear All
                  </Button>
                  <Button onClick={applyFilters} className="w-full">
                    Apply Filters
                  </Button>
                </div>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          
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
