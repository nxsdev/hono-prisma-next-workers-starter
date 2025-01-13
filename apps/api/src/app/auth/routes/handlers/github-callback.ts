import { createGitHubAuth } from '@/app/auth/oauth/providers/github';
import { setSessionTokenCookie } from '@/app/auth/session/cookies';
import { createSession, generateSessionToken } from '@/app/auth/session/session';
import type { AppRouteHandler } from '@/lib/types';
import { OAuth2RequestError } from 'arctic';
import { getCookie } from 'hono/cookie';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import type { GithubCallbackRoute } from '../auth.routes';

interface GitHubUser {
  id: string;
  login: string;
  email: string | null;
  avatar_url: string;
}

export const githubCallbackHandler: AppRouteHandler<GithubCallbackRoute> = async (c) => {
  const prisma = c.get('prisma');
  const { code, state } = c.req.valid('query');
  const storedState = getCookie(c, 'github_oauth_state');

  if (!storedState || state !== storedState) {
    return c.json({ message: 'Invalid state' }, HttpStatusCodes.BAD_REQUEST);
  }

  try {
    const github = createGitHubAuth(c.env);
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });

    const githubUser: GitHubUser = await githubUserResponse.json();
    const existingUser = await prisma.user.findFirst({
      where: {
        oauthAccount: {
          some: {
            provider: 'github',
            providerUserId: githubUser.id,
          },
        },
      },
    });

    if (existingUser) {
      const token = generateSessionToken();
      await createSession(prisma, token, existingUser.id);
      setSessionTokenCookie(c, token);
      return c.redirect('/');
    }

    const user = await prisma.user.create({
      data: {
        username: githubUser.login,
        email: githubUser.email,
        avatarUrl: githubUser.avatar_url,
        oauthAccount: {
          create: {
            provider: 'github',
            providerUserId: githubUser.id,
          },
        },
      },
    });

    const token = generateSessionToken();
    await createSession(prisma, token, user.id);
    setSessionTokenCookie(c, token);
    return c.redirect('/');
  } catch (e) {
    if (e instanceof OAuth2RequestError && e.message === 'bad_verification_code') {
      return c.json({ message: 'Invalid verification code' }, HttpStatusCodes.BAD_REQUEST);
    }
    throw e;
  }
};
