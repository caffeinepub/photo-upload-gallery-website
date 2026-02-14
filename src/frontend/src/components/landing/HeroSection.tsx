import { Button } from '@/components/ui/button';
import { Camera, Image } from 'lucide-react';

export function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Warm Sunset Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/generated/hero-collage-bg.dim_1600x900.png"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Warm autumn sunset gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/96 via-background/88 to-background" />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-orange-500/8 to-rose-600/10" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/15 shadow-warm mb-4">
            <Camera className="w-8 h-8 text-accent-foreground" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Capture & Share Your
            <span className="block text-accent mt-2">Favorite Moments</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            A beautiful space to preserve your memories. Upload, organize, and share your photos with ease.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="w-full sm:w-auto text-base px-8 shadow-warm"
              onClick={() => scrollToSection('upload-section')}
            >
              <Camera className="w-5 h-5 mr-2" />
              Upload Photos
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base px-8 border-accent/30 hover:bg-accent/10"
              onClick={() => scrollToSection('gallery-section')}
            >
              <Image className="w-5 h-5 mr-2" />
              View Gallery
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
