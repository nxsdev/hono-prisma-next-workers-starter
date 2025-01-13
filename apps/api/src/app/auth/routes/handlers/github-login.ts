import { createGitHubAuth } from '@/app/auth/oauth/providers/github';
import type { AppRouteHandler } from '@/lib/types';
import { generateState } from 'arctic';
import { setCookie } from 'hono/cookie';
import type { GithubLoginRoute } from '../auth.routes';

export const githubLoginHandler: AppRouteHandler<GithubLoginRoute> = async (c) => {
  const github = createGitHubAuth(c.env);
  const state = generateState();
  const url = await github.createAuthorizationURL(state, ['read:user', 'user:email']);

  setCookie(c, 'github_oauth_state', state, {
    path: '/',
    secure: c.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'Lax',
  });

  return c.redirect(url.toString());
};
