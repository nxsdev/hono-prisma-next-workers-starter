'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { client } from '@/lib/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { TaskForm } from './task-form';
import { TaskItem } from './task-item';
import type { Task } from './types';

export function TasksContainer() {
  const { data: tasks } = useSuspenseQuery<Task[]>({
    queryKey: ['tasks'] as const,
    queryFn: () => client.tasks.$get().then((res) => res.json()),
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Todo List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-6">
          <div className="max-w-3xl mx-auto">
            <TaskForm />
            <div className="mt-6 space-y-4">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
