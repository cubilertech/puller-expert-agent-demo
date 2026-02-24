import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/services/api';
import { USE_MOCK_DATA } from '@/config/api';

export function useTasksQuery() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => tasksApi.fetchTasks(),
    enabled: !USE_MOCK_DATA,
    staleTime: 30_000,
  });
}

export function useTaskDataQuery(taskId: string | null) {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () => tasksApi.fetchTaskById(taskId!),
    enabled: !USE_MOCK_DATA && !!taskId,
    staleTime: 60_000,
  });
}

export function useSendToRequestorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      message,
      assumptions,
    }: {
      id: string;
      message: string;
      assumptions: { id: string; text: string; includeInMessage: boolean }[];
    }) => tasksApi.sendToRequestor(id, message, assumptions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
