
import React, { useState } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { Mic, Mail, Lock, User, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const AuthView = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    location: '',
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate authentication
    toast({
      title: mode === 'login' ? "Login successful!" : "Account created!",
      description: mode === 'login' 
        ? "Welcome back to SkillScape" 
        : "Your account has been created successfully",
    });
    
    setTimeout(() => {
      setIsAuthenticated(true);
    }, 1000);
  };

  if (isAuthenticated) {
    return <Navigate to="/profile" />;
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </CardTitle>
            <CardDescription className="text-center">
              {mode === 'login' 
                ? 'Sign in to your SkillScape account'
                : 'Join the SkillScape community today'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue={mode} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login" asChild>
                  <a href="/auth">Sign In</a>
                </TabsTrigger>
                <TabsTrigger value="register" asChild>
                  <a href="/auth?mode=register">Sign Up</a>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <a href="#" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        name="name"
                        placeholder="Your name"
                        className="pl-10"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-location"
                        name="location"
                        placeholder="Your city"
                        className="pl-10"
                        value={formData.location}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </form>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" type="button" className="flex items-center justify-center gap-2">
                    <Mic className="h-4 w-4" />
                    Voice Registration
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-xs text-center text-muted-foreground">
              By continuing, you agree to SkillScape's
              <a href="#" className="underline mx-1">Terms of Service</a>
              and
              <a href="#" className="underline mx-1">Privacy Policy</a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthView;
