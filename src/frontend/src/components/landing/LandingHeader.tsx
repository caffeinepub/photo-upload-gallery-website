import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InternetIdentityButton } from '../auth/InternetIdentityButton';

export function LandingHeader() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="border-b border-border/40 bg-card/60 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/15 shadow-warm">
              <Camera className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">My Photo Gallery</h1>
            </div>
          </div>
          
          <nav className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scrollToSection('upload-section')}
              className="hidden sm:inline-flex"
            >
              Upload
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scrollToSection('gallery-section')}
              className="hidden sm:inline-flex"
            >
              Gallery
            </Button>
            <InternetIdentityButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
