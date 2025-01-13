import { defineTaskFactory } from '@/../prisma/src/__generated__/fabbrica';
import tasks from '@/app/task/routes/task.index';
import { setupTestApp } from '@/lib/test-utils';
import { describe, expect, it } from 'vitest';

describe('TaskCreateHandler', () => {
  const { client } = setupTestApp(tasks);
  const TaskFactory = defineTaskFactory();

  describe('基本的なTask作成', () => {
    it('正常に作成できる', async () => {
      const res = await client.tasks.$post({
        json: {
          title: 'テストTask',
        },
      });

      expect(res.status).toBe(201);
    });

    it('説明を省略して作成できる', async () => {
      const res = await client.tasks.$post({
        json: {
          title: 'テストTask',
        },
      });

      expect(res.status).toBe(201);
    });
  });

  describe('バリデーション', () => {
    it('タイトルが未指定の場合はエラー', async () => {
      const res = await client.tasks.$post({
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        json: {} as any,
      });

      expect(res.status).toBe(422);
    });
  });

  describe('上限チェック', () => {
    it('Task数が上限に達している場合はエラー', async () => {
      await TaskFactory.createList(10);

      const res = await client.tasks.$post({
        json: { title: 'テストTask' },
      });

      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({
        message: 'Maximum number of tasks (10) reached',
      });
    });

    it('Task数が上限未満の場合は作成できる', async () => {
      await TaskFactory.createList(9);

      const res = await client.tasks.$post({
        json: { title: 'テストTask' },
      });

      expect(res.status).toBe(201);
    });
  });
});
