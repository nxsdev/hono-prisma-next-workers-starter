import type { AppRouteHandler } from '@/lib/types';
import type { DeleteRoute } from '../task.routes';

export const taskDeleteHandler: AppRouteHandler<DeleteRoute> = async (c) => {
  const prisma = c.get('prisma');
  const { id } = c.req.valid('param');

  const task = await prisma.task.delete({ where: { id } });
  if (!task) {
    return c.json({ message: 'Task not found' }, 404);
  }

  return c.body(null, 204);
};
