import { z } from '@hono/zod-openapi';

export const taskResponseSchema = z
  .object({
    id: z.string().cuid2().openapi({
      example: 'ckxj2q9js0000qepn8zvy6c5l',
    }),
    title: z.string().min(1).openapi({
      example: '買い物をする',
    }),
    completed: z.boolean().openapi({
      example: false,
    }),
    createdAt: z.string().datetime().openapi({
      example: '2024-01-01T12:00:00.000Z',
    }),
    updatedAt: z.string().datetime().openapi({
      example: '2024-01-01T12:00:00.000Z',
    }),
  })
  .openapi('Task');

export const taskCreateSchema = z
  .object({
    title: z.string().min(1).max(20).openapi({
      example: 'プロジェクトを完了する',
    }),
  })
  .openapi('CreateTask');

export const taskUpdateSchema = z
  .object({
    title: z.string().min(1).optional().openapi({
      example: 'プロジェクトタイトルの更新',
    }),
    completed: z.boolean().optional().openapi({
      example: true,
    }),
  })
  .openapi('UpdateTask');

export type CreateTaskInput = z.infer<typeof taskCreateSchema>;
export type UpdateTaskInput = z.infer<typeof taskUpdateSchema>;
