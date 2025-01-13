import { client } from '@/lib/client';
import type { CreateTaskInput } from '@repo/api/src/app/task/routes/task.schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { APIError } from '../../../lib/error';

export function useTaskMutations() {
  const queryClient = useQueryClient();

  const addTask = useMutation({
    mutationFn: async (data: CreateTaskInput) => {
      const res = await client.tasks.$post({
        json: data,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task added successfully');
    },
    onError: (error: unknown) => {
      if (error instanceof APIError && error.status === 400) {
        toast.error('Maximum number of tasks (10) reached', {
          description: 'Please complete or delete existing tasks before adding new ones',
        });
      } else {
        toast.error('An unexpected error occurred');
      }
    },
  });

  const toggleTask = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const res = await client.tasks[':id'].$patch({
        param: { id },
        json: { completed },
      });
      return res.json();
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      await client.tasks[':id'].$delete({
        param: { id },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete task');
    },
  });

  return {
    addTask,
    toggleTask,
    deleteTask,
  };
}
