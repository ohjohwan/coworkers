import { getTaskPriority } from '@/services/TaskPriority.API';
import useUserStore from '@/stores/userStore';
import getMonthDay from '@/utils/getMonthDay';
import { useQuery } from '@tanstack/react-query';

function useTaskPriority(groupId: number, taskListId: number, date: string) {
  const { user } = useUserStore();

  const { data, isLoading, refetch, isError, error } = useQuery({
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    queryKey: ['getPriorityTasks', groupId, taskListId, date, user?.id!],
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    queryFn: () => getTaskPriority(groupId, taskListId, date, user?.id!),
    enabled: !Number.isNaN(groupId) && !Number.isNaN(taskListId),
  });

  return {
    priorityTasks: data?.priorityTasks,
    priorityTasksSize: data?.size,
    isLoading,
    refetch,
    isError,
    error,
  };
}

export default useTaskPriority;
