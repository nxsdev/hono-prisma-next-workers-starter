import { deleteSessionTokenCookie } from '@/app/auth/session/cookies';
import { invalidateSession } from '@/app/auth/session/session';
import type { AppRouteHandler } from '@/lib/types';
import type { LogoutRoute } from '../auth.routes';

export const logoutHandler: AppRouteHandler<LogoutRoute> = async (c) => {
  const prisma = c.get('prisma');
  const session = c.get('session');
  if (!session) {
    return c.redirect('/');
  }

  await invalidateSession(prisma, session.id);
  deleteSessionTokenCookie(c);
  return c.redirect('/');
};
