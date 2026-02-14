import { useState } from 'react';
import { PhotoGallery } from './components/photos/PhotoGallery';
import { PhotoUploadForm } from './components/photos/PhotoUploadForm';
import { PhotoViewerDialog } from './components/photos/PhotoViewerDialog';
import { LandingHeader } from './components/landing/LandingHeader';
import { HeroSection } from './components/landing/HeroSection';
import { HighlightsSection } from './components/landing/HighlightsSection';
import type { PhotoMetadata } from './backend';

function App() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMetadata | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Landing Header */}
      <LandingHeader />

      {/* Hero Section */}
      <HeroSection />

      {/* Highlights Section */}
      <HighlightsSection />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 space-y-20">
        {/* Upload Section */}
        <section id="upload-section" className="scroll-mt-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-3">Upload Photos</h2>
              <p className="text-muted-foreground">
                Share your favorite moments by uploading photos to your gallery
              </p>
            </div>
            <PhotoUploadForm />
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery-section" className="scroll-mt-20">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Your Gallery</h2>
            <p className="text-muted-foreground">
              Browse through your collection of memories
            </p>
          </div>
          <PhotoGallery onPhotoClick={setSelectedPhoto} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20 py-8 bg-card/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} · Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'photo-gallery'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-accent transition-colors underline underline-offset-4"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* Photo Viewer Dialog */}
      <PhotoViewerDialog
        photo={selectedPhoto}
        open={!!selectedPhoto}
        onOpenChange={(open) => !open && setSelectedPhoto(null)}
      />
    </div>
  );
}

export default App;
