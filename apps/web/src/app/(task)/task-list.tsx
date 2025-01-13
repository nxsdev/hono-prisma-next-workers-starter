'use client';

import { client } from '@/lib/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { TaskItem } from './task-item';
import type { Task } from './types';

export function TaskList() {
  const { data: tasks } = useSuspenseQuery<Task[]>({
    queryKey: ['tasks'] as const,
    queryFn: () => client.tasks.$get().then((res) => res.json()),
  });

  return (
    <div className="mt-6">
      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
            />
          ))
        ) : (
          <div className="text-center text-gray-500">Task is empty</div>
        )}
      </div>
    </div>
  );
}
