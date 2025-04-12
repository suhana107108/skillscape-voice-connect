
import React from 'react';
import { Star } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProfileCardProps {
  profile: any;
  onClose: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onClose }) => {
  if (!profile) return null;

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>{profile.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{profile.name}</CardTitle>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-sm font-medium">{profile.rating}</span>
                <span className="text-xs text-muted-foreground ml-1">({profile.reviews} reviews)</span>
                <div className={`h-2 w-2 rounded-full ml-2 ${profile.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-xs ml-1">{profile.isAvailable ? 'Available Now' : 'Unavailable'}</span>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={onClose}
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
              {profile.skills.map((skill: any) => (
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
            <p className="text-sm text-muted-foreground">{profile.about}</p>
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Location</h4>
              <p className="text-sm text-muted-foreground">{profile.location}</p>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4 space-y-4">
            {profile.reviewDetails.map((review: any, index: number) => (
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
        <Button className="w-full" disabled={!profile.isAvailable}>
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
