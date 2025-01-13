import { handleError } from '@/middleware/handle-error';
import { prismaMiddleware } from '@/middleware/prisma';
import { OpenAPIHono } from '@hono/zod-openapi';
import type { PrismaClient } from '@prisma/client';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { requestId } from 'hono/request-id';
import { notFound, serveEmojiFavicon } from 'stoker/middlewares';
import { defaultHook } from 'stoker/openapi';
import type { AppBindings, AppOpenAPI } from './types';

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

function configureApp(prisma?: PrismaClient) {
  const app = createRouter();
  app.use('*', requestId());
  app.use(logger());
  app.use(prismaMiddleware(prisma));
  app.use(prettyJSON());
  app.use(serveEmojiFavicon('📝'));
  app.notFound(notFound);
  app.onError(handleError);
  return app;
}

export default function createApp() {
  return configureApp();
}

export function createTestApp<R extends AppOpenAPI>(
  router: R,
  prisma?: PrismaClient,
  testEnv?: Partial<AppBindings['Bindings']>,
) {
  const app = configureApp(prisma);

  app.use('*', async (c, next) => {
    if (testEnv) {
      // @ts-ignore
      c.env = testEnv;
    }
    await next();
  });

  return app.route('/', router) as R;
}
