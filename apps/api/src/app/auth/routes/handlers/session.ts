import type { AppRouteHandler } from '@/lib/types';
import type { SessionRoute } from '../auth.routes';

export const sessionHandler: AppRouteHandler<SessionRoute> = async (c) => {
  const user = c.get('user');

  return c.json({
    user: user
      ? {
          id: user.id,
          username: user.username,
          avatarUrl: user.avatarUrl,
        }
      : null,
  });
};
