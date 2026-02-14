import { useMutation, useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PhotoMetadata } from '../backend';

/**
 * Generate a short code for a photo ID.
 * Uses a simple base62 encoding of timestamp + random suffix for uniqueness.
 */
function generateShortCode(): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const timestamp = Date.now();
  let code = '';
  
  // Encode timestamp in base62 (shorter representation)
  let num = timestamp;
  while (num > 0) {
    code = chars[num % 62] + code;
    num = Math.floor(num / 62);
  }
  
  // Add 3 random characters for uniqueness
  for (let i = 0; i < 3; i++) {
    code += chars[Math.floor(Math.random() * 62)];
  }
  
  return code;
}

/**
 * Hook to create a short link for a photo (admin-only).
 * Returns a mutation that generates a short code and registers it with the backend.
 */
export function useCreateShortLink() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (photoId: string): Promise<string> => {
      if (!actor) {
        throw new Error('Backend connection not available');
      }

      // Generate a unique short code
      const shortCode = generateShortCode();

      try {
        // Register the short link with the backend
        await actor.addShortLink(photoId, shortCode);
        return shortCode;
      } catch (error: any) {
        // Handle authorization errors with user-friendly messages
        if (error.message?.includes('Unauthorized')) {
          throw new Error('You do not have permission to create share links');
        }
        if (error.message?.includes('does not exist')) {
          throw new Error('Photo not found');
        }
        throw new Error('Failed to create share link. Please try again.');
      }
    },
  });
}

/**
 * Hook to resolve a short code to a photo (public, no auth required).
 * Uses the anonymous actor to allow unauthenticated access.
 */
export function useResolveShortLink(shortCode: string | null) {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<PhotoMetadata | null>({
    queryKey: ['shortLink', shortCode],
    queryFn: async () => {
      if (!actor || !shortCode) return null;

      try {
        // Use the public query method to resolve the short code
        const photo = await actor.getPhotoByShortCode(shortCode);
        return photo || null;
      } catch (error) {
        console.error('Failed to resolve short link:', error);
        return null;
      }
    },
    enabled: !!actor && !isActorFetching && !!shortCode,
    retry: false,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
