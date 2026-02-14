import { useState } from 'react';
import type { PhotoMetadata } from '../../backend';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Calendar, FileImage, Share2, Check } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { useCreateShortLink } from '../../hooks/useShortLinks';
import { useUploadAuthorization } from '../../hooks/useUploadAuthorization';
import { Alert, AlertDescription } from '../ui/alert';

interface PhotoViewerDialogProps {
  photo: PhotoMetadata | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PhotoViewerDialog({ photo, open, onOpenChange }: PhotoViewerDialogProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const createShortLink = useCreateShortLink();
  const { canUpload } = useUploadAuthorization();

  if (!photo) return null;

  const imageUrl = photo.blob.getDirectURL();
  const uploadDate = new Date(Number(photo.timestamp));

  const handleCopyShareLink = async () => {
    setCopySuccess(false);
    setCopyError(null);

    try {
      // Create short link
      const shortCode = await createShortLink.mutateAsync(photo.id);

      // Build the share URL
      const shareUrl = `${window.location.origin}/#s=${shortCode}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);

      // Show success message
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (error: any) {
      console.error('Failed to copy share link:', error);
      setCopyError(error.message || 'Failed to copy link. Please try again.');
      setTimeout(() => setCopyError(null), 5000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 border-border/60">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl">{photo.name}</DialogTitle>
            </DialogHeader>

            {/* Image */}
            <div className="rounded-lg overflow-hidden bg-muted/40 mb-6 border border-border/40">
              <img
                src={imageUrl}
                alt={photo.name}
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            </div>

            {/* Metadata */}
            <div className="space-y-3 text-sm mb-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  Uploaded on{' '}
                  {uploadDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  at {uploadDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <FileImage className="w-4 h-4" />
                <span>{photo.contentType}</span>
              </div>
            </div>

            {/* Share Link Section - Only show if user can upload (is admin) */}
            {canUpload && (
              <div className="border-t border-border/40 pt-4">
                <Button
                  onClick={handleCopyShareLink}
                  disabled={createShortLink.isPending}
                  variant="outline"
                  className="w-full gap-2"
                >
                  {copySuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      Link copied to clipboard
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      {createShortLink.isPending ? 'Creating share link...' : 'Copy share link'}
                    </>
                  )}
                </Button>

                {/* Success/Error Messages */}
                {copySuccess && (
                  <Alert className="mt-3 border-green-500/50 bg-green-500/10">
                    <AlertDescription className="text-green-700 dark:text-green-300">
                      Share link copied! Anyone with this link can view this photo.
                    </AlertDescription>
                  </Alert>
                )}

                {copyError && (
                  <Alert className="mt-3 border-destructive/50 bg-destructive/10">
                    <AlertDescription className="text-destructive">
                      {copyError}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
