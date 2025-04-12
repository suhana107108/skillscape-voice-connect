
import React, { useRef, useState } from 'react';
import { Filter, Mic, MicOff, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredProfiles: any[];
  setSelectedProfile: (profile: any) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  filteredProfiles, 
  setSelectedProfile 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [distance, setDistance] = useState([5]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  return (
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
  );
};

export default SearchBar;
