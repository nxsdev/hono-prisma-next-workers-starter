import type { AppBindings } from '@/lib/types';
import type { Context } from 'hono';
import { setCookie } from 'hono/cookie';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  deleteSessionTokenCookie,
  getCookieConfig,
  setOAuthStateCookie,
  setSessionTokenCookie,
} from './cookies';

vi.mock('hono/cookie', () => ({
  setCookie: vi.fn(),
}));

describe('cookies', () => {
  // 共通のモックコンテキスト
  const mockContext = {
    env: {
      NODE_ENV: 'development',
    },
  } as Context<AppBindings>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCookieConfig', () => {
    it('開発環境用の設定を返す', () => {
      const config = getCookieConfig(mockContext);
      expect(config).toEqual({
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        path: '/',
      });
    });

    it('本番環境用の設定を返す', () => {
      const prodContext = {
        env: {
          NODE_ENV: 'production',
        },
      } as Context<AppBindings>;

      const config = getCookieConfig(prodContext);
      expect(config).toEqual({
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
        path: '/',
      });
    });
  });

  describe('setSessionTokenCookie', () => {
    it('セッショントークンを適切な設定でCookieに保存', () => {
      const token = 'test-token';
      setSessionTokenCookie(mockContext, token);

      expect(setCookie).toHaveBeenCalledWith(
        mockContext,
        'session',
        token,
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'Lax',
          path: '/',
          expires: expect.any(Date),
        }),
      );
    });
  });

  describe('setOAuthStateCookie', () => {
    it('OAuthのstate値を適切な設定でCookieに保存', () => {
      const provider = 'github';
      const state = 'random-state';
      setOAuthStateCookie(mockContext, provider, state);

      expect(setCookie).toHaveBeenCalledWith(
        mockContext,
        'github_oauth_state',
        state,
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'Lax',
          path: '/',
          maxAge: 600, // 10分
        }),
      );
    });
  });

  describe('deleteSessionTokenCookie', () => {
    it('セッションCookieを削除する設定で上書き', () => {
      deleteSessionTokenCookie(mockContext);

      expect(setCookie).toHaveBeenCalledWith(
        mockContext,
        'session',
        '',
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'Lax',
          path: '/',
          maxAge: 0,
        }),
      );
    });
  });
});
