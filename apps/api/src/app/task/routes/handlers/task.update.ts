import type { AppRouteHandler } from '@/lib/types';
import type { UpdateRoute } from '../task.routes';

export const taskUpdateHandler: AppRouteHandler<UpdateRoute> = async (c) => {
  const prisma = c.get('prisma');
  const { id } = c.req.valid('param');
  const data = c.req.valid('json');

  // データがない場合PrismaClientKnownRequestError code: P2025が発生し、onErrorで404を返す
  const task = await prisma.task.update({
    where: { id },
    data,
  });

  return c.json(task, 200);
};
