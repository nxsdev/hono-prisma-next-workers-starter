import type { AppBindings } from '@/lib/types';
import type { Context } from 'hono';
import { setCookie } from 'hono/cookie';

export function getCookieConfig(c: Context<AppBindings>) {
  return {
    httpOnly: true,
    secure: c.env.NODE_ENV === 'production',
    sameSite: 'Lax' as const,
    path: '/',
  };
}

export function setOAuthStateCookie(c: Context<AppBindings>, provider: string, state: string) {
  setCookie(c, `${provider}_oauth_state`, state, {
    ...getCookieConfig(c),
    maxAge: 60 * 10, // 10分
  });
}

export function setSessionTokenCookie(c: Context<AppBindings>, token: string) {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  setCookie(c, 'session', token, {
    ...getCookieConfig(c),
    expires: expiresAt,
  });
}

export function deleteSessionTokenCookie(c: Context<AppBindings>) {
  setCookie(c, 'session', '', {
    ...getCookieConfig(c),
    maxAge: 0,
  });
}
