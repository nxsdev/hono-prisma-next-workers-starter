import type { AppRouteHandler } from '@/lib/types';
import type { CreateRoute } from '../task.routes';

export const taskCreateHandler: AppRouteHandler<CreateRoute> = async (c) => {
  const prisma = c.get('prisma');
  const data = c.req.valid('json');

  const count = await prisma.task.count();
  if (count >= 10) {
    return c.json({ message: 'Maximum number of tasks (10) reached' }, 400);
  }

  const task = await prisma.task.create({
    data: {
      title: data.title,
      completed: false,
    },
  });

  return c.json(task, 201);
};
