import { initialize } from '@/../prisma/src/__generated__/fabbrica';
import { createTestApp } from '@/lib/create-app';
import { createPrismaMockClient } from '@/lib/prisma';
// @/lib/test-utils.ts
import type { AppBindings } from '@/lib/types';
import type { AppOpenAPI } from '@/lib/types';
import { testClient } from 'hono/testing';
import { beforeEach } from 'vitest';

export const defaultTestEnv = {
  NODE_ENV: 'development',
};

export type TestSetupOptions = {
  env?: Partial<AppBindings['Bindings']>;
};

export const setupTestApp = <R extends AppOpenAPI>(routes: R, options: TestSetupOptions = {}) => {
  const prisma = createPrismaMockClient();
  const env = { ...defaultTestEnv, ...options.env };
  const app = createTestApp(routes, prisma, env);
  const client = testClient(app);

  initialize({ prisma });
  beforeEach(() => prisma.reset());

  return {
    prisma,
    app,
    client,
  };
};
