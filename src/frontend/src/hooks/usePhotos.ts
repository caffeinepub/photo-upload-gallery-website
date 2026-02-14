import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PhotoMetadata } from '../backend';
import { ExternalBlob } from '../backend';

const PHOTOS_QUERY_KEY = ['photos'];

// Validation helpers
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please select a valid image file (JPEG, PNG, WebP, or GIF)',
    };
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image size must be less than 10MB',
    };
  }

  return { valid: true };
}

export async function fileToBytes(file: File): Promise<Uint8Array<ArrayBuffer>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      // Create a new Uint8Array with ArrayBuffer type
      const uint8Array = new Uint8Array(arrayBuffer) as Uint8Array<ArrayBuffer>;
      resolve(uint8Array);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

// React Query hooks
export function useListPhotos() {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<PhotoMetadata[]>({
    queryKey: PHOTOS_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      const photos = await actor.listPhotos();
      // Sort by timestamp descending (newest first)
      return photos.sort((a, b) => Number(b.timestamp - a.timestamp));
    },
    enabled: !!actor && !isActorFetching,
  });
}

export function useUploadPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      onProgress,
    }: {
      file: File;
      onProgress?: (percentage: number) => void;
    }) => {
      if (!actor) {
        throw new Error('Backend connection not available. Please try again.');
      }

      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Convert file to bytes
      const bytes = await fileToBytes(file);

      // Create ExternalBlob with progress tracking
      let blob = ExternalBlob.fromBytes(bytes);
      if (onProgress) {
        blob = blob.withUploadProgress(onProgress);
      }

      // Generate unique ID
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const timestamp = BigInt(Date.now());

      // Upload to backend
      await actor.addPhoto(id, file.name, file.type, timestamp, blob);

      return { id, name: file.name };
    },
    onSuccess: () => {
      // Invalidate and refetch photos list
      queryClient.invalidateQueries({ queryKey: PHOTOS_QUERY_KEY });
    },
    onError: (error: Error) => {
      console.error('Upload failed:', error);
    },
  });
}
