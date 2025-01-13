'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import type { Task } from './types';
import { useTaskMutations } from './use-task-mutations';

type TaskItemProps = {
  task: Task;
};

export function TaskItem({ task }: TaskItemProps) {
  const { toggleTask, deleteTask } = useTaskMutations();
  const isCompleted = toggleTask.isPending ? toggleTask.variables?.completed : task.completed;

  return (
    <div className="flex items-center gap-2 group rounded-lg border bg-card p-4">
      <div className="flex gap-2 flex-1 min-w-0">
        <Checkbox
          id={task.id}
          checked={isCompleted}
          disabled={toggleTask.isPending}
          onCheckedChange={(checked) => {
            if (typeof checked === 'boolean') {
              toggleTask.mutate({
                id: task.id,
                completed: checked,
              });
            }
          }}
        />
        <Label
          htmlFor={task.id}
          className={cn(
            'text-sm break-words block',
            isCompleted ? 'text-muted-foreground line-through' : 'font-medium',
          )}
        >
          {task.title}
        </Label>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        disabled={deleteTask.isPending}
        onClick={() => deleteTask.mutate(task.id)}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
