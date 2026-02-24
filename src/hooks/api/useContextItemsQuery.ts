import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contextApi } from '@/services/api';
import { USE_MOCK_DATA } from '@/config/api';
import type { ContextItemRequest } from '@/services/api/types';

export function useContextItemsQuery() {
  return useQuery({
    queryKey: ['contextItems'],
    queryFn: () => contextApi.fetchContextItems(),
    enabled: !USE_MOCK_DATA,
    staleTime: 30_000,
  });
}

export function useAddContextMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: ContextItemRequest) => contextApi.addContextItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contextItems'] });
    },
  });
}
