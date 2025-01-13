import { createRouter } from '@/lib/create-app';
import { taskCreateHandler } from './handlers/task.create';
import { taskDeleteHandler } from './handlers/task.delete';
import { taskListHandler } from './handlers/task.list';
import { taskUpdateHandler } from './handlers/task.update';
import { taskRoutes } from './task.routes';

const router = createRouter()
  .openapi(taskRoutes.list, taskListHandler)
  .openapi(taskRoutes.create, taskCreateHandler)
  .openapi(taskRoutes.update, taskUpdateHandler)
  .openapi(taskRoutes.delete, taskDeleteHandler);

export default router;
