
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mic, Map, User, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>SkillScape</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/" className="flex items-center gap-2 text-lg font-medium">
                  <Map className="h-5 w-5" />
                  Explore
                </Link>
                <Link to="/onboarding" className="flex items-center gap-2 text-lg font-medium">
                  <Mic className="h-5 w-5" />
                  Voice Onboarding
                </Link>
                <Link to="/profile" className="flex items-center gap-2 text-lg font-medium">
                  <User className="h-5 w-5" />
                  Profile
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl bg-gradient-to-r from-skillscape-600 to-blue-500 bg-clip-text text-transparent">
              SkillScape
            </span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Map className="h-4 w-4" />
            Explore
          </Link>
          <Link
            to="/onboarding"
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/onboarding' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Mic className="h-4 w-4" />
            Voice Onboarding
          </Link>
          <Link
            to="/profile"
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/profile' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <Link to="/auth">
            <Button variant="outline" size="sm" className="hidden md:flex">
              Sign In
            </Button>
          </Link>
          <Link to="/auth?mode=register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
