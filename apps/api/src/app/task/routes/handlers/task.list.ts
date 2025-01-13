import type { AppRouteHandler } from '@/lib/types';
import type { ListRoute } from '../task.routes';

export const taskListHandler: AppRouteHandler<ListRoute> = async (c) => {
  const prisma = c.get('prisma');
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: 'asc' },
  });

  return c.json(tasks, 200);
};
