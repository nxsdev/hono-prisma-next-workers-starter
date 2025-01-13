import { createRouter } from '@/lib/create-app';
import { authRoutes } from './auth.routes';
import { githubCallbackHandler } from './handlers/github-callback';
import { githubLoginHandler } from './handlers/github-login';
import { logoutHandler } from './handlers/logout';
import { sessionHandler } from './handlers/session';

const router = createRouter()
  .openapi(authRoutes.githubLogin, githubLoginHandler)
  .openapi(authRoutes.githubCallback, githubCallbackHandler)
  .openapi(authRoutes.logout, logoutHandler)
  .openapi(authRoutes.session, sessionHandler);

export default router;
