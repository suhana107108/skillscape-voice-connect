import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Mic, MicOff, Star, MapPin, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockProfiles } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapComponent from './MapComponent';
import ServicesList from './ServicesList';

const MapView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [distance, setDistance] = useState([5]);
  const [isRecording, setIsRecording] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Filter profiles based on search term
  const filteredProfiles = mockProfiles.filter(profile => 
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    profile.skills.some(skill => 
      skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Handle getting a reference to the map container and search function
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

  const handleVoiceSearch = () => {
    if (!isRecording) {
      // Check if browser supports speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        setIsRecording(true);
        
        // Initialize SpeechRecognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onstart = () => {
          toast({
            title: "Listening...",
            description: "Speak now to search for services or professionals",
          });
        };
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setSearchTerm(transcript);
          setIsRecording(false);
          toast({
            title: "Voice search completed",
            description: `Searching for: "${transcript}"`,
          });
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsRecording(false);
          toast({
            title: "Voice search error",
            description: "Couldn't understand. Please try again.",
            variant: "destructive"
          });
        };
        
        recognition.onend = () => {
          setIsRecording(false);
        };
        
        recognition.start();
      } else {
        toast({
          title: "Voice search not supported",
          description: "Your browser doesn't support voice search. Please type your query instead.",
          variant: "destructive"
        });
      }
    } else {
      // If already recording, stop recording
      setIsRecording(false);
    }
  };

  // Handle location search
  const handleLocationSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (locationSearch.trim()) {
      // Access the searchLocation function from the MapComponent
      // @ts-ignore - we know this exists
      const mapContainerEl = document.querySelector('[data-map-ref="true"]');
      if (mapContainerEl && mapContainerEl.searchLocation) {
        mapContainerEl.searchLocation(locationSearch);
        toast({
          title: "Location updated",
          description: `Moved to ${locationSearch}`,
        });
      }
    }
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full flex flex-col">
      {/* Map container */}
      <div className="relative flex-grow">
        <MapComponent onSelectProfile={setSelectedProfile} />
        
        {/* Google Maps-like UI elements */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2">
          <Button 
            variant="secondary" 
            size="icon" 
            className="rounded-full shadow-lg h-12 w-12 bg-white hover:bg-gray-100"
            onClick={() => {
              // Trigger geolocation
              const geolocateButton = document.querySelector('.mapboxgl-ctrl-geolocate');
              if (geolocateButton) {
                // @ts-ignore
                geolocateButton.click();
              }
            }}
          >
            <Compass className="h-6 w-6 text-gray-700" />
          </Button>
          
          <div className="flex flex-col gap-2 bg-white rounded-full shadow-lg p-1">
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
              <span className="text-xl font-bold">+</span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
              <span className="text-xl font-bold">-</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Search and filter overlay */}
      <div className="absolute top-4 left-0 right-0 mx-auto w-full max-w-md px-4 z-10">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="search"
            placeholder="Search skills or people..."
            className="pl-8 pr-20 py-5 rounded-full shadow-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-1 top-1 flex">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 rounded-full mr-1 ${isRecording ? 'bg-red-100 text-red-500' : ''}`}
              onClick={handleVoiceSearch}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 rounded-full">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Options</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Distance</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">0 km</span>
                      <span className="text-xs font-medium">{distance[0]} km</span>
                      <span className="text-xs text-muted-foreground">10 km</span>
                    </div>
                    <Slider
                      defaultValue={[5]}
                      max={10}
                      step={1}
                      onValueChange={setDistance}
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Plumbing', 'Electrical', 'Gardening', 'Cooking', 'Cleaning', 'Carpentry'].map((skill) => (
                        <Badge key={skill} variant="outline" className="cursor-pointer hover:bg-secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Availability</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Available Now</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Today</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-secondary">This Week</Badge>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {searchTerm && (
          <Card className="mt-2 max-h-80 overflow-auto shadow-lg">
            <CardContent className="p-2">
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map((profile) => (
                  <div 
                    key={profile.id} 
                    className="flex items-center p-2 hover:bg-secondary rounded-md cursor-pointer"
                    onClick={() => setSelectedProfile(profile)}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={profile.avatar} alt={profile.name} />
                      <AvatarFallback>{profile.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{profile.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {profile.skills.map(skill => skill.name).join(', ')}
                      </div>
                    </div>
                    <div className="ml-auto flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${profile.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-xs">{profile.isAvailable ? 'Available' : 'Unavailable'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No results found
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Location search input - styled more like Google Maps */}
      <div className="absolute top-20 left-0 right-0 mx-auto w-full max-w-md px-4 z-10">
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
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedProfile.avatar} alt={selectedProfile.name} />
                    <AvatarFallback>{selectedProfile.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedProfile.name}</CardTitle>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{selectedProfile.rating}</span>
                      <span className="text-xs text-muted-foreground ml-1">({selectedProfile.reviews} reviews)</span>
                      <div className={`h-2 w-2 rounded-full ml-2 ${selectedProfile.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-xs ml-1">{selectedProfile.isAvailable ? 'Available Now' : 'Unavailable'}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => setSelectedProfile(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="skills">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="skills" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    {selectedProfile.skills.map((skill: any) => (
                      <div key={skill.name} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className={`skill-badge ${
                            skill.level === 'expert' ? 'skill-badge-expert' : 
                            skill.level === 'advanced' ? 'skill-badge-advanced' : ''
                          }`}>
                            {skill.name}
                          </div>
                        </div>
                        <div className="text-sm">${skill.hourlyRate}/hr</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="about" className="mt-4">
                  <p className="text-sm text-muted-foreground">{selectedProfile.about}</p>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Location</h4>
                    <p className="text-sm text-muted-foreground">{selectedProfile.location}</p>
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="mt-4 space-y-4">
                  {selectedProfile.reviewDetails.map((review: any, index: number) => (
                    <div key={index} className="border-b pb-2 last:border-0">
                      <div className="flex items-center mb-1">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback>{review.author.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{review.author}</span>
                        <div className="flex ml-auto">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className="h-3 w-3" 
                              fill={i < review.rating ? "gold" : "transparent"} 
                              color={i < review.rating ? "gold" : "gray"} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{review.text}</p>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={!selectedProfile.isAvailable}>
                Book Now
              </Button>
            </CardFooter>
          </Card>
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
