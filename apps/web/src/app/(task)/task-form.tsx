'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { taskCreateSchema } from '@repo/api/src/app/task/routes/task.schema';
import { useForm } from '@tanstack/react-form';
import { Loader2, Plus } from 'lucide-react';
import { useTaskMutations } from './use-task-mutations';

export function TaskForm() {
  const { addTask } = useTaskMutations();

  const form = useForm({
    defaultValues: {
      title: '',
    },
    validators: {
      onChange: taskCreateSchema,
    },
    onSubmit: ({ value }) => {
      addTask.mutate(value, { onSuccess: () => form.reset() });
    },
  });

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <div className="flex gap-2">
        <form.Field name="title">
          {(field) => (
            <div className="flex-1">
              <Input
                id={field.name}
                name={field.name}
                placeholder="Add a task..."
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              <div className="min-h-[20px] mt-1">
                {field.state.meta.errors?.[0] ? (
                  <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Enter a task title to add to your list
                  </p>
                )}
              </div>
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || addTask.isPending}
              className="shrink-0"
            >
              {addTask.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Add Task
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
