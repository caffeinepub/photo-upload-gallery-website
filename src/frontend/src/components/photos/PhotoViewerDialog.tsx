import type { PhotoMetadata } from '../../backend';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Calendar, FileImage } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface PhotoViewerDialogProps {
  photo: PhotoMetadata | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PhotoViewerDialog({ photo, open, onOpenChange }: PhotoViewerDialogProps) {
  if (!photo) return null;

  const imageUrl = photo.blob.getDirectURL();
  const uploadDate = new Date(Number(photo.timestamp));

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
            <div className="space-y-3 text-sm">
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
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
