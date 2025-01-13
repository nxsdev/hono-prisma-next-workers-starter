import { defineTaskFactory } from '@/../prisma/src/__generated__/fabbrica';
import tasks from '@/app/task/routes/task.index';
import { setupTestApp } from '@/lib/test-utils';
import { describe, expect, it } from 'vitest';

describe('TaskUpdateHandler', () => {
  const { client } = setupTestApp(tasks);
  const TaskFactory = defineTaskFactory();

  describe('タスク更新', () => {
    it('正常に更新できる', async () => {
      const task = await TaskFactory.create();

      const res = await client.tasks[':id'].$patch({
        param: { id: task.id },
        json: {
          title: '更新後のタイトル',
          completed: true,
        },
      });

      expect(res.status).toBe(200);
      expect(await res.json()).toMatchObject({
        title: '更新後のタイトル',
        completed: true,
      });
    });

    it('存在しないタスクの場合はエラー', async () => {
      const res = await client.tasks[':id'].$patch({
        param: { id: 'qz3bpv7vhux2ud3wgr2gv6kh' },
        json: {
          title: '更新後のタイトル',
          completed: true,
        },
      });

      expect(res.status).toBe(404);
    });
  });
});
