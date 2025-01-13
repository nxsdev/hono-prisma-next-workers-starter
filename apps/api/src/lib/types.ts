import type { AuthSession, AuthUser } from '@/app/auth/auth.types';
import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { PrismaClient } from '@prisma/client';

export interface AppBindings {
  Bindings: CloudflareEnv;
  Variables: {
    prisma: PrismaClient;
    user: AuthUser | null;
    session: AuthSession | null;
  };
}

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;
