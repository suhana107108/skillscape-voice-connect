
import React, { useState } from 'react';
import { Mic, MicOff, ChevronRight, Loader2 } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const VoiceOnboarding = () => {
  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    skills: [''],
    about: '',
    location: '',
    hourlyRate: '',
    avatar: '',
  });
  const { toast } = useToast();

  const handleRecordToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate voice processing
      setIsProcessing(true);
      
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            // Simulate AI processing result
            setTimeout(() => {
              setProfileData({
                name: 'Alex Johnson',
                skills: ['Plumbing', 'Electrical'],
                about: 'I have 5 years of experience as a home maintenance professional, specializing in plumbing and electrical work.',
                location: 'Brooklyn, NY',
                hourlyRate: '35',
                avatar: '',
              });
              setStep(2);
              toast({
                title: "Voice profile created!",
                description: "We've generated your profile based on your voice input.",
              });
            }, 500);
            return 100;
          }
          return prev + 5;
        });
      }, 200);
      
    } else {
      setIsRecording(true);
      setProgress(0);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...profileData.skills];
    updatedSkills[index] = value;
    setProfileData(prev => ({
      ...prev,
      skills: updatedSkills
    }));
  };

  const addSkill = () => {
    setProfileData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const removeSkill = (index: number) => {
    const updatedSkills = [...profileData.skills];
    updatedSkills.splice(index, 1);
    setProfileData(prev => ({
      ...prev,
      skills: updatedSkills
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile submitted!",
      description: "Your profile has been created successfully.",
    });
    // In a real app, this would save to a database
  };

  return (
    <div className="container max-w-md py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Voice Onboarding</CardTitle>
          <CardDescription className="text-center">
            {step === 1 
              ? "Record your voice to automatically create your profile" 
              : "Review and edit your AI-generated profile"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {step === 1 ? (
            <div className="flex flex-col items-center">
              <div className="relative mb-8 mt-4">
                <Button
                  className={`rounded-full h-24 w-24 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-skillscape-600 hover:bg-skillscape-700'}`}
                  onClick={handleRecordToggle}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="h-12 w-12 animate-spin" />
                  ) : isRecording ? (
                    <MicOff className="h-12 w-12" />
                  ) : (
                    <Mic className="h-12 w-12" />
                  )}
                </Button>
                {isRecording && (
                  <>
                    <span className="voice-ripple"></span>
                    <span className="voice-ripple" style={{ animationDelay: '0.5s' }}></span>
                  </>
                )}
              </div>
              
              {isRecording && (
                <div className="text-center mb-4 text-sm text-muted-foreground animate-pulse">
                  Listening... Speak about your skills and experience
                </div>
              )}
              
              {isProcessing && (
                <div className="w-full space-y-2">
                  <div className="text-sm">Processing your voice...</div>
                  <Progress value={progress} />
                  <div className="text-xs text-muted-foreground">
                    AI is analyzing your speech to create your profile
                  </div>
                </div>
              )}
              
              <div className="text-center mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Simply record yourself talking about:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside text-left">
                  <li>Your name and location</li>
                  <li>Skills you can offer</li>
                  <li>Your experience and expertise</li>
                  <li>How much you charge</li>
                </ul>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="text-lg">
                      {profileData.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Skills</Label>
                  {profileData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={skill}
                        onChange={(e) => handleSkillChange(index, e.target.value)}
                        placeholder="Enter a skill"
                      />
                      {profileData.skills.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSkill(index)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                          </svg>
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={addSkill}
                  >
                    Add Skill
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="about">About</Label>
                  <Textarea
                    id="about"
                    value={profileData.about}
                    onChange={(e) => handleInputChange('about', e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={profileData.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                  />
                </div>
              </div>
            </form>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {step === 2 && (
            <Button variant="outline" onClick={() => setStep(1)}>
              Re-record
            </Button>
          )}
          {step === 2 && (
            <Button onClick={handleSubmit}>
              Submit Profile
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default VoiceOnboarding;
