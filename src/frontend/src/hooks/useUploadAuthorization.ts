import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useUploadAuthorization() {
  const { actor, isFetching: isActorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['uploadAuthorization', actor ? 'authenticated' : 'anonymous'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.canUpload();
    },
    enabled: !!actor && !isActorFetching,
    retry: false,
  });

  return {
    ...query,
    canUpload: query.data ?? false,
    isLoading: isActorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}
