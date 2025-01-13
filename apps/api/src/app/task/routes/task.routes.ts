import { createRoute, z } from '@hono/zod-openapi';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createMessageObjectSchema } from 'stoker/openapi/schemas';
import getParamsSchema from 'stoker/openapi/schemas/get-params-schema';
import { taskCreateSchema, taskResponseSchema, taskUpdateSchema } from './task.schema';

const tags = ['Tasks'];

export const taskRoutes = {
  list: createRoute({
    path: '/tasks',
    method: 'get',
    tags,
    responses: {
      [200]: jsonContent(z.array(taskResponseSchema), 'List of tasks'),
    },
  }),

  create: createRoute({
    path: '/tasks',
    method: 'post',
    tags,
    request: {
      body: jsonContentRequired(taskCreateSchema, 'Task to create'),
    },
    responses: {
      [201]: jsonContent(taskResponseSchema, 'Created task'),
      [400]: jsonContent(
        createMessageObjectSchema('Maximum number of tasks (10) reached'),
        'Task limit exceeded',
      ),
    },
  }),

  update: createRoute({
    path: '/tasks/{id}',
    method: 'patch',
    tags,
    request: {
      params: getParamsSchema({
        name: 'id',
        validator: 'cuid2',
      }),
      body: jsonContentRequired(taskUpdateSchema, 'Task updates'),
    },
    responses: {
      [200]: jsonContent(taskResponseSchema, 'Updated task'),
      [404]: jsonContent(createMessageObjectSchema('Task not found'), 'Task not found'),
    },
  }),

  delete: createRoute({
    path: '/tasks/{id}',
    method: 'delete',
    tags,
    request: {
      params: getParamsSchema({
        name: 'id',
        validator: 'cuid2',
      }),
    },
    responses: {
      [204]: {
        description: 'Deleted task successfully',
      },
      [404]: jsonContent(createMessageObjectSchema('Task not found'), 'Task not found'),
    },
  }),
};

export type ListRoute = typeof taskRoutes.list;
export type CreateRoute = typeof taskRoutes.create;
export type UpdateRoute = typeof taskRoutes.update;
export type DeleteRoute = typeof taskRoutes.delete;
