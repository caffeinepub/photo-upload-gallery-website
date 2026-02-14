import { useState, useEffect } from 'react';
import { PhotoGallery } from './components/photos/PhotoGallery';
import { PhotoUploadForm } from './components/photos/PhotoUploadForm';
import { PhotoViewerDialog } from './components/photos/PhotoViewerDialog';
import { LandingHeader } from './components/landing/LandingHeader';
import { HeroSection } from './components/landing/HeroSection';
import { HighlightsSection } from './components/landing/HighlightsSection';
import { useUploadAuthorization } from './hooks/useUploadAuthorization';
import { useResolveShortLink } from './hooks/useShortLinks';
import { Alert, AlertDescription } from './components/ui/alert';
import { Lock, AlertCircle } from 'lucide-react';
import type { PhotoMetadata } from './backend';
import { getHashParam, removeHashParam } from './utils/urlParams';

function App() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMetadata | null>(null);
  const [shortLinkError, setShortLinkError] = useState<string | null>(null);
  const { canUpload, isLoading: isAuthLoading } = useUploadAuthorization();

  // Check for short link parameter on load
  const shortCode = getHashParam('s');
  const { data: resolvedPhoto, isLoading: isResolvingShortLink, error: resolveError } = useResolveShortLink(shortCode);

  // Handle short link resolution
  useEffect(() => {
    if (shortCode && resolvedPhoto) {
      // Successfully resolved - open the photo
      setSelectedPhoto(resolvedPhoto);
      // Clear the hash parameter after handling
      removeHashParam('s');
      setShortLinkError(null);
    } else if (shortCode && !isResolvingShortLink && !resolvedPhoto && resolveError === undefined) {
      // Short code provided but photo not found (after loading completed)
      setShortLinkError('The shared photo link is invalid or has expired.');
      removeHashParam('s');
    }
  }, [shortCode, resolvedPhoto, isResolvingShortLink, resolveError]);

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
        {/* Short Link Error Message */}
        {shortLinkError && (
          <div className="max-w-3xl mx-auto">
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-destructive">
                {shortLinkError}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Upload Section */}
        <section id="upload-section" className="scroll-mt-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-3">Upload Photos</h2>
              <p className="text-muted-foreground">
                Share your favorite moments by uploading photos to your gallery
              </p>
            </div>
            
            {/* Show upload form only if authorized */}
            {isAuthLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Checking permissions...
              </div>
            ) : canUpload ? (
              <PhotoUploadForm />
            ) : (
              <Alert className="border-muted bg-muted/30">
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  Uploads are restricted to the gallery owner. Sign in with the owner account to upload photos.
                </AlertDescription>
              </Alert>
            )}
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
