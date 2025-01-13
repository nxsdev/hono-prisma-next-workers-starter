import { createRoute, z } from '@hono/zod-openapi';
import { jsonContent } from 'stoker/openapi/helpers';

const tags = ['Auth'];

export const authRoutes = {
  // GitHub認証関連
  githubLogin: createRoute({
    path: '/auth/github/login',
    method: 'get',
    tags,
    responses: {
      [301]: {
        description: 'Redirect to GitHub OAuth',
      },
    },
  }),

  githubCallback: createRoute({
    path: '/auth/github/callback',
    method: 'get',
    tags,
    request: {
      query: z.object({
        code: z.string(),
        state: z.string(),
      }),
    },
    responses: {
      [301]: {
        description: 'Redirect after successful authentication',
      },
      [400]: {
        description: 'Invalid request parameters',
      },
      [500]: {
        description: 'Server error',
      },
    },
  }),

  // ログアウト
  logout: createRoute({
    path: '/auth/logout',
    method: 'post',
    tags,
    responses: {
      [301]: {
        description: 'Redirect after successful logout',
      },
    },
  }),

  // セッション確認
  session: createRoute({
    path: '/auth/session',
    method: 'get',
    tags,
    responses: {
      [200]: jsonContent(
        z.object({
          user: z
            .object({
              id: z.string().cuid2(),
              username: z.string(),
              avatarUrl: z.string().url().nullable(),
            })
            .nullable(),
        }),
        'Current session information',
      ),
    },
  }),
};

export type GithubLoginRoute = typeof authRoutes.githubLogin;
export type GithubCallbackRoute = typeof authRoutes.githubCallback;
export type LogoutRoute = typeof authRoutes.logout;
export type SessionRoute = typeof authRoutes.session;
