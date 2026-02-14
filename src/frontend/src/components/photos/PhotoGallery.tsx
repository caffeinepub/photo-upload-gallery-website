import { useListPhotos } from '../../hooks/usePhotos';
import type { PhotoMetadata } from '../../backend';
import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { AlertCircle, ImageOff } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface PhotoGalleryProps {
  onPhotoClick: (photo: PhotoMetadata) => void;
}

export function PhotoGallery({ onPhotoClick }: PhotoGalleryProps) {
  const { data: photos, isLoading, isError, error } = useListPhotos();

  // Loading State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border-border/50">
            <Skeleton className="w-full aspect-square" />
          </Card>
        ))}
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error?.message || 'Failed to load photos. Please try again later.'}
        </AlertDescription>
      </Alert>
    );
  }

  // Empty State
  if (!photos || photos.length === 0) {
    return (
      <Card className="p-12 border-border/50 bg-card/60">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-muted/60 flex items-center justify-center">
            <ImageOff className="w-10 h-10 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">No photos yet</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Upload your first photo to start building your gallery. Your memories are waiting to be preserved!
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Gallery Grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <PhotoTile key={photo.id} photo={photo} onClick={() => onPhotoClick(photo)} />
      ))}
    </div>
  );
}

interface PhotoTileProps {
  photo: PhotoMetadata;
  onClick: () => void;
}

function PhotoTile({ photo, onClick }: PhotoTileProps) {
  const imageUrl = photo.blob.getDirectURL();

  return (
    <Card
      className="group overflow-hidden cursor-pointer transition-all hover:shadow-warm hover:scale-[1.02] active:scale-[0.98] border-border/50"
      onClick={onClick}
    >
      <div className="relative aspect-square bg-muted/50">
        <img
          src={imageUrl}
          alt={photo.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white text-sm font-medium truncate">{photo.name}</p>
            <p className="text-white/80 text-xs">
              {new Date(Number(photo.timestamp)).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
