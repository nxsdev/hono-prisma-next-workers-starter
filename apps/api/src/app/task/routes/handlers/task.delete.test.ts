import { defineTaskFactory } from '@/../prisma/src/__generated__/fabbrica';
import tasks from '@/app/task/routes/task.index';
import { setupTestApp } from '@/lib/test-utils';
import { describe, expect, it, vi } from 'vitest';

describe('TaskDeleteHandler', () => {
  const { client } = setupTestApp(tasks);
  const TaskFactory = defineTaskFactory();

  describe('タスク削除', () => {
    it('正常に削除できる', async () => {
      const task = await TaskFactory.create();

      const res = await client.tasks[':id'].$delete({
        param: { id: task.id },
      });

      expect(res.status).toBe(204);
    });

    it('存在しないタスクの場合はエラー', async () => {
      const res = await client.tasks[':id'].$delete({
        param: { id: 'qz3bpv7vhux2ud3wgr2gv6kh' },
      });

      expect(res.status).toBe(404);
    });
  });
});
