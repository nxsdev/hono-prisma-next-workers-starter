import { defineTaskFactory } from '@/../prisma/src/__generated__/fabbrica';
import tasks from '@/app/task/routes/task.index';
import { setupTestApp } from '@/lib/test-utils';
import { describe, expect, it } from 'vitest';

describe('TaskListHandler', () => {
  const { client } = setupTestApp(tasks);
  const TaskFactory = defineTaskFactory();

  describe('タスク一覧取得', () => {
    it('空の配列を取得できる', async () => {
      const res = await client.tasks.$get();

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual([]);
    });

    it('作成済みのタスクを取得できる', async () => {
      await TaskFactory.createList(3);

      const res = await client.tasks.$get();

      expect(res.status).toBe(200);
      expect(await res.json()).toHaveLength(3);
    });
  });
});
