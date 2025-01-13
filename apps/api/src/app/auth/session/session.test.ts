import { defineUserFactory, initialize } from '@/../prisma/src/__generated__/fabbrica';
import { createPrismaMockClient } from '@/lib/prisma';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  createSession,
  generateSessionToken,
  invalidateSession,
  validateSessionToken,
} from './session';

describe('session', () => {
  const prisma = createPrismaMockClient();
  const UserFactory = defineUserFactory({
    defaultData: {
      username: 'test-user',
    },
  });

  initialize({ prisma });
  beforeEach(() => prisma.reset());

  describe('セッショントークン生成', () => {
    it('一意のトークンを生成できる', () => {
      const token1 = generateSessionToken();
      const token2 = generateSessionToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe('セッション作成', () => {
    it('トークンでセッションを作成できる', async () => {
      const user = await UserFactory.create();
      const token = generateSessionToken();

      const session = await createSession(prisma, token, user.id);

      expect(session.userId).toBe(user.id);
      expect(session.expiresAt).toBeInstanceOf(Date);
    });
  });

  describe('セッショントークン検証', () => {
    it('既存のセッショントークンを検証できる', async () => {
      const user = await UserFactory.create();
      const token = generateSessionToken();
      await createSession(prisma, token, user.id);

      const result = await validateSessionToken(prisma, token);

      expect(result.session).not.toBeNull();
      expect(result.user?.id).toBe(user.id);
    });

    it('無効なトークンの場合はnullを返す', async () => {
      const result = await validateSessionToken(prisma, '無効なトークン');
      expect(result.session).toBeNull();
      expect(result.user).toBeNull();
    });

    it('有効期限が近い場合は延長する', async () => {
      const user = await UserFactory.create();
      const token = generateSessionToken();
      const session = await createSession(prisma, token, user.id);

      // 有効期限を近い将来に設定
      await prisma.session.update({
        where: { id: session.id },
        data: { expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10) },
      });

      await validateSessionToken(prisma, token);

      const updatedSession = await prisma.session.findUnique({
        where: { id: session.id },
      });
      expect(updatedSession?.expiresAt.getTime()).toBeGreaterThan(
        Date.now() + 1000 * 60 * 60 * 24 * 25,
      );
    });
  });

  describe('セッション無効化', () => {
    it('セッションを削除できる', async () => {
      const user = await UserFactory.create();
      const token = generateSessionToken();
      const session = await createSession(prisma, token, user.id);

      await invalidateSession(prisma, session.id);

      const deletedSession = await prisma.session.findUnique({
        where: { id: session.id },
      });
      expect(deletedSession).toBeNull();
    });
  });
});
