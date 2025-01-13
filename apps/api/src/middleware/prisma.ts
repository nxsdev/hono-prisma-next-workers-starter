import { createPrismaClient } from '@/lib/prisma';
import type { PrismaClient } from '@prisma/client';
import { createMiddleware } from 'hono/factory';

/**
 * Prismaクライアントを設定するミドルウェア
 *
 * @param clientOrUrl - Prismaクライアント、データベースURL、または未指定（env.DATABASE_URLを使用）
 * @returns Honoミドルウェア
 *
 * @example
 * app.use('*', prismaMiddleware()) // 環境変数から
 * app.use('*', prismaMiddleware('postgresql://...')) // URLから
 * app.use('*', prismaMiddleware(client)) // 既存のクライアント
 */
export const prismaMiddleware = (clientOrUrl?: PrismaClient | string) => {
  return createMiddleware(async (c, next) => {
    const prisma =
      typeof clientOrUrl === 'string'
        ? createPrismaClient(clientOrUrl)
        : (clientOrUrl ?? createPrismaClient(c.env.DATABASE_URL));

    c.set('prisma', prisma);
    await next();
  });
};
