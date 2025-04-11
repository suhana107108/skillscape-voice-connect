
import React, { useState } from 'react';
import { 
  Settings, Calendar, Briefcase, Star, MapPin, 
  ChevronRight, Bell, Shield, Award, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const ProfileView = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  
  const mockProfile = {
    name: 'Alex Johnson',
    avatar: '',
    skills: [
      { name: 'Plumbing', level: 'expert', hourlyRate: 45 },
      { name: 'Electrical', level: 'advanced', hourlyRate: 40 },
    ],
    rating: 4.8,
    reviews: 24,
    completedJobs: 36,
    location: 'Brooklyn, NY',
    verificationLevel: 78,
    about: 'I have 5 years of experience as a home maintenance professional, specializing in plumbing and electrical work.',
    earnings: 2450,
    challenges: [
      { name: 'Quick Response', completed: true, points: 25 },
      { name: 'Five-Star Service', completed: true, points: 50 },
      { name: '10 Jobs Completed', completed: true, points: 100 },
      { name: 'Skill Master', completed: false, progress: 75, points: 200 },
    ],
  };
  
  const upcomingBookings = [
    {
      id: 1,
      customer: 'Maria Garcia',
      date: 'Apr 12, 2025',
      time: '10:00 AM',
      service: 'Plumbing',
      status: 'confirmed',
    },
    {
      id: 2,
      customer: 'James Wilson',
      date: 'Apr 15, 2025',
      time: '2:30 PM',
      service: 'Electrical',
      status: 'pending',
    },
  ];

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <CardTitle>{mockProfile.name}</CardTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {mockProfile.location}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex justify-center py-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={mockProfile.avatar} alt={mockProfile.name} />
                  <AvatarFallback className="text-xl">{mockProfile.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center">
                  <div className="text-sm font-medium">Availability</div>
                </div>
                <Switch 
                  checked={isAvailable} 
                  onCheckedChange={setIsAvailable} 
                />
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-2" fill="gold" />
                  <div className="text-sm">{mockProfile.rating} rating</div>
                  <div className="text-xs text-muted-foreground ml-1">({mockProfile.reviews} reviews)</div>
                </div>
                
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 text-skillscape-500 mr-2" />
                  <div className="text-sm">{mockProfile.completedJobs} jobs completed</div>
                </div>
                
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-skillscape-500 mr-2" />
                  <div className="text-sm">Verification level</div>
                  <div className="flex-1 ml-2">
                    <Progress value={mockProfile.verificationLevel} className="h-2" />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">My Skills</h3>
                <div className="space-y-2">
                  {mockProfile.skills.map((skill) => (
                    <div key={skill.name} className="flex justify-between items-center">
                      <div className={`skill-badge ${
                        skill.level === 'expert' ? 'skill-badge-expert' : 
                        skill.level === 'advanced' ? 'skill-badge-advanced' : ''
                      }`}>
                        {skill.name}
                      </div>
                      <div className="text-sm">${skill.hourlyRate}/hr</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skill Challenges</CardTitle>
              <CardDescription>Complete challenges to build your reputation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockProfile.challenges.map((challenge) => (
                <div key={challenge.name} className="flex items-center">
                  {challenge.completed ? (
                    <div className="h-8 w-8 rounded-full bg-skillscape-100 flex items-center justify-center mr-3">
                      <Award className="h-4 w-4 text-skillscape-600" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full border border-dashed border-muted-foreground flex items-center justify-center mr-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-medium">{challenge.name}</div>
                    {challenge.completed ? (
                      <div className="text-xs text-green-600">Completed • {challenge.points} points</div>
                    ) : (
                      <div className="w-full">
                        <Progress value={challenge.progress} className="h-1 mt-1" />
                        <div className="text-xs text-muted-foreground mt-1">{challenge.progress}% • {challenge.points} points</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2">
                View All Challenges
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <Card>
            <Tabs defaultValue="bookings">
              <CardHeader className="pb-0">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                  <TabsTrigger value="earnings">Earnings</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
              </CardHeader>
              
              <CardContent className="pt-6">
                <TabsContent value="bookings" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-medium">Upcoming Bookings</h3>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      View Calendar
                      <Calendar className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                  
                  {upcomingBookings.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingBookings.map((booking) => (
                        <Card key={booking.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">{booking.customer}</div>
                                <div className="text-sm text-muted-foreground">
                                  {booking.date} • {booking.time}
                                </div>
                                <div className="mt-1">
                                  <Badge variant="outline">{booking.service}</Badge>
                                  <Badge 
                                    variant="outline" 
                                    className={`ml-2 ${
                                      booking.status === 'confirmed' 
                                        ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                                    }`}
                                  >
                                    {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                  </Badge>
                                </div>
                              </div>
                              <Button variant="ghost" size="icon">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No upcoming bookings</p>
                      <Button variant="outline" size="sm" className="mt-4">
                        Set Availability
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="earnings">
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground">Total Earnings</div>
                      <div className="text-3xl font-bold">${mockProfile.earnings}</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="rounded-lg bg-secondary p-4">
                        <div className="text-sm text-muted-foreground">This Week</div>
                        <div className="text-xl font-medium">$320</div>
                      </div>
                      <div className="rounded-lg bg-secondary p-4">
                        <div className="text-sm text-muted-foreground">This Month</div>
                        <div className="text-xl font-medium">$850</div>
                      </div>
                      <div className="rounded-lg bg-secondary p-4">
                        <div className="text-sm text-muted-foreground">Jobs</div>
                        <div className="text-xl font-medium">36</div>
                      </div>
                    </div>
                    
                    <Button>
                      View Detailed Reports
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <div className="py-4 space-y-6">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-2" />
                          <div className="text-2xl font-bold">{mockProfile.rating}</div>
                          <div className="text-sm text-muted-foreground ml-2">
                            based on {mockProfile.reviews} reviews
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="border-b pb-4 last:border-0">
                          <div className="flex items-center mb-2">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>
                                {i === 1 ? 'MG' : 'JW'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">
                                {i === 1 ? 'Maria Garcia' : 'James Wilson'}
                              </div>
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className="h-3 w-3" 
                                    fill={i < 5 ? "gold" : "transparent"} 
                                    color={i < 5 ? "gold" : "gray"} 
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="ml-auto text-xs text-muted-foreground">
                              {i === 1 ? '2 days ago' : '1 week ago'}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {i === 1 
                              ? "Alex did an excellent job fixing our sink. Very professional and knowledgeable."
                              : "Quick response and great workmanship. Will definitely hire again for electrical work."
                            }
                          </p>
                        </div>
                      ))}
                      
                      <Button variant="outline" size="sm" className="w-full">
                        View All Reviews
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
